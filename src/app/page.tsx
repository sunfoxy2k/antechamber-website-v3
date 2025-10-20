'use client';

import { useState } from 'react';
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
    goToNextStep
  } = useParaphraseForm();

  // State for managing form collapsed states
  const [formCollapsedStates, setFormCollapsedStates] = useState({
    context: false,
    system: false,
    mustHave: false,
    content: false
  });

  const filledStatus = getFilledStatus();

  // Form submit handlers
  const handleContextSubmit = (data: { name: string; context: string }) => {
    updateFormData(data);
    if (validateContext()) {
      // Collapse the context form and move to next step
      setFormCollapsedStates(prev => ({ ...prev, context: true }));
      goToNextStep();
    }
  };

  const handleSystemSubmit = (data: { systemSettings: string }) => {
    updateFormData(data);
    if (validateSystem()) {
      // Collapse the system form and move to next step
      setFormCollapsedStates(prev => ({ ...prev, system: true }));
      goToNextStep();
    }
  };

  const handleMustHaveSubmit = (data: { mustHaveContent: string }) => {
    updateFormData(data);
    // Collapse the mustHave form and move to next step
    setFormCollapsedStates(prev => ({ ...prev, mustHave: true }));
    goToNextStep();
  };

  const handleContentSubmit = (data: { content: string }) => {
    updateFormData(data);
    if (validateContent()) {
      // Collapse the content form and move to next step
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
            <ContextForm
              data={{ name: formData.name, context: formData.context }}
              onSubmit={handleContextSubmit}
              isFilled={filledStatus.context}
              errors={validationErrors.context}
              onNext={goToNextStep}
              isCollapsed={formCollapsedStates.context}
              onCollapseChange={handleCollapseChange('context')}
            />

            <SystemSettingsForm
              data={{ systemSettings: formData.systemSettings }}
              onSubmit={handleSystemSubmit}
              isFilled={filledStatus.system}
              errors={validationErrors.system}
              onNext={goToNextStep}
              isCollapsed={formCollapsedStates.system}
              onCollapseChange={handleCollapseChange('system')}
            />

            <MustHaveContentForm
              data={{ mustHaveContent: formData.mustHaveContent }}
              onSubmit={handleMustHaveSubmit}
              isFilled={filledStatus.mustHave}
              onNext={goToNextStep}
              isCollapsed={formCollapsedStates.mustHave}
              onCollapseChange={handleCollapseChange('mustHave')}
            />

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
          </div>
        </div>
      </div>
    </div>
  );
}