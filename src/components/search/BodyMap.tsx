import { cn } from '../../utils/cn'

// ============================================
// Interactive SVG Body Map
// Anatomical silhouette with tappable regions
// ============================================

interface BodyMapProps {
  selectedAreas: string[]
  onToggle: (areaId: string) => void
  className?: string
}

const bodyRegions: {
  id: string
  label: string
  paths: string[]
  labelPos: { x: number; y: number }
}[] = [
  {
    id: 'head',
    label: 'Testa',
    paths: [
      // Cranium — rounded top of the head
      'M 150,52 C 150,28 158,12 175,12 C 192,12 200,28 200,52 L 200,58 C 200,58 192,50 175,50 C 158,50 150,58 150,58 Z',
    ],
    labelPos: { x: 175, y: 38 },
  },
  {
    id: 'face',
    label: 'Viso',
    paths: [
      // Face — jaw line
      'M 150,58 C 150,58 158,50 175,50 C 192,50 200,58 200,58 L 200,70 C 200,82 192,92 175,92 C 158,92 150,82 150,70 Z',
    ],
    labelPos: { x: 175, y: 72 },
  },
  {
    id: 'neck',
    label: 'Collo',
    paths: [
      'M 163,92 L 187,92 L 190,112 L 160,112 Z',
    ],
    labelPos: { x: 175, y: 103 },
  },
  {
    id: 'shoulders',
    label: 'Spalle',
    paths: [
      // Left shoulder — rounded cap
      'M 160,112 L 130,114 C 114,116 105,122 102,132 L 120,132 L 135,124 L 160,120 Z',
      // Right shoulder
      'M 190,112 L 220,114 C 236,116 245,122 248,132 L 230,132 L 215,124 L 190,120 Z',
    ],
    labelPos: { x: 175, y: 120 },
  },
  {
    id: 'chest',
    label: 'Torace',
    paths: [
      // Torso upper — pecs area
      'M 135,124 L 215,124 L 215,180 L 135,180 Z',
    ],
    labelPos: { x: 175, y: 154 },
  },
  {
    id: 'arms',
    label: 'Braccia',
    paths: [
      // Left arm
      'M 102,132 L 120,132 L 118,138 L 130,180 L 125,235 L 118,270 L 100,270 L 106,235 L 110,180 L 95,138 Z',
      // Right arm
      'M 248,132 L 230,132 L 232,138 L 220,180 L 225,235 L 232,270 L 250,270 L 244,235 L 240,180 L 255,138 Z',
    ],
    labelPos: { x: 72, y: 200 },
  },
  {
    id: 'hands',
    label: 'Mani',
    paths: [
      // Left hand
      'M 100,270 L 118,270 L 120,290 L 118,310 L 94,310 L 92,290 Z',
      // Right hand
      'M 232,270 L 250,270 L 258,290 L 256,310 L 232,310 L 230,290 Z',
    ],
    labelPos: { x: 275, y: 290 },
  },
  {
    id: 'abdomen',
    label: 'Addome',
    paths: [
      'M 137,180 L 213,180 L 210,240 L 140,240 Z',
    ],
    labelPos: { x: 175, y: 212 },
  },
  {
    id: 'hips',
    label: 'Anche',
    paths: [
      'M 130,240 L 220,240 L 222,272 L 128,272 Z',
    ],
    labelPos: { x: 175, y: 258 },
  },
  {
    id: 'glutes',
    label: 'Glutei',
    paths: [
      'M 132,272 L 218,272 L 215,296 L 175,300 L 135,296 Z',
    ],
    labelPos: { x: 175, y: 286 },
  },
  {
    id: 'upper_legs',
    label: 'Cosce',
    paths: [
      // Left thigh
      'M 135,296 L 172,300 L 168,380 L 142,380 Z',
      // Right thigh
      'M 178,300 L 215,296 L 208,380 L 182,380 Z',
    ],
    labelPos: { x: 175, y: 340 },
  },
  {
    id: 'lower_legs',
    label: 'Gambe',
    paths: [
      // Left calf
      'M 142,380 L 168,380 L 165,480 L 148,480 Z',
      // Right calf
      'M 182,380 L 208,380 L 202,480 L 185,480 Z',
    ],
    labelPos: { x: 175, y: 432 },
  },
  {
    id: 'feet',
    label: 'Piedi',
    paths: [
      // Left foot
      'M 148,480 L 165,480 L 168,500 L 138,504 L 134,498 Z',
      // Right foot
      'M 185,480 L 202,480 L 216,498 L 212,504 L 182,500 Z',
    ],
    labelPos: { x: 175, y: 496 },
  },
]

const FULL_BODY_ID = 'full_body'

// Anatomical silhouette outline
const BODY_OUTLINE = `
  M 175,12
  C 192,12 202,28 202,52
  L 202,70
  C 202,84 194,94 188,94
  L 192,112
  L 222,114
  C 240,116 250,126 252,136
  L 258,142
  L 246,180
  L 250,240
  L 256,274
  L 262,296
  L 260,314
  L 236,314
  L 232,274
  L 228,242
  L 224,274
  L 222,300
  L 216,300
  L 212,382
  L 208,484
  L 220,500
  L 216,508
  L 180,504
  L 182,484
  L 180,382
  L 178,304
  L 175,306
  L 172,304
  L 170,382
  L 168,484
  L 170,504
  L 134,508
  L 130,500
  L 138,484
  L 142,382
  L 134,300
  L 128,300
  L 126,274
  L 122,242
  L 118,274
  L 114,314
  L 90,314
  L 88,296
  L 94,274
  L 100,240
  L 104,180
  L 92,142
  L 98,136
  C 100,126 110,116 128,114
  L 158,112
  L 162,94
  C 156,94 148,84 148,70
  L 148,52
  C 148,28 158,12 175,12
  Z
`

export function BodyMap({ selectedAreas, onToggle, className }: BodyMapProps) {
  const isFullBody = selectedAreas.includes(FULL_BODY_ID)

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        viewBox="60 0 230 520"
        className="w-full max-w-[300px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle gradient for the body silhouette */}
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0f0f4" />
            <stop offset="100%" stopColor="#e8e8ef" />
          </linearGradient>
          {/* Selected region gradient */}
          <linearGradient id="selectedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0.3)" />
            <stop offset="100%" stopColor="rgba(124, 58, 237, 0.45)" />
          </linearGradient>
        </defs>

        {/* Full body silhouette background */}
        <path
          d={BODY_OUTLINE}
          fill="url(#bodyGrad)"
          stroke="#c4c4d0"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Center line (subtle anatomical reference) */}
        <line
          x1="175" y1="112" x2="175" y2="300"
          stroke="#d4d4de"
          strokeWidth="0.5"
          strokeDasharray="4 4"
        />

        {/* Interactive regions */}
        {bodyRegions.map((region) => {
          const isSelected = isFullBody || selectedAreas.includes(region.id)
          return (
            <g
              key={region.id}
              onClick={() => onToggle(region.id)}
              className="cursor-pointer group"
              role="button"
              aria-label={region.label}
              aria-pressed={isSelected}
            >
              {region.paths.map((path, i) => (
                <path
                  key={i}
                  d={path}
                  fill={isSelected ? 'url(#selectedGrad)' : 'transparent'}
                  stroke={isSelected ? '#7c3aed' : 'transparent'}
                  strokeWidth={isSelected ? '2' : '1'}
                  strokeLinejoin="round"
                  className={cn(
                    'transition-all duration-200',
                    !isSelected && 'group-hover:fill-violet-100/60 group-hover:stroke-violet-300'
                  )}
                />
              ))}
              {/* Region label */}
              <text
                x={region.labelPos.x}
                y={region.labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  'text-[10px] font-semibold pointer-events-none select-none transition-colors duration-200',
                  isSelected ? 'fill-violet-800' : 'fill-gray-400 group-hover:fill-gray-600'
                )}
              >
                {region.label}
              </text>
              {/* Selection indicator dot */}
              {isSelected && (
                <circle
                  cx={region.labelPos.x}
                  cy={region.labelPos.y + 10}
                  r="2.5"
                  className="fill-violet-500"
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Full Body toggle */}
      <button
        onClick={() => onToggle(FULL_BODY_ID)}
        className={cn(
          'mt-4 px-6 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
          isFullBody
            ? 'border-primary-500 bg-primary-100 text-primary-700 shadow-md'
            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
        )}
      >
        Tutto il corpo
      </button>

      {/* Selection count */}
      {selectedAreas.length > 0 && (
        <p className="mt-3 text-sm text-primary-700 font-medium">
          {isFullBody
            ? 'Tutto il corpo selezionato'
            : `${selectedAreas.length} ${selectedAreas.length === 1 ? 'zona selezionata' : 'zone selezionate'}`}
        </p>
      )}
    </div>
  )
}

export { bodyRegions, FULL_BODY_ID }
