import { describe, it, expect, beforeEach } from "vitest";
import { PredictionHistoryRepository } from "./PredictionHistoryRepository";
import { PredictionResult } from "./types";

describe("PredictionHistoryRepository", () => {
  let repository: PredictionHistoryRepository;

  beforeEach(() => {
    // Get a fresh instance for each test
    repository = PredictionHistoryRepository.getInstance();
  });

  it("should record a prediction with all required fields", () => {
    const mockResult: PredictionResult = {
      id: "test-pred-1",
      prediction: "Test prediction",
      confidence: 0.85,
      reason: "Test reason",
      recipeUsed: "test-recipe",
      timestamp: Date.now(),
      metadata: {
        recipeId: "test-recipe",
        recipeName: "Test Recipe",
        executionTimestamp: Date.now(),
        confidenceScore: 0.85,
        evidenceCount: 2,
        predictionVersion: "1.0.0",
      },
      evidenceList: [],
      explanation: "Test explanation",
    };

    const request = {
      query: "Test query",
      recipeId: "test-recipe",
    };

    repository.record(mockResult, request);

    const history = repository.getAll();
    expect(history.length).toBeGreaterThan(0);

    const lastRecord = history[history.length - 1];
    expect(lastRecord.prediction).toBe("Test prediction");
    expect(lastRecord.confidence).toBe(0.85);
    expect(lastRecord.request.query).toBe("Test query");
    expect(lastRecord.request.recipeId).toBe("test-recipe");
    expect(lastRecord.timestamp).toBe(mockResult.timestamp);
    expect(lastRecord.executedRecipeNames).toContain("Test Recipe");
  });

  it("should return all recorded predictions", () => {
    const initialCount = repository.getCount();

    const mockResult: PredictionResult = {
      id: "test-pred-2",
      prediction: "Another test prediction",
      confidence: 0.75,
      reason: "Another test reason",
      recipeUsed: "test-recipe-2",
      timestamp: Date.now(),
      metadata: {
        recipeId: "test-recipe-2",
        recipeName: "Test Recipe 2",
        executionTimestamp: Date.now(),
        confidenceScore: 0.75,
        evidenceCount: 1,
        predictionVersion: "1.0.0",
      },
      evidenceList: [],
      explanation: "Another test explanation",
    };

    repository.record(mockResult, {
      query: "Another test query",
      recipeId: "test-recipe-2",
    });

    const history = repository.getAll();
    expect(history.length).toBe(initialCount + 1);
  });

  it("should handle predictions without recipeName in metadata", () => {
    const mockResult: PredictionResult = {
      id: "test-pred-3",
      prediction: "Test without recipe name",
      confidence: 0.9,
      reason: "Test reason",
      recipeUsed: "test-recipe-3",
      timestamp: Date.now(),
      metadata: {
        recipeId: "test-recipe-3",
        // recipeName is undefined
        executionTimestamp: Date.now(),
        confidenceScore: 0.9,
        evidenceCount: 0,
        predictionVersion: "1.0.0",
      },
      evidenceList: [],
      explanation: "Test explanation",
    };

    repository.record(mockResult, {
      query: "Test query",
      recipeId: "test-recipe-3",
    });

    const history = repository.getAll();
    const lastRecord = history[history.length - 1];
    expect(lastRecord.executedRecipeNames).toEqual([]);
  });

  it("should maintain request information in history", () => {
    const mockResult: PredictionResult = {
      id: "test-pred-4",
      prediction: "Test with request info",
      confidence: 0.8,
      reason: "Test reason",
      recipeUsed: "test-recipe-4",
      timestamp: Date.now(),
      metadata: {
        recipeId: "test-recipe-4",
        recipeName: "Test Recipe 4",
        executionTimestamp: Date.now(),
        confidenceScore: 0.8,
        evidenceCount: 3,
        predictionVersion: "1.0.0",
      },
      evidenceList: [],
      explanation: "Test explanation",
    };

    const request = {
      query: "Will the market crash?",
      recipeId: "test-recipe-4",
    };

    repository.record(mockResult, request);

    const history = repository.getAll();
    const lastRecord = history[history.length - 1];
    expect(lastRecord.request).toEqual(request);
    expect(lastRecord.request.query).toBe("Will the market crash?");
    expect(lastRecord.request.recipeId).toBe("test-recipe-4");
  });
});
