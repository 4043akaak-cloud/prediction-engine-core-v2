import { IPredictionEngine, PredictionRequest, PredictionResult, IRecipe, IRecipeExecutor, IEvidenceCollector, IConfidenceCalculator, IPredictionResultBuilder } from "./types";
import { IPredictionEngineMulti } from "./types";
import { RecipeRegistry } from "./RecipeRegistry";
import { RecipeExecutor } from "./RecipeExecutor";
import { EvidenceCollector } from "./EvidenceCollector";
import { ConfidenceCalculator } from "./ConfidenceCalculator";
import { PredictionResultBuilder } from "./PredictionResultBuilder";

export class PredictionEngine implements IPredictionEngine, IPredictionEngineMulti {
  private recipeExecutor: IRecipeExecutor;
  private evidenceCollector: IEvidenceCollector;
  private confidenceCalculator: IConfidenceCalculator;
  private predictionResultBuilder: IPredictionResultBuilder;
  private recipeRegistry: RecipeRegistry;

  constructor() {
    this.recipeRegistry = RecipeRegistry.getInstance();

    this.recipeExecutor = new RecipeExecutor();
    this.evidenceCollector = new EvidenceCollector();
    this.confidenceCalculator = new ConfidenceCalculator();
    this.predictionResultBuilder = new PredictionResultBuilder();
  }

  public async predict(request: PredictionRequest): Promise<PredictionResult> {
    console.log("Prediction Engine: Starting prediction process...");

    // 1. Select Recipe
    const recipe = this.recipeRegistry.getRecipe(request.recipeId);
    if (!recipe) {
      throw new Error(`Recipe with ID ${request.recipeId} not found.`);
    }
    console.log(`Prediction Engine: Selected recipe: ${recipe.name}`);

    // 2. Collect Evidence
    const evidence = this.evidenceCollector.collect(request.query);
    console.log("Prediction Engine: Evidence collected.", evidence);

    // 3. Execute Recipe
    const recipeExecutionResult = await this.recipeExecutor.execute(recipe, evidence);
    console.log("Prediction Engine: Recipe executed.", recipeExecutionResult);

    // 4. Calculate Confidence
    const confidence = this.confidenceCalculator.calculate(recipeExecutionResult, evidence);
    console.log("Prediction Engine: Confidence calculated.", confidence);

    // 5. Build Prediction Result
    const predictionResult = this.predictionResultBuilder.build(request, recipeExecutionResult, confidence, evidence);
    console.log("Prediction Engine: Prediction result built.", predictionResult);

    console.log("Prediction Engine: Prediction process completed.");
    return predictionResult;
  }

  public async predictMultiple(request: PredictionRequest): Promise<PredictionResult[]> {
    console.log("Prediction Engine: Starting multi-recipe prediction process...");

    // 1. Collect Evidence (once for all recipes)
    const evidence = this.evidenceCollector.collect(request.query);
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

        results.push(predictionResult);
      } catch (error) {
        console.error(`Prediction Engine: Error executing recipe ${recipe.id}:`, error);
        // Continue with next recipe even if one fails
      }
    }

    console.log(`Prediction Engine: Multi-recipe prediction process completed. Generated ${results.length} results.`);
    return results;
  }
}
