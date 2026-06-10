export type VisualPreset = {
  id: string
  name: string
  mood: string
  background: string
  primary: string
  secondary: string
  accent: string
  particle: string
  gridOpacity: number
  laserOpacity: number
  particleDensity: number
  pulseScale: number
}

export const VISUAL_PRESETS: VisualPreset[] = [
  {
    id: 'neon-club',
    name: 'Neon Club',
    accent: '#e9ff70',
    background: '#05060b',
    gridOpacity: 1,
    laserOpacity: 1,
    mood: 'laser, grid, energia de club',
    particle: '#70d6ff',
    particleDensity: 1,
    primary: '#70d6ff',
    pulseScale: 1,
    secondary: '#ff70a6',
  },
  {
    id: 'joji-noir',
    name: 'Joji Noir',
    accent: '#d9b8ff',
    background: '#040308',
    gridOpacity: 0.28,
    laserOpacity: 0.22,
    mood: 'nocturno, suave, melancolico',
    particle: '#b8c7ff',
    particleDensity: 0.62,
    primary: '#8da8ff',
    pulseScale: 0.55,
    secondary: '#c894ff',
  },
  {
    id: 'infrared',
    name: 'Infrared',
    accent: '#ffd166',
    background: '#070305',
    gridOpacity: 0.72,
    laserOpacity: 0.85,
    mood: 'rojo, intenso, underground',
    particle: '#ff9f7a',
    particleDensity: 0.86,
    primary: '#ff4d6d',
    pulseScale: 0.9,
    secondary: '#ff8fab',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    accent: '#f6ff8f',
    background: '#020907',
    gridOpacity: 0.52,
    laserOpacity: 0.44,
    mood: 'verde, organico, etereo',
    particle: '#9dffcb',
    particleDensity: 1.12,
    primary: '#4dd4ac',
    pulseScale: 0.76,
    secondary: '#70d6ff',
  },
]

export const DEFAULT_VISUAL_PRESET_ID = VISUAL_PRESETS[0].id

export function getVisualPreset(id: string) {
  return (
    VISUAL_PRESETS.find((preset) => preset.id === id) ??
    VISUAL_PRESETS.find((preset) => preset.id === DEFAULT_VISUAL_PRESET_ID) ??
    VISUAL_PRESETS[0]
  )
}
