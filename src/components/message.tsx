"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { SparklesIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { cn, sanitizedText } from "@/lib/utils";
import { useDataStream } from "@/providers/data-stream-provider";
import { MessageContent, MessageResponse } from "./ai-elements/message";
import { MessageReasoning } from "./message-reasoning";
import { PreviewAttachment } from "./preview-attachment";

type PreviewMessageProps = {
  chatId: string;
  message: ChatMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  requireScrollPadding: boolean;
};

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  regenerate,
  isReadonly,
  requireScrollPadding,
}: PreviewMessageProps) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const attachmentsFromMessage = message.parts.filter(
    (part) => part.type === "file"
  );

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
        })}
      >
        {message.role === "assistant" && (
          <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
            <SparklesIcon size={14} />
          </div>
        )}

        <div
          className={cn("flex flex-col", {
            "gap-2 md:gap-4": message.parts.some(
              (part) => part.type === "text" && part.text?.trim()
            ),
            "min-h-96": message.role === "assistant" && requireScrollPadding,
            "w-full":
              (message.role === "assistant" &&
                message.parts?.some(
                  (part) => part.type === "text" && part.text?.trim()
                )) ||
              mode === "edit",
            // biome-ignore lint/nursery/useSortedClasses: <explanation>
            "max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content, 80%)]":
              message.role === "user" && mode !== "edit",
          })}
        >
          {attachmentsFromMessage.length > 0 && (
            <div
              className="flex flex-row justify-end gap-2"
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
                        "w-fit break-words rounded-2xl px-3 py-2 text-right text-white":
                          message.role === "user",
                        "bg-transparent px-0 py-0 text-left":
                          message.role === "assistant",
                      })}
                      data-testid="message-content"
                      style={
                        message.role === "user"
                          ? { backgroundColor: "#00fcff" }
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
                return;
              }
            }
          })}
        </div>
      </div>
    </motion.div>
  );
};
