"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { getModelById } from "@/lib/ai/model-config";
import { cn } from "@/lib/utils";
import { type ReasoningEffort, useModelStore } from "@/stores/model-store";

interface ReasoningControlsProps {
  modelId: string;
  className?: string;
}

export function ReasoningControls({
  modelId,
  className,
}: ReasoningControlsProps) {
  const model = useMemo(() => getModelById(modelId), [modelId]);
  const reasoningEffort = useModelStore((state) => state.reasoningEffort);
  const setReasoningEffort = useModelStore((state) => state.setReasoningEffort);
  const maxSteps = useModelStore((state) => state.maxSteps);
  const setMaxSteps = useModelStore((state) => state.setMaxSteps);

  const supportsReasoning = model?.reasoning === true;

  if (!supportsReasoning) {
    return null;
  }

  const efforts: ReasoningEffort[] = ["none", "low", "medium", "high"];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-muted-foreground text-xs">
          Reasoning Effort
        </label>
        <div className="flex gap-1">
          {efforts.map((effort) => (
            <Button
              className="flex-1 capitalize"
              key={effort}
              onClick={() => setReasoningEffort(effort)}
              size="sm"
              variant={reasoningEffort === effort ? "default" : "outline"}
            >
              {effort}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-muted-foreground text-xs">
          Max Steps: {maxSteps}
        </label>
        <input
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
          max="10"
          min="1"
          onChange={(e) => setMaxSteps(Number.parseInt(e.target.value, 10))}
          type="range"
          value={maxSteps}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
