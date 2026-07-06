import { IRecommendationEngine, RecommendationOptions, RecommendationResult } from "./types";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";
import { RecipeRegistry } from "./RecipeRegistry";

/**
 * RecommendationEngine provides intelligent recipe recommendations based on:
 * - Historical performance (25% weight)
 * - Performance trend (20% weight)
 * - Execution frequency (15% weight)
 * - Evidence quality (15% weight)
 * - Evolution status (15% weight)
 * - Request similarity (10% weight)
 *
 * Implements: IRecommendationEngine (CONTRACT_FREEZE.md)
 *
 * Responsibility:
 * - Recommend recipes for a given query
 * - Score recipes based on multiple factors
 * - Sort recommendations by score
 * - Apply filtering options (limit, minScore, categories)
 *
 * Dependencies:
 * - RecipePerformanceTracker (for recipe statistics)
 * - RecipeEvolutionEngine (for evolution analysis)
 * - RecipeRegistry (for recipe metadata)
 *
 * Note: This engine is read-only. It does NOT modify recipes or statistics.
 */
export class RecommendationEngine implements IRecommendationEngine {
  private performanceTracker: RecipePerformanceTracker;
  private evolutionEngine: RecipeEvolutionEngine;
  private recipeRegistry: RecipeRegistry;

  constructor(
    performanceTracker: RecipePerformanceTracker,
    evolutionEngine: RecipeEvolutionEngine,
    recipeRegistry: RecipeRegistry,
  ) {
    this.performanceTracker = performanceTracker;
    this.evolutionEngine = evolutionEngine;
    this.recipeRegistry = recipeRegistry;
  }

  /**
   * Recommend recipes for a given query
   *
   * Implements: IRecommendationEngine.recommend() (CONTRACT_FREEZE.md)
   *
   * Algorithm:
   * 1. Get all available recipes from registry
   * 2. Score each recipe based on 6 factors
   * 3. Sort by score descending
   * 4. Apply filtering options (limit, minScore, categories)
   * 5. Return Promise<RecommendationResult[]>
   */
  public async recommend(
    query: string,
    options?: RecommendationOptions,
  ): Promise<RecommendationResult[]> {
    // Get all available recipes
    const allRecipes = this.recipeRegistry.getAllRecipes();

    // Score each recipe
    const recommendations: RecommendationResult[] = [];
    for (const recipe of allRecipes) {
      const score = this.calculateRecipeScore(recipe.id, query);
      const reason = this.generateReason(recipe.id, score);

      recommendations.push({
        recipeId: recipe.id,
        score: score, // Already normalized to 0-1
        reason,
        metadata: {
          recipeName: recipe.name,
          category: recipe.category,
        },
      });
    }

    // Sort by score descending
    recommendations.sort((a, b) => b.score - a.score);

    // Apply filtering options
    let filtered = recommendations;

    if (typeof options?.limit === "number" && options.limit >= 0) {
      filtered = filtered.slice(0, options.limit);
    }

    if (options?.minScore && options.minScore >= 0 && options.minScore <= 1) {
      filtered = filtered.filter((r) => r.score >= options.minScore!);
    }

    if (options?.categories && Array.isArray(options.categories) && options.categories.length > 0) {
      filtered = filtered.filter((r) => {
        const category = r.metadata?.category as string | undefined;
        return category && options.categories!.includes(category);
      });
    }

    return filtered;
  }

  /**
   * Calculate recommendation score for a recipe (0-1 normalized)
   *
   * Algorithm (from ALGORITHM_SPECIFICATION_V1.md):
   * score = (
   *   (historicalConfidence × 0.25) +
   *   (evidenceQuality × 0.15) +
   *   (performanceTrend × 0.20) +
   *   (executionFrequency × 0.15) +
   *   (evolutionStatus × 0.15) +
   *   (requestSimilarity × 0.10)
   * ) / 100
   */
  private calculateRecipeScore(recipeId: string, query: string): number {
    // Get recipe statistics
    const stats = this.performanceTracker.getRecipeStats(recipeId);
    if (!stats) {
      return 0; // No data available
    }

    // Get evolution analysis
    const analysis = this.evolutionEngine.analyzeRecipe(recipeId);
    if (!analysis) {
      return 0; // No analysis available
    }

    // Calculate individual factor scores (0-100)
    const historicalConfidence = stats.averageConfidence * 100;
    const evidenceQuality = this.calculateEvidenceQuality(stats.averageEvidenceCount);
    const performanceTrend = this.calculatePerformanceTrendScore(analysis.performanceTrend);
    const executionFrequency = this.calculateExecutionFrequencyScore(stats.executionCount);
    const evolutionStatus = this.calculateEvolutionStatusScore(analysis.recommendation);
    const requestSimilarity = this.calculateRequestSimilarity(recipeId, query);

    // Apply weights and calculate weighted score
    const weights = {
      historicalConfidence: 0.25,
      evidenceQuality: 0.15,
      performanceTrend: 0.2,
      executionFrequency: 0.15,
      evolutionStatus: 0.15,
      requestSimilarity: 0.1,
    };

    const weightedScore =
      historicalConfidence * weights.historicalConfidence +
      evidenceQuality * weights.evidenceQuality +
      performanceTrend * weights.performanceTrend +
      executionFrequency * weights.executionFrequency +
      evolutionStatus * weights.evolutionStatus +
      requestSimilarity * weights.requestSimilarity;

    // Normalize to 0-1 range
    return Math.min(weightedScore / 100, 1.0);
  }

  /**
   * Calculate evidence quality score (0-100)
   *
   * Algorithm:
   * - 0 evidence → 0 score
   * - 1 evidence → 33 score
   * - 2 evidence → 67 score
   * - 3+ evidence → 100 score
   */
  private calculateEvidenceQuality(averageEvidenceCount: number): number {
    if (averageEvidenceCount <= 0) return 0;
    if (averageEvidenceCount >= 3) return 100;
    return (averageEvidenceCount / 3) * 100;
  }

  /**
   * Calculate performance trend score (0-100)
   *
   * Algorithm:
   * - improving → 100
   * - stable → 70
   * - declining → 30
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
   * Calculate execution frequency score (0-100)
   *
   * Algorithm:
   * - 0 executions → 0 score
   * - 1 execution → 10 score
   * - 5 executions → 50 score
   * - 10+ executions → 100 score
   */
  private calculateExecutionFrequencyScore(executionCount: number): number {
    if (executionCount <= 0) return 0;
    if (executionCount >= 10) return 100;
    return Math.min((executionCount / 10) * 100, 100);
  }

  /**
   * Calculate evolution status score (0-100)
   *
   * Algorithm:
   * - KEEP → 100
   * - EXPERIMENT → 75
   * - IMPROVE → 50
   * - DEPRECATE → 10
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
   * Calculate request similarity score (0-100)
   *
   * v1 Algorithm (simple):
   * - Exact recipe match → 100
   * - No recipe specified → 50 (neutral)
   * - Different recipe → 50 (neutral)
   *
   * Note: v1.5+ can implement semantic similarity using embeddings
   */
  private calculateRequestSimilarity(recipeId: string, query: string): number {
    // v1: Simple implementation
    // In future versions, can use semantic similarity or ML embeddings
    // For now, return neutral score (all recipes equally relevant)
    return 50;
  }

  /**
   * Generate human-readable reason for recommendation
   */
  private generateReason(recipeId: string, score: number): string {
    const stats = this.performanceTracker.getRecipeStats(recipeId);
    const analysis = this.evolutionEngine.analyzeRecipe(recipeId);

    if (!stats || !analysis) {
      return "Recipe has limited data available.";
    }

    const scorePercent = Math.round(score * 100);
    const parts: string[] = [];

    parts.push(`Recommendation score: ${scorePercent}/100.`);

    // Add top factors
    const factors = [
      { name: "historical accuracy", value: stats.averageConfidence * 100 },
      { name: "performance trend", value: this.calculatePerformanceTrendScore(analysis.performanceTrend) },
      { name: "execution frequency", value: this.calculateExecutionFrequencyScore(stats.executionCount) },
    ].sort((a, b) => b.value - a.value);

    const topFactors = factors.slice(0, 2).map((f) => f.name);
    parts.push(`Strong factors: ${topFactors.join(" and ")}.`);

    // Add evolution status insight
    switch (analysis.recommendation) {
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
