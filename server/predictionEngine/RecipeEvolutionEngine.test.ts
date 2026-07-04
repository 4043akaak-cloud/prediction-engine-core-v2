import { describe, it, expect, beforeEach } from "vitest";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { PredictionHistoryAnalytics } from "./PredictionHistoryAnalytics";
import { PredictionHistoryRepository } from "./PredictionHistoryRepository";

describe("RecipeEvolutionEngine", () => {
  let engine: RecipeEvolutionEngine;
  let performanceTracker: RecipePerformanceTracker;
  let analytics: PredictionHistoryAnalytics;
  let historyRepository: PredictionHistoryRepository;

  beforeEach(() => {
    performanceTracker = new RecipePerformanceTracker();
    historyRepository = PredictionHistoryRepository.getInstance();
    analytics = new PredictionHistoryAnalytics(historyRepository);
    engine = new RecipeEvolutionEngine(performanceTracker, analytics, historyRepository);
  });

  it("should return null for non-existent recipe", () => {
    const analysis = engine.analyzeRecipe("non-existent-recipe");
    expect(analysis).toBeNull();
  });

  it("should analyze a recipe with low execution count and low confidence", () => {
    const recipeId = "low-perf-recipe";
    performanceTracker.recordPrediction({
      id: "pred-1",
      timestamp: Date.now(),
      request: { query: "test", recipeId },
      prediction: "test",
      confidence: 0.3,
      executedRecipeNames: [recipeId],
    });

    const analysis = engine.analyzeRecipe(recipeId);

    expect(analysis).toBeDefined();
    expect(analysis?.recommendation).toBe("DEPRECATE");
    expect(analysis?.reasoning).toContain("underperforming");
  });

  it("should recommend KEEP for high-performing recipe", () => {
    const recipeId = "high-perf-recipe";

    for (let i = 0; i < 5; i++) {
      performanceTracker.recordPrediction({
        id: `pred-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId },
        prediction: "test",
        confidence: 0.85,
        executedRecipeNames: [recipeId],
      });
    }

    const analysis = engine.analyzeRecipe(recipeId);

    expect(analysis).toBeDefined();
    expect(analysis?.recommendation).toBe("KEEP");
    expect(analysis?.reasoning).toContain("performing well");
  });

  it("should recommend EXPERIMENT for new recipe with good confidence", () => {
    const recipeId = "new-recipe";

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

    const analysis = engine.analyzeRecipe(recipeId);

    expect(analysis).toBeDefined();
    expect(analysis?.recommendation).toBe("EXPERIMENT");
    expect(analysis?.reasoning).toContain("shows promise");
  });

  it("should recommend IMPROVE for moderate-performing recipe", () => {
    const recipeId = "moderate-recipe";

    for (let i = 0; i < 5; i++) {
      performanceTracker.recordPrediction({
        id: `pred-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId },
        prediction: "test",
        confidence: 0.6,
        executedRecipeNames: [recipeId],
      });
    }

    const analysis = engine.analyzeRecipe(recipeId);

    expect(analysis).toBeDefined();
    expect(analysis?.recommendation).toBe("IMPROVE");
    expect(analysis?.reasoning).toContain("potential");
  });

  it("should analyze all recipes", () => {
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
      confidence: 0.4,
      executedRecipeNames: [recipe2],
    });

    const analyses = engine.analyzeAllRecipes();

    expect(analyses.length).toBe(2);
    expect(analyses.some((a) => a.recipeId === recipe1)).toBe(true);
    expect(analyses.some((a) => a.recipeId === recipe2)).toBe(true);
  });

  it("should generate improvement suggestions for recipes needing improvement", () => {
    const recipeId = "needs-improvement";

    for (let i = 0; i < 5; i++) {
      performanceTracker.recordPrediction({
        id: `pred-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId },
        prediction: "test",
        confidence: 0.55,
        executedRecipeNames: [recipeId],
      });
    }

    const suggestions = engine.getImprovementSuggestions();

    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].recipeId).toBe(recipeId);
    expect(suggestions[0].suggestion).toBeDefined();
    expect(suggestions[0].priority).toBeDefined();
    expect(suggestions[0].expectedImpact).toBeDefined();
  });

  it("should not generate suggestions for well-performing recipes", () => {
    const recipeId = "well-performing";

    for (let i = 0; i < 5; i++) {
      performanceTracker.recordPrediction({
        id: `pred-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId },
        prediction: "test",
        confidence: 0.9,
        executedRecipeNames: [recipeId],
      });
    }

    const suggestions = engine.getImprovementSuggestions();

    expect(suggestions.length).toBe(0);
  });

  it("should track performance trend - stable when few executions", () => {
    const recipeId = "trend-recipe";

    performanceTracker.recordPrediction({
      id: "pred-1",
      timestamp: Date.now(),
      request: { query: "test", recipeId },
      prediction: "test",
      confidence: 0.5,
      executedRecipeNames: [recipeId],
    });

    const analysis = engine.analyzeRecipe(recipeId);

    expect(analysis).toBeDefined();
    expect(analysis?.performanceTrend).toBe("stable");
  });

  it("should provide detailed reasoning for recommendations", () => {
    const recipeId = "reasoning-test";

    performanceTracker.recordPrediction({
      id: "pred-1",
      timestamp: Date.now(),
      request: { query: "test", recipeId },
      prediction: "test",
      confidence: 0.75,
      executedRecipeNames: [recipeId],
    });

    const analysis = engine.analyzeRecipe(recipeId);

    expect(analysis?.reasoning).toBeDefined();
    expect(analysis?.reasoning).toContain("Executed");
    expect(analysis?.reasoning).toContain("confidence");
    expect(analysis?.reasoning).toContain("trend");
  });

  it("should handle recipes with no recent usage", () => {
    const recipeId = "old-recipe";

    performanceTracker.recordPrediction({
      id: "pred-1",
      timestamp: Date.now() - 100000,
      request: { query: "test", recipeId },
      prediction: "test",
      confidence: 0.5,
      executedRecipeNames: [recipeId],
    });

    const analysis = engine.analyzeRecipe(recipeId);

    expect(analysis).toBeDefined();
    expect(analysis?.recentUsage).toBe(0);
    expect(analysis?.reasoning).toContain("Not used recently");
  });

  it("should prioritize improvement suggestions based on confidence", () => {
    const lowConfidenceRecipe = "very-low-confidence";
    const moderateConfidenceRecipe = "moderate-confidence";

    // Create multiple predictions for each recipe to ensure IMPROVE recommendation
    for (let i = 0; i < 3; i++) {
      performanceTracker.recordPrediction({
        id: `pred-low-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId: lowConfidenceRecipe },
        prediction: "test",
        confidence: 0.3,
        executedRecipeNames: [lowConfidenceRecipe],
      });
    }

    for (let i = 0; i < 3; i++) {
      performanceTracker.recordPrediction({
        id: `pred-mod-${i}`,
        timestamp: Date.now(),
        request: { query: "test", recipeId: moderateConfidenceRecipe },
        prediction: "test",
        confidence: 0.6,
        executedRecipeNames: [moderateConfidenceRecipe],
      });
    }

    const suggestions = engine.getImprovementSuggestions();

    const lowConfSuggestion = suggestions.find((s) => s.recipeId === lowConfidenceRecipe);
    const modConfSuggestion = suggestions.find((s) => s.recipeId === moderateConfidenceRecipe);

    expect(lowConfSuggestion).toBeDefined();
    expect(modConfSuggestion).toBeDefined();
    expect(lowConfSuggestion?.priority).toBe("high");
    expect(modConfSuggestion?.priority).toBe("medium");
  });

  it("should generate distinct recommendations for different recipe types", () => {
    const recipes = [
      { id: "keep-recipe", confidence: 0.85, count: 5 },
      { id: "improve-recipe", confidence: 0.6, count: 5 },
      { id: "deprecate-recipe", confidence: 0.3, count: 1 },
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

    const analyses = engine.analyzeAllRecipes();

    const keepAnalysis = analyses.find((a) => a.recipeId === "keep-recipe");
    const improveAnalysis = analyses.find((a) => a.recipeId === "improve-recipe");
    const deprecateAnalysis = analyses.find((a) => a.recipeId === "deprecate-recipe");

    expect(keepAnalysis?.recommendation).toBe("KEEP");
    expect(improveAnalysis?.recommendation).toBe("IMPROVE");
    expect(deprecateAnalysis?.recommendation).toBe("DEPRECATE");
  });
});
