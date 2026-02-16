import { create } from 'zustand';
import { AppState } from './types';

export const useStore = create<AppState>((set) => ({
  hasEntered: false,
  setHasEntered: (entered) => set({ hasEntered: entered }),
  playMusic: false,
  setPlayMusic: (play) => set({ playMusic: play }),
  isDarkMode: true, // Default to dark mode
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));