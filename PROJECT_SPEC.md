# TreatU — Specifica di Progetto

## Vision
TreatU connette professionisti del benessere e della salute con clienti che cercano trattamenti a domicilio. I professionisti guadagnano extra lavorando quando vogliono, i clienti ricevono servizi comodamente a casa.

---

## Modello di Business

| Voce | Dettaglio |
|------|-----------|
| **Abbonamento Pro** | Mensile / 3 mesi (-15%) / 12 mesi (-30%). Prezzi da definire. |
| **Commissione** | % sul primo cliente acquisito tramite la piattaforma. Successivi appuntamenti con lo stesso cliente: nessuna commissione. |
| **Pagamento** | Obbligatorio in-app. Il cliente paga tramite app, il professionista riceve il netto sul proprio conto. |

---

## Utenti

### Professionista
- Categorie: massaggiatori, estetiste, parrucchieri, nail artist, fisioterapisti, osteopati, nutrizionisti, personal trainer, e altri professionisti del benessere/salute
- Lavora **solo a domicilio** del cliente
- Deve essere **approvato manualmente** dal team TreatU prima di essere visibile
- Imposta zona di copertura: raggio km + possibilita di escludere/aggiungere zone specifiche

### Cliente
- Cerca professionisti nella propria zona
- Prenota trattamenti a domicilio
- Paga tramite l'app

---

## Funzionalita — Professionista

### Registrazione e Onboarding
- [ ] Registrazione (email/telefono + password, oppure social login)
- [ ] Upload documenti (P.IVA, certificazioni, documento identita)
- [ ] Stato: "In attesa di approvazione" → approvato dal team TreatU → attivo
- [ ] Compilazione profilo: foto, bio, specializzazioni

### Profilo Pubblico
- [ ] Foto profilo + galleria lavori
- [ ] Bio e descrizione
- [ ] Listino servizi personalizzato (nome servizio, durata, prezzo)
- [ ] Recensioni ricevute dai clienti (stelle + testo)
- [ ] Badge "Verificato"
- [ ] Zona di copertura visibile

### Calendario / Agenda Digitale
- [ ] Impostazione disponibilita settimanale ricorrente (es. Lun 9-18, Mar 10-14)
- [ ] Override per giorni specifici (vacanze, impegni)
- [ ] Blocco slot manuale
- [ ] Vista giornaliera/settimanale/mensile degli appuntamenti
- [ ] Sync con calendario esterno (Google Calendar) — futuro

### Prenotazioni
- [ ] Ricezione prenotazioni dirette (il cliente sceglie uno slot libero)
- [ ] Ricezione richieste di prenotazione (il cliente propone, il pro conferma o propone alternativa)
- [ ] Conferma / rifiuto / proposta alternativa
- [ ] Dettagli appuntamento: cliente, servizio, indirizzo, data/ora, note
- [ ] Storico appuntamenti completati

### Chat
- [ ] Chat in-app con i clienti (per organizzare dettagli pre-appuntamento)
- [ ] Notifiche nuovi messaggi
- [ ] Chat associata alla prenotazione

### Pagamenti
- [ ] Dashboard guadagni (totale, mensile, per servizio)
- [ ] Storico transazioni
- [ ] Payout automatico su conto bancario (tramite Stripe Connect)
- [ ] Ricevute/fatture

### Recensioni
- [ ] Visualizzazione recensioni ricevute dai clienti
- [ ] Possibilita di recensire il cliente dopo l'appuntamento (bidirezionale)

### Notifiche
- [ ] Nuova prenotazione / richiesta
- [ ] Messaggio in chat
- [ ] Promemoria appuntamento (es. 1h prima)
- [ ] Pagamento ricevuto
- [ ] Aggiornamento stato verifica

### Dashboard
- [ ] Riepilogo: prossimi appuntamenti, guadagni del mese, nuove richieste
- [ ] Statistiche: appuntamenti completati, tasso di accettazione, valutazione media

---

## Funzionalita — Cliente

### Registrazione e Onboarding
- [ ] Registrazione (email/telefono + password, oppure social login)
- [ ] Compilazione profilo: nome, foto, indirizzo principale

### Ricerca e Scoperta
- [ ] Ricerca per zona (indirizzo o geolocalizzazione)
- [ ] Filtri: categoria, servizio, prezzo, valutazione, disponibilita
- [ ] Mappa con professionisti disponibili (Leaflet)
- [ ] Lista risultati con preview (foto, nome, valutazione, servizi, distanza)

### Profilo Professionista (vista cliente)
- [ ] Profilo completo con galleria, bio, listino
- [ ] Recensioni
- [ ] Disponibilita visibile
- [ ] Bottone prenota / richiedi appuntamento

### Prenotazione
- [ ] Selezione servizio dal listino
- [ ] Prenotazione diretta su slot libero (se disponibilita aperta)
- [ ] Richiesta appuntamento con proposta data/ora (se prenotazione con conferma)
- [ ] Conferma indirizzo domicilio
- [ ] Note per il professionista
- [ ] Riepilogo e conferma

### Pagamento
- [ ] Pagamento obbligatorio in-app (carta di credito/debito)
- [ ] Storico pagamenti
- [ ] Ricevute

### Chat
- [ ] Chat in-app con il professionista
- [ ] Notifiche nuovi messaggi

### Recensioni
- [ ] Lasciare recensione dopo il trattamento (stelle + testo)
- [ ] Visualizzare recensioni ricevute dal professionista (bidirezionale)

### Preferiti
- [ ] Salvare professionisti preferiti
- [ ] Lista preferiti

### Prenotazioni
- [ ] Lista prenotazioni (upcoming + passate)
- [ ] Dettaglio prenotazione
- [ ] Cancellazione (gratuita fino a 24h prima)
- [ ] Ri-prenotare con lo stesso professionista

### Notifiche
- [ ] Conferma prenotazione
- [ ] Messaggio in chat
- [ ] Promemoria appuntamento
- [ ] Richiesta di recensione post-trattamento

---

## Funzionalita — Admin (Team TreatU)

- [ ] Dashboard admin
- [ ] Approvazione/rifiuto professionisti (con revisione documenti)
- [ ] Gestione utenti (clienti + professionisti)
- [ ] Gestione segnalazioni/dispute
- [ ] Statistiche piattaforma (utenti, prenotazioni, revenue)
- [ ] Gestione abbonamenti e commissioni

---

## Stack Tecnico Consigliato

### Frontend (attuale)
- **React 19** + TypeScript
- **Vite** (bundler)
- **Tailwind CSS** (styling)
- **React Router** (navigazione)
- **Zustand** (state management)
- **Framer Motion** (animazioni)
- **React Query** (data fetching)
- **Leaflet** (mappe)

### Backend (da implementare)
- **Supabase** (consigliato) oppure Firebase
  - Auth (email, social login, telefono)
  - Database PostgreSQL (Supabase) / Firestore (Firebase)
  - Storage (foto profilo, galleria, documenti)
  - Realtime (chat, notifiche)
  - Edge Functions (logica server-side)
- **Stripe Connect** — pagamenti marketplace (cliente paga → TreatU trattiene commissione → pro riceve netto)

### Distribuzione
- **PWA** (Progressive Web App) — per andare live velocemente
  - Installabile da browser su iOS e Android
  - Notifiche push (con limitazioni su iOS)
  - Funziona offline per le parti essenziali
- **Capacitor** (futuro) — per pubblicare sugli store come app nativa wrappata
- **Hosting**: Vercel o Netlify (frontend), Supabase Cloud (backend)

---

## Database — Schema Principale

### users
- id, email, phone, password_hash, role (client/professional/admin), created_at

### professional_profiles
- id, user_id, display_name, bio, photo_url, gallery_urls[], specializations[], status (pending/approved/rejected), coverage_radius_km, coverage_center_lat, coverage_center_lng, excluded_zones[], included_zones[], plan (free/pro), plan_expires_at, stripe_account_id, avg_rating, total_reviews, documents_urls[]

### services (listino)
- id, professional_id, name, description, duration_minutes, price, category, is_active

### availability
- id, professional_id, day_of_week (0-6), start_time, end_time, is_recurring
- id, professional_id, specific_date, start_time, end_time, is_blocked

### bookings
- id, client_id, professional_id, service_id, status (pending/confirmed/completed/cancelled), booking_type (direct/request), date, start_time, end_time, address, lat, lng, notes, price, commission_amount, is_first_client, created_at

### payments
- id, booking_id, client_id, professional_id, amount, commission, net_amount, stripe_payment_id, status, created_at

### reviews
- id, booking_id, reviewer_id, reviewed_id, reviewer_role (client/professional), rating (1-5), text, created_at

### messages
- id, booking_id, sender_id, receiver_id, text, read_at, created_at

### conversations
- id, booking_id, client_id, professional_id, last_message_at

### notifications
- id, user_id, type, title, body, data_json, read_at, created_at

### admin_actions
- id, admin_id, action_type, target_user_id, notes, created_at

---

## Fasi di Sviluppo

### Fase 1 — MVP (Minimum Viable Product)
1. Setup Supabase (auth, database, storage)
2. Autenticazione reale (registrazione/login)
3. Profilo professionista (CRUD + upload foto/documenti)
4. Listino servizi personalizzato
5. Calendario/disponibilita
6. Ricerca clienti (zona + filtri)
7. Prenotazione (diretta + richiesta)
8. Pagamento in-app (Stripe Connect)
9. Chat base
10. Notifiche in-app
11. Pannello admin (approvazione professionisti)
12. PWA setup (installabile)
13. Deploy su Vercel + Supabase Cloud

### Fase 2 — Post-MVP
- Recensioni bidirezionali
- Dashboard statistiche pro
- Notifiche push
- Sync Google Calendar
- Sistema di segnalazioni/dispute
- Gestione abbonamenti (Stripe Billing)

### Fase 3 — Scale
- App nativa con Capacitor (Apple Store + Google Play)
- Sistema referral
- Programma fedelta clienti
- Multi-lingua
- Espansione geografica
