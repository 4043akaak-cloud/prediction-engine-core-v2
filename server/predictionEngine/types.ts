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

// Standardized RecipeOutput (v0.1: temporary alias for RecipeExecutionResult)
export type RecipeOutput = RecipeExecutionResult;

export interface PredictionResult {
  id: string;
  prediction: string;
  confidence: number;
  reason: string;
  recipeUsed: string;
  timestamp: number;
  metadata?: PredictionMetadata;
}

export interface PredictionMetadata {
  recipeId: string;
  recipeName: string;
  executionTimestamp: number;
  confidenceScore: number;
  evidenceCount: number;
  predictionVersion: string;
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
