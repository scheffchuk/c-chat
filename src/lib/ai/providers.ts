import { customProvider, gateway } from "ai";

export const myProvider = customProvider({
  languageModels: {
    "chat-model": gateway.languageModel("google/gemini-2.5-pro"),
    "chat-model-reasoning": gateway.languageModel(
      "google/gemini-2.5-pro-thinking-exp"
    ),
    "title-model": gateway.languageModel("google/gemini-2.5-flash"),
    "artifact-model": gateway.languageModel("anthropic/claude-sonnet-4.5"),
  },
});
