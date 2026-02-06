"use client";

import { Authenticated } from "convex/react";
import { ArrowUpIcon, PaperclipIcon } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  PromptInput,
  PromptInputAttachments,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import { Suggestion } from "@/components/ai-elements/suggestion";
import Greeting from "@/components/greeting";
import { ConnectedModelSelector } from "@/components/model-selector";
import { PreviewAttachment } from "@/components/preview-attachment";
import { useSidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/lib/types";
import { useModelStore } from "@/stores/model-store";
import { createNewChat } from "./actions";

const PENDING_MESSAGE_KEY = "pending-chat-message";

export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const [isPending, startCreateTransition] = useTransition();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const { isOpen } = useSidebar();

  // Handle ?query= param: create chat and navigate
  useEffect(() => {
    if (query && !isPending) {
      const message: ChatMessage = {
        id: uuidv4(),
        role: "user",
        parts: [{ type: "text", text: query }],
      };
      sessionStorage.setItem(PENDING_MESSAGE_KEY, JSON.stringify(message));
      startCreateTransition(() => createNewChat("private", selectedModelId));
    }
  }, [query, isPending, selectedModelId]);

  const handleSubmit = useCallback(
    (message: ChatMessage) => {
      sessionStorage.setItem(PENDING_MESSAGE_KEY, JSON.stringify(message));
      startCreateTransition(() => createNewChat("private", selectedModelId));
    },
    [selectedModelId]
  );

  if (query) {
    return null;
  }

  return (
    <div className="overscroll-behavior-contain flex h-full min-w-0 touch-pan-y flex-col items-center justify-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        <Greeting />
      </div>
      <Authenticated>
        <div
          className={`w-full gap-2 border-t-0 bg-background px-2 pb-3 transition-all duration-150 ease-in-out md:px-4 md:pb-4 ${
            isOpen ? "mx-auto max-w-3xl lg:max-w-4xl" : "mx-auto max-w-4xl"
          }`}
        >
          <PromptInputProvider>
            <NewChatInput isPending={isPending} onSubmit={handleSubmit} />
          </PromptInputProvider>
        </div>
      </Authenticated>
    </div>
  );
}

const suggestedActions = [
  "What is AI?",
  "Explain quantum computing",
  "How many 's' are in 'strawberry'?",
  "What is the weather in Tokyo?",
];

function NewChatInput({
  onSubmit,
  isPending,
}: {
  onSubmit: (message: ChatMessage) => void;
  isPending: boolean;
}) {
  const controller = usePromptInputController();
  const attachments = usePromptInputAttachments();

  const hasDraft =
    controller.textInput.value.trim().length > 0 ||
    attachments.files.length > 0;

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
        return {
          url: data.url,
          name: data.pathname,
          contentType: data.contentType,
        };
      }
      const { error } = await response.json();
      toast.error(error);
    } catch {
      toast.error("Failed to upload file");
    }
  }, []);

  const processFilePart = useCallback(
    async (filePart: {
      url: string;
      filename?: string;
      mediaType?: string;
    }) => {
      if (!filePart.url) {
        return;
      }

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
        return;
      }
    },
    [uploadFile]
  );

  const handleSubmit = useCallback(
    async (message: {
      text: string;
      files: Array<{ url: string; filename?: string; mediaType?: string }>;
    }) => {
      if (isPending) {
        return;
      }

      const uploadedParts = await Promise.all(
        message.files.map(processFilePart)
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

      const chatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        parts: [...validParts, { type: "text", text: message.text }],
      };

      onSubmit(chatMessage);
    },
    [isPending, onSubmit, processFilePart]
  );

  return (
    <div className="relative flex w-full flex-col gap-4">
      {!hasDraft && (
        <div
          className="grid w-full gap-2 sm:grid-cols-2"
          data-testid="suggested-actions"
        >
          {suggestedActions.map((action, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              initial={{ opacity: 0, y: 20 }}
              key={action}
              transition={{ delay: 0.05 * index }}
            >
              <Suggestion
                className="h-auto w-full whitespace-normal p-3 text-left"
                onClick={(suggestion) =>
                  controller.textInput.setInput(suggestion)
                }
                suggestion={action}
              >
                {action}
              </Suggestion>
            </motion.div>
          ))}
        </div>
      )}

      <PromptInput
        className="rounded-xl border border-border bg-background p-3 shadow-xs transition-all duration-200 focus-within:border-border hover:border-muted-foreground/50"
        onSubmit={handleSubmit}
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
        </div>

        <PromptInputFooter className="border-top-0! p-1 shadow-none dark:border-0 dark:border-transparent!">
          <PromptInputTools className="gap-0 sm:gap-0.5">
            <Button
              className="aspect-square h-8 rounded-lg p-1 transition-colors hover:bg-accent"
              data-testid="attachments-button"
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                attachments.openFileDialog();
              }}
              variant="ghost"
            >
              <PaperclipIcon size={14} style={{ width: 14, height: 14 }} />
            </Button>
            <ConnectedModelSelector disabled={isPending} />
          </PromptInputTools>

          <PromptInputSubmit
            className="size-8 rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
            data-testid="send-button"
            disabled={!controller.textInput.value.trim() || isPending}
            status={isPending ? "submitted" : "ready"}
          >
            <ArrowUpIcon size={14} />
          </PromptInputSubmit>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
