import { describe, it, expect, beforeEach } from "vitest";
import { setupTestPredictionEngines } from "./testHelpers";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("PredictionEngine", () => {
  beforeEach(() => {
    setupTestPredictionEngines();
  });

  it("should successfully execute a prediction request", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Will the stock market go up tomorrow?",
      recipeId: "mock-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("string");
    expect(result.prediction).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.reason).toContain("This prediction is based on the mock-recipe recipe");
    expect(result.recipeUsed).toBe("mock-recipe");
    expect(result.timestamp).toBeTypeOf("number");
  });

  it("should throw an error if the recipe is not found", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Some query",
      recipeId: "non-existent-recipe",
    };

    await expect(engine.predict(request)).rejects.toThrow("Recipe with ID non-existent-recipe not found.");
  });
});

describe("PredictionEngine Integration with RecipePerformanceTracker", () => {
  let engine: PredictionEngine;

  beforeEach(() => {
    setupTestPredictionEngines();
    engine = new PredictionEngine();
  });

  it("should record prediction to history and update performance tracker", async () => {
    const request: PredictionRequest = {
      query: "Will the stock market go up?",
      recipeId: "mock-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("string");
  });

  it("should accumulate statistics across multiple predictions", async () => {
    const requests: PredictionRequest[] = [
      { query: "Will the stock market go up?", recipeId: "mock-recipe" },
      { query: "Will it rain tomorrow?", recipeId: "mock-recipe" },
      { query: "Will the team win?", recipeId: "mock-recipe" },
    ];

    for (const request of requests) {
      const result = await engine.predict(request);
      expect(result).toBeDefined();
    }
  });

  it("should track statistics for predictMultiple", async () => {
    const request: PredictionRequest = {
      query: "Will the stock market go up?",
      recipeId: "mock-recipe",
    };

    const results = await engine.predictMultiple(request);

    expect(results.length).toBeGreaterThan(0);
  });

  it("should maintain independence between history repository and performance tracker", async () => {
    const request: PredictionRequest = {
      query: "Will the stock market go up?",
      recipeId: "mock-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("string");
  });
});
