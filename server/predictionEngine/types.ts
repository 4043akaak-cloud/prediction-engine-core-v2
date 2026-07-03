export interface PredictionRequest {
  query: string;
  recipeId: string;
}

export interface Evidence {
  [key: string]: any;
}

export interface RecipeExecutionResult {
  rawPredictionData: {
    value: string;
    factors: string[];
    [key: string]: any;
  };
  factors?: string[];
}

export interface PredictionResult {
  id: string;
  prediction: string;
  confidence: number;
  reason: string;
  recipeUsed: string;
  timestamp: number;
}

export interface IRecipe {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  execute(evidence: Evidence): Promise<RecipeExecutionResult>;
}

export interface IRecipeExecutor {
  execute(recipe: IRecipe, evidence: Evidence): Promise<RecipeExecutionResult>;
}

export interface IEvidenceCollector {
  collect(query: string): Evidence;
}

export interface IConfidenceCalculator {
  calculate(recipeResult: RecipeExecutionResult, evidence: Evidence): number;
}

export interface IPredictionResultBuilder {
  build(
    request: PredictionRequest,
    recipeResult: RecipeExecutionResult,
    confidence: number,
  ): PredictionResult;
}

export interface IPredictionEngine {
  predict(request: PredictionRequest): Promise<PredictionResult>;
}

export interface IPredictionEngineMulti {
  predictMultiple(request: PredictionRequest): Promise<PredictionResult[]>;
}
