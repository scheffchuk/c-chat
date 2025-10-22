"use client";

import React from 'react'
import { ChatHeader } from './chat-header';

export default function Chat() {
  return (
    <>
    <div className='overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col bg-background'>
      <ChatHeader chatId={""} selectedVisibilityType={"private"} isReadonly={false} />
      {/* <Messages/> */}
      {/* TODO: MultimodalInput */}
      {/* TODO: Artifacts */}
    </div>
    </>
  )
}
