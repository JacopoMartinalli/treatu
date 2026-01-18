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
} from 'lucide-react';
import { Button, Input, Card, Select, Badge } from '../../components/shared';
import { useAuthStore } from '../../store/authStore';
import { Service, PlanType, WeeklyAvailability, ServiceCategory } from '../../types';
import { serviceCategories } from '../../data/mockData';
import toast from 'react-hot-toast';

// ============================================
// REGISTER PROFESSIONAL PAGE
// ============================================

type Step = 'account' | 'plan' | 'profile' | 'services' | 'availability' | 'preview';

const steps: { id: Step; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'plan', label: 'Piano' },
  { id: 'profile', label: 'Profilo' },
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

  const [currentStep, setCurrentStep] = useState<Step>('account');
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
    plan: 'free' as PlanType,
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

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
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
        plan: formData.plan,
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Diventa un Professionista TreatU
          </h1>
          <p className="text-gray-600">
            Configura il tuo profilo in pochi minuti e inizia a ricevere prenotazioni
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => (
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
              {index < steps.length - 1 && (
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

            {currentStep === 'plan' && (
              <PlanStep
                selectedPlan={formData.plan}
                onSelectPlan={(plan) => updateField('plan', plan)}
                onBack={goBack}
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

function PlanStep({
  selectedPlan,
  onSelectPlan,
  onBack,
  onNext,
}: {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Scegli il tuo piano
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Free Plan */}
          <button
            onClick={() => onSelectPlan('free')}
            className={`p-6 border-2 rounded-xl text-left transition-all ${
              selectedPlan === 'free'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Piano Free</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  EUR 0<span className="text-sm font-normal text-gray-500">/mese</span>
                </p>
              </div>
              {selectedPlan === 'free' && (
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Commissione del 5% su ogni prenotazione
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Profilo sul marketplace
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Gestione prenotazioni
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Calendario base
              </li>
            </ul>
          </button>

          {/* Premium Plan */}
          <button
            onClick={() => onSelectPlan('premium')}
            className={`p-6 border-2 rounded-xl text-left transition-all relative ${
              selectedPlan === 'premium'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Badge variant="success" className="absolute top-4 right-4">
              Consigliato
            </Badge>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Piano Premium</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  EUR 29<span className="text-sm font-normal text-gray-500">/mese</span>
                </p>
              </div>
              {selectedPlan === 'premium' && (
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-4">Nessuna commissione sulle prenotazioni</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Tutto del piano Free
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Visibilita prioritaria
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Statistiche avanzate
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Supporto prioritario
              </li>
            </ul>
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
    plan: PlanType;
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
                <Badge variant={formData.plan === 'premium' ? 'success' : 'default'}>
                  Piano {formData.plan === 'premium' ? 'Premium' : 'Free'}
                </Badge>
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
