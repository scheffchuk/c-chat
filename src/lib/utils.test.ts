import { describe, expect, it } from "vitest";
import type { ChatMessage } from "./types";
import {
  cn,
  convertToUIMessages,
  getTextFromMessage,
  sanitizedText,
} from "./utils";

describe("cn (className utility)", () => {
  it("should merge tailwind classes correctly", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    expect(cn("base", isActive && "active")).toBe("base active");
  });

  it("should remove falsy values", () => {
    expect(cn("px-4", null, undefined, false, "py-2")).toBe("px-4 py-2");
  });

  it("should merge conflicting tailwind classes (last wins)", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });
});

describe("getTextFromMessage", () => {
  it("should extract text from text parts", () => {
    const message: ChatMessage = {
      id: "1",
      role: "assistant",
      parts: [{ type: "text", text: "Hello" }],
      metadata: { createdAt: Date.now() },
    };
    expect(getTextFromMessage(message)).toBe("Hello");
  });

  it("should concatenate multiple text parts", () => {
    const message: ChatMessage = {
      id: "1",
      role: "assistant",
      parts: [
        { type: "text", text: "Hello " },
        { type: "text", text: "World" },
      ],
      metadata: { createdAt: Date.now() },
    };
    expect(getTextFromMessage(message)).toBe("Hello World");
  });

  it("should skip non-text parts", () => {
    const message: ChatMessage = {
      id: "1",
      role: "assistant",
      parts: [
        { type: "text", text: "Start " },
        { type: "reasoning", text: "Thinking..." },
        { type: "text", text: "End" },
      ],
      metadata: { createdAt: Date.now() },
    };
    expect(getTextFromMessage(message)).toBe("Start End");
  });

  it("should return empty string for messages with no text parts", () => {
    const message: ChatMessage = {
      id: "1",
      role: "assistant",
      parts: [{ type: "reasoning", text: "Thinking..." }],
      metadata: { createdAt: Date.now() },
    };
    expect(getTextFromMessage(message)).toBe("");
  });
});

describe("sanitizedText", () => {
  it("should remove <has_function_call> markers", () => {
    expect(sanitizedText("Hello <has_function_call>World")).toBe("Hello World");
  });

  it("should handle text without markers", () => {
    expect(sanitizedText("Hello World")).toBe("Hello World");
  });

  it("should return empty string for undefined input", () => {
    expect(sanitizedText(undefined)).toBe("");
  });

  it("should return empty string for null input", () => {
    expect(sanitizedText(null)).toBe("");
  });

  it("should return empty string for empty string input", () => {
    expect(sanitizedText("")).toBe("");
  });
});

describe("convertToUIMessages", () => {
  it("should convert database messages to UI messages", () => {
    const dbMessages = [
      {
        _id: "msg1",
        role: "user",
        parts: [{ type: "text", text: "Hello" }],
        _creationTime: 1_234_567_890,
      },
      {
        _id: "msg2",
        role: "assistant",
        parts: [{ type: "text", text: "Hi there!" }],
        _creationTime: 1_234_567_891,
      },
    ];

    const result = convertToUIMessages(dbMessages as any);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: "msg1",
      role: "user",
      parts: [{ type: "text", text: "Hello" }],
      metadata: { createdAt: 1_234_567_890 },
    });
    expect(result[1]).toMatchObject({
      id: "msg2",
      role: "assistant",
      parts: [{ type: "text", text: "Hi there!" }],
      metadata: { createdAt: 1_234_567_891 },
    });
  });

  it("should handle empty array", () => {
    expect(convertToUIMessages([])).toEqual([]);
  });

  it("should preserve message part types", () => {
    const dbMessage = [
      {
        _id: "msg1",
        role: "assistant",
        parts: [
          { type: "text", text: "Hello" },
          { type: "reasoning", text: "Let me think..." },
        ],
        _creationTime: 1_234_567_890,
      },
    ];

    const result = convertToUIMessages(dbMessage as any);
    expect(result[0].parts).toHaveLength(2);
    expect(result[0].parts[0]).toMatchObject({ type: "text", text: "Hello" });
    expect(result[0].parts[1]).toMatchObject({
      type: "reasoning",
      text: "Let me think...",
    });
  });
});
