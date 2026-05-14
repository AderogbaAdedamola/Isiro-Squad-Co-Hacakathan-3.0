import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isWhatsappVerified: false,
      whatsappNumber: '',
      currentOnboardingStep: 1,
      login: (userData, tokenData) => set({ user: userData, token: tokenData, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      verifyWhatsapp: (number) => set({ whatsappNumber: number, isWhatsappVerified: true }),
      updateWhatsapp: (number) => set({ whatsappNumber: number }),
      setOnboardingStep: (step) => set({ currentOnboardingStep: step }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
