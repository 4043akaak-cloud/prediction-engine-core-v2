/**
 * API Types
 * Defines request/response types for all API endpoints
 * Enables future migration from Mock API to REST/GraphQL/Backend
 */

/**
 * Prediction API Types
 */
export interface GeneratePredictionRequest {
  question: string;
  category: string;
  confidence?: number;
}

export interface GeneratePredictionResponse {
  id: string;
  question: string;
  prediction: string;
  confidence: number;
  category: string;
  reason: string;
  counterPrediction: string;
  metadata: {
    recipeId: string;
    timestamp: string;
  };
}

/**
 * Recipe API Types
 */
export interface RecipeItem {
  id: string;
  name: string;
  description: string;
  category: string;
  expectedEffect: string;
  version: string;
  enabled: boolean;
  availability: 'available' | 'coming_soon' | 'deprecated';
  useCases: string[];
  examples: string[];
  versionHistory?: Array<{
    version: string;
    date: string;
    changes: string;
  }>;
}

export interface GetRecipesResponse {
  recipes: RecipeItem[];
}

/**
 * Diary API Types
 */
export interface DiaryEntryData {
  id: string;
  prediction: string;
  confidence: number;
  category: string;
  reason: string;
  counterPrediction: string;
  createdAt: string;
  updatedAt: string;
  modelVersion: string;
  lifecycle: {
    status: 'pending' | 'resolved' | 'archived';
    notes?: string;
    outcome?: {
      type: string;
      timestamp: string;
    };
    evaluation?: {
      type: string;
      timestamp: string;
    };
  };
  feedback?: {
    helpful: boolean | null;
  };
  recipeUsage?: {
    recipeIds: string[];
    selectedRecipeNames?: string[];
  };
}

export interface GetDiaryResponse {
  entries: DiaryEntryData[];
}

/**
 * Lifecycle API Types
 */
export interface UpdateLifecycleRequest {
  predictionId: string;
  status?: 'pending' | 'resolved' | 'archived';
  outcome?: {
    type: string;
    timestamp: string;
  };
  evaluation?: {
    type: string;
    timestamp: string;
  };
  notes?: string;
}

/**
 * Settings API Types
 */
export interface SettingsData {
  prediction: Record<string, unknown>;
  notifications: {
    enabled: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
  };
}

export interface GetSettingsResponse {
  settings: SettingsData;
}

/**
 * Generic API Response Wrapper
 * Can be used for future REST/GraphQL implementations
 */
export interface ApiResponseWrapper<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
