import personaData from '@/data/vietnamese-personas.json';

export type Gender = 'male' | 'female';
export type PersonalityType = 'introverted' | 'extroverted' | 'analytical' | 'creative' | 'practical' | 'empathetic';
export type LifeStage = 'college_student' | 'young_professional' | 'established_professional' | 'senior_professional' | 'retired';
export type FamilyStatus = 'single' | 'married_no_children' | 'married_with_children' | 'empty_nester';

export interface Persona {
  name: string;
  gender: Gender;
  age: number;
  personality: PersonalityType;
  lifeStage: LifeStage;
  familyStatus: FamilyStatus;
  context: string;
  traits: string[];
}

/**
 * Generates a random age within the range for a given life stage
 */
function generateAgeForStage(stage: LifeStage): number {
  const stageData = personaData.lifeStages.find(s => s.stage === stage);
  if (!stageData) return 30;
  
  const [min, max] = stageData.ageRange;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Selects a personality type that aligns with the life stage
 */
function selectPersonalityForStage(stage: LifeStage): PersonalityType {
  const stageData = personaData.lifeStages.find(s => s.stage === stage);
  if (!stageData) return 'practical';
  
  const likelyPersonalities = stageData.likelyPersonalities as PersonalityType[];
  const randomIndex = Math.floor(Math.random() * likelyPersonalities.length);
  return likelyPersonalities[randomIndex];
}

/**
 * Selects a family status that aligns with the life stage
 */
function selectFamilyStatusForStage(stage: LifeStage): FamilyStatus {
  const familyStatuses = Object.entries(personaData.familyStatus);
  const compatibleStatuses = familyStatuses.filter(([_, data]) => 
    (data as any).likelyStages.includes(stage)
  );
  
  if (compatibleStatuses.length === 0) return 'single';
  
  const randomIndex = Math.floor(Math.random() * compatibleStatuses.length);
  return compatibleStatuses[randomIndex][0] as FamilyStatus;
}

/**
 * Generates a full name based on gender
 */
function generateName(gender: Gender): string {
  const firstNames = gender === 'male' 
    ? personaData.maleFirstNames 
    : personaData.femaleFirstNames;
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const familyName = personaData.familyNames[Math.floor(Math.random() * personaData.familyNames.length)];
  
  return `${firstName} ${familyName}`;
}

/**
 * Formats family status into a readable string
 */
function formatFamilyStatus(status: FamilyStatus): string {
  const formats: Record<FamilyStatus, string> = {
    single: 'Single',
    married_no_children: 'Married, no children',
    married_with_children: 'Married with children',
    empty_nester: 'Married, children grown'
  };
  return formats[status];
}

/**
 * Generates a complete persona with aligned attributes
 */
export function generatePersona(): Persona {
  // Randomly select gender and life stage
  const gender: Gender = Math.random() > 0.5 ? 'male' : 'female';
  const lifeStageIndex = Math.floor(Math.random() * personaData.lifeStages.length);
  const lifeStage = personaData.lifeStages[lifeStageIndex].stage as LifeStage;
  
  // Generate aligned attributes
  const age = generateAgeForStage(lifeStage);
  const personality = selectPersonalityForStage(lifeStage);
  const familyStatus = selectFamilyStatusForStage(lifeStage);
  const name = generateName(gender);
  
  // Get personality traits
  const personalityData = personaData.personalities[personality];
  const traits = personalityData.traits;
  
  // Build context description
  const stageData = personaData.lifeStages.find(s => s.stage === lifeStage);
  const context = `${age} year old ${gender === 'male' ? 'man' : 'woman'}, ${formatFamilyStatus(familyStatus)}. ${stageData?.context || ''}`;
  
  return {
    name,
    gender,
    age,
    personality,
    lifeStage,
    familyStatus,
    context,
    traits
  };
}

/**
 * Generates multiple unique personas
 */
export function generatePersonas(count: number = 5): Persona[] {
  const personas: Persona[] = [];
  const usedNames = new Set<string>();
  
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loops
  
  while (personas.length < count && attempts < maxAttempts) {
    const persona = generatePersona();
    
    // Ensure unique names
    if (!usedNames.has(persona.name)) {
      personas.push(persona);
      usedNames.add(persona.name);
    }
    
    attempts++;
  }
  
  return personas;
}

/**
 * Generates a persona with specific constraints
 */
export function generatePersonaWithConstraints(
  gender?: Gender,
  lifeStage?: LifeStage,
  personality?: PersonalityType
): Persona {
  // Use provided or random values
  const selectedGender = gender || (Math.random() > 0.5 ? 'male' : 'female');
  const selectedLifeStage = lifeStage || 
    personaData.lifeStages[Math.floor(Math.random() * personaData.lifeStages.length)].stage as LifeStage;
  
  const age = generateAgeForStage(selectedLifeStage);
  const selectedPersonality = personality || selectPersonalityForStage(selectedLifeStage);
  const familyStatus = selectFamilyStatusForStage(selectedLifeStage);
  const name = generateName(selectedGender);
  
  const personalityData = personaData.personalities[selectedPersonality];
  const traits = personalityData.traits;
  
  const stageData = personaData.lifeStages.find(s => s.stage === selectedLifeStage);
  const context = `${age} year old ${selectedGender === 'male' ? 'man' : 'woman'}, ${formatFamilyStatus(familyStatus)}. ${stageData?.context || ''}`;
  
  return {
    name,
    gender: selectedGender,
    age,
    personality: selectedPersonality,
    lifeStage: selectedLifeStage,
    familyStatus,
    context,
    traits
  };
}

