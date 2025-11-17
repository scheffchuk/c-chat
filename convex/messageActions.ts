import { generateText, type UIMessage } from "ai";
import { v } from "convex/values";
import { titlePrompt } from "../src/lib/ai/prompt";
import { myProvider } from "../src/lib/ai/providers";
import { getTextFromMessage } from "../src/lib/utils";
import { internalAction } from "./_generated/server";

export const generateTitleFromUserMessage = internalAction({
  args: {
    message: v.object({
      parts: v.array(v.object({ type: v.literal("text"), text: v.string() })),
    }),
  },
  returns: v.string(),
  handler: async (ctx, args): Promise<string> => {
    const { text: title } = await generateText({
      model: myProvider.languageModel("title-model"),
      system: titlePrompt,
      prompt: getTextFromMessage(args.message as unknown as UIMessage),
    });
    return title;
  },
});
