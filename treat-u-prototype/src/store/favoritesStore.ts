import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Professional } from '../types';
import { mockProfessionals } from '../data/mockData';

// ============================================
// TYPES
// ============================================

interface FavoritesState {
  favoriteIds: string[];

  // Actions
  addFavorite: (professionalId: string) => void;
  removeFavorite: (professionalId: string) => void;
  toggleFavorite: (professionalId: string) => void;
  isFavorite: (professionalId: string) => boolean;
  getFavorites: () => Professional[];
}

// ============================================
// STORE
// ============================================

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: ['prof-001', 'prof-004'], // Demo: alcuni preferiti iniziali

      addFavorite: (professionalId: string) => {
        set((state) => ({
          favoriteIds: [...new Set([...state.favoriteIds, professionalId])],
        }));
      },

      removeFavorite: (professionalId: string) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== professionalId),
        }));
      },

      toggleFavorite: (professionalId: string) => {
        const { favoriteIds, addFavorite, removeFavorite } = get();
        if (favoriteIds.includes(professionalId)) {
          removeFavorite(professionalId);
        } else {
          addFavorite(professionalId);
        }
      },

      isFavorite: (professionalId: string) => {
        return get().favoriteIds.includes(professionalId);
      },

      getFavorites: () => {
        const { favoriteIds } = get();
        return mockProfessionals.filter((p) => favoriteIds.includes(p.id));
      },
    }),
    {
      name: 'treat-u-favorites',
    }
  )
);
