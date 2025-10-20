'use client';

import { useState, useCallback } from 'react';
import { FormData, ValidationErrors, FilledStatus } from '@/types/form';

export function useParaphraseForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    context: '',
    systemSettings: '',
    mustHaveContent: '',
    content: '',
    prompt: 'Please paraphrase the following content by rewording and changing word order, but keep all existing nouns and entities exactly the same. Ensure the paraphrased content is suitable for the given context and user. Format the output with each paragraph separated by "========\n[paraphrased content]\n========"'
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    context: [],
    system: [],
    content: []
  });

  const [originalParagraphs, setOriginalParagraphs] = useState<string[]>([]);
  const [paraphrasedParagraphs, setParaphrasedParagraphs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mainError, setMainError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'context' | 'system' | 'mustHave' | 'content'>('context');

  // Validation functions
  const validateContext = useCallback(() => {
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.context.trim()) errors.push('Context is required');
    setValidationErrors(prev => ({ ...prev, context: errors }));
    return errors.length === 0;
  }, [formData.name, formData.context]);

  const validateSystem = useCallback(() => {
    const errors: string[] = [];
    if (!formData.systemSettings.trim()) errors.push('System settings are required');
    setValidationErrors(prev => ({ ...prev, system: errors }));
    return errors.length === 0;
  }, [formData.systemSettings]);

  const validateContent = useCallback(() => {
    const errors: string[] = [];
    if (!formData.content.trim()) errors.push('Content to paraphrase is required');
    setValidationErrors(prev => ({ ...prev, content: errors }));
    return errors.length === 0;
  }, [formData.content]);

  // Update form data
  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Step progression functions
  const goToNextStep = useCallback(() => {
    const steps: Array<'context' | 'system' | 'mustHave' | 'content'> = ['context', 'system', 'mustHave', 'content'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: 'context' | 'system' | 'mustHave' | 'content') => {
    setCurrentStep(step);
  }, []);

  // Get filled status
  const getFilledStatus = useCallback((): FilledStatus => ({
    context: formData.name.trim() !== '' || formData.context.trim() !== '',
    system: formData.systemSettings.trim() !== '',
    mustHave: formData.mustHaveContent.trim() !== '',
    content: formData.content.trim() !== ''
  }), [formData]);

  // Main submit handler
  const handleMainSubmit = useCallback(async () => {
    const contextValid = validateContext();
    const systemValid = validateSystem();
    const contentValid = validateContent();

    if (!contextValid || !systemValid || !contentValid) {
      setMainError('Please fill in all required fields before submitting');
      return;
    }

    setIsLoading(true);
    setMainError(null);

    // Parse original content into paragraphs
    const originalParsed = formData.content
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);
    setOriginalParagraphs(originalParsed);

    try {
      const response = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formData.content.trim(),
          prompt: formData.prompt.trim(),
          name: formData.name.trim(),
          context: formData.context.trim(),
          systemSettings: formData.systemSettings.trim(),
          mustHaveContent: formData.mustHaveContent.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to paraphrase content');
      }

      // Parse the paraphrased content using the separator format
      const paraphrasedContent = data.paragraphs.join('\n');
      const paraphrasedParsed = paraphrasedContent
        .split(/========\s*\n?/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0 && !p.includes('========'));
      
      setParaphrasedParagraphs(paraphrasedParsed);
    } catch (err) {
      setMainError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error paraphrasing content:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateContext, validateSystem, validateContent]);

  return {
    formData,
    validationErrors,
    setValidationErrors,
    originalParagraphs,
    paraphrasedParagraphs,
    isLoading,
    mainError,
    currentStep,
    updateFormData,
    getFilledStatus,
    handleMainSubmit,
    validateContext,
    validateSystem,
    validateContent,
    goToNextStep,
    goToStep
  };
}
