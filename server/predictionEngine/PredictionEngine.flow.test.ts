import { describe, it, expect, beforeEach } from "vitest";
import { setupTestPredictionEngines } from "./testHelpers";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("PredictionEngine Complete Flow", () => {
  beforeEach(() => {
    setupTestPredictionEngines();
  });

  it("should complete end-to-end flow: Request → Engine → Registry → Executor → Confidence → Builder → Result", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Will the stock market go up?",
      recipeId: "mock-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("string");
    expect(result.prediction).toBeTypeOf("string");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it("should complete multi-recipe flow for all recipes", async () => {
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

  it("should verify RecipeOutput is properly mapped to PredictionResult", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Test query",
      recipeId: "mock-recipe",
    };

    const result = await engine.predict(request);

    expect(result.prediction).toBeDefined();
    expect(result.confidence).toBeDefined();
    expect(result.reason).toBeDefined();
    expect(result.recipeUsed).toBe("mock-recipe");
  });

  it("should handle errors gracefully in multi-recipe flow", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Test query",
      recipeId: "non-existent-recipe",
    };

    await expect(engine.predict(request)).rejects.toThrow();
  });
});
