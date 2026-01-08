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
import { after } from "next/server";
import type { ResumableStreamContext } from "resumable-stream/ioredis";
import { createResumableStreamContext } from "resumable-stream/ioredis";
import { fetchModels, type ModelCatalog } from "tokenlens";
import { getUsage } from "tokenlens/helpers";
import { uuidv4 } from "zod";
import type { VisibilityType } from "@/components/visibility-selector";
import type { ChatModel } from "@/lib/ai/models";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompt";
import { getAuthContext } from "@/lib/auth-server";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";
import { convertToUIMessages } from "@/lib/utils";
import { api } from "../../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { generateTitleFromUserMessage } from "../../actions";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

const getTokenlensCatalog = async (): Promise<ModelCatalog | undefined> => {
  try {
    return await fetchModels();
  } catch (error) {
    console.error("Error fetching tokenlens catalog", error);
    return;
  }
};

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

  // Single auth check - get token or return unauthorized
  const token = await getAuthContext();
  if (!token) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
    }: {
      id?: string;
      message: ChatMessage;
      selectedChatModel: ChatModel["id"];
      selectedVisibilityType: VisibilityType;
    } = requestBody;

    const user = await fetchQuery(api.users.getCurrentUser, {}, { token });
    if (!user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    let chat: Doc<"chats"> | null = null;
    let chatId: Id<"chats"> | null = null;
    let messagesFromDb: Doc<"messages">[] = [];
    let isNewChat = false;

    // Only try to fetch existing chat if id is provided
    if (id) {
      try {
        chat = await fetchQuery(
          api.chats.getChatById,
          { chatId: id as Id<"chats"> },
          { token }
        );
      } catch {
        // chat not found, create a new one
      }
    }

    if (chat) {
      if (chat.userId !== user._id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }

      chatId = chat._id;
      messagesFromDb = await fetchQuery(
        api.messages.getMessagesByChatId,
        { chatId },
        { token }
      );
    } else {
      const title = await generateTitleFromUserMessage({ message });

      chatId = await fetchMutation(
        api.chats.saveChat,
        { title, visibility: selectedVisibilityType },
        { token }
      );
      isNewChat = true;
    }

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
        // Send chatId to frontend for new chats
        if (isNewChat && chatId) {
          datastream.write({
            type: "data-chatId",
            data: chatId,
          });
        }

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
            try {
              const providers = await getTokenlensCatalog();
              const modelId = gateway(selectedChatModel).modelId;
              if (!modelId) {
                finalMergedUsage = usage;
                datastream.write({
                  type: "data-usage",
                  data: finalMergedUsage,
                });
                return;
              }

              if (!providers) {
                finalMergedUsage = usage;
                datastream.write({
                  type: "data-usage",
                  data: finalMergedUsage,
                });
                return;
              }

              const summary = getUsage({
                modelId,
                usage,
                providers,
              });
              finalMergedUsage = {
                ...usage,
                ...summary,
                modelId,
              } as AppUsage;
              datastream.write({
                type: "data-usage",
                data: finalMergedUsage,
              });
            } catch (error) {
              console.warn("TokenLens enrichmnt failed", error);
              finalMergedUsage = usage;
              datastream.write({
                type: "data-usage",
                data: finalMergedUsage,
              });
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
        const filteredMessages = messages
          .map((msg) => ({
            chatId,
            role: msg.role,
            parts: msg.parts.filter(
              (part) => part.type === "text" || part.type === "reasoning"
            ),
            attachments: [],
          }))
          .filter((msg) => msg.parts.length > 0);

        if (filteredMessages.length > 0) {
          await fetchMutation(
            api.messages.saveMessages,
            { messages: filteredMessages },
            { token }
          );
        }

        if (finalMergedUsage) {
          try {
            await fetchMutation(
              api.chats.updateLastContext,
              {
                id: chatId,
                context: finalMergedUsage,
              },
              { token }
            );
          } catch (error) {
            console.warn(
              "Unable to persist last usage for chat",
              chatId,
              error
            );
          }
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
