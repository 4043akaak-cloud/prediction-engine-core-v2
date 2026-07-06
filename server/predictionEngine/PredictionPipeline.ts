import {
  PredictionRequest,
  PredictionResult,
  PredictionPipelineResult,
  RecommendationResult,
  IReasoningEngine,
  IPredictionEngine,
  IRecommendationEngine,
} from "./types";
import { PredictionHistoryRepository } from "./PredictionHistoryRepository";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { PredictionHistory } from "./PredictionHistory";

/**
 * PredictionPipeline v1
 *
 * Coordinator for the entire PEC prediction workflow.
 * Orchestrates ReasoningEngine, PredictionEngine, and RecommendationEngine.
 *
 * IMPORTANT: This class is a Coordinator only.
 * It does NOT contain business logic.
 * All algorithms are delegated to individual engines.
 *
 * Pipeline Flow:
 * 1. ReasoningEngine.reason() → adjust confidence
 * 2. PredictionEngine.predict() → generate prediction
 * 3. PredictionHistoryRepository.record() → persist history
 * 4. RecommendationEngine.recommend() → generate recommendations
 * 5. Assemble PredictionPipelineResult
 */
export class PredictionPipeline {
  constructor(
    private reasoningEngine: IReasoningEngine,
    private predictionEngine: IPredictionEngine,
    private historyRepository: PredictionHistoryRepository,
    private recommendationEngine: IRecommendationEngine,
    private performanceTracker: RecipePerformanceTracker,
    private predictionHistory: PredictionHistory,
  ) {}

  /**
   * Execute the complete prediction pipeline
   *
   * @param request PredictionRequest { query, recipeId }
   * @returns PredictionPipelineResult { prediction, recommendations, metadata }
   * @throws Error if any critical step fails (reasoning, prediction, history)
   */
  async execute(request: PredictionRequest): Promise<PredictionPipelineResult> {
    const startTime = Date.now();

    try {
      // Step 1: Execute PredictionEngine
      // Note: PredictionEngine ONLY generates predictions, does NOT record history
      const predictionResult = await this.predictionEngine.predict(request);

      // Step 2: Record prediction to history
      // SOLE RESPONSIBILITY: Pipeline owns all history recording
      // Record to in-memory history (for testing and analytics)
      this.predictionHistory.add(predictionResult);

      // Record to repository (persistent storage)
      this.historyRepository.record(predictionResult, request);

      // Update recipe performance statistics (critical for recommendations)
      const historyRecord = this.historyRepository.getAll().pop();
      if (historyRecord) {
        this.performanceTracker.recordPrediction(historyRecord);
      }

      // Step 3: Generate recommendations
      // Uses query and performance history updated in Step 2 (after history recording)
      let recommendations: RecommendationResult[] = [];
      try {
        recommendations = await this.recommendationEngine.recommend(
          request.query,
        );
      } catch (error) {
        // Recommendations are non-critical - degrade gracefully
        console.warn(
          "[PredictionPipeline] RecommendationEngine failed:",
          error,
        );
        recommendations = [];
      }

      // Step 4: Assemble final result
      const executionTime = Date.now() - startTime;

      return {
        prediction: predictionResult,
        recommendations,
        metadata: {
          executionTime,
          pipelineVersion: "1.0",
        },
      };
    } catch (error) {
      // Critical errors - fail fast
      console.error("[PredictionPipeline] Pipeline execution failed:", error);
      throw error;
    }
  }
}
