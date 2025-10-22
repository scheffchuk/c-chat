import { Conversation, ConversationContent } from "./ai-elements/conversation";
import Greeting from "./greeting";

export default function PureMessages({ messages }: { messages: string[] }) {
  return (
    <div className="overscroll-behavior-contain -webkit-overflow-scrolling-touch flex-1 touch-pan-y overflow-y-scroll">
      <Conversation className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 md:gap-6">
        <ConversationContent>
          {messages.length === 0 && <Greeting />}
        </ConversationContent>
      </Conversation>
    </div>
  )
}