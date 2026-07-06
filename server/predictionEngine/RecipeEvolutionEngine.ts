import { RecipePerformanceTracker, RecipeStats } from "./RecipePerformanceTracker";

/**
 * Evolution status recommendation for a recipe
 */
export type EvolutionRecommendation = "KEEP" | "IMPROVE" | "DEPRECATE" | "EXPERIMENT";

/**
 * Performance trend direction
 */
export type PerformanceTrend = "improving" | "stable" | "declining";

/**
 * Analysis result for a single recipe
 */
export interface RecipeAnalysis {
  recipeId: string;
  executionCount: number;
  averageConfidence: number;
  performanceTrend: PerformanceTrend;
  recommendation: EvolutionRecommendation;
  reasoning: string;
}

/**
 * RecipeEvolutionEngine analyzes recipe performance and provides evolution recommendations.
 *
 * Responsibility:
 * - Analyze recipe performance trends
 * - Generate evolution recommendations (KEEP, IMPROVE, DEPRECATE, EXPERIMENT)
 * - Provide reasoning for recommendations
 *
 * Dependencies:
 * - RecipePerformanceTracker (for performance statistics)
 *
 * Note: This engine is used by RecommendationEngine to score recipes.
 * It does NOT modify recipes or the registry.
 */
export class RecipeEvolutionEngine {
  constructor(private performanceTracker: RecipePerformanceTracker) {}

  /**
   * Analyze a single recipe and generate evolution recommendation
   */
  public analyzeRecipe(recipeId: string): RecipeAnalysis | null {
    const stats = this.performanceTracker.getRecipeStats(recipeId);
    if (!stats) {
      return null;
    }

    const performanceTrend = this.calculatePerformanceTrend(stats);
    const recommendation = this.generateRecommendation(stats, performanceTrend);
    const reasoning = this.generateReasoning(stats, performanceTrend, recommendation);

    return {
      recipeId,
      executionCount: stats.executionCount,
      averageConfidence: stats.averageConfidence,
      performanceTrend,
      recommendation,
      reasoning,
    };
  }

  /**
   * Analyze all recipes and generate recommendations
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
   * Calculate performance trend based on recipe statistics
   *
   * Algorithm:
   * - If execution count < 2: insufficient data
   * - If average confidence >= 0.75: improving or stable
   * - If average confidence < 0.5: declining
   * - Otherwise: stable
   */
  private calculatePerformanceTrend(stats: RecipeStats): PerformanceTrend {
    // With limited data, we can only infer trend from current confidence
    // In future versions, we can track historical confidence over time windows
    if (stats.executionCount < 2) {
      return "stable"; // Insufficient data
    }

    // For v1, use confidence as proxy for trend
    // v1.5+ can implement sliding window analysis
    if (stats.averageConfidence >= 0.75) {
      return "improving";
    } else if (stats.averageConfidence < 0.5) {
      return "declining";
    } else {
      return "stable";
    }
  }

  /**
   * Generate evolution recommendation based on statistics and trend
   *
   * State Machine with three sequential stages:
   * 1. FATAL CHECK: conf < 0.30 → DEPRECATE (critical failures first)
   * 2. MATURITY CHECK: exec < 3 → EXPERIMENT (protect new recipes)
   * 3. PERFORMANCE CHECK: evaluate established recipes
   *
   * See ALGORITHM_SPECIFICATION_V1.md for detailed specification
   */
  private generateRecommendation(
    stats: RecipeStats,
    trend: PerformanceTrend,
  ): EvolutionRecommendation {
    // ========================================
    // STAGE 1: FATAL CHECK
    // ========================================
    // Critical failures must be caught first, regardless of maturity
    if (stats.averageConfidence < 0.3) {
      return "DEPRECATE";
    }

    // ========================================
    // STAGE 2: MATURITY CHECK
    // ========================================
    // New recipes (< 3 executions) are always experimental
    if (stats.executionCount < 3) {
      return "EXPERIMENT";
    }

    // ========================================
    // STAGE 3: PERFORMANCE CHECK
    // ========================================
    // Established recipes (>= 3 executions) are evaluated by performance

    // High performers: KEEP
    if (stats.averageConfidence >= 0.75 && stats.executionCount >= 5) {
      return "KEEP";
    }

    // Moderate performers: IMPROVE
    if (stats.averageConfidence >= 0.5 && stats.executionCount >= 3) {
      return "IMPROVE";
    }

    // Declining performers: IMPROVE (with caution)
    if (trend === "declining" && stats.averageConfidence < 0.5) {
      return "IMPROVE";
    }

    // Default: EXPERIMENT for all other established recipes
    return "EXPERIMENT";
  }

  /**
   * Generate human-readable reasoning for the recommendation
   */
  private generateReasoning(
    stats: RecipeStats,
    trend: PerformanceTrend,
    recommendation: EvolutionRecommendation,
  ): string {
    const parts: string[] = [];

    // Add execution count insight
    if (stats.executionCount === 0) {
      parts.push("This recipe has never been executed.");
    } else if (stats.executionCount < 3) {
      parts.push(`This recipe has been executed ${stats.executionCount} time(s) (limited data).`);
    } else {
      parts.push(`This recipe has been executed ${stats.executionCount} times.`);
    }

    // Add confidence insight
    const confidencePercent = Math.round(stats.averageConfidence * 100);
    parts.push(`Average confidence: ${confidencePercent}%.`);

    // Add trend insight
    switch (trend) {
      case "improving":
        parts.push("Performance is improving.");
        break;
      case "stable":
        parts.push("Performance is stable.");
        break;
      case "declining":
        parts.push("Performance is declining.");
        break;
    }

    // Add recommendation insight
    switch (recommendation) {
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
