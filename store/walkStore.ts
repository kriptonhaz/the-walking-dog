import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../storage/mmkv';

export type WalkEntry = {
  id: string;
  date: string; // ISO date string
  time: string; // ISO time string
  dogId: string; // Reference to dog from dogStore
  distance: number; // in meters
  duration: number; // in seconds
  createdAt: Date;
};

type WalkStore = {
  walks: WalkEntry[];
  addWalk: (walk: Omit<WalkEntry, 'id' | 'createdAt'>) => void;
  removeWalk: (id: string) => void;
  getWalksByDogId: (dogId: string) => WalkEntry[];
  clearAll: () => void;
};

export const useWalkStore = create<WalkStore>()(
  persist(
    (set, get) => ({
      walks: [],
      addWalk: (walkData) => {
        const newWalk: WalkEntry = {
          ...walkData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        };
        set((state) => ({ walks: [...state.walks, newWalk] }));
      },
      removeWalk: (id) =>
        set((state) => ({ walks: state.walks.filter((w) => w.id !== id) })),
      getWalksByDogId: (dogId) => {
        const state = get();
        return state.walks.filter((walk) => walk.dogId === dogId);
      },
      clearAll: () => set({ walks: [] }),
    }),
    {
      name: 'walk-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);