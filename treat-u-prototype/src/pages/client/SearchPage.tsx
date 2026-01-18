import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Filter,
  Star,
  CheckCircle,
  Shield,
  Clock,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Button, Input, Card, Badge, Rating, Select, EmptyState } from '../../components/shared';
import { mockProfessionals, serviceCategories } from '../../data/mockData';
import { Professional, ServiceCategory } from '../../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// ============================================
// SEARCH PAGE
// ============================================

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | ''>(
    (searchParams.get('category') as ServiceCategory) || ''
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'availability'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort professionals
  const filteredProfessionals = useMemo(() => {
    let result = [...mockProfessionals];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.bio.toLowerCase().includes(query) ||
          p.services.some((s) => s.name.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) =>
        p.services.some((s) => s.category === selectedCategory)
      );
    }

    // Filter by price
    result = result.filter((p) => {
      const minPrice = Math.min(...p.services.map((s) => s.price));
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });

    // Filter by rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Filter by verified
    if (onlyVerified) {
      result = result.filter((p) => p.isVerified);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        result.sort(
          (a, b) =>
            Math.min(...a.services.map((s) => s.price)) -
            Math.min(...b.services.map((s) => s.price))
        );
        break;
      case 'availability':
        result.sort((a, b) => {
          if (!a.nextAvailableSlot) return 1;
          if (!b.nextAvailableSlot) return -1;
          return a.nextAvailableSlot.getTime() - b.nextAvailableSlot.getTime();
        });
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, priceRange, minRating, onlyVerified, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 200]);
    setMinRating(0);
    setOnlyVerified(false);
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCategory ||
    priceRange[0] > 0 ||
    priceRange[1] < 200 ||
    minRating > 0 ||
    onlyVerified
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Input
                placeholder="Cerca per nome, servizio o zona..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
                className="pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Location (Mock) */}
            <div className="w-full sm:w-64">
              <Input
                placeholder="Milano, MI"
                leftIcon={<MapPin className="w-5 h-5" />}
                disabled
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden"
              leftIcon={<Filter className="w-5 h-5" />}
            >
              Filtri
              {hasActiveFilters && (
                <span className="ml-2 w-2 h-2 bg-primary-600 rounded-full" />
              )}
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            <CategoryPill
              active={selectedCategory === ''}
              onClick={() => setSelectedCategory('')}
            >
              Tutti
            </CategoryPill>
            {serviceCategories.map((cat) => (
              <CategoryPill
                key={cat.id}
                active={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id as ServiceCategory)}
              >
                {cat.icon} {cat.name}
              </CategoryPill>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FiltersSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minRating={minRating}
              setMinRating={setMinRating}
              onlyVerified={onlyVerified}
              setOnlyVerified={setOnlyVerified}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onReset={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          {/* Results */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredProfessionals.length}
                </span>{' '}
                professionisti trovati
              </p>

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-500">Ordina per:</span>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  options={[
                    { value: 'rating', label: 'Migliori recensioni' },
                    { value: 'price', label: 'Prezzo piu basso' },
                    { value: 'availability', label: 'Disponibilita' },
                  ]}
                  className="w-48"
                />
              </div>
            </div>

            {/* Results List */}
            {filteredProfessionals.length > 0 ? (
              <div className="grid gap-4">
                <AnimatePresence>
                  {filteredProfessionals.map((professional, index) => (
                    <motion.div
                      key={professional.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ProfessionalCard
                        professional={professional}
                        onClick={() => navigate(`/professional/${professional.id}`)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState
                icon={<Search className="w-8 h-8" />}
                title="Nessun risultato"
                description="Prova a modificare i filtri di ricerca o a cercare in un'altra zona."
                action={{
                  label: 'Resetta Filtri',
                  onClick: resetFilters,
                }}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold">Filtri</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FiltersSidebar
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  onlyVerified={onlyVerified}
                  setOnlyVerified={setOnlyVerified}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onReset={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

function FiltersSidebar({
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  onlyVerified,
  setOnlyVerified,
  sortBy,
  setSortBy,
  onReset,
  hasActiveFilters,
}: {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  onlyVerified: boolean;
  setOnlyVerified: (verified: boolean) => void;
  sortBy: string;
  setSortBy: (sort: 'rating' | 'price' | 'availability') => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <Card padding="lg" className="sticky top-36">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filtri
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Resetta
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="mb-6 lg:hidden">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ordina per
        </label>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'availability')}
          options={[
            { value: 'rating', label: 'Migliori recensioni' },
            { value: 'price', label: 'Prezzo piu basso' },
            { value: 'availability', label: 'Disponibilita' },
          ]}
        />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fascia di prezzo
        </label>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-20 text-center"
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-20 text-center"
          />
          <span className="text-gray-500">EUR</span>
        </div>
      </div>

      {/* Min Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valutazione minima
        </label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                minRating === rating
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-600'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent'
              }`}
            >
              {rating === 0 ? (
                'Tutti'
              ) : (
                <>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {rating}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Only */}
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary-600" />
            Solo professionisti verificati
          </span>
        </label>
      </div>
    </Card>
  );
}

function ProfessionalCard({
  professional,
  onClick,
}: {
  professional: Professional;
  onClick: () => void;
}) {
  const minPrice = Math.min(...professional.services.map((s) => s.price));
  const maxPrice = Math.max(...professional.services.map((s) => s.price));

  return (
    <Card
      hoverable
      padding="none"
      onClick={onClick}
      className="flex flex-col sm:flex-row"
    >
      {/* Image */}
      <div className="sm:w-48 flex-shrink-0">
        <img
          src={professional.avatar}
          alt={`${professional.firstName} ${professional.lastName}`}
          className="w-full h-48 sm:h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {professional.firstName} {professional.lastName}
            </h3>
            <Rating
              value={professional.rating}
              reviewCount={professional.reviewCount}
              size="sm"
              className="mt-1"
            />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {professional.isVerified && (
              <Badge variant="success" size="sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                Certificato
              </Badge>
            )}
            {professional.isInsured && (
              <Badge variant="info" size="sm">
                <Shield className="w-3 h-3 mr-1" />
                Assicurato
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mt-3 line-clamp-2">
          {professional.bio}
        </p>

        {/* Services Preview */}
        <div className="flex flex-wrap gap-2 mt-3">
          {professional.services.slice(0, 3).map((service) => (
            <Badge key={service.id} variant="outline" size="sm">
              {service.name}
            </Badge>
          ))}
          {professional.services.length > 3 && (
            <Badge variant="outline" size="sm">
              +{professional.services.length - 3}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-primary-600">
                {minPrice}
              </span>
              {minPrice !== maxPrice && (
                <span className="text-gray-400"> - {maxPrice}</span>
              )}
              /trattamento
            </span>

            <span className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {professional.baseLocation.city}
            </span>
          </div>

          {professional.nextAvailableSlot && (
            <span className="text-sm text-primary-600 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Disponibile{' '}
              {format(professional.nextAvailableSlot, 'EEEE HH:mm', {
                locale: it,
              })}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
