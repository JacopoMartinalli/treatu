export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'client' | 'professional' | 'admin'
export type ProfessionalStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type DocumentType = 'id_card' | 'partita_iva' | 'certification' | 'insurance' | 'other'
export type DocumentStatus = 'pending' | 'approved' | 'rejected'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
export type BookingType = 'direct' | 'request'
export type PaymentStatus = 'pending' | 'completed' | 'refunded' | 'failed'
export type NotificationType =
  | 'booking_request' | 'booking_confirmed' | 'booking_rejected' | 'booking_cancelled'
  | 'booking_completed' | 'payment_received' | 'new_message' | 'reminder'
  | 'review_received' | 'verification_update'
export type BodyArea =
  | 'head' | 'face' | 'neck' | 'shoulders' | 'upper_back' | 'lower_back'
  | 'chest' | 'arms' | 'hands' | 'abdomen' | 'hips' | 'glutes'
  | 'upper_legs' | 'lower_legs' | 'feet' | 'full_body'
export type NeedType =
  | 'pain' | 'relaxation' | 'sport_recovery' | 'aesthetic' | 'posture'
  | 'circulation' | 'stress' | 'rehabilitation' | 'wellness'

// ============================================
// Row types (matching DB tables)
// ============================================

export interface DbUser {
  id: string
  email: string
  phone: string | null
  role: UserRole
  first_name: string
  last_name: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface DbClientProfile {
  id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface DbClientAddress {
  id: string
  client_id: string
  label: string
  street: string
  city: string
  postal_code: string
  province: string
  latitude: number
  longitude: number
  is_default: boolean
  created_at: string
}

export interface DbProfessionalProfile {
  id: string
  user_id: string
  display_name: string
  bio: string | null
  photo_url: string | null
  gallery_urls: string[]
  specializations: string[]
  status: ProfessionalStatus
  coverage_radius_km: number
  coverage_center_lat: number | null
  coverage_center_lng: number | null
  stripe_account_id: string | null
  avg_rating: number
  total_reviews: number
  is_insured: boolean
  created_at: string
  updated_at: string
}

export interface DbProfessionalDocument {
  id: string
  professional_id: string
  type: DocumentType
  file_url: string
  status: DocumentStatus
  notes: string | null
  reviewed_at: string | null
  created_at: string
}

export interface DbTreatment {
  id: string
  name: string
  description: string | null
  category: string
  body_areas: BodyArea[]
  need_types: NeedType[]
  default_duration_minutes: number
  is_active: boolean
  created_at: string
}

export interface DbService {
  id: string
  professional_id: string
  treatment_id: string | null
  name: string
  description: string | null
  duration_minutes: number
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DbAvailability {
  id: string
  professional_id: string
  day_of_week: number | null
  specific_date: string | null
  start_time: string
  end_time: string
  is_recurring: boolean
  is_blocked: boolean
  created_at: string
}

export interface DbBooking {
  id: string
  client_id: string
  professional_id: string
  service_id: string
  status: BookingStatus
  booking_type: BookingType
  date: string
  start_time: string
  end_time: string
  address_text: string
  latitude: number
  longitude: number
  notes: string | null
  price: number
  commission_amount: number
  is_first_client: boolean
  created_at: string
  updated_at: string
}

export interface DbPayment {
  id: string
  booking_id: string
  client_id: string
  professional_id: string
  amount: number
  commission: number
  net_amount: number
  stripe_payment_id: string | null
  status: PaymentStatus
  created_at: string
}

export interface DbReview {
  id: string
  booking_id: string
  reviewer_id: string
  reviewed_id: string
  reviewer_role: UserRole
  rating: number
  text: string | null
  created_at: string
}

export interface DbFavorite {
  id: string
  client_id: string
  professional_id: string
  created_at: string
}

export interface DbConversation {
  id: string
  booking_id: string | null
  client_id: string
  professional_id: string
  last_message_at: string | null
  created_at: string
}

export interface DbMessage {
  id: string
  conversation_id: string
  sender_id: string
  text: string
  read_at: string | null
  created_at: string
}

export interface DbNotification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  data: Json
  read_at: string | null
  created_at: string
}

export interface DbAdminAction {
  id: string
  admin_id: string
  action_type: string
  target_user_id: string | null
  notes: string | null
  created_at: string
}

// ============================================
// Supabase Database type (for createClient<Database>)
// ============================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: DbUser
        Insert: Omit<DbUser, 'created_at' | 'updated_at'>
        Update: Partial<Omit<DbUser, 'id' | 'created_at'>>
      }
      client_profiles: {
        Row: DbClientProfile
        Insert: Omit<DbClientProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DbClientProfile, 'id' | 'created_at'>>
      }
      client_addresses: {
        Row: DbClientAddress
        Insert: Omit<DbClientAddress, 'id' | 'created_at'>
        Update: Partial<Omit<DbClientAddress, 'id' | 'created_at'>>
      }
      professional_profiles: {
        Row: DbProfessionalProfile
        Insert: Omit<DbProfessionalProfile, 'id' | 'created_at' | 'updated_at' | 'avg_rating' | 'total_reviews'>
        Update: Partial<Omit<DbProfessionalProfile, 'id' | 'created_at'>>
      }
      professional_documents: {
        Row: DbProfessionalDocument
        Insert: Omit<DbProfessionalDocument, 'id' | 'created_at'>
        Update: Partial<Omit<DbProfessionalDocument, 'id' | 'created_at'>>
      }
      treatments: {
        Row: DbTreatment
        Insert: Omit<DbTreatment, 'id' | 'created_at'>
        Update: Partial<Omit<DbTreatment, 'id' | 'created_at'>>
      }
      services: {
        Row: DbService
        Insert: Omit<DbService, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DbService, 'id' | 'created_at'>>
      }
      availability: {
        Row: DbAvailability
        Insert: Omit<DbAvailability, 'id' | 'created_at'>
        Update: Partial<Omit<DbAvailability, 'id' | 'created_at'>>
      }
      bookings: {
        Row: DbBooking
        Insert: Omit<DbBooking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DbBooking, 'id' | 'created_at'>>
      }
      payments: {
        Row: DbPayment
        Insert: Omit<DbPayment, 'id' | 'created_at'>
        Update: Partial<Omit<DbPayment, 'id' | 'created_at'>>
      }
      reviews: {
        Row: DbReview
        Insert: Omit<DbReview, 'id' | 'created_at'>
        Update: Partial<Omit<DbReview, 'id' | 'created_at'>>
      }
      favorites: {
        Row: DbFavorite
        Insert: Omit<DbFavorite, 'id' | 'created_at'>
        Update: Partial<Omit<DbFavorite, 'id' | 'created_at'>>
      }
      conversations: {
        Row: DbConversation
        Insert: Omit<DbConversation, 'id' | 'created_at'>
        Update: Partial<Omit<DbConversation, 'id' | 'created_at'>>
      }
      messages: {
        Row: DbMessage
        Insert: Omit<DbMessage, 'id' | 'created_at'>
        Update: Partial<Omit<DbMessage, 'id' | 'created_at'>>
      }
      notifications: {
        Row: DbNotification
        Insert: Omit<DbNotification, 'id' | 'created_at'>
        Update: Partial<Omit<DbNotification, 'id' | 'created_at'>>
      }
      admin_actions: {
        Row: DbAdminAction
        Insert: Omit<DbAdminAction, 'id' | 'created_at'>
        Update: Partial<Omit<DbAdminAction, 'id' | 'created_at'>>
      }
    }
    Enums: {
      user_role: UserRole
      professional_status: ProfessionalStatus
      document_type: DocumentType
      document_status: DocumentStatus
      booking_status: BookingStatus
      booking_type: BookingType
      payment_status: PaymentStatus
      notification_type: NotificationType
      body_area: BodyArea
      need_type: NeedType
    }
  }
}
