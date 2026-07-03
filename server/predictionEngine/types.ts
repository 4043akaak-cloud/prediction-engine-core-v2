export interface PredictionRequest {
  query: string;
  recipeId: string;
}

export interface Evidence {
  [key: string]: any;
}

export interface RecipeExecutionResult {
  rawPredictionData: any;
}

export interface PredictionResult {
  id: string;
  prediction: string;
  confidence: number;
  reason: string;
  recipeUsed: string;
  timestamp: number;
  // Add other fields as needed for the final result
}

export interface IRecipe {
  id: string;
  name: string;
  description: string;
  execute(evidence: Evidence): RecipeExecutionResult;
}

export interface IRecipeExecutor {
  execute(recipe: IRecipe, evidence: Evidence): RecipeExecutionResult;
}

export interface IEvidenceCollector {
  collect(query: string): Evidence;
}

export interface IConfidenceCalculator {
  calculate(recipeResult: RecipeExecutionResult, evidence: Evidence): number;
}

export interface IPredictionResultBuilder {
  build(request: PredictionRequest, recipeResult: RecipeExecutionResult, confidence: number): PredictionResult;
}

export interface IPredictionEngine {
  predict(request: PredictionRequest): Promise<PredictionResult>;
}
