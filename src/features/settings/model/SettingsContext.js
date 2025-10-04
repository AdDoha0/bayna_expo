import React, { createContext, useContext } from 'react';
import { useSettingsState } from './useSettingsState';

/**
 * Settings Context - provides global settings state to entire app
 */
const SettingsContext = createContext(null);

/**
 * Settings Provider - wraps app and provides settings state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function SettingsProvider({ children }) {
  const value = useSettingsState();
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Settings Consumer Hook - access settings from any component
 * @returns {Object} Settings state and actions
 * @throws {Error} If used outside SettingsProvider
 */
export function useSettings() {
  const context = useContext(SettingsContext);
  
  if (!context) {
    throw new Error(
      'useSettings must be used within <SettingsProvider>. ' +
      'Wrap your app with <SettingsProvider> in App.js'
    );
  }
  
  return context;
}

