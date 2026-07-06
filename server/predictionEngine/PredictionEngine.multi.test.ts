import { describe, it, expect, beforeEach } from "vitest";
import { setupTestPredictionEngines } from "./testHelpers";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("PredictionEngine Multi-Prediction Execution", () => {
  beforeEach(() => {
    setupTestPredictionEngines();
  });

  it("should execute multiple predictions sequentially", async () => {
    const engine = new PredictionEngine();

    const requests: PredictionRequest[] = [
      { query: "Will the stock market go up?", recipeId: "mock-recipe" },
      { query: "Will it rain tomorrow?", recipeId: "trend-recipe" },
      { query: "Will the team win?", recipeId: "statistical-recipe" },
    ];

    for (const request of requests) {
      const result = await engine.predict(request);
      expect(result).toBeDefined();
    }
  });

  it("should track multiple predictions independently", async () => {
    const engine = new PredictionEngine();

    const request1 = await engine.predict({
      query: "Query 1",
      recipeId: "mock-recipe",
    });

    const request2 = await engine.predict({
      query: "Query 2",
      recipeId: "trend-recipe",
    });

    expect(request1.id).not.toBe(request2.id);
  });
});
