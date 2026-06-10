import { AudioLines, Gauge, HandMetal, Layers3, Music } from 'lucide-react'
import type { ReactNode } from 'react'
import { getMusicPreset } from '../domain/musicPresets'
import { getVisualPreset } from '../domain/visualPresets'
import type { FingerControl, HandSignal } from '../domain/raveControls'
import { getAvailableSampleCount } from '../utils/audioSamples'
import { getChordLabel } from '../utils/harmony'

type MusicInfoPanelProps = {
  activeControls: FingerControl[]
  selectedPresetId: string
  selectedVisualPresetId: string
  signal: HandSignal
}

export function MusicInfoPanel({
  activeControls,
  selectedPresetId,
  selectedVisualPresetId,
  signal,
}: MusicInfoPanelProps) {
  const preset = getMusicPreset(selectedPresetId)
  const visualPreset = getVisualPreset(selectedVisualPresetId)
  const chordLabel = getChordLabel(signal.activeKeys, signal.hands, preset)
  const leftHand = signal.hands.find((hand) => hand.side === 'Left')
  const rightHand = signal.hands.find((hand) => hand.side === 'Right')
  const sampleCount = getAvailableSampleCount(preset)

  return (
    <aside className="music-info-panel" aria-label="Informacion musical">
      <div className="info-heading">
        <span className="panel-kicker">Sesion</span>
        <h2>{preset.name}</h2>
        <p>{preset.artistReference}</p>
      </div>

      <div className="info-grid">
        <InfoStat icon={<Gauge size={16} />} label="BPM" value={`${preset.bpm}`} />
        <InfoStat icon={<Music size={16} />} label="Escala" value={preset.scale} />
        <InfoStat
          icon={<Layers3 size={16} />}
          label="Visual"
          value={visualPreset.name}
        />
        <InfoStat
          icon={<AudioLines size={16} />}
          label="Acorde"
          value={chordLabel}
        />
      </div>

      <section className="info-section">
        <span className="panel-kicker">Progresion</span>
        <div className="progression-row">
          {preset.progression.map((chord) => (
            <span key={chord}>{chord}</span>
          ))}
        </div>
      </section>

      <section className="info-section">
        <span className="panel-kicker">Gestos</span>
        <GestureLine label="Izquierda" hand={leftHand} role="Beat / groove" />
        <GestureLine label="Derecha" hand={rightHand} role="Acordes / color" />
      </section>

      <section className="info-section">
        <span className="panel-kicker">Textura</span>
        <p>{preset.texture}</p>
      </section>

      <section className="info-section">
        <span className="panel-kicker">Visuales</span>
        <p>
          {visualPreset.mood}. Samples detectados: {sampleCount}/5.
        </p>
      </section>

      <section className="info-section">
        <span className="panel-kicker">Activo</span>
        <p>
          {activeControls.length > 0
            ? activeControls.map((control) => control.label).join(' + ')
            : 'Esperando gesto'}
        </p>
      </section>
    </aside>
  )
}

function InfoStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="info-stat">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function GestureLine({
  hand,
  label,
  role,
}: {
  hand?: HandSignal['hands'][number]
  label: string
  role: string
}) {
  const height = Math.round((hand?.motion.height ?? 0) * 100)
  const openness = Math.round((hand?.motion.openness ?? 0) * 100)

  return (
    <div className="gesture-line">
      <HandMetal size={15} />
      <div>
        <strong>{label}</strong>
        <span>{role}</span>
      </div>
      <small>
        {height}% / {openness}%
      </small>
    </div>
  )
}
