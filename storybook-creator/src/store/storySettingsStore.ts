import { create } from 'zustand';

export interface StorySettingsForm {
    groupName?: string;
    ageGroup?: number; 
    grammarAssistant?: boolean;
    voiceAssistant?: boolean;
    imageVerification?: boolean;
    excerciseDescription: string;
    minNumPages: number;
    maxNumPages: number;
}

interface SettingsStore {
  settings: StorySettingsForm;
  setSettings: (newSettings: StorySettingsForm) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    groupName: '',
    ageGroup: 10,
    grammarAssistant: false,
    voiceAssistant: false,
    imageVerification: false,
    excerciseDescription: '',
    minNumPages: 0,
    maxNumPages: 100
  },
  setSettings: (newSettings) => set({ settings: newSettings }),
}));
