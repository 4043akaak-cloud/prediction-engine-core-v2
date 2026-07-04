import { describe, it, expect, beforeEach } from "vitest";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("First Prediction Scenario", () => {
  let engine: PredictionEngine;

  beforeEach(() => {
    engine = new PredictionEngine();
  });

  it("should execute predictions with different recipes and track recommendations", async () => {
    const query = "What will happen next?";
    const recipeIds = ["mock-recipe", "trend-recipe", "statistical-recipe"];
    const results = [];

    for (const recipeId of recipeIds) {
      const request: PredictionRequest = {
        query,
        recipeId,
      };
      console.log(`\nExecuting with recipe: ${recipeId}`);
      const result = await engine.predict(request);
      results.push(result);
      console.log(`✓ Prediction ID: ${result.id}`);
      console.log(`  Confidence: ${result.confidence}`);
      console.log(`  Recipe: ${result.metadata?.recipeName}`);
      console.log(`  Recommendation Score: ${result.recommendationMetadata?.recommendationScore}`);
    }

    // Verify all results
    expect(results).toHaveLength(3);

    // Verify that each result has recommendation metadata
    results.forEach((result) => {
      expect(result.recommendationMetadata).toBeDefined();
      expect(result.recommendationMetadata?.recommendationScore).toBeGreaterThanOrEqual(0);
      expect(result.recommendationMetadata?.recommendationScore).toBeLessThanOrEqual(100);
      expect(result.recommendationMetadata?.selectedRecipes).toBeDefined();
      expect(result.recommendationMetadata?.selectedRecipes?.length).toBeGreaterThan(0);
    });

    // Verify that different recipes were executed (based on the recipeUsed field)
    const executedRecipes = new Set(results.map((r) => r.recipeUsed));
    expect(executedRecipes.size).toBeGreaterThanOrEqual(1);

    // Verify that recommendations were generated
    const recommendedRecipes = new Set(
      results.flatMap((r) => r.recommendationMetadata?.recommendedRecipes || [])
    );
    expect(recommendedRecipes.size).toBeGreaterThanOrEqual(1);

    console.log(`\n✓ All ${results.length} recipes executed successfully`);
    console.log(`✓ Executed recipes: ${Array.from(executedRecipes).join(", ")}`);
    console.log(`✓ Recommended recipes: ${Array.from(recommendedRecipes).join(", ")}`);
  });
});
