'use client';

import { useForm } from 'react-hook-form';
import { CollapsibleBox } from '@/components/CollapsibleBox';
import { SubmitButton } from '@/components/SubmitButton';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { FormData } from '@/types/form';

interface SystemSettingsFormProps {
  data: Pick<FormData, 'systemSettings'>;
  onSubmit: (data: Pick<FormData, 'systemSettings'>) => void;
  isFilled: boolean;
  errors: string[];
  onNext?: () => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function SystemSettingsForm({ data, onSubmit, isFilled, errors, onNext, isCollapsed, onCollapseChange }: SystemSettingsFormProps) {
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm({
    defaultValues: data
  });

  const handleFormSubmit = (formData: Pick<FormData, 'systemSettings'>) => {
    onSubmit(formData);
    if (onNext) {
      onNext();
    }
  };

  return (
    <CollapsibleBox 
      title="System Settings" 
      isFilled={isFilled}
      isCollapsed={isCollapsed}
      onCollapseChange={onCollapseChange}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4">
        <label htmlFor="systemSettings" className="block text-sm font-medium text-gray-700 mb-2">
          System Configuration <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('systemSettings', { required: 'System settings are required' })}
          id="systemSettings"
          placeholder="Enter system settings and configuration..."
          className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
        {formErrors.systemSettings && (
          <p className="mt-1 text-sm text-red-600">{formErrors.systemSettings.message}</p>
        )}
        
        <ErrorDisplay errors={errors} className="mt-3" />
        
        <SubmitButton onSubmit={handleSubmit(handleFormSubmit)} variant="sm" className="w-full mt-4">
          Save System Settings
        </SubmitButton>
      </form>
    </CollapsibleBox>
  );
}
