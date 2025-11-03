import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { OnboardingState, Theme, User } from '../types';

interface OnboardingContextType extends OnboardingState {
  nextStep: () => void;
  prevStep: () => void;
  setMapTarget: (target: 'product' | 'organization' | 'codebase') => void;
  addGoal: (goal: string) => void;
  setUserRole: (role: User['role']) => void;
  addConnectedSource: (source: string) => void;
  setSelectedTheme: (theme: Theme) => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>({
    step: 0,
    completed: localStorage.getItem('aira-onboarding-completed') === 'true',
    goals: [],
    connectedSources: [],
  });

  const nextStep = () => {
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setState((prev) => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  };

  const setMapTarget = (target: 'product' | 'organization' | 'codebase') => {
    setState((prev) => ({ ...prev, mapTarget: target }));
  };

  const addGoal = (goal: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals ? [...prev.goals, goal] : [goal],
    }));
  };

  const setUserRole = (role: User['role']) => {
    setState((prev) => ({ ...prev, userRole: role }));
  };

  const addConnectedSource = (source: string) => {
    setState((prev) => ({
      ...prev,
      connectedSources: prev.connectedSources
        ? [...prev.connectedSources, source]
        : [source],
    }));
  };

  const setSelectedTheme = (theme: Theme) => {
    setState((prev) => ({ ...prev, selectedTheme: theme }));
  };

  const completeOnboarding = () => {
    localStorage.setItem('aira-onboarding-completed', 'true');
    setState((prev) => ({ ...prev, completed: true }));
  };

  const skipOnboarding = () => {
    localStorage.setItem('aira-onboarding-completed', 'true');
    setState((prev) => ({ ...prev, completed: true, step: 99 }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        ...state,
        nextStep,
        prevStep,
        setMapTarget,
        addGoal,
        setUserRole,
        addConnectedSource,
        setSelectedTheme,
        completeOnboarding,
        skipOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
