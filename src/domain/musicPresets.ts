export type SampleSlot = 'kick' | 'hat' | 'snare' | 'clap' | 'perc'

export type MusicPreset = {
  id: string
  name: string
  artistReference: string
  bpm: number
  mood: string
  scale: string
  progression: string[]
  texture: string
  sampleHints: Record<SampleSlot, string[]>
}

export const MUSIC_PRESETS: MusicPreset[] = [
  {
    id: 'joji-noir',
    name: 'Joji Noir',
    artistReference: 'Alt R&B / melancholic pop',
    bpm: 76,
    mood: 'melancolico, nocturno, aireado',
    progression: ['Bm', 'G', 'D', 'A'],
    sampleHints: {
      clap: ['joji', 'clap', 'snap'],
      hat: ['joji', 'hat', 'shaker'],
      kick: ['joji', 'kick'],
      perc: ['joji', 'perc', 'foley'],
      snare: ['joji', 'snare', 'rim'],
    },
    scale: 'B minor',
    texture: 'Pads suaves, bajo contenido, percusion seca y arpegios espaciados.',
  },
  {
    id: 'rave-bloom',
    name: 'Rave Bloom',
    artistReference: 'Festival rave / melodic house',
    bpm: 140,
    mood: 'luminoso, euforico, grande',
    progression: ['Cm', 'Ab', 'Eb', 'Bb'],
    sampleHints: {
      clap: ['rave', 'clap'],
      hat: ['rave', 'hat', 'openhat'],
      kick: ['rave', 'kick'],
      perc: ['rave', 'perc', 'tom'],
      snare: ['rave', 'snare'],
    },
    scale: 'C minor',
    texture: 'Kick firme, hats rapidos, supersaw y acordes abiertos.',
  },
  {
    id: 'lofi-pulse',
    name: 'Lo-fi Pulse',
    artistReference: 'Downtempo / bedroom beat',
    bpm: 92,
    mood: 'calido, intimo, quebrado',
    progression: ['Em', 'C', 'G', 'D'],
    sampleHints: {
      clap: ['lofi', 'clap', 'snap'],
      hat: ['lofi', 'hat', 'vinyl'],
      kick: ['lofi', 'kick'],
      perc: ['lofi', 'perc', 'noise'],
      snare: ['lofi', 'snare', 'rim'],
    },
    scale: 'E minor',
    texture: 'Golpes suaves, ruido de textura y armonia mas granulada.',
  },
]

export const DEFAULT_PRESET_ID = MUSIC_PRESETS[0].id

export function getMusicPreset(id: string) {
  return (
    MUSIC_PRESETS.find((preset) => preset.id === id) ??
    MUSIC_PRESETS.find((preset) => preset.id === DEFAULT_PRESET_ID) ??
    MUSIC_PRESETS[0]
  )
}
