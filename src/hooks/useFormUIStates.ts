'use client';

import { useLocalStorage } from './useLocalStorage';

interface FormStates {
  context: boolean;
  system: boolean;
  mustHave: boolean;
  content: boolean;
}

export function useFormUIStates() {
  // Form visibility states
  const [formVisibilityStates, setFormVisibilityStates] = useLocalStorage<FormStates>(
    'paraphrase-form-visibility',
    {
      context: true, // Show context form by default
      system: false,
      mustHave: false,
      content: false
    }
  );

  // Form collapsed states
  const [formCollapsedStates, setFormCollapsedStates] = useLocalStorage<FormStates>(
    'paraphrase-form-collapsed',
    {
      context: false,
      system: false,
      mustHave: false,
      content: false
    }
  );

  // Handler for form collapse state changes
  const handleCollapseChange = (formName: keyof FormStates) => (collapsed: boolean) => {
    setFormCollapsedStates(prev => ({ ...prev, [formName]: collapsed }));
  };

  return {
    formVisibilityStates,
    setFormVisibilityStates,
    formCollapsedStates,
    setFormCollapsedStates,
    handleCollapseChange
  };
}

