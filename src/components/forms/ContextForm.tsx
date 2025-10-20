'use client';

import { useForm } from 'react-hook-form';
import { CollapsibleBox } from '@/components/CollapsibleBox';
import { SubmitButton } from '@/components/SubmitButton';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { FormData } from '@/types/form';

interface ContextFormProps {
  data: Pick<FormData, 'name' | 'context'>;
  onSubmit: (data: Pick<FormData, 'name' | 'context'>) => void;
  isFilled: boolean;
  errors: string[];
  onNext?: () => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function ContextForm({ data, onSubmit, isFilled, errors, onNext, isCollapsed, onCollapseChange }: ContextFormProps) {
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm({
    defaultValues: data
  });

  const handleFormSubmit = (formData: Pick<FormData, 'name' | 'context'>) => {
    onSubmit(formData);
    if (onNext) {
      onNext();
    }
  };

  return (
    <CollapsibleBox 
      title="Context" 
      isFilled={isFilled}
      isCollapsed={isCollapsed}
      onCollapseChange={onCollapseChange}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            id="name"
            placeholder="Enter name..."
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
            Context <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('context', { required: 'Context is required' })}
            id="context"
            placeholder="Enter context..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
          {formErrors.context && (
            <p className="mt-1 text-sm text-red-600">{formErrors.context.message}</p>
          )}
        </div>
        
        <ErrorDisplay errors={errors} />
        
        <SubmitButton onSubmit={handleSubmit(handleFormSubmit)} variant="sm" className="w-full">
          Save Context
        </SubmitButton>
      </form>
    </CollapsibleBox>
  );
}
