import { cookies } from "next/headers";
import Chat from "@/components/chat";

export default async function Page() {
  const id = crypto.randomUUID();
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  if (!modelIdFromCookie) {
    return (
      <Chat
        id={id}
        initialChatModel="chat-model"
        initialMessages={[]}
        initialVisibilityType="private"
        isReadonly={false}
        key={id}
      />
      // <DataStreamHandler />
    );
  }
}
