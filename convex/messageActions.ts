import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { generateText, UIMessage } from "ai";
import { myProvider } from "../src/lib/ai/providers";
import { titlePrompt } from "../src/lib/ai/prompt";
import { getTextFromMessage } from "../src/lib/utils";

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
