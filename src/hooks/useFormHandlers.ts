'use client';

import { useCallback } from 'react';

interface FormData {
  name: string;
  context: string;
  systemSettings: string;
  mustHaveContent: string;
  content: string;
  prompt: string;
}

interface ValidationErrors {
  context: string[];
  system: string[];
  content: string[];
}

interface FormStates {
  context: boolean;
  system: boolean;
  mustHave: boolean;
  content: boolean;
}

interface UseFormHandlersProps {
  updateFormData: (data: Partial<FormData>) => void;
  setValidationErrors: (errors: ValidationErrors | ((prev: ValidationErrors) => ValidationErrors)) => void;
  setFormCollapsedStates: (states: FormStates | ((prev: FormStates) => FormStates)) => void;
  setFormVisibilityStates: (states: FormStates | ((prev: FormStates) => FormStates)) => void;
  goToNextStep: () => void;
}

export function useFormHandlers({
  updateFormData,
  setValidationErrors,
  setFormCollapsedStates,
  setFormVisibilityStates,
  goToNextStep
}: UseFormHandlersProps) {
  
  const handleContextSubmit = useCallback((data: { name: string; context: string }) => {
    // Validate the submitted data directly
    const errors: string[] = [];
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.context.trim()) errors.push('Context is required');
    setValidationErrors(prev => ({ ...prev, context: errors }));
    
    if (errors.length === 0) {
      updateFormData(data);
      // Collapse the context form and show the next form
      setFormCollapsedStates(prev => ({ ...prev, context: true }));
      setFormVisibilityStates(prev => ({ ...prev, system: true }));
      goToNextStep();
    }
  }, [updateFormData, setValidationErrors, setFormCollapsedStates, setFormVisibilityStates, goToNextStep]);

  const handleSystemSubmit = useCallback((data: { systemSettings: string; prompt: string }) => {
    // Validate the submitted data directly
    const errors: string[] = [];
    if (!data.systemSettings.trim()) errors.push('System settings are required');
    setValidationErrors(prev => ({ ...prev, system: errors }));
    
    if (errors.length === 0) {
      updateFormData(data);
      // Show the next form but don't collapse the system form
      setFormVisibilityStates(prev => ({ ...prev, mustHave: true }));
      goToNextStep();
    }
  }, [updateFormData, setValidationErrors, setFormVisibilityStates, goToNextStep]);

  const handleMustHaveSubmit = useCallback((data: { mustHaveContent: string }) => {
    updateFormData(data);
    // Collapse the mustHave form and show the next form
    setFormCollapsedStates(prev => ({ ...prev, mustHave: true }));
    setFormVisibilityStates(prev => ({ ...prev, content: true }));
    goToNextStep();
  }, [updateFormData, setFormCollapsedStates, setFormVisibilityStates, goToNextStep]);

  const handleContentSubmit = useCallback((data: { content: string }) => {
    // Validate the submitted data directly
    const errors: string[] = [];
    if (!data.content.trim()) errors.push('Content to paraphrase is required');
    setValidationErrors(prev => ({ ...prev, content: errors }));
    
    if (errors.length === 0) {
      updateFormData(data);
      // Collapse the content form
      setFormCollapsedStates(prev => ({ ...prev, content: true }));
      goToNextStep();
    }
  }, [updateFormData, setValidationErrors, setFormCollapsedStates, goToNextStep]);

  return {
    handleContextSubmit,
    handleSystemSubmit,
    handleMustHaveSubmit,
    handleContentSubmit
  };
}

