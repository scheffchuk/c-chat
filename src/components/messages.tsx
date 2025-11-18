import type { UseChatHelpers } from "@ai-sdk/react";
import equal from "fast-deep-equal";
import { ArrowDownIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { memo, useEffect } from "react";
import { useMessages } from "@/hooks/use-messages";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "@/providers/data-stream-provider";
import { Conversation, ConversationContent } from "./ai-elements/conversation";
import Greeting from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";
import { Button } from "./ui/button";

type MessagesProps = {
  status: UseChatHelpers<ChatMessage>["status"];
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadOnly: boolean;
  isArtifactVisible: boolean;
  selectedModelId: string;
};

export default function PureMessages({
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

          {messages.map((message, index) => (
            <PreviewMessage
              isLoading={
                status === "streaming" && messages.length - 1 === index
              }
              isReadonly={isReadOnly}
              key={message.id}
              message={message}
              regenerate={regenerate}
              requiresScrollPadding={
                hasSentMessage && index === messages.length - 1
              }
              setMessages={setMessages}
            />
          ))}

          <AnimatePresence mode="wait">
            {status === "submitted" && <ThinkingMessage key="thinking" />}
          </AnimatePresence>

          <div
            className="min-h-[24px] min-w-[24px] shrink-0"
            ref={messagesEndRef}
          />
        </ConversationContent>
      </Conversation>

      {!isAtBottom && (
        <Button
          aria-label="Scroll to bottom"
          className="-translate-x-1/2 absolute bottom-40 left-1/2 z-10 rounded-full border bg-bacground p-2 shadow-lg transition-colors hover:bg-muted"
          onClick={() => scrollToBottom("smooth")}
          type="button"
        >
          <ArrowDownIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) {
    return true;
  }

  if (prevProps.status !== nextProps.status) {
    return false;
  }

  if (prevProps.selectedModelId !== nextProps.selectedModelId) {
    return false;
  }

  if (prevProps.messages.length !== nextProps.messages.length) {
    return false;
  }

  if (!equal(prevProps.messages, nextProps.messages)) {
    return false;
  }

  return false;
});
