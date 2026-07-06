import { describe, it, expect, beforeEach } from "vitest";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { PredictionHistoryRecordBuilder } from "./PredictionHistoryRecordBuilder";

describe("RecipeEvolutionEngine", () => {
  let performanceTracker: RecipePerformanceTracker;
  let engine: RecipeEvolutionEngine;

  beforeEach(() => {
    performanceTracker = new RecipePerformanceTracker();
    engine = new RecipeEvolutionEngine(performanceTracker);
  });

  describe("analyzeRecipe()", () => {
    it("should return null for non-existent recipe", () => {
      const result = engine.analyzeRecipe("non-existent");
      expect(result).toBeNull();
    });

    it("should return analysis for recipe with performance data", () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.8)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result).not.toBeNull();
      expect(result!.recipeId).toBe("recipe-1");
      expect(result!.averageConfidence).toBe(0.8);
      expect(result!.performanceTrend).toBeDefined();
      expect(result!.recommendation).toBeDefined();
      expect(result!.reasoning).toBeDefined();
    });

    it("should have valid recommendation values", () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.8)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      const validRecommendations = ["KEEP", "IMPROVE", "DEPRECATE", "EXPERIMENT"];
      expect(validRecommendations).toContain(result!.recommendation);
    });

    it("should have valid trend values", () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.8)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      const validTrends = ["improving", "stable", "declining"];
      expect(validTrends).toContain(result!.performanceTrend);
    });
  });

  describe("analyzeAllRecipes()", () => {
    it("should return empty array when no recipes", () => {
      const results = engine.analyzeAllRecipes();
      expect(results).toEqual([]);
    });

    it("should return analysis for all recipes", () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.8)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-2")
          .withRecipeName("Recipe 2")
          .withConfidence(0.6)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-3")
          .withRecipeName("Recipe 3")
          .withConfidence(0.9)
          .build(),
      );

      const results = engine.analyzeAllRecipes();
      expect(results.length).toBe(3);
      expect(results.map((r) => r.recipeId)).toContain("recipe-1");
      expect(results.map((r) => r.recipeId)).toContain("recipe-2");
      expect(results.map((r) => r.recipeId)).toContain("recipe-3");
    });
  });

  describe("performance trend calculation", () => {
    it("should classify high confidence as improving", () => {
      // Record 2 times to pass executionCount >= 2 check
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.8)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.8)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.performanceTrend).toBe("improving");
    });

    it("should classify moderate confidence as stable", () => {
      // Record 2 times to pass executionCount >= 2 check
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.6)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.6)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.performanceTrend).toBe("stable");
    });

    it("should classify low confidence as declining", () => {
      // Record 2 times to pass executionCount >= 2 check
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.3)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.3)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.performanceTrend).toBe("declining");
    });
  });

  describe("recommendation generation", () => {
    it("should recommend KEEP for high confidence", () => {
      // Record 5 times with high confidence to meet KEEP criteria
      // Stage 3 Performance Check: conf >= 0.75 AND exec >= 5 → KEEP
      for (let i = 0; i < 5; i++) {
        performanceTracker.recordPrediction(
          new PredictionHistoryRecordBuilder()
            .withRecipeId("recipe-1")
            .withRecipeName("Recipe 1")
            .withConfidence(0.88)
            .withTimestamp(Date.now() + i * 1000)
            .build(),
        );
      }

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.recommendation).toBe("KEEP");
    });

    it("should recommend DEPRECATE for very low confidence", () => {
      // Stage 1 Fatal Check: conf < 0.30 → DEPRECATE (regardless of maturity)
      // Record 2 times (exec < 3, but fatal check catches it first)
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.2)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.2)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.recommendation).toBe("DEPRECATE");
    });

    it("should recommend EXPERIMENT for new recipe", () => {
      // Stage 2 Maturity Check: exec < 3 → EXPERIMENT
      // Record 1 time (new recipe)
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.7)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.recommendation).toBe("EXPERIMENT");
    });

    it("should recommend IMPROVE for moderate confidence", () => {
      // Stage 3 Performance Check: conf >= 0.50 AND exec >= 3 → IMPROVE
      // Record 3 times with moderate confidence
      for (let i = 0; i < 3; i++) {
        performanceTracker.recordPrediction(
          new PredictionHistoryRecordBuilder()
            .withRecipeId("recipe-1")
            .withRecipeName("Recipe 1")
            .withConfidence(0.6)
            .withTimestamp(Date.now() + i * 1000)
            .build(),
        );
      }

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.recommendation).toBe("IMPROVE");
    });
  });

  describe("reasoning generation", () => {
    it("should include execution count in reasoning", () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.8)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.reasoning).toContain("executed");
    });

    it("should include confidence percentage in reasoning", () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.8)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.reasoning).toContain("80%");
    });

    it("should include trend in reasoning", () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.8)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.reasoning).toMatch(/improving|stable|declining/);
    });
  });

  describe("edge cases", () => {
    it("should handle confidence at boundary 0.75", () => {
      // Record 2 times to pass executionCount >= 2 check
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.75)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.75)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.performanceTrend).toBe("improving");
    });

    it("should handle confidence at boundary 0.5", () => {
      // Record 2 times to pass executionCount >= 2 check
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.5)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.5)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.performanceTrend).toBe("stable");
    });

    it("should handle zero confidence", () => {
      // Record 2 times to pass executionCount >= 2 check
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.0)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.0)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.recommendation).toBe("DEPRECATE");
    });

    it("should handle maximum confidence", () => {
      // Record 2 times to pass executionCount >= 2 check
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(1.0)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(1.0)
          .build(),
      );

      const result = engine.analyzeRecipe("recipe-1");
      expect(result!.performanceTrend).toBe("improving");
    });
  });
});
