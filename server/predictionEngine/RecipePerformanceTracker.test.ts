import { describe, it, expect, beforeEach } from "vitest";
import { RecipePerformanceTracker, RecipeStats } from "./RecipePerformanceTracker";
import { PredictionHistoryRecord } from "./PredictionHistoryRepository";

describe("RecipePerformanceTracker", () => {
  let tracker: RecipePerformanceTracker;

  beforeEach(() => {
    tracker = new RecipePerformanceTracker();
  });

  describe("recordPrediction", () => {
    it("should record a single prediction", () => {
      const record: PredictionHistoryRecord = {
        id: "pred-1",
        timestamp: 1000,
        request: { query: "Q1", recipeId: "recipe-1" },
        prediction: "P1",
        confidence: 0.8,
        executedRecipeNames: ["Recipe A"],
      };

      tracker.recordPrediction(record);

      const stats = tracker.getRecipeStats("recipe-1");
      expect(stats).toBeDefined();
      expect(stats?.executionCount).toBe(1);
      expect(stats?.averageConfidence).toBe(0.8);
      expect(stats?.lastExecutionTime).toBe(1000);
    });

    it("should accumulate statistics for multiple predictions", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: 1000,
          request: { query: "Q1", recipeId: "recipe-1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: 2000,
          request: { query: "Q2", recipeId: "recipe-1" },
          prediction: "P2",
          confidence: 0.6,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-3",
          timestamp: 3000,
          request: { query: "Q3", recipeId: "recipe-1" },
          prediction: "P3",
          confidence: 1.0,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      for (const record of records) {
        tracker.recordPrediction(record);
      }

      const stats = tracker.getRecipeStats("recipe-1");
      expect(stats?.executionCount).toBe(3);
      expect(stats?.averageConfidence).toBeCloseTo((0.8 + 0.6 + 1.0) / 3, 5);
      expect(stats?.lastExecutionTime).toBe(3000);
    });

    it("should handle multiple recipes", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: 1000,
          request: { query: "Q1", recipeId: "recipe-1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: 2000,
          request: { query: "Q2", recipeId: "recipe-2" },
          prediction: "P2",
          confidence: 0.6,
          executedRecipeNames: ["Recipe B"],
        },
        {
          id: "pred-3",
          timestamp: 3000,
          request: { query: "Q3", recipeId: "recipe-1" },
          prediction: "P3",
          confidence: 0.9,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      for (const record of records) {
        tracker.recordPrediction(record);
      }

      const stats1 = tracker.getRecipeStats("recipe-1");
      expect(stats1?.executionCount).toBe(2);
      expect(stats1?.averageConfidence).toBeCloseTo((0.8 + 0.9) / 2, 5);

      const stats2 = tracker.getRecipeStats("recipe-2");
      expect(stats2?.executionCount).toBe(1);
      expect(stats2?.averageConfidence).toBe(0.6);
    });

    it("should handle predictions with multiple recipes", () => {
      const record: PredictionHistoryRecord = {
        id: "pred-1",
        timestamp: 1000,
        request: { query: "Q1", recipeId: "recipe-1" },
        prediction: "P1",
        confidence: 0.8,
        executedRecipeNames: ["Recipe A", "Recipe B"],
      };

      tracker.recordPrediction(record);

      const allStats = tracker.getAllRecipeStats();
      // Should have 2 entries since we're tracking by recipe ID, and both recipes have the same ID
      // But getAllRecipeStats() deduplicates by recipe ID, so we get 1
      expect(allStats.length).toBe(1);
      expect(allStats[0].executionCount).toBe(1);
      expect(allStats[0].averageConfidence).toBe(0.8);
    });

    it("should handle predictions with no recipes", () => {
      const record: PredictionHistoryRecord = {
        id: "pred-1",
        timestamp: 1000,
        request: { query: "Q1", recipeId: "recipe-1" },
        prediction: "P1",
        confidence: 0.8,
        executedRecipeNames: [],
      };

      tracker.recordPrediction(record);

      const allStats = tracker.getAllRecipeStats();
      expect(allStats.length).toBe(0);
    });
  });

  describe("getRecipeStats", () => {
    it("should return null for non-existent recipe", () => {
      const stats = tracker.getRecipeStats("non-existent");
      expect(stats).toBeNull();
    });

    it("should return correct stats for existing recipe", () => {
      const record: PredictionHistoryRecord = {
        id: "pred-1",
        timestamp: 1000,
        request: { query: "Q1", recipeId: "recipe-1" },
        prediction: "P1",
        confidence: 0.75,
        executedRecipeNames: ["Recipe A"],
      };

      tracker.recordPrediction(record);

      const stats = tracker.getRecipeStats("recipe-1");
      expect(stats).toBeDefined();
      expect(stats?.recipeId).toBe("recipe-1");
      expect(stats?.recipeName).toBe("Recipe A");
      expect(stats?.executionCount).toBe(1);
      expect(stats?.averageConfidence).toBe(0.75);
      expect(stats?.lastExecutionTime).toBe(1000);
    });
  });

  describe("getAllRecipeStats", () => {
    it("should return empty array when no predictions recorded", () => {
      const allStats = tracker.getAllRecipeStats();
      expect(allStats).toEqual([]);
    });

    it("should return stats for all recipes", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: 1000,
          request: { query: "Q1", recipeId: "recipe-1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: 2000,
          request: { query: "Q2", recipeId: "recipe-2" },
          prediction: "P2",
          confidence: 0.6,
          executedRecipeNames: ["Recipe B"],
        },
        {
          id: "pred-3",
          timestamp: 3000,
          request: { query: "Q3", recipeId: "recipe-3" },
          prediction: "P3",
          confidence: 0.9,
          executedRecipeNames: ["Recipe C"],
        },
      ];

      for (const record of records) {
        tracker.recordPrediction(record);
      }

      const allStats = tracker.getAllRecipeStats();
      expect(allStats.length).toBe(3);
      expect(allStats.map((s) => s.recipeId)).toEqual(["recipe-1", "recipe-2", "recipe-3"]);
    });

    it("should avoid duplicates for recipes with same ID", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: 1000,
          request: { query: "Q1", recipeId: "recipe-1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: 2000,
          request: { query: "Q2", recipeId: "recipe-1" },
          prediction: "P2",
          confidence: 0.6,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      for (const record of records) {
        tracker.recordPrediction(record);
      }

      const allStats = tracker.getAllRecipeStats();
      expect(allStats.length).toBe(1);
      expect(allStats[0].recipeId).toBe("recipe-1");
      expect(allStats[0].executionCount).toBe(2);
    });
  });

  describe("getTopRecipes", () => {
    beforeEach(() => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: 1000,
          request: { query: "Q1", recipeId: "recipe-1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: 2000,
          request: { query: "Q2", recipeId: "recipe-1" },
          prediction: "P2",
          confidence: 0.6,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-3",
          timestamp: 3000,
          request: { query: "Q3", recipeId: "recipe-2" },
          prediction: "P3",
          confidence: 0.9,
          executedRecipeNames: ["Recipe B"],
        },
        {
          id: "pred-4",
          timestamp: 4000,
          request: { query: "Q4", recipeId: "recipe-3" },
          prediction: "P4",
          confidence: 0.5,
          executedRecipeNames: ["Recipe C"],
        },
      ];

      for (const record of records) {
        tracker.recordPrediction(record);
      }
    });

    it("should return top recipes by execution count", () => {
      const topRecipes = tracker.getTopRecipes("executionCount", 2);
      expect(topRecipes.length).toBe(2);
      expect(topRecipes[0].recipeId).toBe("recipe-1");
      expect(topRecipes[0].executionCount).toBe(2);
      expect(topRecipes[1].executionCount).toBe(1);
    });

    it("should return top recipes by average confidence", () => {
      const topRecipes = tracker.getTopRecipes("averageConfidence", 2);
      expect(topRecipes.length).toBe(2);
      expect(topRecipes[0].recipeId).toBe("recipe-2");
      expect(topRecipes[0].averageConfidence).toBe(0.9);
      expect(topRecipes[1].recipeId).toBe("recipe-1");
      expect(topRecipes[1].averageConfidence).toBeCloseTo((0.8 + 0.6) / 2, 5);
    });

    it("should respect limit parameter", () => {
      const topRecipes = tracker.getTopRecipes("executionCount", 1);
      expect(topRecipes.length).toBe(1);
    });

    it("should return all recipes if limit exceeds available", () => {
      const topRecipes = tracker.getTopRecipes("executionCount", 100);
      expect(topRecipes.length).toBe(3);
    });
  });

  describe("getTrackedRecipeCount", () => {
    it("should return 0 for empty tracker", () => {
      expect(tracker.getTrackedRecipeCount()).toBe(0);
    });

    it("should return correct count of tracked recipes", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: 1000,
          request: { query: "Q1", recipeId: "recipe-1" },
          prediction: "P1",
          confidence: 0.8,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: 2000,
          request: { query: "Q2", recipeId: "recipe-2" },
          prediction: "P2",
          confidence: 0.6,
          executedRecipeNames: ["Recipe B"],
        },
        {
          id: "pred-3",
          timestamp: 3000,
          request: { query: "Q3", recipeId: "recipe-1" },
          prediction: "P3",
          confidence: 0.9,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      for (const record of records) {
        tracker.recordPrediction(record);
      }

      expect(tracker.getTrackedRecipeCount()).toBe(2);
    });
  });

  describe("clear", () => {
    it("should clear all tracked statistics", () => {
      const record: PredictionHistoryRecord = {
        id: "pred-1",
        timestamp: 1000,
        request: { query: "Q1", recipeId: "recipe-1" },
        prediction: "P1",
        confidence: 0.8,
        executedRecipeNames: ["Recipe A"],
      };

      tracker.recordPrediction(record);
      expect(tracker.getTrackedRecipeCount()).toBe(1);

      tracker.clear();
      expect(tracker.getTrackedRecipeCount()).toBe(0);
      expect(tracker.getAllRecipeStats()).toEqual([]);
    });
  });

  describe("edge cases", () => {
    it("should handle confidence values of 0 and 1", () => {
      const records: PredictionHistoryRecord[] = [
        {
          id: "pred-1",
          timestamp: 1000,
          request: { query: "Q1", recipeId: "recipe-1" },
          prediction: "P1",
          confidence: 0,
          executedRecipeNames: ["Recipe A"],
        },
        {
          id: "pred-2",
          timestamp: 2000,
          request: { query: "Q2", recipeId: "recipe-1" },
          prediction: "P2",
          confidence: 1,
          executedRecipeNames: ["Recipe A"],
        },
      ];

      for (const record of records) {
        tracker.recordPrediction(record);
      }

      const stats = tracker.getRecipeStats("recipe-1");
      expect(stats?.averageConfidence).toBe(0.5);
    });

    it("should handle very large execution counts", () => {
      const record: PredictionHistoryRecord = {
        id: "pred-1",
        timestamp: 1000,
        request: { query: "Q1", recipeId: "recipe-1" },
        prediction: "P1",
        confidence: 0.8,
        executedRecipeNames: ["Recipe A"],
      };

      // Record the same prediction 1000 times
      for (let i = 0; i < 1000; i++) {
        tracker.recordPrediction(record);
      }

      const stats = tracker.getRecipeStats("recipe-1");
      expect(stats?.executionCount).toBe(1000);
      expect(stats?.averageConfidence).toBeCloseTo(0.8, 5);
    });
  });
});
