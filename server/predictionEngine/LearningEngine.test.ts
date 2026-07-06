import { describe, it, expect, beforeEach } from "vitest";
import { LearningEngine } from "./LearningEngine";
import { PredictionHistoryRepository, PredictionHistoryRecord } from "./PredictionHistoryRepository";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";
import { RecipeRegistry } from "./RecipeRegistry";
import { PredictionHistoryRecordBuilder } from "./PredictionHistoryRecordBuilder";

describe("LearningEngine", () => {
  let learningEngine: LearningEngine;
  let historyRepository: PredictionHistoryRepository;
  let performanceTracker: RecipePerformanceTracker;
  let evolutionEngine: RecipeEvolutionEngine;

  beforeEach(() => {
    // Reset Singleton instances for testing
    historyRepository = PredictionHistoryRepository.getInstance();
    performanceTracker = new RecipePerformanceTracker();
    evolutionEngine = new RecipeEvolutionEngine(performanceTracker);
    learningEngine = new LearningEngine(historyRepository, performanceTracker, evolutionEngine);

    // Reset RecipeRegistry for testing
    RecipeRegistry.getInstance().__test_resetForTesting?.();
  });

  describe("learn()", () => {
    describe("success cases", () => {
      it("should learn from exact match prediction", async () => {
        // Setup: Create a prediction in history
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("sunny")
          .withConfidence(0.8)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        // Act: Learn from exact match
        const result = await learningEngine.learn(record.id, "sunny");

        // Assert
        expect(result.success).toBe(true);
        expect(result.updatedRecipes).toContain("recipe-1");
        expect(result.metadata?.accuracy).toBe(1.0);
      });

      it("should learn from fuzzy match prediction", async () => {
        // Setup
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("sunny weather")
          .withConfidence(0.7)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        // Act: Learn from fuzzy match (90%+ similarity)
        const result = await learningEngine.learn(record.id, "sunny");

        // Assert
        expect(result.success).toBe(true);
        expect(result.updatedRecipes).toContain("recipe-1");
        expect(result.metadata?.accuracy).toBe(0.8);
      });

      it("should learn from partial match prediction", async () => {
        // Setup
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("sunny and warm")
          .withConfidence(0.7)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        // Act: Learn from partial match
        const result = await learningEngine.learn(record.id, "sunny and cold");

        // Assert
        expect(result.success).toBe(true);
        expect(result.updatedRecipes).toContain("recipe-1");
        expect(result.metadata?.accuracy).toBe(0.5);
      });

      it("should learn from no match prediction", async () => {
        // Setup
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("sunny")
          .withConfidence(0.8)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        // Act: Learn from no match
        const result = await learningEngine.learn(record.id, "rainy");

        // Assert
        expect(result.success).toBe(true);
        expect(result.updatedRecipes).toContain("recipe-1");
        expect(result.metadata?.accuracy).toBe(0.0);
      });

      it("should update recipe performance after learning", async () => {
        // Setup
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("sunny")
          .withConfidence(0.5)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        // Act
        await learningEngine.learn(record.id, "sunny");

        // Assert: Check that performance tracker was updated
        const stats = performanceTracker.getRecipeStats("recipe-1");
        expect(stats).toBeDefined();
        expect(stats?.executionCount).toBeGreaterThan(0);
      });

      it("should trigger evolution analysis", async () => {
        // Setup
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("sunny")
          .withConfidence(0.8)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        // Act
        const result = await learningEngine.learn(record.id, "sunny");

        // Assert
        expect(result.recommendationsUpdated).toBe(true);
        expect(result.metadata?.analysis).toBeDefined();
      });
    });

    describe("error cases", () => {
      it("should handle prediction not found", async () => {
        // Act
        const result = await learningEngine.learn("non-existent-id", "sunny");

        // Assert
        expect(result.success).toBe(false);
        expect(result.updatedRecipes).toHaveLength(0);
        expect(result.metadata?.error).toContain("not found");
      });

      it("should handle empty prediction history", async () => {
        // Act
        const result = await learningEngine.learn("any-id", "sunny");

        // Assert
        expect(result.success).toBe(false);
        expect(result.updatedRecipes).toHaveLength(0);
      });
    });

    describe("accuracy calculation", () => {
      it("should calculate 1.0 for exact match", async () => {
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("test")
          .withConfidence(0.8)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        const result = await learningEngine.learn(record.id, "test");
        expect(result.metadata?.accuracy).toBe(1.0);
      });

      it("should calculate 0.0 for no match", async () => {
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("abc")
          .withConfidence(0.8)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        const result = await learningEngine.learn(record.id, "xyz");
        expect(result.metadata?.accuracy).toBe(0.0);
      });

      it("should handle case-insensitive comparison", async () => {
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("SUNNY")
          .withConfidence(0.8)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        const result = await learningEngine.learn(record.id, "sunny");
        expect(result.metadata?.accuracy).toBe(1.0);
      });

      it("should handle whitespace trimming", async () => {
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("  sunny  ")
          .withConfidence(0.8)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        const result = await learningEngine.learn(record.id, "sunny");
        expect(result.metadata?.accuracy).toBe(1.0);
      });
    });

    describe("metadata", () => {
      it("should include learning metadata in result", async () => {
        const record = new PredictionHistoryRecordBuilder()
          .withRecipeId("recipe-1")
          .withRecipeName("Recipe 1")
          .withPrediction("sunny")
          .withConfidence(0.8)
          .build();

        historyRepository.record(
          {
            id: record.id,
            prediction: record.prediction,
            confidence: record.confidence,
            reason: "Test prediction",
            recipeUsed: "recipe-1",
            timestamp: record.timestamp,
            metadata: {
              recipeId: "recipe-1",
              recipeName: "Recipe 1",
              executionTimestamp: record.timestamp,
              confidenceScore: record.confidence,
              evidenceCount: 0,
              predictionVersion: "1.0",
            },
          },
          record.request,
        );

        const result = await learningEngine.learn(record.id, "sunny");

        expect(result.metadata?.predictionId).toBe(record.id);
        expect(result.metadata?.recipeId).toBe("recipe-1");
        expect(result.metadata?.accuracy).toBe(1.0);
        expect(result.metadata?.actualResult).toBe("sunny");
        expect(result.metadata?.note).toContain("v1");
      });
    });
  });
});
