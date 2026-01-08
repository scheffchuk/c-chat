import { createUIMessageStream, JsonToSseTransformStream } from "ai";
import { fetchQuery } from "convex/nextjs";
import { differenceInSeconds } from "date-fns";
import { getAuthContext } from "@/lib/auth-server";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import { api } from "../../../../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { getStreamContext } from "../../route";

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: complex stream resumption logic
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: chatId } = await params;
  const streamContext = getStreamContext();

  const resumeRequestedAt = new Date();

  if (!streamContext) {
    return new Response(null, { status: 204 });
  }

  if (!chatId) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  // Single auth check
  const token = await getAuthContext();
  if (!token) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  let chat: Doc<"chats"> | null = null;

  try {
    chat = await fetchQuery(
      api.chats.getChatById,
      { chatId: chatId as Id<"chats"> },
      { token }
    );
  } catch {
    return new ChatSDKError("not_found:chat").toResponse();
  }

  if (!chat) {
    return new ChatSDKError("not_found:chat").toResponse();
  }

  // Get current user to check ownership
  const user = await fetchQuery(api.users.getCurrentUser, {}, { token });
  if (chat.visibility === "private" && chat.userId !== user?._id) {
    return new ChatSDKError("forbidden:chat").toResponse();
  }

  const streamIds = await fetchQuery(
    api.streams.getStreamByChatId,
    { chatId: chatId as Id<"chats"> },
    { token }
  );

  if (streamIds.length === 0) {
    return new ChatSDKError("not_found:stream").toResponse();
  }

  const recentStreamId = streamIds.at(-1);

  if (!recentStreamId) {
    return new ChatSDKError("not_found:stream").toResponse();
  }

  const emptyDataStream = createUIMessageStream<ChatMessage>({
    // biome-ignore lint/suspicious/noEmptyBlockStatements: "Has to be empty"
    execute: () => {},
  });

  const stream = await streamContext.resumableStream(recentStreamId, () =>
    emptyDataStream.pipeThrough(new JsonToSseTransformStream())
  );

  if (!stream) {
    const messages = await fetchQuery(
      api.messages.getMessagesByChatId,
      { chatId: chatId as Id<"chats"> },
      { token }
    );
    const mostRecentMessage = messages.at(-1);

    if (!mostRecentMessage) {
      return new Response(emptyDataStream, { status: 200 });
    }

    if (mostRecentMessage.role !== "assistant") {
      return new Response(emptyDataStream, { status: 200 });
    }

    const messageCreatedAt = new Date(mostRecentMessage._creationTime);

    if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
      return new Response(emptyDataStream, { status: 200 });
    }

    const restoredStream = createUIMessageStream<ChatMessage>({
      execute: ({ writer }) => {
        writer.write({
          type: "data-appendMessage",
          data: JSON.stringify(mostRecentMessage),
          transient: true,
        });
      },
    });

    return new Response(
      restoredStream.pipeThrough(new JsonToSseTransformStream()),
      { status: 200 }
    );
  }
  return new Response(stream, { status: 200 });
}
