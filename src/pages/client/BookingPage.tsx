import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button, Card, Input, Avatar, Badge } from '../../components/shared';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { generateAvailableSlots } from '../../data/mockData';
import { format, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import toast from 'react-hot-toast';

// ============================================
// BOOKING PAGE
// ============================================

type Step = 'date' | 'time' | 'address' | 'confirm' | 'success';

export function BookingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentDraft,
    setDateTime,
    setAddress,
    setNotes,
    createBooking,
    resetDraft,
    isLoading,
  } = useBookingStore();

  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [addressInput, setAddressInput] = useState(
    user?.role === 'client' ? user.address.street : ''
  );
  const [cityInput, setCityInput] = useState(
    user?.role === 'client' ? user.address.city : 'Milano'
  );
  const [notesInput, setNotesInput] = useState('');

  const { professional, service } = currentDraft;

  // Redirect if no booking data
  if (!professional || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Nessuna prenotazione in corso
          </h2>
          <p className="text-gray-600 mb-6">
            Seleziona prima un servizio dal profilo di un professionista.
          </p>
          <Button onClick={() => navigate('/search')}>
            Cerca un Professionista
          </Button>
        </Card>
      </div>
    );
  }

  // Generate available slots
  const availableSlots = generateAvailableSlots(professional.id);
  const slotsForSelectedDate = selectedDate
    ? availableSlots.filter(
        (slot) => isSameDay(slot.date, selectedDate) && !slot.isBooked
      )
    : [];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      setDateTime(selectedDate, time);
    }
    setStep('address');
  };

  const handleAddressConfirm = () => {
    if (!addressInput) {
      toast.error('Inserisci un indirizzo');
      return;
    }

    setAddress({
      street: addressInput,
      city: cityInput,
      postalCode: '',
      province: 'MI',
      latitude: 45.4642,
      longitude: 9.19,
    });
    setNotes(notesInput);
    setStep('confirm');
  };

  const handleConfirmBooking = async () => {
    if (!user) return;

    try {
      await createBooking(user.id);
      setStep('success');
      toast.success('Prenotazione inviata!');
    } catch {
      toast.error('Errore durante la prenotazione');
    }
  };

  const handleFinish = () => {
    resetDraft();
    navigate('/bookings');
  };

  // Check if date has available slots
  const hasAvailableSlots = (date: Date) => {
    return availableSlots.some(
      (slot) => isSameDay(slot.date, date) && !slot.isBooked
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Steps */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {(['date', 'time', 'address', 'confirm'] as const).map((s, index) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s
                      ? 'bg-primary-600 text-white'
                      : (['date', 'time', 'address', 'confirm'] as const).indexOf(step) > index
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-1 ${
                      (['date', 'time', 'address', 'confirm'] as const).indexOf(step) > index
                        ? 'bg-primary-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Booking Summary Card */}
        {step !== 'success' && (
          <Card className="mb-6">
            <div className="flex items-center gap-4">
              <Avatar src={professional.avatar} size="lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {professional.firstName} {professional.lastName}
                </h3>
                <p className="text-sm text-gray-600">{service.name}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration} min
                  </span>
                  <span className="font-semibold text-primary-600">
                    EUR{service.price}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 'date' && (
            <StepContainer key="date" title="Scegli la data">
              <Card padding="none">
                <Calendar
                  onChange={(date) => handleDateSelect(date as Date)}
                  value={selectedDate}
                  locale="it-IT"
                  minDate={new Date()}
                  tileDisabled={({ date }) => !hasAvailableSlots(date)}
                  tileClassName={({ date }) =>
                    hasAvailableSlots(date)
                      ? 'available-date'
                      : ''
                  }
                  className="w-full border-none"
                />
              </Card>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Seleziona una data disponibile per vedere gli orari
              </p>
            </StepContainer>
          )}

          {step === 'time' && (
            <StepContainer
              key="time"
              title={`Orari disponibili - ${format(selectedDate!, 'EEEE d MMMM', { locale: it })}`}
              onBack={() => setStep('date')}
            >
              {slotsForSelectedDate.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {slotsForSelectedDate.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? 'primary' : 'outline'}
                      onClick={() => handleTimeSelect(slot.time)}
                      className="py-3"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-8">
                  <p className="text-gray-500">
                    Nessun orario disponibile per questa data
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setStep('date')}
                  >
                    Scegli un'altra data
                  </Button>
                </Card>
              )}
            </StepContainer>
          )}

          {step === 'address' && (
            <StepContainer
              key="address"
              title="Indirizzo del trattamento"
              onBack={() => setStep('time')}
            >
              <Card>
                <div className="space-y-4">
                  <Input
                    label="Indirizzo"
                    placeholder="Via Roma, 1"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    leftIcon={<MapPin className="w-5 h-5" />}
                  />

                  <Input
                    label="Citta"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Note per il professionista (opzionale)
                    </label>
                    <textarea
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Es: citofono non funziona, chiamare al telefono. Terzo piano con ascensore."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleAddressConfirm}
                  >
                    Continua
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
            </StepContainer>
          )}

          {step === 'confirm' && (
            <StepContainer
              key="confirm"
              title="Conferma prenotazione"
              onBack={() => setStep('address')}
            >
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Riepilogo
                </h3>

                <div className="space-y-4">
                  {/* Professional */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar src={professional.avatar} size="md" />
                    <div>
                      <p className="font-medium">
                        {professional.firstName} {professional.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{service.name}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <DetailRow
                      icon={<CalendarIcon className="w-5 h-5 text-gray-400" />}
                      label="Data e ora"
                      value={
                        selectedDate
                          ? `${format(selectedDate, 'EEEE d MMMM yyyy', {
                              locale: it,
                            })} alle ${selectedTime}`
                          : ''
                      }
                    />
                    <DetailRow
                      icon={<Clock className="w-5 h-5 text-gray-400" />}
                      label="Durata"
                      value={`${service.duration} minuti`}
                    />
                    <DetailRow
                      icon={<MapPin className="w-5 h-5 text-gray-400" />}
                      label="Indirizzo"
                      value={`${addressInput}, ${cityInput}`}
                    />
                    {notesInput && (
                      <DetailRow
                        icon={<FileText className="w-5 h-5 text-gray-400" />}
                        label="Note"
                        value={notesInput}
                      />
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Totale</span>
                      <span className="text-2xl font-bold text-primary-600">
                        EUR{service.price}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method (Mock) */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Pagamento in contanti
                        </p>
                        <p className="text-sm text-gray-500">
                          Paga direttamente al professionista
                        </p>
                      </div>
                      <Badge variant="success">Selezionato</Badge>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleConfirmBooking}
                    isLoading={isLoading}
                  >
                    Conferma Prenotazione
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    La prenotazione sara confermata dopo l'approvazione del professionista
                  </p>
                </div>
              </Card>
            </StepContainer>
          )}

          {step === 'success' && (
            <StepContainer key="success">
              <Card className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Richiesta Inviata!
                </h2>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  La tua richiesta di prenotazione e stata inviata a{' '}
                  <strong>
                    {professional.firstName} {professional.lastName}
                  </strong>
                  . Riceverai una conferma appena sara accettata.
                </p>

                <div className="p-4 bg-gray-50 rounded-lg mb-6 text-left">
                  <h3 className="font-medium text-gray-900 mb-2">Dettagli prenotazione</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{service.name}</p>
                    <p>
                      {selectedDate &&
                        format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}{' '}
                      alle {selectedTime}
                    </p>
                    <p>{addressInput}, {cityInput}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => navigate('/')}>
                    Torna alla Home
                  </Button>
                  <Button className="flex-1" onClick={handleFinish}>
                    Le Mie Prenotazioni
                  </Button>
                </div>
              </Card>
            </StepContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function StepContainer({
  title,
  children,
  onBack,
}: {
  title?: string;
  children: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {title && (
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      {children}
    </motion.div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900">{value}</p>
      </div>
    </div>
  );
}
