'use client';

import { useState, useEffect } from 'react';
import vietnameseNames from '@/data/vietnamese-names.json';

interface NameSelectorProps {
  onNameSelect: (name: string) => void;
  selectedName?: string;
}

export function NameSelector({ onNameSelect, selectedName }: NameSelectorProps) {
  const [randomNames, setRandomNames] = useState<string[]>([]);

  // Generate 5 random names by combining shuffled first names and family names
  useEffect(() => {
    generateRandomNames();
  }, []);

  const generateRandomNames = () => {
    const names: string[] = [];
    const { firstNames, familyNames } = vietnameseNames;
    
    // Create 5 unique random combinations
    for (let i = 0; i < 5; i++) {
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomFamilyName = familyNames[Math.floor(Math.random() * familyNames.length)];
      const fullName = `${randomFirstName} ${randomFamilyName}`;
      
      // Ensure no duplicates in the current batch
      if (!names.includes(fullName)) {
        names.push(fullName);
      } else {
        i--; // Try again if duplicate
      }
    }
    
    setRandomNames(names);
  };

  const handleRefresh = () => {
    generateRandomNames();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Select a Name</h3>
        <button
          onClick={handleRefresh}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Refresh Names
        </button>
      </div>
      
      <div className="space-y-2">
        {randomNames.map((name, index) => (
          <button
            key={index}
            onClick={() => onNameSelect(name)}
            className={`w-full text-left px-4 py-3 rounded-md border-2 transition-all ${
              selectedName === name
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-medium'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{name}</span>
              {selectedName === name && (
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {selectedName && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            <span className="font-medium">Selected:</span> {selectedName}
          </p>
        </div>
      )}
    </div>
  );
}

