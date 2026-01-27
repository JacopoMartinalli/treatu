import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { Button } from './Button';
import { useReviewStore } from '../../store/reviewStore';
import { useAuthStore } from '../../store/authStore';
import { Booking } from '../../types';
import toast from 'react-hot-toast';

// ============================================
// REVIEW FORM COMPONENT
// ============================================

interface ReviewFormProps {
  booking: Booking;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ booking, onSuccess, onCancel }: ReviewFormProps) {
  const { user } = useAuthStore();
  const { addReview, isLoading } = useReviewStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Seleziona una valutazione');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Scrivi un commento di almeno 10 caratteri');
      return;
    }

    try {
      await addReview({
        professionalId: booking.professionalId,
        clientId: user?.id || '',
        clientName: `${user?.firstName} ${user?.lastName?.charAt(0)}.`,
        clientAvatar: user?.avatar,
        rating,
        comment: comment.trim(),
        serviceId: booking.service.id,
        serviceName: booking.service.name,
      });

      toast.success('Recensione pubblicata!');
      onSuccess?.();
    } catch {
      toast.error('Errore nella pubblicazione');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Lascia una recensione
      </h3>

      {/* Service Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-600">Servizio ricevuto</p>
        <p className="font-medium text-gray-900">{booking.service.name}</p>
        <p className="text-sm text-gray-500">
          con {booking.professional.firstName} {booking.professional.lastName}
        </p>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          La tua valutazione
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {rating === 1 && 'Scarso'}
              {rating === 2 && 'Sufficiente'}
              {rating === 3 && 'Buono'}
              {rating === 4 && 'Ottimo'}
              {rating === 5 && 'Eccellente'}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Il tuo commento
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Racconta la tua esperienza..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          {comment.length}/500 caratteri (min. 10)
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Annulla
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          isLoading={isLoading}
          leftIcon={<Send className="w-4 h-4" />}
          disabled={rating === 0 || comment.trim().length < 10}
        >
          Pubblica recensione
        </Button>
      </div>
    </motion.div>
  );
}
