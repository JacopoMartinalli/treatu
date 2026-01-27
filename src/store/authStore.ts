import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session } from '@supabase/supabase-js'
import type { DbUser } from '../types/database'
import { Client, Professional } from '../types'
import { mockClients, mockProfessionals } from '../data/mockData'

// ============================================
// Dual-mode auth store:
// - When Supabase is configured: uses real auth (DbUser)
// - Fallback: uses mock data (Client | Professional)
// ============================================

type LegacyUser = Client | Professional
type AppUser = DbUser | LegacyUser | null

interface AuthState {
  user: AppUser
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // New Supabase setters
  setUser: (user: DbUser | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  logout: () => void

  // Legacy mock methods (for existing pages)
  loginAsClient: (email: string, password: string) => Promise<boolean>
  loginAsProfessional: (email: string, password: string) => Promise<boolean>
  registerClient: (data: Partial<Client>) => Promise<boolean>
  registerProfessional: (data: Partial<Professional>) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // -- Supabase setters --
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ session, isAuthenticated: !!session }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      logout: () => set({ user: null, session: null, isAuthenticated: false, error: null }),

      // -- Legacy mock methods (will be removed once Supabase auth pages are built) --
      loginAsClient: async (email: string, _password: string) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 800))
        const client = mockClients.find((c) => c.email === email) || mockClients[1]
        if (client) {
          set({ user: client, isAuthenticated: true, isLoading: false })
          return true
        }
        set({ error: 'Credenziali non valide', isLoading: false })
        return false
      },

      loginAsProfessional: async (email: string, _password: string) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 800))
        const pro = mockProfessionals.find((p) => p.email === email) || mockProfessionals[0]
        if (pro) {
          set({ user: pro, isAuthenticated: true, isLoading: false })
          return true
        }
        set({ error: 'Credenziali non valide', isLoading: false })
        return false
      },

      registerClient: async (data: Partial<Client>) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 1000))
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
        }
        set({ user: newClient, isAuthenticated: true, isLoading: false })
        return true
      },

      registerProfessional: async (data: Partial<Professional>) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 1000))
        const newPro: Professional = {
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
            monday: [], tuesday: [], wednesday: [], thursday: [],
            friday: [], saturday: [], sunday: [],
          },
          isMarketplaceVisible: true,
          createdAt: new Date(),
        }
        set({ user: newPro, isAuthenticated: true, isLoading: false })
        return true
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
)
