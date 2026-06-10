import type { ReactNode } from 'react'

type StatusPillProps = {
  icon: ReactNode
  label: string
  tone: 'good' | 'hot' | 'muted'
}

export function StatusPill({ icon, label, tone }: StatusPillProps) {
  return (
    <span className={`status-pill ${tone}`}>
      {icon}
      {label}
    </span>
  )
}
