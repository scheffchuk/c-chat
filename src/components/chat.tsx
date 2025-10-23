"use client";

import React from "react";
import { ChatHeader } from "./chat-header";
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
        <MultimodalInput input={""} setInput={() => {}} messages={[]} />
      </div>
    </>
  );
}
