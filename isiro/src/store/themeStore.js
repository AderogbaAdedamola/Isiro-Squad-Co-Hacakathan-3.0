import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Fallback
};

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'system', // can be 'light', 'dark', or 'system'
      actualTheme: getSystemTheme(), // the resolved theme (light or dark)
      setTheme: (newTheme) => {
        const actual = newTheme === 'system' ? getSystemTheme() : newTheme;
        set({ theme: newTheme, actualTheme: actual });
      },
      updateSystemTheme: () => {
        set((state) => {
          if (state.theme === 'system') {
            return { actualTheme: getSystemTheme() };
          }
          return {};
        });
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.updateSystemTheme();
        }
      }
    }
  )
);
