export interface Model {
  id: string;
  name: string;
  provider: string;
  providerId: string;
  description?: string;
  contextLength?: number;
  modality?: string;
  reasoning?: boolean;
  isPopular?: boolean;
}

export const PROVIDER_INFO: Record<string, { name: string; logoId: string }> = {
  openai: { name: "OpenAI", logoId: "openai" },
  anthropic: { name: "Anthropic", logoId: "anthropic" },
  google: { name: "Google", logoId: "google" },
  "meta-llama": { name: "Meta Llama", logoId: "llama" },
  meta: { name: "Meta", logoId: "llama" },
  mistralai: { name: "Mistral", logoId: "mistral" },
  deepseek: { name: "DeepSeek", logoId: "deepseek" },
  "x-ai": { name: "xAI", logoId: "xai" },
  xai: { name: "xAI", logoId: "xai" },
  cohere: { name: "Cohere", logoId: "cohere" },
  "01-ai": { name: "01.AI", logoId: "01ai" },
};

export const POPULAR_MODEL_IDS = new Set([
  "anthropic/claude-sonnet-4.5",
  "anthropic/claude-haiku-4.5",
  "openai/gpt-5",
  "openai/gpt-5-mini",
  "google/gemini-2.5-flash",
  "deepseek/deepseek-v3",
  "deepseek/deepseek-chat",
  "meta/llama-3.1-405b",
  "xai/grok-3",
  "mistralai/mistral-large",
]);

export const DEFAULT_FAVORITES = [
  "anthropic/claude-sonnet-4.5",
  "openai/gpt-5",
  "google/gemini-2.5-flash",
  "deepseek/deepseek-chat",
];

function extractProviderId(modelId: string): string {
  const parts = modelId.split("/");
  return parts[0] || "unknown";
}

function getProviderInfo(providerId: string) {
  return (
    PROVIDER_INFO[providerId] || {
      name: providerId.charAt(0).toUpperCase() + providerId.slice(1),
      logoId: providerId,
    }
  );
}

export const models: Model[] = [
  {
    id: "openai/gpt-5",
    name: "GPT-5",
    provider: "OpenAI",
    providerId: "openai",
    description:
      "OpenAI's flagship model with 400K context window and advanced reasoning capabilities.",
    reasoning: true,
    isPopular: true,
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "OpenAI",
    providerId: "openai",
    description:
      "OpenAI's efficient flagship model optimized for speed and cost-effectiveness.",
    reasoning: true,
    isPopular: true,
  },
  {
    id: "openai/gpt-5-codex",
    name: "GPT-5 Codex",
    provider: "OpenAI",
    providerId: "openai",
    description:
      "OpenAI's specialized model optimized for code generation and understanding.",
    reasoning: true,
  },
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    providerId: "anthropic",
    description:
      "Anthropic's flagship model with 200K context, excellent for complex reasoning and coding.",
    isPopular: true,
  },
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    providerId: "anthropic",
    description:
      "Anthropic's fast and efficient model, ideal for quick responses and simple tasks.",
    isPopular: true,
  },
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    providerId: "anthropic",
    description:
      "Anthropic's previous generation flagship model with strong performance.",
  },
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    providerId: "google",
    description:
      "Google's fast flagship model with 1M context window, optimized for speed and efficiency.",
    isPopular: true,
  },
  {
    id: "google/gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    provider: "Google",
    providerId: "google",
    description:
      "Google's lightweight model with 1M context, perfect for cost-effective applications.",
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    providerId: "google",
    description:
      "Google's previous generation fast model with excellent performance.",
  },
  {
    id: "google/gemini-3-pro-image",
    name: "Gemini 3 Pro Image",
    provider: "Google",
    providerId: "google",
    description:
      "Google's specialized model for image generation and multimodal tasks.",
    modality: "image",
  },
  {
    id: "xai/grok-3",
    name: "Grok 3",
    provider: "xAI",
    providerId: "xai",
    description:
      "xAI's flagship model with advanced reasoning and multimodal capabilities.",
    isPopular: true,
  },
  {
    id: "xai/grok-3-mini",
    name: "Grok 3 Mini",
    provider: "xAI",
    providerId: "xai",
    description:
      "xAI's efficient model optimized for speed and cost-effectiveness.",
  },
  {
    id: "meta/llama-3.1-405b",
    name: "Llama 3.1 405B",
    provider: "Meta",
    providerId: "meta",
    description:
      "Meta's largest open-source flagship model with 405B parameters, excellent for complex tasks.",
  },
  {
    id: "meta/llama-3.1-70b",
    name: "Llama 3.1 70B",
    provider: "Meta",
    providerId: "meta",
    description:
      "Meta's powerful open-source model with 70B parameters, balanced performance and efficiency.",
  },
  {
    id: "meta/llama-3.2-90b",
    name: "Llama 3.2 90B",
    provider: "Meta",
    providerId: "meta",
    description:
      "Meta's latest open-source model with improved reasoning and multilingual capabilities.",
  },
  {
    id: "mistralai/mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    providerId: "mistralai",
    description:
      "Mistral AI's flagship model with strong reasoning capabilities and multilingual support.",
  },
  {
    id: "mistralai/mixtral-8x7b",
    name: "Mixtral 8x7B",
    provider: "Mistral",
    providerId: "mistralai",
    description:
      "Mistral AI's efficient mixture-of-experts model, outperforms larger models in benchmarks.",
  },
  {
    id: "mistralai/mistral-small",
    name: "Mistral Small",
    provider: "Mistral",
    providerId: "mistralai",
    description:
      "Mistral AI's fast and cost-effective model for everyday tasks.",
  },
  {
    id: "deepseek/deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    providerId: "deepseek",
    description:
      "DeepSeek's flagship open-source model optimized for mathematics, coding, and reasoning.",
    reasoning: true,
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    providerId: "deepseek",
    description:
      "DeepSeek's conversational model with strong coding and reasoning capabilities.",
    isPopular: true,
  },
  {
    id: "cohere/command-r-plus",
    name: "Command R+",
    provider: "Cohere",
    providerId: "cohere",
    description:
      "Cohere's flagship model with strong multilingual capabilities and tool use.",
  },
  {
    id: "cohere/command-r",
    name: "Command R",
    provider: "Cohere",
    providerId: "cohere",
    description:
      "Cohere's efficient model optimized for retrieval-augmented generation (RAG).",
  },
  {
    id: "01-ai/yi-34b",
    name: "Yi 34B",
    provider: "01.AI",
    providerId: "01-ai",
    description:
      "01.AI's flagship open-source model with strong multilingual and reasoning capabilities.",
  },
  {
    id: "01-ai/yi-6b",
    name: "Yi 6B",
    provider: "01.AI",
    providerId: "01-ai",
    description:
      "01.AI's lightweight open-source model optimized for efficiency and speed.",
  },
];

export function getModelById(id: string): Model | undefined {
  return models.find((m) => m.id === id);
}

export function getModelsByProvider(providerId: string): Model[] {
  return models.filter((m) => m.providerId === providerId);
}

export const DEFAULT_CHAT_MODEL = "openai/gpt-5";
