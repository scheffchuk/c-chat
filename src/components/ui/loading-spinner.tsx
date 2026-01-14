"use client";

import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  variant?: "simple" | "enhanced" | "dots";
  className?: string;
};

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function LoadingSpinner({
  size = "md",
  variant = "enhanced",
  className,
}: LoadingSpinnerProps) {
  const iconSize = sizeClasses[size];

  if (variant === "simple") {
    return <Loader2Icon className={cn(iconSize, "animate-spin", className)} />;
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <div className="size-1.5 animate-pulse rounded-full bg-primary" />
        <div
          className="size-1.5 animate-pulse rounded-full bg-primary"
          style={{ animationDelay: "75ms" }}
        />
        <div
          className="size-1.5 animate-pulse rounded-full bg-primary"
          style={{ animationDelay: "150ms" }}
        />
      </div>
    );
  }

  // Enhanced variant (default)
  return (
    <div className={cn("relative", className)}>
      <Loader2Icon className={cn(iconSize, "animate-spin")} />
      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
    </div>
  );
}
