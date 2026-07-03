/**
 * Prediction Recipe System
 * Defines the recipes used by the Prediction Engine
 * Supports multiple recipes per prediction for future Learning Engine analysis
 */

export type RecipeCategory = 'trend' | 'sentiment' | 'technical' | 'fundamental' | 'hybrid';

export interface PredictionRecipe {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  expectedEffect: string;  // User-facing explanation
  version: string;
  enabled: boolean;
  
  // Future Learning Engine metadata
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
  };
}

/**
 * Mock Recipes for demonstration
 * In production, these would come from a backend API
 */
export const mockRecipes: PredictionRecipe[] = [
  {
    id: 'recipe-trend-01',
    name: 'Trend Analysis',
    description: 'Analyzes historical trends and patterns to identify directional movements',
    category: 'trend',
    expectedEffect: 'Identifies long-term directional movements and momentum shifts',
    version: '1.0',
    enabled: true,
  },
  {
    id: 'recipe-sentiment-01',
    name: 'Sentiment Analysis',
    description: 'Analyzes market sentiment and public opinion',
    category: 'sentiment',
    expectedEffect: 'Captures market psychology and investor confidence levels',
    version: '1.0',
    enabled: true,
  },
  {
    id: 'recipe-technical-01',
    name: 'Technical Indicators',
    description: 'Uses technical analysis indicators and chart patterns',
    category: 'technical',
    expectedEffect: 'Identifies support/resistance levels and trading signals',
    version: '1.0',
    enabled: true,
  },
  {
    id: 'recipe-fundamental-01',
    name: 'Fundamental Analysis',
    description: 'Analyzes economic data and company fundamentals',
    category: 'fundamental',
    expectedEffect: 'Evaluates intrinsic value and long-term sustainability',
    version: '1.0',
    enabled: true,
  },
  {
    id: 'recipe-hybrid-01',
    name: 'Hybrid Approach',
    description: 'Combines multiple analysis methods for comprehensive assessment',
    category: 'hybrid',
    expectedEffect: 'Provides balanced perspective by integrating multiple signals',
    version: '1.0',
    enabled: true,
  },
];

/**
 * Get recipe by ID
 */
export function getRecipeById(id: string): PredictionRecipe | undefined {
  return mockRecipes.find((r) => r.id === id);
}

/**
 * Get recipes by IDs (for multiple recipe support)
 */
export function getRecipesByIds(ids: string[]): PredictionRecipe[] {
  return ids
    .map((id) => getRecipeById(id))
    .filter((recipe): recipe is PredictionRecipe => recipe !== undefined);
}

/**
 * Get recipes by category
 */
export function getRecipesByCategory(category: RecipeCategory): PredictionRecipe[] {
  return mockRecipes.filter((r) => r.category === category && r.enabled);
}

/**
 * Get all enabled recipes
 */
export function getEnabledRecipes(): PredictionRecipe[] {
  return mockRecipes.filter((r) => r.enabled);
}
