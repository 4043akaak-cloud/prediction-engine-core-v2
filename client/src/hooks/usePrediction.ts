import { useContext } from 'react';
import { PredictionContext, PredictionContextType } from '@/contexts/PredictionContext';

export const usePrediction = (): PredictionContextType => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within PredictionProvider');
  }
  return context;
};
