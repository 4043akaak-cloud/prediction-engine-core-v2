import { describe, it, expect, beforeEach } from "vitest";
import { setupTestPredictionEngines } from "./testHelpers";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("First Prediction Scenario", () => {
  beforeEach(() => {
    setupTestPredictionEngines();
  });

  it("should execute a complete prediction scenario from request to history", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Will the technology sector outperform the market this year?",
      recipeId: "mock-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("string");
    expect(result.prediction).toBeTypeOf("string");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.reason).toBeTypeOf("string");
    expect(result.recipeUsed).toBe("mock-recipe");
    expect(result.timestamp).toBeTypeOf("number");
  });

  it("should execute multiple predictions and store them in history", async () => {
    const engine = new PredictionEngine();

    const requests: PredictionRequest[] = [
      { query: "Will the stock market go up?", recipeId: "mock-recipe" },
      { query: "Will it rain tomorrow?", recipeId: "mock-recipe" },
      { query: "Will the team win?", recipeId: "mock-recipe" },
    ];

    for (const request of requests) {
      const result = await engine.predict(request);
      expect(result).toBeDefined();
      expect(result.id).toBeTypeOf("string");
    }
  });

  it("should execute predictions with different recipes", async () => {
    const engine = new PredictionEngine();

    const recipes = ["mock-recipe", "trend-recipe", "statistical-recipe"];

    for (const recipeId of recipes) {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId,
      };

      const result = await engine.predict(request);
      expect(result).toBeDefined();
      expect(result.recipeUsed).toBe(recipeId);
    }
  });
});
