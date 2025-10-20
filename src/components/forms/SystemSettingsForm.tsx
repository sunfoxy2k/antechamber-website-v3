'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { CollapsibleBox } from '@/components/CollapsibleBox';
import { SubmitButton } from '@/components/SubmitButton';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { FormData } from '@/types/form';

interface SystemSettingsFormProps {
  data: Pick<FormData, 'systemSettings'>;
  onSubmit: (data: Pick<FormData, 'systemSettings' | 'prompt'>) => void;
  isFilled: boolean;
  errors: string[];
  onNext?: () => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  name?: string;
  context?: string;
}

export function SystemSettingsForm({ data, onSubmit, isFilled, errors, onNext, isCollapsed, onCollapseChange, name, context }: SystemSettingsFormProps) {
  const defaultPrompt = 'pick 5 information of this, must include long and lat, write nature language, to let the model know this is the current information about the current user device\n\nuse nature language, this is a system prompt guide, no dash';
  
  const { register, handleSubmit, watch, formState: { errors: formErrors } } = useForm({
    defaultValues: {
      systemSettings: data.systemSettings,
      prompt: defaultPrompt
    }
  });
  
  const [showSubmitButton, setShowSubmitButton] = useState(true); // Show by default for empty form
  const [deviceInfo, setDeviceInfo] = useState<string>('');
  const [isGeneratingDeviceInfo, setIsGeneratingDeviceInfo] = useState(false);
  const watchedValues = watch();

  // Show submit button when form is empty or has changes
  useEffect(() => {
    const hasSystemChanges = watchedValues.systemSettings !== data.systemSettings;
    const hasPromptChanges = watchedValues.prompt !== defaultPrompt;
    const isEmpty = !watchedValues.systemSettings?.trim();
    setShowSubmitButton(hasSystemChanges || hasPromptChanges || isEmpty);
  }, [watchedValues, data, defaultPrompt]);

  const handleFormSubmit = async (formData: Pick<FormData, 'systemSettings' | 'prompt'>) => {
    // Use default device info prompt if custom prompt is empty
    const dataToSubmit = {
      ...formData,
      prompt: formData.prompt?.trim() || defaultPrompt
    };

    // Generate device info after saving
    setIsGeneratingDeviceInfo(true);
    try {
      const response = await fetch('/api/generate-device-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemSettings: formData.systemSettings,
          name: name || '',
          context: context || ''
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDeviceInfo(result.deviceInfo);
      }
    } catch (error) {
      console.error('Error generating device info:', error);
    } finally {
      setIsGeneratingDeviceInfo(false);
    }

    onSubmit(dataToSubmit);
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
        
        <div className="mt-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Device Information Prompt
          </label>
          <textarea
            {...register('prompt')}
            id="prompt"
            placeholder="Enter your custom prompt for device information generation..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            This prompt will be used to generate device information from system settings. If left empty, the default prompt will be used.
          </p>
        </div>
        
        <ErrorDisplay errors={errors} className="mt-3" />
        
        {/* Device Information Display */}
        {deviceInfo && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Device Information:</h4>
            <p className="text-sm text-gray-600">{deviceInfo}</p>
          </div>
        )}
        
        <SubmitButton 
          onSubmit={handleSubmit(handleFormSubmit)} 
          variant="subtle" 
          show={showSubmitButton}
          className="mt-4"
          isLoading={isGeneratingDeviceInfo}
        >
          {isGeneratingDeviceInfo ? 'Saving & Generating Info...' : 'Save System Settings'}
        </SubmitButton>
      </form>
    </CollapsibleBox>
  );
}
