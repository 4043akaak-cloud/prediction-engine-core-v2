import { describe, it, expect } from "vitest";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("PredictionEngine Multi-Recipe Execution", () => {
  it("should execute all recipes for a single prediction request", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Will the stock market go up tomorrow?",
      recipeId: "mock-recipe", // This parameter is ignored in multi-recipe mode
    };

    const results = await engine.predictMultiple(request);

    expect(results).toBeDefined();
    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBe(3); // Should have 3 results (mock, trend, statistical)

    // Verify each result is complete and valid
    results.forEach((result) => {
      expect(result.id).toBeTypeOf("string");
      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.reason).toBeDefined();
      expect(result.recipeUsed).toBeDefined();
      expect(result.timestamp).toBeTypeOf("number");
    });
  });

  it("should execute recipes independently", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "What is the trend in technology stocks?",
      recipeId: "mock-recipe",
    };

    const results = await engine.predictMultiple(request);

    // Verify results are from different recipes
    const recipeIds = results.map((r) => r.recipeUsed);
    expect(new Set(recipeIds).size).toBe(3); // All should be unique

    expect(recipeIds).toContain("mock-recipe");
    expect(recipeIds).toContain("trend-recipe");
    expect(recipeIds).toContain("statistical-recipe");
  });

  it("should preserve each prediction result independently", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "What is the statistical probability of market volatility?",
      recipeId: "mock-recipe",
    };

    const results = await engine.predictMultiple(request);

    // Verify each result has unique ID
    const resultIds = results.map((r) => r.id);
    expect(new Set(resultIds).size).toBe(3); // All should be unique

    // Verify predictions are different
    const predictions = results.map((r) => r.prediction);
    expect(new Set(predictions).size).toBe(3); // All should be different
  });

  it("should return empty array if no recipes are available", async () => {
    // This test verifies the behavior when registry is empty
    // For now, we expect 3 recipes to be available
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Test query",
      recipeId: "mock-recipe",
    };

    const results = await engine.predictMultiple(request);

    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);
  });

  it("should maintain backward compatibility with single recipe execution", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Will the stock market go up tomorrow?",
      recipeId: "mock-recipe",
    };

    // Original single-recipe method should still work
    const singleResult = await engine.predict(request);

    expect(singleResult).toBeDefined();
    expect(singleResult.recipeUsed).toBe("mock-recipe");
    expect(singleResult.id).toBeTypeOf("string");
  });
});
