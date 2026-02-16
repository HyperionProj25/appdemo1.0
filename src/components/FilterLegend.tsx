interface FilterItem {
  key: string
  label: string
  color: string
}

interface Props {
  items: FilterItem[]
  active: Set<string>
  onToggle: (key: string) => void
  onReset: () => void
}

export default function FilterLegend({ items, active, onToggle, onReset }: Props) {
  const allActive = active.size === items.length

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      <button
        onClick={onReset}
        style={{
          padding: '4px 10px',
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          background: allActive ? 'rgba(224,172,68,0.15)' : 'var(--panel)',
          border: `1px solid ${allActive ? 'var(--accent)' : 'var(--card-border)'}`,
          borderRadius: 12,
          color: allActive ? 'var(--accent)' : 'var(--muted)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        ALL
      </button>
      {items.map(item => {
        const isActive = active.has(item.key)
        return (
          <button
            key={item.key}
            onClick={() => onToggle(item.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              background: isActive ? 'var(--panel)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--card-border)' : 'rgba(60,60,60,0.4)'}`,
              borderRadius: 12,
              color: isActive ? 'var(--text)' : 'var(--muted)',
              opacity: isActive ? 1 : 0.45,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: item.color,
              display: 'inline-block',
              opacity: isActive ? 1 : 0.35,
            }} />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
