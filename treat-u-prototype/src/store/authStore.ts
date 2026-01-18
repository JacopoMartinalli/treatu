import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, Professional } from '../types';
import { mockClients, mockProfessionals } from '../data/mockData';

// ============================================
// TYPES
// ============================================

type User = Client | Professional | null;

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loginAsClient: (email: string, password: string) => Promise<boolean>;
  loginAsProfessional: (email: string, password: string) => Promise<boolean>;
  registerClient: (data: Partial<Client>) => Promise<boolean>;
  registerProfessional: (data: Partial<Professional>) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// ============================================
// STORE
// ============================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      loginAsClient: async (email: string, _password: string) => {
        set({ isLoading: true, error: null });

        // Simula delay di rete
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock: cerca il cliente o usa il demo
        const client = mockClients.find((c) => c.email === email) || mockClients[1];

        if (client) {
          set({ user: client, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ error: 'Credenziali non valide', isLoading: false });
        return false;
      },

      loginAsProfessional: async (email: string, _password: string) => {
        set({ isLoading: true, error: null });

        await new Promise((resolve) => setTimeout(resolve, 800));

        const professional = mockProfessionals.find((p) => p.email === email) || mockProfessionals[0];

        if (professional) {
          set({ user: professional, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ error: 'Credenziali non valide', isLoading: false });
        return false;
      },

      registerClient: async (data: Partial<Client>) => {
        set({ isLoading: true, error: null });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock: crea nuovo cliente
        const newClient: Client = {
          id: `client-${Date.now()}`,
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          role: 'client',
          address: data.address || {
            street: '',
            city: 'Milano',
            postalCode: '',
            province: 'MI',
            latitude: 45.4642,
            longitude: 9.19,
          },
          favoritesProfessionals: [],
          createdAt: new Date(),
        };

        set({ user: newClient, isAuthenticated: true, isLoading: false });
        return true;
      },

      registerProfessional: async (data: Partial<Professional>) => {
        set({ isLoading: true, error: null });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newProfessional: Professional = {
          id: `prof-${Date.now()}`,
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          role: 'professional',
          bio: data.bio || '',
          partitaIva: data.partitaIva || '',
          plan: data.plan || 'free',
          rating: 0,
          reviewCount: 0,
          isVerified: false,
          isInsured: false,
          coverageRadius: data.coverageRadius || 10,
          baseLocation: data.baseLocation || {
            street: '',
            city: 'Milano',
            postalCode: '',
            province: 'MI',
            latitude: 45.4642,
            longitude: 9.19,
          },
          services: data.services || [],
          availability: data.availability || {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          },
          isMarketplaceVisible: true,
          createdAt: new Date(),
        };

        set({ user: newProfessional, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'treat-u-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
