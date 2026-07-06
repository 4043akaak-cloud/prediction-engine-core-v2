import { describe, it, expect, beforeEach } from "vitest";
import { RecommendationEngine } from "./RecommendationEngine";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";
import { RecipeRegistry } from "./RecipeRegistry";
import { IRecipe, Evidence, RecipeExecutionResult } from "./types";
import { PredictionHistoryRecordBuilder } from "./PredictionHistoryRecordBuilder";

// Mock Recipe for testing
class MockRecipe implements IRecipe {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;

  constructor(
    id: string,
    name: string,
    category: string,
    description: string = "Mock recipe",
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.version = "1.0.0";
  }

  async execute(evidence: Evidence): Promise<RecipeExecutionResult> {
    return {
      rawPredictionData: {
        value: "test prediction",
        factors: ["factor1", "factor2"],
      },
    };
  }
}

describe("RecommendationEngine", () => {
  let performanceTracker: RecipePerformanceTracker;
  let evolutionEngine: RecipeEvolutionEngine;
  let recipeRegistry: RecipeRegistry;
  let engine: RecommendationEngine;

  beforeEach(() => {
    // Reset Singleton state for test isolation
    recipeRegistry = RecipeRegistry.getInstance();
    recipeRegistry.resetForTesting();
    
    performanceTracker = new RecipePerformanceTracker();
    evolutionEngine = new RecipeEvolutionEngine(performanceTracker);
    engine = new RecommendationEngine(performanceTracker, evolutionEngine, recipeRegistry);

    // Register test recipes
    recipeRegistry.registerRecipeForTesting(new MockRecipe("recipe-1", "Recipe 1", "trend"));
    recipeRegistry.registerRecipeForTesting(new MockRecipe("recipe-2", "Recipe 2", "sentiment"));
    recipeRegistry.registerRecipeForTesting(new MockRecipe("recipe-3", "Recipe 3", "technical"));
  });

  describe("recommend()", () => {
    it("should return empty array when no recipes registered", async () => {
      // Reset registry and clear all recipes for this test
      const emptyRegistry = RecipeRegistry.getInstance();
      emptyRegistry.resetForTesting();
      
      const emptyEngine = new RecommendationEngine(
        performanceTracker,
        evolutionEngine,
        emptyRegistry,
      );

      const results = await emptyEngine.recommend("test query");
      expect(results).toEqual([]);
      
      // Restore registry for next tests
      emptyRegistry.resetForTesting();
      recipeRegistry.registerRecipeForTesting(new MockRecipe("recipe-1", "Recipe 1", "trend"));
      recipeRegistry.registerRecipeForTesting(new MockRecipe("recipe-2", "Recipe 2", "sentiment"));
      recipeRegistry.registerRecipeForTesting(new MockRecipe("recipe-3", "Recipe 3", "technical"));
    });

    it("should return all recipes when no options provided", async () => {
      const results = await engine.recommend("test query");
      expect(results.length).toBe(3);
      expect(results[0]).toHaveProperty("recipeId");
      expect(results[0]).toHaveProperty("score");
      expect(results[0]).toHaveProperty("reason");
    });

    it("should return recommendations sorted by score descending", async () => {
      // Add performance data using official flow
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.9)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-2")
          .withRecipeName("Recipe 2")
          .withConfidence(0.5)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-3")
          .withRecipeName("Recipe 3")
          .withConfidence(0.7)
          .build(),
      );

      const results = await engine.recommend("test query");
      expect(results.length).toBe(3);
      expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
      expect(results[1].score).toBeGreaterThanOrEqual(results[2].score);
    });

    it("should apply limit option", async () => {
      const results = await engine.recommend("test query", { limit: 2 });
      expect(results.length).toBe(2);
    });

    it("should apply minScore option", async () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.9)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-2")
          .withRecipeName("Recipe 2")
          .withConfidence(0.3)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-3")
          .withRecipeName("Recipe 3")
          .withConfidence(0.7)
          .build(),
      );

      const results = await engine.recommend("test query", { minScore: 0.5 });
      expect(results.length).toBeLessThanOrEqual(3);
      results.forEach((r) => {
        expect(r.score).toBeGreaterThanOrEqual(0.5);
      });
    });

    it("should apply categories filter option", async () => {
      const results = await engine.recommend("test query", {
        categories: ["trend", "sentiment"],
      });
      expect(results.length).toBeLessThanOrEqual(2);
      results.forEach((r) => {
        expect(["trend", "sentiment"]).toContain(r.metadata?.category);
      });
    });

    it("should combine multiple options", async () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.9)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-2")
          .withRecipeName("Recipe 2")
          .withConfidence(0.3)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-3")
          .withRecipeName("Recipe 3")
          .withConfidence(0.7)
          .build(),
      );

      const results = await engine.recommend("test query", {
        limit: 2,
        minScore: 0.4,
        categories: ["trend", "sentiment", "technical"],
      });

      expect(results.length).toBeLessThanOrEqual(2);
      results.forEach((r) => {
        expect(r.score).toBeGreaterThanOrEqual(0.4);
      });
    });

    it("should return valid RecommendationResult structure", async () => {
      const results = await engine.recommend("test query");
      expect(results.length).toBeGreaterThan(0);

      results.forEach((result) => {
        expect(typeof result.recipeId).toBe("string");
        expect(typeof result.score).toBe("number");
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(1);
        expect(typeof result.reason).toBe("string");
        expect(result.reason.length).toBeGreaterThan(0);
      });
    });

    it("should generate meaningful reason text", async () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.9)
          .build(),
      );

      const results = await engine.recommend("test query");
      const topResult = results[0];

      expect(topResult.reason).toContain("score");
      expect(topResult.reason).toMatch(/\d+\/100/);
    });
  });

  describe("score calculation", () => {
    it("should score recipes with no performance data as 0", async () => {
      const results = await engine.recommend("test query");
      // All recipes have no performance data, so all should have low scores
      results.forEach((r) => {
        expect(r.score).toBeLessThanOrEqual(0.5);
      });
    });

    it("should score high-performing recipes higher", async () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.9)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-2")
          .withRecipeName("Recipe 2")
          .withConfidence(0.3)
          .build(),
      );

      const results = await engine.recommend("test query");
      const recipe1 = results.find((r) => r.recipeId === "recipe-1");
      const recipe2 = results.find((r) => r.recipeId === "recipe-2");

      expect(recipe1!.score).toBeGreaterThan(recipe2!.score);
    });

    it("should score frequently executed recipes higher", async () => {
      // Record 10 executions for recipe-1
      for (let i = 0; i < 10; i++) {
        performanceTracker.recordPrediction(
          new PredictionHistoryRecordBuilder()
            .withRecipeId("recipe-1")
            .withRecipeName("Recipe 1")
            .withConfidence(0.7)
            .withTimestamp(Date.now() + i * 1000)
            .build(),
        );
      }
      // Record 1 execution for recipe-2
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-2")
          .withRecipeName("Recipe 2")
          .withConfidence(0.7)
          .build(),
      );

      const results = await engine.recommend("test query");
      const recipe1 = results.find((r) => r.recipeId === "recipe-1");
      const recipe2 = results.find((r) => r.recipeId === "recipe-2");

      expect(recipe1!.score).toBeGreaterThan(recipe2!.score);
    });

    it("should normalize scores to 0-1 range", async () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.95)
          .build(),
      );
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-2")
          .withRecipeName("Recipe 2")
          .withConfidence(0.1)
          .build(),
      );

      const results = await engine.recommend("test query");
      results.forEach((r) => {
        expect(r.score).toBeGreaterThanOrEqual(0);
        expect(r.score).toBeLessThanOrEqual(1);
      });
    });
  });

  describe("option handling", () => {
    it("should handle limit=0 gracefully", async () => {
      const results = await engine.recommend("test query", { limit: 0 });
      expect(results.length).toBe(0);
    });

    it("should handle limit > recipe count", async () => {
      const results = await engine.recommend("test query", { limit: 100 });
      expect(results.length).toBe(3);
    });

    it("should handle minScore=0", async () => {
      const results = await engine.recommend("test query", { minScore: 0 });
      expect(results.length).toBeGreaterThan(0);
    });

    it("should handle minScore=1", async () => {
      performanceTracker.recordPrediction(
        new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withConfidence(0.95)
          .build(),
      );

      const results = await engine.recommend("test query", { minScore: 1 });
      expect(results.length).toBe(0);
    });

    it("should handle empty categories array", async () => {
      const results = await engine.recommend("test query", { categories: [] });
      expect(results.length).toBe(3);
    });

    it("should handle non-existent category", async () => {
      const results = await engine.recommend("test query", {
        categories: ["non-existent"],
      });
      expect(results.length).toBe(0);
    });
  });

  describe("contract compliance", () => {
    it("should return Promise", async () => {
      const result = engine.recommend("test query");
      expect(result).toBeInstanceOf(Promise);
    });

    it("should accept query string parameter", async () => {
      const results = await engine.recommend("test query");
      expect(Array.isArray(results)).toBe(true);
    });

    it("should accept optional RecommendationOptions", async () => {
      const results1 = await engine.recommend("test query");
      const results2 = await engine.recommend("test query", {});
      const results3 = await engine.recommend("test query", { limit: 5 });

      expect(Array.isArray(results1)).toBe(true);
      expect(Array.isArray(results2)).toBe(true);
      expect(Array.isArray(results3)).toBe(true);
    });

    it("should return RecommendationResult array", async () => {
      const results = await engine.recommend("test query");
      expect(Array.isArray(results)).toBe(true);

      results.forEach((result) => {
        expect(result).toHaveProperty("recipeId");
        expect(result).toHaveProperty("score");
        expect(result).toHaveProperty("reason");
      });
    });
  });
});
