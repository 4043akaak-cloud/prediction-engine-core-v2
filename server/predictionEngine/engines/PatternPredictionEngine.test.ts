import { describe, it, expect, beforeEach } from "vitest";
import { PatternPredictionEngine } from "./PatternPredictionEngine";
import { PredictionRequest } from "../types";

describe("PatternPredictionEngine", () => {
  let engine: PatternPredictionEngine;

  beforeEach(() => {
    engine = new PatternPredictionEngine();
  });

  describe("Basic Prediction", () => {
    it("should predict with valid input", async () => {
      const request: PredictionRequest = {
        query: "the the the pattern pattern pattern",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);

      expect(result).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.reason).toBeDefined();
      expect(result.recipeUsed).toBe("pattern");
    });

    it("should reject empty query", async () => {
      const request: PredictionRequest = {
        query: "",
        recipeId: "pattern",
      };

      await expect(engine.predict(request)).rejects.toThrow("Pattern: Empty query");
    });

    it("should reject whitespace-only query", async () => {
      const request: PredictionRequest = {
        query: "   ",
        recipeId: "pattern",
      };

      await expect(engine.predict(request)).rejects.toThrow("Pattern: Empty query");
    });
  });

  describe("Mirror Pattern Detection", () => {
    it("should detect palindrome pattern", async () => {
      const request: PredictionRequest = {
        query: "racecar",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should detect near-palindrome pattern", async () => {
      const request: PredictionRequest = {
        query: "abccba",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);      expect(result.confidence).toBeGreaterThan(0.4);
    });
  });

  describe("Repeating Sequence Detection", () => {
    it("should detect repeating words", async () => {
      const request: PredictionRequest = {
        query: "hello hello hello world",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);

      expect(result.prediction).toContain("Repeating sequence");
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should detect consecutive repeating words", async () => {
      const request: PredictionRequest = {
        query: "test test test",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });

  describe("Cluster Detection", () => {
    it("should detect word clustering", async () => {
      const request: PredictionRequest = {
        query: "apple apple apple banana cherry",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.4);
    });
  });

  describe("Symmetry Detection", () => {
    it("should detect balanced word distribution", async () => {
      const request: PredictionRequest = {
        query: "one two three four five",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.4);
    });
  });

  describe("Metadata", () => {
    it("should include pattern-specific metadata", async () => {
      const request: PredictionRequest = {
        query: "test pattern detection",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.recipeId).toBe("pattern");
      expect(result.metadata?.recipeName).toBe("Pattern Prediction Engine");    });

    it("should include evidence count in metadata", async () => {
      const request: PredictionRequest = {
        query: "hello hello hello",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);

      expect(result.metadata?.evidenceCount).toBeGreaterThan(0);
    });
  });

  describe("Confidence Calculation", () => {
    it("should clamp confidence to [0, 1]", async () => {
      const request: PredictionRequest = {
        query: "test query for confidence",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it("should increase confidence with strong patterns", async () => {
      const strongPatternRequest: PredictionRequest = {
        query: "racecar racecar racecar",
        recipeId: "pattern",
      };

      const weakPatternRequest: PredictionRequest = {
        query: "random words here",
        recipeId: "pattern",
      };

      const strongResult = await engine.predict(strongPatternRequest);
      const weakResult = await engine.predict(weakPatternRequest);

      expect(strongResult.confidence).toBeGreaterThan(weakResult.confidence);
    });
  });

  describe("No Pattern Detection", () => {
    it("should handle random text without clear pattern", async () => {
      const request: PredictionRequest = {
        query: "the quick brown fox jumps over lazy dog",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe("Reason Generation", () => {
    it("should generate detailed reason string", async () => {
      const request: PredictionRequest = {
        query: "test pattern",
        recipeId: "pattern",
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain("Pattern analysis:");
      expect(result.reason).toContain("Strength:");
      expect(result.reason).toContain("Mirror score:");
      expect(result.reason).toContain("Sequence score:");
      expect(result.reason).toContain("Cluster score:");
      expect(result.reason).toContain("Symmetry score:");
      expect(result.reason).toContain("Evidence count:");
    });
  });

  describe("Prediction ID", () => {
    it("should generate unique prediction IDs", async () => {
      const request: PredictionRequest = {
        query: "same query",
        recipeId: "pattern",
      };

      const result1 = await engine.predict(request);
      const result2 = await engine.predict(request);

      expect(result1.id).not.toBe(result2.id);
      expect(result1.id).toMatch(/^pattern-/);
      expect(result2.id).toMatch(/^pattern-/);
    });
  });

  describe("Timestamp", () => {
    it("should include current timestamp", async () => {
      const request: PredictionRequest = {
        query: "test query",
        recipeId: "pattern",
      };

      const beforeTime = Date.now();
      const result = await engine.predict(request);
      const afterTime = Date.now();

      expect(result.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(result.timestamp).toBeLessThanOrEqual(afterTime);
    });
  });
});
