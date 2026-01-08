"use client";

import { motion } from "motion/react";
import { memo } from "react";
import { Suggestion } from "./ai-elements/suggestion";
import type { VisibilityType } from "./visibility-selector";

type SuggestedActionsProps = {
  setInput: (v: string) => void;
  selectedVisibilityType: VisibilityType;
};

function PureSuggestedActions({ setInput }: SuggestedActionsProps) {
  const suggestedActions = [
    "人生の意味とは何か?",
    "AI（人工知能）とは？",
    "How many 's' are in the word 'strawberry'?",
    "What is the weather in Tokyo today?",
  ];

  return (
    <div
      className="grid w-full gap-2 sm:grid-cols-2"
      data-testid="suggested-actions"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          key={suggestedAction}
          transition={{ delay: 0.05 * index }}
        >
          <Suggestion
            className="h-auto w-full whitespace-normal p-3 text-left"
            onClick={(suggestion) => setInput(suggestion)}
            suggestion={suggestedAction}
          >
            {suggestedAction}
          </Suggestion>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) =>
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType
);
