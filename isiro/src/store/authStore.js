import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isWhatsappVerified: false,
      whatsappNumber: '',
      currentOnboardingStep: 1,
      _hasHydrated: false,

      login: (userData, tokenData = null) => {
        if (tokenData) localStorage.setItem('token', tokenData);
        set({ 
          user: userData, 
          token: tokenData, 
          isAuthenticated: true 
        });
      },

      // Update token without changing user data (used after refresh)
      setToken: (tokenData) => {
        if (tokenData) localStorage.setItem('token', tokenData);
        set({ token: tokenData });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isWhatsappVerified: false,
          whatsappNumber: '',
          currentOnboardingStep: 1,
        });
      },

      verifyWhatsapp: (number) => set({ whatsappNumber: number, isWhatsappVerified: true }),
      updateWhatsapp: (number) => set({ whatsappNumber: number }),
      setOnboardingStep: (step) => set({ currentOnboardingStep: step }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Called when zustand finishes rehydrating from localStorage
        state && state._setHasHydrated(true);
      },
      // Don't persist internal flags
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isWhatsappVerified: state.isWhatsappVerified,
        whatsappNumber: state.whatsappNumber,
        currentOnboardingStep: state.currentOnboardingStep,
      }),
    }
  )
);

// Attach the hydration setter as a non-persisted action
// We do this outside so partialize excludes _hasHydrated
useAuthStore.setState({
  _setHasHydrated: (val) => useAuthStore.setState({ _hasHydrated: val }),
});
