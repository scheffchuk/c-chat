export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Grok Vision",
    description:
      "Grok Vision is a chat model that can see and understand images.",
  },
  {
    id: "chat-model-reasoning",
    name: "Grok Reasoning",
    description:
      "Grok Reasoning is a chat model that can reason and understand images.",
  },
];
