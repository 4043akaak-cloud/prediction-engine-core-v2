import { PredictionPipeline } from "./PredictionPipeline";
import { PredictionEngine } from "./PredictionEngine";
import { ReasoningEngine } from "./ReasoningEngine";
import { RecommendationEngine } from "./RecommendationEngine";
import { MultiRecipeEnsembleEngine } from "./MultiRecipeEnsembleEngine";
import { PredictionHistoryRepository } from "./PredictionHistoryRepository";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { PredictionHistory } from "./PredictionHistory";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";
import { RecipeRegistry } from "./RecipeRegistry";

/**
  * PipelineFactory
  * 
  * Responsible for creating and managing the PredictionPipeline instance.
  * Handles all Dependency Injection.
  * 
  * This factory ensures:
  * - Single instance of PredictionPipeline
  * - All dependencies are properly initialized
  * - Clean separation of concerns
  */

let pipelineInstance: PredictionPipeline | null = null;

export function getPredictionPipeline(): PredictionPipeline {
  if (pipelineInstance) {
    return pipelineInstance;
  }

  // Initialize all dependencies
  const predictionEngine = new PredictionEngine();
  const reasoningEngine = new ReasoningEngine();
  const performanceTracker = new RecipePerformanceTracker();
  const evolutionEngine = new RecipeEvolutionEngine(performanceTracker);
  const recommendationEngine = new RecommendationEngine(
    performanceTracker,
    evolutionEngine,
    RecipeRegistry.getInstance(),
  );
  const multiRecipeEnsembleEngine = new MultiRecipeEnsembleEngine();
  const historyRepository = PredictionHistoryRepository.getInstance();
  const predictionHistory = new PredictionHistory();

  // Create pipeline
  pipelineInstance = new PredictionPipeline(
    reasoningEngine,
    predictionEngine,
    historyRepository,
    recommendationEngine,
    performanceTracker,
    predictionHistory,
    multiRecipeEnsembleEngine,
  );

  return pipelineInstance;
}

/**
 * Reset pipeline instance (for testing only)
 */
export function resetPipelineForTesting(): void {
  pipelineInstance = null;
}
