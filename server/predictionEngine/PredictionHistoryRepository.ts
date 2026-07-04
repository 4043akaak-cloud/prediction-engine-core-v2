import { PredictionResult } from "./types";

/**
 * Interface for a single prediction history record.
 */
export interface PredictionHistoryRecord {
  timestamp: number;
  request: {
    query: string;
    recipeId: string;
  };
  prediction: string;
  confidence: number;
  explanation?: string;
  executedRecipeNames: string[];
}

/**
 * In-memory repository for storing prediction history.
 */
export class PredictionHistoryRepository {
  private static instance: PredictionHistoryRepository;
  private history: PredictionHistoryRecord[] = [];

  private constructor() {}

  /**
   * Get singleton instance.
   */
  static getInstance(): PredictionHistoryRepository {
    if (!PredictionHistoryRepository.instance) {
      PredictionHistoryRepository.instance = new PredictionHistoryRepository();
    }
    return PredictionHistoryRepository.instance;
  }

  /**
   * Record a prediction in history.
   */
  record(result: PredictionResult, request: { query: string; recipeId: string }): void {
    const record: PredictionHistoryRecord = {
      timestamp: result.timestamp,
      request,
      prediction: result.prediction,
      confidence: result.confidence,
      explanation: result.explanation,
      executedRecipeNames: result.metadata?.recipeName ? [result.metadata.recipeName] : [],
    };

    this.history.push(record);
    console.log(`Recorded prediction in history. Total records: ${this.history.length}`);
  }

  /**
   * Get all prediction history records.
   */
  getAll(): PredictionHistoryRecord[] {
    return [...this.history];
  }

  /**
   * Get prediction history records by recipe name.
   */
  getByRecipeName(recipeName: string): PredictionHistoryRecord[] {
    return this.history.filter(record =>
      record.executedRecipeNames.includes(recipeName)
    );
  }

  /**
   * Get prediction history records within a time range.
   */
  getByTimeRange(startTime: number, endTime: number): PredictionHistoryRecord[] {
    return this.history.filter(record =>
      record.timestamp >= startTime && record.timestamp <= endTime
    );
  }

  /**
   * Clear all prediction history.
   */
  clear(): void {
    this.history = [];
    console.log("Prediction history cleared");
  }

  /**
   * Get the number of records in history.
   */
  getCount(): number {
    return this.history.length;
  }
}
