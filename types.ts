export interface PromptData {
  subject: string;
  action: string;
  expression: string;
  place: string;
  time: string;
  cameraMovement: string;
  lighting: string;
  videoStyle: string;
  videoMood: string;
  soundMusic: string;
  spokenWords: string;
  additionalDetails: string;
}

export type PromptDataKey = keyof PromptData;

export interface SelectOption {
  value: string;
  label: string;
}