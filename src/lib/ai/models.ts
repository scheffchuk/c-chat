export const DEFAULT_CHAT_MODEL: string = "openai/gpt-5";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  // OpenAI
  {
    id: "openai/gpt-5",
    name: "GPT-5",
    description:
      "OpenAI's flagship model with 400K context window and advanced reasoning capabilities.",
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    description:
      "OpenAI's efficient flagship model optimized for speed and cost-effectiveness.",
  },
  {
    id: "openai/gpt-5-codex",
    name: "GPT-5 Codex",
    description:
      "OpenAI's specialized model optimized for code generation and understanding.",
  },
  // Anthropic
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    description:
      "Anthropic's flagship model with 200K context, excellent for complex reasoning and coding.",
  },
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    description:
      "Anthropic's fast and efficient model, ideal for quick responses and simple tasks.",
  },
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    description:
      "Anthropic's previous generation flagship model with strong performance.",
  },
  // Google
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description:
      "Google's fast flagship model with 1M context window, optimized for speed and efficiency.",
  },
  {
    id: "google/gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    description:
      "Google's lightweight model with 1M context, perfect for cost-effective applications.",
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description:
      "Google's previous generation fast model with excellent performance.",
  },
  {
    id: "google/gemini-3-pro-image",
    name: "Gemini 3 Pro Image",
    description:
      "Google's specialized model for image generation and multimodal tasks.",
  },
  // xAI (Grok)
  {
    id: "xai/grok-3",
    name: "Grok 3",
    description:
      "xAI's flagship model with advanced reasoning and multimodal capabilities.",
  },
  {
    id: "xai/grok-3-mini",
    name: "Grok 3 Mini",
    description:
      "xAI's efficient model optimized for speed and cost-effectiveness.",
  },
  // Meta (Open Source)
  {
    id: "meta/llama-3.1-405b",
    name: "Llama 3.1 405B",
    description:
      "Meta's largest open-source flagship model with 405B parameters, excellent for complex tasks.",
  },
  {
    id: "meta/llama-3.1-70b",
    name: "Llama 3.1 70B",
    description:
      "Meta's powerful open-source model with 70B parameters, balanced performance and efficiency.",
  },
  {
    id: "meta/llama-3.2-90b",
    name: "Llama 3.2 90B",
    description:
      "Meta's latest open-source model with improved reasoning and multilingual capabilities.",
  },
  // Mistral AI (Open Source)
  {
    id: "mistralai/mistral-large",
    name: "Mistral Large",
    description:
      "Mistral AI's flagship model with strong reasoning capabilities and multilingual support.",
  },
  {
    id: "mistralai/mixtral-8x7b",
    name: "Mixtral 8x7B",
    description:
      "Mistral AI's efficient mixture-of-experts model, outperforms larger models in benchmarks.",
  },
  {
    id: "mistralai/mistral-small",
    name: "Mistral Small",
    description:
      "Mistral AI's fast and cost-effective model for everyday tasks.",
  },
  // DeepSeek (Open Source)
  {
    id: "deepseek/deepseek-v3",
    name: "DeepSeek V3",
    description:
      "DeepSeek's flagship open-source model optimized for mathematics, coding, and reasoning.",
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    description:
      "DeepSeek's conversational model with strong coding and reasoning capabilities.",
  },
  // Cohere
  {
    id: "cohere/command-r-plus",
    name: "Command R+",
    description:
      "Cohere's flagship model with strong multilingual capabilities and tool use.",
  },
  {
    id: "cohere/command-r",
    name: "Command R",
    description:
      "Cohere's efficient model optimized for retrieval-augmented generation (RAG).",
  },
  // 01.AI (Open Source)
  {
    id: "01-ai/yi-34b",
    name: "Yi 34B",
    description:
      "01.AI's flagship open-source model with strong multilingual and reasoning capabilities.",
  },
  {
    id: "01-ai/yi-6b",
    name: "Yi 6B",
    description:
      "01.AI's lightweight open-source model optimized for efficiency and speed.",
  },
];
