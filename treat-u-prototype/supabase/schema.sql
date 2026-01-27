-- ============================================
-- TreatU Database Schema — Fase 1 MVP
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

create type user_role as enum ('client', 'professional', 'admin');
create type professional_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type document_type as enum ('id_card', 'partita_iva', 'certification', 'insurance', 'other');
create type document_status as enum ('pending', 'approved', 'rejected');
create type booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'rejected');
create type booking_type as enum ('direct', 'request');
create type payment_status as enum ('pending', 'completed', 'refunded', 'failed');
create type notification_type as enum (
  'booking_request', 'booking_confirmed', 'booking_rejected', 'booking_cancelled',
  'booking_completed', 'payment_received', 'new_message', 'reminder',
  'review_received', 'verification_update'
);
create type body_area as enum (
  'head', 'face', 'neck', 'shoulders', 'upper_back', 'lower_back',
  'chest', 'arms', 'hands', 'abdomen', 'hips', 'glutes',
  'upper_legs', 'lower_legs', 'feet', 'full_body'
);
create type need_type as enum (
  'pain', 'relaxation', 'sport_recovery', 'aesthetic', 'posture',
  'circulation', 'stress', 'rehabilitation', 'wellness'
);

-- ============================================
-- USERS (extends Supabase auth.users)
-- ============================================

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  phone text,
  role user_role not null default 'client',
  first_name text not null,
  last_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- CLIENT PROFILES
-- ============================================

create table public.client_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_addresses (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.client_profiles(id) on delete cascade,
  label text not null default 'Casa',
  street text not null,
  city text not null,
  postal_code text not null,
  province text not null,
  latitude double precision not null,
  longitude double precision not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- PROFESSIONAL PROFILES
-- ============================================

create table public.professional_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  display_name text not null,
  bio text,
  photo_url text,
  gallery_urls text[] default '{}',
  specializations text[] default '{}',
  status professional_status not null default 'pending',
  coverage_radius_km integer not null default 15,
  coverage_center_lat double precision,
  coverage_center_lng double precision,
  stripe_account_id text,
  avg_rating numeric(3,2) default 0,
  total_reviews integer default 0,
  is_insured boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.professional_documents (
  id uuid primary key default uuid_generate_v4(),
  professional_id uuid not null references public.professional_profiles(id) on delete cascade,
  type document_type not null,
  file_url text not null,
  status document_status not null default 'pending',
  notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================
-- TREATMENTS (knowledge base / catalogo)
-- ============================================

create table public.treatments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  category text not null,
  body_areas body_area[] default '{}',
  need_types need_type[] default '{}',
  default_duration_minutes integer not null default 60,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================
-- SERVICES (listino personalizzato del pro)
-- ============================================

create table public.services (
  id uuid primary key default uuid_generate_v4(),
  professional_id uuid not null references public.professional_profiles(id) on delete cascade,
  treatment_id uuid references public.treatments(id),
  name text not null,
  description text,
  duration_minutes integer not null default 60,
  price numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- AVAILABILITY
-- ============================================

create table public.availability (
  id uuid primary key default uuid_generate_v4(),
  professional_id uuid not null references public.professional_profiles(id) on delete cascade,
  day_of_week smallint check (day_of_week between 0 and 6), -- 0=Sun
  specific_date date,
  start_time time not null,
  end_time time not null,
  is_recurring boolean not null default true,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),

  constraint availability_type_check check (
    (is_recurring = true and day_of_week is not null and specific_date is null)
    or (is_recurring = false and specific_date is not null)
  )
);

-- ============================================
-- BOOKINGS
-- ============================================

create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.users(id),
  professional_id uuid not null references public.professional_profiles(id),
  service_id uuid not null references public.services(id),
  status booking_status not null default 'pending',
  booking_type booking_type not null default 'request',
  date date not null,
  start_time time not null,
  end_time time not null,
  address_text text not null,
  latitude double precision not null,
  longitude double precision not null,
  notes text,
  price numeric(10,2) not null,
  commission_amount numeric(10,2) default 0,
  is_first_client boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- PAYMENTS
-- ============================================

create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id),
  client_id uuid not null references public.users(id),
  professional_id uuid not null references public.professional_profiles(id),
  amount numeric(10,2) not null,
  commission numeric(10,2) not null default 0,
  net_amount numeric(10,2) not null,
  stripe_payment_id text,
  status payment_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ============================================
-- REVIEWS (bidirectional)
-- ============================================

create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id),
  reviewer_id uuid not null references public.users(id),
  reviewed_id uuid not null references public.users(id),
  reviewer_role user_role not null,
  rating smallint not null check (rating between 1 and 5),
  text text,
  created_at timestamptz not null default now(),

  constraint unique_review unique (booking_id, reviewer_id)
);

-- ============================================
-- FAVORITES
-- ============================================

create table public.favorites (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.users(id),
  professional_id uuid not null references public.professional_profiles(id),
  created_at timestamptz not null default now(),

  constraint unique_favorite unique (client_id, professional_id)
);

-- ============================================
-- CONVERSATIONS & MESSAGES
-- ============================================

create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings(id),
  client_id uuid not null references public.users(id),
  professional_id uuid not null references public.professional_profiles(id),
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.users(id),
  text text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text not null,
  data jsonb default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================
-- ADMIN ACTIONS
-- ============================================

create table public.admin_actions (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid not null references public.users(id),
  action_type text not null,
  target_user_id uuid references public.users(id),
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_users_role on public.users(role);
create index idx_professional_status on public.professional_profiles(status);
create index idx_professional_location on public.professional_profiles(coverage_center_lat, coverage_center_lng);
create index idx_services_professional on public.services(professional_id);
create index idx_availability_professional on public.availability(professional_id);
create index idx_bookings_client on public.bookings(client_id);
create index idx_bookings_professional on public.bookings(professional_id);
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_date on public.bookings(date);
create index idx_payments_booking on public.payments(booking_id);
create index idx_reviews_reviewed on public.reviews(reviewed_id);
create index idx_favorites_client on public.favorites(client_id);
create index idx_messages_conversation on public.messages(conversation_id);
create index idx_notifications_user on public.notifications(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table public.users enable row level security;
alter table public.client_profiles enable row level security;
alter table public.client_addresses enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.professional_documents enable row level security;
alter table public.treatments enable row level security;
alter table public.services enable row level security;
alter table public.availability enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_actions enable row level security;

-- Users: can read own, admins can read all
create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Professional profiles: public read for approved, own for all statuses
create policy "Anyone can view approved professionals" on public.professional_profiles
  for select using (status = 'approved' or user_id = auth.uid());
create policy "Professionals can update own profile" on public.professional_profiles
  for update using (user_id = auth.uid());
create policy "Professionals can insert own profile" on public.professional_profiles
  for insert with check (user_id = auth.uid());

-- Professional documents: only own
create policy "Professionals can manage own documents" on public.professional_documents
  for all using (
    professional_id in (select id from public.professional_profiles where user_id = auth.uid())
  );

-- Client profiles: only own
create policy "Clients can manage own profile" on public.client_profiles
  for all using (user_id = auth.uid());

-- Client addresses: only own
create policy "Clients can manage own addresses" on public.client_addresses
  for all using (
    client_id in (select id from public.client_profiles where user_id = auth.uid())
  );

-- Treatments: public read
create policy "Anyone can read treatments" on public.treatments
  for select using (true);

-- Services: public read for active, own for all
create policy "Anyone can view active services" on public.services
  for select using (
    is_active = true
    or professional_id in (select id from public.professional_profiles where user_id = auth.uid())
  );
create policy "Professionals can manage own services" on public.services
  for all using (
    professional_id in (select id from public.professional_profiles where user_id = auth.uid())
  );

-- Availability: public read, own manage
create policy "Anyone can view availability" on public.availability
  for select using (true);
create policy "Professionals can manage own availability" on public.availability
  for all using (
    professional_id in (select id from public.professional_profiles where user_id = auth.uid())
  );

-- Bookings: parties can see their own
create policy "Users can view own bookings" on public.bookings
  for select using (
    client_id = auth.uid()
    or professional_id in (select id from public.professional_profiles where user_id = auth.uid())
  );
create policy "Clients can create bookings" on public.bookings
  for insert with check (client_id = auth.uid());
create policy "Parties can update own bookings" on public.bookings
  for update using (
    client_id = auth.uid()
    or professional_id in (select id from public.professional_profiles where user_id = auth.uid())
  );

-- Payments: parties only
create policy "Users can view own payments" on public.payments
  for select using (
    client_id = auth.uid()
    or professional_id in (select id from public.professional_profiles where user_id = auth.uid())
  );

-- Reviews: public read, parties can write
create policy "Anyone can read reviews" on public.reviews
  for select using (true);
create policy "Users can create reviews" on public.reviews
  for insert with check (reviewer_id = auth.uid());

-- Favorites: own only
create policy "Users can manage own favorites" on public.favorites
  for all using (client_id = auth.uid());

-- Conversations: parties only
create policy "Users can view own conversations" on public.conversations
  for select using (
    client_id = auth.uid()
    or professional_id in (select id from public.professional_profiles where user_id = auth.uid())
  );
create policy "Users can create conversations" on public.conversations
  for insert with check (client_id = auth.uid());

-- Messages: conversation parties only
create policy "Users can view messages in own conversations" on public.messages
  for select using (
    conversation_id in (
      select id from public.conversations
      where client_id = auth.uid()
        or professional_id in (select id from public.professional_profiles where user_id = auth.uid())
    )
  );
create policy "Users can send messages" on public.messages
  for insert with check (sender_id = auth.uid());

-- Notifications: own only
create policy "Users can view own notifications" on public.notifications
  for select using (user_id = auth.uid());
create policy "Users can update own notifications" on public.notifications
  for update using (user_id = auth.uid());

-- Admin actions: admins only
create policy "Admins can manage admin actions" on public.admin_actions
  for all using (
    auth.uid() in (select id from public.users where role = 'admin')
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create user row after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at before update on public.users
  for each row execute function public.update_updated_at();
create trigger update_client_profiles_updated_at before update on public.client_profiles
  for each row execute function public.update_updated_at();
create trigger update_professional_profiles_updated_at before update on public.professional_profiles
  for each row execute function public.update_updated_at();
create trigger update_services_updated_at before update on public.services
  for each row execute function public.update_updated_at();
create trigger update_bookings_updated_at before update on public.bookings
  for each row execute function public.update_updated_at();

-- ============================================
-- SEED: Treatments (Knowledge Base)
-- ============================================

insert into public.treatments (name, description, category, body_areas, need_types, default_duration_minutes) values
  ('Massaggio Rilassante', 'Massaggio rilassante per ridurre lo stress e favorire il benessere generale', 'massaggio', '{full_body,shoulders,upper_back,lower_back}', '{relaxation,stress,wellness}', 60),
  ('Massaggio Decontratturante', 'Massaggio profondo per sciogliere contratture e tensioni muscolari', 'massaggio', '{neck,shoulders,upper_back,lower_back}', '{pain,posture,stress}', 60),
  ('Massaggio Sportivo', 'Massaggio specifico per sportivi, pre e post attivita', 'massaggio', '{full_body,upper_legs,lower_legs,arms}', '{sport_recovery,pain,rehabilitation}', 45),
  ('Massaggio Linfodrenante', 'Stimola il sistema linfatico per ridurre gonfiori e ritenzione', 'massaggio', '{upper_legs,lower_legs,abdomen,arms}', '{circulation,aesthetic,wellness}', 60),
  ('Massaggio Anticellulite', 'Trattamento mirato per combattere la cellulite', 'massaggio', '{upper_legs,glutes,abdomen,hips}', '{aesthetic,circulation}', 45),
  ('Fisioterapia - Valutazione', 'Prima visita con valutazione posturale e funzionale', 'fisioterapia', '{full_body}', '{pain,posture,rehabilitation}', 60),
  ('Fisioterapia - Trattamento', 'Seduta di fisioterapia manuale', 'fisioterapia', '{neck,shoulders,upper_back,lower_back,upper_legs,lower_legs}', '{pain,posture,rehabilitation}', 50),
  ('Osteopatia', 'Trattamento osteopatico globale', 'osteopatia', '{full_body,head,neck,upper_back,lower_back}', '{pain,posture,wellness}', 60),
  ('Consulenza Nutrizionale', 'Visita con piano alimentare personalizzato', 'nutrizione', '{full_body}', '{wellness}', 60),
  ('Personal Training', 'Sessione di allenamento personalizzato a domicilio', 'fitness', '{full_body}', '{sport_recovery,wellness,posture}', 60),
  ('Yoga a Domicilio', 'Lezione privata di yoga', 'fitness', '{full_body}', '{relaxation,stress,wellness,posture}', 60),
  ('Massaggio Hot Stone', 'Massaggio con pietre calde vulcaniche', 'massaggio', '{full_body,upper_back,lower_back}', '{relaxation,stress,wellness}', 75);
