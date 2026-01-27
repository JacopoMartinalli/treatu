import { create } from 'zustand';
import { Review } from '../types';
import { mockReviews } from '../data/mockData';

// ============================================
// TYPES
// ============================================

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;

  // Actions
  getReviewsByProfessionalId: (professionalId: string) => Review[];
  getReviewsByClientId: (clientId: string) => Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<Review>;
  getAverageRating: (professionalId: string) => number;
  getReviewCount: (professionalId: string) => number;
}

// ============================================
// STORE
// ============================================

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [...mockReviews],
  isLoading: false,

  getReviewsByProfessionalId: (professionalId: string) => {
    return get()
      .reviews.filter((r) => r.professionalId === professionalId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getReviewsByClientId: (clientId: string) => {
    return get()
      .reviews.filter((r) => r.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addReview: async (reviewData) => {
    set({ isLoading: true });

    // Simula delay di rete
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date(),
    };

    set((state) => ({
      reviews: [newReview, ...state.reviews],
      isLoading: false,
    }));

    return newReview;
  },

  getAverageRating: (professionalId: string) => {
    const reviews = get().reviews.filter((r) => r.professionalId === professionalId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  },

  getReviewCount: (professionalId: string) => {
    return get().reviews.filter((r) => r.professionalId === professionalId).length;
  },
}));
