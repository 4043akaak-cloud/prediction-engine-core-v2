import React, { createContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';

const PREDICTION_STORAGE_KEY = 'pec-prediction-result';
const RECIPE_VALIDATION_KEY = 'pec-recipe-validation-cache';

/**
 * Validate if a recipe exists by checking against a cache of known recipe IDs.
 * This prevents stale localStorage entries from causing prediction failures.
 */
function isRecipeValid(recipeId: string | undefined, validRecipeIds: Set<string>): boolean {
  if (!recipeId) return false;
  return validRecipeIds.has(recipeId);
}

/**
 * Update the recipe validation cache with current recipe IDs from the server.
 * This is called whenever recipes are fetched to keep the cache fresh.
 */
function updateRecipeValidationCache(recipeIds: string[]) {
  try {
    localStorage.setItem(RECIPE_VALIDATION_KEY, JSON.stringify({
      recipeIds,
      timestamp: Date.now(),
    }));
  } catch (err) {
    console.error('Failed to update recipe validation cache:', err);
  }
}

/**
 * Get the set of valid recipe IDs from cache.
 * Returns empty set if cache is missing or expired (older than 5 minutes).
 */
function getValidRecipeIds(): Set<string> {
  try {
    const cached = localStorage.getItem(RECIPE_VALIDATION_KEY);
    if (!cached) return new Set();
    
    const data = JSON.parse(cached);
    const age = Date.now() - (data.timestamp || 0);
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    
    if (age > CACHE_TTL) {
      localStorage.removeItem(RECIPE_VALIDATION_KEY);
      return new Set();
    }
    
    return new Set(data.recipeIds || []);
  } catch (err) {
    console.error('Failed to get recipe validation cache:', err);
    return new Set();
  }
}

function savePredictionToStorage(prediction: Prediction | null, counterPrediction: CounterPrediction | null, selectedRecipe: { id: string; name: string } | null) {
  if (!prediction) {
    localStorage.removeItem(PREDICTION_STORAGE_KEY);
    return;
  }
  try {
    localStorage.setItem(PREDICTION_STORAGE_KEY, JSON.stringify({
      prediction,
      counterPrediction,
      selectedRecipe,
      timestamp: Date.now(),
    }));
  } catch (err) {
    console.error('Failed to save prediction to storage:', err);
  }
}

function loadPredictionFromStorage(): { prediction: Prediction | null; counterPrediction: CounterPrediction | null; selectedRecipe: { id: string; name: string } | null } {
  try {
    const stored = localStorage.getItem(PREDICTION_STORAGE_KEY);
    if (!stored) return { prediction: null, counterPrediction: null, selectedRecipe: null };
    
    const data = JSON.parse(stored);
    
    // Validate selectedRecipe - if recipe no longer exists, clear it
    let selectedRecipe = data.selectedRecipe || null;
    if (selectedRecipe) {
      const validRecipeIds = getValidRecipeIds();
      if (!isRecipeValid(selectedRecipe.id, validRecipeIds)) {
        console.warn(`Stale recipe ID detected: ${selectedRecipe.id}. Clearing from cache.`);
        selectedRecipe = null;
        // Immediately save the corrected state to prevent repeated warnings
        localStorage.setItem(PREDICTION_STORAGE_KEY, JSON.stringify({
          prediction: data.prediction || null,
          counterPrediction: data.counterPrediction || null,
          selectedRecipe: null,
          timestamp: Date.now(),
        }));
      }
    }
    
    return {
      prediction: data.prediction || null,
      counterPrediction: data.counterPrediction || null,
      selectedRecipe,
    };
  } catch (err) {
    console.error('Failed to load prediction from storage:', err);
    return { prediction: null, counterPrediction: null, selectedRecipe: null };
  }
}

export interface StandardizedEvidence {
  id: string;
  source: string;
  title: string;
  summary: string;
  confidence: number;
  timestamp: number;
  type: string;
  weight?: number;
}

export interface PredictionMetadata {
  createdAt: string;
  modelUsed: string;
  informationSources: string[];
  recipeId?: string;  // Recipe used for this prediction
  recipeName?: string;  // Recipe name for display
}

export interface Prediction {
  id: string;
  question: string;
  predictionType: string;
  prediction: string;
  confidence: number;
  reason: string;
  metadata: PredictionMetadata;
  evidenceList?: StandardizedEvidence[];  // Engine reasoning and evidence
  explanation?: string;  // Human-readable explanation
}

export interface CounterPrediction {
  prediction: string;
  confidence: number;
  reason: string;
}

export interface PredictionState {
  currentPrediction: Prediction | null;
  counterPrediction: CounterPrediction | null;
  selectedModel: string;
  isLoading: boolean;
  error: string | null;
  lastInput: { question: string; predictionType: string } | null;
  selectedRecipe: { id: string; name: string } | null;
}

export interface PredictionContextType {
  state: PredictionState;
  setPrediction: (prediction: Prediction) => void;
  setCounterPrediction: (counterPrediction: CounterPrediction) => void;
  setSelectedModel: (model: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastInput: (input: { question: string; predictionType: string }) => void;
  retryPrediction: () => Promise<void>;
  clearPrediction: () => void;
  setSelectedRecipe: (recipe: { id: string; name: string } | null) => void;
  updateRecipeCache: (recipeIds: string[]) => void;
  clearStaleRecipeSelection: () => void;
}

const initialState: PredictionState = {
  currentPrediction: null,
  counterPrediction: null,
  selectedModel: 'default',
  isLoading: false,
  error: null,
  lastInput: null,
  selectedRecipe: null,
};

export const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PredictionState>(() => {
    const { prediction, counterPrediction, selectedRecipe } = loadPredictionFromStorage();
    return {
      ...initialState,
      currentPrediction: prediction,
      counterPrediction,
      selectedRecipe,
    };
  });

  // Save to storage whenever prediction, counterPrediction, or selectedRecipe changes
  useEffect(() => {
    savePredictionToStorage(state.currentPrediction, state.counterPrediction, state.selectedRecipe);
  }, [state.currentPrediction, state.counterPrediction, state.selectedRecipe]);

  const setPrediction = (prediction: Prediction) => {
    setState((prev) => ({ ...prev, currentPrediction: prediction }));
  };

  const setCounterPrediction = (counterPrediction: CounterPrediction) => {
    setState((prev) => ({ ...prev, counterPrediction }));
  };

  const setLastInput = (input: { question: string; predictionType: string }) => {
    setState((prev) => ({ ...prev, lastInput: input }));
  };

  const retryPrediction = async () => {
    if (!state.lastInput) return;
    // This will be implemented by the component using the context
    // The component will call generatePrediction with the lastInput
  };

  const setSelectedModel = (model: string) => {
    setState((prev) => ({ ...prev, selectedModel: model }));
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const clearPrediction = () => {
    setState(initialState);
  };

  const setSelectedRecipe = (recipe: { id: string; name: string } | null) => {
    setState((prev) => ({ ...prev, selectedRecipe: recipe }));
  };

  const updateRecipeCache = (recipeIds: string[]) => {
    updateRecipeValidationCache(recipeIds);
  };

  const clearStaleRecipeSelection = () => {
    const validRecipeIds = getValidRecipeIds();
    if (state.selectedRecipe && !isRecipeValid(state.selectedRecipe.id, validRecipeIds)) {
      console.warn(`Selected recipe ${state.selectedRecipe.id} is no longer valid. Clearing selection.`);
      setSelectedRecipe(null);
    }
  };

  const value: PredictionContextType = {
    state,
    setPrediction,
    setCounterPrediction,
    setSelectedModel,
    setLoading,
    setError,
    setLastInput,
    retryPrediction,
    clearPrediction,
    setSelectedRecipe,
    updateRecipeCache,
    clearStaleRecipeSelection,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};
