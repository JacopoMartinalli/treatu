import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Euro,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Button, Card, Badge, Avatar, EmptyState } from '../../components/shared';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { Booking } from '../../types';
import { format, startOfWeek, endOfWeek, isWithinInterval, addDays } from 'date-fns';
import { it } from 'date-fns/locale';
import toast from 'react-hot-toast';

// ============================================
// DASHBOARD PAGE (PROFESSIONAL)
// ============================================

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bookings, updateBookingStatus, getPendingBookings } = useBookingStore();

  const professional = user?.role === 'professional' ? user : null;

  const myBookings = useMemo(() => {
    if (!professional) return [];
    return bookings.filter((b) => b.professionalId === professional.id);
  }, [bookings, professional]);

  const pendingBookings = useMemo(() => {
    if (!professional) return [];
    return getPendingBookings(professional.id);
  }, [professional, getPendingBookings]);

  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const weeklyBookings = myBookings.filter(
      (b) =>
        b.status === 'confirmed' &&
        isWithinInterval(new Date(b.date), { start: weekStart, end: weekEnd })
    );

    const monthlyRevenue = myBookings
      .filter(
        (b) =>
          b.status === 'completed' &&
          new Date(b.date).getMonth() === now.getMonth()
      )
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      weeklyAppointments: weeklyBookings.length,
      monthlyRevenue,
      averageRating: professional?.rating || 0,
      totalReviews: professional?.reviewCount || 0,
      pendingRequests: pendingBookings.length,
    };
  }, [myBookings, pendingBookings, professional]);

  const upcomingBookings = useMemo(() => {
    return myBookings
      .filter(
        (b) =>
          b.status === 'confirmed' && new Date(b.date) >= new Date()
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [myBookings]);

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
    toast.success('Prenotazione accettata!');
  };

  const handleRejectBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'rejected');
    toast.success('Prenotazione rifiutata');
  };

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          title="Accesso non autorizzato"
          description="Devi essere registrato come professionista per accedere alla dashboard."
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ciao, {professional.firstName}!
            </h1>
            <p className="text-gray-600">
              Ecco un riepilogo della tua attivita
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/pro/calendar')}>
              <Calendar className="w-5 h-5 mr-2" />
              Calendario
            </Button>
            <Button onClick={() => navigate('/pro/profile')}>
              Modifica Profilo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={<Calendar className="w-6 h-6" />}
            label="Appuntamenti Settimana"
            value={weeklyStats.weeklyAppointments}
            color="primary"
          />
          <StatsCard
            icon={<Euro className="w-6 h-6" />}
            label="Incasso Mese"
            value={`EUR${weeklyStats.monthlyRevenue}`}
            color="green"
          />
          <StatsCard
            icon={<Star className="w-6 h-6" />}
            label="Rating Medio"
            value={weeklyStats.averageRating.toFixed(1)}
            subValue={`${weeklyStats.totalReviews} recensioni`}
            color="yellow"
          />
          <StatsCard
            icon={<Users className="w-6 h-6" />}
            label="Richieste in Attesa"
            value={weeklyStats.pendingRequests}
            color="orange"
            highlight={weeklyStats.pendingRequests > 0}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Requests */}
            {pendingBookings.length > 0 && (
              <Card padding="none">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">
                      Nuove Richieste
                    </h2>
                    <Badge variant="warning">{pendingBookings.length}</Badge>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {pendingBookings.map((booking) => (
                    <PendingBookingCard
                      key={booking.id}
                      booking={booking}
                      onAccept={() => handleAcceptBooking(booking.id)}
                      onReject={() => handleRejectBooking(booking.id)}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Upcoming Appointments */}
            <Card padding="none">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Prossimi Appuntamenti
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/pro/calendar')}
                >
                  Vedi tutti
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              {upcomingBookings.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {upcomingBookings.map((booking) => (
                    <UpcomingBookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="p-8">
                  <EmptyState
                    icon={<Calendar className="w-8 h-8" />}
                    title="Nessun appuntamento"
                    description="Non hai appuntamenti confermati in programma."
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Week View */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Questa Settimana</h3>
              <WeekView bookings={myBookings} />
            </Card>

            {/* Profile Summary */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Il tuo Profilo</h3>
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  src={professional.avatar}
                  name={`${professional.firstName} ${professional.lastName}`}
                  size="lg"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {professional.firstName} {professional.lastName}
                  </p>
                  <Badge variant={professional.plan === 'premium' ? 'success' : 'default'}>
                    Piano {professional.plan === 'premium' ? 'Premium' : 'Free'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Servizi attivi</span>
                  <span className="font-medium">{professional.services.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Visibilita</span>
                  <Badge variant={professional.isMarketplaceVisible ? 'success' : 'danger'}>
                    {professional.isMarketplaceVisible ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Zona copertura</span>
                  <span className="font-medium">{professional.coverageRadius} km</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate(`/professional/${professional.id}`)}
              >
                Vedi come ti vedono i clienti
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function StatsCard({
  icon,
  label,
  value,
  subValue,
  color,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color: 'primary' | 'green' | 'yellow' | 'orange';
  highlight?: boolean;
}) {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={highlight ? 'ring-2 ring-orange-400' : ''}>
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
          {highlight && (
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
            </span>
          )}
        </div>
        <p className="mt-4 text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
      </Card>
    </motion.div>
  );
}

function PendingBookingCard({
  booking,
  onAccept,
  onReject,
}: {
  booking: Booking;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="p-4">
      <div className="flex items-start gap-4">
        <Avatar
          src={booking.client.avatar}
          name={`${booking.client.firstName} ${booking.client.lastName}`}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-gray-900">
                {booking.client.firstName} {booking.client.lastName}
              </p>
              <p className="text-sm text-gray-600">{booking.service.name}</p>
            </div>
            <Badge variant="warning">Nuova</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(booking.date), 'd MMM', { locale: it })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {booking.startTime}
            </span>
            <span className="font-semibold text-primary-600">
              EUR{booking.totalPrice}
            </span>
          </div>

          {booking.notes && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 flex items-start gap-1">
                <MessageSquare className="w-3 h-3 mt-0.5" />
                {booking.notes}
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={onAccept}>
              <CheckCircle className="w-4 h-4 mr-1" />
              Accetta
            </Button>
            <Button variant="outline" size="sm" onClick={onReject}>
              <XCircle className="w-4 h-4 mr-1" />
              Rifiuta
            </Button>
            <Button variant="ghost" size="sm">
              Proponi alternativa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpcomingBookingCard({ booking }: { booking: Booking }) {
  const isToday =
    new Date(booking.date).toDateString() === new Date().toDateString();

  return (
    <div className="p-4 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${
          isToday ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
        }`}
      >
        <span className="text-xs font-medium uppercase">
          {format(new Date(booking.date), 'EEE', { locale: it })}
        </span>
        <span className="text-lg font-bold">
          {format(new Date(booking.date), 'd')}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">
          {booking.client.firstName} {booking.client.lastName}
        </p>
        <p className="text-sm text-gray-500">
          {booking.service.name} - {booking.startTime}
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-primary-600">EUR{booking.totalPrice}</p>
        {isToday && (
          <Badge variant="success" size="sm">
            Oggi
          </Badge>
        )}
      </div>
    </div>
  );
}

function WeekView({ bookings }: { bookings: Booking[] }) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getBookingsForDay = (date: Date) => {
    return bookings.filter(
      (b) =>
        b.status === 'confirmed' &&
        new Date(b.date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day) => {
        const dayBookings = getBookingsForDay(day);
        const isToday = day.toDateString() === today.toDateString();

        return (
          <div
            key={day.toISOString()}
            className={`p-2 rounded-lg text-center ${
              isToday ? 'bg-primary-100' : 'bg-gray-50'
            }`}
          >
            <p className="text-xs text-gray-500 uppercase">
              {format(day, 'EEE', { locale: it })}
            </p>
            <p
              className={`text-sm font-medium ${
                isToday ? 'text-primary-600' : 'text-gray-900'
              }`}
            >
              {format(day, 'd')}
            </p>
            {dayBookings.length > 0 && (
              <div className="mt-1">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-600 text-white text-xs rounded-full">
                  {dayBookings.length}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
