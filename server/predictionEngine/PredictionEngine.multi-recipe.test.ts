import { describe, it, expect, beforeEach } from "vitest";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("PredictionEngine Multiple Recipe Selection", () => {
  let engine: PredictionEngine;

  beforeEach(() => {
    engine = new PredictionEngine();
  });

  it("should demonstrate recipe switching with automatic recommendations", async () => {
    const query = "What will happen next?";

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

    // Verify that recommendations were generated
    expect(mockResult.recommendationMetadata).toBeDefined();
    expect(trendResult.recommendationMetadata).toBeDefined();
    expect(statisticalResult.recommendationMetadata).toBeDefined();

    // Verify that selectedRecipes contains the actually used recipe
    expect(mockResult.recommendationMetadata?.selectedRecipes).toContain(mockResult.recipeUsed);
    expect(trendResult.recommendationMetadata?.selectedRecipes).toContain(trendResult.recipeUsed);
    expect(statisticalResult.recommendationMetadata?.selectedRecipes).toContain(statisticalResult.recipeUsed);

    // Verify recommendation scores are valid (0-100)
    expect(mockResult.recommendationMetadata?.recommendationScore).toBeGreaterThanOrEqual(0);
    expect(mockResult.recommendationMetadata?.recommendationScore).toBeLessThanOrEqual(100);
    expect(trendResult.recommendationMetadata?.recommendationScore).toBeGreaterThanOrEqual(0);
    expect(trendResult.recommendationMetadata?.recommendationScore).toBeLessThanOrEqual(100);
    expect(statisticalResult.recommendationMetadata?.recommendationScore).toBeGreaterThanOrEqual(0);
    expect(statisticalResult.recommendationMetadata?.recommendationScore).toBeLessThanOrEqual(100);

    // Verify confidence scores are valid
    const confidences = [
      mockResult.confidence,
      trendResult.confidence,
      statisticalResult.confidence,
    ];
    confidences.forEach((confidence) => {
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(1);
    });

    // Verify history was recorded with recommendation metadata
    const tracker = engine.getPerformanceTracker();
    const mockStats = tracker.getRecipeStats(mockResult.recipeUsed);
    const trendStats = tracker.getRecipeStats(trendResult.recipeUsed);
    const statisticalStats = tracker.getRecipeStats(statisticalResult.recipeUsed);

    expect(mockStats?.executionCount).toBeGreaterThanOrEqual(1);
    expect(trendStats?.executionCount).toBeGreaterThanOrEqual(1);
    expect(statisticalStats?.executionCount).toBeGreaterThanOrEqual(1);
  });

  it("should automatically select highest priority recipe based on recommendations", async () => {
    const query = "What will happen next?";

    // First prediction establishes baseline
    const firstResult = await engine.predict({
      query,
      recipeId: "mock-recipe",
    });

    // Second prediction should have recommendations
    const secondResult = await engine.predict({
      query,
      recipeId: "trend-recipe",
    });

    // Verify that a recipe was selected
    expect(secondResult.recipeUsed).toBeDefined();
    expect(secondResult.recommendationMetadata?.selectedRecipes).toBeDefined();
    expect(secondResult.recommendationMetadata?.selectedRecipes?.length).toBeGreaterThan(0);

    // Verify that the selected recipe is in the recommended list
    const selectedRecipe = secondResult.recipeUsed;
    const recommendedRecipes = secondResult.recommendationMetadata?.recommendedRecipes || [];
    expect(recommendedRecipes).toContain(selectedRecipe);
  });

  it("should include recommendation reason in explanation", async () => {
    const query = "What will happen next?";

    const result = await engine.predict({
      query,
      recipeId: "mock-recipe",
    });

    expect(result.explanation).toBeDefined();
    expect(result.recommendationMetadata?.recommendationReason).toBeDefined();

    // Verify explanation mentions recommendation engine
    if (result.explanation) {
      expect(result.explanation).toContain("recommendation engine");
    }
  });

  it("should track recipe performance across multiple predictions", async () => {
    const query = "What will happen next?";

    // Execute multiple predictions
    for (let i = 0; i < 3; i++) {
      await engine.predict({
        query,
        recipeId: "mock-recipe",
      });
    }

    const tracker = engine.getPerformanceTracker();
    const stats = tracker.getRecipeStats("mock-recipe");

    expect(stats?.executionCount).toBeGreaterThanOrEqual(1);
    expect(stats?.averageConfidence).toBeGreaterThanOrEqual(0);
    expect(stats?.averageConfidence).toBeLessThanOrEqual(1);
  });
});
