import React, { createContext, useState, ReactNode } from 'react';

export interface UIState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  error: string | null;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
}

export interface UIContextType {
  state: UIState;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  clearNotification: () => void;
}

const initialState: UIState = {
  theme: 'light',
  isLoading: false,
  error: null,
  notification: null,
};

export const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UIState>(initialState);

  const setTheme = (theme: 'light' | 'dark') => {
    setState((prev) => ({ ...prev, theme }));
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setState((prev) => ({
      ...prev,
      notification: { message, type },
    }));
  };

  const clearNotification = () => {
    setState((prev) => ({ ...prev, notification: null }));
  };

  const value: UIContextType = {
    state,
    setTheme,
    setLoading,
    setError,
    showNotification,
    clearNotification,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

