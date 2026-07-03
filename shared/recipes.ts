/**
 * Prediction Recipe System
 * Defines the recipes used by the Prediction Engine
 * Supports multiple recipes per prediction for future Learning Engine analysis
 * Single Source of Truth for recipe information across the application
 */

export type RecipeCategory = 'trend' | 'sentiment' | 'technical' | 'fundamental' | 'hybrid';
export type RecipeAvailability = 'available' | 'coming_soon' | 'deprecated';

export interface RecipeVersionHistory {
  version: string;
  date: string;
  changes: string;
}

export interface PredictionRecipe {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  
  // User-facing information (no technical details)
  useCases: string[];
  expectedEffect: string;  // User-facing explanation
  examples: string[];
  
  // State management
  availability: RecipeAvailability;
  version: string;
  
  // Future: Backend will provide version history
  versionHistory?: RecipeVersionHistory[];
  
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
 * This is the Single Source of Truth for all recipe information
 */
export const mockRecipes: PredictionRecipe[] = [
  {
    id: 'recipe-trend-01',
    name: 'Trend Analysis',
    description: 'Analyzes historical trends and patterns to identify directional movements',
    category: 'trend',
    useCases: ['Stock price movements', 'Market direction forecasting', 'Momentum identification'],
    expectedEffect: 'Identifies long-term directional movements and momentum shifts',
    examples: ['Predicting uptrend continuation', 'Identifying trend reversals', 'Measuring momentum strength'],
    availability: 'available',
    version: '1.0',
    versionHistory: [
      { version: '1.0', date: '2026-01-01', changes: 'Initial release' },
    ],
  },
  {
    id: 'recipe-sentiment-01',
    name: 'Sentiment Analysis',
    description: 'Analyzes market sentiment and public opinion',
    category: 'sentiment',
    useCases: ['Market psychology assessment', 'Investor confidence measurement', 'Opinion-based predictions'],
    expectedEffect: 'Captures market psychology and investor confidence levels',
    examples: ['Predicting market rallies from positive sentiment', 'Identifying panic selling', 'Measuring crowd behavior'],
    availability: 'available',
    version: '1.0',
    versionHistory: [
      { version: '1.0', date: '2026-01-01', changes: 'Initial release' },
    ],
  },
  {
    id: 'recipe-technical-01',
    name: 'Technical Indicators',
    description: 'Uses technical analysis indicators and chart patterns',
    category: 'technical',
    useCases: ['Short-term price movements', 'Support/resistance level identification', 'Entry/exit point timing'],
    expectedEffect: 'Identifies support/resistance levels and price action patterns',
    examples: ['Predicting bounces from support levels', 'Identifying breakout opportunities', 'Measuring overbought/oversold conditions'],
    availability: 'available',
    version: '1.0',
    versionHistory: [
      { version: '1.0', date: '2026-01-01', changes: 'Initial release' },
    ],
  },
  {
    id: 'recipe-fundamental-01',
    name: 'Fundamental Analysis',
    description: 'Analyzes economic data and company fundamentals',
    category: 'fundamental',
    useCases: ['Long-term valuation assessment', 'Company health evaluation', 'Economic impact analysis'],
    expectedEffect: 'Evaluates intrinsic value and long-term sustainability',
    examples: ['Predicting earnings impact on stock price', 'Assessing company growth potential', 'Measuring economic headwinds'],
    availability: 'available',
    version: '1.0',
    versionHistory: [
      { version: '1.0', date: '2026-01-01', changes: 'Initial release' },
    ],
  },
  {
    id: 'recipe-hybrid-01',
    name: 'Hybrid Approach',
    description: 'Combines multiple analysis methods for comprehensive assessment',
    category: 'hybrid',
    useCases: ['Comprehensive market analysis', 'Risk assessment from multiple angles', 'Balanced decision making'],
    expectedEffect: 'Provides balanced perspective by integrating multiple signals',
    examples: ['Combining trend and sentiment for stronger signals', 'Cross-validating technical and fundamental views', 'Reducing single-method bias'],
    availability: 'available',
    version: '1.0',
    versionHistory: [
      { version: '1.0', date: '2026-01-01', changes: 'Initial release' },
    ],
  },
];

/**
 * Get recipe by ID
 * Single Source of Truth access point
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
 * Filters by availability state
 */
export function getRecipesByCategory(category: RecipeCategory): PredictionRecipe[] {
  return mockRecipes.filter((r) => r.category === category && r.availability === 'available');
}

/**
 * Get all available recipes
 * Filters by availability state instead of boolean flag
 */
export function getEnabledRecipes(): PredictionRecipe[] {
  return mockRecipes.filter((r) => r.availability === 'available');
}

/**
 * Get all recipes (including coming soon and deprecated)
 * For admin/library view
 */
export function getAllRecipes(): PredictionRecipe[] {
  return mockRecipes;
}
