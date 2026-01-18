import { create } from 'zustand';
import { Booking, Service, Address, Professional } from '../types';
import { mockBookings } from '../data/mockData';

// ============================================
// TYPES
// ============================================

interface BookingDraft {
  professional: Professional | null;
  service: Service | null;
  date: Date | null;
  time: string | null;
  address: Address | null;
  notes: string;
}

interface BookingState {
  bookings: Booking[];
  currentDraft: BookingDraft;
  isLoading: boolean;

  // Draft actions
  setProfessional: (professional: Professional) => void;
  setService: (service: Service) => void;
  setDateTime: (date: Date, time: string) => void;
  setAddress: (address: Address) => void;
  setNotes: (notes: string) => void;
  resetDraft: () => void;

  // Booking actions
  createBooking: (clientId: string) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  getBookingsForProfessional: (professionalId: string) => Booking[];
  getBookingsForClient: (clientId: string) => Booking[];
  getPendingBookings: (professionalId: string) => Booking[];
}

const initialDraft: BookingDraft = {
  professional: null,
  service: null,
  date: null,
  time: null,
  address: null,
  notes: '',
};

// ============================================
// STORE
// ============================================

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [...mockBookings],
  currentDraft: { ...initialDraft },
  isLoading: false,

  setProfessional: (professional) => {
    set((state) => ({
      currentDraft: { ...state.currentDraft, professional },
    }));
  },

  setService: (service) => {
    set((state) => ({
      currentDraft: { ...state.currentDraft, service },
    }));
  },

  setDateTime: (date, time) => {
    set((state) => ({
      currentDraft: { ...state.currentDraft, date, time },
    }));
  },

  setAddress: (address) => {
    set((state) => ({
      currentDraft: { ...state.currentDraft, address },
    }));
  },

  setNotes: (notes) => {
    set((state) => ({
      currentDraft: { ...state.currentDraft, notes },
    }));
  },

  resetDraft: () => {
    set({ currentDraft: { ...initialDraft } });
  },

  createBooking: async (clientId) => {
    set({ isLoading: true });

    const { currentDraft } = get();

    // Simula delay di rete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const [hours, minutes] = (currentDraft.time || '10:00').split(':').map(Number);
    const endTime = `${(hours + Math.ceil((currentDraft.service?.duration || 60) / 60))
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      clientId,
      client: {
        id: clientId,
        firstName: 'Cliente',
        lastName: 'Demo',
        phone: '+39 333 0000000',
      },
      professionalId: currentDraft.professional?.id || '',
      professional: {
        id: currentDraft.professional?.id || '',
        firstName: currentDraft.professional?.firstName || '',
        lastName: currentDraft.professional?.lastName || '',
        phone: currentDraft.professional?.phone || '',
        avatar: currentDraft.professional?.avatar,
      },
      service: currentDraft.service!,
      date: currentDraft.date!,
      startTime: currentDraft.time!,
      endTime,
      address: currentDraft.address!,
      notes: currentDraft.notes || undefined,
      status: 'pending',
      totalPrice: currentDraft.service?.price || 0,
      createdAt: new Date(),
    };

    set((state) => ({
      bookings: [...state.bookings, newBooking],
      currentDraft: { ...initialDraft },
      isLoading: false,
    }));

    return newBooking;
  },

  updateBookingStatus: (bookingId, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status } : b
      ),
    }));
  },

  getBookingsForProfessional: (professionalId) => {
    return get().bookings.filter((b) => b.professionalId === professionalId);
  },

  getBookingsForClient: (clientId) => {
    return get().bookings.filter((b) => b.clientId === clientId);
  },

  getPendingBookings: (professionalId) => {
    return get().bookings.filter(
      (b) => b.professionalId === professionalId && b.status === 'pending'
    );
  },
}));
