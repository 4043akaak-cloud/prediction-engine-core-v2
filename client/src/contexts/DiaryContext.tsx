import React, { createContext, useState, ReactNode } from 'react';
import type { PredictionRecipe } from '@shared/recipes';

/**
 * Prediction Lifecycle Types
 * Supports the full lifecycle: Prediction → Outcome → Evaluation → Archive
 */

export type OutcomeType = 'occurred' | 'did_not_occur' | 'partially_occurred' | 'unknown';
export type EvaluationType = 'correct' | 'partially_correct' | 'incorrect';
export type PredictionStatus = 'pending' | 'resolved' | 'archived';

/**
 * Prediction Recipe Usage
 * Supports multiple recipes per prediction for future Learning Engine analysis
 * Currently uses 1 recipe, but structure supports multiple recipes
 */
export interface PredictionRecipeUsage {
  recipeIds: string[];  // Array of recipe IDs used in this prediction
  selectedRecipeNames?: string[];  // User-facing display names
}

export interface PredictionLifecycle {
  status: PredictionStatus;
  
  // Notes: メモ（予測全体に対する自由記述）
  notes?: string;
  
  // Outcome: 実際に起きた結果
  outcome?: {
    type: OutcomeType;
    timestamp: string;
  };
  
  // Evaluation: 予測の正確性評価
  evaluation?: {
    type: EvaluationType;
    timestamp: string;
  };
}

/**
 * LocalStorage key for persisting diary entries
 * This is a separate layer that can be replaced with Backend DB later
 */
const DIARY_STORAGE_KEY = 'pec-diary-entries';

/**
 * Load entries from LocalStorage
 * Returns empty array if no entries found or on error
 */
function loadEntriesFromStorage(): DiaryEntry[] {
  try {
    const stored = localStorage.getItem(DIARY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[DiaryContext] Failed to load entries from storage:', error);
    return [];
  }
}

/**
 * Save entries to LocalStorage
 * Silently fails if storage is unavailable
 */
function saveEntriesToStorage(entries: DiaryEntry[]): void {
  try {
    localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('[DiaryContext] Failed to save entries to storage:', error);
  }
}

export interface DiaryEntry {
  id: string;
  question: string;
  prediction: string;
  confidence: number;
  timestamp: string;
  predictionType: string;
}

export interface DiaryEntryWithLifecycle extends DiaryEntry {
  // Timestamps for lifecycle tracking
  createdAt: string;
  updatedAt: string;
  
  // Model version for future comparison
  modelVersion: string;
  
  // Lifecycle data
  lifecycle: PredictionLifecycle;
}

/**
 * Extended metadata for future Learning/Evaluation/Recipe improvement
 * Currently unused fields are reserved for future functionality
 */
export interface DiaryEntryMetadata {
  // Current fields
  predictionModel?: string;
  recipe?: Array<{ name: string; strength: 'Strong' | 'Medium' | 'Weak' }>;
  ingredients?: Array<{ title: string; description: string }>;
  reasonSummary?: string;
  informationSources?: string[];
  
  // Future fields (Learning/Evaluation)
  userFeedback?: {
    accuracy?: 'correct' | 'incorrect' | 'partial' | null;
    notes?: string;
    timestamp?: string;
  };
  
  actualOutcome?: {
    description?: string;
    timestamp?: string;
    confidence?: number;
  };
  
  evaluationResult?: {
    score?: number;
    feedback?: string;
    timestamp?: string;
  };
}

/**
 * Enhanced DiaryEntry with metadata support
 * Backward compatible with existing entries
 */
export interface DiaryEntryEnhanced extends DiaryEntry {
  metadata?: DiaryEntryMetadata;
  lifecycle?: PredictionLifecycle;
  createdAt?: string;
  updatedAt?: string;
  modelVersion?: string;
  recipeUsage?: PredictionRecipeUsage;
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
  addEntry: (entry: DiaryEntryEnhanced) => void;
  removeEntry: (id: string) => void;
  selectEntry: (id: string) => void;
  setDraft: (draft: string | null) => void;
  setSaved: (saved: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadEntries: () => void;
  clearDiary: () => void;
  updateEntry: (id: string, updates: Partial<DiaryEntryEnhanced>) => void;
}

const initialState: DiaryState = {
  entries: loadEntriesFromStorage(),
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
    setState((prev) => {
      const newEntries = [entry, ...prev.entries];
      saveEntriesToStorage(newEntries);
      return {
        ...prev,
        entries: newEntries,
        isSaved: false,
      };
    });
  };

  const removeEntry = (id: string) => {
    setState((prev) => {
      const newEntries = prev.entries.filter((e) => e.id !== id);
      saveEntriesToStorage(newEntries);
      return {
        ...prev,
        entries: newEntries,
        isSaved: false,
      };
    });
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

  const loadEntries = () => {
    const entries = loadEntriesFromStorage();
    setState((prev) => ({ ...prev, entries }));
  };

  const clearDiary = () => {
    saveEntriesToStorage([]);
    setState(initialState);
  };

  const updateEntry = (id: string, updates: Partial<DiaryEntryEnhanced>) => {
    setState((prev) => {
      const newEntries = prev.entries.map((e) =>
        e.id === id
          ? {
              ...e,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : e
      );
      saveEntriesToStorage(newEntries);
      return {
        ...prev,
        entries: newEntries,
        isSaved: false,
      };
    });
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
    loadEntries,
    clearDiary,
    updateEntry,
  };

  return (
    <DiaryContext.Provider value={value}>
      {children}
    </DiaryContext.Provider>
  );
};
