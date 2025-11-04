"use client";

import React from "react";
import { ChatHeader } from "./chat-header";
import PureMessages from "./messages";
import MultimodalInput from "./multimodal-input";
import { Unauthenticated } from "convex/react";
import { Authenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";

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
          <MultimodalInput input={""} setInput={() => {}} messages={[]} />
        </Authenticated>
        <Unauthenticated>
          <SignInButton mode="modal" />
        </Unauthenticated>
      </div>
    </>
  );
}
