import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Activity,
  Heart,
  Brain,
  Smile,
  Zap,
  Moon,
} from 'lucide-react';
import { Button, Card } from '../shared';
import { cn } from '../../utils/cn';

// ============================================
// TYPES
// ============================================

type WizardStep = 'goal' | 'area' | 'symptoms' | 'preferences' | 'results';

interface TreatmentGoal {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface BodyArea {
  id: string;
  label: string;
  icon: string;
}

interface Symptom {
  id: string;
  label: string;
  severity?: 'mild' | 'moderate' | 'severe';
}

interface WizardData {
  goal: string | null;
  bodyAreas: string[];
  symptoms: string[];
  preferences: {
    homeService: boolean;
    urgency: 'asap' | 'this_week' | 'flexible';
    priceRange: 'budget' | 'mid' | 'premium';
  };
}

// ============================================
// DATA
// ============================================

const treatmentGoals: TreatmentGoal[] = [
  {
    id: 'pain_relief',
    label: 'Alleviare dolori',
    description: 'Ho dolori muscolari, articolari o tensioni',
    icon: <Activity className="w-6 h-6" />,
    color: 'bg-red-100 text-red-600 border-red-200',
  },
  {
    id: 'relaxation',
    label: 'Rilassarmi',
    description: 'Voglio ridurre stress e tensione',
    icon: <Moon className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
  },
  {
    id: 'wellness',
    label: 'Benessere generale',
    description: 'Mantenere il mio corpo in forma',
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-pink-100 text-pink-600 border-pink-200',
  },
  {
    id: 'recovery',
    label: 'Recupero sportivo',
    description: 'Recuperare dopo attivita fisica',
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-orange-100 text-orange-600 border-orange-200',
  },
  {
    id: 'mental',
    label: 'Benessere mentale',
    description: 'Migliorare il mio stato emotivo',
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-600 border-purple-200',
  },
  {
    id: 'beauty',
    label: 'Estetica e cura',
    description: 'Trattamenti estetici e di bellezza',
    icon: <Smile className="w-6 h-6" />,
    color: 'bg-teal-100 text-teal-600 border-teal-200',
  },
];

const bodyAreas: BodyArea[] = [
  { id: 'head', label: 'Testa / Viso', icon: '🧠' },
  { id: 'neck', label: 'Collo', icon: '🦒' },
  { id: 'shoulders', label: 'Spalle', icon: '💪' },
  { id: 'back_upper', label: 'Schiena alta', icon: '🔙' },
  { id: 'back_lower', label: 'Zona lombare', icon: '⬇️' },
  { id: 'arms', label: 'Braccia / Mani', icon: '🤲' },
  { id: 'chest', label: 'Torace', icon: '🫁' },
  { id: 'abdomen', label: 'Addome', icon: '🔵' },
  { id: 'hips', label: 'Anche / Bacino', icon: '🦴' },
  { id: 'legs', label: 'Gambe', icon: '🦵' },
  { id: 'feet', label: 'Piedi', icon: '🦶' },
  { id: 'full_body', label: 'Tutto il corpo', icon: '🧘' },
];

const symptomsByGoal: Record<string, Symptom[]> = {
  pain_relief: [
    { id: 'muscle_tension', label: 'Tensione muscolare' },
    { id: 'stiffness', label: 'Rigidita' },
    { id: 'chronic_pain', label: 'Dolore cronico' },
    { id: 'acute_pain', label: 'Dolore acuto recente' },
    { id: 'headache', label: 'Mal di testa / Emicrania' },
    { id: 'joint_pain', label: 'Dolori articolari' },
    { id: 'sciatica', label: 'Sciatalgia' },
    { id: 'cervical', label: 'Cervicale' },
  ],
  relaxation: [
    { id: 'stress', label: 'Stress elevato' },
    { id: 'anxiety', label: 'Ansia' },
    { id: 'insomnia', label: 'Difficolta a dormire' },
    { id: 'fatigue', label: 'Stanchezza cronica' },
    { id: 'mental_fog', label: 'Confusione mentale' },
    { id: 'irritability', label: 'Irritabilita' },
  ],
  wellness: [
    { id: 'maintenance', label: 'Mantenimento generale' },
    { id: 'posture', label: 'Problemi posturali' },
    { id: 'circulation', label: 'Circolazione' },
    { id: 'flexibility', label: 'Poca flessibilita' },
    { id: 'prevention', label: 'Prevenzione' },
  ],
  recovery: [
    { id: 'post_workout', label: 'Dopo allenamento intenso' },
    { id: 'muscle_soreness', label: 'Indolenzimento muscolare' },
    { id: 'sports_injury', label: 'Infortunio sportivo' },
    { id: 'performance', label: 'Migliorare performance' },
    { id: 'cramps', label: 'Crampi frequenti' },
  ],
  mental: [
    { id: 'burnout', label: 'Burnout' },
    { id: 'emotional_release', label: 'Bisogno di rilascio emotivo' },
    { id: 'grounding', label: 'Bisogno di radicamento' },
    { id: 'self_care', label: 'Tempo per me stesso/a' },
  ],
  beauty: [
    { id: 'anti_aging', label: 'Anti-aging' },
    { id: 'cellulite', label: 'Cellulite' },
    { id: 'skin_care', label: 'Cura della pelle' },
    { id: 'body_shaping', label: 'Modellamento corpo' },
    { id: 'facial', label: 'Trattamento viso' },
  ],
};

// ============================================
// COMPONENT
// ============================================

interface TreatmentFinderWizardProps {
  onComplete: (data: WizardData) => void;
  onClose: () => void;
}

export function TreatmentFinderWizard({ onComplete, onClose }: TreatmentFinderWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('goal');
  const [data, setData] = useState<WizardData>({
    goal: null,
    bodyAreas: [],
    symptoms: [],
    preferences: {
      homeService: true,
      urgency: 'this_week',
      priceRange: 'mid',
    },
  });

  const steps: WizardStep[] = ['goal', 'area', 'symptoms', 'preferences', 'results'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 'goal':
        return data.goal !== null;
      case 'area':
        return data.bodyAreas.length > 0;
      case 'symptoms':
        return data.symptoms.length > 0;
      case 'preferences':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 'preferences') {
      onComplete(data);
      return;
    }
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const toggleBodyArea = (areaId: string) => {
    setData((prev) => ({
      ...prev,
      bodyAreas: prev.bodyAreas.includes(areaId)
        ? prev.bodyAreas.filter((id) => id !== areaId)
        : [...prev.bodyAreas, areaId],
    }));
  };

  const toggleSymptom = (symptomId: string) => {
    setData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter((id) => id !== symptomId)
        : [...prev.symptoms, symptomId],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Trova il trattamento giusto</h2>
                <p className="text-sm text-gray-500">Rispondi a poche domande per ricevere suggerimenti personalizzati</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Obiettivo</span>
            <span>Zone</span>
            <span>Sintomi</span>
            <span>Preferenze</span>
            <span>Risultati</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === 'goal' && (
              <StepGoal
                key="goal"
                selectedGoal={data.goal}
                onSelect={(goalId) => setData((prev) => ({ ...prev, goal: goalId, symptoms: [] }))}
              />
            )}

            {currentStep === 'area' && (
              <StepBodyArea
                key="area"
                selectedAreas={data.bodyAreas}
                onToggle={toggleBodyArea}
              />
            )}

            {currentStep === 'symptoms' && (
              <StepSymptoms
                key="symptoms"
                goal={data.goal!}
                selectedSymptoms={data.symptoms}
                onToggle={toggleSymptom}
              />
            )}

            {currentStep === 'preferences' && (
              <StepPreferences
                key="preferences"
                preferences={data.preferences}
                onChange={(prefs) => setData((prev) => ({ ...prev, preferences: prefs }))}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Indietro
          </Button>

          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentStepIndex
                    ? 'bg-primary-600'
                    : index < currentStepIndex
                    ? 'bg-primary-300'
                    : 'bg-gray-200'
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {currentStep === 'preferences' ? 'Trova professionisti' : 'Avanti'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// STEP COMPONENTS
// ============================================

function StepGoal({
  selectedGoal,
  onSelect,
}: {
  selectedGoal: string | null;
  onSelect: (goalId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Qual e il tuo obiettivo principale?
      </h3>
      <p className="text-gray-600 mb-6">
        Seleziona quello che meglio descrive cosa stai cercando
      </p>

      <div className="grid grid-cols-2 gap-3">
        {treatmentGoals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => onSelect(goal.id)}
            className={cn(
              'p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md',
              selectedGoal === goal.id
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
                goal.color
              )}
            >
              {goal.icon}
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{goal.label}</h4>
            <p className="text-sm text-gray-500">{goal.description}</p>
            {selectedGoal === goal.id && (
              <CheckCircle className="w-5 h-5 text-primary-600 absolute top-3 right-3" />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function StepBodyArea({
  selectedAreas,
  onToggle,
}: {
  selectedAreas: string[];
  onToggle: (areaId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Quali zone vuoi trattare?
      </h3>
      <p className="text-gray-600 mb-6">
        Puoi selezionare piu zone (seleziona almeno una)
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {bodyAreas.map((area) => (
          <button
            key={area.id}
            onClick={() => onToggle(area.id)}
            className={cn(
              'p-3 rounded-xl border-2 text-center transition-all hover:shadow-md',
              selectedAreas.includes(area.id)
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <span className="text-2xl mb-2 block">{area.icon}</span>
            <span className="text-sm font-medium text-gray-700">{area.label}</span>
            {selectedAreas.includes(area.id) && (
              <CheckCircle className="w-4 h-4 text-primary-600 mx-auto mt-1" />
            )}
          </button>
        ))}
      </div>

      {selectedAreas.length > 0 && (
        <div className="mt-4 p-3 bg-primary-50 rounded-xl">
          <p className="text-sm text-primary-700">
            <strong>{selectedAreas.length}</strong> {selectedAreas.length === 1 ? 'zona selezionata' : 'zone selezionate'}
          </p>
        </div>
      )}
    </motion.div>
  );
}

function StepSymptoms({
  goal,
  selectedSymptoms,
  onToggle,
}: {
  goal: string;
  selectedSymptoms: string[];
  onToggle: (symptomId: string) => void;
}) {
  const symptoms = symptomsByGoal[goal] || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Descrivi meglio la tua situazione
      </h3>
      <p className="text-gray-600 mb-6">
        Seleziona tutti i sintomi o le condizioni che ti riguardano
      </p>

      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom) => (
          <button
            key={symptom.id}
            onClick={() => onToggle(symptom.id)}
            className={cn(
              'px-4 py-2 rounded-full border-2 text-sm font-medium transition-all',
              selectedSymptoms.includes(symptom.id)
                ? 'border-primary-500 bg-primary-100 text-primary-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            )}
          >
            {selectedSymptoms.includes(symptom.id) && (
              <CheckCircle className="w-4 h-4 inline mr-2" />
            )}
            {symptom.label}
          </button>
        ))}
      </div>

      {selectedSymptoms.length === 0 && (
        <div className="mt-6 p-4 bg-amber-50 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium">Seleziona almeno un sintomo</p>
            <p className="text-xs text-amber-600 mt-1">
              Questo ci aiuta a trovare il professionista piu adatto alle tue esigenze
            </p>
          </div>
        </div>
      )}

      {selectedSymptoms.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-green-700">
            Ottimo! Abbiamo abbastanza informazioni per suggerirti i trattamenti migliori.
          </p>
        </div>
      )}
    </motion.div>
  );
}

function StepPreferences({
  preferences,
  onChange,
}: {
  preferences: WizardData['preferences'];
  onChange: (prefs: WizardData['preferences']) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Le tue preferenze
      </h3>
      <p className="text-gray-600 mb-6">
        Qualche dettaglio in piu per trovare la soluzione perfetta
      </p>

      <div className="space-y-6">
        {/* Home Service */}
        <div>
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={preferences.homeService}
              onChange={(e) => onChange({ ...preferences, homeService: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-gray-900">Servizio a domicilio</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Il professionista viene direttamente da te
              </p>
            </div>
          </label>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Quando vorresti il trattamento?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'asap', label: 'Prima possibile', desc: 'Oggi o domani' },
              { id: 'this_week', label: 'Questa settimana', desc: 'Entro 7 giorni' },
              { id: 'flexible', label: 'Flessibile', desc: 'Quando disponibile' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  onChange({ ...preferences, urgency: option.id as WizardData['preferences']['urgency'] })
                }
                className={cn(
                  'p-3 rounded-xl border-2 text-left transition-all',
                  preferences.urgency === option.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <span className="block font-medium text-gray-900 text-sm">{option.label}</span>
                <span className="block text-xs text-gray-500 mt-1">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Budget indicativo
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'budget', label: 'Economico', desc: 'Fino a 40 EUR' },
              { id: 'mid', label: 'Medio', desc: '40-70 EUR' },
              { id: 'premium', label: 'Premium', desc: 'Oltre 70 EUR' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  onChange({ ...preferences, priceRange: option.id as WizardData['preferences']['priceRange'] })
                }
                className={cn(
                  'p-3 rounded-xl border-2 text-left transition-all',
                  preferences.priceRange === option.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <span className="block font-medium text-gray-900 text-sm">{option.label}</span>
                <span className="block text-xs text-gray-500 mt-1">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export type { WizardData };
