import { describe, it, expect, beforeEach } from "vitest";
import { RecipeRecommendationEngine } from "./RecipeRecommendationEngine";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { PredictionHistoryAnalytics } from "./PredictionHistoryAnalytics";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";
import { PredictionHistoryRepository } from "./PredictionHistoryRepository";

describe("RecipeRecommendationEngine", () => {
  let engine: RecipeRecommendationEngine;
  let performanceTracker: RecipePerformanceTracker;
  let analytics: PredictionHistoryAnalytics;
  let evolutionEngine: RecipeEvolutionEngine;
  let historyRepository: PredictionHistoryRepository;

  beforeEach(() => {
    performanceTracker = new RecipePerformanceTracker();
    historyRepository = PredictionHistoryRepository.getInstance();
    analytics = new PredictionHistoryAnalytics(historyRepository);
    evolutionEngine = new RecipeEvolutionEngine(performanceTracker, analytics, historyRepository);
    engine = new RecipeRecommendationEngine(performanceTracker, analytics, evolutionEngine);
  });

  it("should return empty recommendations for no recipes", () => {
    const recommendations = engine.recommendRecipes({ query: "test" });
    expect(recommendations.length).toBe(0);
  });

  it("should recommend recipes sorted by score descending", () => {
    const recipe1 = "high-score-recipe";
    const recipe2 = "low-score-recipe";

    // Create high-performing recipe
    for (let i = 0; i < 5; i++) {
      performanceTracker.recordPrediction({
        id: `pred-high-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId: recipe1 },
        prediction: "test",
        confidence: 0.9,
        executedRecipeNames: [recipe1],
      });
    }

    // Create low-performing recipe
    performanceTracker.recordPrediction({
      id: "pred-low-1",
      timestamp: Date.now(),
      request: { query: "test", recipeId: recipe2 },
      prediction: "test",
      confidence: 0.3,
      executedRecipeNames: [recipe2],
    });

    const recommendations = engine.recommendRecipes({ query: "test" });

    expect(recommendations.length).toBe(2);
    expect(recommendations[0].recipeId).toBe(recipe1);
    expect(recommendations[0].score).toBeGreaterThan(recommendations[1].score);
  });

  it("should calculate recommendation score between 0-100", () => {
    const recipeId = "test-recipe";

    for (let i = 0; i < 3; i++) {
      performanceTracker.recordPrediction({
        id: `pred-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId },
        prediction: "test",
        confidence: 0.7,
        executedRecipeNames: [recipeId],
      });
    }

    const recommendations = engine.recommendRecipes({ query: "test" });

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].score).toBeGreaterThanOrEqual(0);
    expect(recommendations[0].score).toBeLessThanOrEqual(100);
  });

  it("should assign priority based on score", () => {
    const highScoreRecipe = "high-score";
    const lowScoreRecipe = "low-score";

    // High-performing recipe
    for (let i = 0; i < 5; i++) {
      performanceTracker.recordPrediction({
        id: `pred-high-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId: highScoreRecipe },
        prediction: "test",
        confidence: 0.95,
        executedRecipeNames: [highScoreRecipe],
      });
    }

    // Low-performing recipe
    performanceTracker.recordPrediction({
      id: "pred-low-1",
      timestamp: Date.now(),
      request: { query: "test", recipeId: lowScoreRecipe },
      prediction: "test",
      confidence: 0.2,
      executedRecipeNames: [lowScoreRecipe],
    });

    const recommendations = engine.recommendRecipes({ query: "test" });

    const highScoreRec = recommendations.find((r) => r.recipeId === highScoreRecipe);
    const lowScoreRec = recommendations.find((r) => r.recipeId === lowScoreRecipe);

    expect(highScoreRec?.priority).toMatch(/high|medium/);
    expect(lowScoreRec?.priority).toBe("low");
  });

  it("should provide explanation for recommendations", () => {
    const recipeId = "explained-recipe";

    for (let i = 0; i < 3; i++) {
      performanceTracker.recordPrediction({
        id: `pred-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId },
        prediction: "test",
        confidence: 0.75,
        executedRecipeNames: [recipeId],
      });
    }

    const recommendations = engine.recommendRecipes({ query: "test" });

    expect(recommendations[0].explanation).toBeDefined();
    expect(recommendations[0].explanation).toContain("recommendation score");
  });

  it("should calculate confidence adjustment based on evolution status", () => {
    const recipe1 = "keep-recipe";
    const recipe2 = "deprecate-recipe";

    // KEEP recipe (high confidence)
    for (let i = 0; i < 5; i++) {
      performanceTracker.recordPrediction({
        id: `pred-keep-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId: recipe1 },
        prediction: "test",
        confidence: 0.9,
        executedRecipeNames: [recipe1],
      });
    }

    // DEPRECATE recipe (low confidence)
    performanceTracker.recordPrediction({
      id: "pred-deprecate-1",
      timestamp: Date.now(),
      request: { query: "test", recipeId: recipe2 },
      prediction: "test",
      confidence: 0.2,
      executedRecipeNames: [recipe2],
    });

    const recommendations = engine.recommendRecipes({ query: "test" });

    const keepRec = recommendations.find((r) => r.recipeId === recipe1);
    const deprecateRec = recommendations.find((r) => r.recipeId === recipe2);

    expect(keepRec?.confidenceAdjustment).toBe(1.0);
    expect(deprecateRec?.confidenceAdjustment).toBeLessThan(1.0);
  });

  it("should rank all recipes without a specific request", () => {
    const recipe1 = "recipe-1";
    const recipe2 = "recipe-2";

    performanceTracker.recordPrediction({
      id: "pred-1",
      timestamp: Date.now(),
      request: { query: "test", recipeId: recipe1 },
      prediction: "test",
      confidence: 0.8,
      executedRecipeNames: [recipe1],
    });

    performanceTracker.recordPrediction({
      id: "pred-2",
      timestamp: Date.now(),
      request: { query: "test", recipeId: recipe2 },
      prediction: "test",
      confidence: 0.6,
      executedRecipeNames: [recipe2],
    });

    const rankings = engine.rankRecipes();

    expect(rankings.length).toBe(2);
    expect(rankings[0].score).toBeGreaterThanOrEqual(rankings[1].score);
  });

  it("should boost score for explicitly requested recipe", () => {
    const recipe1 = "recipe-1";
    const recipe2 = "recipe-2";

    for (let i = 0; i < 3; i++) {
      performanceTracker.recordPrediction({
        id: `pred-1-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId: recipe1 },
        prediction: "test",
        confidence: 0.7,
        executedRecipeNames: [recipe1],
      });

      performanceTracker.recordPrediction({
        id: `pred-2-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId: recipe2 },
        prediction: "test",
        confidence: 0.7,
        executedRecipeNames: [recipe2],
      });
    }

    const recommendations = engine.recommendRecipes({
      query: "test",
      recipeId: recipe1,
    });

    const recipe1Rec = recommendations.find((r) => r.recipeId === recipe1);
    const recipe2Rec = recommendations.find((r) => r.recipeId === recipe2);

    expect(recipe1Rec?.score).toBeGreaterThan(recipe2Rec?.score || 0);
  });

  it("should provide detailed factor breakdown", () => {
    const recipeId = "factor-recipe";

    for (let i = 0; i < 3; i++) {
      performanceTracker.recordPrediction({
        id: `pred-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId },
        prediction: "test",
        confidence: 0.75,
        executedRecipeNames: [recipeId],
      });
    }

    const recommendations = engine.recommendRecipes({ query: "test" });

    expect(recommendations[0].factors).toBeDefined();
    expect(recommendations[0].factors.historicalConfidence).toBeDefined();
    expect(recommendations[0].factors.evidenceQuality).toBeDefined();
    expect(recommendations[0].factors.performanceTrend).toBeDefined();
    expect(recommendations[0].factors.executionFrequency).toBeDefined();
    expect(recommendations[0].factors.evolutionStatus).toBeDefined();
    expect(recommendations[0].factors.requestSimilarity).toBeDefined();
  });

  it("should explain recommendation for specific recipe", () => {
    const recipeId = "explained-recipe";

    for (let i = 0; i < 3; i++) {
      performanceTracker.recordPrediction({
        id: `pred-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId },
        prediction: "test",
        confidence: 0.8,
        executedRecipeNames: [recipeId],
      });
    }

    const explanation = engine.explainRecommendation(recipeId);

    expect(explanation).toBeDefined();
    expect(explanation).toContain("recommendation score");
  });

  it("should return null explanation for non-existent recipe", () => {
    const explanation = engine.explainRecommendation("non-existent");

    expect(explanation).toContain("No data available");
  });

  it("should handle multiple recipes with different performance levels", () => {
    const recipes = [
      { id: "excellent", confidence: 0.95, count: 10 },
      { id: "good", confidence: 0.8, count: 8 },
      { id: "average", confidence: 0.6, count: 5 },
      { id: "poor", confidence: 0.3, count: 2 },
    ];

    for (const recipe of recipes) {
      for (let i = 0; i < recipe.count; i++) {
        performanceTracker.recordPrediction({
          id: `pred-${recipe.id}-${i}`,
          timestamp: Date.now(),
          request: { query: "test", recipeId: recipe.id },
          prediction: "test",
          confidence: recipe.confidence,
          executedRecipeNames: [recipe.id],
        });
      }
    }

    const recommendations = engine.recommendRecipes({ query: "test" });

    expect(recommendations.length).toBe(4);
    expect(recommendations[0].recipeId).toBe("excellent");
    expect(recommendations[recommendations.length - 1].recipeId).toBe("poor");
  });

  it("should consider evidence quality in scoring", () => {
    const recipeId = "evidence-recipe";

    // Create prediction with multiple evidence pieces
    performanceTracker.recordPrediction({
      id: "pred-1",
      timestamp: Date.now(),
      request: { query: "test", recipeId },
      prediction: "test",
      confidence: 0.7,
      executedRecipeNames: [recipeId],
    });

    const recommendations = engine.recommendRecipes({ query: "test" });

    expect(recommendations[0].factors.evidenceQuality).toBeGreaterThanOrEqual(0);
    expect(recommendations[0].factors.evidenceQuality).toBeLessThanOrEqual(100);
  });
});
