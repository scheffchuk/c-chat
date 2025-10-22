import { ChatHeader } from "@/components/chat-header";

export default function Page() {
  return (
    <>
      <div className="overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col bg-background">
        <ChatHeader chatId={""} selectedVisibilityType={"private"} isReadonly={false} />
      </div>
    </>
  );
}
