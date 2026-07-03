import { describe, it, expect } from "vitest";
import { PredictionEngine } from "./PredictionEngine";
import { PredictionRequest } from "./types";

describe("PredictionEngine", () => {
  it("should successfully execute a prediction request", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Will the stock market go up tomorrow?",
      recipeId: "mock-recipe",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("string");
    expect(result.prediction).toContain("Mock Prediction");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.reason).toContain("This prediction is based on the mock-recipe recipe");
    expect(result.recipeUsed).toBe("mock-recipe");
    expect(result.timestamp).toBeTypeOf("number");
  });

  it("should throw an error if the recipe is not found", async () => {
    const engine = new PredictionEngine();
    const request: PredictionRequest = {
      query: "Some query",
      recipeId: "non-existent-recipe",
    };

    await expect(engine.predict(request)).rejects.toThrow("Recipe with ID non-existent-recipe not found.");
  });
});
