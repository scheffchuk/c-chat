"use client";

import Chat from "@/components/chat";
import { UserButton } from "@clerk/nextjs";
import { Unauthenticated } from "convex/react";
import { Authenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <Chat />
    </>
  );
}
