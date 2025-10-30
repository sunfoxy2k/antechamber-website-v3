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

  const sampleDeviceData = `[
  {
    "cellular": true,
    "device_id": "fe3419b7-2321-485d-859c-3d86d0fae14e",
    "formatted_address": "400 W Broad St, Texarkana, TX 75501, USA",
    "latitude": 33.4201672,
    "locale": "en_US",
    "location_service": true,
    "longitude": -94.0466084,
    "low_battery_mode": false,
    "place_id": "ChIJ6ym3ql9qNIYRkyDuaECRgV0",
    "utc_offset_seconds": -18000,
    "wifi": true
  }
]`;
  
  const { register, handleSubmit, watch, setValue, formState: { errors: formErrors } } = useForm({
    defaultValues: {
      systemSettings: data.systemSettings
    }
  });
  
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<string>('');
  const [isGeneratingDeviceInfo, setIsGeneratingDeviceInfo] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const watchedValues = watch();

  // Show submit button when form is empty or has changes
  useEffect(() => {
    const hasSystemChanges = watchedValues.systemSettings !== data.systemSettings;
    const isEmpty = !watchedValues.systemSettings?.trim();
    setShowSubmitButton(hasSystemChanges || isEmpty);
  }, [watchedValues, data]);

  const handleFormSubmit = async (formData: Pick<FormData, 'systemSettings'>) => {
    handleSystemSubmit(formData);
    goToNextStep();
  };

  const handleGenerateDeviceInfo = async () => {
    if (!watchedValues.systemSettings?.trim()) {
      alert('Please enter device data first');
      return;
    }

    setIsGeneratingDeviceInfo(true);
    setDeviceInfo('');

    try {
      const response = await fetch('/api/generate-device-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceData: watchedValues.systemSettings,
          name: name || '',
          context: context || ''
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDeviceInfo(result.deviceInfo);
      } else {
        const errorData = await response.json();
        setDeviceInfo(`Error: ${errorData.error || 'Failed to generate device information'}`);
      }
    } catch (error) {
      console.error('Error generating device info:', error);
      setDeviceInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingDeviceInfo(false);
    }
  };

  const handleUseSample = () => {
    setValue('systemSettings', sampleDeviceData, { shouldValidate: true, shouldDirty: true });
    setShowSample(false);
  };

  return (
    <CollapsibleBox 
      title="System Settings" 
      isFilled={isFilled}
      isCollapsed={isCollapsed}
      onCollapseChange={handleCollapseChange('system')}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="systemSettings" className="block text-sm font-medium text-gray-700">
              Device Data (JSON) <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowSample(!showSample)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {showSample ? 'Hide Sample' : 'Show Sample'}
            </button>
          </div>
          
          {showSample && (
            <div className="mb-3 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Sample device data format:</p>
              <pre className="text-xs text-gray-700 overflow-x-auto">{sampleDeviceData}</pre>
              <button
                type="button"
                onClick={handleUseSample}
                className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Use This Sample
              </button>
            </div>
          )}
          
          <textarea
            {...register('systemSettings', { required: 'Device data is required' })}
            id="systemSettings"
            placeholder='Paste your device data JSON here...'
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm"
          />
          {formErrors.systemSettings && (
            <p className="mt-1 text-sm text-red-600">{formErrors.systemSettings.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Paste device information JSON. This will be converted to natural language using the selected persona's context.
          </p>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerateDeviceInfo}
          disabled={isGeneratingDeviceInfo || !watchedValues.systemSettings?.trim()}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          {isGeneratingDeviceInfo ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating Natural Language...
            </>
          ) : (
            'Generate Device Info'
          )}
        </button>

        {/* Device Information Display */}
        {deviceInfo && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-md border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Generated Device Information:
            </h4>
            <p className="text-sm text-gray-800 leading-relaxed">{deviceInfo}</p>
            <p className="text-xs text-gray-600 mt-2 italic">
              This description is tailored for: {name || 'the selected user'}
            </p>
          </div>
        )}
        
        <ErrorDisplay errors={errors} />
        
        <SubmitButton 
          onSubmit={handleSubmit(handleFormSubmit)} 
          variant="subtle" 
          show={showSubmitButton}
        >
          Continue to Next Step
        </SubmitButton>
      </form>
    </CollapsibleBox>
  );
}
