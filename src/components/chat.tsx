"use client";

import { useChat } from "@ai-sdk/react";
import { type DataUIPart, DefaultChatTransport } from "ai";
import { Authenticated } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
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
  // autoResume,
  initialLastContext,
}: {
  id?: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  initialVisibilityType: "public" | "private";
  isReadonly: boolean;
  // autoResume: boolean;
  initialLastContext?: AppUsage;
}) {
  const router = useRouter();
  const { setDataStream } = useDataStream();
  // const [input, setInput] = useState<string>("");
  const [usage, setUsage] = useState<AppUsage | undefined>(initialLastContext);
  const [currentModelId] = useState(initialChatModel);
  const currentModelIdRef = useRef(initialChatModel);

  const [serverChatId, setServerChatId] = useState<string | null>(id ?? null);
  const serverChatIdRef = useRef<string | null>(id ?? null);

  useEffect(() => {
    serverChatIdRef.current = serverChatId;
  }, [serverChatId]);

  useEffect(() => {
    currentModelIdRef.current = currentModelId;
  }, [currentModelId]);

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    // resumeStream,
  } = useChat<ChatMessage>({
    id,
    initialMessages,
    experimental_throttle: 100,
    generateId: () => crypto.randomUUID(),
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: (input, init) => {
        // Better Auth handles cookies automatically, but we need to include credentials
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

        // Ensure message has an ID
        const message = {
          ...lastMessage,
          id: lastMessage.id || crypto.randomUUID(),
        };

        return {
          body: {
            id: serverChatIdRef.current ?? undefined,
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
      if (
        dataPart.type === "data-chatId" &&
        typeof dataPart.data === "string"
      ) {
        const newId = dataPart.data;
        if (newId !== serverChatIdRef.current) {
          setServerChatId(newId);
          if (id) {
            window.history.replaceState({}, "", `/chat/${newId}`);
          } else {
            router.push(`/chat/${newId}`);
          }
        }
      }
    },
    // onFinish: () => {},
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        if (
          error.message?.includes("AI Gateway requires a valid credit card")
        ) {
          toast.error(error.message);
        }
        return;
      }
    },
  });

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage({
        role: "user" as const,
        parts: [{ type: "text", text: query }],
      });

      setHasAppendedQuery(true);
      if (id) {
        window.history.replaceState({}, "", `/chat/${id}`);
      }
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  return (
    <div className="overscroll-behavior-contain flex h-full min-w-0 touch-pan-y flex-col">
      {/* <ChatHeader
          chatId={""}
          selectedVisibilityType={"private"}
          isReadonly={false}
        /> */}
      <Messages
        isArtifactVisible={false}
        isReadOnly={isReadonly}
        messages={messages}
        regenerate={regenerate}
        selectedModelId={currentModelId}
        setMessages={setMessages}
        status={status}
      />
      {/* TODO: Artifacts */}
      <Authenticated>
        <div className="sticky z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
          <MultimodalInput
            chatId={serverChatId ?? id ?? ""}
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
