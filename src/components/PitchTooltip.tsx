import { useRef, useLayoutEffect, useState } from 'react'

export interface TooltipField { label: string; value: string | number }

interface Props {
  fields: TooltipField[]
  x: number          // px relative to container
  y: number          // px relative to container
  accentColor?: string
  containerW: number // container width px
  containerH: number // container height px
}

export default function PitchTooltip({ fields, x, y, accentColor, containerW, containerH }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    if (ref.current) {
      setSize({ w: ref.current.offsetWidth, h: ref.current.offsetHeight })
    }
  }, [fields])

  // Offset from cursor
  const GAP = 10
  let left = x + GAP
  let top = y - size.h - GAP

  // Flip right edge
  if (left + size.w > containerW - 4) left = x - size.w - GAP
  // Flip bottom edge
  if (top < 4) top = y + GAP

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left,
        top,
        background: 'var(--panel)',
        border: '1px solid var(--card-border)',
        borderLeft: accentColor ? `3px solid ${accentColor}` : '1px solid var(--card-border)',
        borderRadius: 6,
        padding: '8px 12px',
        pointerEvents: 'none',
        zIndex: 50,
        minWidth: 110,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}
    >
      {fields.map((f, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginBottom: i < fields.length - 1 ? 3 : 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{f.label}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-bright)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{f.value}</span>
        </div>
      ))}
    </div>
  )
}
