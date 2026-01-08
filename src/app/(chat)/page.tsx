import { cookies } from "next/headers";
import Chat from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";

export default async function Page() {
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");
  const selectedModel = modelIdFromCookie?.value ?? DEFAULT_CHAT_MODEL;

  return (
    <Chat
      initialChatModel={selectedModel}
      initialMessages={[]}
      initialVisibilityType="private"
      isReadonly={false}
    />
  );
}
