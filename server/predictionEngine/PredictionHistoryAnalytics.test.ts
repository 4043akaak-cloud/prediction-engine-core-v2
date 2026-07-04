import { describe, it, expect } from "vitest";
import { PredictionHistoryAnalytics, IReadOnlyHistoryProvider, RecipeUsageStats } from "./PredictionHistoryAnalytics";
import { PredictionHistoryRecord } from "./PredictionHistoryRepository";

describe("PredictionHistoryAnalytics", () => {
  // Mock history provider for testing
  const createMockHistoryProvider = (records: PredictionHistoryRecord[]): IReadOnlyHistoryProvider => {
    return {
      getAll: () => [...records],
      getCount: () => records.length,
    };
  };

  describe("getPredictionCount", () => {
    it("should return 0 for empty history", () => {
      const provider = createMockHistoryProvider([]);
      const analytics = new PredictionHistoryAnalytics(provider);

      expect(analytics.getPredictionCount()).toBe(0);
    });

    it("should return the correct count of predictions", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: Date.now(),
          request: { query: "Q1", recipeId: "R1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: Date.now(),
          request: { query: "Q2", recipeId: "R2" },
          prediction: "P2",
          confidence: 0.7,
          executedRecipeNames: ["Recipe B"],
        },
        {
          id: "pred-3",
          timestamp: Date.now(),
          request: { query: "Q3", recipeId: "R1" },
          prediction: "P3",
          confidence: 0.9,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      const provider = createMockHistoryProvider(records);
      const analytics = new PredictionHistoryAnalytics(provider);

      expect(analytics.getPredictionCount()).toBe(3);
    });
  });

  describe("getAverageConfidence", () => {
    it("should return 0 for empty history", () => {
      const provider = createMockHistoryProvider([]);
      const analytics = new PredictionHistoryAnalytics(provider);

      expect(analytics.getAverageConfidence()).toBe(0);
    });

    it("should calculate average confidence correctly", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: Date.now(),
          request: { query: "Q1", recipeId: "R1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: Date.now(),
          request: { query: "Q2", recipeId: "R2" },
          prediction: "P2",
          confidence: 0.6,
          executedRecipeNames: ["Recipe B"],
        },
        {
          id: "pred-3",
          timestamp: Date.now(),
          request: { query: "Q3", recipeId: "R1" },
          prediction: "P3",
          confidence: 1.0,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      const provider = createMockHistoryProvider(records);
      const analytics = new PredictionHistoryAnalytics(provider);

      const average = analytics.getAverageConfidence();
      expect(average).toBeCloseTo((0.8 + 0.6 + 1.0) / 3, 5);
    });

    it("should handle single prediction", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: Date.now(),
          request: { query: "Q1", recipeId: "R1" },
          prediction: "P1",
          confidence: 0.75,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      const provider = createMockHistoryProvider(records);
      const analytics = new PredictionHistoryAnalytics(provider);

      expect(analytics.getAverageConfidence()).toBe(0.75);
    });
  });

  describe("getRecipeUsageStats", () => {
    it("should return empty array for empty history", () => {
      const provider = createMockHistoryProvider([]);
      const analytics = new PredictionHistoryAnalytics(provider);

      expect(analytics.getRecipeUsageStats()).toEqual([]);
    });

    it("should calculate recipe usage statistics correctly", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: Date.now(),
          request: { query: "Q1", recipeId: "R1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: Date.now(),
          request: { query: "Q2", recipeId: "R2" },
          prediction: "P2",
          confidence: 0.6,
          executedRecipeNames: ["Recipe B"],
        },
        {
          id: "pred-3",
          timestamp: Date.now(),
          request: { query: "Q3", recipeId: "R1" },
          prediction: "P3",
          confidence: 0.9,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-4",
          timestamp: Date.now(),
          request: { query: "Q4", recipeId: "R2" },
          prediction: "P4",
          confidence: 0.7,
          executedRecipeNames: ["Recipe B"],
        },
      ];

      const provider = createMockHistoryProvider(records);
      const analytics = new PredictionHistoryAnalytics(provider);

      const stats = analytics.getRecipeUsageStats();
      expect(stats.length).toBe(2);

      const recipeAStats = stats.find((s) => s.recipeName === "Recipe A");
      expect(recipeAStats).toBeDefined();
      expect(recipeAStats?.count).toBe(2);
      expect(recipeAStats?.averageConfidence).toBeCloseTo((0.8 + 0.9) / 2, 5);

      const recipeBStats = stats.find((s) => s.recipeName === "Recipe B");
      expect(recipeBStats).toBeDefined();
      expect(recipeBStats?.count).toBe(2);
      expect(recipeBStats?.averageConfidence).toBeCloseTo((0.6 + 0.7) / 2, 5);
    });

    it("should handle predictions with multiple recipes", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: Date.now(),
          request: { query: "Q1", recipeId: "R1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A", "Recipe B"],
        },
      ];

      const provider = createMockHistoryProvider(records);
      const analytics = new PredictionHistoryAnalytics(provider);

      const stats = analytics.getRecipeUsageStats();
      expect(stats.length).toBe(2);
      expect(stats.every((s) => s.count === 1)).toBe(true);
      expect(stats.every((s) => s.averageConfidence === 0.8)).toBe(true);
    });

    it("should handle predictions with no recipes", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: Date.now(),
          request: { query: "Q1", recipeId: "R1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: [],
        },
      ];

      const provider = createMockHistoryProvider(records);
      const analytics = new PredictionHistoryAnalytics(provider);

      const stats = analytics.getRecipeUsageStats();
      expect(stats).toEqual([]);
    });
  });

  describe("getRecentPredictions", () => {
    it("should return empty array for empty history", () => {
      const provider = createMockHistoryProvider([]);
      const analytics = new PredictionHistoryAnalytics(provider);

      expect(analytics.getRecentPredictions(5)).toEqual([]);
    });

    it("should return the most recent N predictions", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: 1000,
          request: { query: "Q1", recipeId: "R1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: 2000,
          request: { query: "Q2", recipeId: "R2" },
          prediction: "P2",
          confidence: 0.6,
          executedRecipeNames: ["Recipe B"],
        },
        {
          id: "pred-3",
          timestamp: 3000,
          request: { query: "Q3", recipeId: "R1" },
          prediction: "P3",
          confidence: 0.9,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-4",
          timestamp: 4000,
          request: { query: "Q4", recipeId: "R2" },
          prediction: "P4",
          confidence: 0.7,
          executedRecipeNames: ["Recipe B"],
        },
        {
          id: "pred-5",
          timestamp: 5000,
          request: { query: "Q5", recipeId: "R1" },
          prediction: "P5",
          confidence: 0.85,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      const provider = createMockHistoryProvider(records);
      const analytics = new PredictionHistoryAnalytics(provider);

      const recent = analytics.getRecentPredictions(2);
      expect(recent.length).toBe(2);
      expect(recent[0].id).toBe("pred-4");
      expect(recent[1].id).toBe("pred-5");
    });

    it("should return all predictions if limit exceeds history size", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: 1000,
          request: { query: "Q1", recipeId: "R1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: 2000,
          request: { query: "Q2", recipeId: "R2" },
          prediction: "P2",
          confidence: 0.6,
          executedRecipeNames: ["Recipe B"],
        },
      ];

      const provider = createMockHistoryProvider(records);
      const analytics = new PredictionHistoryAnalytics(provider);

      const recent = analytics.getRecentPredictions(10);
      expect(recent.length).toBe(2);
    });

    it("should return empty array for limit <= 0", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: 1000,
          request: { query: "Q1", recipeId: "R1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      const provider = createMockHistoryProvider(records);
      const analytics = new PredictionHistoryAnalytics(provider);

      expect(analytics.getRecentPredictions(0)).toEqual([]);
      expect(analytics.getRecentPredictions(-1)).toEqual([]);
    });
  });

  describe("read-only behavior", () => {
    it("should not modify the history provider", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: Date.now(),
          request: { query: "Q1", recipeId: "R1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      const provider = createMockHistoryProvider(records);
      const analytics = new PredictionHistoryAnalytics(provider);

      // Call all methods
      analytics.getPredictionCount();
      analytics.getAverageConfidence();
      analytics.getRecipeUsageStats();
      analytics.getRecentPredictions(5);

      // Verify history is unchanged
      expect(provider.getCount()).toBe(1);
      expect(provider.getAll().length).toBe(1);
      expect(provider.getAll()[0].id).toBe("pred-1");
    });
  });
});
