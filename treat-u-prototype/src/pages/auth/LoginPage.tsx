import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card } from '../../components/shared';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

// ============================================
// LOGIN PAGE
// ============================================

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsClient, loginAsProfessional, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'client' | 'professional'>('client');

  // Check if redirected from a protected route
  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Inserisci email e password');
      return;
    }

    let success = false;
    if (loginType === 'client') {
      success = await loginAsClient(email, password);
    } else {
      success = await loginAsProfessional(email, password);
    }

    if (success) {
      toast.success('Accesso effettuato!');
      navigate(loginType === 'professional' ? '/pro/dashboard' : from);
    } else {
      toast.error('Credenziali non valide');
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
            Bentornato!
          </h1>
          <p className="text-gray-600">
            Accedi al tuo account TreatU
          </p>
        </div>

        <Card padding="lg">
          {/* Login Type Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setLoginType('client')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === 'client'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setLoginType('professional')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === 'professional'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Professionista
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="nome@email.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="La tua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Ricordami</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Password dimenticata?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Accedi
            </Button>
          </form>

          {/* OAuth Buttons (Placeholders) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  oppure continua con
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => toast('OAuth Google - Coming Soon!')}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => toast('OAuth Apple - Coming Soon!')}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Non hai un account?{' '}
            <Link
              to={loginType === 'professional' ? '/pro/register' : '/register'}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Registrati
            </Link>
          </p>
        </Card>

        {/* Demo credentials hint */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo:</strong> Usa qualsiasi email per accedere.
            {loginType === 'client' && ' Verrai autenticato come cliente demo.'}
            {loginType === 'professional' && ' Verrai autenticato come Giulia Rossi.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
