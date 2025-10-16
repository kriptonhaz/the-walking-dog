import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../storage/mmkv';

type Dog = {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  weight?: number;
  photo?: string;
};

type DogStore = {
  dogs: Dog[];
  addDog: (dog: Dog) => void;
  removeDog: (id: string) => void;
  clearAll: () => void;
};

export const useDogStore = create<DogStore>()(
  persist(
    (set) => ({
      dogs: [],
      addDog: (dog) => set((state) => ({ dogs: [...state.dogs, dog] })),
      removeDog: (id) =>
        set((state) => ({ dogs: state.dogs.filter((d) => d.id !== id) })),
      clearAll: () => set({ dogs: [] }),
    }),
    {
      name: 'dog-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);