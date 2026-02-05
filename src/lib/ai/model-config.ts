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
  minimax: { name: "MiniMax", logoId: "minimax" },
  moonshotai: { name: "Moonshot AI", logoId: "moonshotai" },
  alibaba: { name: "Alibaba", logoId: "alibaba cloud" },
};

export const POPULAR_MODEL_IDS = new Set([
  "openai/gpt-5",
  "anthropic/claude-opus-4.5",
  "google/gemini-2.5-pro",
  "moonshotai/kimi-k2.5",
  "alibaba/qwen3-max",
  "deepseek/deepseek-r1",
]);

export const DEFAULT_FAVORITES = [
  "openai/gpt-5",
  "anthropic/claude-opus-4.5",
  "google/gemini-2.5-pro",
  "moonshotai/kimi-k2.5",
  "alibaba/qwen3-max",
  "deepseek/deepseek-r1",
];

export const models: Model[] = [
  {
    id: "openai/gpt-5",
    name: "GPT-5",
    provider: "OpenAI",
    providerId: "openai",
    description:
      "OpenAI's flagship model with advanced reasoning and 400K context window.",
    reasoning: true,
    contextLength: 400_000,
    isPopular: true,
  },
  {
    id: "openai/gpt-5.2",
    name: "GPT-5.2",
    provider: "OpenAI",
    providerId: "openai",
    description:
      "OpenAI's latest flagship variant with improved reasoning capabilities.",
    reasoning: true,
  },
  {
    id: "openai/gpt-5.2-chat",
    name: "GPT-5.2 Chat",
    provider: "OpenAI",
    providerId: "openai",
    description: "OpenAI's GPT-5.2 optimized for conversational interactions.",
    reasoning: true,
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "OpenAI",
    providerId: "openai",
    description:
      "OpenAI's efficient flagship model optimized for speed and cost-effectiveness.",
    reasoning: true,
  },
  {
    id: "openai/o3",
    name: "o3",
    provider: "OpenAI",
    providerId: "openai",
    description:
      "OpenAI's advanced reasoning model with strong problem-solving abilities.",
    reasoning: true,
  },
  {
    id: "openai/o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    providerId: "openai",
    description:
      "OpenAI's lightweight reasoning model optimized for efficiency.",
    reasoning: true,
  },
  {
    id: "openai/o3-pro",
    name: "o3-pro",
    provider: "OpenAI",
    providerId: "openai",
    description:
      "OpenAI's professional-grade reasoning model with enhanced capabilities.",
    reasoning: true,
  },
  {
    id: "anthropic/claude-opus-4.5",
    name: "Claude Opus 4.5",
    provider: "Anthropic",
    providerId: "anthropic",
    description:
      "Anthropic's flagship model with 200K context, excellent for complex reasoning.",
    reasoning: true,
    contextLength: 200_000,
    isPopular: true,
  },
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    providerId: "anthropic",
    description:
      "Anthropic's balanced model with strong performance and efficiency.",
    reasoning: true,
  },
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    providerId: "anthropic",
    description: "Anthropic's fast and efficient model for quick responses.",
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    providerId: "google",
    description:
      "Google's flagship multimodal model with 1M context and advanced reasoning.",
    reasoning: true,
    contextLength: 1_000_000,
    isPopular: true,
  },
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    providerId: "google",
    description:
      "Google's fast flagship model with 1M context, optimized for speed.",
    reasoning: true,
    contextLength: 1_000_000,
  },
  {
    id: "google/gemini-2.5-flash-thinking",
    name: "Gemini 2.5 Flash Thinking",
    provider: "Google",
    providerId: "google",
    description:
      "Google's reasoning-optimized flash model with extended thinking capabilities.",
    reasoning: true,
    contextLength: 1_000_000,
  },
  {
    id: "google/gemini-3-flash",
    name: "Gemini 3 Flash",
    provider: "Google",
    providerId: "google",
    description:
      "Google's latest efficient model with strong multimodal capabilities.",
  },
  {
    id: "google/gemini-3-pro",
    name: "Gemini 3 Pro",
    provider: "Google",
    providerId: "google",
    description:
      "Google's latest flagship model with advanced reasoning and multimodal support.",
    reasoning: true,
  },
  {
    id: "xai/grok-4",
    name: "Grok 4",
    provider: "xAI",
    providerId: "xai",
    description:
      "xAI's latest flagship model with advanced reasoning and real-time knowledge.",
    reasoning: true,
  },
  {
    id: "xai/grok-3",
    name: "Grok 3",
    provider: "xAI",
    providerId: "xai",
    description:
      "xAI's flagship model with strong reasoning and conversational abilities.",
    reasoning: true,
  },
  {
    id: "meta/llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "Meta",
    providerId: "meta",
    description:
      "Meta's flagship open-weight model with strong reasoning capabilities.",
    reasoning: true,
  },
  {
    id: "meta/llama-4-scout",
    name: "Llama 4 Scout",
    provider: "Meta",
    providerId: "meta",
    description:
      "Meta's lightweight open-weight model optimized for efficiency.",
    reasoning: true,
  },
  {
    id: "mistralai/mistral-large-3",
    name: "Mistral Large 3",
    provider: "Mistral",
    providerId: "mistralai",
    description:
      "Mistral AI's flagship model with strong reasoning and multilingual support.",
    reasoning: true,
  },
  {
    id: "mistralai/mistral-nemo",
    name: "Mistral Nemo",
    provider: "Mistral",
    providerId: "mistralai",
    description: "Mistral AI's balanced model developed with NVIDIA.",
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
    id: "deepseek/deepseek-v3.2",
    name: "DeepSeek V3.2",
    provider: "DeepSeek",
    providerId: "deepseek",
    description:
      "DeepSeek's flagship open-source model with strong reasoning capabilities.",
    reasoning: true,
  },
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    providerId: "deepseek",
    description:
      "DeepSeek's reasoning model with excellent problem-solving abilities.",
    reasoning: true,
    isPopular: true,
  },
  {
    id: "cohere/command-a",
    name: "Command A",
    provider: "Cohere",
    providerId: "cohere",
    description:
      "Cohere's latest flagship model with strong conversational capabilities.",
  },
  {
    id: "minimax/minimax-m2.1",
    name: "MiniMax M2.1",
    provider: "MiniMax",
    providerId: "minimax",
    description:
      "MiniMax's flagship open-weight model with 230B total parameters, optimized for agents.",
    reasoning: true,
  },
  {
    id: "minimax/minimax-m2.1-lightning",
    name: "MiniMax M2.1 Lightning",
    provider: "MiniMax",
    providerId: "minimax",
    description:
      "MiniMax's fast variant of M2.1 optimized for speed and efficiency.",
    reasoning: true,
  },
  {
    id: "moonshotai/kimi-k2.5",
    name: "Kimi K2.5",
    provider: "Moonshot AI",
    providerId: "moonshotai",
    description:
      "Moonshot AI's flagship open-weight model with 1T parameters, native multimodal.",
    reasoning: true,
    isPopular: true,
  },
  {
    id: "moonshotai/kimi-k2-thinking",
    name: "Kimi K2 Thinking",
    provider: "Moonshot AI",
    providerId: "moonshotai",
    description:
      "Moonshot AI's reasoning-optimized variant with extended thinking capabilities.",
    reasoning: true,
  },
  {
    id: "alibaba/qwen3-max",
    name: "Qwen3 Max",
    provider: "Alibaba",
    providerId: "alibaba",
    description:
      "Alibaba's flagship open-weight model with 1T parameters, competitive with top models.",
    reasoning: true,
    isPopular: true,
  },
  {
    id: "alibaba/qwen3-235b-a22b-thinking",
    name: "Qwen3 235B Thinking",
    provider: "Alibaba",
    providerId: "alibaba",
    description:
      "Alibaba's reasoning model with 235B total parameters and 22B activated.",
    reasoning: true,
  },
];

export function getModelById(id: string): Model | undefined {
  return models.find((m) => m.id === id);
}

export function getModelsByProvider(providerId: string): Model[] {
  return models.filter((m) => m.providerId === providerId);
}

export const DEFAULT_CHAT_MODEL = "moonshotai/kimi-k2-thinking";
