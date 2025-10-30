'use client';

import { ProgressMap } from '@/components/ProgressMap';
import { ContextForm } from '@/components/forms/ContextForm';
import { SystemSettingsForm } from '@/components/forms/SystemSettingsForm';
import { MustHaveContentForm } from '@/components/forms/MustHaveContentForm';
import { ContentForm } from '@/components/forms/ContentForm';
import { ParaphraseFormProvider, useParaphraseFormState } from '@/contexts/ParaphraseFormContext';

function HomeContent() {
  const { formVisibilityStates } = useParaphraseFormState();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Map */}
          <div className="lg:col-span-1">
            <ProgressMap />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {formVisibilityStates.context && <ContextForm />}
            {formVisibilityStates.system && <SystemSettingsForm />}
            {formVisibilityStates.mustHave && <MustHaveContentForm />}
            {formVisibilityStates.content && <ContentForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ParaphraseFormProvider>
      <HomeContent />
    </ParaphraseFormProvider>
  );
}