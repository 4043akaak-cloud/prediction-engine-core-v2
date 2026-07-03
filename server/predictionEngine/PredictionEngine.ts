import { IPredictionEngine, PredictionRequest, PredictionResult, IRecipe, IRecipeExecutor, IEvidenceCollector, IConfidenceCalculator, IPredictionResultBuilder } from "./types";
import { MockRecipe } from "./RecipeInterface";
import { RecipeExecutor } from "./RecipeExecutor";
import { EvidenceCollector } from "./EvidenceCollector";
import { ConfidenceCalculator } from "./ConfidenceCalculator";
import { PredictionResultBuilder } from "./PredictionResultBuilder";

export class PredictionEngine implements IPredictionEngine {
  private recipes: Map<string, IRecipe>;
  private recipeExecutor: IRecipeExecutor;
  private evidenceCollector: IEvidenceCollector;
  private confidenceCalculator: IConfidenceCalculator;
  private predictionResultBuilder: IPredictionResultBuilder;

  constructor() {
    this.recipes = new Map<string, IRecipe>();
    // Register mock recipes for now
    const mockRecipe = new MockRecipe();
    this.recipes.set(mockRecipe.id, mockRecipe);

    this.recipeExecutor = new RecipeExecutor();
    this.evidenceCollector = new EvidenceCollector();
    this.confidenceCalculator = new ConfidenceCalculator();
    this.predictionResultBuilder = new PredictionResultBuilder();
  }

  public async predict(request: PredictionRequest): Promise<PredictionResult> {
    console.log("Prediction Engine: Starting prediction process...");

    // 1. Select Recipe
    const recipe = this.recipes.get(request.recipeId);
    if (!recipe) {
      throw new Error(`Recipe with ID ${request.recipeId} not found.`);
    }
    console.log(`Prediction Engine: Selected recipe: ${recipe.name}`);

    // 2. Collect Evidence
    const evidence = this.evidenceCollector.collect(request.query);
    console.log("Prediction Engine: Evidence collected.", evidence);

    // 3. Execute Recipe
    const recipeExecutionResult = this.recipeExecutor.execute(recipe, evidence);
    console.log("Prediction Engine: Recipe executed.", recipeExecutionResult);

    // 4. Calculate Confidence
    const confidence = this.confidenceCalculator.calculate(recipeExecutionResult, evidence);
    console.log("Prediction Engine: Confidence calculated.", confidence);

    // 5. Build Prediction Result
    const predictionResult = this.predictionResultBuilder.build(request, recipeExecutionResult, confidence);
    console.log("Prediction Engine: Prediction result built.", predictionResult);

    console.log("Prediction Engine: Prediction process completed.");
    return predictionResult;
  }
}
