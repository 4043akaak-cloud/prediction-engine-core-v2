import { describe, it, expect, beforeEach } from "vitest";
import { MultiRecipeEnsembleEngine } from "./MultiRecipeEnsembleEngine";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { PredictionHistoryAnalytics } from "./PredictionHistoryAnalytics";
import { RecipeRecommendationEngine } from "./RecipeRecommendationEngine";
import { PredictionResult } from "./types";

describe("MultiRecipeEnsembleEngine", () => {
  let ensembleEngine: MultiRecipeEnsembleEngine;
  let performanceTracker: RecipePerformanceTracker;
  let analytics: PredictionHistoryAnalytics;
  let recommendationEngine: RecipeRecommendationEngine;

  beforeEach(() => {
    performanceTracker = new RecipePerformanceTracker();
    analytics = new PredictionHistoryAnalytics(performanceTracker);
    recommendationEngine = new RecipeRecommendationEngine(performanceTracker, analytics);
    ensembleEngine = new MultiRecipeEnsembleEngine(performanceTracker, analytics, recommendationEngine);
  });

  it("should handle single prediction", () => {
    const prediction: PredictionResult = {
      id: "pred-1",
      prediction: "The market will go up",
      confidence: 0.8,
      timestamp: Date.now(),
      metadata: { recipeName: "mock-recipe" },
      reason: "Based on mock data",
      recipeUsed: "mock-recipe",
      explanation: "Mock explanation",
      recommendationMetadata: {
        recommendedRecipes: ["mock-recipe"],
        selectedRecipes: ["mock-recipe"],
        recommendationScore: 75,
        recommendationReason: "High performance",
      },
    };

    const result = ensembleEngine.ensemblePredictions([prediction]);

    expect(result.finalPrediction).toBe("The market will go up");
    expect(result.ensembleConfidence).toBe(0.8);
    expect(result.agreementScore).toBe(1.0);
    expect(result.disagreementScore).toBe(0.0);
    expect(result.contributingRecipes).toContain("mock-recipe");
    expect(result.minorityOpinions).toHaveLength(0);
  });

  it("should perform weighted voting ensemble with agreement", () => {
    const predictions: PredictionResult[] = [
      {
        id: "pred-1",
        prediction: "The market will go up",
        confidence: 0.9,
        timestamp: Date.now(),
        metadata: { recipeName: "mock-recipe" },
        reason: "Mock prediction",
        recipeUsed: "mock-recipe",
        explanation: "Mock explanation",
        recommendationMetadata: {
          recommendedRecipes: ["mock-recipe"],
          selectedRecipes: ["mock-recipe"],
          recommendationScore: 80,
          recommendationReason: "High performance",
        },
      },
      {
        id: "pred-2",
        prediction: "The market will go up",
        confidence: 0.85,
        timestamp: Date.now(),
        metadata: { recipeName: "trend-recipe" },
        reason: "Trend prediction",
        recipeUsed: "trend-recipe",
        explanation: "Trend explanation",
        recommendationMetadata: {
          recommendedRecipes: ["trend-recipe"],
          selectedRecipes: ["trend-recipe"],
          recommendationScore: 75,
          recommendationReason: "Good performance",
        },
      },
    ];

    const result = ensembleEngine.ensemblePredictions(predictions, "weighted-voting");

    expect(result.finalPrediction).toBe("The market will go up");
    expect(result.ensembleConfidence).toBeGreaterThan(0.8);
    expect(result.agreementScore).toBeGreaterThan(0.5);
    expect(result.disagreementScore).toBeLessThan(0.5);
    expect(result.contributingRecipes).toHaveLength(2);
    expect(result.minorityOpinions).toHaveLength(0);
  });

  it("should perform majority voting ensemble with disagreement", () => {
    const predictions: PredictionResult[] = [
      {
        id: "pred-1",
        prediction: "The market will go up",
        confidence: 0.8,
        timestamp: Date.now(),
        metadata: { recipeName: "mock-recipe" },
        reason: "Mock prediction",
        recipeUsed: "mock-recipe",
        explanation: "Mock explanation",
        recommendationMetadata: {
          recommendedRecipes: ["mock-recipe"],
          selectedRecipes: ["mock-recipe"],
          recommendationScore: 70,
          recommendationReason: "Moderate performance",
        },
      },
      {
        id: "pred-2",
        prediction: "The market will go up",
        confidence: 0.75,
        timestamp: Date.now(),
        metadata: { recipeName: "trend-recipe" },
        reason: "Trend prediction",
        recipeUsed: "trend-recipe",
        explanation: "Trend explanation",
        recommendationMetadata: {
          recommendedRecipes: ["trend-recipe"],
          selectedRecipes: ["trend-recipe"],
          recommendationScore: 65,
          recommendationReason: "Fair performance",
        },
      },
      {
        id: "pred-3",
        prediction: "The market will go down",
        confidence: 0.7,
        timestamp: Date.now(),
        metadata: { recipeName: "statistical-recipe" },
        reason: "Statistical prediction",
        recipeUsed: "statistical-recipe",
        explanation: "Statistical explanation",
        recommendationMetadata: {
          recommendedRecipes: ["statistical-recipe"],
          selectedRecipes: ["statistical-recipe"],
          recommendationScore: 60,
          recommendationReason: "Moderate performance",
        },
      },
    ];

    const result = ensembleEngine.ensemblePredictions(predictions, "majority-voting");

    expect(result.finalPrediction).toBe("The market will go up");
    expect(result.agreementScore).toBeCloseTo(0.667, 1);
    expect(result.minorityOpinions).toContain("The market will go down");
  });

  it("should perform confidence-weighted ensemble", () => {
    const predictions: PredictionResult[] = [
      {
        id: "pred-1",
        prediction: "The market will go up",
        confidence: 0.95,
        timestamp: Date.now(),
        metadata: { recipeName: "mock-recipe" },
        reason: "Mock prediction",
        recipeUsed: "mock-recipe",
        explanation: "Mock explanation",
        recommendationMetadata: {
          recommendedRecipes: ["mock-recipe"],
          selectedRecipes: ["mock-recipe"],
          recommendationScore: 85,
          recommendationReason: "High performance",
        },
      },
      {
        id: "pred-2",
        prediction: "The market will go down",
        confidence: 0.6,
        timestamp: Date.now(),
        metadata: { recipeName: "trend-recipe" },
        reason: "Trend prediction",
        recipeUsed: "trend-recipe",
        explanation: "Trend explanation",
        recommendationMetadata: {
          recommendedRecipes: ["trend-recipe"],
          selectedRecipes: ["trend-recipe"],
          recommendationScore: 70,
          recommendationReason: "Good performance",
        },
      },
    ];

    const result = ensembleEngine.ensemblePredictions(predictions, "confidence-weighted");

    expect(result.finalPrediction).toBe("The market will go up");
    expect(result.ensembleConfidence).toBeGreaterThan(0.7);
  });

  it("should perform hybrid ensemble", () => {
    const predictions: PredictionResult[] = [
      {
        id: "pred-1",
        prediction: "The market will go up",
        confidence: 0.85,
        timestamp: Date.now(),
        metadata: { recipeName: "mock-recipe" },
        reason: "Mock prediction",
        recipeUsed: "mock-recipe",
        explanation: "Mock explanation",
        recommendationMetadata: {
          recommendedRecipes: ["mock-recipe"],
          selectedRecipes: ["mock-recipe"],
          recommendationScore: 80,
          recommendationReason: "High performance",
        },
      },
      {
        id: "pred-2",
        prediction: "The market will go up",
        confidence: 0.8,
        timestamp: Date.now(),
        metadata: { recipeName: "trend-recipe" },
        reason: "Trend prediction",
        recipeUsed: "trend-recipe",
        explanation: "Trend explanation",
        recommendationMetadata: {
          recommendedRecipes: ["trend-recipe"],
          selectedRecipes: ["trend-recipe"],
          recommendationScore: 75,
          recommendationReason: "Good performance",
        },
      },
    ];

    const result = ensembleEngine.ensemblePredictions(predictions, "hybrid");

    expect(result.finalPrediction).toBe("The market will go up");
    expect(result.strategy).toBe("hybrid");
    expect(result.ensembleConfidence).toBeGreaterThan(0.7);
    expect(result.agreementScore).toBeGreaterThan(0.5);
  });

  it("should throw error on empty predictions", () => {
    expect(() => {
      ensembleEngine.ensemblePredictions([]);
    }).toThrow("Cannot ensemble empty predictions array");
  });

  it("should generate explanation", () => {
    const predictions: PredictionResult[] = [
      {
        id: "pred-1",
        prediction: "The market will go up",
        confidence: 0.9,
        timestamp: Date.now(),
        metadata: { recipeName: "mock-recipe" },
        reason: "Mock prediction",
        recipeUsed: "mock-recipe",
        explanation: "Mock explanation",
        recommendationMetadata: {
          recommendedRecipes: ["mock-recipe"],
          selectedRecipes: ["mock-recipe"],
          recommendationScore: 85,
          recommendationReason: "High performance",
        },
      },
    ];

    const result = ensembleEngine.ensemblePredictions(predictions);

    expect(result.ensembleExplanation).toBeDefined();
    expect(result.ensembleExplanation).toBeDefined();
    expect(result.ensembleExplanation).toContain("The market will go up");
  });

  it("should calculate recipe weights correctly", () => {
    const predictions: PredictionResult[] = [
      {
        id: "pred-1",
        prediction: "Prediction A",
        confidence: 0.8,
        timestamp: Date.now(),
        metadata: { recipeName: "recipe-1" },
        reason: "Reason 1",
        recipeUsed: "recipe-1",
        explanation: "Explanation 1",
        recommendationMetadata: {
          recommendedRecipes: ["recipe-1"],
          selectedRecipes: ["recipe-1"],
          recommendationScore: 80,
          recommendationReason: "Good",
        },
      },
      {
        id: "pred-2",
        prediction: "Prediction A",
        confidence: 0.7,
        timestamp: Date.now(),
        metadata: { recipeName: "recipe-2" },
        reason: "Reason 2",
        recipeUsed: "recipe-2",
        explanation: "Explanation 2",
        recommendationMetadata: {
          recommendedRecipes: ["recipe-2"],
          selectedRecipes: ["recipe-2"],
          recommendationScore: 60,
          recommendationReason: "Fair",
        },
      },
    ];

    const result = ensembleEngine.ensemblePredictions(predictions);

    expect(result.recipeWeights).toBeDefined();
    expect(result.recipeWeights["recipe-1"]).toBeGreaterThan(0);
    expect(result.recipeWeights["recipe-2"]).toBeGreaterThan(0);

    // Sum of weights should be approximately 1.0
    const totalWeight = Object.values(result.recipeWeights).reduce((a, b) => a + b, 0);
    expect(totalWeight).toBeCloseTo(1.0, 1);
  });
});
