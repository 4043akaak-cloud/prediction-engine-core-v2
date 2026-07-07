import { describe, it, expect } from "vitest";
import { TrendPredictionEngine } from "./TrendPredictionEngine";
import { PredictionRequest } from "../types";

describe("TrendPredictionEngine", () => {
  const engine = new TrendPredictionEngine();

  it("should predict uptrend when query contains increase keywords", async () => {
    const request: PredictionRequest = {
      query: "The market is rising and climbing up",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result.prediction).toContain("uptrend");
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it("should predict downtrend when query contains decrease keywords", async () => {
    const request: PredictionRequest = {
      query: "The market is falling and dropping down",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result.prediction).toContain("downtrend");
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it("should predict volatile when query contains mixed keywords", async () => {
    const request: PredictionRequest = {
      query: "The market is up and down with mixed signals rising and falling simultaneously",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result.prediction).toContain("Volatile");
  });

  it("should analyze numeric patterns in query", async () => {
    const request: PredictionRequest = {
      query: "Values: 10, 20, 30, 40 showing clear uptrend",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result.prediction).toContain("uptrend");
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it("should detect downtrend from numeric patterns", async () => {
    const request: PredictionRequest = {
      query: "Values: 100, 80, 60, 40 showing clear downtrend",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result.prediction).toContain("downtrend");
  });

  it("should handle momentum keywords", async () => {
    const request: PredictionRequest = {
      query: "Strong momentum acceleration detected",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result.reason).toContain("Momentum");
  });

  it("should throw error on empty query", async () => {
    const request: PredictionRequest = {
      query: "",
      recipeId: "trend",
    };

    await expect(engine.predict(request)).rejects.toThrow("Empty query");
  });

  it("should return valid confidence score", async () => {
    const request: PredictionRequest = {
      query: "What is the trend?",
      recipeId: "trend",
    };

    const result = await engine.predict(request);

    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});
