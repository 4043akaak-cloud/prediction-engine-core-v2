import { PredictionResult } from "./types";

/**
 * Interface for a single prediction history record.
 */
export interface PredictionHistoryRecord {
  id: string;
  timestamp: number;
  request: {
    query: string;
    recipeId: string;
  };
  prediction: string;
  confidence: number;
  executedRecipeNames: string[];
  recommendedRecipes?: string[];
  selectedRecipes?: string[];
  recommendationScore?: number;
}

/**
 * In-memory repository for storing prediction history.
 */
export class PredictionHistoryRepository {
  private static instance: PredictionHistoryRepository;
  private history: PredictionHistoryRecord[] = [];

  private constructor() {
  }

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
      id: `pred-${this.history.length + 1}`,
      timestamp: result.timestamp,
      request,
      prediction: result.prediction,
      confidence: result.confidence,
      executedRecipeNames: result.metadata?.recipeName ? [result.metadata.recipeName] : [],
      recommendedRecipes: result.recommendationMetadata?.recommendedRecipes,
      selectedRecipes: result.recommendationMetadata?.selectedRecipes,
      recommendationScore: result.recommendationMetadata?.recommendationScore,
    };
    this.history.push(record);
  }

  getAll(): PredictionHistoryRecord[] {
    return [...this.history];
  }

  getCount(): number {
    return this.history.length;
  }
}
