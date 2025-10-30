'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, User } from 'lucide-react';
import { generatePersonas, type Persona } from '@/lib/personaGenerator';

interface NameSelectorInlineProps {
  selectedName?: string;
  onNameSelect: (name: string, context?: string) => void;
}

export function NameSelectorInline({ selectedName, onNameSelect }: NameSelectorInlineProps) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  // Generate 5 random personas on component mount
  useEffect(() => {
    generateRandomPersonas();
  }, []);

  const generateRandomPersonas = () => {
    const newPersonas = generatePersonas(5);
    setPersonas(newPersonas);
  };

  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">Quick select persona:</p>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-400 hover:text-gray-600"
            title={showDetails ? "Hide details" : "Show details"}
          >
            <User className="h-3 w-3" />
          </button>
        </div>
        <button
          type="button"
          onClick={generateRandomPersonas}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Shuffle
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {personas.map((persona, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onNameSelect(persona.name, persona.context)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
              selectedName === persona.name
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-medium'
                : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gray-50'
            }`}
            title={showDetails ? persona.context : persona.name}
          >
            <div className="flex flex-col items-start">
              <span>{persona.name}</span>
              {showDetails && (
                <span className="text-xs text-gray-500 font-normal mt-0.5">
                  {persona.age}y • {persona.personality}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* Show selected persona details */}
      {selectedName && personas.find(p => p.name === selectedName) && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs">
          <p className="font-medium text-blue-900 mb-1">Selected Persona:</p>
          {personas.filter(p => p.name === selectedName).map((persona, idx) => (
            <div key={idx} className="text-blue-800 space-y-1">
              <p><strong>Name:</strong> {persona.name} ({persona.gender})</p>
              <p><strong>Age:</strong> {persona.age} years old</p>
              <p><strong>Stage:</strong> {persona.lifeStage.replace(/_/g, ' ')}</p>
              <p><strong>Personality:</strong> {persona.personality} - {persona.traits.join(', ')}</p>
              <p><strong>Family:</strong> {persona.familyStatus.replace(/_/g, ' ')}</p>
              <p className="pt-1 border-t border-blue-300 mt-2"><strong>Context:</strong> {persona.context}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

