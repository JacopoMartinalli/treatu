import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Heart,
  Search,
  Clock,
  MapPin,
  Star,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button, Card, Avatar, Badge, EmptyState } from '../../components/shared';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { format, isPast } from 'date-fns';
import { it } from 'date-fns/locale';

// ============================================
// DASHBOARD PAGE (CLIENT)
// ============================================

export function ClientDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bookings } = useBookingStore();
  const { getFavorites, favoriteIds } = useFavoritesStore();

  const client = user?.role === 'client' ? user : null;
  const favorites = getFavorites();

  const clientBookings = useMemo(() => {
    if (!user) return [];
    return bookings
      .filter((b) => b.clientId === user.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [bookings, user]);

  const upcomingBookings = useMemo(() => {
    return clientBookings
      .filter((b) => !isPast(new Date(b.date)) && b.status !== 'cancelled' && b.status !== 'rejected')
      .slice(0, 3);
  }, [clientBookings]);

  const stats = useMemo(() => {
    const upcoming = clientBookings.filter(
      (b) => !isPast(new Date(b.date)) && b.status === 'confirmed'
    ).length;
    const completed = clientBookings.filter((b) => b.status === 'completed').length;
    return {
      upcomingCount: upcoming,
      completedCount: completed,
      favoritesCount: favoriteIds.length,
    };
  }, [clientBookings, favoriteIds]);

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          title="Accesso non autorizzato"
          description="Devi essere registrato come cliente per accedere alla dashboard."
          action={{
            label: 'Torna alla Home',
            onClick: () => navigate('/'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ciao, {client.firstName}!
            </h1>
            <p className="text-gray-600">
              Benvenuto nella tua area personale
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/bookings')}>
              <Calendar className="w-5 h-5 mr-2" />
              Le mie prenotazioni
            </Button>
            <Button onClick={() => navigate('/search')}>
              <Search className="w-5 h-5 mr-2" />
              Cerca professionista
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingCount}</p>
                <p className="text-sm text-gray-600">Appuntamenti in arrivo</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCount}</p>
                <p className="text-sm text-gray-600">Trattamenti completati</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.favoritesCount}</p>
                <p className="text-sm text-gray-600">Professionisti preferiti</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Prossimi Appuntamenti
                </h2>
                {clientBookings.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/bookings')}
                  >
                    Vedi tutti
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              {upcomingBookings.length === 0 ? (
                <Card className="p-8">
                  <EmptyState
                    icon={<Calendar className="w-8 h-8" />}
                    title="Nessun appuntamento"
                    description="Non hai appuntamenti in programma. Cerca un professionista e prenota il tuo prossimo trattamento!"
                    action={{
                      label: 'Cerca un Professionista',
                      onClick: () => navigate('/search'),
                    }}
                  />
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-primary-100 rounded-xl flex flex-col items-center justify-center">
                            <span className="text-xs font-medium text-primary-600 uppercase">
                              {format(new Date(booking.date), 'MMM', { locale: it })}
                            </span>
                            <span className="text-lg font-bold text-primary-700">
                              {format(new Date(booking.date), 'd')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {booking.serviceName}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {booking.location}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              booking.status === 'confirmed'
                                ? 'success'
                                : booking.status === 'pending'
                                ? 'warning'
                                : 'default'
                            }
                          >
                            {booking.status === 'confirmed'
                              ? 'Confermato'
                              : booking.status === 'pending'
                              ? 'In attesa'
                              : booking.status}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Azioni Rapide
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => navigate('/search')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                      <Search className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Cerca Professionista</h3>
                      <p className="text-sm text-gray-500">Trova il trattamento perfetto</p>
                    </div>
                  </div>
                </Card>
                <Card
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => navigate('/favorites')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">I miei Preferiti</h3>
                      <p className="text-sm text-gray-500">{stats.favoritesCount} salvati</p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Favorites Preview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Preferiti</h3>
                {favorites.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/favorites')}
                  >
                    Vedi tutti
                  </Button>
                )}
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-4">
                  <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Nessun preferito salvato
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.slice(0, 3).map((professional) => (
                    <div
                      key={professional.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/professional/${professional.id}`)}
                    >
                      <Avatar
                        src={professional.avatar}
                        name={`${professional.firstName} ${professional.lastName}`}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {professional.firstName} {professional.lastName}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {professional.rating}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Profile Card */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Il tuo profilo</h3>
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  name={`${client.firstName} ${client.lastName}`}
                  size="lg"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {client.firstName} {client.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/profile')}
              >
                Modifica profilo
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
