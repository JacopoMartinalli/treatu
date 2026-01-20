import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Lock,
  Shield,
  Trash2,
  ChevronRight,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Moon,
  Globe,
} from 'lucide-react';
import { Button, Card, Input } from '../../components/shared';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

// ============================================
// SETTINGS PAGE
// ============================================

export function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'notifications',
      title: 'Notifiche',
      description: 'Gestisci come ricevi le notifiche',
      icon: Bell,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'security',
      title: 'Sicurezza',
      description: 'Password e autenticazione',
      icon: Lock,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Controlla i tuoi dati',
      icon: Shield,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'preferences',
      title: 'Preferenze',
      description: 'Lingua e aspetto',
      icon: Globe,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
          <p className="text-gray-600 mt-1">
            Gestisci il tuo account e le tue preferenze
          </p>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{user?.email}</p>
                <p className="text-sm text-gray-500">
                  {user?.role === 'professional' ? 'Account Professionista' : 'Account Cliente'}
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Attivo
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="divide-y divide-gray-100">
            {sections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() =>
                    setActiveSection(
                      activeSection === section.id ? null : section.id
                    )
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}
                    >
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{section.title}</p>
                      <p className="text-sm text-gray-500">{section.description}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      activeSection === section.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {activeSection === section.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4"
                  >
                    {section.id === 'notifications' && <NotificationSettings />}
                    {section.id === 'security' && <SecuritySettings />}
                    {section.id === 'privacy' && <PrivacySettings />}
                    {section.id === 'preferences' && <PreferencesSettings />}
                  </motion.div>
                )}
              </div>
            ))}
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="p-6 border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Zona pericolosa
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Elimina account</p>
                <p className="text-sm text-gray-500">
                  Questa azione e irreversibile
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => {
                  toast.error('Funzionalita non disponibile nel prototipo');
                }}
              >
                Elimina
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Button
            variant="outline"
            className="w-full"
            onClick={logout}
          >
            Esci dall'account
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// NOTIFICATION SETTINGS
// ============================================

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailBookings: true,
    emailPromotions: false,
    pushBookings: true,
    pushReminders: true,
    smsReminders: false,
  });

  const handleSave = () => {
    toast.success('Preferenze notifiche salvate');
  };

  return (
    <div className="space-y-4 bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 flex items-center gap-2">
        <Mail className="w-4 h-4" />
        Email
      </h3>
      <ToggleItem
        label="Conferme prenotazioni"
        description="Ricevi email per nuove prenotazioni e modifiche"
        checked={settings.emailBookings}
        onChange={(checked) =>
          setSettings({ ...settings, emailBookings: checked })
        }
      />
      <ToggleItem
        label="Promozioni e novita"
        description="Offerte speciali e nuovi professionisti"
        checked={settings.emailPromotions}
        onChange={(checked) =>
          setSettings({ ...settings, emailPromotions: checked })
        }
      />

      <h3 className="font-medium text-gray-900 flex items-center gap-2 pt-4">
        <Smartphone className="w-4 h-4" />
        Push
      </h3>
      <ToggleItem
        label="Aggiornamenti prenotazioni"
        description="Notifiche in tempo reale sulle prenotazioni"
        checked={settings.pushBookings}
        onChange={(checked) =>
          setSettings({ ...settings, pushBookings: checked })
        }
      />
      <ToggleItem
        label="Promemoria"
        description="Ricordati degli appuntamenti imminenti"
        checked={settings.pushReminders}
        onChange={(checked) =>
          setSettings({ ...settings, pushReminders: checked })
        }
      />

      <ToggleItem
        label="SMS promemoria"
        description="Ricevi promemoria via SMS"
        checked={settings.smsReminders}
        onChange={(checked) =>
          setSettings({ ...settings, smsReminders: checked })
        }
      />

      <Button size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
        Salva preferenze
      </Button>
    </div>
  );
}

// ============================================
// SECURITY SETTINGS
// ============================================

function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Le password non coincidono');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('La password deve avere almeno 8 caratteri');
      return;
    }
    toast.success('Password aggiornata con successo');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-4 bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium text-gray-900">Cambia password</h3>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Password attuale
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={passwords.current}
            onChange={(e) =>
              setPasswords({ ...passwords, current: e.target.value })
            }
            placeholder="Inserisci la password attuale"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Nuova password
        </label>
        <Input
          type={showPassword ? 'text' : 'password'}
          value={passwords.new}
          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          placeholder="Inserisci la nuova password"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Conferma password
        </label>
        <Input
          type={showPassword ? 'text' : 'password'}
          value={passwords.confirm}
          onChange={(e) =>
            setPasswords({ ...passwords, confirm: e.target.value })
          }
          placeholder="Conferma la nuova password"
        />
      </div>

      <Button size="sm" onClick={handleChangePassword}>
        Aggiorna password
      </Button>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">
          Autenticazione a due fattori
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Aggiungi un ulteriore livello di sicurezza al tuo account
        </p>
        <Button variant="outline" size="sm">
          Attiva 2FA
        </Button>
      </div>
    </div>
  );
}

// ============================================
// PRIVACY SETTINGS
// ============================================

function PrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisible: true,
    shareData: false,
    analytics: true,
  });

  const handleSave = () => {
    toast.success('Impostazioni privacy salvate');
  };

  return (
    <div className="space-y-4 bg-gray-50 rounded-lg p-4">
      <ToggleItem
        label="Profilo visibile"
        description="I professionisti possono vedere il tuo profilo"
        checked={settings.profileVisible}
        onChange={(checked) =>
          setSettings({ ...settings, profileVisible: checked })
        }
      />
      <ToggleItem
        label="Condivisione dati"
        description="Condividi dati anonimi per migliorare il servizio"
        checked={settings.shareData}
        onChange={(checked) =>
          setSettings({ ...settings, shareData: checked })
        }
      />
      <ToggleItem
        label="Analytics"
        description="Consenti analisi del comportamento di navigazione"
        checked={settings.analytics}
        onChange={(checked) =>
          setSettings({ ...settings, analytics: checked })
        }
      />

      <div className="pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">I tuoi dati</h3>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Richiesta inviata')}
          >
            Scarica i miei dati
          </Button>
        </div>
      </div>

      <Button size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
        Salva impostazioni
      </Button>
    </div>
  );
}

// ============================================
// PREFERENCES SETTINGS
// ============================================

function PreferencesSettings() {
  const [settings, setSettings] = useState({
    language: 'it',
    darkMode: false,
    compactView: false,
  });

  const handleSave = () => {
    toast.success('Preferenze salvate');
  };

  return (
    <div className="space-y-4 bg-gray-50 rounded-lg p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lingua
        </label>
        <select
          value={settings.language}
          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="it">Italiano</option>
          <option value="en">English</option>
          <option value="es">Espanol</option>
          <option value="fr">Francais</option>
        </select>
      </div>

      <ToggleItem
        label="Modalita scura"
        description="Riduci l'affaticamento visivo in ambienti poco illuminati"
        checked={settings.darkMode}
        onChange={(checked) => setSettings({ ...settings, darkMode: checked })}
        icon={<Moon className="w-4 h-4" />}
      />

      <ToggleItem
        label="Vista compatta"
        description="Mostra piu contenuti con meno spazio"
        checked={settings.compactView}
        onChange={(checked) =>
          setSettings({ ...settings, compactView: checked })
        }
      />

      <Button size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
        Salva preferenze
      </Button>
    </div>
  );
}

// ============================================
// TOGGLE ITEM COMPONENT
// ============================================

function ToggleItem({
  label,
  description,
  checked,
  onChange,
  icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-start gap-3">
        {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-primary-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
