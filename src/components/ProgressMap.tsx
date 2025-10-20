'use client';

import { FilledStatus } from '@/types/form';

interface ProgressMapProps {
  filledStatus: FilledStatus;
}

export function ProgressMap({ filledStatus }: ProgressMapProps) {
  const sections = [
    { key: 'context', label: 'Context', filled: filledStatus.context },
    { key: 'system', label: 'System Settings', filled: filledStatus.system },
    { key: 'mustHave', label: 'Must Have Content', filled: filledStatus.mustHave },
    { key: 'content', label: 'Content to Paraphrase', filled: filledStatus.content },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Map</h2>
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.key} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${section.filled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm text-gray-700">{section.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
