import { Music2 } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { FingerControl, HandSignal } from '../domain/raveControls'

type ControlBankProps = {
  controls: FingerControl[]
  signal: HandSignal
  title: string
}

export function ControlBank({ controls, signal, title }: ControlBankProps) {
  return (
    <div className="control-bank">
      <div className="bank-title">
        <Music2 size={15} />
        <span>{title}</span>
      </div>
      <div className="finger-grid">
        {controls.map((item) => {
          const isActive = signal.activeKeys.includes(item.key)

          return (
            <div
              className={isActive ? 'finger-note active' : 'finger-note'}
              key={item.key}
              style={{ '--note-color': item.color } as CSSProperties}
            >
              <span className="finger-name">{item.finger}</span>
              <strong>{item.label}</strong>
            </div>
          )
        })}
      </div>
    </div>
  )
}
