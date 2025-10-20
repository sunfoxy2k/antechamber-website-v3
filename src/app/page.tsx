'use client';

import { useState, useEffect } from 'react';
import { ProgressMap } from '@/components/ProgressMap';
import { ContextForm } from '@/components/forms/ContextForm';
import { SystemSettingsForm } from '@/components/forms/SystemSettingsForm';
import { MustHaveContentForm } from '@/components/forms/MustHaveContentForm';
import { ContentForm } from '@/components/forms/ContentForm';
import { useParaphraseForm } from '@/hooks/useParaphraseForm';

export default function Home() {
  const {
    formData,
    validationErrors,
    setValidationErrors,
    originalParagraphs,
    paraphrasedParagraphs,
    isLoading,
    mainError,
    currentStep,
    updateFormData,
    clearFormData,
    getFilledStatus,
    handleMainSubmit,
    validateContext,
    validateSystem,
    validateContent,
    goToNextStep
  } = useParaphraseForm();

  // State for managing form visibility and collapsed states
  const [formVisibilityStates, setFormVisibilityStates] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('paraphrase-form-visibility');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error parsing saved visibility state:', error);
        }
      }
    }
    return {
      context: true, // Show context form by default
      system: false,
      mustHave: false,
      content: false
    };
  });
  
  const [formCollapsedStates, setFormCollapsedStates] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('paraphrase-form-collapsed');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error parsing saved collapsed state:', error);
        }
      }
    }
    return {
      context: false,
      system: false,
      mustHave: false,
      content: false
    };
  });

  const filledStatus = getFilledStatus();

  // Save form visibility states to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('paraphrase-form-visibility', JSON.stringify(formVisibilityStates));
    }
  }, [formVisibilityStates]);

  // Save form collapsed states to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('paraphrase-form-collapsed', JSON.stringify(formCollapsedStates));
    }
  }, [formCollapsedStates]);

  // Form submit handlers
  const handleContextSubmit = (data: { name: string; context: string }) => {
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
  };

  const handleSystemSubmit = (data: { systemSettings: string }) => {
    // Validate the submitted data directly
    const errors: string[] = [];
    if (!data.systemSettings.trim()) errors.push('System settings are required');
    setValidationErrors(prev => ({ ...prev, system: errors }));
    
    if (errors.length === 0) {
      updateFormData(data);
      // Collapse the system form and show the next form
      setFormCollapsedStates(prev => ({ ...prev, system: true }));
      setFormVisibilityStates(prev => ({ ...prev, mustHave: true }));
      goToNextStep();
    }
  };

  const handleMustHaveSubmit = (data: { mustHaveContent: string }) => {
    updateFormData(data);
    // Collapse the mustHave form and show the next form
    setFormCollapsedStates(prev => ({ ...prev, mustHave: true }));
    setFormVisibilityStates(prev => ({ ...prev, content: true }));
    goToNextStep();
  };

  const handleContentSubmit = (data: { content: string }) => {
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
  };

  // Handler for form collapse state changes
  const handleCollapseChange = (formName: keyof typeof formCollapsedStates) => (collapsed: boolean) => {
    setFormCollapsedStates(prev => ({ ...prev, [formName]: collapsed }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Map */}
          <div className="lg:col-span-1">
            <ProgressMap filledStatus={filledStatus} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {formVisibilityStates.context && (
              <ContextForm
                data={{ name: formData.name, context: formData.context }}
                onSubmit={handleContextSubmit}
                isFilled={filledStatus.context}
                errors={validationErrors.context}
                onNext={goToNextStep}
                isCollapsed={formCollapsedStates.context}
                onCollapseChange={handleCollapseChange('context')}
              />
            )}

            {formVisibilityStates.system && (
              <SystemSettingsForm
                data={{ systemSettings: formData.systemSettings }}
                onSubmit={handleSystemSubmit}
                isFilled={filledStatus.system}
                errors={validationErrors.system}
                onNext={goToNextStep}
                isCollapsed={formCollapsedStates.system}
                onCollapseChange={handleCollapseChange('system')}
                name={formData.name}
                context={formData.context}
              />
            )}

            {formVisibilityStates.mustHave && (
              <MustHaveContentForm
                data={{ mustHaveContent: formData.mustHaveContent }}
                onSubmit={handleMustHaveSubmit}
                isFilled={filledStatus.mustHave}
                onNext={goToNextStep}
                isCollapsed={formCollapsedStates.mustHave}
                onCollapseChange={handleCollapseChange('mustHave')}
              />
            )}

            {formVisibilityStates.content && (
              <ContentForm
                data={{ content: formData.content, prompt: formData.prompt }}
                onSubmit={handleContentSubmit}
                onMainSubmit={handleMainSubmit}
                isFilled={filledStatus.content}
                errors={validationErrors.content}
                isLoading={isLoading}
                mainError={mainError || undefined}
                originalParagraphs={originalParagraphs}
                paraphrasedParagraphs={paraphrasedParagraphs}
                isCollapsed={formCollapsedStates.content}
                onCollapseChange={handleCollapseChange('content')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}