'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, User2, Briefcase, Heart, GraduationCap, Home } from 'lucide-react';
import { generatePersonas, type Persona } from '@/lib/personaGenerator';

interface PersonaSelectorProps {
  selectedPersona?: { name: string; context: string };
  onPersonaSelect: (name: string, context: string) => void;
}

export function PersonaSelector({ selectedPersona, onPersonaSelect }: PersonaSelectorProps) {
  const [personas, setPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    generateNewPersonas();
  }, []);

  const generateNewPersonas = () => {
    const newPersonas = generatePersonas(5);
    setPersonas(newPersonas);
  };

  const getLifeStageIcon = (lifeStage: string) => {
    switch (lifeStage) {
      case 'college_student':
        return <GraduationCap className="h-4 w-4" />;
      case 'young_professional':
      case 'established_professional':
      case 'senior_professional':
        return <Briefcase className="h-4 w-4" />;
      case 'retired':
        return <Home className="h-4 w-4" />;
      default:
        return <User2 className="h-4 w-4" />;
    }
  };

  const getGenderColor = (gender: string) => {
    return gender === 'male' ? 'text-blue-600' : 'text-pink-600';
  };

  const formatLifeStage = (stage: string) => {
    return stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatFamilyStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <User2 className="h-4 w-4" />
          Select a Persona
        </h3>
        <button
          type="button"
          onClick={generateNewPersonas}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Generate New
        </button>
      </div>

      <div className="space-y-2">
        {personas.map((persona, index) => {
          const isSelected = selectedPersona?.name === persona.name;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => onPersonaSelect(persona.name, persona.context)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-2">
                {/* Header: Name, Age, Gender */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-semibold text-base ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                      {persona.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                      <span className={`font-medium ${getGenderColor(persona.gender)}`}>
                        {persona.gender === 'male' ? '♂' : '♀'} {persona.gender}
                      </span>
                      <span>•</span>
                      <span>{persona.age} years old</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full ${isSelected ? 'bg-indigo-200' : 'bg-gray-100'}`}>
                    {getLifeStageIcon(persona.lifeStage)}
                  </div>
                </div>

                {/* Life Stage & Family Status */}
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    isSelected ? 'bg-indigo-200 text-indigo-900' : 'bg-blue-100 text-blue-800'
                  }`}>
                    <Briefcase className="h-3 w-3" />
                    {formatLifeStage(persona.lifeStage)}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    isSelected ? 'bg-indigo-200 text-indigo-900' : 'bg-purple-100 text-purple-800'
                  }`}>
                    <Heart className="h-3 w-3" />
                    {formatFamilyStatus(persona.familyStatus)}
                  </span>
                </div>

                {/* Personality & Traits */}
                <div className={`text-xs ${isSelected ? 'text-indigo-800' : 'text-gray-700'}`}>
                  <span className="font-semibold">Personality:</span> {persona.personality}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {persona.traits.slice(0, 4).map((trait, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded text-xs ${
                          isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Context Description */}
                <p className={`text-xs leading-relaxed ${isSelected ? 'text-indigo-900' : 'text-gray-600'}`}>
                  {persona.context}
                </p>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="pt-2 border-t border-indigo-200">
                    <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Selected Persona
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

