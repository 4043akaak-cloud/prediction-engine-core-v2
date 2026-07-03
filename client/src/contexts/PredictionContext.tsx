import React, { createContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';

const PREDICTION_STORAGE_KEY = 'pec-prediction-result';

function savePredictionToStorage(prediction: Prediction | null, counterPrediction: CounterPrediction | null) {
  if (!prediction) {
    localStorage.removeItem(PREDICTION_STORAGE_KEY);
    return;
  }
  try {
    localStorage.setItem(PREDICTION_STORAGE_KEY, JSON.stringify({
      prediction,
      counterPrediction,
      timestamp: Date.now(),
    }));
  } catch (err) {
    console.error('Failed to save prediction to storage:', err);
  }
}

function loadPredictionFromStorage(): { prediction: Prediction | null; counterPrediction: CounterPrediction | null } {
  try {
    const stored = localStorage.getItem(PREDICTION_STORAGE_KEY);
    if (!stored) return { prediction: null, counterPrediction: null };
    
    const data = JSON.parse(stored);
    return {
      prediction: data.prediction || null,
      counterPrediction: data.counterPrediction || null,
    };
  } catch (err) {
    console.error('Failed to load prediction from storage:', err);
    return { prediction: null, counterPrediction: null };
  }
}

export interface PredictionMetadata {
  createdAt: string;
  modelUsed: string;
  informationSources: string[];
  recipeId?: string;  // Recipe used for this prediction
}

export interface Prediction {
  id: string;
  question: string;
  predictionType: string;
  prediction: string;
  confidence: number;
  reason: string;
  metadata: PredictionMetadata;
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
}

const initialState: PredictionState = {
  currentPrediction: null,
  counterPrediction: null,
  selectedModel: 'default',
  isLoading: false,
  error: null,
  lastInput: null,
};

export const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PredictionState>(() => {
    const { prediction, counterPrediction } = loadPredictionFromStorage();
    return {
      ...initialState,
      currentPrediction: prediction,
      counterPrediction,
    };
  });

  // Save to storage whenever prediction or counterPrediction changes
  useEffect(() => {
    savePredictionToStorage(state.currentPrediction, state.counterPrediction);
  }, [state.currentPrediction, state.counterPrediction]);

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
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};
