'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { CollapsibleBox } from '@/components/CollapsibleBox';
import { SubmitButton } from '@/components/SubmitButton';
import { FormData } from '@/types/form';
import { useParaphraseFormState } from '@/contexts/ParaphraseFormContext';

export function MustHaveContentForm() {
  const {
    formData,
    formCollapsedStates,
    handleMustHaveSubmit,
    handleCollapseChange,
    goToNextStep,
    getFilledStatus
  } = useParaphraseFormState();

  const data = { mustHaveContent: formData.mustHaveContent };
  const isCollapsed = formCollapsedStates.mustHave;
  const isFilled = getFilledStatus().mustHave;

  const { register, handleSubmit, watch } = useForm({
    defaultValues: data
  });
  
  const [showSubmitButton, setShowSubmitButton] = useState(true); // Show by default for empty form
  const watchedValues = watch();

  // Show submit button when form is empty or has changes
  useEffect(() => {
    const hasChanges = watchedValues.mustHaveContent !== data.mustHaveContent;
    const isEmpty = !watchedValues.mustHaveContent?.trim();
    setShowSubmitButton(hasChanges || isEmpty);
  }, [watchedValues, data]);

  const handleFormSubmit = (formData: Pick<FormData, 'mustHaveContent'>) => {
    handleMustHaveSubmit(formData);
    goToNextStep();
  };

  return (
    <CollapsibleBox 
      title="Must Have Content" 
      isFilled={isFilled}
      isCollapsed={isCollapsed}
      onCollapseChange={handleCollapseChange('mustHave')}
    >
      <div className="p-4">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <label htmlFor="mustHaveContent" className="block text-sm font-medium text-gray-700 mb-2">
            Content that must be included
          </label>
          <textarea
            {...register('mustHaveContent')}
            id="mustHaveContent"
            placeholder="Enter content that must be included (optional)..."
            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
          
          <SubmitButton 
            onSubmit={handleSubmit(handleFormSubmit)} 
            variant="subtle" 
            show={showSubmitButton}
            className="mt-4"
          >
            Save Must Have Content
          </SubmitButton>
        </form>
      </div>
    </CollapsibleBox>
  );
}
