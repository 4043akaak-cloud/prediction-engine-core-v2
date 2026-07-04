import { describe, it, expect } from "vitest";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("PredictionEngine Complete Flow", () => {
  it("should complete end-to-end flow: Request → Engine → Registry → Executor → Confidence → Builder → Result", async () => {
    const engine = new PredictionEngine();
    
    // User Request
    const request: PredictionRequest = {
      query: "Will the stock market go up tomorrow?",
      recipeId: "mock-recipe",
    };

    // Execute complete flow
    const result = await engine.predict(request);

    // Verify complete flow result
    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("string");
    expect(result.prediction).toBeTypeOf("string");
    expect(result.confidence).toBeTypeOf("number");
    expect(result.reason).toBeTypeOf("string");
    expect(result.recipeUsed).toBe("mock-recipe");
    expect(result.timestamp).toBeTypeOf("number");

    // Verify data integrity through the flow
    expect(result.prediction).toContain("Mock Prediction");
    expect(result.reason).toContain("mock-recipe");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it("should complete multi-recipe flow for all recipes", async () => {
    const engine = new PredictionEngine();
    
    const request: PredictionRequest = {
      query: "What is the trend in technology stocks?",
      recipeId: "mock-recipe", // Ignored in multi-recipe mode
    };

    // Execute multi-recipe flow
    const results = await engine.predictMultiple(request);

    // Verify all recipes were executed
    expect(results).toHaveLength(3);

    // Verify each result from the complete flow
    results.forEach((result) => {
      expect(result.id).toBeTypeOf("string");
      expect(result.prediction).toBeTypeOf("string");
      expect(result.confidence).toBeTypeOf("number");
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.reason).toBeTypeOf("string");
      expect(result.recipeUsed).toBeTypeOf("string");
      expect(result.timestamp).toBeTypeOf("number");
    });

    // Verify different recipes produced different results
    const predictions = results.map((r) => r.prediction);
    const uniquePredictions = new Set(predictions);
    expect(uniquePredictions.size).toBe(3);
  });

  it("should verify RecipeOutput is properly mapped to PredictionResult", async () => {
    const engine = new PredictionEngine();
    
    const request: PredictionRequest = {
      query: "Test query for flow verification",
      recipeId: "trend-recipe",
    };

    const result = await engine.predict(request);

    // Verify RecipeOutput (RecipeExecutionResult) was properly mapped
    // The prediction text should come from rawPredictionData.value
    expect(result.prediction).toBeDefined();
    expect(result.prediction.length).toBeGreaterThan(0);

    // The reason should include factors from rawPredictionData.factors
    expect(result.reason).toContain("historical_direction");
    expect(result.reason).toContain("current_momentum");
    expect(result.reason).toContain("pattern_consistency");

    // Confidence should be calculated and included
    expect(result.confidence).toBeGreaterThan(0);
  });

  it("should handle errors gracefully in multi-recipe flow", async () => {
    const engine = new PredictionEngine();
    
    const request: PredictionRequest = {
      query: "Test error handling",
      recipeId: "mock-recipe",
    };

    // Should not throw even if one recipe fails
    const results = await engine.predictMultiple(request);

    // Should still return results from successful recipes
    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);
  });
});
