import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  CheckCircle,
  Shield,
  Clock,
  Calendar,
  ChevronRight,
  Heart,
  Share2,
  MessageCircle,
} from 'lucide-react';
import { Button, Card, Badge, Rating, Avatar, EmptyState } from '../../components/shared';
import { getProfessionalById, getReviewsByProfessionalId } from '../../data/mockData';
import { Service, Review } from '../../types';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import toast from 'react-hot-toast';

// ============================================
// PROFESSIONAL PROFILE PAGE
// ============================================

export function ProfessionalProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setProfessional, setService } = useBookingStore();

  const professional = getProfessionalById(id || '');
  const reviews = getReviewsByProfessionalId(id || '');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          title="Professionista non trovato"
          description="Il professionista che stai cercando non esiste o non e piu disponibile."
          action={{
            label: 'Torna alla ricerca',
            onClick: () => navigate('/search'),
          }}
        />
      </div>
    );
  }

  const handleBookService = (service: Service) => {
    if (!isAuthenticated) {
      toast.error('Effettua il login per prenotare');
      navigate('/login', { state: { from: `/professional/${id}` } });
      return;
    }

    setProfessional(professional);
    setService(service);
    navigate('/booking');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${professional.firstName} ${professional.lastName} - TreatU`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiato!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0"
            >
              <img
                src={professional.avatar}
                alt={`${professional.firstName} ${professional.lastName}`}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-md"
              />
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {professional.firstName} {professional.lastName}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <Rating
                      value={professional.rating}
                      reviewCount={professional.reviewCount}
                    />
                    <span className="text-gray-500 flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      {professional.baseLocation.city}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsFavorite(!isFavorite);
                      toast.success(isFavorite ? 'Rimosso dai preferiti' : 'Aggiunto ai preferiti');
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {professional.isVerified && (
                  <Badge variant="success">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Professionista Certificato
                  </Badge>
                )}
                {professional.isInsured && (
                  <Badge variant="info">
                    <Shield className="w-4 h-4 mr-1" />
                    Assicurato
                  </Badge>
                )}
                {professional.nextAvailableSlot && (
                  <Badge variant="default">
                    <Clock className="w-4 h-4 mr-1" />
                    Disponibile{' '}
                    {format(professional.nextAvailableSlot, 'EEEE', { locale: it })}
                  </Badge>
                )}
              </div>

              {/* Bio */}
              <p className="text-gray-600 mt-4 leading-relaxed">{professional.bio}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Servizi Offerti
              </h2>
              <div className="space-y-3">
                {professional.services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ServiceCard
                      service={service}
                      isSelected={selectedService?.id === service.id}
                      onSelect={() => setSelectedService(service)}
                      onBook={() => handleBookService(service)}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Coverage Map (Mock) */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Zona di Copertura
              </h2>
              <Card padding="none" className="overflow-hidden">
                <div className="h-64 bg-gray-200 relative flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {professional.baseLocation.city} e dintorni
                    </p>
                    <p className="text-sm text-gray-500">
                      Raggio: {professional.coverageRadius} km
                    </p>
                  </div>
                  {/* Circle overlay mockup */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 rounded-full border-4 border-primary-300 bg-primary-100/30" />
                  </div>
                </div>
              </Card>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Recensioni ({reviews.length})
                </h2>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ReviewCard review={review} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <EmptyState
                    icon={<MessageCircle className="w-8 h-8" />}
                    title="Nessuna recensione"
                    description="Questo professionista non ha ancora ricevuto recensioni."
                  />
                </Card>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Book Card */}
            <Card className="sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                Prenota ora
              </h3>

              {selectedService ? (
                <div className="space-y-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <p className="font-medium text-primary-900">
                      {selectedService.name}
                    </p>
                    <p className="text-sm text-primary-700">
                      {selectedService.duration} min - EUR{selectedService.price}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => handleBookService(selectedService)}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Scegli Data e Ora
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Seleziona un servizio dalla lista per procedere con la prenotazione.
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {professional.rating}
                  </p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {professional.reviewCount}
                  </p>
                  <p className="text-xs text-gray-500">Recensioni</p>
                </div>
              </div>
            </Card>

            {/* Availability Preview */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">
                Prossima Disponibilita
              </h3>
              {professional.nextAvailableSlot ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">
                      {format(professional.nextAvailableSlot, 'EEEE d MMMM', {
                        locale: it,
                      })}
                    </p>
                    <p className="text-sm text-green-700">
                      dalle {format(professional.nextAvailableSlot, 'HH:mm')}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Contatta il professionista per verificare la disponibilita.
                </p>
              )}
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

function ServiceCard({
  service,
  isSelected,
  onSelect,
  onBook,
}: {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
  onBook: () => void;
}) {
  return (
    <Card
      hoverable
      onClick={onSelect}
      className={`cursor-pointer ${
        isSelected ? 'ring-2 ring-primary-500 border-primary-200' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{service.name}</h3>
            <Badge variant="outline" size="sm">
              {service.category}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {service.description}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-gray-500">
              <Clock className="w-4 h-4 inline mr-1" />
              {service.duration} min
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <div className="text-right">
            <p className="text-lg font-bold text-primary-600">
              EUR{service.price}
            </p>
          </div>
          {isSelected && (
            <Button size="sm" onClick={(e) => { e.stopPropagation(); onBook(); }}>
              Prenota
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Avatar
          src={review.clientAvatar}
          name={review.clientName}
          size="md"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{review.clientName}</p>
              <p className="text-sm text-gray-500">{review.serviceName}</p>
            </div>
            <Rating value={review.rating} showValue={false} size="sm" />
          </div>
          <p className="text-gray-600 mt-2">{review.comment}</p>
          <p className="text-xs text-gray-400 mt-2">
            {format(review.createdAt, 'd MMMM yyyy', { locale: it })}
          </p>
        </div>
      </div>
    </Card>
  );
}
