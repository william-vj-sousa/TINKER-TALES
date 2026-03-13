"use client"
import { create } from 'zustand';
import { FontSize } from '@/app/dashboard/FontDropDown';
import pb from '@/lib/pocketbase';
import { ClientResponseError } from 'pocketbase';



export const createDefaultStoryGroup = (temp_id: string, join_code: string): StoryGroup => ({
  /* Default settings when a story group is created */
  /* Initialized with a temporary ID which is changed to the PB ID when the data is saved*/
  id: temp_id,  // = `temp-${crypto.randomUUID()}`;
  settings: { 
          groupName: `My New Story Group`,
          // groupURL: `storygroup#${temp_id}`,
          ageGroup: 10,
          grammarAssistant: false,
          voiceAssistant: false,
          imageVerification: false,
          excerciseDescription: '',
          bookLayout: "Bifold",
          fontSize: "medium",
          minNumPages: 0,
          maxNumPages: 100,
          joinId: join_code
        }
});

export interface StorySettings {
    groupName?: string;
    // groupURL: string;
    ageGroup?: number; 
    grammarAssistant?: boolean;
    voiceAssistant?: boolean;
    imageVerification?: boolean;
    excerciseDescription: string;
    bookLayout: string;
    fontSize: FontSize;
    minNumPages: number;
    maxNumPages: number;
    joinId: string;
}

interface StoryGroup {
  id: string;
  settings: StorySettings;
}

interface StoryGroupsState {
  storyGroups: StoryGroup[];
  
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void; 

  addGroup: (group: StoryGroup) => void;
  updateGroupSettings: (id: string, newSettings: Partial<StorySettings>) => void;
  deleteGroup: (id: string) => void;

  //pb methods
  fetchStoryGroups: () => Promise<void>;
  saveAllGroups: () => Promise<void>;
  deleteGroupFromPb: (id: string) => Promise<void>;
}

export const useStoryGroupsStore = create<StoryGroupsState>((set, get) => ({
  selectedGroupId: "",  // Empty string when no groups are selected. USed for managing currently selected group.
  storyGroups: [],      // List of all story groups belonging to user in PB


  // Client Side Methods for Add / Update / Delete for rendering
  setSelectedGroupId: (id: string) => set({ selectedGroupId: id }),
  addGroup: (group: StoryGroup) =>
    set((state) => ({ storyGroups: [...state.storyGroups, group] })),

  updateGroupSettings: async (id: string, newSettings: Partial<StorySettings>) => {
    set((state) => ({
      storyGroups: state.storyGroups.map((g) =>
        g.id === id ? { ...g, settings: { ...g.settings, ...newSettings } } : g
      ),
    }));
    // Immediately resolve, since set is synchronous
    return Promise.resolve();
  },
  deleteGroup: (id: string) =>
    set((state) => ({
      storyGroups: state.storyGroups.filter((g) => g.id !== id),
      selectedGroupId: state.selectedGroupId === id ? '' : state.selectedGroupId,
    })),
  
  // Methods or fetching / saving / deleting from Database. 
  fetchStoryGroups: async () => {
    // Called when user logs in or dashboard page loaded
    try {
      // Get current user ID
      const userId = pb.authStore.record?.id;
      if (!userId) return;

      // Query story groups created by this user
      try {
        const records = await pb.collection('story_groups').getFullList(200, {
          filter: `createdBy = "${userId}"`,
        });
              
        // Map PocketBase records to StoryGroups 
        console.log("mapping storygroups")
        const storyGroups = records.map((rec) => ({
          id: rec.id,
          settings: {
            groupName: rec.settings?.groupName ?? '',
            groupURL: rec.settings?.groupURL ?? '',
            ageGroup: rec.settings?.ageGroup ?? 'defaultAgeGroup',
            grammarAssistant: rec.settings?.grammarAssistant ?? false,
            voiceAssistant: rec.settings?.voiceAssistant ?? false,
            imageVerification: rec.settings?.imageVerification ?? false,
            excerciseDescription: rec.settings?.excerciseDescription ?? '',
            bookLayout: rec.settings?.bookLayout ?? 'bifold',
            fontSize: rec.settings?.fontSize ?? 'medium',
            minNumPages: rec.settings?.minNumPages ?? 0,
            maxNumPages: rec.settings?.maxNumPages ?? 100,
            joinId: rec.settings?.joinId ?? ["-1","-1","-1","-1","-1"]
          },
        }));

        console.log('groups:', storyGroups)
        // Update Zustand state
      set({
        storyGroups,
        selectedGroupId: storyGroups.length > 0 ? storyGroups[0].id : '', // fallback to '' for string ID
      });

        
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 0) {
          // Request was cancelled, ignore or handle gracefully
          console.log('Request was autocancelled, ignoring');
        } else {
          // Real error - handle/log it
          console.error(error);
        }
      }
    } catch (error) {
      console.error('Failed to fetch story groups:', error);
    }
  },

    saveAllGroups: async () => {
      const storyGroups = get().storyGroups;
      // Called when updating or creating groups
      
      try {
          for (const group of storyGroups) {
                    // Prepare data for PocketBase
          const settings: StorySettings = {
            groupName: group.settings.groupName,
            // groupURL: group.settings.groupURL,
            ageGroup: group.settings.ageGroup,
            grammarAssistant: group.settings.grammarAssistant,
            voiceAssistant: group.settings.voiceAssistant,
            imageVerification: group.settings.imageVerification,
            excerciseDescription: group.settings.excerciseDescription,
            bookLayout: group.settings.bookLayout,
            fontSize: group.settings.fontSize,
            minNumPages: group.settings.minNumPages,
            maxNumPages: group.settings.maxNumPages,
            joinId: group.settings.joinId
          };
          const data = {  
            // groupURL: group.settings.groupURL,
            createdBy: pb.authStore.record?.id,
            settings: settings
          }

          console.log('SAVING GROUP!!!!')
          console.log('settings:', settings);
          console.log('data:', data);       



        if (group.id.startsWith('temp-')) {
          // It's a new group — create it in PocketBase
          const record = await pb.collection('story_groups').create(data);
          const updatedGroupURL = `storygroup#${record.id}`;
          // Update the record on PocketBase with the correct groupURL
          await pb.collection('story_groups').update(record.id, { groupURL: updatedGroupURL });
          
          // On client side, update the record so that the temporary ID / url now matches with PocketBase ID / url
          set((state) => ({
            storyGroups: state.storyGroups.map((g) =>
              g.id === group.id
                ? {
                    ...g,
                    id: record.id,
                    settings: {
                      ...g.settings,
                      groupURL: updatedGroupURL,
                    },
                  }
                : g
            ),
          }));
        } else {
          // Existing group — update it
          await pb.collection('story_groups').update(group.id, data);
        }
          }

    } catch (error) {
      console.error('Failed to save group:', error);
    }
  },
  deleteGroupFromPb: async (id: string) => {
    try {
      // Delete from PocketBase
      await pb.collection('story_groups').delete(id);

      // Update Zustand state: remove deleted group, clear selection if needed
      set((state) => ({
        storyGroups: state.storyGroups.filter((g) => g.id !== id),
        selectedGroupId: state.selectedGroupId === id ? '' : state.selectedGroupId,
      }));

      console.log(`Deleted group ${id} from PB and Zustand store.`);
    } catch (error) {
      console.error(`Failed to delete group ${id}:`, error);
    }
  },
}));

