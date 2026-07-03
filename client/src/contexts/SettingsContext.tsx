import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Settings Context
 * Manages all user settings for the Prediction Engine Core
 * Designed to be easily migrated from LocalStorage → Backend → User Account
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface PredictionSettings {
  // Placeholder for future settings
  // - Default Prediction Category
  // - Default Confidence Display
  // - Prediction History
  // - Recipe Preference
}

export interface NotificationSettings {
  // Placeholder for future notification types
  // - Outcome Reminder
  // - Learning Report
  // - Prediction Complete
  enabled: boolean;
}

export interface AppearanceSettings {
  theme: ThemeMode;
}

export interface UserSettings {
  prediction: PredictionSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
}

const DEFAULT_SETTINGS: UserSettings = {
  prediction: {},
  notifications: {
    enabled: true,
  },
  appearance: {
    theme: 'light',
  },
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  updateTheme: (theme: ThemeMode) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Try to load from LocalStorage
    try {
      const stored = localStorage.getItem('pec-settings');
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Persist to LocalStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem('pec-settings', JSON.stringify(settings));
    } catch {
      console.error('Failed to save settings to LocalStorage');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const updateTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme,
      },
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateTheme,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
