import { describe, expect, it } from "vitest";
import type { ErrorCode, Surface } from "./errors";
import {
  ChatSDKError,
  getMessageByErrorCode,
  visibilityBySurface,
} from "./errors";

describe("ChatSDKError", () => {
  describe("construction", () => {
    it("should parse error code into type and surface", () => {
      const error = new ChatSDKError("bad_request:api");
      expect(error.type).toBe("bad_request");
      expect(error.surface).toBe("api");
    });

    it("should store the cause", () => {
      const error = new ChatSDKError(
        "not_found:chat",
        "Chat ID 123 does not exist"
      );
      expect(error.cause).toBe("Chat ID 123 does not exist");
    });

    it("should set appropriate status codes", () => {
      expect(new ChatSDKError("bad_request:api").statusCode).toBe(400);
      expect(new ChatSDKError("unauthorized:auth").statusCode).toBe(401);
      expect(new ChatSDKError("forbidden:chat").statusCode).toBe(403);
      expect(new ChatSDKError("not_found:document").statusCode).toBe(404);
      expect(new ChatSDKError("rate_limit:chat").statusCode).toBe(429);
      expect(new ChatSDKError("offline:chat").statusCode).toBe(503);
    });

    it("should default to 500 for unknown error types", () => {
      expect(new ChatSDKError("unknown:api" as ErrorCode).statusCode).toBe(500);
    });
  });

  describe("error messages", () => {
    it("should generate appropriate messages for different error codes", () => {
      expect(new ChatSDKError("bad_request:api").message).toContain(
        "check your input"
      );
      expect(new ChatSDKError("unauthorized:auth").message).toContain(
        "sign in"
      );
      expect(new ChatSDKError("forbidden:chat").message).toContain(
        "belongs to another user"
      );
      expect(new ChatSDKError("rate_limit:chat").message).toContain("exceeded");
    });

    it("should use generic message for unknown error codes", () => {
      expect(new ChatSDKError("unknown:surface" as ErrorCode).message).toBe(
        "Something went wrong. Please try again later."
      );
    });
  });

  describe("toResponse", () => {
    it("should return JSON response for visible errors", () => {
      const error = new ChatSDKError("bad_request:api", "Invalid input");
      const response = error.toResponse();

      expect(response.status).toBe(400);
      expect(response.headers.get("content-type")).toContain(
        "application/json"
      );
    });

    it("should return generic message for database errors", () => {
      const error = new ChatSDKError("bad_request:database", "Query failed");
      const response = error.toResponse();

      expect(response.status).toBe(400);
      // Should not expose internal error details
      expect(error.message).toContain("database query");
    });

    it("should include error details in response body", async () => {
      const error = new ChatSDKError("not_found:chat", "Chat 123");
      const response = error.toResponse();
      const body = await response.json();

      expect(body.code).toBe("not_found:chat");
      expect(body.message).toContain("not found");
      expect(body.cause).toBe("Chat 123");
    });
  });
});

describe("getMessageByErrorCode", () => {
  it("should return database error message for any database surface error", () => {
    expect(getMessageByErrorCode("bad_request:database")).toContain(
      "database query"
    );
    expect(getMessageByErrorCode("unauthorized:database")).toContain(
      "database query"
    );
    expect(getMessageByErrorCode("rate_limit:database")).toContain(
      "database query"
    );
  });

  it("should return specific messages for known error codes", () => {
    expect(getMessageByErrorCode("bad_request:api")).toContain("request");
    expect(getMessageByErrorCode("unauthorized:auth")).toContain("sign in");
    expect(getMessageByErrorCode("rate_limit:chat")).toContain(
      "maximum number of messages"
    );
    expect(getMessageByErrorCode("offline:chat")).toContain(
      "internet connection"
    );
  });

  it("should return generic message for unknown codes", () => {
    expect(getMessageByErrorCode("unknown:unknown" as ErrorCode)).toBe(
      "Something went wrong. Please try again later."
    );
  });
});

describe("visibilityBySurface", () => {
  it("should mark database errors as log-only", () => {
    expect(visibilityBySurface.database).toBe("log");
  });

  it("should mark user-facing surfaces as response-visible", () => {
    const userFacingSurfaces: Surface[] = [
      "chat",
      "auth",
      "api",
      "stream",
      "history",
      "document",
      "suggestions",
      "activate_gateway",
    ];

    for (const surface of userFacingSurfaces) {
      expect(visibilityBySurface[surface]).toBe("response");
    }
  });

  it("should have visibility settings for all defined surfaces", () => {
    const surfaces: Surface[] = [
      "database",
      "chat",
      "auth",
      "api",
      "stream",
      "history",
      "document",
      "suggestions",
      "activate_gateway",
    ];

    for (const surface of surfaces) {
      expect(visibilityBySurface[surface]).toBeDefined();
      expect(["response", "log", "none"]).toContain(
        visibilityBySurface[surface]
      );
    }
  });
});
