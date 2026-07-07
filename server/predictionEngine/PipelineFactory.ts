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
import { initializeEngines } from "./EngineInitializer";

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
  * - Specialist engines are registered
  * - RecipeRegistry is initialized with database connection
  */
let pipelineInstance: PredictionPipeline | null = null;

export function getPredictionPipeline(): PredictionPipeline {
  if (pipelineInstance) {
    return pipelineInstance;
  }

  // Initialize all specialist engines
  initializeEngines();

  // Initialize RecipeRegistry with database connection
  // This allows RecipeRegistry to load user-created recipes from the database
  const initializeRegistry = async () => {
    try {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (db) {
        await RecipeRegistry.getInstance().initializeDatabase(db);
        console.log("[PipelineFactory] RecipeRegistry initialized with database connection");
      }
    } catch (err) {
      console.error("[PipelineFactory] Failed to initialize RecipeRegistry database:", err);
    }
  };
  initializeRegistry();

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
