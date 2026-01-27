import {
  Professional,
  Client,
  Service,
  Review,
  Booking,
  WeeklyAvailability,
  ServiceCategory,
} from '../types';
import { addDays, addHours, setHours, setMinutes } from 'date-fns';

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateId = () => Math.random().toString(36).substring(2, 15);

const createDefaultAvailability = (): WeeklyAvailability => ({
  monday: [
    { start: '09:00', end: '13:00', isAvailable: true },
    { start: '14:00', end: '19:00', isAvailable: true },
  ],
  tuesday: [
    { start: '09:00', end: '13:00', isAvailable: true },
    { start: '14:00', end: '19:00', isAvailable: true },
  ],
  wednesday: [
    { start: '09:00', end: '13:00', isAvailable: true },
    { start: '14:00', end: '19:00', isAvailable: true },
  ],
  thursday: [
    { start: '09:00', end: '13:00', isAvailable: true },
    { start: '14:00', end: '19:00', isAvailable: true },
  ],
  friday: [
    { start: '09:00', end: '13:00', isAvailable: true },
    { start: '14:00', end: '19:00', isAvailable: true },
  ],
  saturday: [
    { start: '10:00', end: '14:00', isAvailable: true },
  ],
  sunday: [],
});

// ============================================
// SERVIZI MOCK
// ============================================

const createServices = (professionalType: 'classic' | 'sport' | 'wellness' | 'luxury'): Service[] => {
  const baseServices: Record<string, Service[]> = {
    classic: [
      {
        id: generateId(),
        name: 'Massaggio Rilassante',
        description: 'Un massaggio delicato per rilassare corpo e mente, ideale per ridurre stress e tensioni quotidiane.',
        duration: 60,
        price: 65,
        category: 'rilassante' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Massaggio Decontratturante',
        description: 'Trattamento mirato per sciogliere contratture muscolari e rigidità. Perfetto dopo periodi di stress fisico.',
        duration: 60,
        price: 75,
        category: 'decontratturante' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Massaggio Schiena e Spalle',
        description: 'Focus su schiena, spalle e cervicale. Ideale per chi lavora molto al computer.',
        duration: 30,
        price: 40,
        category: 'decontratturante' as ServiceCategory,
      },
    ],
    sport: [
      {
        id: generateId(),
        name: 'Massaggio Sportivo Pre-gara',
        description: 'Preparazione muscolare prima dell\'attività sportiva. Migliora la circolazione e previene infortuni.',
        duration: 45,
        price: 60,
        category: 'sportivo' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Massaggio Sportivo Post-gara',
        description: 'Recupero muscolare dopo l\'attività sportiva. Favorisce l\'eliminazione dell\'acido lattico.',
        duration: 60,
        price: 70,
        category: 'sportivo' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Trattamento Defaticante Gambe',
        description: 'Specifico per runner e ciclisti. Allevia pesantezza e favorisce il recupero delle gambe.',
        duration: 45,
        price: 55,
        category: 'sportivo' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Massaggio Decontratturante Intensivo',
        description: 'Trattamento profondo per atleti. Scioglie nodi muscolari e migliora la flessibilità.',
        duration: 75,
        price: 90,
        category: 'decontratturante' as ServiceCategory,
      },
    ],
    wellness: [
      {
        id: generateId(),
        name: 'Massaggio Linfodrenante',
        description: 'Stimola il sistema linfatico, riduce la ritenzione idrica e favorisce l\'eliminazione delle tossine.',
        duration: 60,
        price: 80,
        category: 'linfodrenante' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Trattamento Anticellulite',
        description: 'Massaggio specifico con tecniche mirate per contrastare gli inestetismi della cellulite.',
        duration: 45,
        price: 65,
        category: 'anticellulite' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Massaggio Olistico',
        description: 'Trattamento che unisce diverse tecniche per un benessere completo di corpo e mente.',
        duration: 90,
        price: 95,
        category: 'olistico' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Hot Stone Massage',
        description: 'Massaggio con pietre calde vulcaniche. Profondo relax e benefici per la circolazione.',
        duration: 75,
        price: 100,
        category: 'olistico' as ServiceCategory,
      },
    ],
    luxury: [
      {
        id: generateId(),
        name: 'Rituale Benessere Completo',
        description: 'Esperienza premium: scrub corpo, massaggio rilassante e massaggio decontratturante. 2 ore di puro benessere.',
        duration: 120,
        price: 180,
        category: 'olistico' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Massaggio con Oli Essenziali',
        description: 'Aromaterapia abbinata a tecniche di massaggio per un\'esperienza sensoriale completa.',
        duration: 75,
        price: 110,
        category: 'rilassante' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Massaggio Californiano',
        description: 'Movimenti fluidi e avvolgenti per un profondo rilassamento. Ideale per ansia e stress.',
        duration: 90,
        price: 120,
        category: 'rilassante' as ServiceCategory,
      },
      {
        id: generateId(),
        name: 'Trattamento Bamboo Massage',
        description: 'Tecnica orientale con canne di bambù. Drenante, tonificante e rilassante.',
        duration: 60,
        price: 95,
        category: 'olistico' as ServiceCategory,
      },
    ],
  };

  return baseServices[professionalType];
};

// ============================================
// PROFESSIONISTI MOCK
// ============================================

export const mockProfessionals: Professional[] = [
  {
    id: 'prof-001',
    email: 'giulia.rossi@email.it',
    firstName: 'Giulia',
    lastName: 'Rossi',
    phone: '+39 333 1234567',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    role: 'professional',
    bio: 'Massaggiatrice certificata con 8 anni di esperienza. Specializzata in massaggi rilassanti e decontratturanti. La mia missione è aiutarti a ritrovare il benessere e l\'equilibrio attraverso il potere del tocco terapeutico.',
    partitaIva: '12345678901',
    plan: 'premium',
    rating: 4.9,
    reviewCount: 156,
    isVerified: true,
    isInsured: true,
    coverageRadius: 15,
    baseLocation: {
      street: 'Via della Moscova, 18',
      city: 'Milano',
      postalCode: '20121',
      province: 'MI',
      latitude: 45.4773,
      longitude: 9.1815,
    },
    services: createServices('classic'),
    availability: createDefaultAvailability(),
    isMarketplaceVisible: true,
    nextAvailableSlot: addHours(new Date(), 3),
    createdAt: new Date('2022-03-15'),
  },
  {
    id: 'prof-002',
    email: 'marco.bianchi@email.it',
    firstName: 'Marco',
    lastName: 'Bianchi',
    phone: '+39 339 8765432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    role: 'professional',
    bio: 'Ex fisioterapista sportivo, ora massaggiatore specializzato per atleti. Lavoro con squadre di calcio e runner professionisti. Tecniche avanzate per il recupero muscolare e la prevenzione infortuni.',
    partitaIva: '23456789012',
    plan: 'premium',
    rating: 4.8,
    reviewCount: 89,
    isVerified: true,
    isInsured: true,
    coverageRadius: 20,
    baseLocation: {
      street: 'Corso Buenos Aires, 45',
      city: 'Milano',
      postalCode: '20124',
      province: 'MI',
      latitude: 45.4796,
      longitude: 9.2087,
    },
    services: createServices('sport'),
    availability: {
      ...createDefaultAvailability(),
      saturday: [{ start: '08:00', end: '12:00', isAvailable: true }],
      sunday: [{ start: '09:00', end: '13:00', isAvailable: true }],
    },
    isMarketplaceVisible: true,
    nextAvailableSlot: addDays(new Date(), 1),
    createdAt: new Date('2021-08-20'),
  },
  {
    id: 'prof-003',
    email: 'sofia.ferrari@email.it',
    firstName: 'Sofia',
    lastName: 'Ferrari',
    phone: '+39 347 5551234',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    role: 'professional',
    bio: 'Operatrice olistica certificata con formazione in Thailandia e Bali. Offro trattamenti personalizzati che combinano tecniche orientali e occidentali per un benessere a 360 gradi.',
    partitaIva: '34567890123',
    plan: 'free',
    rating: 4.7,
    reviewCount: 67,
    isVerified: true,
    isInsured: true,
    coverageRadius: 12,
    baseLocation: {
      street: 'Via Tortona, 22',
      city: 'Milano',
      postalCode: '20144',
      province: 'MI',
      latitude: 45.4508,
      longitude: 9.1635,
    },
    services: createServices('wellness'),
    availability: createDefaultAvailability(),
    isMarketplaceVisible: true,
    nextAvailableSlot: setHours(setMinutes(addDays(new Date(), 0), 0), 18),
    createdAt: new Date('2023-01-10'),
  },
  {
    id: 'prof-004',
    email: 'andrea.colombo@email.it',
    firstName: 'Andrea',
    lastName: 'Colombo',
    phone: '+39 340 9876543',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    role: 'professional',
    bio: 'Professionista del benessere con esperienza in spa di lusso a Milano e Londra. Specializzato in rituali premium e tecniche esclusive per una clientela esigente.',
    partitaIva: '45678901234',
    plan: 'premium',
    rating: 4.9,
    reviewCount: 203,
    isVerified: true,
    isInsured: true,
    coverageRadius: 25,
    baseLocation: {
      street: 'Via Montenapoleone, 8',
      city: 'Milano',
      postalCode: '20121',
      province: 'MI',
      latitude: 45.4684,
      longitude: 9.1954,
    },
    services: createServices('luxury'),
    availability: {
      ...createDefaultAvailability(),
      monday: [{ start: '10:00', end: '20:00', isAvailable: true }],
      tuesday: [{ start: '10:00', end: '20:00', isAvailable: true }],
      wednesday: [{ start: '10:00', end: '20:00', isAvailable: true }],
      thursday: [{ start: '10:00', end: '20:00', isAvailable: true }],
      friday: [{ start: '10:00', end: '20:00', isAvailable: true }],
    },
    isMarketplaceVisible: true,
    nextAvailableSlot: addHours(new Date(), 5),
    createdAt: new Date('2020-11-05'),
  },
  {
    id: 'prof-005',
    email: 'elena.martini@email.it',
    firstName: 'Elena',
    lastName: 'Martini',
    phone: '+39 335 1112233',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    role: 'professional',
    bio: 'Massaggiatrice specializzata in trattamenti anticellulite e linfodrenaggio. Utilizzo solo prodotti naturali e biologici. Il tuo benessere è la mia priorità.',
    partitaIva: '56789012345',
    plan: 'free',
    rating: 4.6,
    reviewCount: 45,
    isVerified: true,
    isInsured: false,
    coverageRadius: 10,
    baseLocation: {
      street: 'Viale Papiniano, 32',
      city: 'Milano',
      postalCode: '20123',
      province: 'MI',
      latitude: 45.4603,
      longitude: 9.1648,
    },
    services: createServices('wellness'),
    availability: createDefaultAvailability(),
    isMarketplaceVisible: true,
    nextAvailableSlot: addDays(new Date(), 2),
    createdAt: new Date('2023-06-22'),
  },
  {
    id: 'prof-006',
    email: 'luca.galli@email.it',
    firstName: 'Luca',
    lastName: 'Galli',
    phone: '+39 328 4445566',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    role: 'professional',
    bio: 'Massoterapista MCB diplomato. Collaboro con centri medici e fisioterapici. Approccio scientifico al massaggio con attenzione alla postura e al benessere muscolo-scheletrico.',
    partitaIva: '67890123456',
    plan: 'premium',
    rating: 4.8,
    reviewCount: 112,
    isVerified: true,
    isInsured: true,
    coverageRadius: 18,
    baseLocation: {
      street: 'Piazza Duomo, 1',
      city: 'Milano',
      postalCode: '20122',
      province: 'MI',
      latitude: 45.4642,
      longitude: 9.1900,
    },
    services: [
      ...createServices('classic'),
      {
        id: generateId(),
        name: 'Massaggio Posturale',
        description: 'Analisi posturale e trattamento mirato per correggere squilibri muscolari.',
        duration: 60,
        price: 85,
        category: 'decontratturante' as ServiceCategory,
      },
    ],
    availability: createDefaultAvailability(),
    isMarketplaceVisible: true,
    nextAvailableSlot: addHours(new Date(), 2),
    createdAt: new Date('2021-04-18'),
  },
  {
    id: 'prof-007',
    email: 'francesca.romano@email.it',
    firstName: 'Francesca',
    lastName: 'Romano',
    phone: '+39 342 7778899',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    role: 'professional',
    bio: 'Massaggiatrice olistica e insegnante di yoga. Combino massaggio e respirazione per un\'esperienza di rilassamento profondo. Ogni trattamento è un viaggio verso il tuo centro.',
    partitaIva: '78901234567',
    plan: 'free',
    rating: 4.5,
    reviewCount: 38,
    isVerified: false,
    isInsured: true,
    coverageRadius: 8,
    baseLocation: {
      street: 'Via Solferino, 15',
      city: 'Milano',
      postalCode: '20121',
      province: 'MI',
      latitude: 45.4745,
      longitude: 9.1872,
    },
    services: createServices('wellness'),
    availability: {
      ...createDefaultAvailability(),
      monday: [],
      sunday: [{ start: '10:00', end: '18:00', isAvailable: true }],
    },
    isMarketplaceVisible: true,
    nextAvailableSlot: addDays(new Date(), 3),
    createdAt: new Date('2024-01-05'),
  },
];

// ============================================
// RECENSIONI MOCK
// ============================================

export const mockReviews: Review[] = [
  // Reviews for Giulia Rossi (prof-001)
  {
    id: 'rev-001',
    professionalId: 'prof-001',
    clientId: 'client-001',
    clientName: 'Maria L.',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    comment: 'Giulia è fantastica! Massaggio rilassante perfetto, mi ha aiutato tantissimo con lo stress da lavoro. Consigliatissima!',
    serviceId: 'srv-001',
    serviceName: 'Massaggio Rilassante',
    createdAt: new Date('2024-11-15'),
  },
  {
    id: 'rev-002',
    professionalId: 'prof-001',
    clientId: 'client-002',
    clientName: 'Giuseppe R.',
    rating: 5,
    comment: 'Professionale e puntuale. Il massaggio decontratturante ha risolto il mio mal di schiena cronico. Tornerò sicuramente.',
    serviceId: 'srv-002',
    serviceName: 'Massaggio Decontratturante',
    createdAt: new Date('2024-11-10'),
  },
  {
    id: 'rev-003',
    professionalId: 'prof-001',
    clientId: 'client-003',
    clientName: 'Anna B.',
    clientAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
    rating: 4,
    comment: 'Molto brava, ambiente rilassante. L\'unico neo è che ha finito 5 minuti prima del previsto.',
    serviceId: 'srv-001',
    serviceName: 'Massaggio Rilassante',
    createdAt: new Date('2024-10-28'),
  },
  {
    id: 'rev-004',
    professionalId: 'prof-001',
    clientId: 'client-004',
    clientName: 'Paolo M.',
    rating: 5,
    comment: 'Esperienza top! Casa mia sembrava una spa. Giulia è molto professionale e attenta ai dettagli.',
    serviceId: 'srv-003',
    serviceName: 'Massaggio Schiena e Spalle',
    createdAt: new Date('2024-10-15'),
  },

  // Reviews for Marco Bianchi (prof-002)
  {
    id: 'rev-005',
    professionalId: 'prof-002',
    clientId: 'client-005',
    clientName: 'Federico S.',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    rating: 5,
    comment: 'Da runner, Marco è il mio punto di riferimento. Il massaggio post-gara mi fa recuperare in metà tempo. Super consigliato agli sportivi!',
    serviceId: 'srv-004',
    serviceName: 'Massaggio Sportivo Post-gara',
    createdAt: new Date('2024-11-20'),
  },
  {
    id: 'rev-006',
    professionalId: 'prof-002',
    clientId: 'client-006',
    clientName: 'Chiara V.',
    rating: 5,
    comment: 'Preparazione impeccabile prima della mia maratona. Marco conosce perfettamente le esigenze degli atleti.',
    serviceId: 'srv-005',
    serviceName: 'Massaggio Sportivo Pre-gara',
    createdAt: new Date('2024-11-05'),
  },
  {
    id: 'rev-007',
    professionalId: 'prof-002',
    clientId: 'client-007',
    clientName: 'Roberto T.',
    rating: 4,
    comment: 'Ottimo massaggio, molto tecnico. Forse un po\' troppo intenso per i miei gusti, ma efficace.',
    serviceId: 'srv-006',
    serviceName: 'Massaggio Decontratturante Intensivo',
    createdAt: new Date('2024-10-22'),
  },

  // Reviews for Sofia Ferrari (prof-003)
  {
    id: 'rev-008',
    professionalId: 'prof-003',
    clientId: 'client-008',
    clientName: 'Valentina P.',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    rating: 5,
    comment: 'L\'hot stone massage con Sofia è stata un\'esperienza magica. Mi sono sentita in un\'altra dimensione!',
    serviceId: 'srv-007',
    serviceName: 'Hot Stone Massage',
    createdAt: new Date('2024-11-18'),
  },
  {
    id: 'rev-009',
    professionalId: 'prof-003',
    clientId: 'client-009',
    clientName: 'Silvia G.',
    rating: 4,
    comment: 'Bel trattamento olistico, Sofia crea un\'atmosfera molto rilassante. Un po\' caro ma vale la pena.',
    serviceId: 'srv-008',
    serviceName: 'Massaggio Olistico',
    createdAt: new Date('2024-10-30'),
  },

  // Reviews for Andrea Colombo (prof-004)
  {
    id: 'rev-010',
    professionalId: 'prof-004',
    clientId: 'client-010',
    clientName: 'Alessandra M.',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    rating: 5,
    comment: 'Il rituale spa completo di Andrea è il migliore che abbia mai provato. Due ore di puro lusso a casa mia!',
    serviceId: 'srv-009',
    serviceName: 'Rituale Spa Completo',
    createdAt: new Date('2024-11-22'),
  },
  {
    id: 'rev-011',
    professionalId: 'prof-004',
    clientId: 'client-011',
    clientName: 'Marco F.',
    rating: 5,
    comment: 'Ho regalato il massaggio californiano a mia moglie per il compleanno. È rimasta entusiasta. Andrea è un vero professionista.',
    serviceId: 'srv-010',
    serviceName: 'Massaggio Californiano',
    createdAt: new Date('2024-11-08'),
  },
  {
    id: 'rev-012',
    professionalId: 'prof-004',
    clientId: 'client-012',
    clientName: 'Lucia C.',
    rating: 5,
    comment: 'Qualità da spa 5 stelle ma comodamente a casa. I prodotti che usa sono eccezionali.',
    serviceId: 'srv-011',
    serviceName: 'Massaggio con Oli Essenziali',
    createdAt: new Date('2024-10-25'),
  },
  {
    id: 'rev-013',
    professionalId: 'prof-004',
    clientId: 'client-013',
    clientName: 'Daniela R.',
    clientAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100',
    rating: 4,
    comment: 'Bellissima esperienza, l\'unica pecca è stata dover aspettare quasi una settimana per un appuntamento.',
    serviceId: 'srv-009',
    serviceName: 'Rituale Spa Completo',
    createdAt: new Date('2024-10-12'),
  },

  // Reviews for Luca Galli (prof-006)
  {
    id: 'rev-014',
    professionalId: 'prof-006',
    clientId: 'client-014',
    clientName: 'Antonio D.',
    rating: 5,
    comment: 'Finalmente qualcuno che capisce la postura! Luca ha identificato subito i miei problemi e il massaggio posturale sta dando grandi risultati.',
    serviceId: 'srv-012',
    serviceName: 'Massaggio Posturale',
    createdAt: new Date('2024-11-19'),
  },
  {
    id: 'rev-015',
    professionalId: 'prof-006',
    clientId: 'client-015',
    clientName: 'Simona B.',
    clientAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100',
    rating: 5,
    comment: 'Approccio molto professionale e scientifico. Mi ha spiegato tutto quello che faceva e perché. Competentissimo!',
    serviceId: 'srv-013',
    serviceName: 'Massaggio Decontratturante',
    createdAt: new Date('2024-11-02'),
  },
];

// ============================================
// CLIENTI MOCK
// ============================================

export const mockClients: Client[] = [
  {
    id: 'client-001',
    email: 'maria.lombardi@email.it',
    firstName: 'Maria',
    lastName: 'Lombardi',
    phone: '+39 333 9998877',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    role: 'client',
    address: {
      street: 'Via Brera, 28',
      city: 'Milano',
      postalCode: '20121',
      province: 'MI',
      latitude: 45.4722,
      longitude: 9.1878,
    },
    favoritesProfessionals: ['prof-001', 'prof-004'],
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'client-demo',
    email: 'demo@treatu.it',
    firstName: 'Demo',
    lastName: 'User',
    phone: '+39 333 0000000',
    role: 'client',
    address: {
      street: 'Via Example, 1',
      city: 'Milano',
      postalCode: '20121',
      province: 'MI',
      latitude: 45.4642,
      longitude: 9.1900,
    },
    favoritesProfessionals: [],
    createdAt: new Date(),
  },
];

// ============================================
// PRENOTAZIONI MOCK
// ============================================

const today = new Date();

export const mockBookings: Booking[] = [
  {
    id: 'book-001',
    clientId: 'client-001',
    client: {
      id: 'client-001',
      firstName: 'Maria',
      lastName: 'Lombardi',
      phone: '+39 333 9998877',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    professionalId: 'prof-001',
    professional: {
      id: 'prof-001',
      firstName: 'Giulia',
      lastName: 'Rossi',
      phone: '+39 333 1234567',
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    },
    service: {
      id: 'srv-001',
      name: 'Massaggio Rilassante',
      description: 'Un massaggio delicato per rilassare corpo e mente.',
      duration: 60,
      price: 65,
      category: 'rilassante',
    },
    date: addDays(today, 1),
    startTime: '10:00',
    endTime: '11:00',
    address: {
      street: 'Via Brera, 28',
      city: 'Milano',
      postalCode: '20121',
      province: 'MI',
      latitude: 45.4722,
      longitude: 9.1878,
    },
    notes: 'Citofono Lombardi, terzo piano con ascensore.',
    status: 'confirmed',
    totalPrice: 65,
    createdAt: new Date(),
  },
  {
    id: 'book-002',
    clientId: 'client-002',
    client: {
      id: 'client-002',
      firstName: 'Giuseppe',
      lastName: 'Rossi',
      phone: '+39 340 1112233',
    },
    professionalId: 'prof-001',
    professional: {
      id: 'prof-001',
      firstName: 'Giulia',
      lastName: 'Rossi',
      phone: '+39 333 1234567',
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    },
    service: {
      id: 'srv-002',
      name: 'Massaggio Decontratturante',
      description: 'Trattamento mirato per sciogliere contratture muscolari.',
      duration: 60,
      price: 75,
      category: 'decontratturante',
    },
    date: addDays(today, 2),
    startTime: '15:00',
    endTime: '16:00',
    address: {
      street: 'Corso Magenta, 85',
      city: 'Milano',
      postalCode: '20123',
      province: 'MI',
      latitude: 45.4658,
      longitude: 9.1693,
    },
    status: 'pending',
    totalPrice: 75,
    createdAt: new Date(),
  },
  {
    id: 'book-003',
    clientId: 'client-003',
    client: {
      id: 'client-003',
      firstName: 'Anna',
      lastName: 'Bianchi',
      phone: '+39 347 5556677',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
    },
    professionalId: 'prof-001',
    professional: {
      id: 'prof-001',
      firstName: 'Giulia',
      lastName: 'Rossi',
      phone: '+39 333 1234567',
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    },
    service: {
      id: 'srv-003',
      name: 'Massaggio Schiena e Spalle',
      description: 'Focus su schiena, spalle e cervicale.',
      duration: 30,
      price: 40,
      category: 'decontratturante',
    },
    date: addDays(today, 3),
    startTime: '18:00',
    endTime: '18:30',
    address: {
      street: 'Via Torino, 15',
      city: 'Milano',
      postalCode: '20123',
      province: 'MI',
      latitude: 45.4614,
      longitude: 9.1847,
    },
    notes: 'Per favore suonare al campanello, il citofono non funziona.',
    status: 'pending',
    totalPrice: 40,
    createdAt: new Date(),
  },
  {
    id: 'book-004',
    clientId: 'client-004',
    client: {
      id: 'client-004',
      firstName: 'Paolo',
      lastName: 'Martini',
      phone: '+39 335 8889900',
    },
    professionalId: 'prof-002',
    professional: {
      id: 'prof-002',
      firstName: 'Marco',
      lastName: 'Bianchi',
      phone: '+39 339 8765432',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    service: {
      id: 'srv-004',
      name: 'Massaggio Sportivo Post-gara',
      description: 'Recupero muscolare dopo l\'attività sportiva.',
      duration: 60,
      price: 70,
      category: 'sportivo',
    },
    date: addDays(today, 1),
    startTime: '09:00',
    endTime: '10:00',
    address: {
      street: 'Via Washington, 70',
      city: 'Milano',
      postalCode: '20146',
      province: 'MI',
      latitude: 45.4589,
      longitude: 9.1485,
    },
    notes: 'Maratona domani, ho bisogno di essere in forma!',
    status: 'confirmed',
    totalPrice: 70,
    createdAt: new Date(),
  },
];

// ============================================
// TIME SLOTS DISPONIBILI (per 2 settimane)
// ============================================

export const generateAvailableSlots = (professionalId: string, startDate: Date = new Date()) => {
  const professional = mockProfessionals.find(p => p.id === professionalId);
  if (!professional) return [];

  const slots: { date: Date; time: string; isBooked: boolean }[] = [];
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

  for (let day = 0; day < 14; day++) {
    const currentDate = addDays(startDate, day);
    const dayName = daysOfWeek[currentDate.getDay()];
    const dayAvailability = professional.availability[dayName];

    dayAvailability.forEach(slot => {
      if (slot.isAvailable) {
        const [startHour] = slot.start.split(':').map(Number);
        const [endHour] = slot.end.split(':').map(Number);

        for (let hour = startHour; hour < endHour; hour++) {
          const timeStr = `${hour.toString().padStart(2, '0')}:00`;
          const isBooked = mockBookings.some(
            b =>
              b.professionalId === professionalId &&
              b.date.toDateString() === currentDate.toDateString() &&
              b.startTime === timeStr
          );

          slots.push({
            date: currentDate,
            time: timeStr,
            isBooked,
          });
        }
      }
    });
  }

  return slots;
};

// ============================================
// CATEGORIE SERVIZI
// ============================================

export const serviceCategories = [
  { id: 'rilassante', name: 'Rilassante', icon: '🧘' },
  { id: 'decontratturante', name: 'Decontratturante', icon: '💆' },
  { id: 'sportivo', name: 'Sportivo', icon: '🏃' },
  { id: 'linfodrenante', name: 'Linfodrenante', icon: '💧' },
  { id: 'anticellulite', name: 'Anticellulite', icon: '✨' },
  { id: 'olistico', name: 'Olistico', icon: '🌿' },
] as const;

// ============================================
// EXPORT HELPERS
// ============================================

export const getProfessionalById = (id: string) =>
  mockProfessionals.find(p => p.id === id);

export const getReviewsByProfessionalId = (id: string) =>
  mockReviews.filter(r => r.professionalId === id);

export const getBookingsByProfessionalId = (id: string) =>
  mockBookings.filter(b => b.professionalId === id);

export const getBookingsByClientId = (id: string) =>
  mockBookings.filter(b => b.clientId === id);
