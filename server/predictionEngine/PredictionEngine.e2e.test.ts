import { describe, it, expect, beforeEach } from "vitest";
import { setupTestPredictionEngines } from "./testHelpers";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("PredictionEngine E2E Verification", () => {
  beforeEach(() => {
    setupTestPredictionEngines();
  });

  it("should execute complete pipeline with MockRecipe", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Will the stock market go up?",
      recipeId: "mock-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.recipeUsed).toBe("mock-recipe");
  });

  it("should execute complete pipeline with TrendRecipe", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Will the stock market go up?",
      recipeId: "trend-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.recipeUsed).toBe("trend-recipe");
  });

  it("should execute complete pipeline with StatisticalRecipe", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Will the stock market go up?",
      recipeId: "statistical-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.recipeUsed).toBe("statistical-recipe");
  });
});
