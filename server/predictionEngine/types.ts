export interface PredictionRequest {
  query: string;
  recipeId: string;
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
  predictionVersion: string;
}

// EnsembleStrategy Contract v1.0 (Issue 006)
export type EnsembleStrategy = "confidence-weighted" | "majority-voting";

// IMultiRecipeEnsembleEngine Contract v1.0 (Issue 006)
export interface IMultiRecipeEnsembleEngine {
  ensemble(
    predictions: PredictionResult[],
    strategy?: EnsembleStrategy,
  ): Promise<PredictionResult>;
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
  collect(query: string): Promise<Evidence>;
}

export interface IConfidenceCalculator {
  calculate(recipeResult: RecipeExecutionResult, evidence: Evidence): number;
}

export interface IPredictionResultBuilder {
  build(
    request: PredictionRequest,
    recipeResult: RecipeExecutionResult,
    confidence: number,
    evidence?: Evidence,
  ): PredictionResult;
}

export interface IPredictionEngine {
  predict(request: PredictionRequest): Promise<PredictionResult>;
}

export interface IPredictionEngineMulti {
  predictMultiple(request: PredictionRequest): Promise<PredictionResult[]>;
}

// ReasoningResult Contract v1.0
export interface ReasoningResult {
  explanation: string;
  confidenceAdjustment: number;
  appliedRules: string[];
  reasoning: {
    [key: string]: any;
  };
}

// IReasoningEngine Contract v1.0
export interface IReasoningEngine {
  reason(
    prediction: string,
    confidence: number,
    evidence: StandardizedEvidence[],
    recipeResult: RecipeExecutionResult,
  ): Promise<ReasoningResult>;
}

// ReasoningResult Contract v1.0
export interface ReasoningResult {
  explanation: string;
  confidenceAdjustment: number;
  appliedRules: string[];
  reasoning: {
    [key: string]: any;
  };
}

// IReasoningEngine Contract v1.0
export interface IReasoningEngine {
  reason(
    prediction: string,
    confidence: number,
    evidence: StandardizedEvidence[],
    recipeResult: RecipeExecutionResult,
  ): Promise<ReasoningResult>;
}

// RecommendationResult Contract v1.0 (CONTRACT_FREEZE.md)
export interface RecommendationResult {
  recipeId: string;
  score: number; // 0-1 (normalized)
  reason: string;
  metadata?: {
    [key: string]: any;
  };
}

// RecommendationOptions Contract v1.0 (CONTRACT_FREEZE.md)
export interface RecommendationOptions {
  limit?: number;
  minScore?: number;
  categories?: string[];
  [key: string]: any;
}

// IRecommendationEngine Contract v1.0 (CONTRACT_FREEZE.md)
export interface IRecommendationEngine {
  recommend(
    query: string,
    options?: RecommendationOptions,
  ): Promise<RecommendationResult[]>;
}

// LearningResult Contract v1.0 (CONTRACT_FREEZE.md)
export interface LearningResult {
  success: boolean;
  updatedRecipes: string[];
  recommendationsUpdated: boolean;
  metadata?: Record<string, unknown>; // Extensible Area for future features
}

// ILearningEngine Contract v1.0 (CONTRACT_FREEZE.md)
export interface ILearningEngine {
  learn(
    predictionId: string,
    actualResult: unknown,
  ): Promise<LearningResult>;
}

// PredictionPipelineResult Contract v1.0 (Issue 005)
// Combines PredictionResult with recommendations
// PredictionResult is NOT modified - this is a composition
export interface PredictionPipelineResult {
  // Core prediction (unchanged from PredictionResult)
  prediction: PredictionResult;

  // Recommended recipes for this query
  recommendations: RecommendationResult[];

  // Optional metadata
  metadata?: {
    executionTime?: number; // Pipeline execution time in ms
    pipelineVersion?: string; // Pipeline version (e.g., "1.0")
    [key: string]: unknown;
  };
}
