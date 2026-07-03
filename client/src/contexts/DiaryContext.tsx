import React, { createContext, useState, ReactNode } from 'react';

export interface DiaryEntry {
  id: string;
  question: string;
  prediction: string;
  confidence: number;
  timestamp: string;
  predictionType: string;
}

export interface DiaryState {
  entries: DiaryEntry[];
  selectedEntry: DiaryEntry | null;
  draft: string | null;
  isSaved: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface DiaryContextType {
  state: DiaryState;
  addEntry: (entry: DiaryEntry) => void;
  removeEntry: (id: string) => void;
  selectEntry: (id: string) => void;
  setDraft: (draft: string | null) => void;
  setSaved: (saved: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearDiary: () => void;
}

const initialState: DiaryState = {
  entries: [],
  selectedEntry: null,
  draft: null,
  isSaved: true,
  isLoading: false,
  error: null,
};

export const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DiaryState>(initialState);

  const addEntry = (entry: DiaryEntry) => {
    setState((prev) => ({
      ...prev,
      entries: [entry, ...prev.entries],
      isSaved: false,
    }));
  };

  const removeEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      entries: prev.entries.filter((e) => e.id !== id),
      isSaved: false,
    }));
  };

  const selectEntry = (id: string) => {
    const entry = state.entries.find((e) => e.id === id) || null;
    setState((prev) => ({ ...prev, selectedEntry: entry }));
  };

  const setDraft = (draft: string | null) => {
    setState((prev) => ({ ...prev, draft, isSaved: false }));
  };

  const setSaved = (saved: boolean) => {
    setState((prev) => ({ ...prev, isSaved: saved }));
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const clearDiary = () => {
    setState(initialState);
  };

  const value: DiaryContextType = {
    state,
    addEntry,
    removeEntry,
    selectEntry,
    setDraft,
    setSaved,
    setLoading,
    setError,
    clearDiary,
  };

  return (
    <DiaryContext.Provider value={value}>
      {children}
    </DiaryContext.Provider>
  );
};
