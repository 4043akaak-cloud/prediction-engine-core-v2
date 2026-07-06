import { PredictionHistoryRepository } from "./PredictionHistoryRepository";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";
import { LearningResult, ILearningEngine } from "./types";

/**
 * LearningEngine v1 - Coordinator for recipe learning and improvement
 *
 * Responsibility:
 * - Coordinate the learning flow when prediction outcomes become known
 * - Delegate to specialized components (no internal logic)
 * - Update recipe performance based on feedback
 * - Trigger evolution analysis
 * - Return learning results
 *
 * Design:
 * - Orchestrator pattern (not executor)
 * - Dependency Injection only
 * - No Singleton
 * - Stateless
 *
 * Dependencies:
 * - PredictionHistoryRepository (read-only, existing API only)
 * - RecipePerformanceTracker (update performance)
 * - RecipeEvolutionEngine (analyze evolution)
 *
 * Note: Does NOT depend on PredictionEngine or RecommendationEngine
 *
 * v1 Limitations:
 * - Feedback is in-memory only (not persisted)
 * - TODO: Implement PredictionFeedbackRepository for persistence (separate Issue)
 */
export class LearningEngine implements ILearningEngine {
  constructor(
    private predictionHistoryRepository: PredictionHistoryRepository,
    private recipePerformanceTracker: RecipePerformanceTracker,
    private recipeEvolutionEngine: RecipeEvolutionEngine,
  ) {}

  /**
   * Learn from prediction outcome
   *
   * Orchestrates the learning flow:
   * 1. Find prediction in history by ID
   * 2. Calculate accuracy from prediction vs actual result
   * 3. Update recipe performance
   * 4. Trigger evolution analysis
   * 5. Return learning result
   *
   * @param predictionId - ID of the prediction to learn from
   * @param actualResult - The actual outcome that occurred
   * @returns LearningResult with success status and updated recipes
   *
   * v1 Limitation: Feedback is not persisted (in-memory only)
   */
  public async learn(
    predictionId: string,
    actualResult: unknown,
  ): Promise<LearningResult> {
    try {
      // Step 1: Find prediction in history
      const allRecords = this.predictionHistoryRepository.getAll();
      const record = allRecords.find((r) => r.id === predictionId);

      if (!record) {
        return {
          success: false,
          updatedRecipes: [],
          recommendationsUpdated: false,
          metadata: {
            error: "Prediction not found in history",
            predictionId,
          },
        };
      }

      // Step 2: Calculate accuracy (prediction vs actual)
      const accuracy = this.calculateAccuracy(record.prediction, actualResult);

      // Step 3: Update recipe performance
      this.recipePerformanceTracker.recordPrediction({
        ...record,
        confidence: accuracy,
      });

      // Step 4: Trigger evolution analysis
      const recipeId = record.request.recipeId;
      const analysis = this.recipeEvolutionEngine.analyzeRecipe(recipeId);

      // Step 5: Return learning result
      return {
        success: true,
        updatedRecipes: [recipeId],
        recommendationsUpdated: analysis !== null,
        metadata: {
          predictionId,
          recipeId,
          accuracy,
          actualResult,
          analysis: analysis || undefined,
          note: "v1: Feedback is in-memory only (not persisted)",
        },
      };
    } catch (error) {
      return {
        success: false,
        updatedRecipes: [],
        recommendationsUpdated: false,
        metadata: {
          error: error instanceof Error ? error.message : String(error),
          predictionId,
        },
      };
    }
  }

  /**
   * Calculate accuracy of prediction vs actual result
   *
   * Algorithm (from ALGORITHM_SPECIFICATION_V1.md Section 3.3):
   * - Exact match → 1.0
   * - Fuzzy match (90%+ similarity) → 0.8
   * - Partial match (contains key words) → 0.5
   * - No match → 0.0
   *
   * @param prediction - The predicted value
   * @param actual - The actual value that occurred
   * @returns Accuracy score (0-1)
   */
  private calculateAccuracy(prediction: unknown, actual: unknown): number {
    const predStr = String(prediction).toLowerCase().trim();
    const actualStr = String(actual).toLowerCase().trim();

    // Exact match
    if (predStr === actualStr) {
      return 1.0;
    }

    // Fuzzy match: check if strings are 90%+ similar
    const similarity = this.calculateSimilarity(predStr, actualStr);
    if (similarity >= 0.9) {
      return 0.8;
    }

    // Partial match: check if key words overlap
    const predWords = new Set(predStr.split(/\s+/));
    const actualWords = new Set(actualStr.split(/\s+/));
    const predWordsArray = Array.from(predWords);
    const actualWordsArray = Array.from(actualWords);
    const intersection = predWordsArray.filter((w) => actualWords.has(w));
    const unionSize = new Set([...predWordsArray, ...actualWordsArray]).size;
    const wordOverlap = intersection.length / unionSize;

    if (wordOverlap >= 0.5) {
      return 0.5;
    }

    // No match
    return 0.0;
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}
