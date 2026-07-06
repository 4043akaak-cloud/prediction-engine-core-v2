import { PredictionHistoryRecord } from "./PredictionHistoryRepository";

/**
 * Test Fixture: Builder for constructing PredictionHistoryRecord instances.
 *
 * Purpose:
 * - Enable easy construction of test data
 * - Maintain Production API integrity (no test-only methods in RecipePerformanceTracker)
 * - Follow the official data flow: PredictionHistoryRecord → RecipePerformanceTracker
 *
 * Usage:
 * ```typescript
 * const record = new PredictionHistoryRecordBuilder()
 *   .withRecipeId("recipe-1")
 *   .withRecipeName("Trend Recipe")
 *   .withConfidence(0.85)
 *   .withQuery("Will BTC go up?")
 *   .build();
 *
 * performanceTracker.recordPrediction(record);
 * ```
 *
 * Note: This is a test-only fixture. Production code should use
 * PredictionHistoryRepository.record() instead.
 */
export class PredictionHistoryRecordBuilder {
  private id: string = `pred-${Date.now()}`;
  private timestamp: number = Date.now();
  private query: string = "Test query";
  private recipeId: string = "recipe-1";
  private prediction: string = "Test prediction";
  private confidence: number = 0.5;
  private executedRecipeNames: string[] = ["Test Recipe"];

  /**
   * Set the record ID
   */
  public withId(id: string): this {
    this.id = id;
    return this;
  }

  /**
   * Set the timestamp
   */
  public withTimestamp(timestamp: number): this {
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Set the query
   */
  public withQuery(query: string): this {
    this.query = query;
    return this;
  }

  /**
   * Set the recipe ID
   */
  public withRecipeId(recipeId: string): this {
    this.recipeId = recipeId;
    return this;
  }

  /**
   * Set the prediction
   */
  public withPrediction(prediction: string): this {
    this.prediction = prediction;
    return this;
  }

  /**
   * Set the confidence
   */
  public withConfidence(confidence: number): this {
    this.confidence = Math.max(0, Math.min(1, confidence)); // Clamp to 0-1
    return this;
  }

  /**
   * Set the executed recipe names
   */
  public withRecipeName(recipeName: string): this {
    this.executedRecipeNames = [recipeName];
    return this;
  }

  /**
   * Set multiple executed recipe names
   */
  public withRecipeNames(recipeNames: string[]): this {
    this.executedRecipeNames = recipeNames;
    return this;
  }

  /**
   * Build the PredictionHistoryRecord
   */
  public build(): PredictionHistoryRecord {
    return {
      id: this.id,
      timestamp: this.timestamp,
      request: {
        query: this.query,
        recipeId: this.recipeId,
      },
      prediction: this.prediction,
      confidence: this.confidence,
      executedRecipeNames: this.executedRecipeNames,
    };
  }

  /**
   * Build multiple records with the same base configuration
   */
  public buildMultiple(count: number): PredictionHistoryRecord[] {
    const records: PredictionHistoryRecord[] = [];
    for (let i = 0; i < count; i++) {
      records.push({
        ...this.build(),
        id: `${this.id}-${i}`,
        timestamp: this.timestamp + i * 1000, // Increment timestamp
      });
    }
    return records;
  }
}
