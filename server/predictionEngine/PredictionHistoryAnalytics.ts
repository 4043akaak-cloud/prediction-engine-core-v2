import { PredictionHistoryRepository, PredictionHistoryRecord } from "./PredictionHistoryRepository";

export interface RecipeUsageStats {
  recipeName: string;
  count: number;
  averageConfidence: number;
}

export class PredictionHistoryAnalytics {
  private repository: PredictionHistoryRepository;

  constructor(repository: PredictionHistoryRepository) {
    this.repository = repository;
  }

  /**
   * Get the total number of predictions recorded.
   */
  getPredictionCount(): number {
    return this.repository.getCount();
  }

  /**
   * Get the average confidence score of all predictions.
   */
  getAverageConfidence(): number {
    const allRecords = this.repository.getAll();
    if (allRecords.length === 0) {
      return 0;
    }
    const totalConfidence = allRecords.reduce((sum, record) => sum + record.confidence, 0);
    return totalConfidence / allRecords.length;
  }

  /**
   * Get statistics on recipe usage, including count and average confidence per recipe.
   */
  getRecipeUsageStats(): RecipeUsageStats[] {
    const allRecords = this.repository.getAll();
    const statsMap = new Map<string, { count: number; totalConfidence: number }>();

    for (const record of allRecords) {
      for (const recipeName of record.executedRecipeNames) {
        const currentStats = statsMap.get(recipeName) || { count: 0, totalConfidence: 0 };
        currentStats.count++;
        currentStats.totalConfidence += record.confidence;
        statsMap.set(recipeName, currentStats);
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

    return stats.sort((a, b) => b.count - a.count);
  }

  /**
   * Get a list of recent predictions, limited by the specified count.
   */
  getRecentPredictions(limit: number = 10): PredictionHistoryRecord[] {
    return this.repository.getAll()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
}
