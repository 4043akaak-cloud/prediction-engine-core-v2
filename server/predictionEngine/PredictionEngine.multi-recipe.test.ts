import { describe, it, expect, beforeEach } from "vitest";
import { setupTestPredictionEngines } from "./testHelpers";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("PredictionEngine Multiple Recipe Selection", () => {
  beforeEach(() => {
    setupTestPredictionEngines();
  });

  it("should execute MockRecipe independently", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Test query",
      recipeId: "mock-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.recipeUsed).toBe("mock-recipe");
  });

  it("should execute TrendRecipe independently", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Test query",
      recipeId: "trend-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.recipeUsed).toBe("trend-recipe");
  });

  it("should execute StatisticalRecipe independently", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Test query",
      recipeId: "statistical-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.recipeUsed).toBe("statistical-recipe");
  });

  it("should correctly identify selected recipe in PredictionResult", async () => {
    const engine = new PredictionEngine();

    const recipes = ["mock-recipe", "trend-recipe", "statistical-recipe"];

    for (const recipeId of recipes) {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId,
      };

      const result = await engine.predict(request);
      expect(result.recipeUsed).toBe(recipeId);
    }
  });
});
