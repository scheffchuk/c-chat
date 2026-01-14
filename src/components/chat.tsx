"use client";

import { useChat } from "@ai-sdk/react";
import { type DataUIPart, DefaultChatTransport } from "ai";
import { Authenticated } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { chatModels, DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage, CustomUIDataTypes } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";
import { fetchWithErrorHandlers } from "@/lib/utils";
import { useDataStream } from "@/providers/data-stream-provider";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";

export default function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  initialLastContext,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  initialVisibilityType: "public" | "private";
  isReadonly: boolean;
  initialLastContext?: AppUsage;
}) {
  const { setDataStream } = useDataStream();
  const [usage, setUsage] = useState<AppUsage | undefined>(initialLastContext);
  const [currentModelId] = useState(initialChatModel);
  const currentModelIdRef = useRef(initialChatModel);
  const hasSentPendingMessage = useRef(false);

  useEffect(() => {
    currentModelIdRef.current = currentModelId;
  }, [currentModelId]);

  const { messages, setMessages, sendMessage, status, stop, regenerate } =
    useChat<ChatMessage>({
      id,
      messages: initialMessages,
      experimental_throttle: 100,
      generateId: () => crypto.randomUUID(),
      transport: new DefaultChatTransport({
        api: "/api/chat",
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          return fetchWithErrorHandlers(input, {
            ...init,
            headers,
            credentials: "include",
          });
        },
        prepareSendMessagesRequest: (request) => {
          const modelId = currentModelIdRef.current;
          const isValidModel = chatModels.some((model) => model.id === modelId);
          const selectedChatModel = isValidModel ? modelId : DEFAULT_CHAT_MODEL;

          const lastMessage = request.messages.at(-1);
          if (!lastMessage) {
            throw new Error("No message to send");
          }

          const message = {
            ...lastMessage,
            id: lastMessage.id || crypto.randomUUID(),
          };

          return {
            body: {
              id,
              clientId: request.id,
              message,
              selectedChatModel,
              selectedVisibilityType: initialVisibilityType,
            },
          };
        },
      }),
      onData: (dataPart: DataUIPart<CustomUIDataTypes>) => {
        setDataStream((ds) => (ds ? [...ds, dataPart] : []));
        if (dataPart.type === "data-usage") {
          setUsage(dataPart.data);
        }
      },
      onError: (error) => {
        if (
          error instanceof ChatSDKError &&
          error.message?.includes("AI Gateway requires a valid credit card")
        ) {
          toast.error(error.message);
        }
      },
    });

  // Send pending message from sessionStorage (from new chat creation)
  useEffect(() => {
    if (hasSentPendingMessage.current || initialMessages.length > 0) {
      return;
    }

    const stored = sessionStorage.getItem("pending-chat-message");
    if (stored) {
      sessionStorage.removeItem("pending-chat-message");
      hasSentPendingMessage.current = true;
      sendMessage(JSON.parse(stored) as ChatMessage);
    }
  }, [initialMessages.length, sendMessage]);

  return (
    <div className="overscroll-behavior-contain flex h-full min-w-0 touch-pan-y flex-col">
      <Messages
        isArtifactVisible={false}
        isReadOnly={isReadonly}
        messages={messages}
        regenerate={regenerate}
        selectedModelId={currentModelId}
        setMessages={setMessages}
        status={status}
      />
      <Authenticated>
        <div className="fixed right-0 bottom-0 left-0 z-20 mx-auto w-full max-w-4xl gap-2 border-t-0 bg-background/95 px-2 pb-4 backdrop-blur-sm md:px-4 md:pb-6">
          <MultimodalInput
            chatId={id}
            messages={messages}
            selectedModelId={currentModelId}
            selectedVisibilityType={initialVisibilityType}
            sendMessage={sendMessage}
            setMessages={setMessages}
            status={status}
            stop={stop}
            usage={usage}
          />
        </div>
      </Authenticated>
    </div>
  );
}
