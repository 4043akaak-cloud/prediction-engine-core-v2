import React, { createContext, useState, ReactNode } from 'react';

export interface PredictionMetadata {
  createdAt: string;
  modelUsed: string;
  informationSources: string[];
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
}

export interface PredictionContextType {
  state: PredictionState;
  setPrediction: (prediction: Prediction) => void;
  setCounterPrediction: (counterPrediction: CounterPrediction) => void;
  setSelectedModel: (model: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPrediction: () => void;
}

const initialState: PredictionState = {
  currentPrediction: null,
  counterPrediction: null,
  selectedModel: 'default',
  isLoading: false,
  error: null,
};

export const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PredictionState>(initialState);

  const setPrediction = (prediction: Prediction) => {
    setState((prev) => ({ ...prev, currentPrediction: prediction }));
  };

  const setCounterPrediction = (counterPrediction: CounterPrediction) => {
    setState((prev) => ({ ...prev, counterPrediction }));
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
    clearPrediction,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};
