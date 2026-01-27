import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Star } from 'lucide-react';
import { Review } from '../../types';
import { Avatar } from './Avatar';

// ============================================
// REVIEW CARD COMPONENT
// ============================================

interface ReviewCardProps {
  review: Review;
  showService?: boolean;
}

export function ReviewCard({ review, showService = true }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start gap-3">
        <Avatar
          src={review.clientAvatar}
          name={review.clientName}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{review.clientName}</p>
              {showService && (
                <p className="text-sm text-gray-500">{review.serviceName}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-gray-700">{review.comment}</p>
          <p className="mt-2 text-xs text-gray-400">
            {format(new Date(review.createdAt), "d MMMM yyyy", { locale: it })}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// REVIEW LIST COMPONENT
// ============================================

interface ReviewListProps {
  reviews: Review[];
  showService?: boolean;
  maxItems?: number;
}

export function ReviewList({ reviews, showService = true, maxItems }: ReviewListProps) {
  const displayReviews = maxItems ? reviews.slice(0, maxItems) : reviews;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nessuna recensione ancora</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayReviews.map((review) => (
        <ReviewCard key={review.id} review={review} showService={showService} />
      ))}
    </div>
  );
}

// ============================================
// RATING SUMMARY COMPONENT
// ============================================

interface RatingSummaryProps {
  rating: number;
  reviewCount: number;
  distribution?: { rating: number; count: number }[];
}

export function RatingSummary({ rating, reviewCount, distribution }: RatingSummaryProps) {
  return (
    <div className="flex items-start gap-6">
      {/* Overall Rating */}
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</div>
        <div className="flex items-center justify-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">{reviewCount} recensioni</p>
      </div>

      {/* Distribution */}
      {distribution && (
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const item = distribution.find((d) => d.rating === star);
            const count = item?.count || 0;
            const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-3">{star}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
