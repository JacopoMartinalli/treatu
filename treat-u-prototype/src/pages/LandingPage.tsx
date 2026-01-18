import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  Shield,
  Clock,
  Calendar,
  Search,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/shared';
import { mockProfessionals, serviceCategories } from '../data/mockData';

// ============================================
// LANDING PAGE
// ============================================

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection onSearch={() => navigate('/search')} onBecomePro={() => navigate('/pro/register')} />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Categories */}
      <CategoriesSection onCategoryClick={(cat) => navigate(`/search?category=${cat}`)} />

      {/* Top Professionals */}
      <TopProfessionalsSection
        professionals={mockProfessionals.slice(0, 4)}
        onViewProfile={(id) => navigate(`/professional/${id}`)}
      />

      {/* CTA Section */}
      <CTASection onGetStarted={() => navigate('/register')} onBecomePro={() => navigate('/pro/register')} />
    </div>
  );
}

// ============================================
// HERO SECTION
// ============================================

function HeroSection({
  onSearch,
  onBecomePro,
}: {
  onSearch: () => void;
  onBecomePro: () => void;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Benessere a domicilio</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Il massaggio perfetto,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                a casa tua
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-xl">
              Connettiti con massaggiatori professionisti certificati nella tua zona.
              Prenota in pochi click e goditi un trattamento di qualita senza uscire di casa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={onSearch} rightIcon={<Search className="w-5 h-5" />}>
                Trova un Professionista
              </Button>
              <Button variant="outline" size="lg" onClick={onBecomePro}>
                Diventa Professionista
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-10 border-t border-gray-200">
              <TrustBadge icon={<Shield className="w-5 h-5" />} text="Professionisti Verificati" />
              <TrustBadge icon={<Star className="w-5 h-5" />} text="4.8 Rating Medio" />
              <TrustBadge icon={<Clock className="w-5 h-5" />} text="Risposta in 24h" />
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800"
                alt="Massaggio rilassante"
                className="rounded-2xl shadow-2xl"
              />

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -right-8 top-1/4 bg-white rounded-xl shadow-lg p-4 max-w-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100"
                    alt="Professionista"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Giulia R.</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-600">4.9 (156 recensioni)</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Disponibile oggi alle 18:00
                </p>
              </motion.div>

              {/* Stats card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -left-8 bottom-1/4 bg-white rounded-xl shadow-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">500+</p>
                    <p className="text-xs text-gray-500">Professionisti</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">10k+</p>
                    <p className="text-xs text-gray-500">Clienti Felici</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <div className="text-primary-600">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

// ============================================
// FEATURES SECTION
// ============================================

function FeaturesSection() {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Professionisti Verificati',
      description:
        'Tutti i nostri operatori sono certificati, con P.IVA verificata e recensioni reali.',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Servizio a Domicilio',
      description:
        'Il professionista viene da te con tutta l\'attrezzatura necessaria. Zero stress.',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Prenotazione Facile',
      description:
        'Scegli giorno, orario e tipo di trattamento. Conferma in pochi secondi.',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Qualita Garantita',
      description:
        'Sistema di recensioni trasparente e assistenza clienti sempre disponibile.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Perche scegliere TreatU?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La piattaforma pensata per offrirti il massimo del benessere,
            con la comodita del servizio a domicilio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS SECTION
// ============================================

function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Cerca',
      description: 'Inserisci la tua zona e trova professionisti disponibili vicino a te.',
    },
    {
      step: '02',
      title: 'Scegli',
      description: 'Confronta profili, recensioni e prezzi. Seleziona il trattamento ideale.',
    },
    {
      step: '03',
      title: 'Prenota',
      description: 'Scegli data, orario e conferma. Ricevi la conferma immediata.',
    },
    {
      step: '04',
      title: 'Rilassati',
      description: 'Il professionista arriva a casa tua. Goditi il tuo momento di benessere.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Come funziona
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Prenotare un massaggio non e mai stato cosi semplice.
            In quattro semplici passi sei pronto per rilassarti.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200" />
              )}
              <div className="relative bg-white rounded-xl p-6 shadow-sm">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CATEGORIES SECTION
// ============================================

function CategoriesSection({ onCategoryClick }: { onCategoryClick: (cat: string) => void }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tipi di Trattamento
          </h2>
          <p className="text-lg text-gray-600">
            Scegli il massaggio piu adatto alle tue esigenze
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {serviceCategories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryClick(category.id)}
              className="bg-gray-50 hover:bg-primary-50 border-2 border-transparent hover:border-primary-200 rounded-xl p-6 text-center transition-all"
            >
              <span className="text-3xl mb-2 block">{category.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TOP PROFESSIONALS SECTION
// ============================================

function TopProfessionalsSection({
  professionals,
  onViewProfile,
}: {
  professionals: typeof mockProfessionals;
  onViewProfile: (id: string) => void;
}) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              I Nostri Top Professionisti
            </h2>
            <p className="text-lg text-gray-600">
              Scopri i massaggiatori piu apprezzati dai nostri clienti
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {professionals.map((pro, index) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onViewProfile(pro.id)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={pro.avatar}
                  alt={`${pro.firstName} ${pro.lastName}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {pro.isVerified && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                    <span className="text-xs font-medium">Verificato</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">
                  {pro.firstName} {pro.lastName}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{pro.rating}</span>
                  <span className="text-sm text-gray-500">
                    ({pro.reviewCount} recensioni)
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {pro.bio}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    da <span className="font-semibold text-primary-600">
                      {Math.min(...pro.services.map(s => s.price))}
                    </span>/trattamento
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================

function CTASection({
  onGetStarted,
  onBecomePro,
}: {
  onGetStarted: () => void;
  onBecomePro: () => void;
}) {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Clients */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Sei un Cliente?</h3>
            <p className="text-white/80 mb-6">
              Registrati gratuitamente e scopri i migliori professionisti nella tua zona.
              Prenota il tuo prossimo massaggio in pochi click.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-300" />
                <span>Registrazione gratuita</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-300" />
                <span>Professionisti verificati</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-300" />
                <span>Prenotazione semplice</span>
              </li>
            </ul>
            <Button
              variant="secondary"
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Inizia Ora
            </Button>
          </motion.div>

          {/* For Professionals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Sei un Professionista?</h3>
            <p className="text-white/80 mb-6">
              Unisciti alla nostra rete di massaggiatori. Gestisci i tuoi appuntamenti,
              aumenta la tua visibilita e fai crescere il tuo business.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-300" />
                <span>Piano Free disponibile</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-300" />
                <span>Dashboard completa</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-300" />
                <span>Gestione calendario</span>
              </li>
            </ul>
            <Button
              variant="outline"
              size="lg"
              onClick={onBecomePro}
              className="border-white text-white hover:bg-white/10"
            >
              Diventa Partner
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
