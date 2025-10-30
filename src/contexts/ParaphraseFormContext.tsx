'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useParaphraseForm } from '@/hooks/useParaphraseForm';
import { useFormUIStates } from '@/hooks/useFormUIStates';
import { useFormHandlers } from '@/hooks/useFormHandlers';

// Define the context type
type ParaphraseFormContextType = ReturnType<typeof useParaphraseFormContext>;

// Create context
const ParaphraseFormContext = createContext<ParaphraseFormContextType | null>(null);

// Custom hook that combines all form logic
function useParaphraseFormContext() {
  const formLogic = useParaphraseForm();
  const uiStates = useFormUIStates();
  const handlers = useFormHandlers({
    updateFormData: formLogic.updateFormData,
    setValidationErrors: formLogic.setValidationErrors,
    setFormCollapsedStates: uiStates.setFormCollapsedStates,
    setFormVisibilityStates: uiStates.setFormVisibilityStates,
    goToNextStep: formLogic.goToNextStep
  });

  return {
    // Form data
    formData: formLogic.formData,
    validationErrors: formLogic.validationErrors,
    originalParagraphs: formLogic.originalParagraphs,
    paraphrasedParagraphs: formLogic.paraphrasedParagraphs,
    isLoading: formLogic.isLoading,
    mainError: formLogic.mainError,
    currentStep: formLogic.currentStep,
    
    // UI states
    formVisibilityStates: uiStates.formVisibilityStates,
    formCollapsedStates: uiStates.formCollapsedStates,
    
    // Functions
    updateFormData: formLogic.updateFormData,
    clearFormData: formLogic.clearFormData,
    getFilledStatus: formLogic.getFilledStatus,
    handleMainSubmit: formLogic.handleMainSubmit,
    goToNextStep: formLogic.goToNextStep,
    goToStep: formLogic.goToStep,
    handleCollapseChange: uiStates.handleCollapseChange,
    
    // Form handlers
    handleContextSubmit: handlers.handleContextSubmit,
    handleSystemSubmit: handlers.handleSystemSubmit,
    handleMustHaveSubmit: handlers.handleMustHaveSubmit,
    handleContentSubmit: handlers.handleContentSubmit
  };
}

// Provider component
export function ParaphraseFormProvider({ children }: { children: ReactNode }) {
  const value = useParaphraseFormContext();
  
  return (
    <ParaphraseFormContext.Provider value={value}>
      {children}
    </ParaphraseFormContext.Provider>
  );
}

// Consumer hook
export function useParaphraseFormState() {
  const context = useContext(ParaphraseFormContext);
  if (!context) {
    throw new Error('useParaphraseFormState must be used within ParaphraseFormProvider');
  }
  return context;
}

