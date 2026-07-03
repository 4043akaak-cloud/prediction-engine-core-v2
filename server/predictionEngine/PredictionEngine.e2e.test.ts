import { describe, it, expect } from "vitest";
import { PredictionEngine } from "./PredictionEngine";
import { RecipeRegistry } from "./RecipeRegistry";
import { PredictionRequest } from "./types";

describe("PredictionEngine E2E Verification", () => {
  it("should execute complete pipeline with MockRecipe", async () => {
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
    expect(result.reason).toBeDefined();
    expect(result.recipeUsed).toBe("mock-recipe");
    expect(result.timestamp).toBeTypeOf("number");
  });

  it("should execute complete pipeline with TrendRecipe", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "What is the trend in technology stocks?",
      recipeId: "trend-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("string");
    expect(result.prediction).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.reason).toBeDefined();
    expect(result.recipeUsed).toBe("trend-recipe");
    expect(result.timestamp).toBeTypeOf("number");
  });

  it("should execute complete pipeline with StatisticalRecipe", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "What is the statistical probability of market volatility?",
      recipeId: "statistical-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("string");
    expect(result.prediction).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.reason).toBeDefined();
    expect(result.recipeUsed).toBe("statistical-recipe");
    expect(result.timestamp).toBeTypeOf("number");
  });

  it("should verify all recipes are registered", () => {
    const registry = RecipeRegistry.getInstance();
    const allRecipes = registry.getAllRecipes();

    expect(allRecipes).toHaveLength(3);
    expect(allRecipes.some((r) => r.id === "mock-recipe")).toBe(true);
    expect(allRecipes.some((r) => r.id === "trend-recipe")).toBe(true);
    expect(allRecipes.some((r) => r.id === "statistical-recipe")).toBe(true);
  });

  it("should verify recipe metadata is available", () => {
    const registry = RecipeRegistry.getInstance();
    const allMetadata = registry.getAllRecipeMetadata();

    expect(allMetadata).toHaveLength(3);

    const mockMetadata = allMetadata.find((m) => m.id === "mock-recipe");
    expect(mockMetadata).toBeDefined();
    expect(mockMetadata?.version).toBe("1.0.0");
    expect(mockMetadata?.category).toBe("mock");

    const trendMetadata = allMetadata.find((m) => m.id === "trend-recipe");
    expect(trendMetadata).toBeDefined();
    expect(trendMetadata?.version).toBe("1.0.0");
    expect(trendMetadata?.category).toBe("trend");

    const statisticalMetadata = allMetadata.find((m) => m.id === "statistical-recipe");
    expect(statisticalMetadata).toBeDefined();
    expect(statisticalMetadata?.version).toBe("1.0.0");
    expect(statisticalMetadata?.category).toBe("statistical");
  });

  it("should handle invalid recipe ID gracefully", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Some query",
      recipeId: "invalid-recipe-id",
    };

    await expect(engine.predict(request)).rejects.toThrow(
      "Recipe with ID invalid-recipe-id not found."
    );
  });
});
