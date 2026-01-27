// ============================================
// TIPI BASE
// ============================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  createdAt: Date;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  province: string;
  latitude: number;
  longitude: number;
}

// ============================================
// CLIENTE
// ============================================

export interface Client extends User {
  role: 'client';
  address: Address;
  favoritesProfessionals: string[];
}

// ============================================
// PROFESSIONISTA
// ============================================

export type PlanType = 'free' | 'premium';

export interface Professional extends User {
  role: 'professional';
  bio: string;
  partitaIva: string;
  plan: PlanType;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isInsured: boolean;
  coverageRadius: number; // in km
  baseLocation: Address;
  services: Service[];
  availability: WeeklyAvailability;
  isMarketplaceVisible: boolean;
  nextAvailableSlot?: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minuti
  price: number;
  category: ServiceCategory;
}

export type ServiceCategory =
  | 'rilassante'
  | 'decontratturante'
  | 'sportivo'
  | 'linfodrenante'
  | 'anticellulite'
  | 'olistico'
  | 'altro';

export interface WeeklyAvailability {
  monday: DaySlot[];
  tuesday: DaySlot[];
  wednesday: DaySlot[];
  thursday: DaySlot[];
  friday: DaySlot[];
  saturday: DaySlot[];
  sunday: DaySlot[];
}

export interface DaySlot {
  start: string; // HH:mm format
  end: string;   // HH:mm format
  isAvailable: boolean;
}

// ============================================
// RECENSIONI
// ============================================

export interface Review {
  id: string;
  professionalId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  serviceId: string;
  serviceName: string;
  createdAt: Date;
}

// ============================================
// PRENOTAZIONI
// ============================================

export type BookingStatus =
  | 'pending'      // In attesa di conferma
  | 'confirmed'    // Confermata
  | 'rejected'     // Rifiutata
  | 'completed'    // Completata
  | 'cancelled';   // Cancellata

export interface Booking {
  id: string;
  clientId: string;
  client: Pick<Client, 'id' | 'firstName' | 'lastName' | 'phone' | 'avatar'>;
  professionalId: string;
  professional: Pick<Professional, 'id' | 'firstName' | 'lastName' | 'phone' | 'avatar'>;
  service: Service;
  date: Date;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  address: Address;
  notes?: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: Date;
}

// ============================================
// FILTRI RICERCA
// ============================================

export interface SearchFilters {
  query?: string;
  serviceCategory?: ServiceCategory;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  date?: Date;
  timeSlot?: 'morning' | 'afternoon' | 'evening';
  onlyVerified?: boolean;
  sortBy?: 'rating' | 'price' | 'distance' | 'availability';
}

// ============================================
// FORM TYPES
// ============================================

export interface ClientRegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
}

export interface ProfessionalRegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  partitaIva: string;
  plan: PlanType;
  bio: string;
  baseLocation: Address;
  coverageRadius: number;
  services: Service[];
  availability: WeeklyAvailability;
}

// ============================================
// NOTIFICHE
// ============================================

export interface Notification {
  id: string;
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'review' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

// ============================================
// MESSAGGI E CONVERSAZIONI
// ============================================

export interface Conversation {
  id: string;
  participants: {
    clientId: string;
    clientName: string;
    clientAvatar?: string;
    professionalId: string;
    professionalName: string;
    professionalAvatar?: string;
  };
  bookingId?: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'client' | 'professional';
  content: string;
  type: 'text' | 'image' | 'booking_update';
  read: boolean;
  createdAt: Date;
}

// ============================================
// STATISTICHE DASHBOARD
// ============================================

export interface ProfessionalStats {
  weeklyAppointments: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  pendingRequests: number;
}
