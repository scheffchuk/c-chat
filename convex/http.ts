import { geolocation } from "@vercel/functions";
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { httpRouter } from "convex/server";
import type { ModelCatalog } from "tokenlens/core";
import { fetchModels } from "tokenlens/fetch";
import { getUsage } from "tokenlens/helpers";
import {
  type PostRequestBody,
  postRequestBodySchema,
} from "../src/app/(chat)/api/chat/schema";
import type { ChatModel } from "../src/lib/ai/models";
import { type RequestHints, systemPrompt } from "../src/lib/ai/prompt";
import { myProvider } from "../src/lib/ai/providers";
import { ChatSDKError } from "../src/lib/errors";
import type { ChatMessage } from "../src/lib/types";
import type { AppUsage } from "../src/lib/usage";
import { api, internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { httpAction } from "./_generated/server";

export const maxDuration = 60;

const getTokenlensCatalog = async (): Promise<ModelCatalog | undefined> => {
  try {
    return await fetchModels();
  } catch (error) {
    console.warn(
      "TokenLens: catalog fetch failed, using default catalog",
      error
    );
    return;
  }
};

// Helper to convert Convex messages to UIMessages
function convertConvexMessagesToUI(messages: Doc<"messages">[]): UIMessage[] {
  return messages.map((msg) => ({
    id: msg._id,
    role: msg.role,
    parts: msg.parts as UIMessage["parts"],
    createdAt: msg._creationTime,
  }));
}

// Helper to filter parts to only Convex-supported types
function filterPartsForConvex(
  parts: UIMessage["parts"]
): Array<
  { type: "text"; text: string } | { type: "tool"; name: string; args: {} }
> {
  return parts
    .filter((part) => part.type === "text" || part.type.startsWith("tool-"))
    .map((part) => {
      if (part.type === "text") {
        return { type: "text" as const, text: part.text };
      }
      // Handle tool parts (they have type like "tool-{name}")
      if (part.type.startsWith("tool-")) {
        const toolPart = part as any;
        return {
          type: "tool" as const,
          name: toolPart.name || toolPart.type.replace("tool-", ""),
          args: toolPart.args || {},
        };
      }
      // This should never happen due to filter, but TypeScript needs it
      throw new Error(`Unsupported part type: ${(part as any).type}`);
    });
}

const http = httpRouter();

http.route({
  path: "/api/chat",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    let requestBody: PostRequestBody;

    try {
      const json = await req.json();
      requestBody = postRequestBodySchema.parse(json);
    } catch (_) {
      return new ChatSDKError("bad_request:api").toResponse();
    }

    try {
      const {
        id,
        message,
        selectChatModel: selectedChatModel,
        selectedVisibilityType,
      }: {
        id: string;
        message: ChatMessage;
        selectChatModel: ChatModel["id"];
        selectedVisibilityType: "public" | "private";
      } = requestBody;

      const currentUser = await ctx.auth.getUserIdentity();

      if (!currentUser) {
        return new ChatSDKError("unauthorized:chat").toResponse();
      }

      const chatId = id as Id<"chats">;
      let chat: Doc<"chats"> | null = null;

      try {
        chat = await ctx.runQuery(api.chats.getChatById, {
          chatId,
        });
      } catch (error) {
        // Chat doesn't exist, will create it below
        chat = null;
      }

      let messagesFromConvex: Doc<"messages">[] = [];
      let finalChatId: Id<"chats">;

      if (chat) {
        if (chat.userId !== currentUser.id) {
          return new ChatSDKError("forbidden:chat").toResponse();
        }

        finalChatId = chat._id;
        messagesFromConvex = await ctx.runQuery(
          api.messages.getMessagesByChatId,
          {
            chatId: finalChatId,
          }
        );
      } else {
        const title = await ctx.runAction(
          internal.messageActions.generateTitleFromUserMessage,
          {
            message: {
              parts: filterPartsForConvex(message.parts).filter(
                (p) => p.type === "text"
              ) as Array<{ type: "text"; text: string }>,
            },
          }
        );

        finalChatId = await ctx.runMutation(api.chats.saveChat, {
          userId: currentUser.id as Id<"users">,
          title,
          visibility: "private",
        });
      }

      const uiMessages = [
        ...convertConvexMessagesToUI(messagesFromConvex),
        message,
      ];

      const { longitude, latitude, city, country } = geolocation(req);

      const requestHints: RequestHints = {
        longitude,
        latitude,
        city,
        country,
      };

      await ctx.runMutation(api.messages.saveMessages, {
        chatId: finalChatId,
        role: message.role,
        parts: filterPartsForConvex(message.parts),
        attachments: [],
      });

      let finalMergedUsage: AppUsage | undefined;

      const stream = createUIMessageStream({
        execute: ({ writer: dataStream }) => {
          const result = streamText({
            model: myProvider.languageModel(selectedChatModel),
            system: systemPrompt({ selectedChatModel, requestHints }),
            messages: convertToModelMessages(uiMessages),
            stopWhen: stepCountIs(5),
            activeTools: [],
            experimental_transform: smoothStream({ chunking: "word" }),
            experimental_telemetry: {
              isEnabled: true,
              functionId: "streamText",
            },
            onFinish: async ({ usage }) => {
              try {
                const providers = await getTokenlensCatalog();
                const modelId =
                  myProvider.languageModel(selectedChatModel).modelId;

                if (!modelId) {
                  finalMergedUsage = usage;
                  dataStream.write({
                    type: "data-usage",
                    data: finalMergedUsage,
                  });
                  return;
                }

                if (!providers) {
                  finalMergedUsage = usage;
                  dataStream.write({
                    type: "data-usage",
                    data: finalMergedUsage,
                  });
                  return;
                }

                const summary = getUsage({ modelId, usage, providers });
                finalMergedUsage = {
                  ...usage,
                  ...summary,
                  modelId,
                } as AppUsage;
                dataStream.write({
                  type: "data-usage",
                  data: finalMergedUsage,
                });
              } catch (error) {
                console.warn("TokenLens enrichment failed:", error);
                finalMergedUsage = usage;
                dataStream.write({
                  type: "data-usage",
                  data: finalMergedUsage,
                });
              }
            },
          });

          result.consumeStream();

          dataStream.merge(
            result.toUIMessageStream({
              sendReasoning: true,
            })
          );
        },
        generateId: () => crypto.randomUUID(),
        onFinish: async ({ messages }) => {
          // Save assistant messages
          for (const currentMessage of messages) {
            if (currentMessage.role === "assistant") {
              await ctx.runMutation(api.messages.saveMessages, {
                chatId: finalChatId,
                role: currentMessage.role,
                parts: filterPartsForConvex(currentMessage.parts),
                attachments: [],
              });
            }
          }

          // Update chat context with usage if available
          if (finalMergedUsage) {
            try {
              await ctx.runMutation(api.chats.updateChatContextById, {
                chatId: finalChatId,
                lastContext: JSON.stringify(finalMergedUsage),
              });
            } catch (error) {
              console.warn(
                "Unable to persist last usage for chat",
                finalChatId,
                error
              );
            }
          }
        },
        onError: () => "Oops, an error occurred!",
      });

      return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    } catch (error) {
      const vercelId = req.headers.get("x-vercel-id");

      if (error instanceof ChatSDKError) {
        return error.toResponse();
      }

      // Check for Vercel AI Gateway credit card error
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
  }),
});

http.route({
  path: "/api/chat",
  method: "DELETE",
  handler: httpAction(async (ctx, req) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return new ChatSDKError("bad_request:api").toResponse();
      }

      const currentUser = await ctx.auth.getUserIdentity();

      if (!currentUser) {
        return new ChatSDKError("unauthorized:chat").toResponse();
      }

      const chatId = id as Id<"chats">;
      let chat: Doc<"chats"> | null = null;

      try {
        chat = await ctx.runQuery(api.chats.getChatById, {
          chatId,
        });
      } catch (error) {
        return new ChatSDKError("not_found:chat").toResponse();
      }

      if (chat.userId !== currentUser.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }

      await ctx.runMutation(api.chats.deleteChatById, {
        chatId: chat._id,
      });

      return Response.json({ message: "Chat deleted" }, { status: 200 });
    } catch (error) {
      const vercelId = req.headers.get("x-vercel-id");

      if (error instanceof ChatSDKError) {
        return error.toResponse();
      }

      console.error("Unhandled error in DELETE chat API:", error, { vercelId });
      return new ChatSDKError("offline:chat").toResponse();
    }
  }),
});

export default http;
