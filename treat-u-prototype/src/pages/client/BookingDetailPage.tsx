import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Euro,
  Navigation,
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { Button, Card, Badge, Avatar, Modal } from '../../components/shared';
import { ReviewForm } from '../../components/shared/ReviewForm';
import { StaticMap } from '../../components/shared/Map';
import toast from 'react-hot-toast';

// ============================================
// BOOKING DETAIL PAGE
// ============================================

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bookings, updateBookingStatus } = useBookingStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const booking = bookings.find((b) => b.id === id);
  const isClient = user?.role === 'client';
  const isProfessional = user?.role === 'professional';

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Prenotazione non trovata
          </h2>
          <p className="text-gray-500 mb-4">
            La prenotazione che stai cercando non esiste
          </p>
          <Button onClick={() => navigate(-1)}>Torna indietro</Button>
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    updateBookingStatus(booking.id, 'cancelled');
    setShowCancelModal(false);
    toast.success('Prenotazione annullata');
  };

  const handleStatusChange = (status: 'confirmed' | 'rejected' | 'completed') => {
    updateBookingStatus(booking.id, status);
    toast.success(
      status === 'confirmed'
        ? 'Prenotazione confermata'
        : status === 'rejected'
        ? 'Prenotazione rifiutata'
        : 'Prenotazione completata'
    );
  };

  const getStatusInfo = () => {
    switch (booking.status) {
      case 'pending':
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          color: 'bg-yellow-100 text-yellow-600',
          label: 'In attesa di conferma',
          description: isProfessional
            ? 'Conferma o rifiuta questa prenotazione'
            : 'In attesa della conferma del professionista',
        };
      case 'confirmed':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'bg-green-100 text-green-600',
          label: 'Confermata',
          description: 'L\'appuntamento e confermato',
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'bg-blue-100 text-blue-600',
          label: 'Completata',
          description: 'Trattamento completato con successo',
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-6 h-6" />,
          color: 'bg-red-100 text-red-600',
          label: 'Annullata',
          description: 'Questa prenotazione e stata annullata',
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-6 h-6" />,
          color: 'bg-red-100 text-red-600',
          label: 'Rifiutata',
          description: 'Il professionista ha rifiutato la prenotazione',
        };
      default:
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          color: 'bg-gray-100 text-gray-600',
          label: 'Sconosciuto',
          description: '',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Torna indietro</span>
        </motion.button>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`p-4 mb-6 ${statusInfo.color}`}>
            <div className="flex items-center gap-3">
              {statusInfo.icon}
              <div>
                <p className="font-semibold">{statusInfo.label}</p>
                <p className="text-sm opacity-80">{statusInfo.description}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Service Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Dettagli servizio
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Servizio</p>
                  <p className="text-lg font-medium text-gray-900">
                    {booking.service.name}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {booking.service.description}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{booking.service.duration} minuti</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold">{booking.totalPrice}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Date & Time */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Data e orario
              </h2>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs text-primary-600 font-medium">
                    {format(new Date(booking.date), 'MMM', { locale: it }).toUpperCase()}
                  </span>
                  <span className="text-2xl font-bold text-primary-700">
                    {format(new Date(booking.date), 'd')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {format(new Date(booking.date), 'EEEE d MMMM yyyy', {
                      locale: it,
                    })}
                  </p>
                  <p className="text-gray-600">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Luogo dell'appuntamento
              </h2>

              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.address.street}
                  </p>
                  <p className="text-gray-600">
                    {booking.address.postalCode} {booking.address.city} (
                    {booking.address.province})
                  </p>
                </div>
              </div>

              {/* Map Preview */}
              <StaticMap
                latitude={booking.address.latitude}
                longitude={booking.address.longitude}
                height="200px"
              />

              <Button
                variant="outline"
                className="w-full mt-4"
                leftIcon={<Navigation className="w-4 h-4" />}
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${booking.address.latitude},${booking.address.longitude}`,
                    '_blank'
                  );
                }}
              >
                Apri in Google Maps
              </Button>
            </Card>

            {/* Notes */}
            {booking.notes && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Note
                </h2>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                  <p className="text-gray-700">{booking.notes}</p>
                </div>
              </Card>
            )}

            {/* Review Section */}
            {booking.status === 'completed' && isClient && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Lascia una recensione
                </h2>
                {showReviewForm ? (
                  <ReviewForm
                    booking={booking}
                    onSuccess={() => setShowReviewForm(false)}
                    onCancel={() => setShowReviewForm(false)}
                  />
                ) : (
                  <div className="text-center py-4">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">
                      Come e stata la tua esperienza?
                    </p>
                    <Button onClick={() => setShowReviewForm(true)}>
                      Scrivi recensione
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact Card */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {isClient ? 'Il tuo professionista' : 'Cliente'}
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  src={
                    isClient
                      ? booking.professional.avatar
                      : booking.client.avatar
                  }
                  name={
                    isClient
                      ? `${booking.professional.firstName} ${booking.professional.lastName}`
                      : `${booking.client.firstName} ${booking.client.lastName}`
                  }
                  size="lg"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {isClient
                      ? `${booking.professional.firstName} ${booking.professional.lastName}`
                      : `${booking.client.firstName} ${booking.client.lastName}`}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="w-3 h-3" />
                    {isClient
                      ? booking.professional.phone
                      : booking.client.phone}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                leftIcon={<Phone className="w-4 h-4" />}
                onClick={() => {
                  window.location.href = `tel:${
                    isClient
                      ? booking.professional.phone
                      : booking.client.phone
                  }`;
                }}
              >
                Chiama
              </Button>
            </Card>

            {/* Actions */}
            {booking.status === 'pending' && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Azioni</h3>

                {isProfessional ? (
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => handleStatusChange('confirmed')}
                    >
                      Conferma prenotazione
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleStatusChange('rejected')}
                    >
                      Rifiuta
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Annulla prenotazione
                  </Button>
                )}
              </Card>
            )}

            {booking.status === 'confirmed' && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Azioni</h3>

                <div className="space-y-3">
                  {isProfessional && (
                    <Button
                      className="w-full"
                      onClick={() => handleStatusChange('completed')}
                    >
                      Segna come completato
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Annulla prenotazione
                  </Button>
                </div>
              </Card>
            )}

            {/* Booking Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Info prenotazione
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID</span>
                  <span className="font-mono text-gray-900">
                    {booking.id.slice(0, 12)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Creata il</span>
                  <span className="text-gray-900">
                    {format(new Date(booking.createdAt), 'd MMM yyyy', {
                      locale: it,
                    })}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Annulla prenotazione"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 mb-6">
            Sei sicuro di voler annullare questa prenotazione? Questa azione non
            puo essere annullata.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              No, mantieni
            </Button>
            <Button variant="danger" onClick={handleCancel}>
              Si, annulla
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
