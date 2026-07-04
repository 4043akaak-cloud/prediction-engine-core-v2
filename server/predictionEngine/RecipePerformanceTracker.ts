import { PredictionHistoryRecord } from "./PredictionHistoryRepository";

/**
 * Statistics for a single recipe's performance.
 */
export interface RecipeStats {
  recipeId: string;
  recipeName: string;
  executionCount: number;
  averageConfidence: number;
  averageEvidenceCount: number;
  lastExecutionTime: number;
}

/**
 * Tracks performance metrics for recipes over time.
 * Automatically updates statistics as predictions are recorded.
 */
export class RecipePerformanceTracker {
  private stats: Map<string, {
    recipeId: string;
    recipeName: string;
    executionCount: number;
    totalConfidence: number;
    totalEvidenceCount: number;
    lastExecutionTime: number;
  }> = new Map();

  /**
   * Update statistics when a prediction is recorded.
   * Called automatically after each prediction execution.
   */
  recordPrediction(record: PredictionHistoryRecord): void {
    // Extract recipe information from the record
    const recipeNames = record.executedRecipeNames;
    
    for (const recipeName of recipeNames) {
      const recipeId = record.request.recipeId;
      const key = `${recipeId}:${recipeName}`;
      
      const existing = this.stats.get(key);
      if (existing) {
        existing.executionCount += 1;
        existing.totalConfidence += record.confidence;
        existing.lastExecutionTime = record.timestamp;
        // Note: evidenceCount is not available in PredictionHistoryRecord
        // We'll track it as 0 for now
      } else {
        this.stats.set(key, {
          recipeId,
          recipeName,
          executionCount: 1,
          totalConfidence: record.confidence,
          totalEvidenceCount: 0,
          lastExecutionTime: record.timestamp,
        });
      }
    }
  }

  /**
   * Get performance statistics for a specific recipe.
   */
  getRecipeStats(recipeId: string): RecipeStats | null {
    // Find the first matching recipe by ID
    for (const [, stats] of Array.from(this.stats.entries())) {
      if (stats.recipeId === recipeId) {
        return {
          recipeId: stats.recipeId,
          recipeName: stats.recipeName,
          executionCount: stats.executionCount,
          averageConfidence: stats.executionCount > 0 
            ? stats.totalConfidence / stats.executionCount 
            : 0,
          averageEvidenceCount: stats.executionCount > 0
            ? stats.totalEvidenceCount / stats.executionCount
            : 0,
          lastExecutionTime: stats.lastExecutionTime,
        };
      }
    }
    return null;
  }

  /**
   * Get performance statistics for all recipes.
   */
  getAllRecipeStats(): RecipeStats[] {
    const allStats: RecipeStats[] = [];
    const seenRecipeIds = new Set<string>();

    for (const [, stats] of Array.from(this.stats.entries())) {
      // Avoid duplicates by recipe ID
      if (!seenRecipeIds.has(stats.recipeId)) {
        seenRecipeIds.add(stats.recipeId);
        allStats.push({
          recipeId: stats.recipeId,
          recipeName: stats.recipeName,
          executionCount: stats.executionCount,
          averageConfidence: stats.executionCount > 0
            ? stats.totalConfidence / stats.executionCount
            : 0,
          averageEvidenceCount: stats.executionCount > 0
            ? stats.totalEvidenceCount / stats.executionCount
            : 0,
          lastExecutionTime: stats.lastExecutionTime,
        });
      }
    }

    return allStats;
  }

  /**
   * Get the top N recipes sorted by a specific metric.
   */
  getTopRecipes(metric: "executionCount" | "averageConfidence" | "averageEvidenceCount", limit: number = 10): RecipeStats[] {
    const allStats = this.getAllRecipeStats();

    // Sort by the specified metric
    allStats.sort((a, b) => {
      const aValue = a[metric];
      const bValue = b[metric];
      return bValue - aValue;
    });

    return allStats.slice(0, limit);
  }

  /**
   * Get the total number of tracked recipes.
   */
  getTrackedRecipeCount(): number {
    const seenRecipeIds = new Set<string>();
    for (const [, stats] of Array.from(this.stats.entries())) {
      seenRecipeIds.add(stats.recipeId);
    }
    return seenRecipeIds.size;
  }

  /**
   * Clear all tracked statistics.
   * Useful for testing or resetting the tracker.
   */
  clear(): void {
    this.stats.clear();
  }
}
