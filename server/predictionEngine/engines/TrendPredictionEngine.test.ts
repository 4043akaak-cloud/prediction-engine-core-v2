import { describe, it, expect } from "vitest";
import { TrendPredictionEngine } from "./TrendPredictionEngine";
import { PredictionRequest } from "../types";

describe("TrendPredictionEngine", () => {
  const engine = new TrendPredictionEngine();

  it("should generate uptrend prediction for increase keywords", async () => {
    const request: PredictionRequest = {
      query: "The market is rising and climbing higher",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.prediction).toContain("uptrend");
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.recipeUsed).toBe("trend");
  });

  it("should generate downtrend prediction for decrease keywords", async () => {
    const request: PredictionRequest = {
      query: "The market is falling and declining sharply",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.prediction).toContain("downtrend");
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it("should throw error on empty query", async () => {
    const request: PredictionRequest = {
      query: "",
      recipeId: "trend",
    };

    await expect(engine.predict(request)).rejects.toThrow();
  });

  it("should analyze numeric trends", async () => {
    const request: PredictionRequest = {
      query: "Values went from 100 to 150 to 200",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.prediction).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it("should detect mixed signals with both increase and decrease keywords", async () => {
    const request: PredictionRequest = {
      query: "The market is rising up but also falling down unpredictably",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result).toBeDefined();
    expect(result.prediction).toBeDefined();
    // When both keywords present, direction becomes volatile
    expect(result.metadata.trendDirection).toBe("volatile");
  });

  it("should include trend metadata", async () => {
    const request: PredictionRequest = {
      query: "Strong upward momentum detected",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result.metadata).toBeDefined();
    expect(result.metadata.trendMethod).toBe("trend-analysis-v1");
    expect(result.metadata.trendDirection).toBeDefined();
    expect(result.metadata.trendStrength).toBeGreaterThanOrEqual(0);
  });

  it("should calculate confidence between 0 and 1", async () => {
    const request: PredictionRequest = {
      query: "What is the trend?",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});
