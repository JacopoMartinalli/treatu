import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Zap,
  Moon,
  Search,
} from 'lucide-react'
import { Button } from '../shared'
import { cn } from '../../utils/cn'
import { BodyMap } from './BodyMap'

// ============================================
// TYPES
// ============================================

type WizardStep = 'goal' | 'area' | 'symptoms' | 'preferences' | 'results'

interface TreatmentGoal {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
}

interface Symptom {
  id: string
  label: string
}

export interface WizardData {
  goal: string | null
  bodyAreas: string[]
  symptoms: string[]
  preferences: {
    homeService: boolean
    urgency: 'asap' | 'this_week' | 'flexible'
    priceRange: 'budget' | 'mid' | 'premium'
  }
}

// Suggested treatments based on wizard selections
export interface SuggestedTreatment {
  name: string
  category: string
  description: string
  matchScore: number // 0-100
  estimatedDuration: number
  estimatedPrice: string
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
]

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
}

// Treatment matching logic (will query Supabase once connected)
function getSuggestedTreatments(data: WizardData): SuggestedTreatment[] {
  const goalMap: Record<string, SuggestedTreatment[]> = {
    pain_relief: [
      { name: 'Massaggio Decontratturante', category: 'massaggio', description: 'Massaggio profondo per sciogliere contratture e tensioni', matchScore: 95, estimatedDuration: 60, estimatedPrice: '50-80' },
      { name: 'Fisioterapia - Trattamento', category: 'fisioterapia', description: 'Seduta di fisioterapia manuale', matchScore: 90, estimatedDuration: 50, estimatedPrice: '60-90' },
      { name: 'Osteopatia', category: 'osteopatia', description: 'Trattamento osteopatico globale', matchScore: 85, estimatedDuration: 60, estimatedPrice: '70-100' },
    ],
    relaxation: [
      { name: 'Massaggio Rilassante', category: 'massaggio', description: 'Massaggio rilassante per ridurre lo stress', matchScore: 98, estimatedDuration: 60, estimatedPrice: '45-75' },
      { name: 'Massaggio Hot Stone', category: 'massaggio', description: 'Massaggio con pietre calde vulcaniche', matchScore: 88, estimatedDuration: 75, estimatedPrice: '70-100' },
      { name: 'Yoga a Domicilio', category: 'fitness', description: 'Lezione privata di yoga', matchScore: 80, estimatedDuration: 60, estimatedPrice: '40-60' },
    ],
    wellness: [
      { name: 'Massaggio Rilassante', category: 'massaggio', description: 'Massaggio per il benessere generale', matchScore: 90, estimatedDuration: 60, estimatedPrice: '45-75' },
      { name: 'Consulenza Nutrizionale', category: 'nutrizione', description: 'Visita con piano alimentare personalizzato', matchScore: 85, estimatedDuration: 60, estimatedPrice: '60-90' },
      { name: 'Personal Training', category: 'fitness', description: 'Sessione di allenamento personalizzato', matchScore: 82, estimatedDuration: 60, estimatedPrice: '40-70' },
    ],
    recovery: [
      { name: 'Massaggio Sportivo', category: 'massaggio', description: 'Massaggio specifico per sportivi', matchScore: 96, estimatedDuration: 45, estimatedPrice: '50-80' },
      { name: 'Fisioterapia - Trattamento', category: 'fisioterapia', description: 'Seduta di fisioterapia manuale', matchScore: 88, estimatedDuration: 50, estimatedPrice: '60-90' },
      { name: 'Massaggio Decontratturante', category: 'massaggio', description: 'Massaggio profondo post-attivita', matchScore: 82, estimatedDuration: 60, estimatedPrice: '50-80' },
    ],
    mental: [
      { name: 'Massaggio Rilassante', category: 'massaggio', description: 'Rilassamento profondo per la mente', matchScore: 92, estimatedDuration: 60, estimatedPrice: '45-75' },
      { name: 'Yoga a Domicilio', category: 'fitness', description: 'Lezione di yoga per rilascio emotivo', matchScore: 88, estimatedDuration: 60, estimatedPrice: '40-60' },
      { name: 'Massaggio Hot Stone', category: 'massaggio', description: 'Esperienza di rilassamento totale', matchScore: 80, estimatedDuration: 75, estimatedPrice: '70-100' },
    ],
  }

  return goalMap[data.goal || ''] || []
}

// ============================================
// COMPONENT
// ============================================

interface TreatmentFinderWizardProps {
  onComplete: (data: WizardData) => void
  onClose: () => void
}

export function TreatmentFinderWizard({ onComplete, onClose }: TreatmentFinderWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('goal')
  const [data, setData] = useState<WizardData>({
    goal: null,
    bodyAreas: [],
    symptoms: [],
    preferences: {
      homeService: true,
      urgency: 'this_week',
      priceRange: 'mid',
    },
  })

  const steps: WizardStep[] = ['goal', 'area', 'symptoms', 'preferences', 'results']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 'goal':
        return data.goal !== null
      case 'area':
        return data.bodyAreas.length > 0
      case 'symptoms':
        return data.symptoms.length > 0
      case 'preferences':
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep === 'preferences') {
      setCurrentStep('results')
      return
    }
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  const toggleBodyArea = (areaId: string) => {
    setData((prev) => ({
      ...prev,
      bodyAreas: prev.bodyAreas.includes(areaId)
        ? prev.bodyAreas.filter((id) => id !== areaId)
        : [...prev.bodyAreas, areaId],
    }))
  }

  const toggleSymptom = (symptomId: string) => {
    setData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter((id) => id !== symptomId)
        : [...prev.symptoms, symptomId],
    }))
  }

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

            {currentStep === 'results' && (
              <StepResults
                key="results"
                data={data}
                onSearchProfessionals={() => onComplete(data)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {currentStep !== 'results' && (
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
              {currentStep === 'preferences' ? 'Vedi risultati' : 'Avanti'}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ============================================
// STEP COMPONENTS
// ============================================

function StepGoal({
  selectedGoal,
  onSelect,
}: {
  selectedGoal: string | null
  onSelect: (goalId: string) => void
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
              'p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md relative',
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
  )
}

function StepBodyArea({
  selectedAreas,
  onToggle,
}: {
  selectedAreas: string[]
  onToggle: (areaId: string) => void
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
        Tocca le zone del corpo che vuoi trattare
      </p>

      <BodyMap
        selectedAreas={selectedAreas}
        onToggle={onToggle}
      />
    </motion.div>
  )
}

function StepSymptoms({
  goal,
  selectedSymptoms,
  onToggle,
}: {
  goal: string
  selectedSymptoms: string[]
  onToggle: (symptomId: string) => void
}) {
  const symptoms = symptomsByGoal[goal] || []

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
  )
}

function StepPreferences({
  preferences,
  onChange,
}: {
  preferences: WizardData['preferences']
  onChange: (prefs: WizardData['preferences']) => void
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
  )
}

function StepResults({
  data,
  onSearchProfessionals,
}: {
  data: WizardData
  onSearchProfessionals: () => void
}) {
  const treatments = getSuggestedTreatments(data)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Ecco i trattamenti consigliati per te
        </h3>
        <p className="text-gray-600">
          In base alle tue risposte, ti suggeriamo questi trattamenti
        </p>
      </div>

      <div className="space-y-3">
        {treatments.map((treatment, index) => (
          <motion.div
            key={treatment.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border-2 border-gray-200 rounded-2xl hover:border-primary-300 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{treatment.name}</h4>
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {treatment.category}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-bold text-green-700">{treatment.matchScore}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{treatment.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {treatment.estimatedDuration} min
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                {treatment.estimatedPrice} EUR
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Button
          className="w-full"
          size="lg"
          onClick={onSearchProfessionals}
          leftIcon={<Search className="w-5 h-5" />}
        >
          Cerca professionisti disponibili
        </Button>
        <p className="text-xs text-gray-500 text-center mt-3">
          Troveremo i professionisti nella tua zona che offrono questi trattamenti
        </p>
      </div>
    </motion.div>
  )
}
