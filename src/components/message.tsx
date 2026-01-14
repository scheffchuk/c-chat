"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import equal from "fast-deep-equal";
import { SparklesIcon } from "lucide-react";
import { motion } from "motion/react";
import { memo, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { ChatMessage } from "@/lib/types";
import { cn, sanitizedText } from "@/lib/utils";
import { useDataStream } from "@/providers/data-stream-provider";
import { MessageContent, MessageResponse } from "./ai-elements/message";
import { MessageActionsMemo } from "./message-actions";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import { PreviewAttachment } from "./preview-attachment";

type PreviewMessageProps = {
  message: ChatMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
};

const PurePreviewMessage = ({
  message,
  isLoading,
  setMessages,
  regenerate,
  isReadonly,
  requiresScrollPadding,
}: PreviewMessageProps) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const attachmentsFromMessage =
    message.parts?.filter((part) => part.type === "file") ?? [];

  useDataStream();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="group/message w-full"
      data-role={message.role}
      data-testid={`message-${message.role}`}
      initial={{ opacity: 0 }}
    >
      <div
        className={cn("flex w-full items-start gap-2 md:gap-3", {
          "justify-end": message.role === "user" && mode !== "edit",
          "justify-start": message.role === "assistant",
          "items-end": message.role === "user",
        })}
      >
        {/* {message.role === "assistant" && (
          <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
            <SparklesIcon size={14} />
          </div>
        )} */}

        <div
          className={cn("flex flex-col", {
            "gap-1 md:gap-2":
              message.parts?.some(
                (part) => part.type === "text" && part.text?.trim()
              ) ?? false,
            "min-h-16 md:min-h-20 lg:min-h-24":
              message.role === "assistant" && requiresScrollPadding,
            "w-full":
              (message.role === "assistant" &&
                message.parts?.some(
                  (part) => part.type === "text" && part.text?.trim()
                )) ||
              mode === "edit",
            // biome-ignore lint/nursery/useSortedClasses: <TODO: find out why this is needed>
            "max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content, 80%)]":
              message.role === "user" && mode !== "edit",
          })}
        >
          {attachmentsFromMessage.length > 0 && (
            <div
              className="flex flex-row justify-end gap-1"
              data-testid={"message-attachments"}
            >
              {attachmentsFromMessage.map((attachment) => (
                <PreviewAttachment
                  attachment={{
                    name: attachment.filename ?? "file",
                    contentType: attachment.mediaType,
                    url: attachment.url,
                  }}
                  key={attachment.url}
                />
              ))}
            </div>
          )}

          {message.parts?.map((part, index) => {
            const { type } = part;
            const key = `message-${message.id}-part-${index}`;

            if (type === "reasoning" && part.text?.trim().length > 0) {
              return (
                <MessageReasoning
                  isLoading={isLoading}
                  key={key}
                  reasoning={part.text}
                />
              );
            }

            if (type === "text") {
              if (mode === "view") {
                return (
                  <div key={key}>
                    <MessageContent
                      className={cn({
                        "w-fit break-words rounded-2xl px-3 py-2 text-right text-primary-foreground":
                          message.role === "user",
                        "bg-transparent px-0 py-0 text-left":
                          message.role === "assistant",
                      })}
                      data-testid="message-content"
                      style={
                        message.role === "user"
                          ? { backgroundColor: "var(--primary)" }
                          : undefined
                      }
                    >
                      <MessageResponse>
                        {sanitizedText(part.text)}
                      </MessageResponse>
                    </MessageContent>
                  </div>
                );
              }

              if (mode === "edit") {
                return (
                  <div
                    className="flex w-full flex-row items-start gap-3"
                    key={key}
                  >
                    <div className="size-8" />
                    <div className="min-w-0 flex-1">
                      <MessageEditor
                        key={message.id}
                        message={message}
                        regenerate={regenerate}
                        setMessages={setMessages}
                        setMode={setMode}
                      />
                    </div>
                  </div>
                );
              }
            }

            //TODO: tool call conditions here

            return null;
          })}

          {!isReadonly && (
            <MessageActionsMemo
              isLoading={isLoading}
              key={`action-${message.id}`}
              message={message}
              setMode={setMode}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) {
      return false;
    }

    if (prevProps.message.id !== nextProps.message.id) {
      return false;
    }

    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding) {
      return false;
    }

    if (!equal(prevProps.message.parts, nextProps.message.parts)) {
      return false;
    }

    return false;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="group/message w-full"
      data-role={role}
      data-testid="message-assistant-loading"
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3">
        <LoadingSpinner size="sm" variant="enhanced" />
      </div>
    </motion.div>
  );
};
