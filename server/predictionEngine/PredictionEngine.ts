import { IPredictionEngine, IPredictionEngineMulti, IRecipeExecutor, IEvidenceCollector, IConfidenceCalculator, IPredictionResultBuilder, PredictionRequest, PredictionResult } from "./types";
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

  public async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    console.log("Prediction Engine: Starting prediction process...");

    // 1. Select Recipe - Using RecipeRegistry as the single Recipe Provider
    // RecipeRegistry is completely decoupled from recipe sources
    // It handles hardcoded recipes, database recipes, cache, and future sources
    const recipe = await this.recipeRegistry.getRecipeAsync(request.recipeId);
    if (!recipe) {
      throw new Error(`Recipe with ID ${request.recipeId} not found.`);
    }
    console.log(`Prediction Engine: Selected recipe: ${recipe.name}`);

    // 2. Collect Evidence
    const evidence = await this.evidenceCollector.collect(request.query);
    console.log("Prediction Engine: Evidence collected.", evidence);

    // 3. Execute Recipe
    const recipeExecutionResult = await this.recipeExecutor.execute(recipe, evidence);
    console.log("Prediction Engine: Recipe executed.", recipeExecutionResult);

    // 4. Calculate Confidence
    const confidence = this.confidenceCalculator.calculate(recipeExecutionResult, evidence);
    console.log("Prediction Engine: Confidence calculated.", confidence);

    // 5. Build Prediction Result
    const predictionResult = await (this.predictionResultBuilder as any).build(request, recipeExecutionResult, confidence, evidence);
    console.log("Prediction Engine: Prediction result built.", predictionResult);

    return predictionResult;
  }

  public async predictMultiple(requests: PredictionRequest[]): Promise<RecipeExecutionResult[]> {
    return Promise.all(requests.map((req) => this.predict(req)));
  }
}
