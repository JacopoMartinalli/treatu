import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Phone,
  Check,
  X,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';
import { it } from 'date-fns/locale';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { Button, Card, Badge, Avatar, Modal } from '../../components/shared';
import { Booking, Professional } from '../../types';
import toast from 'react-hot-toast';

// ============================================
// CALENDAR PAGE
// ============================================

export function CalendarPage() {
  const { user } = useAuthStore();
  const { getBookingsForProfessional, updateBookingStatus } = useBookingStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const professional = user as Professional;
  const bookings = professional
    ? getBookingsForProfessional(professional.id)
    : [];

  // Raggruppa le prenotazioni per data
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((booking) => {
      const dateKey = format(new Date(booking.date), 'yyyy-MM-dd');
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, booking]);
    });
    return map;
  }, [bookings]);

  // Prenotazioni del giorno selezionato
  const selectedDateBookings = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return (bookingsByDate.get(dateKey) || []).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  }, [selectedDate, bookingsByDate]);

  // Navigazione mese
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Genera i giorni del calendario
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  const handleStatusChange = (bookingId: string, status: Booking['status']) => {
    updateBookingStatus(bookingId, status);
    setSelectedBooking(null);
    toast.success(
      status === 'confirmed'
        ? 'Prenotazione confermata'
        : status === 'rejected'
        ? 'Prenotazione rifiutata'
        : 'Stato aggiornato'
    );
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <p className="text-gray-600 mt-1">
            Gestisci i tuoi appuntamenti e la disponibilita
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(currentMonth, 'MMMM yyyy', { locale: it })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="px-3 py-1 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Oggi
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 mb-2">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayBookings = bookingsByDate.get(dateKey) || [];
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        min-h-[80px] p-2 rounded-lg border text-left transition-all
                        ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-transparent'}
                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                        ${isToday ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
                        hover:border-primary-300
                      `}
                    >
                      <span
                        className={`
                          text-sm font-medium
                          ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                          ${isToday ? 'text-primary-600' : ''}
                        `}
                      >
                        {format(day, 'd')}
                      </span>

                      {/* Booking Indicators */}
                      <div className="mt-1 space-y-1">
                        {dayBookings.slice(0, 3).map((booking) => (
                          <div
                            key={booking.id}
                            className={`
                              text-xs px-1.5 py-0.5 rounded truncate text-white
                              ${getStatusColor(booking.status)}
                            `}
                          >
                            {booking.startTime}
                          </div>
                        ))}
                        {dayBookings.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{dayBookings.length - 3} altri
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-500" />
                  <span className="text-sm text-gray-600">In attesa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span className="text-sm text-gray-600">Confermato</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-sm text-gray-600">Completato</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-sm text-gray-600">Annullato</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Day Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {selectedDate
                  ? format(selectedDate, "EEEE d MMMM", { locale: it })
                  : 'Seleziona un giorno'}
              </h3>

              {selectedDateBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nessun appuntamento</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateBookings.map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          {booking.startTime} - {booking.endTime}
                        </span>
                        <Badge
                          variant={
                            booking.status === 'confirmed'
                              ? 'success'
                              : booking.status === 'pending'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {booking.status === 'confirmed' && 'Confermato'}
                          {booking.status === 'pending' && 'In attesa'}
                          {booking.status === 'completed' && 'Completato'}
                          {booking.status === 'cancelled' && 'Annullato'}
                          {booking.status === 'rejected' && 'Rifiutato'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{booking.service.name}</p>
                      <p className="text-sm text-gray-500">
                        {booking.client.firstName} {booking.client.lastName}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Dettaglio Appuntamento"
      >
        {selectedBooking && (
          <div className="space-y-4">
            {/* Client Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Avatar
                src={selectedBooking.client.avatar}
                name={`${selectedBooking.client.firstName} ${selectedBooking.client.lastName}`}
                size="md"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {selectedBooking.client.firstName} {selectedBooking.client.lastName}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Phone className="w-3 h-3" />
                  {selectedBooking.client.phone}
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Servizio</h4>
              <p className="font-medium text-gray-900">
                {selectedBooking.service.name}
              </p>
              <p className="text-sm text-gray-500">
                {selectedBooking.service.duration} min - €{selectedBooking.totalPrice}
              </p>
            </div>

            {/* Date & Time */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Data e ora
              </h4>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>
                  {format(new Date(selectedBooking.date), 'd MMMM yyyy', {
                    locale: it,
                  })}{' '}
                  - {selectedBooking.startTime}
                </span>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Indirizzo</h4>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p>{selectedBooking.address.street}</p>
                  <p className="text-sm text-gray-500">
                    {selectedBooking.address.city} ({selectedBooking.address.province})
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedBooking.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Note</h4>
                <p className="text-gray-700">{selectedBooking.notes}</p>
              </div>
            )}

            {/* Actions */}
            {selectedBooking.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="flex-1"
                  leftIcon={<X className="w-4 h-4" />}
                  onClick={() =>
                    handleStatusChange(selectedBooking.id, 'rejected')
                  }
                >
                  Rifiuta
                </Button>
                <Button
                  className="flex-1"
                  leftIcon={<Check className="w-4 h-4" />}
                  onClick={() =>
                    handleStatusChange(selectedBooking.id, 'confirmed')
                  }
                >
                  Conferma
                </Button>
              </div>
            )}

            {selectedBooking.status === 'confirmed' && (
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    handleStatusChange(selectedBooking.id, 'cancelled')
                  }
                >
                  Annulla
                </Button>
                <Button
                  className="flex-1"
                  onClick={() =>
                    handleStatusChange(selectedBooking.id, 'completed')
                  }
                >
                  Completa
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
