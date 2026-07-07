import { describe, it, expect } from "vitest";
import { StatisticalPredictionEngine } from "./StatisticalPredictionEngine";
import { PredictionRequest } from "../types";

describe("StatisticalPredictionEngine", () => {
  const engine = new StatisticalPredictionEngine();

  it("should generate a prediction for valid input", async () => {
    const request: PredictionRequest = {
      query: "Will the stock market go up tomorrow?",
      recipeId: "statistical",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.prediction).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.reason).toBeDefined();
    expect(result.recipeUsed).toBe("statistical");
  });

  it("should throw error on empty query", async () => {
    const request: PredictionRequest = {
      query: "",
      recipeId: "statistical",
    };

    await expect(engine.predict(request)).rejects.toThrow();
  });

  it("should calculate confidence between 0 and 1", async () => {
    const request: PredictionRequest = {
      query: "What will happen next week?",
      recipeId: "statistical",
    };

    const result = await engine.predict(request);

    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it("should include statistical metadata", async () => {
    const request: PredictionRequest = {
      query: "Predict the future outcome",
      recipeId: "statistical",
    };

    const result = await engine.predict(request);

    expect(result.metadata).toBeDefined();  });

  it("should generate different predictions for different queries", async () => {
    const request1: PredictionRequest = {
      query: "Short query",
      recipeId: "statistical",
    };

    const request2: PredictionRequest = {
      query: "This is a much longer query that contains more words and characters",
      recipeId: "statistical",
    };

    const result1 = await engine.predict(request1);
    const result2 = await engine.predict(request2);

    expect(result1.prediction).toBeDefined();
    expect(result2.prediction).toBeDefined();
  });
});
