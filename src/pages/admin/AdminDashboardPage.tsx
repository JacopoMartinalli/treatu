import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Eye,
  ChevronDown,
  AlertTriangle,
  Search,
  TrendingUp,
} from 'lucide-react';
import { Button, Card, Badge, Avatar, Input } from '../../components/shared';
import toast from 'react-hot-toast';

// ============================================
// ADMIN DASHBOARD PAGE
// ============================================

interface PendingProfessional {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  partitaIva: string;
  bio: string;
  city: string;
  submittedAt: Date;
  documents: {
    type: string;
    label: string;
    status: 'uploaded' | 'verified' | 'rejected';
  }[];
  services: { name: string; price: number }[];
  status: 'pending' | 'approved' | 'rejected';
}

const mockPending: PendingProfessional[] = [
  {
    id: 'pending-1',
    firstName: 'Giulia',
    lastName: 'Rossi',
    email: 'giulia.rossi@email.it',
    phone: '+39 333 1234567',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    partitaIva: '12345678901',
    bio: 'Massaggiatrice professionista con 10 anni di esperienza. Specializzata in massaggi decontratturanti e sportivi.',
    city: 'Milano',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    documents: [
      { type: 'id_card', label: 'Documento di identita', status: 'uploaded' },
      { type: 'partita_iva', label: 'Certificato P.IVA', status: 'uploaded' },
      { type: 'certification', label: 'Certificazione professionale', status: 'uploaded' },
      { type: 'insurance', label: 'Assicurazione', status: 'uploaded' },
    ],
    services: [
      { name: 'Massaggio Decontratturante', price: 60 },
      { name: 'Massaggio Sportivo', price: 70 },
    ],
    status: 'pending',
  },
  {
    id: 'pending-2',
    firstName: 'Marco',
    lastName: 'Bianchi',
    email: 'marco.bianchi@email.it',
    phone: '+39 340 9876543',
    partitaIva: '98765432100',
    bio: 'Fisioterapista laureato, specializzato in riabilitazione sportiva e posturale.',
    city: 'Roma',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    documents: [
      { type: 'id_card', label: 'Documento di identita', status: 'uploaded' },
      { type: 'partita_iva', label: 'Certificato P.IVA', status: 'uploaded' },
    ],
    services: [
      { name: 'Fisioterapia', price: 80 },
      { name: 'Riabilitazione Posturale', price: 90 },
    ],
    status: 'pending',
  },
  {
    id: 'pending-3',
    firstName: 'Sara',
    lastName: 'Verdi',
    email: 'sara.verdi@email.it',
    phone: '+39 320 5556789',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    partitaIva: '55566677788',
    bio: 'Massaggiatrice olistica con certificazione in tecniche orientali. Specializzata in massaggi rilassanti e linfodrenanti.',
    city: 'Torino',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    documents: [
      { type: 'id_card', label: 'Documento di identita', status: 'uploaded' },
      { type: 'partita_iva', label: 'Certificato P.IVA', status: 'uploaded' },
      { type: 'certification', label: 'Certificazione massaggio olistico', status: 'uploaded' },
    ],
    services: [
      { name: 'Massaggio Rilassante', price: 55 },
      { name: 'Massaggio Linfodrenante', price: 65 },
      { name: 'Massaggio Hot Stone', price: 75 },
    ],
    status: 'pending',
  },
];

export function AdminDashboardPage() {
  const [professionals, setProfessionals] = useState(mockPending);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const filtered = professionals.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: professionals.filter((p) => p.status === 'pending').length,
    approved: professionals.filter((p) => p.status === 'approved').length,
    rejected: professionals.filter((p) => p.status === 'rejected').length,
    total: professionals.length,
  };

  const handleApprove = (id: string) => {
    setProfessionals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' as const } : p))
    );
    toast.success('Professionista approvato');
  };

  const handleReject = (id: string) => {
    setProfessionals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' as const } : p))
    );
    toast.error('Professionista rifiutato');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pannello Amministrazione
              </h1>
              <p className="text-sm text-gray-500">
                Gestisci le richieste dei professionisti
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="In attesa"
            value={stats.pending}
            icon={<Clock className="w-5 h-5 text-yellow-600" />}
            color="bg-yellow-50 border-yellow-200"
          />
          <StatCard
            label="Approvati"
            value={stats.approved}
            icon={<CheckCircle className="w-5 h-5 text-green-600" />}
            color="bg-green-50 border-green-200"
          />
          <StatCard
            label="Rifiutati"
            value={stats.rejected}
            icon={<XCircle className="w-5 h-5 text-red-600" />}
            color="bg-red-50 border-red-200"
          />
          <StatCard
            label="Totale"
            value={stats.total}
            icon={<Users className="w-5 h-5 text-primary-600" />}
            color="bg-primary-50 border-primary-200"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Cerca per nome o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {status === 'all' && 'Tutti'}
                {status === 'pending' && 'In attesa'}
                {status === 'approved' && 'Approvati'}
                {status === 'rejected' && 'Rifiutati'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nessun professionista trovato
              </h3>
              <p className="text-gray-500">
                Non ci sono professionisti che corrispondono ai filtri selezionati.
              </p>
            </Card>
          ) : (
            filtered.map((professional) => (
              <ProfessionalReviewCard
                key={professional.id}
                professional={professional}
                isExpanded={expandedId === professional.id}
                onToggle={() =>
                  setExpandedId(expandedId === professional.id ? null : professional.id)
                }
                onApprove={() => handleApprove(professional.id)}
                onReject={() => handleReject(professional.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`p-4 rounded-xl border ${color}`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ProfessionalReviewCard({
  professional,
  isExpanded,
  onToggle,
  onApprove,
  onReject,
}: {
  professional: PendingProfessional;
  isExpanded: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const statusConfig = {
    pending: { label: 'In attesa', variant: 'warning' as const, icon: Clock },
    approved: { label: 'Approvato', variant: 'success' as const, icon: CheckCircle },
    rejected: { label: 'Rifiutato', variant: 'error' as const, icon: XCircle },
  };

  const status = statusConfig[professional.status];
  const StatusIcon = status.icon;

  const timeAgo = getTimeAgo(professional.submittedAt);

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <Avatar
          src={professional.avatar}
          name={`${professional.firstName} ${professional.lastName}`}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">
              {professional.firstName} {professional.lastName}
            </h3>
            <Badge variant={status.variant} size="sm">
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {professional.email} - {professional.city}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Registrato {timeAgo}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {professional.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                }}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove();
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approva
              </Button>
            </>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100 pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Informazioni
                  </h4>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Telefono" value={professional.phone} />
                    <InfoRow label="P.IVA" value={professional.partitaIva} />
                    <InfoRow label="Citta" value={professional.city} />
                  </div>

                  <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">
                    Presentazione
                  </h4>
                  <p className="text-sm text-gray-600">{professional.bio}</p>
                </div>

                {/* Documents & Services */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Documenti caricati
                  </h4>
                  <div className="space-y-2">
                    {professional.documents.map((doc) => (
                      <div
                        key={doc.type}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 flex-1">
                          {doc.label}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {professional.documents.length < 4 && (
                      <div className="flex items-center gap-2 p-2 text-yellow-700 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs">
                          Documenti opzionali mancanti
                        </span>
                      </div>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-3">
                    Servizi offerti
                  </h4>
                  <div className="space-y-1">
                    {professional.services.map((svc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">{svc.name}</span>
                        <span className="font-medium text-gray-900">
                          EUR {svc.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {professional.status === 'pending' && (
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={onReject}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rifiuta
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={onApprove}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approva Professionista
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'meno di un\'ora fa';
  if (hours < 24) return `${hours} ore fa`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'giorno' : 'giorni'} fa`;
}
