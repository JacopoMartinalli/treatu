import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Button, Card, Badge, Avatar, EmptyState } from '../../components/shared';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { Booking, BookingStatus } from '../../types';
import { format, isPast } from 'date-fns';
import { it } from 'date-fns/locale';

// ============================================
// BOOKINGS LIST PAGE (CLIENT)
// ============================================

export function BookingsListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bookings } = useBookingStore();

  const clientBookings = useMemo(() => {
    if (!user) return [];
    return bookings
      .filter((b) => b.clientId === user.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bookings, user]);

  const upcomingBookings = clientBookings.filter(
    (b) => !isPast(new Date(b.date)) && b.status !== 'cancelled'
  );
  const pastBookings = clientBookings.filter(
    (b) => isPast(new Date(b.date)) || b.status === 'cancelled'
  );

  if (clientBookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Le Mie Prenotazioni
          </h1>
          <EmptyState
            icon={<Calendar className="w-8 h-8" />}
            title="Nessuna prenotazione"
            description="Non hai ancora effettuato prenotazioni. Cerca un professionista e prenota il tuo primo trattamento!"
            action={{
              label: 'Cerca un Professionista',
              onClick: () => navigate('/search'),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Le Mie Prenotazioni
        </h1>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Prossimi Appuntamenti ({upcomingBookings.length})
            </h2>
            <div className="space-y-4">
              {upcomingBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BookingCard booking={booking} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Storico ({pastBookings.length})
            </h2>
            <div className="space-y-4">
              {pastBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BookingCard booking={booking} isPast />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Action */}
        <div className="fixed bottom-6 right-6">
          <Button
            size="lg"
            onClick={() => navigate('/search')}
            className="shadow-lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Nuova Prenotazione
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function BookingCard({
  booking,
  isPast = false,
}: {
  booking: Booking;
  isPast?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <Card
      className={isPast ? 'opacity-75' : ''}
      hoverable
      onClick={() => navigate(`/bookings/${booking.id}`)}
    >
      <div className="flex items-start gap-4">
        <Avatar
          src={booking.professional.avatar}
          name={`${booking.professional.firstName} ${booking.professional.lastName}`}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">
                {booking.professional.firstName} {booking.professional.lastName}
              </h3>
              <p className="text-sm text-gray-600">{booking.service.name}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(booking.date), 'd MMMM yyyy', { locale: it })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {booking.startTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {booking.address.city}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <span className="font-semibold text-primary-600">
              EUR{booking.totalPrice}
            </span>

            {!isPast && booking.status === 'confirmed' && (
              <Button variant="outline" size="sm">
                Contatta
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const config = {
    pending: {
      variant: 'warning' as const,
      icon: <AlertCircle className="w-3 h-3" />,
      label: 'In attesa',
    },
    confirmed: {
      variant: 'success' as const,
      icon: <CheckCircle className="w-3 h-3" />,
      label: 'Confermata',
    },
    rejected: {
      variant: 'danger' as const,
      icon: <XCircle className="w-3 h-3" />,
      label: 'Rifiutata',
    },
    cancelled: {
      variant: 'danger' as const,
      icon: <XCircle className="w-3 h-3" />,
      label: 'Cancellata',
    },
    completed: {
      variant: 'default' as const,
      icon: <CheckCircle className="w-3 h-3" />,
      label: 'Completata',
    },
  };

  const { variant, icon, label } = config[status];

  return (
    <Badge variant={variant}>
      {icon}
      <span className="ml-1">{label}</span>
    </Badge>
  );
}
