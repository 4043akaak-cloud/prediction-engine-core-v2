import { describe, it, expect } from "vitest";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";
import { RecipeRegistry } from "./RecipeRegistry";

describe("PredictionEngine Multiple Recipe Selection", () => {
  it("should verify all registered recipes are available", () => {
    const registry = RecipeRegistry.getInstance();
    const allMetadata = registry.getAllRecipeMetadata();

    expect(allMetadata).toHaveLength(3);
    expect(allMetadata.map((m) => m.id)).toContain("mock-recipe");
    expect(allMetadata.map((m) => m.id)).toContain("trend-recipe");
    expect(allMetadata.map((m) => m.id)).toContain("statistical-recipe");
  });

  it("should execute MockRecipe independently", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Will the market go up?",
      recipeId: "mock-recipe",
    };

    const result = await engine.predict(request);

    expect(result.recipeUsed).toBe("mock-recipe");
    expect(result.prediction).toContain("Mock Prediction");
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it("should execute TrendRecipe independently", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "What is the trend direction?",
      recipeId: "trend-recipe",
    };

    const result = await engine.predict(request);

    expect(result.recipeUsed).toBe("trend-recipe");
    expect(result.prediction).toBeDefined();
    expect(result.prediction.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.reason).toContain("trend-recipe");
  });

  it("should execute StatisticalRecipe independently", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "What is the statistical probability?",
      recipeId: "statistical-recipe",
    };

    const result = await engine.predict(request);

    expect(result.recipeUsed).toBe("statistical-recipe");
    expect(result.prediction).toBeDefined();
    expect(result.prediction.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.reason).toContain("statistical-recipe");
  });

  it("should correctly identify selected recipe in PredictionResult", async () => {
    const engine = new PredictionEngine();

    // Test each recipe
    const recipes = ["mock-recipe", "trend-recipe", "statistical-recipe"];

    for (const recipeId of recipes) {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId,
      };

      const result = await engine.predict(request);

      // Verify recipe identification
      expect(result.recipeUsed).toBe(recipeId);

      // Verify all required fields are present
      expect(result.id).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.reason).toBeDefined();
      expect(result.timestamp).toBeDefined();

      // Verify recipe is mentioned in reason
      expect(result.reason).toContain(recipeId);
    }
  });

  it("should demonstrate recipe switching without engine modification", async () => {
    const engine = new PredictionEngine();
    const query = "Test query for recipe switching";

    // Execute with MockRecipe
    const mockResult = await engine.predict({
      query,
      recipeId: "mock-recipe",
    });

    // Execute with TrendRecipe
    const trendResult = await engine.predict({
      query,
      recipeId: "trend-recipe",
    });

    // Execute with StatisticalRecipe
    const statisticalResult = await engine.predict({
      query,
      recipeId: "statistical-recipe",
    });

    // Verify different recipes were used
    expect(mockResult.recipeUsed).toBe("mock-recipe");
    expect(trendResult.recipeUsed).toBe("trend-recipe");
    expect(statisticalResult.recipeUsed).toBe("statistical-recipe");

    // Verify different predictions (recipes produce different outputs)
    const predictions = [
      mockResult.prediction,
      trendResult.prediction,
      statisticalResult.prediction,
    ];
    const uniquePredictions = new Set(predictions);
    expect(uniquePredictions.size).toBe(3);

    // Verify confidence scores are valid
    const confidences = [
      mockResult.confidence,
      trendResult.confidence,
      statisticalResult.confidence,
    ];
    // Each recipe should produce a valid confidence value (0-1)
    confidences.forEach((conf) => {
      expect(conf).toBeGreaterThan(0);
      expect(conf).toBeLessThanOrEqual(1);
    });

    console.log("Recipe Switching Verification:");
    console.log(`- MockRecipe: confidence=${mockResult.confidence}`);
    console.log(`- TrendRecipe: confidence=${trendResult.confidence}`);
    console.log(`- StatisticalRecipe: confidence=${statisticalResult.confidence}`);
  });

  it("should retrieve recipe metadata for each recipe", () => {
    const registry = RecipeRegistry.getInstance();

    const mockMetadata = registry.getRecipeMetadata("mock-recipe");
    expect(mockMetadata).toBeDefined();
    expect(mockMetadata?.name).toBe("Mock Prediction Recipe");
    expect(mockMetadata?.version).toBeDefined();
    expect(mockMetadata?.category).toBeDefined();

    const trendMetadata = registry.getRecipeMetadata("trend-recipe");
    expect(trendMetadata).toBeDefined();
    expect(trendMetadata?.name).toBe("Trend Analysis Recipe");

    const statisticalMetadata = registry.getRecipeMetadata("statistical-recipe");
    expect(statisticalMetadata).toBeDefined();
    expect(statisticalMetadata?.name).toBe("Statistical Analysis Recipe");
  });

  it("should handle invalid recipe ID gracefully", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Test query",
      recipeId: "non-existent-recipe",
    };

    try {
      await engine.predict(request);
      expect.fail("Should have thrown an error for invalid recipe");
    } catch (error) {
      expect(error).toBeDefined();
      expect(String(error)).toContain("not found");
    }
  });
});
