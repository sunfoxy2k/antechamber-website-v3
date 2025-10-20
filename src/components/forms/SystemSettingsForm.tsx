'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
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
  name?: string;
  context?: string;
}

export function SystemSettingsForm({ data, onSubmit, isFilled, errors, onNext, isCollapsed, onCollapseChange, name, context }: SystemSettingsFormProps) {
  const { register, handleSubmit, watch, formState: { errors: formErrors } } = useForm({
    defaultValues: data
  });
  
  const [showSubmitButton, setShowSubmitButton] = useState(true); // Show by default for empty form
  const [deviceInfo, setDeviceInfo] = useState<string>('');
  const [isGeneratingDeviceInfo, setIsGeneratingDeviceInfo] = useState(false);
  const watchedValues = watch();

  // Show submit button when form is empty or has changes
  useEffect(() => {
    const hasChanges = watchedValues.systemSettings !== data.systemSettings;
    const isEmpty = !watchedValues.systemSettings?.trim();
    setShowSubmitButton(hasChanges || isEmpty);
  }, [watchedValues, data]);

  const handleFormSubmit = (formData: Pick<FormData, 'systemSettings'>) => {
    onSubmit(formData);
    if (onNext) {
      onNext();
    }
  };

  const generateDeviceInfo = async () => {
    if (!watchedValues.systemSettings?.trim()) {
      alert('Please enter system settings first');
      return;
    }

    setIsGeneratingDeviceInfo(true);
    try {
      const response = await fetch('/api/generate-device-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemSettings: watchedValues.systemSettings,
          name: name || '',
          context: context || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate device information');
      }

      const result = await response.json();
      setDeviceInfo(result.deviceInfo);
    } catch (error) {
      console.error('Error generating device info:', error);
      alert('Failed to generate device information');
    } finally {
      setIsGeneratingDeviceInfo(false);
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
        
        {/* Device Information Generation */}
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={generateDeviceInfo}
            disabled={isGeneratingDeviceInfo || !watchedValues.systemSettings?.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGeneratingDeviceInfo ? 'Generating...' : 'Generate Device Info'}
          </button>
          
          {deviceInfo && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Device Information:</h4>
              <p className="text-sm text-gray-600">{deviceInfo}</p>
            </div>
          )}
        </div>
        
        <SubmitButton 
          onSubmit={handleSubmit(handleFormSubmit)} 
          variant="subtle" 
          show={showSubmitButton}
          className="mt-4"
        >
          Save System Settings
        </SubmitButton>
      </form>
    </CollapsibleBox>
  );
}
