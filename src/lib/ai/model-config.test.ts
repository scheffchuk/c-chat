import { describe, expect, it } from "vitest";
import {
  DEFAULT_CHAT_MODEL,
  DEFAULT_FAVORITES,
  getModelById,
  getModelsByProvider,
  models,
  POPULAR_MODEL_IDS,
  PROVIDER_INFO,
} from "./model-config";

describe("getModelById", () => {
  it("should return model by valid ID", () => {
    const model = getModelById("openai/gpt-5");
    expect(model).toBeDefined();
    expect(model?.name).toBe("GPT-5");
    expect(model?.provider).toBe("OpenAI");
  });

  it("should return undefined for non-existent model", () => {
    expect(getModelById("nonexistent/model")).toBeUndefined();
  });

  it("should find all reasoning models", () => {
    const reasoningModels = [
      "openai/gpt-5",
      "anthropic/claude-opus-4.5",
      "google/gemini-2.5-pro",
      "deepseek/deepseek-r1",
    ];

    for (const modelId of reasoningModels) {
      const model = getModelById(modelId);
      expect(model, `Model ${modelId} should exist`).toBeDefined();
      expect(model?.reasoning).toBe(true);
    }
  });
});

describe("getModelsByProvider", () => {
  it("should return all models for OpenAI", () => {
    const openaiModels = getModelsByProvider("openai");
    expect(openaiModels.length).toBeGreaterThan(0);
    expect(openaiModels.every((m) => m.providerId === "openai")).toBe(true);
  });

  it("should return empty array for non-existent provider", () => {
    expect(getModelsByProvider("nonexistent")).toEqual([]);
  });

  it("should return correct models for each provider", () => {
    const providers = ["openai", "anthropic", "google", "deepseek", "meta"];

    for (const provider of providers) {
      const providerModels = getModelsByProvider(provider);
      expect(
        providerModels.every((m) => m.providerId === provider),
        `All ${provider} models should have providerId "${provider}"`
      ).toBe(true);
    }
  });

  it("should return Google models for both 'google' and 'google' provider IDs", () => {
    // All models should use consistent providerId
    const googleModels = getModelsByProvider("google");
    expect(googleModels.length).toBeGreaterThan(0);
    expect(googleModels[0].provider).toBe("Google");
  });
});

describe("models array", () => {
  it("should not be empty", () => {
    expect(models.length).toBeGreaterThan(0);
  });

  it("should have unique IDs", () => {
    const ids = models.map((m) => m.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  it("should have required fields for all models", () => {
    for (const model of models) {
      expect(model.id).toBeDefined();
      expect(model.name).toBeDefined();
      expect(model.provider).toBeDefined();
      expect(model.providerId).toBeDefined();
    }
  });

  it("should have consistent provider and providerId", () => {
    for (const model of models) {
      // Provider should match providerId in PROVIDER_INFO
      const providerInfo = PROVIDER_INFO[model.providerId];
      expect(
        providerInfo,
        `Provider ${model.providerId} should exist in PROVIDER_INFO`
      ).toBeDefined();
    }
  });

  it("should have at least some reasoning models", () => {
    const reasoningModels = models.filter((m) => m.reasoning);
    expect(reasoningModels.length).toBeGreaterThan(0);
  });
});

describe("PROVIDER_INFO", () => {
  it("should have name and logoId for all providers", () => {
    for (const [key, info] of Object.entries(PROVIDER_INFO)) {
      expect(info.name).toBeDefined();
      expect(info.logoId).toBeDefined();
    }
  });

  it("should have entries for all used providerIds in models", () => {
    const usedProviderIds = new Set(models.map((m) => m.providerId));

    for (const providerId of usedProviderIds) {
      expect(
        PROVIDER_INFO[providerId],
        `Provider ${providerId} should have info in PROVIDER_INFO`
      ).toBeDefined();
    }
  });

  it("should have some known providers", () => {
    expect(PROVIDER_INFO.openai).toMatchObject({
      name: "OpenAI",
      logoId: "openai",
    });
    expect(PROVIDER_INFO.anthropic).toMatchObject({
      name: "Anthropic",
      logoId: "anthropic",
    });
    expect(PROVIDER_INFO.google).toMatchObject({
      name: "Google",
      logoId: "google",
    });
  });

  it("should handle alias providers correctly", () => {
    // x-ai and xai should both point to xAI
    expect(PROVIDER_INFO["x-ai"]).toMatchObject({ name: "xAI", logoId: "xai" });
    expect(PROVIDER_INFO.xai).toMatchObject({ name: "xAI", logoId: "xai" });

    // meta-llama and meta should both point to Meta
    expect(PROVIDER_INFO["meta-llama"]).toMatchObject({
      name: "Meta Llama",
      logoId: "llama",
    });
    expect(PROVIDER_INFO.meta).toMatchObject({ name: "Meta", logoId: "llama" });
  });
});

describe("POPULAR_MODEL_IDS", () => {
  it("should contain all expected popular models", () => {
    expect(POPULAR_MODEL_IDS.has("openai/gpt-5")).toBe(true);
    expect(POPULAR_MODEL_IDS.has("anthropic/claude-opus-4.5")).toBe(true);
    expect(POPULAR_MODEL_IDS.has("google/gemini-2.5-pro")).toBe(true);
    expect(POPULAR_MODEL_IDS.has("deepseek/deepseek-r1")).toBe(true);
  });

  it("should only contain existing models", () => {
    for (const modelId of POPULAR_MODEL_IDS) {
      const model = getModelById(modelId);
      expect(model, `Popular model ${modelId} should exist`).toBeDefined();
    }
  });

  it("should match isPopular flag on models", () => {
    const popularModelsFromArray = models
      .filter((m) => m.isPopular)
      .map((m) => m.id);
    const popularModelsFromSet = [...POPULAR_MODEL_IDS];

    expect(popularModelsFromArray.sort()).toEqual(popularModelsFromSet.sort());
  });
});

describe("DEFAULT_FAVORITES", () => {
  it("should contain expected favorite models", () => {
    expect(DEFAULT_FAVORITES).toContain("openai/gpt-5");
    expect(DEFAULT_FAVORITES).toContain("anthropic/claude-opus-4.5");
    expect(DEFAULT_FAVORITES).toContain("google/gemini-2.5-pro");
  });

  it("should only contain existing models", () => {
    for (const modelId of DEFAULT_FAVORITES) {
      const model = getModelById(modelId);
      expect(model, `Default favorite ${modelId} should exist`).toBeDefined();
    }
  });

  it("should match popular models", () => {
    expect(DEFAULT_FAVORITES.sort()).toEqual([...POPULAR_MODEL_IDS].sort());
  });
});

describe("DEFAULT_CHAT_MODEL", () => {
  it("should be a valid model ID", () => {
    const model = getModelById(DEFAULT_CHAT_MODEL);
    expect(model).toBeDefined();
  });

  it("should be a reasoning model", () => {
    const model = getModelById(DEFAULT_CHAT_MODEL);
    expect(model?.reasoning).toBe(true);
  });

  it("should be the expected default model", () => {
    expect(DEFAULT_CHAT_MODEL).toBe("moonshotai/kimi-k2-thinking");
  });
});
