import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { PredictionHistoryAnalytics } from "./PredictionHistoryAnalytics";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";

export interface PredictionRequest {
  query: string;
  recipeId?: string;
  context?: Record<string, unknown>;
}

export interface RecipeRecommendation {
  recipeId: string;
  score: number; // 0-100
  priority: "high" | "medium" | "low";
  explanation: string;
  confidenceAdjustment: number;
  factors: {
    historicalConfidence: number;
    evidenceQuality: number;
    performanceTrend: number;
    executionFrequency: number;
    evolutionStatus: number;
    requestSimilarity: number;
  };
}

export class RecipeRecommendationEngine {
  private performanceTracker: RecipePerformanceTracker;
  private analytics: PredictionHistoryAnalytics;
  private evolutionEngine: RecipeEvolutionEngine;

  constructor(
    performanceTracker: RecipePerformanceTracker,
    analytics: PredictionHistoryAnalytics,
    evolutionEngine: RecipeEvolutionEngine
  ) {
    this.performanceTracker = performanceTracker;
    this.analytics = analytics;
    this.evolutionEngine = evolutionEngine;
  }

  /**
   * Recommend recipes for a given prediction request.
   */
  public recommendRecipes(request: PredictionRequest): RecipeRecommendation[] {
    const allStats = this.performanceTracker.getAllRecipeStats();
    const recommendations: RecipeRecommendation[] = [];

    for (const stat of allStats) {
      const recommendation = this.scoreRecipe(stat.recipeId, request);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    // Sort by score descending
    recommendations.sort((a, b) => b.score - a.score);

    return recommendations;
  }

  /**
   * Rank all recipes by recommendation score.
   */
  public rankRecipes(): RecipeRecommendation[] {
    const defaultRequest: PredictionRequest = {
      query: "",
      context: {},
    };

    return this.recommendRecipes(defaultRequest);
  }

  /**
   * Explain the recommendation for a specific recipe.
   */
  public explainRecommendation(recipeId: string, request?: PredictionRequest): string {
    const req = request || { query: "", context: {} };
    const recommendation = this.scoreRecipe(recipeId, req);

    if (!recommendation) {
      return `No data available for recipe ${recipeId}`;
    }

    return recommendation.explanation;
  }

  /**
   * Score a single recipe based on multiple factors.
   */
  private scoreRecipe(recipeId: string, request: PredictionRequest): RecipeRecommendation | null {
    const stats = this.performanceTracker.getRecipeStats(recipeId);
    if (!stats) {
      return null;
    }

    const analysis = this.evolutionEngine.analyzeRecipe(recipeId);
    if (!analysis) {
      return null;
    }

    // Calculate individual factor scores (0-100)
    const historicalConfidence = stats.averageConfidence * 100;
    const evidenceQuality = this.calculateEvidenceQuality(stats.averageEvidenceCount);
    const performanceTrend = this.calculatePerformanceTrendScore(analysis.performanceTrend);
    const executionFrequency = this.calculateExecutionFrequencyScore(stats.executionCount);
    const evolutionStatus = this.calculateEvolutionStatusScore(analysis.recommendation);
    const requestSimilarity = this.calculateRequestSimilarity(recipeId, request);

    // Calculate weighted score
    const weights = {
      historicalConfidence: 0.25,
      evidenceQuality: 0.15,
      performanceTrend: 0.2,
      executionFrequency: 0.15,
      evolutionStatus: 0.15,
      requestSimilarity: 0.1,
    };

    const score =
      historicalConfidence * weights.historicalConfidence +
      evidenceQuality * weights.evidenceQuality +
      performanceTrend * weights.performanceTrend +
      executionFrequency * weights.executionFrequency +
      evolutionStatus * weights.evolutionStatus +
      requestSimilarity * weights.requestSimilarity;

    const priority = this.calculatePriority(score, analysis.recommendation);
    const confidenceAdjustment = this.calculateConfidenceAdjustment(analysis.recommendation);
    const explanation = this.generateExplanation(
      recipeId,
      score,
      analysis.recommendation,
      {
        historicalConfidence,
        evidenceQuality,
        performanceTrend,
        executionFrequency,
        evolutionStatus,
        requestSimilarity,
      }
    );

    return {
      recipeId,
      score: Math.round(score),
      priority,
      explanation,
      confidenceAdjustment,
      factors: {
        historicalConfidence,
        evidenceQuality,
        performanceTrend,
        executionFrequency,
        evolutionStatus,
        requestSimilarity,
      },
    };
  }

  /**
   * Calculate evidence quality score based on average evidence count.
   */
  private calculateEvidenceQuality(averageEvidenceCount: number): number {
    // More evidence = higher quality, but with diminishing returns
    // 0 evidence = 0, 1 evidence = 25, 2 evidence = 50, 3+ evidence = 100
    if (averageEvidenceCount <= 0) return 0;
    if (averageEvidenceCount >= 3) return 100;
    return (averageEvidenceCount / 3) * 100;
  }

  /**
   * Calculate performance trend score.
   */
  private calculatePerformanceTrendScore(trend: "improving" | "stable" | "declining"): number {
    switch (trend) {
      case "improving":
        return 100;
      case "stable":
        return 70;
      case "declining":
        return 30;
    }
  }

  /**
   * Calculate execution frequency score.
   */
  private calculateExecutionFrequencyScore(executionCount: number): number {
    // More executions = higher confidence in the recipe
    // 0 = 0, 1 = 20, 5 = 60, 10+ = 100
    if (executionCount <= 0) return 0;
    if (executionCount >= 10) return 100;
    return Math.min((executionCount / 10) * 100, 100);
  }

  /**
   * Calculate evolution status score.
   */
  private calculateEvolutionStatusScore(recommendation: string): number {
    switch (recommendation) {
      case "KEEP":
        return 100;
      case "EXPERIMENT":
        return 75;
      case "IMPROVE":
        return 50;
      case "DEPRECATE":
        return 10;
      default:
        return 50;
    }
  }

  /**
   * Calculate request similarity score.
   * This is a simplified implementation that could be enhanced with semantic similarity.
   */
  private calculateRequestSimilarity(recipeId: string, request: PredictionRequest): number {
    // If a specific recipe is requested, boost its score
    if (request.recipeId === recipeId) {
      return 100;
    }

    // If no specific recipe is requested, all recipes have equal similarity
    if (!request.recipeId) {
      return 50;
    }

    return 50;
  }

  /**
   * Calculate priority based on score and evolution status.
   */
  private calculatePriority(score: number, evolutionStatus: string): "high" | "medium" | "low" {
    if (score >= 75 && evolutionStatus !== "DEPRECATE") {
      return "high";
    }
    if (score >= 50 && evolutionStatus !== "DEPRECATE") {
      return "medium";
    }
    return "low";
  }

  /**
   * Calculate confidence adjustment based on evolution status.
   */
  private calculateConfidenceAdjustment(evolutionStatus: string): number {
    switch (evolutionStatus) {
      case "KEEP":
        return 1.0; // No adjustment
      case "EXPERIMENT":
        return 0.85; // Slight reduction for experimental recipes
      case "IMPROVE":
        return 0.7; // Moderate reduction for recipes needing improvement
      case "DEPRECATE":
        return 0.3; // Significant reduction for deprecated recipes
      default:
        return 1.0;
    }
  }

  /**
   * Generate explanation for the recommendation.
   */
  private generateExplanation(
    recipeId: string,
    score: number,
    evolutionStatus: string,
    factors: {
      historicalConfidence: number;
      evidenceQuality: number;
      performanceTrend: number;
      executionFrequency: number;
      evolutionStatus: number;
      requestSimilarity: number;
    }
  ): string {
    const parts: string[] = [];

    parts.push(`Recipe ${recipeId} has a recommendation score of ${Math.round(score)}/100.`);

    // Highlight strongest factors
    const factorEntries = Object.entries(factors)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const topFactors = factorEntries.slice(0, 2);
    const topFactorNames = topFactors.map((f) => f.name.replace(/([A-Z])/g, " $1").toLowerCase()).join(" and ");

    parts.push(`Strong factors: ${topFactorNames}.`);

    // Add evolution status insight
    switch (evolutionStatus) {
      case "KEEP":
        parts.push("This recipe is performing well and should be prioritized.");
        break;
      case "EXPERIMENT":
        parts.push("This recipe shows promise and is worth experimenting with.");
        break;
      case "IMPROVE":
        parts.push("This recipe has potential but needs improvement before prioritizing.");
        break;
      case "DEPRECATE":
        parts.push("This recipe is underperforming and should be avoided.");
        break;
    }

    return parts.join(" ");
  }
}
