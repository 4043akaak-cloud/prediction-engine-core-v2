import { describe, it, expect, beforeEach } from "vitest";
import { LearningEngine } from "./LearningEngine";
import { PredictionHistoryRepository } from "./PredictionHistoryRepository";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";
import { RecipeRegistry } from "./RecipeRegistry";
import { PredictionResult } from "./types";

describe("LearningEngine", () => {
  let learningEngine: LearningEngine;
  let historyRepository: PredictionHistoryRepository;
  let performanceTracker: RecipePerformanceTracker;
  let evolutionEngine: RecipeEvolutionEngine;

  beforeEach(() => {
    historyRepository = PredictionHistoryRepository.getInstance();
    performanceTracker = new RecipePerformanceTracker();
    evolutionEngine = new RecipeEvolutionEngine(performanceTracker);
    learningEngine = new LearningEngine(historyRepository, performanceTracker, evolutionEngine);
    RecipeRegistry.getInstance().__test_resetForTesting?.();
  });

  describe("learn()", () => {
    it("should learn from exact match prediction", async () => {
      // Create and record a prediction
      const predictionResult: PredictionResult = {
        id: "test-pred-1",
        prediction: "sunny",
        confidence: 0.8,
        reason: "Test prediction",
        recipeUsed: "recipe-1",
        timestamp: Date.now(),
        metadata: {
          recipeId: "recipe-1",
          recipeName: "Recipe 1",
          executionTimestamp: Date.now(),
          confidenceScore: 0.8,
          evidenceCount: 0,
          predictionVersion: "1.0",
        },
      };

      historyRepository.record(predictionResult, {
        query: "Will it be sunny?",
        recipeId: "recipe-1",
      });

      // Get the actual recorded ID
      const allRecords = historyRepository.getAll();
      const recordedId = allRecords[0]?.id;
      expect(recordedId).toBeDefined();

      // Learn from exact match
      const result = await learningEngine.learn(recordedId!, "sunny");

      expect(result.success).toBe(true);
      expect(result.updatedRecipes).toContain("recipe-1");
      expect(result.metadata?.accuracy).toBe(1.0);
    });

    it("should calculate 0.8 for fuzzy match", async () => {
      const predictionResult: PredictionResult = {
        id: "test-pred-2",
        prediction: "prediction",
        confidence: 0.7,
        reason: "Test",
        recipeUsed: "recipe-1",
        timestamp: Date.now(),
        metadata: {
          recipeId: "recipe-1",
          recipeName: "Recipe 1",
          executionTimestamp: Date.now(),
          confidenceScore: 0.7,
          evidenceCount: 0,
          predictionVersion: "1.0",
        },
      };

      historyRepository.record(predictionResult, {
        query: "Weather?",
        recipeId: "recipe-1",
      });

      const allRecords = historyRepository.getAll();
      const recordedId = allRecords[allRecords.length - 1]?.id;

      const result = await learningEngine.learn(recordedId!, "predction");
      expect(result.success).toBe(true);
      expect(result.metadata?.accuracy).toBe(0.8);
    });

    it("should calculate 0.5 for partial match", async () => {
      const predictionResult: PredictionResult = {
        id: "test-pred-3",
        prediction: "sunny and warm",
        confidence: 0.7,
        reason: "Test",
        recipeUsed: "recipe-1",
        timestamp: Date.now(),
        metadata: {
          recipeId: "recipe-1",
          recipeName: "Recipe 1",
          executionTimestamp: Date.now(),
          confidenceScore: 0.7,
          evidenceCount: 0,
          predictionVersion: "1.0",
        },
      };

      historyRepository.record(predictionResult, {
        query: "Weather?",
        recipeId: "recipe-1",
      });

      const allRecords = historyRepository.getAll();
      const recordedId = allRecords[allRecords.length - 1]?.id;

      const result = await learningEngine.learn(recordedId!, "sunny and cold");
      expect(result.success).toBe(true);
      expect(result.metadata?.accuracy).toBe(0.5);
    });

    it("should calculate 0.0 for no match", async () => {
      const predictionResult: PredictionResult = {
        id: "test-pred-4",
        prediction: "sunny",
        confidence: 0.8,
        reason: "Test",
        recipeUsed: "recipe-1",
        timestamp: Date.now(),
        metadata: {
          recipeId: "recipe-1",
          recipeName: "Recipe 1",
          executionTimestamp: Date.now(),
          confidenceScore: 0.8,
          evidenceCount: 0,
          predictionVersion: "1.0",
        },
      };

      historyRepository.record(predictionResult, {
        query: "Weather?",
        recipeId: "recipe-1",
      });

      const allRecords = historyRepository.getAll();
      const recordedId = allRecords[allRecords.length - 1]?.id;

      const result = await learningEngine.learn(recordedId!, "rainy");
      expect(result.success).toBe(true);
      expect(result.metadata?.accuracy).toBe(0.0);
    });

    it("should handle prediction not found", async () => {
      const result = await learningEngine.learn("non-existent-id", "sunny");
      expect(result.success).toBe(false);
      expect(result.updatedRecipes).toHaveLength(0);
      expect(result.metadata?.error).toContain("not found");
    });

    it("should update recipe performance", async () => {
      const predictionResult: PredictionResult = {
        id: "test-pred-5",
        prediction: "sunny",
        confidence: 0.5,
        reason: "Test",
        recipeUsed: "recipe-1",
        timestamp: Date.now(),
        metadata: {
          recipeId: "recipe-1",
          recipeName: "Recipe 1",
          executionTimestamp: Date.now(),
          confidenceScore: 0.5,
          evidenceCount: 0,
          predictionVersion: "1.0",
        },
      };

      historyRepository.record(predictionResult, {
        query: "Weather?",
        recipeId: "recipe-1",
      });

      const allRecords = historyRepository.getAll();
      const recordedId = allRecords[allRecords.length - 1]?.id;

      await learningEngine.learn(recordedId!, "sunny");

      const stats = performanceTracker.getRecipeStats("recipe-1");
      expect(stats).toBeDefined();
      expect(stats?.executionCount).toBeGreaterThan(0);
    });

    it("should trigger evolution analysis", async () => {
      const predictionResult: PredictionResult = {
        id: "test-pred-6",
        prediction: "sunny",
        confidence: 0.8,
        reason: "Test",
        recipeUsed: "recipe-1",
        timestamp: Date.now(),
        metadata: {
          recipeId: "recipe-1",
          recipeName: "Recipe 1",
          executionTimestamp: Date.now(),
          confidenceScore: 0.8,
          evidenceCount: 0,
          predictionVersion: "1.0",
        },
      };

      historyRepository.record(predictionResult, {
        query: "Weather?",
        recipeId: "recipe-1",
      });

      const allRecords = historyRepository.getAll();
      const recordedId = allRecords[allRecords.length - 1]?.id;

      const result = await learningEngine.learn(recordedId!, "sunny");
      expect(result.recommendationsUpdated).toBe(true);
    });
  });
});
