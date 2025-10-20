'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { CollapsibleBox } from '@/components/CollapsibleBox';
import { SubmitButton } from '@/components/SubmitButton';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FormData } from '@/types/form';

interface ContentFormProps {
  data: Pick<FormData, 'content' | 'prompt'>;
  onSubmit: (data: Pick<FormData, 'content'>) => void;
  onMainSubmit: () => void;
  isFilled: boolean;
  errors: string[];
  isLoading: boolean;
  mainError?: string;
  originalParagraphs: string[];
  paraphrasedParagraphs: string[];
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function ContentForm({ 
  data, 
  onSubmit, 
  onMainSubmit, 
  isFilled, 
  errors, 
  isLoading,
  mainError,
  originalParagraphs,
  paraphrasedParagraphs,
  isCollapsed,
  onCollapseChange
}: ContentFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: data
  });
  const [showPrompt, setShowPrompt] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  
  const content = watch('content');
  const watchedValues = watch();

  // Show submit button when form is empty or has changes
  useEffect(() => {
    const hasChanges = watchedValues.content !== data.content;
    const isEmpty = !watchedValues.content;
    setShowSubmitButton(hasChanges || isEmpty);
  }, [watchedValues, data]);

  const handleFormSubmit = (formData: Pick<FormData, 'content'>) => {
    onSubmit(formData);
  };

  // Auto-resize textarea
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <CollapsibleBox 
      title="Paraphrase Content" 
      isFilled={isFilled}
      isCollapsed={isCollapsed}
      onCollapseChange={onCollapseChange}
    >
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Enter content to paraphrase: <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('content', { required: 'Content to paraphrase is required' })}
              id="content"
              placeholder="Paste your content here..."
              className="w-full min-h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none overflow-hidden"
              style={{ height: 'auto' }}
              onInput={handleTextareaInput}
            />
          </div>
          
          <ErrorDisplay errors={errors} />
          
          <SubmitButton 
            onSubmit={handleSubmit(handleFormSubmit)} 
            variant="subtle" 
            show={showSubmitButton}
            className="mt-4"
          >
            Save Content
          </SubmitButton>
        </div>
        
        {/* Prompt Section */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowPrompt(!showPrompt)}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            {showPrompt ? 'Hide' : 'Show'} prompt settings
            {showPrompt ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {showPrompt && (
            <div className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Custom prompt:
              </label>
              <textarea
                {...register('prompt')}
                id="prompt"
                placeholder="Enter your custom prompt..."
                className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            </div>
          )}
        </div>
        
        {/* Main Submit Button */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
          <SubmitButton 
            onSubmit={onMainSubmit}
            variant="sm"
            className="px-6"
            isLoading={isLoading}
          >
            Submit
          </SubmitButton>
        </div>

        {/* Main Error Display */}
        {mainError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{mainError}</p>
          </div>
        )}

        {/* Results Display */}
        {originalParagraphs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Paraphrasing Results ({originalParagraphs.length} paragraphs)
            </h2>
            <div className="space-y-6">
              {originalParagraphs.map((originalParagraph, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Original Version */}
                  <div className="bg-blue-50 p-4 border-b border-gray-200">
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Original:</h3>
                        <p className="text-gray-700 leading-relaxed">{originalParagraph}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Paraphrased Version */}
                  <div className="bg-green-50 p-4">
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-medium text-green-800 mb-2">Paraphrased:</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {paraphrasedParagraphs[index] || 'Processing...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CollapsibleBox>
  );
}
