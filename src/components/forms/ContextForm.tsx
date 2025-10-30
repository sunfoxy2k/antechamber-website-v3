'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { CollapsibleBox } from '@/components/CollapsibleBox';
import { SubmitButton } from '@/components/SubmitButton';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { FormData } from '@/types/form';
import { useParaphraseFormState } from '@/contexts/ParaphraseFormContext';
import { PersonaSelector } from '@/components/PersonaSelector';

export function ContextForm() {
  const {
    formData,
    validationErrors,
    formCollapsedStates,
    handleContextSubmit,
    handleCollapseChange,
    goToNextStep,
    getFilledStatus
  } = useParaphraseFormState();

  const data = { name: formData.name, context: formData.context };
  const errors = validationErrors.context;
  const isCollapsed = formCollapsedStates.context;
  const isFilled = getFilledStatus().context;

  const { handleSubmit, setValue, watch, formState: { errors: formErrors } } = useForm({
    defaultValues: data
  });
  
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const watchedValues = watch();

  // Show submit button when form is empty or has changes
  useEffect(() => {
    const hasChanges = watchedValues.name !== data.name || watchedValues.context !== data.context;
    const isEmpty = !watchedValues.name?.trim() && !watchedValues.context?.trim();
    setShowSubmitButton(hasChanges || isEmpty);
  }, [watchedValues, data]);

  const handleFormSubmit = (formData: Pick<FormData, 'name' | 'context'>) => {
    handleContextSubmit(formData);
    goToNextStep();
  };

  const handlePersonaSelect = (name: string, context: string) => {
    setValue('name', name, { shouldValidate: true, shouldDirty: true });
    setValue('context', context, { shouldValidate: true, shouldDirty: true });
  };

  // Render selected persona summary when collapsed
  const renderPersonaSummary = () => {
    if (!watchedValues.name || !watchedValues.context) return null;

    return (
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-lg text-indigo-900">{watchedValues.name}</h4>
              <span className="px-2 py-1 bg-indigo-200 text-indigo-800 text-xs font-medium rounded-full">
                Selected
              </span>
            </div>
            <p className="text-sm text-indigo-800 leading-relaxed">{watchedValues.context}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <CollapsibleBox 
      title="Target Audience" 
      isFilled={isFilled}
      isCollapsed={isCollapsed}
      onCollapseChange={handleCollapseChange('context')}
      summary={renderPersonaSummary()}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
        <PersonaSelector
          selectedPersona={
            watchedValues.name && watchedValues.context
              ? { name: watchedValues.name, context: watchedValues.context }
              : undefined
          }
          onPersonaSelect={handlePersonaSelect}
        />
        
        <ErrorDisplay errors={errors} />
        
        <SubmitButton 
          onSubmit={handleSubmit(handleFormSubmit)} 
          variant="subtle" 
          show={showSubmitButton}
        >
          Continue with Selected Persona
        </SubmitButton>
      </form>
    </CollapsibleBox>
  );
}
