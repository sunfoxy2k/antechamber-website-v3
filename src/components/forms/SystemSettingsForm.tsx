'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { CollapsibleBox } from '@/components/CollapsibleBox';
import { SubmitButton } from '@/components/SubmitButton';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { FormData } from '@/types/form';
import { useParaphraseFormState } from '@/contexts/ParaphraseFormContext';

export function SystemSettingsForm() {
  const {
    formData,
    validationErrors,
    formCollapsedStates,
    handleSystemSubmit,
    handleCollapseChange,
    goToNextStep,
    getFilledStatus
  } = useParaphraseFormState();

  const data = { systemSettings: formData.systemSettings };
  const errors = validationErrors.system;
  const isCollapsed = formCollapsedStates.system;
  const isFilled = getFilledStatus().system;
  const name = formData.name;
  const context = formData.context;

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
  const [apiCallDetails, setApiCallDetails] = useState<any>(null);
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
      const requestBody = {
        systemSettings: formData.systemSettings,
        name: name || '',
        context: context || '',
        prompt: formData.prompt
      };

      // Store API call details for display
      setApiCallDetails({
        url: '/api/generate-device-info',
        method: 'POST',
        model: 'gpt-4',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        requestBody: requestBody
      });

      const response = await fetch('/api/generate-device-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        setDeviceInfo(result.deviceInfo);
        
        // Update API call details with response
        setApiCallDetails((prev: any) => ({
          ...prev,
          response: result,
          status: 'success',
          responseTime: Date.now() - new Date(prev.timestamp).getTime()
        }));
      } else {
        setApiCallDetails((prev: any) => ({
          ...prev,
          status: 'error',
          error: 'Failed to generate device information'
        }));
      }
    } catch (error) {
      console.error('Error generating device info:', error);
      setApiCallDetails((prev: any) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    } finally {
      setIsGeneratingDeviceInfo(false);
    }

    handleSystemSubmit(dataToSubmit);
    goToNextStep();
  };

  return (
    <CollapsibleBox 
      title="System Settings" 
      isFilled={isFilled}
      isCollapsed={isCollapsed}
      onCollapseChange={handleCollapseChange('system')}
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
        
        {/* API Call Details Display */}
        {apiCallDetails && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h4 className="text-sm font-medium text-blue-700 mb-3">API Call Details:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">URL:</span>
                <span className="text-gray-800 font-mono">{apiCallDetails.url}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Method:</span>
                <span className="text-gray-800 font-mono">{apiCallDetails.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Model:</span>
                <span className="text-gray-800 font-mono">{apiCallDetails.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Version:</span>
                <span className="text-gray-800 font-mono">{apiCallDetails.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Status:</span>
                <span className={`font-mono ${
                  apiCallDetails.status === 'success' ? 'text-green-600' : 
                  apiCallDetails.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {apiCallDetails.status || 'pending'}
                </span>
              </div>
              {apiCallDetails.responseTime && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Response Time:</span>
                  <span className="text-gray-800 font-mono">{apiCallDetails.responseTime}ms</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Timestamp:</span>
                <span className="text-gray-800 font-mono text-xs">
                  {new Date(apiCallDetails.timestamp).toLocaleString()}
                </span>
              </div>
              {apiCallDetails.error && (
                <div className="mt-2 p-2 bg-red-100 rounded border border-red-200">
                  <span className="font-medium text-red-700">Error:</span>
                  <span className="text-red-600 ml-2">{apiCallDetails.error}</span>
                </div>
              )}
            </div>
          </div>
        )}

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
