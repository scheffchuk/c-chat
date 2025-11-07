"use client";

import { SignInButton } from "@clerk/nextjs";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export default function NavBar() {
  const { isLoading, isAuthenticated } = useStoreUserEffect();
  return (
    <nav className="hidden flex-row items-center justify-between gap-4 px-2 pt-4 pb-2 md:flex">
      <div className="ml-2 flex items-center gap-4">
        <div className="-skew-12 h-6 w-[1px] bg-primary" />
        <p className="text-h3 text-red-400">C Chat</p>
      </div>
      <div className="flex items-center gap-3">
        {isLoading && (
          <Button className="animate-pulse cursor-progress rounded-lg border-none bg-primary/30 text-primary-foreground">
            Signing in...
          </Button>
        )}
        {!(isLoading || isAuthenticated) && (
          <SignInButton mode="modal">
            <Button className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          </SignInButton>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
