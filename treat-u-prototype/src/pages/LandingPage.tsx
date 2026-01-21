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
      <ProblemSolutionSection />
      <HowItWorksSection />
      <StatsSection />
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-sm"
            >
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-700">
                Benessere a domicilio
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1]"
            >
              Massaggi e trattamenti
              <br />
              <span className="text-primary-700">a casa tua</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed"
            >
              TreatU connette chi cerca benessere con professionisti qualificati.
              Prenota un massaggio o offri i tuoi servizi - tutto in un'unica piattaforma.
            </motion.p>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 mb-8"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">4.8/5</span>
                <span className="text-sm text-gray-500">(15k+ recensioni)</span>
              </div>
            </motion.div>

            {/* CTA Cards - Client vs Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {/* Client Card */}
              <div
                onClick={onSearch}
                className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-secondary-300 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary-200 transition-colors">
                  <Heart className="w-6 h-6 text-secondary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cerco un trattamento
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Trova professionisti verificati nella tua zona
                </p>
                <span className="inline-flex items-center text-secondary-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Cerca ora
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>

              {/* Pro Card */}
              <div
                onClick={onBecomePro}
                className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-primary-300 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <Briefcase className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sono un professionista
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Lavora in autonomia, senza costi fissi
                </p>
                <span className="inline-flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Inizia gratis
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
                  alt="Massaggio rilassante a domicilio"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Card - Rating */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -left-6 top-1/4 bg-white rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                      alt="Professionista"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Giulia R.</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-600">4.9 (127)</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card - Booking */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="absolute -right-6 bottom-1/4 bg-white rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Prenotato!</p>
                    <p className="text-xs text-gray-500">Massaggio domani alle 18:00</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary-700 text-white rounded-full px-6 py-3 shadow-lg"
              >
                <div className="flex items-center gap-4 text-sm">
                  <span><strong>500+</strong> professionisti</span>
                  <span className="w-px h-4 bg-white/30" />
                  <span><strong>15k+</strong> trattamenti</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
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
// PROBLEM/SOLUTION SECTION
// ============================================

function ProblemSolutionSection() {
  const problems = [
    {
      icon: Home,
      problem: "Non hai uno studio o una sede?",
      solution: "Lavora direttamente a casa dei tuoi clienti. Zero costi fissi, massima flessibilita.",
    },
    {
      icon: Clock,
      problem: "Hai gia un lavoro o impegni?",
      solution: "Imposta la tua disponibilita come preferisci. Anche solo qualche ora a settimana.",
    },
    {
      icon: Users,
      problem: "Fai fatica a trovare clienti?",
      solution: "I clienti ti trovano sulla piattaforma. Tu devi solo accettare le prenotazioni.",
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
            Costruito per chi vuole lavorare in liberta
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sappiamo le difficolta di chi inizia o di chi vuole arrotondare.
            TreatU e la soluzione.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, index) => (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.problem}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.solution}
                </p>
              </div>
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
  const [activeTab, setActiveTab] = useState<'client' | 'pro'>('client');

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
      title: "Crea il tuo profilo",
      description: "Registrati, aggiungi i tuoi servizi, i prezzi e le zone che copri.",
    },
    {
      step: "02",
      title: "Imposta la disponibilita",
      description: "Decidi quando sei disponibile. Cambia gli orari quando vuoi.",
    },
    {
      step: "03",
      title: "Ricevi prenotazioni",
      description: "I clienti ti trovano e prenotano. Tu confermi e vai a lavorare.",
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
              onClick={() => setActiveTab('client')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'client'
                  ? 'bg-secondary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Per i Clienti
            </button>
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
                  <div className={`hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r ${
                    activeTab === 'client' ? 'from-secondary-300' : 'from-primary-300'
                  } to-transparent`} />
                )}

                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`text-4xl font-bold ${
                      activeTab === 'client' ? 'text-secondary-200' : 'text-primary-200'
                    }`}>
                      {step.step}
                    </span>
                    <div className={`w-12 h-0.5 ${
                      activeTab === 'client' ? 'bg-secondary-300' : 'bg-primary-300'
                    }`} />
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
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200 hover:border-secondary-300 transition-all"
          >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80"
                alt="Cliente che riceve un massaggio rilassante"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-100 to-transparent" />
            </div>

            <div className="relative p-8 lg:p-10">
              <div className="w-14 h-14 bg-secondary-200 text-secondary-700 rounded-2xl flex items-center justify-center mb-5 -mt-14 relative z-10 shadow-lg border-4 border-secondary-50">
                <Heart className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Cerchi un trattamento?
              </h3>

              <ul className="space-y-3 mb-8">
                {[
                  "Professionisti verificati e recensiti",
                  "Prenoti in pochi click",
                  "Il massaggiatore viene da te",
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
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 hover:border-primary-300 transition-all"
          >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80"
                alt="Professionista del massaggio al lavoro"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-100 to-transparent" />
            </div>

            <div className="relative p-8 lg:p-10">
              <div className="w-14 h-14 bg-primary-200 text-primary-700 rounded-2xl flex items-center justify-center mb-5 -mt-14 relative z-10 shadow-lg border-4 border-primary-50">
                <Briefcase className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Offri i tuoi servizi?
              </h3>

              <ul className="space-y-3 mb-8">
                {[
                  "Nessun costo per iniziare (piano Free)",
                  "Gestisci orari e disponibilita",
                  "I clienti ti trovano automaticamente",
                  "Guadagna in media 45EUR/ora netti",
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
      question: "Quanto costa usare TreatU come professionista?",
      answer: "Puoi iniziare gratis con il piano Free. Tratteniamo una piccola commissione solo quando completi un trattamento. Il piano Premium offre piu visibilita e funzionalita avanzate a un canone mensile.",
    },
    {
      question: "Come vengono verificati i professionisti?",
      answer: "Verifichiamo l'identita, la P.IVA e le certificazioni di ogni professionista. Inoltre, il sistema di recensioni permette ai clienti di valutare ogni esperienza.",
    },
    {
      question: "Posso scegliere quando lavorare?",
      answer: "Assolutamente si. Tu imposti la tua disponibilita nel calendario e la modifichi quando vuoi. Puoi lavorare full-time, part-time, solo nei weekend - decidi tu.",
    },
    {
      question: "Come funziona il pagamento?",
      answer: "I clienti pagano tramite la piattaforma. Tu ricevi il pagamento entro 3 giorni lavorativi dal completamento del trattamento, al netto della commissione.",
    },
    {
      question: "Cosa succede se un cliente cancella?",
      answer: "La nostra policy prevede cancellazione gratuita fino a 24 ore prima. Cancellazioni tardive comportano un rimborso parziale al professionista per il tempo riservato.",
    },
    {
      question: "Devo portare l'attrezzatura?",
      answer: "Si, i professionisti portano tutto il necessario per il trattamento (lettino portatile, oli, asciugamani). E parte del servizio a domicilio.",
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
            Pronto a iniziare?
          </h2>
          <p className="text-lg sm:text-xl text-primary-200 mb-10 max-w-2xl mx-auto">
            Unisciti a TreatU oggi. Che tu voglia rilassarti o far crescere
            la tua attivita, siamo qui per te.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-primary-700 hover:bg-gray-100"
            >
              Prenota un trattamento
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onBecomePro}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Diventa professionista
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
