import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

const PREDICTION_STORAGE_KEY = 'pec-prediction-result';
const RECIPE_VALIDATION_KEY = 'pec-recipe-validation-cache';

// ============================================================================
// STATE LIFECYCLE TRACING
// ============================================================================

interface StateTransition {
  timestamp: number;
  previousValue: any;
  nextValue: any;
  caller: string;
  file: string;
  line: number;
  stackTrace: string;
}

const stateTransitions: StateTransition[] = [];

function captureStackTrace(): string {
  const stack = new Error().stack || '';
  const lines = stack.split('\n');
  // Return lines 3-6 to skip Error, captureStackTrace, and the immediate caller
  return lines.slice(3, 7).join('\n');
}

function getCallerInfo(): { file: string; line: number; caller: string } {
  const stack = new Error().stack || '';
  const lines = stack.split('\n');
  const callerLine = lines[3] || '';
  
  // Extract file and line from stack trace
  const match = callerLine.match(/\(([^:]+):(\d+):\d+\)|at ([^:]+):(\d+):/);
  if (match) {
    const file = match[1] || match[3] || 'unknown';
    const line = parseInt(match[2] || match[4] || '0');
    const caller = callerLine.match(/at\s+(\w+)/)?.[1] || 'unknown';
    return { file: file.split('/').pop() || file, line, caller };
  }
  return { file: 'unknown', line: 0, caller: 'unknown' };
}

function logStateTransition(previousValue: any, nextValue: any, context: string) {
  const { file, line, caller } = getCallerInfo();
  const transition: StateTransition = {
    timestamp: Date.now(),
    previousValue,
    nextValue,
    caller,
    file,
    line,
    stackTrace: captureStackTrace(),
  };
  
  stateTransitions.push(transition);
  
  console.log(`[StateTrace] ${context}`, {
    timestamp: new Date(transition.timestamp).toISOString(),
    previousValue: JSON.stringify(previousValue).substring(0, 100),
    nextValue: JSON.stringify(nextValue).substring(0, 100),
    caller: `${file}:${line} in ${caller}`,
  });
  
  if (!nextValue && previousValue) {
    console.error(`[StateTrace] CRITICAL: State cleared from valid to null!`, {
      wasValid: !!previousValue,
      nowNull: !nextValue,
      caller: `${file}:${line}`,
      stackTrace: transition.stackTrace,
    });
  }
}

// Export for debugging
(window as any).__predictionStateTransitions = stateTransitions;

// ============================================================================
// RECIPE VALIDATION
// ============================================================================

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

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

function savePredictionToStorage(prediction: Prediction | null, counterPrediction: CounterPrediction | null, selectedRecipe: { id: string; name: string } | null) {
  if (!prediction) {
    console.log('[Storage] Removing prediction from storage (prediction is null)');
    console.trace('Stack trace for prediction removal');
    localStorage.removeItem(PREDICTION_STORAGE_KEY);
    return;
  }
  try {
    console.log('[Storage] Saving prediction to localStorage:', prediction);
    localStorage.setItem(PREDICTION_STORAGE_KEY, JSON.stringify({
      prediction,
      counterPrediction,
      selectedRecipe,
      timestamp: Date.now(),
    }));
    console.log('[Storage] Successfully saved to localStorage');
  } catch (err) {
    console.error('Failed to save prediction to storage:', err);
  }
}

function loadPredictionFromStorage(): { prediction: Prediction | null; counterPrediction: CounterPrediction | null; selectedRecipe: { id: string; name: string } | null } {
  try {
    const stored = localStorage.getItem(PREDICTION_STORAGE_KEY);
    console.log('[Storage] Loading from localStorage:', stored ? 'Found' : 'Not found');
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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const PredictionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PredictionState>(() => {
    const { prediction, counterPrediction, selectedRecipe } = loadPredictionFromStorage();
    const initializedState = {
      ...initialState,
      currentPrediction: prediction,
      counterPrediction,
      selectedRecipe,
    };
    console.log('[PredictionProvider] Initialized state from localStorage:', initializedState);
    return initializedState;
  });

  // Save to storage whenever prediction, counterPrediction, or selectedRecipe changes
  useEffect(() => {
    if (!state.currentPrediction) {
      console.log('[PredictionContext] WARNING: currentPrediction is null! Clearing storage.');
      console.trace('Stack trace for prediction clear');
    }
    console.log('[PredictionContext] Saving to storage:', { prediction: state.currentPrediction, counterPrediction: state.counterPrediction });
    savePredictionToStorage(state.currentPrediction, state.counterPrediction, state.selectedRecipe);
  }, [state.currentPrediction, state.counterPrediction, state.selectedRecipe]);

  const setPrediction = (prediction: Prediction) => {
    console.log('[PredictionContext] setPrediction called with:', prediction);
    setState((prev) => {
      logStateTransition(prev.currentPrediction, prediction, 'setPrediction');
      return { ...prev, currentPrediction: prediction };
    });
  };

  const setCounterPrediction = (counterPrediction: CounterPrediction) => {
    setState((prev) => {
      logStateTransition(prev.counterPrediction, counterPrediction, 'setCounterPrediction');
      return { ...prev, counterPrediction };
    });
  };

  const setLastInput = (input: { question: string; predictionType: string }) => {
    setState((prev) => {
      logStateTransition(prev.lastInput, input, 'setLastInput');
      return { ...prev, lastInput: input };
    });
  };

  const retryPrediction = async () => {
    if (!state.lastInput) return;
    // This will be implemented by the component using the context
    // The component will call generatePrediction with the lastInput
  };

  const setSelectedModel = (model: string) => {
    setState((prev) => {
      logStateTransition(prev.selectedModel, model, 'setSelectedModel');
      return { ...prev, selectedModel: model };
    });
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => {
      logStateTransition(prev.isLoading, loading, 'setLoading');
      return { ...prev, isLoading: loading };
    });
  };

  const setError = (error: string | null) => {
    setState((prev) => {
      logStateTransition(prev.error, error, 'setError');
      return { ...prev, error };
    });
  };

  const clearPrediction = () => {
    console.log('[PredictionContext] clearPrediction called');
    setState((prev) => {
      logStateTransition(prev.currentPrediction, null, 'clearPrediction');
      return initialState;
    });
  };

  const setSelectedRecipe = (recipe: { id: string; name: string } | null) => {
    setState((prev) => {
      logStateTransition(prev.selectedRecipe, recipe, 'setSelectedRecipe');
      return { ...prev, selectedRecipe: recipe };
    });
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

export const usePredictionDebug = () => {
  return (window as any).__predictionStateTransitions || [];
};
