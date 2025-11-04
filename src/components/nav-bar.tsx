"use client";

import React from "react";
import { ThemeToggle } from "./theme-toggle";
import { Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function NavBar() {
  return (
    <nav className="flex-row items-center justify-between gap-4 px-2 pt-4 pb-2 hidden md:flex">
      <div className="flex items-center gap-4">
        <div className="bg-primary h-6 w-[1px] -skew-12" />
        <p className="text-h3 text-red-400">C Chat</p>
      </div>
      <div className="flex items-center gap-3">
        <Unauthenticated>
          <SignInButton mode="modal">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">Sign In</Button>
          </SignInButton>
        </Unauthenticated>
        <ThemeToggle />
      </div>
    </nav>
  );
}
