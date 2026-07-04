import { PredictionHistoryRecord } from "./PredictionHistoryRepository";

/**
 * Read-only interface for accessing prediction history.
 * This interface ensures that analytics services can only read history,
 * never modify it.
 */
export interface IReadOnlyHistoryProvider {
  getAll(): PredictionHistoryRecord[];
  getCount(): number;
}

/**
 * Statistics for a single recipe.
 */
export interface RecipeUsageStats {
  recipeName: string;
  count: number;
  averageConfidence: number;
}

/**
 * Analytics service for prediction history.
 * Provides read-only access to prediction history statistics.
 */
export class PredictionHistoryAnalytics {
  private historyProvider: IReadOnlyHistoryProvider;

  constructor(historyProvider: IReadOnlyHistoryProvider) {
    this.historyProvider = historyProvider;
  }

  /**
   * Get the total number of predictions recorded.
   */
  getPredictionCount(): number {
    return this.historyProvider.getCount();
  }

  /**
   * Get the average confidence across all predictions.
   */
  getAverageConfidence(): number {
    const history = this.historyProvider.getAll();
    if (history.length === 0) {
      return 0;
    }

    const totalConfidence = history.reduce((sum, record) => sum + record.confidence, 0);
    return totalConfidence / history.length;
  }

  /**
   * Get usage statistics for each recipe.
   */
  getRecipeUsageStats(): RecipeUsageStats[] {
    const history = this.historyProvider.getAll();
    const statsMap = new Map<string, { count: number; totalConfidence: number }>();

    for (const record of history) {
      const recipeNames = record.executedRecipeNames;
      for (const recipeName of recipeNames) {
        const existing = statsMap.get(recipeName);
        if (existing) {
          existing.count += 1;
          existing.totalConfidence += record.confidence;
        } else {
          statsMap.set(recipeName, {
            count: 1,
            totalConfidence: record.confidence,
          });
        }
      }
    }

    const stats: RecipeUsageStats[] = [];
    for (const [recipeName, data] of Array.from(statsMap.entries())) {
      stats.push({
        recipeName,
        count: data.count,
        averageConfidence: data.totalConfidence / data.count,
      });
    }

    return stats;
  }

  /**
   * Get the most recent N predictions.
   */
  getRecentPredictions(limit: number): PredictionHistoryRecord[] {
    const history = this.historyProvider.getAll();
    if (limit <= 0) {
      return [];
    }
    return history.slice(Math.max(0, history.length - limit));
  }
}
