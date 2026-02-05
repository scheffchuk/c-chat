"use client";

import { LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useAuth, useAuthActions } from "@/lib/auth-client";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function NavBar() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const { signOut } = useAuthActions();
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
          <Button
            asChild
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/signin">Sign In</Link>
          </Button>
        )}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2 px-2" variant="ghost">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {user.image ? (
                    <img
                      alt={user.name ?? "User"}
                      className="size-8 rounded-full"
                      height={32}
                      src={user.image}
                      width={32}
                    />
                  ) : (
                    <UserIcon size={16} />
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => signOut()}
              >
                <LogOutIcon className="mr-2" size={14} />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
