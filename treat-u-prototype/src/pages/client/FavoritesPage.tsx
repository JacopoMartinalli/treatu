import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star, Clock, Trash2 } from 'lucide-react';
import { useFavoritesStore } from '../../store/favoritesStore';
import { Button, Card, Avatar, Badge, EmptyState } from '../../components/shared';

// ============================================
// FAVORITES PAGE
// ============================================

export function FavoritesPage() {
  const navigate = useNavigate();
  const { getFavorites, removeFavorite, favoriteIds } = useFavoritesStore();
  const favorites = getFavorites();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">I miei Preferiti</h1>
              <p className="text-gray-600">
                {favoriteIds.length} professionisti salvati
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <EmptyState
              icon={<Heart className="w-12 h-12" />}
              title="Nessun preferito"
              description="Non hai ancora salvato nessun professionista. Esplora i profili e aggiungi ai preferiti quelli che ti interessano."
            />
            <div className="flex justify-center mt-6">
              <Button onClick={() => navigate('/search')}>
                Cerca professionisti
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {favorites.map((professional, index) => (
              <motion.div
                key={professional.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar
                      src={professional.avatar}
                      name={`${professional.firstName} ${professional.lastName}`}
                      size="lg"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {professional.firstName} {professional.lastName}
                            </h3>
                            {professional.isVerified && (
                              <Badge variant="success">Verificato</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {professional.rating} ({professional.reviewCount})
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {professional.baseLocation.city}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFavorite(professional.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Rimuovi dai preferiti"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Bio */}
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {professional.bio}
                      </p>

                      {/* Services Preview */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {professional.services.slice(0, 3).map((service) => (
                          <span
                            key={service.id}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                          >
                            {service.name}
                          </span>
                        ))}
                        {professional.services.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            +{professional.services.length - 3} altri
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>
                            Da €{Math.min(...professional.services.map((s) => s.price))}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/professional/${professional.id}`)}
                        >
                          Vedi profilo
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
