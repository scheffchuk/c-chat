import { gateway } from "@ai-sdk/gateway";
import { customProvider } from "ai";

export const myProvider = customProvider({
  languageModels: {
    "chat-model": gateway("google/gemini-2.5-pro"),
    "chat-model-reasoning": gateway("google/gemini-2.5-pro-thinking-exp"),
    "title-model": gateway("google/gemini-2.5-flash"),
    "artifact-model": gateway("anthropic/claude-sonnet-4.5"),
  },
});
