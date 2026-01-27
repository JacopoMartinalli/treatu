import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Clock,
  Calendar,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Heart,
  ChevronDown,
  Briefcase,
  Home,
  Zap,
  Shield,
  Euro,
  MessageCircle,
  CreditCard,
  ListChecks,
  Search,
  Check,
} from 'lucide-react';
import { Button } from '../components/shared';

// ============================================
// LANDING PAGE
// ============================================

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warm-50">
      <HeroSection
        onSearch={() => navigate('/search')}
        onBecomePro={() => navigate('/pro/register')}
      />
      <BenefitsSection />
      <HowItWorksSection />
      <StatsSection />
      <PricingSection onBecomePro={() => navigate('/pro/register')} />
      <DualCTASection
        onClientClick={() => navigate('/register')}
        onProClick={() => navigate('/pro/register')}
      />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection
        onGetStarted={() => navigate('/register')}
        onBecomePro={() => navigate('/pro/register')}
      />
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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-100 via-warm-50 to-secondary-50" />
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />

      {/* Decorative shapes */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl" />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-[15%] w-16 h-16 bg-primary-400/20 rounded-2xl rotate-12 hidden lg:block"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-[25%] w-12 h-12 bg-secondary-400/20 rounded-full hidden lg:block"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-8 shadow-sm"
          >
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-700">
              Guadagna extra, anche se hai gia un lavoro
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1]"
          >
            Il tuo talento.
            <br />
            <span className="text-primary-700">Dove e quando vuoi.</span>
            <br />
            <span className="text-secondary-600">Senza vincoli.</span>
          </motion.h1>

          {/* Subheadline - 3 value props */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-3 mb-10 max-w-2xl"
          >
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-5 py-3 border border-gray-100 shadow-sm">
              <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-base sm:text-lg text-gray-700">
                Lavora quando sei <span className="font-semibold text-gray-900">libero</span>, metti disponibilita e l'app <span className="font-semibold text-primary-700">trova i clienti</span> per te.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-5 py-3 border border-gray-100 shadow-sm">
              <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-base sm:text-lg text-gray-700">
                La tua <span className="font-semibold text-primary-700">agenda digitale</span> sempre a portata di mano: <span className="font-semibold text-gray-900">appuntamenti, clienti e pagamenti</span>.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-5 py-3 border border-gray-100 shadow-sm">
              <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-base sm:text-lg text-gray-700">
                Effettua <span className="font-semibold text-gray-900">trattamenti a domicilio</span>, nessuna sede richiesta — lavora in <span className="font-semibold text-primary-700">liberta</span> con i tuoi orari.
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Button
              size="lg"
              onClick={onBecomePro}
              className="group"
            >
              Inizia a guadagnare
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onSearch}
              className="border-primary-300 text-primary-700 hover:bg-primary-50"
            >
              <Search className="w-5 h-5 mr-2" />
              Prenota un trattamento
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-primary-200 to-secondary-200"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">500+</p>
                <p className="text-xs text-gray-500">Professionisti attivi</p>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-300 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">4.8/5</p>
                <p className="text-xs text-gray-500">15.000+ recensioni</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-gray-400"
        >
          <span className="text-xs mb-2">Scopri di piu</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// BENEFITS SECTION (6 key selling points)
// ============================================

function BenefitsSection() {
  const benefits = [
    {
      icon: Euro,
      title: "Guadagna extra",
      description: "Hai gia un lavoro? Perfetto. Con TreatU guadagni nei tuoi momenti liberi, senza vincoli.",
      highlight: "anche se hai gia un lavoro",
    },
    {
      icon: MapPin,
      title: "Dove e quando vuoi",
      description: "Scegli tu la zona, i giorni e gli orari. Lavora vicino a casa o dove preferisci, in totale liberta.",
      highlight: "tu decidi tutto",
    },
    {
      icon: Calendar,
      title: "Calendario intelligente",
      description: "Imposta la tua disponibilita e il calendario si aggiorna in automatico. L'app trova i clienti per te.",
      highlight: "zero sbattimenti",
    },
    {
      icon: Search,
      title: "I clienti ti trovano",
      description: "Non devi cercare clienti o fare pubblicita. I clienti nella tua zona ti trovano e prenotano direttamente.",
      highlight: "basta passaparola",
    },
    {
      icon: CreditCard,
      title: "Pagamenti nell'app",
      description: "Gestisci tutti i pagamenti direttamente nell'app. Tutto tracciato, preciso e senza perdere tempo.",
      highlight: "niente contanti, niente problemi",
    },
    {
      icon: MessageCircle,
      title: "Chat con i clienti",
      description: "Comunica con i tuoi clienti in chat per organizzare i dettagli. Tutto in un unico posto, semplice e veloce.",
      highlight: "comunicazione diretta",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
            Perche TreatU
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tutto quello che ti serve per lavorare in liberta
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Basta complicazioni. TreatU ti da gli strumenti per guadagnare facendo quello che ami, nei tempi che scegli tu.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-warm-50 rounded-2xl p-8 h-full border border-transparent hover:border-primary-200 transition-all hover:shadow-lg">
                <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  {item.description}
                </p>
                <span className="inline-block text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {item.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra: Listino personalizzato callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-10 border border-primary-100"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <ListChecks className="w-8 h-8" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Crea il tuo listino personalizzato
              </h3>
              <p className="text-gray-600 max-w-2xl">
                Decidi tu cosa offrire e a che prezzo. Crea il tuo listino servizi su misura, aggiungendo trattamenti, durate e tariffe. I clienti vedono subito cosa offri e prenotano in un click.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS SECTION
// ============================================

function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<'client' | 'pro'>('pro');

  const clientSteps = [
    {
      step: "01",
      title: "Cerca nella tua zona",
      description: "Inserisci il tuo indirizzo e trova professionisti disponibili vicino a te.",
    },
    {
      step: "02",
      title: "Scegli e prenota",
      description: "Confronta profili, leggi le recensioni e prenota il trattamento che preferisci.",
    },
    {
      step: "03",
      title: "Rilassati a casa tua",
      description: "Il professionista arriva da te con tutto l'occorrente. Tu devi solo goderti il momento.",
    },
  ];

  const proSteps = [
    {
      step: "01",
      title: "Crea profilo e listino",
      description: "Registrati, crea il tuo listino personalizzato con servizi, prezzi e zone che copri.",
    },
    {
      step: "02",
      title: "Imposta quando sei libero",
      description: "Il calendario si adatta a te. Lavora quando vuoi, anche solo qualche ora a settimana.",
    },
    {
      step: "03",
      title: "Ricevi clienti e guadagna",
      description: "L'app trova i clienti per te. Tu confermi, vai a lavorare e ricevi il pagamento in app.",
    },
  ];

  const steps = activeTab === 'client' ? clientSteps : proSteps;

  return (
    <section className="py-24 bg-warm-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
            Come funziona
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Semplice, veloce, senza complicazioni
          </h2>

          {/* Tab Switcher */}
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('pro')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'pro'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Per i Professionisti
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'client'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Per i Clienti
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                )}

                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl font-bold text-primary-200">
                      {step.step}
                    </span>
                    <div className="w-12 h-0.5 bg-primary-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============================================
// STATS SECTION
// ============================================

function StatsSection() {
  const stats = [
    { value: "500+", label: "Professionisti attivi", icon: Users },
    { value: "15.000+", label: "Trattamenti completati", icon: Heart },
    { value: "4.8", label: "Valutazione media", icon: Star },
    { value: "92%", label: "Clienti soddisfatti", icon: TrendingUp },
  ];

  return (
    <section className="py-20 bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-secondary-300" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {stat.value}
              </p>
              <p className="text-primary-200 text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRICING SECTION
// ============================================

function PricingSection({ onBecomePro }: { onBecomePro: () => void }) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  // Placeholder prices — da definire
  const pricing = {
    monthly: { price: 'X,XX', period: '/mese', savings: null },
    quarterly: { price: 'X,XX', period: '/mese', savings: 'Risparmi il 15%' },
    yearly: { price: 'X,XX', period: '/mese', savings: 'Risparmi il 30%' },
  };

  const currentPlan = pricing[billingPeriod];

  const features = [
    "Profilo professionale completo",
    "Calendario intelligente",
    "L'app trova i clienti per te",
    "Chat con i clienti",
    "Pagamenti in-app",
    "Listino personalizzato",
    "Visibilita nella ricerca",
    "Statistiche e report",
    "Supporto prioritario",
  ];

  return (
    <section className="py-24 bg-warm-100/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
            Abbonamento
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Investi nel tuo lavoro, risparmia sul lungo periodo
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scegli il piano che fa per te. Piu a lungo ti abboni, piu risparmi.
          </p>
        </motion.div>

        {/* Billing Period Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-gray-200">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensile
            </button>
            <button
              onClick={() => setBillingPeriod('quarterly')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all relative ${
                billingPeriod === 'quarterly'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3 Mesi
              <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                -15%
              </span>
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              12 Mesi
              <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                -30%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-primary-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-8 py-10 text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                TreatU Pro
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-white">
                  {currentPlan.price}
                </span>
                <span className="text-primary-200 text-lg">
                  {currentPlan.period}
                </span>
              </div>
              {currentPlan.savings && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block mt-3 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full"
                >
                  {currentPlan.savings}
                </motion.span>
              )}
              <p className="text-primary-200 text-sm mt-4">
                Prezzo in fase di definizione
              </p>
            </div>

            {/* Features */}
            <div className="px-8 py-8">
              <p className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wider">
                Tutto incluso
              </p>
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                onClick={onBecomePro}
                className="w-full mt-8 group"
              >
                Inizia ora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Nessun vincolo. Cancella quando vuoi.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// DUAL CTA SECTION
// ============================================

function DualCTASection({
  onClientClick,
  onProClick,
}: {
  onClientClick: () => void;
  onProClick: () => void;
}) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Scegli il tuo percorso
          </h2>
          <p className="text-lg text-gray-600">
            Che tu voglia prenotare o offrire servizi, TreatU e per te.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Client Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 lg:p-10 border border-secondary-200 hover:border-secondary-300 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-200/50 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-16 h-16 bg-secondary-200 text-secondary-700 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Cerchi un trattamento?
              </h3>

              <ul className="space-y-3 mb-8">
                {[
                  "Professionisti verificati e recensiti",
                  "Prenoti in pochi click",
                  "Il professionista viene da te",
                  "Risparmia fino al 30% rispetto ai centri",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-secondary-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                onClick={onClientClick}
                className="w-full sm:w-auto bg-secondary-600 hover:bg-secondary-700 group"
              >
                Trova un professionista
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          {/* Pro Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 p-8 lg:p-10 border border-primary-200 hover:border-primary-300 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/50 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-16 h-16 bg-primary-200 text-primary-700 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Vuoi guadagnare extra?
              </h3>

              <ul className="space-y-3 mb-8">
                {[
                  "Lavora quando sei libero, anche part-time",
                  "L'app trova i clienti per te",
                  "Pagamenti tracciati e sicuri",
                  "Chat diretta con i clienti",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                onClick={onProClick}
                className="w-full sm:w-auto group"
              >
                Inizia a guadagnare
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS SECTION
// ============================================

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Da quando uso TreatU ho triplicato i miei clienti. Posso lavorare negli orari che preferisco e non devo preoccuparmi dell'affitto di uno studio.",
      name: "Giulia R.",
      role: "Massaggiatrice, Milano",
      type: "pro" as const,
    },
    {
      quote: "Prenotare e semplicissimo. Ho trovato una professionista fantastica a 10 minuti da casa. Non tornero mai piu ai centri tradizionali.",
      name: "Marco T.",
      role: "Cliente da 6 mesi",
      type: "client" as const,
    },
    {
      quote: "Lavoro come impiegata e faccio massaggi nel weekend. TreatU mi permette di arrotondare senza stress e con clienti gia pronti.",
      name: "Sara M.",
      role: "Massaggiatrice part-time, Roma",
      type: "pro" as const,
    },
  ];

  return (
    <section className="py-24 bg-warm-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
            Testimonianze
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Cosa dicono di noi
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  testimonial.type === 'pro'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-secondary-100 text-secondary-700'
                }`}>
                  {testimonial.type === 'pro' ? 'Professionista' : 'Cliente'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ SECTION
// ============================================

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Quanto costa l'abbonamento TreatU Pro?",
      answer: "I prezzi sono in fase di definizione. Offriamo un abbonamento mensile e piani scontati a 3 e 12 mesi per risparmiare. Nessun vincolo: puoi cancellare quando vuoi.",
    },
    {
      question: "Posso usare TreatU anche se ho gia un lavoro?",
      answer: "Assolutamente si. TreatU e pensata per chi vuole guadagnare extra nei momenti liberi. Tu imposti la tua disponibilita e lavori solo quando vuoi.",
    },
    {
      question: "Come vengono verificati i professionisti?",
      answer: "Verifichiamo l'identita, la P.IVA e le certificazioni di ogni professionista. Inoltre, il sistema di recensioni permette ai clienti di valutare ogni esperienza.",
    },
    {
      question: "Come funzionano i pagamenti?",
      answer: "I clienti pagano tramite l'app. Tu ricevi il pagamento direttamente sul tuo conto, tutto tracciato e senza dover gestire contanti.",
    },
    {
      question: "Come trovo i clienti?",
      answer: "Non devi cercarli tu. L'app mostra il tuo profilo ai clienti nella tua zona. Loro prenotano e tu ricevi una notifica. Semplice.",
    },
    {
      question: "Cosa succede se un cliente cancella?",
      answer: "La nostra policy prevede cancellazione gratuita fino a 24 ore prima. Cancellazioni tardive comportano un rimborso parziale al professionista per il tempo riservato.",
    },
    {
      question: "Posso creare il mio listino personalizzato?",
      answer: "Si, decidi tu quali servizi offrire, a che prezzo e con quale durata. Il tuo listino e completamente personalizzabile e i clienti lo vedono sul tuo profilo.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Domande frequenti
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-gray-600">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FINAL CTA SECTION
// ============================================

function FinalCTASection({
  onGetStarted,
  onBecomePro,
}: {
  onGetStarted: () => void;
  onBecomePro: () => void;
}) {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-hero-pattern opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto a guadagnare con il tuo talento?
          </h2>
          <p className="text-lg sm:text-xl text-primary-200 mb-10 max-w-2xl mx-auto">
            Unisciti a TreatU oggi. Lavora quando vuoi, dove vuoi, e lascia che l'app trovi i clienti per te.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onBecomePro}
              className="bg-white text-primary-700 hover:bg-gray-100"
            >
              Inizia a guadagnare
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onGetStarted}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Prenota un trattamento
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
