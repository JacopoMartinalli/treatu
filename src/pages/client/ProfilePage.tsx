import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Camera,
  Save,
  X,
  Heart,
  Calendar,
  Star,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { Button, Card, Input, Avatar } from '../../components/shared';
import { Client } from '../../types';
import toast from 'react-hot-toast';

// ============================================
// PROFILE PAGE
// ============================================

export function ProfilePage() {
  const { user, registerClient } = useAuthStore();
  const { getBookingsForClient } = useBookingStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: (user as Client)?.address || {
      street: '',
      city: '',
      postalCode: '',
      province: '',
      latitude: 0,
      longitude: 0,
    },
  });

  const client = user as Client;
  const bookings = client ? getBookingsForClient(client.id) : [];
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const favoriteCount = client?.favoritesProfessionals?.length || 0;

  const handleSave = async () => {
    try {
      // In un'app reale, qui ci sarebbe una chiamata API
      await registerClient({
        ...client,
        ...formData,
      });
      setIsEditing(false);
      toast.success('Profilo aggiornato con successo');
    } catch {
      toast.error('Errore nel salvataggio');
    }
  };

  const stats = [
    {
      icon: Calendar,
      label: 'Prenotazioni',
      value: bookings.length,
      color: 'bg-primary-100 text-primary-600',
    },
    {
      icon: Star,
      label: 'Completati',
      value: completedBookings.length,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Heart,
      label: 'Preferiti',
      value: favoriteCount,
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">Il mio Profilo</h1>
          <p className="text-gray-600 mt-1">
            Gestisci le tue informazioni personali
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      src={client?.avatar}
                      name={`${client?.firstName} ${client?.lastName}`}
                      size="lg"
                    />
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {client?.firstName} {client?.lastName}
                    </h2>
                    <p className="text-gray-500">{client?.email}</p>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit3 className="w-4 h-4" />}
                    onClick={() => setIsEditing(true)}
                  >
                    Modifica
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        placeholder="Nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cognome
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Cognome"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefono
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+39 333 1234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Indirizzo
                    </label>
                    <Input
                      value={formData.address?.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address!, street: e.target.value },
                        })
                      }
                      placeholder="Via e numero civico"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Citta
                      </label>
                      <Input
                        value={formData.address?.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: { ...formData.address!, city: e.target.value },
                          })
                        }
                        placeholder="Milano"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CAP
                      </label>
                      <Input
                        value={formData.address?.postalCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address!,
                              postalCode: e.target.value,
                            },
                          })
                        }
                        placeholder="20121"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provincia
                      </label>
                      <Input
                        value={formData.address?.province}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address!,
                              province: e.target.value,
                            },
                          })
                        }
                        placeholder="MI"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      leftIcon={<X className="w-4 h-4" />}
                      onClick={() => setIsEditing(false)}
                    >
                      Annulla
                    </Button>
                    <Button
                      leftIcon={<Save className="w-4 h-4" />}
                      onClick={handleSave}
                    >
                      Salva modifiche
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <InfoRow
                    icon={<User className="w-5 h-5" />}
                    label="Nome completo"
                    value={`${client?.firstName} ${client?.lastName}`}
                  />
                  <InfoRow
                    icon={<Mail className="w-5 h-5" />}
                    label="Email"
                    value={client?.email}
                  />
                  <InfoRow
                    icon={<Phone className="w-5 h-5" />}
                    label="Telefono"
                    value={client?.phone}
                  />
                  <InfoRow
                    icon={<MapPin className="w-5 h-5" />}
                    label="Indirizzo"
                    value={
                      client?.address
                        ? `${client.address.street}, ${client.address.city} (${client.address.province})`
                        : 'Non specificato'
                    }
                  />
                </div>
              )}
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="p-4">
              <p className="text-sm text-gray-500 mb-1">Membro da</p>
              <p className="font-medium text-gray-900">
                {client?.createdAt
                  ? new Date(client.createdAt).toLocaleDateString('it-IT', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'N/D'}
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value || 'Non specificato'}</p>
      </div>
    </div>
  );
}
