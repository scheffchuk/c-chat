"use client";

import { Authenticated } from "convex/react";
import PureMessages from "./messages";
import MultimodalInput from "./multimodal-input";

export default function Chat() {
  return (
    <>
      <div className="overscroll-behavior-contain flex h-full min-w-0 touch-pan-y flex-col">
        {/* <ChatHeader
          chatId={""}
          selectedVisibilityType={"private"}
          isReadonly={false}
        /> */}
        <PureMessages messages={[]} />
        {/* TODO: Artifacts */}
        <Authenticated>
          <div className="sticky z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
            <MultimodalInput input={""} messages={[]} setInput={() => {}} />
          </div>
        </Authenticated>
      </div>
    </>
  );
}
