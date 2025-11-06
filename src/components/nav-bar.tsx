"use client";

import React from "react";
import { ThemeToggle } from "./theme-toggle";
import { Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";

export default function NavBar() {

  const { isLoading, isAuthenticated } = useStoreUserEffect();
  return (
    <nav className="flex-row items-center justify-between gap-4 px-2 pt-4 pb-2 hidden md:flex">
      <div className="flex items-center gap-4 ml-2">
        <div className="bg-primary h-6 w-[1px] -skew-12" />
        <p className="text-h3 text-red-400">C Chat</p>
      </div>
      <div className="flex items-center gap-3">
        {isLoading && (
          <Button className="border-none bg-primary/30 text-primary-foreground rounded-lg cursor-progress animate-pulse">Signing in...</Button>
        )}
        {!isLoading && !isAuthenticated && (
          <SignInButton mode="modal">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">Sign In</Button>
            </SignInButton>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
