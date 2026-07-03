import { useContext } from 'react';
import { DiaryContext, DiaryContextType } from '@/contexts/DiaryContext';

export const useDiary = (): DiaryContextType => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within DiaryProvider');
  }
  return context;
};
