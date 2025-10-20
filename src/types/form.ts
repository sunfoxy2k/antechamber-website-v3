export interface FormData {
  name: string;
  context: string;
  systemSettings: string;
  mustHaveContent: string;
  content: string;
  prompt: string;
}

export interface ValidationErrors {
  context: string[];
  system: string[];
  content: string[];
}

export interface FilledStatus {
  context: boolean;
  system: boolean;
  mustHave: boolean;
  content: boolean;
}
