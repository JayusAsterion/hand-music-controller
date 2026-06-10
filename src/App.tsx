import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Camera, Hand, Radio, Volume2 } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { ControlBank } from './components/ControlBank'
import { GenreSelector } from './components/GenreSelector'
import { HandTracker } from './components/HandTracker'
import { MusicInfoPanel } from './components/MusicInfoPanel'
import { RaveNodeScene } from './components/RaveNodeScene'
import { StatusPill } from './components/StatusPill'
import { VisualSelector } from './components/VisualSelector'
import { getMusicPreset } from './domain/musicPresets'
import { getVisualPreset } from './domain/visualPresets'
import {
  CONTROL_BY_KEY,
  LEFT_CONTROLS,
  RIGHT_CONTROLS,
  type FingerControl,
} from './domain/raveControls'
import { useRaveEngine } from './hooks/useRaveEngine'
import { useRaveStore } from './store/useRaveStore'
import { getChordLabel } from './utils/harmony'
import './App.css'

function App() {
  const signal = useRaveStore((state) => state.signal)
  const status = useRaveStore((state) => state.status)
  const message = useRaveStore((state) => state.message)
  const audioReady = useRaveStore((state) => state.audioReady)
  const selectedPresetId = useRaveStore((state) => state.selectedPresetId)
  const selectedVisualPresetId = useRaveStore(
    (state) => state.selectedVisualPresetId,
  )
  const setAudioReady = useRaveStore((state) => state.setAudioReady)
  const setMessage = useRaveStore((state) => state.setMessage)
  const selectedPreset = getMusicPreset(selectedPresetId)
  const selectedVisualPreset = getVisualPreset(selectedVisualPresetId)

  const activeControls = useMemo(
    () =>
      signal.activeKeys
        .map((key) => CONTROL_BY_KEY.get(key))
        .filter((control): control is FingerControl => Boolean(control)),
    [signal.activeKeys],
  )
  const rightControls = useMemo(() => {
    const chordControls = RIGHT_CONTROLS.filter((control) => control.role === 'chord')

    return RIGHT_CONTROLS.map((control) => {
      if (control.role !== 'chord') {
        return control
      }

      const chordIndex = chordControls.findIndex(
        (chordControl) => chordControl.key === control.key,
      )
      const label =
        selectedPreset.progression[chordIndex % selectedPreset.progression.length]

      return { ...control, label }
    })
  }, [selectedPreset])
  const { startAudio, stopAudio } = useRaveEngine(
    activeControls,
    signal.hands,
    selectedPreset,
    setAudioReady,
  )
  const detectedLabel =
    signal.hands.length > 0
      ? signal.hands.map((hand) => hand.label).join(' + ')
      : 'Sin manos'
  const chordLabel = getChordLabel(signal.activeKeys, signal.hands, selectedPreset)

  const handleStart = useCallback(async () => {
    setMessage('Activando')
    await startAudio()
    setAudioReady(true)
  }, [setAudioReady, setMessage, startAudio])

  return (
    <main className="app-shell">
      <section className="stage">
        <div className="scene-layer" aria-hidden="true">
          <Canvas camera={{ position: [0, 0.55, 7.2], fov: 47 }}>
            <color attach="background" args={[selectedVisualPreset.background]} />
            <fog attach="fog" args={[selectedVisualPreset.background, 7, 15]} />
            <ambientLight intensity={0.55} />
            <pointLight
              color={selectedVisualPreset.secondary}
              intensity={2.4}
              position={[-4, 2, 4]}
            />
            <pointLight
              color={selectedVisualPreset.primary}
              intensity={2.2}
              position={[4, 2, 4]}
            />
            <pointLight
              color={selectedVisualPreset.accent}
              intensity={1.4}
              position={[0, -3, 3]}
            />
            <RaveNodeScene
              activeKeys={signal.activeKeys}
              hands={signal.hands}
              preset={selectedPreset}
              visualPreset={selectedVisualPreset}
            />
            <OrbitControls
              autoRotate
              autoRotateSpeed={0.55}
              enablePan={false}
              enableZoom={false}
              maxPolarAngle={Math.PI / 1.62}
              minPolarAngle={Math.PI / 2.8}
            />
          </Canvas>
        </div>

        <div className="instrument-panel">
          <header className="topbar">
            <div>
              <p className="eyebrow">Two Hand Rave Controller</p>
              <h1>Rave gestual</h1>
            </div>
            <div className="status-cluster">
              <StatusPill
                icon={<Camera size={16} />}
                label={status === 'tracking' ? '2 manos' : 'Camara'}
                tone={status === 'tracking' ? 'good' : 'muted'}
              />
              <StatusPill
                icon={<Volume2 size={16} />}
                label={audioReady ? 'Rave' : 'Audio'}
                tone={audioReady ? 'hot' : 'muted'}
              />
            </div>
            <GenreSelector />
            <VisualSelector />
          </header>

          <div className="control-grid">
            <HandTracker onStartAudio={handleStart} onStopAudio={stopAudio} />

            <section className="notes-panel" aria-label="Controles rave">
              <div className="meter-heading">
                <div>
                  <span className="panel-kicker">Mapa</span>
                  <h2>Ritmo + Lead</h2>
                </div>
                <div className="hand-readout">
                  <Hand size={18} />
                  <span>{detectedLabel}</span>
                </div>
              </div>

              <ControlBank title="Izquierda" controls={LEFT_CONTROLS} signal={signal} />
              <ControlBank title="Derecha" controls={rightControls} signal={signal} />

              <div className="signal-strip">
                <div>
                  <span className="panel-kicker">Energia</span>
                  <strong>{Math.round(signal.score * 100)}%</strong>
                </div>
                <div className="signal-bar" aria-hidden="true">
                  <span style={{ width: `${Math.round(signal.score * 100)}%` }} />
                </div>
              </div>

              <div className="active-chord">
                <Radio size={18} />
                <span>
                  {chordLabel !== 'Sin acorde'
                    ? chordLabel
                    : activeControls.length > 0
                      ? activeControls.map((item) => item.label).join(' + ')
                      : 'Silencio'}
                </span>
              </div>

              <p className="system-message">{message}</p>
            </section>
          </div>
        </div>

        <MusicInfoPanel
          activeControls={activeControls}
          selectedPresetId={selectedPresetId}
          selectedVisualPresetId={selectedVisualPresetId}
          signal={signal}
        />
      </section>
    </main>
  )
}

export default App
