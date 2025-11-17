import type { UseChatHelpers } from "@ai-sdk/react";
import { useEffect } from "react";
import { useMessages } from "@/hooks/use-messages";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "@/providers/data-stream-provider";
import { Conversation, ConversationContent } from "./ai-elements/conversation";
import Greeting from "./greeting";

type MessagesProps = {
  chatId: string;
  status: UseChatHelpers<ChatMessage>["status"];
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadOnly: boolean;
  isArtifactVisible: boolean;
  selectedModelId: string;
};

export default function PureMessages({
  chatId,
  status,
  messages,
  setMessages,
  regenerate,
  isReadOnly,
  selectedModelId,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    isAtBottom,
    scrollToBottom,
    hasSentMessage,
  } = useMessages({ status });

  useDataStream();

  useEffect(() => {
    if (status === "submitted") {
      requestAnimationFrame(() => {
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    }
  }, [status, messagesContainerRef]);

  return (
    <div className="overscroll-behavior-contain -webkit-overflow-scrolling-touch overflow-y-scrol flex-1 touch-pan-y">
      <Conversation className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 md:gap-6">
        <ConversationContent>
          {messages.length === 0 && <Greeting />}
        </ConversationContent>
      </Conversation>
    </div>
  );
}
