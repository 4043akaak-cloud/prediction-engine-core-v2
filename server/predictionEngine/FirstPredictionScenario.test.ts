import { describe, it, expect } from "vitest";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("First Prediction Scenario", () => {
  it("should execute a complete prediction scenario from request to history", async () => {
    // Initialize the Prediction Engine
    const engine = new PredictionEngine();

    // Create a PredictionRequest
    const request: PredictionRequest = {
      query: "Will the technology sector outperform the market this year?",
      recipeId: "mock-recipe",
    };

    console.log("\n=== First Prediction Scenario ===");
    console.log(`Request: ${request.query}`);
    console.log(`Recipe: ${request.recipeId}`);

    // Execute the prediction
    const result = await engine.predict(request);

    // Verify the result
    console.log("\n=== Prediction Result ===");
    console.log(`ID: ${result.id}`);
    console.log(`Prediction: ${result.prediction}`);
    console.log(`Confidence: ${result.confidence}`);
    console.log(`Recipe Used: ${result.recipeUsed}`);
    console.log(`Timestamp: ${result.timestamp}`);
    console.log(`Metadata:`, result.metadata);
    console.log(`Evidence Count: ${result.evidenceList?.length || 0}`);

    // Assertions
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.prediction).toBeTruthy();
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.recipeUsed).toBe("mock-recipe");
    expect(result.timestamp).toBeGreaterThan(0);
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.recipeId).toBe("mock-recipe");
    expect(result.metadata?.recipeName).toBe("Mock Prediction Recipe");
    expect(result.evidenceList).toBeDefined();
    expect(result.evidenceList?.length).toBeGreaterThan(0);

    console.log("\n✓ Prediction scenario completed successfully");
  });

  it("should execute multiple predictions and store them in history", async () => {
    const engine = new PredictionEngine();

    const requests: PredictionRequest[] = [
      {
        query: "Will AI adoption accelerate in 2026?",
        recipeId: "mock-recipe",
      },
      {
        query: "Will interest rates remain stable?",
        recipeId: "mock-recipe",
      },
      {
        query: "Will renewable energy investment grow?",
        recipeId: "mock-recipe",
      },
    ];

    console.log("\n=== Multiple Predictions Scenario ===");

    const results = [];
    for (const request of requests) {
      console.log(`\nExecuting prediction for: ${request.query}`);
      const result = await engine.predict(request);
      results.push(result);
      console.log(`✓ Prediction ID: ${result.id}`);
    }

    // Verify all results
    expect(results).toHaveLength(3);
    results.forEach((result, index) => {
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.prediction).toBeTruthy();
      expect(result.confidence).toBeGreaterThan(0);
    });

    console.log(`\n✓ All ${results.length} predictions completed successfully`);
  });

  it("should execute predictions with different recipes", async () => {
    const engine = new PredictionEngine();

    const recipes = ["mock-recipe", "trend-recipe", "statistical-recipe"];
    const query = "What will be the market trend next quarter?";

    console.log("\n=== Multi-Recipe Scenario ===");
    console.log(`Query: ${query}`);

    const results = [];
    for (const recipeId of recipes) {
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
    }

    // Verify all results
    expect(results).toHaveLength(3);
    expect(results[0].recipeUsed).toBe("mock-recipe");
    expect(results[1].recipeUsed).toBe("trend-recipe");
    expect(results[2].recipeUsed).toBe("statistical-recipe");

    console.log(`\n✓ All ${results.length} recipes executed successfully`);
  });
});
