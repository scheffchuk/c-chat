import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReasoningEffort = "none" | "low" | "medium" | "high";

interface ModelState {
  selectedModelId: string;
  setSelectedModel: (modelId: string) => void;

  reasoningEffort: ReasoningEffort;
  setReasoningEffort: (effort: ReasoningEffort) => void;

  maxSteps: number;
  setMaxSteps: (steps: number) => void;
}

export const useModelStore = create<ModelState>()(
  persist(
    (set) => ({
      selectedModelId: "openai/gpt-5",
      setSelectedModel: (modelId) => {
        set({ selectedModelId: modelId });
      },

      reasoningEffort: "none",
      setReasoningEffort: (effort) => {
        set({ reasoningEffort: effort });
      },

      maxSteps: 5,
      setMaxSteps: (steps) => {
        set({ maxSteps: Math.max(1, Math.min(10, steps)) });
      },
    }),
    {
      name: "model-store",
    }
  )
);
