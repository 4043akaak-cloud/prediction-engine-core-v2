export interface IPredictionEngine {
  predict(request: PredictionRequest): Promise<RecipeExecutionResult>;
}

export interface IPredictionEngineMulti {
  predictMultiple(requests: PredictionRequest[]): Promise<RecipeExecutionResult[]>;
}

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
  id?: string;
  prediction?: string;
  confidence?: number;
  reason?: string;
  recipeUsed?: string;
  timestamp?: number;
  metadata?: PredictionMetadata;
  evidenceList?: StandardizedEvidence[];
  explanation?: string;
  rawPredictionData: {
    value: string;
    factors: string[];
    [key: string]: any;
  };
  factors?: string[];
}

// Standardized RecipeOutput (v0.1: temporary alias for RecipeExecutionResult)
export type RecipeOutput = RecipeExecutionResult;

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

export interface KnowledgeSource {
  type: "People" | "Theories & Laws" | "Philosophy" | "Art & Culture" | "Natural Systems";
  value: string;
}

export interface EngineMetadata {
  name: string;
  family: string;
  category: string;
  role: string;
  coreQuestion: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  input: string;
  output: string;
  version: string;
  status: "stable" | "beta" | "experimental";
  knowledgeSource?: KnowledgeSource;
}
