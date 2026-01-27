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
  Plus,
  Trash2,
  Star,
  Shield,
  BadgeCheck,
  Clock,
  Euro,
  FileText,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useReviewStore } from '../../store/reviewStore';
import { Button, Card, Input, Avatar, Badge, Modal } from '../../components/shared';
import { Professional, Service, ServiceCategory } from '../../types';
import { serviceCategories } from '../../data/mockData';
import toast from 'react-hot-toast';

// ============================================
// PROFESSIONAL PROFILE PAGE
// ============================================

export function ProfessionalProfilePage() {
  const { user, registerProfessional } = useAuthStore();
  const { getAverageRating, getReviewCount } = useReviewStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const professional = user as Professional;
  const rating = professional ? getAverageRating(professional.id) : 0;
  const reviewCount = professional ? getReviewCount(professional.id) : 0;

  const [formData, setFormData] = useState<Partial<Professional>>({
    firstName: professional?.firstName || '',
    lastName: professional?.lastName || '',
    phone: professional?.phone || '',
    bio: professional?.bio || '',
    coverageRadius: professional?.coverageRadius || 10,
    baseLocation: professional?.baseLocation || {
      street: '',
      city: '',
      postalCode: '',
      province: '',
      latitude: 0,
      longitude: 0,
    },
    services: professional?.services || [],
  });

  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    duration: 60,
    price: 50,
    category: 'rilassante',
  });

  const handleSave = async () => {
    try {
      await registerProfessional({
        ...professional,
        ...formData,
      });
      setIsEditing(false);
      setEditSection(null);
      toast.success('Profilo aggiornato');
    } catch {
      toast.error('Errore nel salvataggio');
    }
  };

  const handleAddService = () => {
    if (!newService.name || !newService.description) {
      toast.error('Compila tutti i campi');
      return;
    }

    const service: Service = {
      id: `srv-${Date.now()}`,
      name: newService.name!,
      description: newService.description!,
      duration: newService.duration!,
      price: newService.price!,
      category: newService.category as ServiceCategory,
    };

    setFormData({
      ...formData,
      services: [...(formData.services || []), service],
    });

    setNewService({
      name: '',
      description: '',
      duration: 60,
      price: 50,
      category: 'rilassante',
    });
    setShowServiceModal(false);
    toast.success('Servizio aggiunto');
  };

  const handleRemoveService = (serviceId: string) => {
    setFormData({
      ...formData,
      services: formData.services?.filter((s) => s.id !== serviceId),
    });
    toast.success('Servizio rimosso');
  };

  const stats = [
    {
      icon: Star,
      label: 'Rating',
      value: rating > 0 ? rating.toFixed(1) : 'N/D',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: FileText,
      label: 'Recensioni',
      value: reviewCount,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: MapPin,
      label: 'Copertura',
      value: `${professional?.coverageRadius || 0} km`,
      color: 'bg-green-100 text-green-600',
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
            Gestisci le tue informazioni professionali
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Basic Info Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      src={professional?.avatar}
                      name={`${professional?.firstName} ${professional?.lastName}`}
                      size="lg"
                    />
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {professional?.firstName} {professional?.lastName}
                      </h2>
                      {professional?.isVerified && (
                        <BadgeCheck className="w-5 h-5 text-primary-500" />
                      )}
                    </div>
                    <p className="text-gray-500">{professional?.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={professional?.plan === 'premium' ? 'primary' : 'default'}>
                        {professional?.plan === 'premium' ? 'Premium' : 'Free'}
                      </Badge>
                      {professional?.isInsured && (
                        <Badge variant="success">
                          <Shield className="w-3 h-3 mr-1" />
                          Assicurato
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit3 className="w-4 h-4" />}
                    onClick={() => {
                      setIsEditing(true);
                      setEditSection('basic');
                    }}
                  >
                    Modifica
                  </Button>
                )}
              </div>

              {editSection === 'basic' ? (
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      leftIcon={<X className="w-4 h-4" />}
                      onClick={() => {
                        setIsEditing(false);
                        setEditSection(null);
                      }}
                    >
                      Annulla
                    </Button>
                    <Button
                      leftIcon={<Save className="w-4 h-4" />}
                      onClick={handleSave}
                    >
                      Salva
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <InfoRow
                    icon={<User className="w-5 h-5" />}
                    label="Nome completo"
                    value={`${professional?.firstName} ${professional?.lastName}`}
                  />
                  <InfoRow
                    icon={<Mail className="w-5 h-5" />}
                    label="Email"
                    value={professional?.email}
                  />
                  <InfoRow
                    icon={<Phone className="w-5 h-5" />}
                    label="Telefono"
                    value={professional?.phone}
                  />
                  {professional?.bio && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Bio</p>
                      <p className="text-gray-700">{professional.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Location Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Zona di copertura</h3>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit3 className="w-4 h-4" />}
                    onClick={() => {
                      setIsEditing(true);
                      setEditSection('location');
                    }}
                  >
                    Modifica
                  </Button>
                )}
              </div>

              {editSection === 'location' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Indirizzo base
                    </label>
                    <Input
                      value={formData.baseLocation?.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          baseLocation: {
                            ...formData.baseLocation!,
                            street: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Citta
                      </label>
                      <Input
                        value={formData.baseLocation?.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            baseLocation: {
                              ...formData.baseLocation!,
                              city: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CAP
                      </label>
                      <Input
                        value={formData.baseLocation?.postalCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            baseLocation: {
                              ...formData.baseLocation!,
                              postalCode: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provincia
                      </label>
                      <Input
                        value={formData.baseLocation?.province}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            baseLocation: {
                              ...formData.baseLocation!,
                              province: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Raggio di copertura (km)
                    </label>
                    <Input
                      type="number"
                      value={formData.coverageRadius}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coverageRadius: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditSection(null);
                      }}
                    >
                      Annulla
                    </Button>
                    <Button onClick={handleSave}>Salva</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <InfoRow
                    icon={<MapPin className="w-5 h-5" />}
                    label="Indirizzo base"
                    value={
                      professional?.baseLocation
                        ? `${professional.baseLocation.street}, ${professional.baseLocation.city}`
                        : 'Non specificato'
                    }
                  />
                  <InfoRow
                    icon={<MapPin className="w-5 h-5" />}
                    label="Raggio copertura"
                    value={`${professional?.coverageRadius || 0} km`}
                  />
                </div>
              )}
            </Card>

            {/* Services Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">I miei servizi</h3>
                <Button
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowServiceModal(true)}
                >
                  Aggiungi
                </Button>
              </div>

              <div className="space-y-3">
                {(isEditing ? formData.services : professional?.services)?.map(
                  (service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <Badge variant="default">
                            {
                              serviceCategories.find(
                                (c) => c.id === service.category
                              )?.name
                            }
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {service.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            {service.price}
                          </span>
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveService(service.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                )}

                {(isEditing ? formData.services : professional?.services)
                  ?.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Nessun servizio configurato
                  </p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                  >
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
              <p className="text-sm text-gray-500 mb-1">P.IVA</p>
              <p className="font-medium text-gray-900">
                {professional?.partitaIva || 'N/D'}
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-sm text-gray-500 mb-1">Membro da</p>
              <p className="font-medium text-gray-900">
                {professional?.createdAt
                  ? new Date(professional.createdAt).toLocaleDateString('it-IT', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'N/D'}
              </p>
            </Card>

            {professional?.plan === 'free' && (
              <Card className="p-4 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                <h4 className="font-semibold mb-2">Passa a Premium</h4>
                <p className="text-sm text-white/80 mb-3">
                  Ottieni piu visibilita e funzionalita avanzate
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-primary-600 hover:bg-gray-100"
                >
                  Scopri di piu
                </Button>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Add Service Modal */}
      <Modal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        title="Aggiungi servizio"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome servizio
            </label>
            <Input
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              placeholder="es. Massaggio Rilassante"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={newService.category}
              onChange={(e) =>
                setNewService({
                  ...newService,
                  category: e.target.value as ServiceCategory,
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
            >
              {serviceCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrizione
            </label>
            <textarea
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Descrivi il tuo servizio..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durata (min)
              </label>
              <Input
                type="number"
                value={newService.duration}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    duration: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prezzo (€)
              </label>
              <Input
                type="number"
                value={newService.price}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    price: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowServiceModal(false)}>
              Annulla
            </Button>
            <Button onClick={handleAddService}>Aggiungi servizio</Button>
          </div>
        </div>
      </Modal>
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
