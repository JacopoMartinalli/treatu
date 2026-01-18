import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin } from 'lucide-react';
import { Button, Input, Card } from '../../components/shared';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

// ============================================
// REGISTER PAGE (CLIENT)
// ============================================

export function RegisterPage() {
  const navigate = useNavigate();
  const { registerClient, isLoading } = useAuthStore();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: 'Milano',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email richiesta';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.password) {
      newErrors.password = 'Password richiesta';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La password deve avere almeno 8 caratteri';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non coincidono';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) {
      newErrors.firstName = 'Nome richiesto';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Cognome richiesto';
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefono richiesto';
    }

    if (!formData.street) {
      newErrors.street = 'Indirizzo richiesto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    const success = await registerClient({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        province: 'MI',
        latitude: 45.4642,
        longitude: 9.19,
      },
    });

    if (success) {
      toast.success('Registrazione completata!');
      navigate('/search');
    } else {
      toast.error('Errore durante la registrazione');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crea il tuo account
          </h1>
          <p className="text-gray-600">
            Registrati per prenotare il tuo primo massaggio
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`w-3 h-3 rounded-full ${
              step >= 1 ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          />
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`} />
          <div
            className={`w-3 h-3 rounded-full ${
              step >= 2 ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          />
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Credenziali di accesso
                </h2>

                <Input
                  label="Email"
                  type="email"
                  placeholder="nome@email.it"
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
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
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
                  error={errors.confirmPassword}
                />

                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  onClick={handleNext}
                >
                  Continua
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  I tuoi dati
                </h2>

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
                  label="Indirizzo"
                  placeholder="Via Roma, 1"
                  value={formData.street}
                  onChange={(e) => updateField('street', e.target.value)}
                  leftIcon={<MapPin className="w-5 h-5" />}
                  error={errors.street}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Citta"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />

                  <Input
                    label="CAP"
                    placeholder="20121"
                    value={formData.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Indietro
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    size="lg"
                    isLoading={isLoading}
                  >
                    Registrati
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Hai gia un account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Accedi
            </Link>
          </p>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-4">
          Registrandoti accetti i nostri{' '}
          <Link to="#" className="text-primary-600 hover:underline">
            Termini di Servizio
          </Link>{' '}
          e la{' '}
          <Link to="#" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
