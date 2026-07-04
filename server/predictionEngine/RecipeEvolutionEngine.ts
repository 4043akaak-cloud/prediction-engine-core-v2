import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { PredictionHistoryAnalytics } from "./PredictionHistoryAnalytics";
import { PredictionHistoryRepository } from "./PredictionHistoryRepository";

export type RecommendationType = "KEEP" | "IMPROVE" | "DEPRECATE" | "EXPERIMENT";

export interface RecipeAnalysis {
  recipeId: string;
  executionCount: number;
  averageConfidence: number;
  averageEvidenceCount: number;
  recentUsage: number;
  performanceTrend: "improving" | "stable" | "declining";
  recommendation: RecommendationType;
  reasoning: string;
}

export interface ImprovementSuggestion {
  recipeId: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
  expectedImpact: string;
}

export class RecipeEvolutionEngine {
  private performanceTracker: RecipePerformanceTracker;
  private analytics: PredictionHistoryAnalytics;
  private historyRepository: PredictionHistoryRepository;

  constructor(
    performanceTracker: RecipePerformanceTracker,
    analytics: PredictionHistoryAnalytics,
    historyRepository: PredictionHistoryRepository
  ) {
    this.performanceTracker = performanceTracker;
    this.analytics = analytics;
    this.historyRepository = historyRepository;
  }

  /**
   * Analyze a single recipe and generate recommendations.
   */
  public analyzeRecipe(recipeId: string): RecipeAnalysis | null {
    const stats = this.performanceTracker.getRecipeStats(recipeId);
    if (!stats) {
      return null;
    }

    const recentUsage = this.calculateRecentUsage(recipeId);
    const performanceTrend = this.calculatePerformanceTrend(recipeId);
    const recommendation = this.generateRecommendation(stats, recentUsage, performanceTrend);
    const reasoning = this.generateReasoning(stats, recentUsage, performanceTrend, recommendation);

    return {
      recipeId,
      executionCount: stats.executionCount,
      averageConfidence: stats.averageConfidence,
      averageEvidenceCount: stats.averageEvidenceCount,
      recentUsage,
      performanceTrend,
      recommendation,
      reasoning,
    };
  }

  /**
   * Analyze all recipes and generate recommendations.
   */
  public analyzeAllRecipes(): RecipeAnalysis[] {
    const allStats = this.performanceTracker.getAllRecipeStats();
    const analyses: RecipeAnalysis[] = [];

    for (const stat of allStats) {
      const analysis = this.analyzeRecipe(stat.recipeId);
      if (analysis) {
        analyses.push(analysis);
      }
    }

    return analyses;
  }

  /**
   * Get improvement suggestions for recipes that need improvement.
   */
  public getImprovementSuggestions(): ImprovementSuggestion[] {
    const analyses = this.analyzeAllRecipes();
    const suggestions: ImprovementSuggestion[] = [];

    for (const analysis of analyses) {
      if (analysis.recommendation === "IMPROVE") {
        const suggestion = this.generateImprovementSuggestion(analysis);
        suggestions.push(suggestion);
      }
    }

    return suggestions;
  }

  /**
   * Calculate recent usage (number of predictions in last N records).
   */
  private calculateRecentUsage(recipeId: string): number {
    const recentPredictions = this.analytics.getRecentPredictions(10);
    return recentPredictions.filter((p) => p.executedRecipeNames.includes(recipeId)).length;
  }

  /**
   * Calculate performance trend by comparing recent vs overall average confidence.
   */
  private calculatePerformanceTrend(recipeId: string): "improving" | "stable" | "declining" {
    const stats = this.performanceTracker.getRecipeStats(recipeId);
    if (!stats || stats.executionCount < 3) {
      return "stable";
    }

    const recentPredictions = this.analytics.getRecentPredictions(5);
    const recentForRecipe = recentPredictions.filter((p) => p.executedRecipeNames.includes(recipeId));

    if (recentForRecipe.length === 0) {
      return "stable";
    }

    const recentAverage = recentForRecipe.reduce((sum, p) => sum + p.confidence, 0) / recentForRecipe.length;
    const overallAverage = stats.averageConfidence;

    const difference = recentAverage - overallAverage;

    if (difference > 0.05) {
      return "improving";
    } else if (difference < -0.05) {
      return "declining";
    } else {
      return "stable";
    }
  }

  /**
   * Generate a recommendation based on recipe statistics.
   */
  private generateRecommendation(
    stats: any,
    recentUsage: number,
    performanceTrend: "improving" | "stable" | "declining"
  ): RecommendationType {
    // DEPRECATE: Low execution count and low confidence
    if (stats.executionCount < 3 && stats.averageConfidence < 0.5) {
      return "DEPRECATE";
    }

    // DEPRECATE: Declining trend with low usage
    if (performanceTrend === "declining" && recentUsage === 0) {
      return "DEPRECATE";
    }

    // EXPERIMENT: Very few executions but decent confidence
    if (stats.executionCount < 5 && stats.averageConfidence >= 0.7) {
      return "EXPERIMENT";
    }

    // IMPROVE: Moderate confidence with declining trend
    if (stats.averageConfidence >= 0.5 && stats.averageConfidence < 0.75 && performanceTrend === "declining") {
      return "IMPROVE";
    }

    // IMPROVE: Low confidence with stable or improving trend
    if (stats.averageConfidence < 0.65 && performanceTrend !== "declining") {
      return "IMPROVE";
    }

    // KEEP: High confidence and stable/improving trend
    if (stats.averageConfidence >= 0.75 && performanceTrend !== "declining") {
      return "KEEP";
    }

    // Default to KEEP
    return "KEEP";
  }

  /**
   * Generate reasoning for the recommendation.
   */
  private generateReasoning(
    stats: any,
    recentUsage: number,
    performanceTrend: "improving" | "stable" | "declining",
    recommendation: RecommendationType
  ): string {
    const parts: string[] = [];

    parts.push(`Executed ${stats.executionCount} times with average confidence ${(stats.averageConfidence * 100).toFixed(1)}%.`);

    if (recentUsage > 0) {
      parts.push(`Recently used ${recentUsage} times in the last 10 predictions.`);
    } else {
      parts.push("Not used recently.");
    }

    parts.push(`Performance trend is ${performanceTrend}.`);

    switch (recommendation) {
      case "KEEP":
        parts.push("This recipe is performing well and should be kept.");
        break;
      case "IMPROVE":
        parts.push("This recipe has potential but needs improvement.");
        break;
      case "DEPRECATE":
        parts.push("This recipe is underperforming and should be deprecated.");
        break;
      case "EXPERIMENT":
        parts.push("This recipe shows promise and should be experimented with further.");
        break;
    }

    return parts.join(" ");
  }

  /**
   * Generate specific improvement suggestions.
   */
  private generateImprovementSuggestion(analysis: RecipeAnalysis): ImprovementSuggestion {
    let suggestion = "";
    let priority: "high" | "medium" | "low" = "medium";
    let expectedImpact = "";

    if (analysis.averageConfidence < 0.5) {
      suggestion = "Review recipe logic and evidence collection strategy. Confidence is below 50%.";
      priority = "high";
      expectedImpact = "Increase confidence by 15-25%";
    } else if (analysis.averageConfidence < 0.65) {
      suggestion = "Refine evidence weighting and confidence calculation. Current confidence is moderate.";
      priority = "medium";
      expectedImpact = "Increase confidence by 10-15%";
    } else if (analysis.performanceTrend === "declining") {
      suggestion = "Investigate recent decline in performance. Check for data quality or logic issues.";
      priority = "high";
      expectedImpact = "Stabilize or reverse declining trend";
    } else if (analysis.averageEvidenceCount < 3) {
      suggestion = "Increase evidence collection. More evidence sources could improve confidence.";
      priority = "low";
      expectedImpact = "Increase confidence by 5-10%";
    } else {
      suggestion = "Continue monitoring performance. Consider A/B testing variations.";
      priority = "low";
      expectedImpact = "Maintain or improve current performance";
    }

    return {
      recipeId: analysis.recipeId,
      suggestion,
      priority,
      expectedImpact,
    };
  }
}
