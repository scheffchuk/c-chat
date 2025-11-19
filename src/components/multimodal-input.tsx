"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { ArrowUpIcon, CircleStop, PaperclipIcon } from "lucide-react";
import { memo, startTransition, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { saveChatModelAsCookie } from "@/app/(chat)/actions";
import { chatModels } from "@/lib/ai/models";
import type { ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";
import { cn } from "@/lib/utils";
import { Context } from "./ai-elements/context";
import {
  PromptInput,
  PromptInputAttachments,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  usePromptInputController,
} from "./ai-elements/prompt-input";
import { PreviewAttachment } from "./preview-attachment";
import { SuggestedActions } from "./suggested-actions";
import { Button } from "./ui/button";
import type { VisibilityType } from "./visibility-selector";

const DEFAULT_MAX_TOKENS = 200_000;

function PureMultimodalInput({
  chatId,
  status,
  stop,
  messages,
  setMessages,
  sendMessage,
  className,
  selectedVisibilityType,
  selectedModelId,
  onModelChange,
  usage,
}: {
  chatId: string;
  status: UseChatHelpers<ChatMessage>["status"];
  stop: () => void;
  messages: UIMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  className?: string;
  selectedVisibilityType: VisibilityType;
  selectedModelId: string;
  onModelChange?: (modelId: string) => void;
  usage?: AppUsage;
}) {
  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType,
        };
      }
      const { error } = await response.json();
      toast.error(error);
    } catch (_error) {
      toast.error("Failed to upload file, please try again!");
    }
  }, []);

  const handleSubmit = useCallback(
    async (message: {
      text: string;
      files: Array<{ url: string; filename?: string; mediaType?: string }>;
    }) => {
      if (status !== "ready") {
        toast.error("Please wait for the model to finish its response!");
        return;
      }

      window.history.pushState({}, "", `/chat/${chatId}`);

      // Convert blob URLs to Files and upload them
      const uploadedParts = await Promise.all(
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
        message.files.map(async (filePart) => {
          if (!filePart.url) {
            return;
          }

          // If it's already a server URL (starts with http/https), use it directly
          if (
            filePart.url.startsWith("http://") ||
            filePart.url.startsWith("https://")
          ) {
            return {
              type: "file" as const,
              url: filePart.url,
              name: filePart.filename || "file",
              mediaType: filePart.mediaType || "application/octet-stream",
            };
          }

          // Otherwise, it's a blob/data URL - convert to File and upload
          try {
            const response = await fetch(filePart.url);
            const blob = await response.blob();
            const file = new File([blob], filePart.filename || "file", {
              type: filePart.mediaType || blob.type,
            });

            const uploaded = await uploadFile(file);
            if (!uploaded) {
              return;
            }

            return {
              type: "file" as const,
              url: uploaded.url,
              name: uploaded.name,
              mediaType: uploaded.contentType,
            };
          } catch (error) {
            console.error("Error converting blob to file:", error);
            toast.error("Failed to process file");
          }
        })
      );

      const validParts = uploadedParts.filter(
        (
          part
        ): part is {
          type: "file";
          url: string;
          name: string;
          mediaType: string;
        } => part !== undefined
      );

      sendMessage({
        role: "user",
        parts: [
          ...validParts,
          {
            type: "text",
            text: message.text,
          },
        ],
      });
    },
    [status, chatId, sendMessage, uploadFile]
  );

  return (
    <PromptInputProvider>
      <MultimodalInputInner
        chatId={chatId}
        className={className}
        messages={messages}
        onModelChange={onModelChange}
        onSubmit={handleSubmit}
        selectedModelId={selectedModelId}
        selectedVisibilityType={selectedVisibilityType}
        sendMessage={sendMessage}
        setMessages={setMessages}
        status={status}
        stop={stop}
        usage={usage}
      />
    </PromptInputProvider>
  );
}

function MultimodalInputInner({
  chatId,
  className,
  messages,
  onModelChange,
  selectedModelId,
  selectedVisibilityType,
  sendMessage,
  status,
  stop,
  onSubmit,
  setMessages,
  usage,
}: {
  chatId: string;
  className?: string;
  messages: UIMessage[];
  onModelChange?: (modelId: string) => void;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  status: UseChatHelpers<ChatMessage>["status"];
  stop: () => void;
  onSubmit: (message: {
    text: string;
    files: Array<{ url: string; filename?: string; mediaType?: string }>;
  }) => Promise<void>;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  usage?: AppUsage;
}) {
  const controller = usePromptInputController();
  const attachments = usePromptInputAttachments();

  const modelId = usage?.modelId ?? selectedModelId;
  const usedTokens =
    (usage?.inputTokens ?? 0) +
    (usage?.outputTokens ?? 0) +
    (usage?.reasoningTokens ?? 0);
  const maxTokens = DEFAULT_MAX_TOKENS;

  const hasDraft =
    controller.textInput.value.trim().length > 0 ||
    attachments.files.length > 0;

  return (
    <div className={cn("relative flex w-full flex-col gap-4", className)}>
      {messages.length === 0 && !hasDraft && (
        <SuggestedActions
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          sendMessage={sendMessage}
        />
      )}

      <PromptInput
        className="rounded-xl border border-border bg-background p-3 shadow-xs transition-all duration-200 focus-within:border-border hover:border-muted-foreground/50"
        onSubmit={onSubmit}
      >
        <PromptInputAttachments>
          {(attachment) => (
            <PreviewAttachment
              attachment={{
                name: attachment.filename || "file",
                url: attachment.url || "",
                contentType: attachment.mediaType || "",
              }}
              key={attachment.id}
              onRemove={() => attachments.remove(attachment.id)}
            />
          )}
        </PromptInputAttachments>

        <div className="flex w-full flex-row items-start gap-1 sm:gap-2">
          <PromptInputTextarea
            autoFocus
            className="grow resize-none border-0! border-none! bg-transparent p-2 text-sm outline-none ring-0 [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden"
            data-testid="multimodal-input"
            placeholder="Send a message..."
          />
          <Context
            maxTokens={maxTokens}
            modelId={modelId}
            usage={usage}
            usedTokens={usedTokens}
          />
        </div>

        <PromptInputFooter className="border-top-0! p-1 shadow-none dark:border-0 dark:border-transparent!">
          <PromptInputTools className="gap-0 sm:gap-0.5">
            <AttachmentsButton
              selectedModelId={selectedModelId}
              status={status}
            />
            <ModelSelectorCompact
              onModelChange={onModelChange}
              selectedModelId={selectedModelId}
            />
          </PromptInputTools>

          {status === "submitted" ? (
            <StopButton setMessages={setMessages} stop={stop} />
          ) : (
            <PromptInputSubmit
              className="size-8 rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
              data-testid="send-button"
              disabled={!controller.textInput.value.trim()}
              status={status}
            >
              <ArrowUpIcon size={14} />
            </PromptInputSubmit>
          )}
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.status !== nextProps.status) {
      return false;
    }
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) {
      return false;
    }
    if (prevProps.selectedModelId !== nextProps.selectedModelId) {
      return false;
    }
    if (prevProps.messages.length !== nextProps.messages.length) {
      return false;
    }

    return true;
  }
);

function PureAttachmentsButton({
  status,
  selectedModelId,
}: {
  status: UseChatHelpers<ChatMessage>["status"];
  selectedModelId: string;
}) {
  const attachments = usePromptInputAttachments();
  const isReasoningModel = selectedModelId === "chat-model-reasoning";

  return (
    <Button
      className="aspect-square h-8 rounded-lg p-1 transition-colors hover:bg-accent"
      data-testid="attachments-button"
      disabled={status !== "ready" || isReasoningModel}
      onClick={(event) => {
        event.preventDefault();
        attachments.openFileDialog();
      }}
      variant="ghost"
    >
      <PaperclipIcon size={14} style={{ width: 14, height: 14 }} />
    </Button>
  );
}

const AttachmentsButton = memo(PureAttachmentsButton);

function PureModelSelectorCompact({
  selectedModelId,
  onModelChange,
}: {
  selectedModelId: string;
  onModelChange?: (modelId: string) => void;
}) {
  const [optimisticModelId, setOptimisticModelId] = useState(selectedModelId);

  useEffect(() => {
    setOptimisticModelId(selectedModelId);
  }, [selectedModelId]);

  const selectedModel = chatModels.find(
    (model) => model.id === optimisticModelId
  );

  return (
    <PromptInputSelect
      onValueChange={(modelName) => {
        const model = chatModels.find((m) => m.name === modelName);
        if (model) {
          setOptimisticModelId(model.id);
          onModelChange?.(model.id);
          startTransition(() => {
            saveChatModelAsCookie(model.id);
          });
        }
      }}
      value={selectedModel?.name}
    >
      <PromptInputSelectTrigger className="h-8 px-2">
        <span className="hidden font-medium text-xs sm:block">
          {selectedModel?.name}
        </span>
      </PromptInputSelectTrigger>
      <PromptInputSelectContent className="min-w-[260px] p-0">
        <div className="flex flex-col gap-px">
          {chatModels.map((model) => (
            <PromptInputSelectItem key={model.id} value={model.name}>
              <div className="truncate font-medium text-xs">{model.name}</div>
              <div className="mt-px truncate text-[10px] text-muted-foreground leading-tight">
                {model.description}
              </div>
            </PromptInputSelectItem>
          ))}
        </div>
      </PromptInputSelectContent>
    </PromptInputSelect>
  );
}

const ModelSelectorCompact = memo(PureModelSelectorCompact);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
}) {
  return (
    <Button
      className="size-7 rounded-full bg-foreground p-1 text-background transition-colors duration-200 hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground"
      data-testid="stop-button"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
      }}
    >
      <CircleStop size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);
