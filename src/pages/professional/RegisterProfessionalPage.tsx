import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  FileText,
  Plus,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Building,
  Clock,
  Euro,
  Calendar,
  Briefcase,
  TrendingUp,
  Shield,
  Star,
  ArrowRight,
  Users,
  Smartphone,
  CheckCircle,
} from 'lucide-react';
import { Button, Input, Card, Select, Badge } from '../../components/shared';
import { useAuthStore } from '../../store/authStore';
import { Service, WeeklyAvailability, ServiceCategory } from '../../types';
import { serviceCategories } from '../../data/mockData';
import toast from 'react-hot-toast';

// ============================================
// REGISTER PROFESSIONAL PAGE
// ============================================

type Step = 'intro' | 'account' | 'profile' | 'documents' | 'services' | 'availability' | 'preview';

const registrationSteps: { id: Step; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'profile', label: 'Profilo' },
  { id: 'documents', label: 'Documenti' },
  { id: 'services', label: 'Servizi' },
  { id: 'availability', label: 'Disponibilita' },
  { id: 'preview', label: 'Anteprima' },
];

const defaultAvailability: WeeklyAvailability = {
  monday: [{ start: '09:00', end: '18:00', isAvailable: true }],
  tuesday: [{ start: '09:00', end: '18:00', isAvailable: true }],
  wednesday: [{ start: '09:00', end: '18:00', isAvailable: true }],
  thursday: [{ start: '09:00', end: '18:00', isAvailable: true }],
  friday: [{ start: '09:00', end: '18:00', isAvailable: true }],
  saturday: [],
  sunday: [],
};

export function RegisterProfessionalPage() {
  const navigate = useNavigate();
  const { registerProfessional, isLoading } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    partitaIva: '',
    bio: '',
    street: '',
    city: 'Milano',
    coverageRadius: 15,
    specializations: [] as string[],
    services: [] as Service[],
    availability: defaultAvailability,
    isMarketplaceVisible: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const currentStepIndex = registrationSteps.findIndex((s) => s.id === currentStep);
  const isInRegistrationFlow = currentStep !== 'intro';

  const goNext = () => {
    if (currentStep === 'intro') {
      setCurrentStep('account');
      return;
    }
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < registrationSteps.length) {
      setCurrentStep(registrationSteps[nextIndex].id);
    }
  };

  const goBack = () => {
    if (currentStep === 'account') {
      setCurrentStep('intro');
      return;
    }
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(registrationSteps[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    try {
      const success = await registerProfessional({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        partitaIva: formData.partitaIva,
        plan: 'free',
        coverageRadius: formData.coverageRadius,
        baseLocation: {
          street: formData.street,
          city: formData.city,
          postalCode: '',
          province: 'MI',
          latitude: 45.4642,
          longitude: 9.19,
        },
        services: formData.services,
        availability: formData.availability,
        isMarketplaceVisible: formData.isMarketplaceVisible,
      });

      if (success) {
        toast.success('Registrazione completata!');
        navigate('/pro/dashboard');
      }
    } catch {
      toast.error('Errore durante la registrazione');
    }
  };

  // Show intro landing page first
  if (currentStep === 'intro') {
    return <IntroSection onStart={goNext} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crea il tuo profilo
          </h1>
          <p className="text-gray-600">
            Configura il tuo profilo in pochi minuti e inizia a ricevere prenotazioni
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
          {registrationSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => index <= currentStepIndex && setCurrentStep(step.id)}
                className={`flex flex-col items-center gap-1 px-3 ${
                  index <= currentStepIndex ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id === currentStep
                      ? 'bg-primary-600 text-white'
                      : index < currentStepIndex
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-xs whitespace-nowrap ${
                    step.id === currentStep
                      ? 'text-primary-600 font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {index < registrationSteps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    index < currentStepIndex ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {currentStep === 'account' && (
              <AccountStep
                formData={formData}
                updateField={updateField}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                errors={errors}
                onNext={goNext}
              />
            )}

            {currentStep === 'profile' && (
              <ProfileStep
                formData={formData}
                updateField={updateField}
                errors={errors}
                onBack={goBack}
                onNext={goNext}
              />
            )}

            {currentStep === 'documents' && (
              <DocumentsStep
                onBack={goBack}
                onNext={goNext}
              />
            )}

            {currentStep === 'services' && (
              <ServicesStep
                services={formData.services}
                onUpdateServices={(services) => updateField('services', services)}
                onBack={goBack}
                onNext={goNext}
              />
            )}

            {currentStep === 'availability' && (
              <AvailabilityStep
                availability={formData.availability}
                onUpdateAvailability={(availability) =>
                  updateField('availability', availability)
                }
                isMarketplaceVisible={formData.isMarketplaceVisible}
                onToggleMarketplace={(visible) =>
                  updateField('isMarketplaceVisible', visible)
                }
                onBack={goBack}
                onNext={goNext}
              />
            )}

            {currentStep === 'preview' && (
              <PreviewStep
                formData={formData}
                onBack={goBack}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Hai gia un account?{' '}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}

// ============================================
// INTRO LANDING SECTION
// ============================================

function IntroSection({ onStart }: { onStart: () => void }) {
  const features = [
    {
      icon: Calendar,
      title: 'Calendario intelligente',
      description: 'Gestisci appuntamenti con un calendario intuitivo. Visualizza la tua agenda giornaliera, settimanale o mensile.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Clock,
      title: 'Fasce orarie flessibili',
      description: 'Imposta la tua disponibilita come preferisci. Lavora quando vuoi, anche solo qualche ora a settimana.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: FileText,
      title: 'Catalogo servizi',
      description: 'Crea il tuo catalogo personalizzato con servizi, prezzi e durate. Aggiorna tutto in tempo reale.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Smartphone,
      title: 'Gestione mobile',
      description: 'Ricevi notifiche, conferma appuntamenti e comunica con i clienti direttamente dal tuo telefono.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: TrendingUp,
      title: 'Statistiche e guadagni',
      description: 'Monitora i tuoi guadagni, le prenotazioni e la crescita del tuo business in tempo reale.',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Shield,
      title: 'Pagamenti sicuri',
      description: 'I clienti pagano in app. Tu ricevi i guadagni direttamente sul tuo conto, senza pensieri.',
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  const steps = [
    { number: '01', title: 'Crea il profilo', desc: 'Inserisci i tuoi dati e le tue qualifiche' },
    { number: '02', title: 'Aggiungi servizi', desc: 'Definisci il tuo catalogo e i prezzi' },
    { number: '03', title: 'Imposta disponibilita', desc: 'Scegli quando vuoi lavorare' },
    { number: '04', title: 'Inizia a guadagnare', desc: 'I clienti ti trovano e prenotano' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-primary-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-sm"
              >
                <Briefcase className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">
                  Per professionisti del benessere
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1]"
              >
                Lavora in
                <br />
                <span className="text-primary-600">liberta</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed"
              >
                Unisciti a TreatU e costruisci la tua attivita di massaggiatore.
                Zero costi fissi, orari flessibili, clienti che ti trovano.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-6 mb-8"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">500+</p>
                    <p className="text-xs text-gray-500">Professionisti</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">4.8/5</p>
                    <p className="text-xs text-gray-500">Valutazione media</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Euro className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">45EUR/h</p>
                    <p className="text-xs text-gray-500">Guadagno medio</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  onClick={onStart}
                  className="bg-primary-600 hover:bg-primary-700"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Inizia gratuitamente
                </Button>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Nessun costo per iniziare
                </p>
              </motion.div>
            </div>

            {/* Right Content - Feature Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                {/* Mock Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-gray-900">Il tuo calendario</h3>
                    <p className="text-sm text-gray-500">Gennaio 2025</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                    <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                  </div>
                </div>

                {/* Mock Appointments */}
                <div className="space-y-3">
                  {[
                    { time: '09:00', client: 'Marco B.', service: 'Massaggio Sportivo', color: 'bg-blue-100 border-blue-300' },
                    { time: '11:00', client: 'Sara M.', service: 'Massaggio Rilassante', color: 'bg-green-100 border-green-300' },
                    { time: '14:30', client: 'Luca R.', service: 'Trattamento Decontratturante', color: 'bg-purple-100 border-purple-300' },
                  ].map((apt, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className={`p-3 rounded-xl border ${apt.color}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{apt.client}</p>
                          <p className="text-xs text-gray-600">{apt.service}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{apt.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mock Earnings */}
                <div className="mt-6 p-4 bg-primary-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-primary-700">Guadagni questa settimana</p>
                      <p className="text-2xl font-bold text-primary-600">EUR 485</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                +23% questo mese
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Tutto quello che ti serve
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Strumenti professionali per il tuo business
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              TreatU ti fornisce tutti gli strumenti per gestire la tua attivita in modo semplice e professionale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Come funziona
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Inizia in 4 semplici passi
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">{step.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Free for Everyone */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Gratuito per sempre
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Zero costi, solo opportunita
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              TreatU e completamente gratuito per i professionisti. Nessun abbonamento, nessun costo nascosto. Paghi solo una piccola commissione quando ricevi una prenotazione.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary-50 rounded-2xl p-8 border-2 border-primary-200 max-w-lg mx-auto"
            >
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold text-primary-600">EUR 0</span>
                <span className="text-gray-500 text-lg">/mese</span>
              </div>
              <p className="text-gray-600 mb-6">Solo una piccola commissione per prenotazione</p>
              <ul className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                {[
                  'Profilo sul marketplace',
                  'Gestione prenotazioni',
                  'Calendario completo',
                  'Chat con i clienti',
                  'Statistiche e guadagni',
                  'Supporto dedicato',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" onClick={onStart} className="w-full">
                Inizia gratuitamente
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Pronto a iniziare?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Unisciti a centinaia di professionisti che gia usano TreatU per far crescere la loro attivita.
            </p>
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50"
              onClick={onStart}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Crea il tuo profilo gratuito
            </Button>
            <p className="text-sm text-primary-200 mt-4">
              Registrazione in 5 minuti - Nessuna carta di credito richiesta
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// STEP COMPONENTS
// ============================================

function AccountStep({
  formData,
  updateField,
  showPassword,
  setShowPassword,
  errors,
  onNext,
}: {
  formData: { email: string; password: string; confirmPassword: string };
  updateField: (field: string, value: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  errors: Record<string, string>;
  onNext: () => void;
}) {
  const validate = () => {
    if (!formData.email || !formData.password) {
      toast.error('Compila tutti i campi');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Le password non coincidono');
      return false;
    }
    return true;
  };

  return (
    <Card padding="lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Credenziali di accesso
      </h2>
      <div className="space-y-4">
        <Input
          label="Email professionale"
          type="email"
          placeholder="nome@studio.it"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          leftIcon={<Mail className="w-5 h-5" />}
          error={errors.email}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Minimo 8 caratteri"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          error={errors.password}
        />

        <Input
          label="Conferma Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Ripeti la password"
          value={formData.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          leftIcon={<Lock className="w-5 h-5" />}
        />

        <Button className="w-full" size="lg" onClick={() => validate() && onNext()}>
          Continua
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </Card>
  );
}

function DocumentsStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const [documents, setDocuments] = useState<{ type: string; name: string }[]>([]);

  const documentTypes = [
    { id: 'id_card', label: 'Documento di identita', description: 'Carta d\'identita o passaporto', required: true },
    { id: 'partita_iva', label: 'Certificato P.IVA', description: 'Visura camerale o certificato attribuzione', required: true },
    { id: 'certification', label: 'Certificazioni professionali', description: 'Diplomi, attestati, abilitazioni', required: false },
    { id: 'insurance', label: 'Assicurazione professionale', description: 'Polizza RC professionale', required: false },
  ];

  const handleFileSelect = (type: string) => {
    // Mock file selection - will be replaced with actual file upload to Supabase Storage
    const mockFileName = `documento_${type}_${Date.now()}.pdf`;
    if (!documents.find(d => d.type === type)) {
      setDocuments(prev => [...prev, { type, name: mockFileName }]);
    }
    toast.success('Documento caricato (demo)');
  };

  const removeDocument = (type: string) => {
    setDocuments(prev => prev.filter(d => d.type !== type));
  };

  const requiredUploaded = documentTypes
    .filter(d => d.required)
    .every(d => documents.find(doc => doc.type === d.id));

  return (
    <div className="space-y-6">
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Documenti di verifica
        </h2>
        <p className="text-gray-600 mb-6">
          Carica i documenti necessari per la verifica del tuo profilo. Il team TreatU li revisera entro 24-48h.
        </p>

        <div className="space-y-4">
          {documentTypes.map((docType) => {
            const uploaded = documents.find(d => d.type === docType.id);
            return (
              <div
                key={docType.id}
                className={`p-4 border-2 rounded-xl transition-all ${
                  uploaded
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">
                        {docType.label}
                        {docType.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-7">{docType.description}</p>
                    {uploaded && (
                      <p className="text-sm text-green-600 mt-2 ml-7 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {uploaded.name}
                      </p>
                    )}
                  </div>
                  {uploaded ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(docType.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileSelect(docType.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Carica
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> I documenti con * sono obbligatori. I documenti opzionali possono essere caricati anche dopo la registrazione.
          </p>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Indietro
        </Button>
        <Button
          onClick={onNext}
          className="flex-1"
          disabled={!requiredUploaded}
        >
          Continua
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {!requiredUploaded && (
        <p className="text-sm text-center text-gray-500">
          Carica i documenti obbligatori per continuare
        </p>
      )}
    </div>
  );
}

function ProfileStep({
  formData,
  updateField,
  errors,
  onBack,
  onNext,
}: {
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    partitaIva: string;
    bio: string;
    street: string;
    city: string;
    coverageRadius: number;
  };
  updateField: (field: string, value: unknown) => void;
  errors: Record<string, string>;
  onBack: () => void;
  onNext: () => void;
}) {
  const validate = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.partitaIva) {
      toast.error('Compila tutti i campi obbligatori');
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Il tuo profilo
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome"
              placeholder="Mario"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              leftIcon={<User className="w-5 h-5" />}
              error={errors.firstName}
            />
            <Input
              label="Cognome"
              placeholder="Rossi"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              error={errors.lastName}
            />
          </div>

          <Input
            label="Telefono"
            type="tel"
            placeholder="+39 333 1234567"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            leftIcon={<Phone className="w-5 h-5" />}
            error={errors.phone}
          />

          <Input
            label="Partita IVA"
            placeholder="12345678901"
            value={formData.partitaIva}
            onChange={(e) => updateField('partitaIva', e.target.value)}
            leftIcon={<Building className="w-5 h-5" />}
            hint="Obbligatoria per operare come professionista"
            error={errors.partitaIva}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Presentazione
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Racconta la tua esperienza, le tue specializzazioni e cosa ti rende unico..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Una buona bio aumenta le probabilita di ricevere prenotazioni
            </p>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Zona di lavoro
        </h3>

        <div className="space-y-4">
          <Input
            label="Indirizzo base"
            placeholder="Via Roma, 1"
            value={formData.street}
            onChange={(e) => updateField('street', e.target.value)}
            leftIcon={<MapPin className="w-5 h-5" />}
          />

          <Input
            label="Citta"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Raggio di copertura: {formData.coverageRadius} km
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={formData.coverageRadius}
              onChange={(e) => updateField('coverageRadius', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5 km</span>
              <span>50 km</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Indietro
        </Button>
        <Button onClick={() => validate() && onNext()} className="flex-1">
          Continua
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function ServicesStep({
  services,
  onUpdateServices,
  onBack,
  onNext,
}: {
  services: Service[];
  onUpdateServices: (services: Service[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 50,
    category: 'rilassante' as ServiceCategory,
  });

  const addService = () => {
    if (!newService.name) {
      toast.error('Inserisci un nome per il servizio');
      return;
    }

    onUpdateServices([
      ...services,
      {
        ...newService,
        id: `service-${Date.now()}`,
      },
    ]);

    setNewService({
      name: '',
      description: '',
      duration: 60,
      price: 50,
      category: 'rilassante',
    });
  };

  const removeService = (id: string) => {
    onUpdateServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          I tuoi servizi
        </h2>

        {/* Existing Services */}
        {services.length > 0 && (
          <div className="space-y-3 mb-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <Badge variant="outline" size="sm">
                      {service.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {service.duration} min - EUR{service.price}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(service.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Service */}
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Aggiungi servizio</h4>

          <div className="space-y-4">
            <Input
              label="Nome servizio"
              placeholder="Es: Massaggio Rilassante"
              value={newService.name}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, name: e.target.value }))
              }
              leftIcon={<FileText className="w-5 h-5" />}
            />

            <Select
              label="Categoria"
              value={newService.category}
              onChange={(e) =>
                setNewService((prev) => ({
                  ...prev,
                  category: e.target.value as ServiceCategory,
                }))
              }
              options={serviceCategories.map((cat) => ({
                value: cat.id,
                label: `${cat.icon} ${cat.name}`,
              }))}
            />

            <textarea
              value={newService.description}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Descrizione del servizio..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={2}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Durata (minuti)"
                type="number"
                value={newService.duration}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    duration: Number(e.target.value),
                  }))
                }
                leftIcon={<Clock className="w-5 h-5" />}
              />
              <Input
                label="Prezzo (EUR)"
                type="number"
                value={newService.price}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                leftIcon={<Euro className="w-5 h-5" />}
              />
            </div>

            <Button variant="outline" onClick={addService} className="w-full">
              <Plus className="w-5 h-5 mr-2" />
              Aggiungi Servizio
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Indietro
        </Button>
        <Button
          onClick={onNext}
          className="flex-1"
          disabled={services.length === 0}
        >
          Continua
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {services.length === 0 && (
        <p className="text-sm text-center text-gray-500">
          Aggiungi almeno un servizio per continuare
        </p>
      )}
    </div>
  );
}

function AvailabilityStep({
  availability,
  onUpdateAvailability,
  isMarketplaceVisible,
  onToggleMarketplace,
  onBack,
  onNext,
}: {
  availability: WeeklyAvailability;
  onUpdateAvailability: (availability: WeeklyAvailability) => void;
  isMarketplaceVisible: boolean;
  onToggleMarketplace: (visible: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const days = [
    { key: 'monday', label: 'Lunedi' },
    { key: 'tuesday', label: 'Martedi' },
    { key: 'wednesday', label: 'Mercoledi' },
    { key: 'thursday', label: 'Giovedi' },
    { key: 'friday', label: 'Venerdi' },
    { key: 'saturday', label: 'Sabato' },
    { key: 'sunday', label: 'Domenica' },
  ] as const;

  const toggleDay = (dayKey: keyof WeeklyAvailability) => {
    const currentSlots = availability[dayKey];
    if (currentSlots.length > 0) {
      onUpdateAvailability({ ...availability, [dayKey]: [] });
    } else {
      onUpdateAvailability({
        ...availability,
        [dayKey]: [{ start: '09:00', end: '18:00', isAvailable: true }],
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          La tua disponibilita
        </h2>

        <div className="space-y-3">
          {days.map((day) => {
            const isActive = availability[day.key].length > 0;
            return (
              <div
                key={day.key}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isActive ? 'border-primary-200 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleDay(day.key)}
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isActive && <Check className="w-4 h-4" />}
                  </button>
                  <span className="font-medium text-gray-900">{day.label}</span>
                </div>

                {isActive && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{availability[day.key][0]?.start}</span>
                    <span>-</span>
                    <span>{availability[day.key][0]?.end}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Visibilita Marketplace</h3>
            <p className="text-sm text-gray-500">
              Quando attivo, il tuo profilo sara visibile e potrai ricevere prenotazioni
            </p>
          </div>
          <button
            onClick={() => onToggleMarketplace(!isMarketplaceVisible)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isMarketplaceVisible ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isMarketplaceVisible ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Indietro
        </Button>
        <Button onClick={onNext} className="flex-1">
          Continua
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function PreviewStep({
  formData,
  onBack,
  onSubmit,
  isLoading,
}: {
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
    services: Service[];
    street: string;
    city: string;
    coverageRadius: number;
  };
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Anteprima del tuo profilo
        </h2>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary-100 rounded-xl flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {formData.firstName} {formData.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="success">Profilo gratuito</Badge>
                <span className="text-sm text-gray-500">
                  {formData.city} ({formData.coverageRadius}km)
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {formData.bio && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Presentazione</h4>
              <p className="text-gray-600">{formData.bio}</p>
            </div>
          )}

          {/* Services */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Servizi ({formData.services.length})
            </h4>
            <div className="grid gap-2">
              {formData.services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-500">{service.duration} min</p>
                  </div>
                  <p className="font-semibold text-primary-600">EUR{service.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Indietro
        </Button>
        <Button onClick={onSubmit} className="flex-1" isLoading={isLoading}>
          Completa Registrazione
          <Check className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Cliccando "Completa Registrazione" accetti i{' '}
        <Link to="#" className="text-primary-600 hover:underline">
          Termini di Servizio
        </Link>{' '}
        per professionisti
      </p>
    </div>
  );
}
