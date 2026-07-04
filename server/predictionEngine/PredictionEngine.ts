import { IPredictionEngine, PredictionRequest, PredictionResult, IRecipe, IRecipeExecutor, IEvidenceCollector, IConfidenceCalculator, IPredictionResultBuilder } from "./types";
import { IPredictionEngineMulti } from "./types";
import { RecipeRegistry } from "./RecipeRegistry";
import { RecipeExecutor } from "./RecipeExecutor";
import { EvidenceCollector } from "./EvidenceCollector";
import { ConfidenceCalculator } from "./ConfidenceCalculator";
import { PredictionResultBuilder } from "./PredictionResultBuilder";
import { PredictionHistory } from "./PredictionHistory";
import { PredictionHistoryRepository } from "./PredictionHistoryRepository";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { RecipeRecommendationEngine } from "./RecipeRecommendationEngine";
import { PredictionHistoryAnalytics } from "./PredictionHistoryAnalytics";
import { RecipeEvolutionEngine } from "./RecipeEvolutionEngine";

export class PredictionEngine implements IPredictionEngine, IPredictionEngineMulti {
  private recipeExecutor: IRecipeExecutor;
  private evidenceCollector: IEvidenceCollector;
  private confidenceCalculator: IConfidenceCalculator;
  private predictionResultBuilder: IPredictionResultBuilder;
  private recipeRegistry: RecipeRegistry;
  private predictionHistory: PredictionHistory;
  private historyRepository: PredictionHistoryRepository;
  private performanceTracker: RecipePerformanceTracker;
  private recommendationEngine: RecipeRecommendationEngine;

  constructor() {
    this.recipeRegistry = RecipeRegistry.getInstance();

    this.recipeExecutor = new RecipeExecutor();
    this.evidenceCollector = new EvidenceCollector();
    this.confidenceCalculator = new ConfidenceCalculator();
    this.predictionResultBuilder = new PredictionResultBuilder();
    this.predictionHistory = new PredictionHistory();
    this.historyRepository = PredictionHistoryRepository.getInstance();
    this.performanceTracker = new RecipePerformanceTracker();

    // Initialize recommendation engine
    const analytics = new PredictionHistoryAnalytics(this.historyRepository);
    const evolutionEngine = new RecipeEvolutionEngine(this.performanceTracker, analytics, this.historyRepository);
    this.recommendationEngine = new RecipeRecommendationEngine(this.performanceTracker, analytics, evolutionEngine);
  }

  public async predict(request: PredictionRequest): Promise<PredictionResult> {
    console.log("Prediction Engine: Starting prediction process...");

    // 1. Get Recipe Recommendations
    const recommendations = this.recommendationEngine.recommendRecipes({
      query: request.query,
      recipeId: request.recipeId,
    });
    console.log(`Prediction Engine: Generated ${recommendations.length} recipe recommendations.`);

    // 2. Select the highest priority recipe
    let recipe: IRecipe | null = null;
    let selectedRecipeId = request.recipeId;
    let recommendationScore = 0;
    let recommendationReason = "";

    if (recommendations.length > 0) {
      const topRecommendation = recommendations[0];
      selectedRecipeId = topRecommendation.recipeId;
      recommendationScore = topRecommendation.score;
      recommendationReason = topRecommendation.explanation;
      recipe = this.recipeRegistry.getRecipe(selectedRecipeId) || null;
      console.log(`Prediction Engine: Selected recommended recipe: ${selectedRecipeId} (score: ${recommendationScore})`);
    } else {
      recipe = this.recipeRegistry.getRecipe(request.recipeId) || null;
      console.log(`Prediction Engine: No recommendations available, using requested recipe: ${request.recipeId}`);
    }

    if (!recipe) {
      throw new Error(`Recipe with ID ${selectedRecipeId} not found.`);
    }

    // 3. Collect Evidence
    const evidence = await this.evidenceCollector.collect(request.query);
    console.log("Prediction Engine: Evidence collected.", evidence);

    // 4. Execute Recipe
    const recipeExecutionResult = await this.recipeExecutor.execute(recipe, evidence);
    console.log("Prediction Engine: Recipe executed.", recipeExecutionResult);

    // 5. Calculate Confidence
    const confidence = this.confidenceCalculator.calculate(recipeExecutionResult, evidence);
    console.log("Prediction Engine: Confidence calculated.", confidence);

    // 6. Build Prediction Result
    const predictionRequest: PredictionRequest = {
      query: request.query,
      recipeId: selectedRecipeId,
    };
    const predictionResult = this.predictionResultBuilder.build(predictionRequest, recipeExecutionResult, confidence, evidence);

    // 7. Add Recommendation Metadata
    predictionResult.recommendationMetadata = {
      recommendedRecipes: recommendations.map((r) => r.recipeId),
      selectedRecipes: [selectedRecipeId],
      recommendationScore,
      recommendationReason,
    };

    // 8. Update Explanation with Recommendation Info
    if (predictionResult.explanation) {
      predictionResult.explanation += ` [Selected via recommendation engine with score ${recommendationScore}/100]`;
    }

    console.log("Prediction Engine: Prediction result built.", predictionResult);

    // 9. Record to History
    this.predictionHistory.add(predictionResult);
    console.log("Prediction Engine: Prediction recorded to history.");

    // 10. Record to History Repository
    this.historyRepository.record(predictionResult, {
      query: request.query,
      recipeId: selectedRecipeId,
    });
    console.log("Prediction Engine: Prediction recorded to history repository.");

    // 11. Update Recipe Performance Statistics
    const historyRecord = this.historyRepository.getAll().pop();
    if (historyRecord) {
      this.performanceTracker.recordPrediction(historyRecord);
      console.log("Prediction Engine: Recipe performance statistics updated.");
    }

    console.log("Prediction Engine: Prediction process completed.");
    return predictionResult;
  }

  public async predictMultiple(request: PredictionRequest): Promise<PredictionResult[]> {
    console.log("Prediction Engine: Starting multi-recipe prediction process...");

    // 1. Collect Evidence (once for all recipes)
    const evidence = await this.evidenceCollector.collect(request.query);
    console.log("Prediction Engine: Evidence collected.", evidence);

    // 2. Get all available recipes
    const allRecipes = this.recipeRegistry.getAllRecipes();
    console.log(`Prediction Engine: Found ${allRecipes.length} recipes to execute.`);

    // 3. Execute each recipe independently
    const results: PredictionResult[] = [];
    for (const recipe of allRecipes) {
      try {
        console.log(`Prediction Engine: Executing recipe: ${recipe.name}`);

        // Execute Recipe
        const recipeExecutionResult = await this.recipeExecutor.execute(recipe, evidence);
        console.log(`Prediction Engine: Recipe ${recipe.id} executed.`, recipeExecutionResult);

        // Calculate Confidence
        const confidence = this.confidenceCalculator.calculate(recipeExecutionResult, evidence);
        console.log(`Prediction Engine: Confidence for ${recipe.id} calculated.`, confidence);

        // Build Prediction Result
        const predictionRequest: PredictionRequest = {
          query: request.query,
          recipeId: recipe.id,
        };
        const predictionResult = this.predictionResultBuilder.build(predictionRequest, recipeExecutionResult, confidence, evidence);
        console.log(`Prediction Engine: Prediction result for ${recipe.id} built.`, predictionResult);

        // Record to History
        this.predictionHistory.add(predictionResult);

        // Record to History Repository
        this.historyRepository.record(predictionResult, {
          query: request.query,
          recipeId: recipe.id,
        });

        // Update Recipe Performance Statistics
        const historyRecord = this.historyRepository.getAll().pop();
        if (historyRecord) {
          this.performanceTracker.recordPrediction(historyRecord);
        }

        results.push(predictionResult);
      } catch (error) {
        console.error(`Prediction Engine: Error executing recipe ${recipe.id}:`, error);
        // Continue with next recipe even if one fails
      }
    }

    console.log(`Prediction Engine: Multi-recipe prediction process completed. Generated ${results.length} results.`);
    return results;
  }

  /**
   * Get the RecipePerformanceTracker instance for testing and analytics.
   */
  public getPerformanceTracker(): RecipePerformanceTracker {
    return this.performanceTracker;
  }

  /**
   * Get the RecipeRecommendationEngine instance for testing and analytics.
   */
  public getRecommendationEngine(): RecipeRecommendationEngine {
    return this.recommendationEngine;
  }
}
