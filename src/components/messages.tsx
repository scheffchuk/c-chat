import type { UseChatHelpers } from "@ai-sdk/react";
import equal from "fast-deep-equal";
import { AnimatePresence } from "motion/react";
import { memo } from "react";
import { useMessages } from "@/hooks/use-messages";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "@/providers/data-stream-provider";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import Greeting from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";

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
  const { endRef: messagesEndRef, hasSentMessage } = useMessages({ status });

  useDataStream();

  return (
    <div className="overscroll-behavior-contain -webkit-overflow-scrolling-touch flex-1 touch-pan-y overflow-y-auto pb-32 md:pb-40">
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

        <ConversationScrollButton className="bottom-96 z-10 border bg-background shadow-lg hover:bg-muted md:bottom-[104]" />
      </Conversation>
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
