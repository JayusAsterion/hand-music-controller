import {
  BEAT_KEYS,
  HARMONY_KEYS,
  type ChordColor,
  type ControlKey,
  type DetectedHand,
  type HeightBand,
  type RaveChord,
} from '../domain/raveControls'
import type { MusicPreset } from '../domain/musicPresets'

const CHORD_LIBRARY: Record<string, { bassNote: string; notes: string[] }> = {
  A: { bassNote: 'A1', notes: ['A3', 'C#4', 'E4'] },
  Ab: { bassNote: 'Ab1', notes: ['Ab3', 'C4', 'Eb4'] },
  Bb: { bassNote: 'Bb1', notes: ['Bb3', 'D4', 'F4'] },
  Bm: { bassNote: 'B1', notes: ['B3', 'D4', 'F#4'] },
  C: { bassNote: 'C2', notes: ['C4', 'E4', 'G4'] },
  Cm: { bassNote: 'C2', notes: ['C4', 'Eb4', 'G4'] },
  D: { bassNote: 'D2', notes: ['D4', 'F#4', 'A4'] },
  Eb: { bassNote: 'Eb2', notes: ['Eb4', 'G4', 'Bb4'] },
  Em: { bassNote: 'E2', notes: ['E3', 'G3', 'B3'] },
  G: { bassNote: 'G1', notes: ['G3', 'B3', 'D4'] },
}

const EXTENSION_BY_CHORD: Record<string, Record<ChordColor, string[]>> = {
  A: { add9: ['B4'], octave: ['A4', 'C#5', 'E5', 'B5'], seventh: ['G4', 'B4'], triad: [] },
  Ab: { add9: ['Bb4'], octave: ['Ab4', 'C5', 'Eb5', 'Bb5'], seventh: ['G4', 'Bb4'], triad: [] },
  Bb: { add9: ['C5'], octave: ['Bb4', 'D5', 'F5', 'C6'], seventh: ['Ab4', 'C5'], triad: [] },
  Bm: { add9: ['C#5'], octave: ['B4', 'D5', 'F#5', 'C#6'], seventh: ['A4', 'C#5'], triad: [] },
  C: { add9: ['D5'], octave: ['C5', 'E5', 'G5', 'D6'], seventh: ['B4', 'D5'], triad: [] },
  Cm: { add9: ['D5'], octave: ['C5', 'Eb5', 'G5', 'D6'], seventh: ['Bb4', 'D5'], triad: [] },
  D: { add9: ['E5'], octave: ['D5', 'F#5', 'A5', 'E6'], seventh: ['C#5', 'E5'], triad: [] },
  Eb: { add9: ['F5'], octave: ['Eb5', 'G5', 'Bb5', 'F6'], seventh: ['D5', 'F5'], triad: [] },
  Em: { add9: ['F#4'], octave: ['E4', 'G4', 'B4', 'F#5'], seventh: ['D4', 'F#4'], triad: [] },
  G: { add9: ['A4'], octave: ['G4', 'B4', 'D5', 'A5'], seventh: ['F#4', 'A4'], triad: [] },
}

export function getConnectedChord(
  activeKeys: ControlKey[],
  hands: DetectedHand[] = [],
  preset: MusicPreset,
): RaveChord | null {
  const rightKey = HARMONY_KEYS.find((key) => activeKeys.includes(key))

  if (!rightKey) {
    return null
  }

  const leftKey =
    BEAT_KEYS.find((key) => activeKeys.includes(key)) ?? ('Left-thumb' as ControlKey)
  const rightHand = hands.find((hand) => hand.side === 'Right')
  const profile = getExpressionProfile(rightHand)
  const chordName = getChordNameFromKey(rightKey, preset)
  const base = CHORD_LIBRARY[chordName] ?? CHORD_LIBRARY.Bm
  const extensions = EXTENSION_BY_CHORD[chordName]?.[profile.color] ?? []
  const notes = uniqueNotes([...base.notes, ...extensions])

  return {
    altitudeName: profile.heightName,
    bassNote: base.bassNote,
    color: profile.color,
    colorName: profile.colorName,
    complexity: notes.length,
    heightBand: profile.heightBand,
    inversionName: profile.inversionName,
    leftKey,
    name: `${chordName} ${profile.colorName} ${profile.heightName}`,
    notes,
    rightKey,
  }
}

export function getChordLabel(
  activeKeys: ControlKey[],
  hands: DetectedHand[] = [],
  preset: MusicPreset,
) {
  const chord = getConnectedChord(activeKeys, hands, preset)

  return chord ? `${chord.name} (${chord.inversionName})` : 'Sin acorde'
}

function getChordNameFromKey(key: ControlKey, preset: MusicPreset) {
  const index = Math.max(0, HARMONY_KEYS.indexOf(key))

  return preset.progression[index % preset.progression.length]
}

function getExpressionProfile(hand?: DetectedHand) {
  const height = hand?.motion.height ?? 0.45
  const openness = hand?.motion.openness ?? 0.35
  const roll = hand?.motion.roll ?? 0
  const heightBand: HeightBand = height > 0.68 ? 'high' : height > 0.38 ? 'mid' : 'low'
  const color: ChordColor =
    openness > 0.72 ? 'octave' : heightBand === 'high' ? 'seventh' : heightBand === 'mid' ? 'add9' : 'triad'
  const colorName =
    color === 'octave'
      ? 'Open'
      : color === 'seventh'
        ? 'Maj7'
        : color === 'add9'
          ? 'Add9'
          : 'Pad'

  if (roll > 0.34) {
    return {
      color,
      colorName,
      heightBand,
      heightName: getHeightName(heightBand),
      inversionName: '1ra inversion',
    }
  }

  if (roll < -0.34) {
    return {
      color,
      colorName,
      heightBand,
      heightName: getHeightName(heightBand),
      inversionName: '2da inversion',
    }
  }

  return {
    color,
    colorName,
    heightBand,
    heightName: getHeightName(heightBand),
    inversionName: 'Root',
  }
}

function getHeightName(heightBand: HeightBand) {
  return {
    high: 'Alta',
    low: 'Baja',
    mid: 'Media',
  }[heightBand]
}

function uniqueNotes(notes: string[]) {
  return [...new Set(notes)]
}
