import { gateway } from "@ai-sdk/gateway";
import { geolocation } from "@vercel/functions";
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { unstable_cache } from "next/cache";
import { after } from "next/server";
import type { ResumableStreamContext } from "resumable-stream/ioredis";
import { createResumableStreamContext } from "resumable-stream/ioredis";
import { fetchModels, type ModelCatalog } from "tokenlens";
import { getUsage } from "tokenlens/helpers";
import { v4 as uuidv4 } from "uuid";
import type { ChatModel } from "@/lib/ai/models";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompt";
import { getToken } from "@/lib/auth-server";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";
import { convertToUIMessages } from "@/lib/utils";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { generateTitleFromUserMessage } from "../../actions";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

const getTokenlensCatalog = unstable_cache(
  async (): Promise<ModelCatalog | undefined> => {
    try {
      return await fetchModels();
    } catch (error) {
      console.error("Error fetching tokenlens catalog", error);
      return;
    }
  },
  ["tokenlens-catalog"],
  { revalidate: 3600 }
);

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({ waitUntil: after });
    } catch (error) {
      if (error instanceof Error && error.message.includes("REDIS_URL")) {
        console.warn(
          " > Resumable streams are disabled due to missing REDIS_URL"
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  const token = await getToken();
  if (!token) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: ChatModel["id"];
    } = requestBody;

    const chatId = id as Id<"chats">;

    // Parallelize all initial queries
    const [user, chat, messagesFromDb] = await Promise.all([
      fetchQuery(api.users.getCurrentUser, {}, { token }),
      fetchQuery(api.chats.getChatById, { chatId }, { token }),
      fetchQuery(api.messages.getMessagesByChatId, { chatId }, { token }),
    ]);

    if (!user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }
    if (!chat) {
      return new ChatSDKError("not_found:chat").toResponse();
    }
    if (chat.userId !== user._id) {
      return new ChatSDKError("forbidden:chat").toResponse();
    }

    // Check if this is the first message (for title generation)
    const isFirstMessage = messagesFromDb.length === 0;

    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    await fetchMutation(
      api.messages.saveMessages,
      {
        messages: [
          {
            chatId,
            role: "user",
            parts: message.parts,
            attachments: [],
          },
        ],
      },
      { token }
    );

    const streamId = uuidv4();
    await fetchMutation(
      api.streams.createStream,
      {
        streamId: streamId.toString(),
        chatId,
      },
      { token }
    );

    let finalMergedUsage: AppUsage | undefined;

    const stream = createUIMessageStream({
      execute: ({ writer: datastream }) => {
        const result = streamText({
          model: gateway(selectedChatModel),
          system: systemPrompt({
            selectedChatModel,
            requestHints,
          }),
          messages: convertToModelMessages(uiMessages),
          stopWhen: stepCountIs(5),
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
          },
          onFinish: async ({ usage }) => {
            const writeUsage = (data: AppUsage | typeof usage) => {
              finalMergedUsage = data;
              datastream.write({ type: "data-usage", data: finalMergedUsage });
            };

            try {
              const providers = await getTokenlensCatalog();
              const modelId = gateway(selectedChatModel).modelId;

              if (!(modelId && providers)) {
                writeUsage(usage);
                return;
              }

              const summary = getUsage({ modelId, usage, providers });
              writeUsage({ ...usage, ...summary, modelId } as AppUsage);
            } catch (error) {
              console.warn("TokenLens enrichment failed", error);
              writeUsage(usage);
            }
          },
        });
        result.consumeStream();

        datastream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          })
        );
      },
      generateId: () => uuidv4().toString(),
      onFinish: async ({ messages }) => {
        try {
          const filteredMessages = messages
            .map((msg) => ({
              chatId,
              role: msg.role,
              parts: (msg.parts ?? [])
                .filter((part) => {
                  if (part.type === "text") {
                    return part.text?.trim().length > 0;
                  }
                  if (part.type === "reasoning") {
                    return part.text?.trim().length > 0;
                  }
                  return false;
                })
                .map((part) => {
                  if (part.type === "text") {
                    return { type: "text" as const, text: part.text };
                  }
                  if (part.type === "reasoning") {
                    return { type: "reasoning" as const, text: part.text };
                  }
                  return part;
                }),
              attachments: [],
            }))
            .filter((msg) => msg.parts.length > 0);

          const promises: Promise<unknown>[] = [];

          if (filteredMessages.length > 0) {
            promises.push(
              fetchMutation(
                api.messages.saveMessages,
                { messages: filteredMessages },
                { token }
              )
            );
          }

          if (finalMergedUsage) {
            promises.push(
              fetchMutation(
                api.chats.updateLastContext,
                { id: chatId, context: finalMergedUsage },
                { token }
              )
            );
          }

          await Promise.all(promises);

          // Generate title after first message (in background)
          if (isFirstMessage) {
            const messageForTitle = message;
            const chatIdForTitle = chatId;
            const tokenForTitle = token;

            after(async () => {
              try {
                const title = await generateTitleFromUserMessage({
                  message: messageForTitle,
                });
                await fetchMutation(
                  api.chats.updateTitle,
                  { id: chatIdForTitle, title },
                  { token: tokenForTitle }
                );
              } catch (error) {
                console.warn("Background title generation failed:", error);
              }
            });
          }
        } catch (error) {
          console.error("Error in onFinish callback:", error);
        }
      },
      onError: () => "Oops, something went wrong. Please try again later.",
    });

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    const vercelId = request.headers.get("x-vercel-id");

    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    if (
      error instanceof Error &&
      error.message?.includes(
        "AI Gateway requires a valid credit card on file to service requests"
      )
    ) {
      return new ChatSDKError("bad_request:activate_gateway").toResponse();
    }

    console.error("Unhandled error in chat API:", error, { vercelId });
    return new ChatSDKError("offline:chat").toResponse();
  }
}
