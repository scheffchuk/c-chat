import { CopyIcon, PencilIcon } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import type { ChatMessage } from "@/lib/types";
import { MessageAction, MessageActions } from "./ai-elements/message";

type MessageActionsProps = {
  message: ChatMessage;
  isLoading: boolean;
  setMode?: (mode: "view" | "edit") => void;
};

export function PureMessageActions({
  message,
  isLoading,
  setMode,
}: MessageActionsProps) {
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) {
    return null;
  }

  const textFromParts = message.parts
    ?.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();

  const handleCopy = async () => {
    if (!textFromParts) {
      toast.error("There is no text to copy");
      return;
    }

    await copyToClipboard(textFromParts);
    toast.success("Copied to clipboard");
  };

  // User messages get edit (on hover) and copy actions
  if (message.role === "user") {
    return (
      <MessageActions className="justify-end">
        <div className="flex items-center gap-1">
          {setMode && (
            <MessageAction
              className="opacity-0 transition-opacity group-hover/message:opacity-100"
              data-testid="message-edit-button"
              onClick={() => setMode("edit")}
            >
              <PencilIcon size={16} />
            </MessageAction>
          )}
          <MessageAction
            className="opacity-0 transition-opacity group-hover/message:opacity-100"
            onClick={handleCopy}
          >
            <CopyIcon size={16} />
          </MessageAction>
        </div>
      </MessageActions>
    );
  }

  return (
    <MessageActions className="justify-start">
      <div className="flex items-center gap-1">
        <MessageAction onClick={handleCopy}>
          <CopyIcon />
        </MessageAction>
      </div>
    </MessageActions>
  );
}

export const MessageActionsMemo = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) {
      return false;
    }

    return true;
  }
);
