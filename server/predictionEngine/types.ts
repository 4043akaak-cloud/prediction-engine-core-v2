export interface PredictionRequest {
  query: string;
  recipeId: string;
  recipeName?: string;
}

export interface Evidence {
  [key: string]: any;
}

export interface StandardizedEvidence {
  id: string;
  source: string;
  title: string;
  summary: string;
  confidence: number;
  timestamp: number;
  type: string;
  weight?: number; // Evidence weight for confidence calculation (default: 1.0)
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
  evidenceList?: StandardizedEvidence[];
  explanation?: string; // Human-readable explanation of the prediction
}

export interface PredictionMetadata {
  recipeId: string;
  recipeName: string;
  executionTimestamp: number;
  confidenceScore: number;
  evidenceCount: number;
  pipelineVersion?: string;
  executionTime?: number;
}

export interface RecommendationResult {
  recipeId: string;
  score: number;
  reason: string;
}

export interface PredictionPipelineResult {
  prediction: PredictionResult;
  recommendations: RecommendationResult[];
}
