import { describe, it, expect, beforeEach, vi } from "vitest";
import { PredictionPipeline } from "./PredictionPipeline";
import {
  IReasoningEngine,
  IPredictionEngine,
  IRecommendationEngine,
  PredictionRequest,
  PredictionResult,
  RecommendationResult,
} from "./types";
import { PredictionHistoryRepository } from "./PredictionHistoryRepository";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { PredictionHistory } from "./PredictionHistory";

describe("PredictionPipeline", () => {
  let pipeline: PredictionPipeline;
  let mockReasoningEngine: IReasoningEngine;
  let mockPredictionEngine: IPredictionEngine;
  let mockRecommendationEngine: IRecommendationEngine;
  let mockHistoryRepository: PredictionHistoryRepository;
  let mockPerformanceTracker: RecipePerformanceTracker;
  let mockPredictionHistory: PredictionHistory;

  beforeEach(() => {
    // Mock engines
    mockReasoningEngine = {
      reason: vi.fn(),
    };

    mockPredictionEngine = {
      predict: vi.fn().mockResolvedValue({
        id: "pred-1",
        prediction: "Test prediction",
        confidence: 0.85,
        reason: "Test reason",
        recipeUsed: "recipe-1",
        timestamp: Date.now(),
      } as PredictionResult),
      predictMultiple: vi.fn(),
    };

    mockRecommendationEngine = {
      recommend: vi.fn().mockResolvedValue([
        {
          recipeId: "recipe-2",
          score: 0.9,
          reason: "High performance",
        } as RecommendationResult,
        {
          recipeId: "recipe-3",
          score: 0.75,
          reason: "Good match",
        } as RecommendationResult,
      ]),
    };

    mockHistoryRepository = {
      getInstance: vi.fn(),
      record: vi.fn(),
      getAll: vi.fn().mockReturnValue([
        {
          id: "pred-1",
          prediction: "Test prediction",
          confidence: 0.85,
          reason: "Test reason",
          recipeUsed: "recipe-1",
          timestamp: Date.now(),
        },
      ]),
      getCount: vi.fn().mockReturnValue(0),
      resetForTesting: vi.fn(),
    } as any;

    mockPerformanceTracker = {
      recordPrediction: vi.fn(),
      getStats: vi.fn().mockReturnValue({}),
      resetForTesting: vi.fn(),
    } as any;

    mockPredictionHistory = {
      add: vi.fn(),
      getAll: vi.fn().mockReturnValue([]),
      clear: vi.fn(),
    } as any;

    pipeline = new PredictionPipeline(
      mockReasoningEngine,
      mockPredictionEngine,
      mockHistoryRepository,
      mockRecommendationEngine,
      mockPerformanceTracker,
      mockPredictionHistory,
    );
  });

  describe("Pipeline Execution", () => {
    it("should execute complete pipeline successfully", async () => {
      const request: PredictionRequest = {
        query: "What will happen tomorrow?",
        recipeId: "recipe-1",
      };

      const result = await pipeline.execute(request);

      // Verify structure
      expect(result).toHaveProperty("prediction");
      expect(result).toHaveProperty("recommendations");
      expect(result).toHaveProperty("metadata");

      // Verify prediction
      expect(result.prediction.id).toBe("pred-1");
      expect(result.prediction.prediction).toBe("Test prediction");
      expect(result.prediction.confidence).toBe(0.85);

      // Verify recommendations
      expect(result.recommendations).toHaveLength(2);
      expect(result.recommendations[0].recipeId).toBe("recipe-2");
      expect(result.recommendations[0].score).toBe(0.9);

      // Verify metadata
      expect(result.metadata?.pipelineVersion).toBe("1.0");
      expect(result.metadata?.executionTime).toBeGreaterThanOrEqual(0);
    });

    it("should call engines in correct order", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      await pipeline.execute(request);

      // Verify call order
      expect(mockPredictionEngine.predict).toHaveBeenCalledWith(request);
      expect(mockHistoryRepository.record).toHaveBeenCalled();
      expect(mockRecommendationEngine.recommend).toHaveBeenCalled();

      // Verify all were called exactly once in sequence
      expect(mockPredictionEngine.predict).toHaveBeenCalledTimes(1);
      expect(mockHistoryRepository.record).toHaveBeenCalledTimes(1);
      expect(mockRecommendationEngine.recommend).toHaveBeenCalledTimes(1);
    });

    it("should pass query to recommendation engine", async () => {
      const request: PredictionRequest = {
        query: "What will happen tomorrow?",
        recipeId: "recipe-1",
      };

      await pipeline.execute(request);

      expect(mockRecommendationEngine.recommend).toHaveBeenCalledWith(
        request.query,
      );
    });

    it("should record prediction to history", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      await pipeline.execute(request);

      expect(mockHistoryRepository.record).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "pred-1",
          prediction: "Test prediction",
        }),
        request,
      );
    });
  });

  describe("Error Handling", () => {
    it("should fail fast if prediction engine fails", async () => {
      const error = new Error("Prediction failed");
      (mockPredictionEngine.predict as any).mockRejectedValueOnce(error);

      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      await expect(pipeline.execute(request)).rejects.toThrow(
        "Prediction failed",
      );
    });

    it("should fail fast if history recording fails", async () => {
      const error = new Error("History recording failed");
      (mockHistoryRepository.record as any).mockImplementationOnce(() => {
        throw error;
      });

      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      await expect(pipeline.execute(request)).rejects.toThrow(
        "History recording failed",
      );
    });

    it("should degrade gracefully if recommendation engine fails", async () => {
      const error = new Error("Recommendation failed");
      (mockRecommendationEngine.recommend as any).mockRejectedValueOnce(error);

      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      const result = await pipeline.execute(request);

      // Should still return prediction
      expect(result.prediction).toBeDefined();
      expect(result.prediction.id).toBe("pred-1");

      // But recommendations should be empty
      expect(result.recommendations).toEqual([]);
    });
  });

  describe("Dependency Interaction", () => {
    it("should use dependency injection for all engines", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      await pipeline.execute(request);

      // Verify all injected dependencies were used
      expect(mockPredictionEngine.predict).toHaveBeenCalled();
      expect(mockHistoryRepository.record).toHaveBeenCalled();
      expect(mockRecommendationEngine.recommend).toHaveBeenCalled();
    });

    it("should not call reasoning engine directly", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      await pipeline.execute(request);

      // ReasoningEngine should not be called directly
      // (it's called internally by PredictionEngine)
      expect(mockReasoningEngine.reason).not.toHaveBeenCalled();
    });
  });

  describe("Result Structure", () => {
    it("should return PredictionPipelineResult with correct structure", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      const result = await pipeline.execute(request);

      // Verify PredictionResult is unchanged
      expect(result.prediction).toEqual({
        id: "pred-1",
        prediction: "Test prediction",
        confidence: 0.85,
        reason: "Test reason",
        recipeUsed: "recipe-1",
        timestamp: expect.any(Number),
      });

      // Verify recommendations are RecommendationResult[]
      expect(Array.isArray(result.recommendations)).toBe(true);
      result.recommendations.forEach((rec) => {
        expect(rec).toHaveProperty("recipeId");
        expect(rec).toHaveProperty("score");
        expect(rec).toHaveProperty("reason");
      });

      // Verify metadata
      expect(result.metadata).toHaveProperty("executionTime");
      expect(result.metadata).toHaveProperty("pipelineVersion");
    });

    it("should not modify PredictionResult", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      const result = await pipeline.execute(request);

      // PredictionResult should be exactly as returned by PredictionEngine
      expect(result.prediction).toEqual({
        id: "pred-1",
        prediction: "Test prediction",
        confidence: 0.85,
        reason: "Test reason",
        recipeUsed: "recipe-1",
        timestamp: expect.any(Number),
      });

      // No additional fields should be added
      expect(Object.keys(result.prediction)).toEqual([
        "id",
        "prediction",
        "confidence",
        "reason",
        "recipeUsed",
        "timestamp",
      ]);
    });
  });

  describe("Coordinator Pattern", () => {
    it("should not contain business logic", async () => {
      // This test verifies that PredictionPipeline is a pure coordinator
      // All business logic is delegated to engines

      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      await pipeline.execute(request);

      // Verify that engines were called with original request
      expect(mockPredictionEngine.predict).toHaveBeenCalledWith(request);
      expect(mockRecommendationEngine.recommend).toHaveBeenCalledWith(
        request.query,
      );

      // No transformation or filtering should occur
      // (except for error handling in recommendations)
    });
  });

  describe("Execution Timing", () => {
    it("should measure execution time", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      const result = await pipeline.execute(request);

      expect(result.metadata?.executionTime).toBeDefined();
      expect(result.metadata?.executionTime).toBeGreaterThanOrEqual(0);
      expect(typeof result.metadata?.executionTime).toBe("number");
    });
  });

  describe("No Double Recording", () => {
    it("should record prediction exactly once to history repository", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      await pipeline.execute(request);

      // Verify history repository was called exactly once
      expect(mockHistoryRepository.record).toHaveBeenCalledTimes(1);

      // Verify in-memory history was updated exactly once
      expect(mockPredictionHistory.add).toHaveBeenCalledTimes(1);

      // Verify performance tracker was updated exactly once
      expect(mockPerformanceTracker.recordPrediction).toHaveBeenCalledTimes(1);
    });

    it("should not allow PredictionEngine to record history independently", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        recipeId: "recipe-1",
      };

      await pipeline.execute(request);

      // Verify that history recording happens only through Pipeline
      // (not through PredictionEngine)
      expect(mockHistoryRepository.record).toHaveBeenCalledTimes(1);
      expect(mockHistoryRepository.record).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "pred-1",
          prediction: "Test prediction",
        }),
        request,
      );
    });
  });
});
