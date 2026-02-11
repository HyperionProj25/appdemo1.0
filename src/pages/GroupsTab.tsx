import { useState } from 'react'
import { groups } from '../data/groups'

export default function GroupsTab() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '12px 0' }}>
      {groups.map(g => (
        <div key={g.id} style={{
          background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 3,
          padding: '14px 18px', width: 280, boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-bright)', marginBottom: 4 }}>{g.name}</h3>
          <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12 }}>{g.year}</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12 }}>{g.athleteCount} ATHLETES</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            {g.technologies.map((t, i) => (
              <span key={i} style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, fontSize: 9, fontWeight: 700, letterSpacing: '0.5px', background: '#555', color: 'var(--text)' }}>{t.toUpperCase()}</span>
            ))}
            <button style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }} onClick={() => toggle(g.id)}>
              {expanded[g.id] ? '\u25B2' : '\u25BC'}
            </button>
          </div>

          {expanded[g.id] && (
            <div style={{ marginTop: 12, borderTop: '1px solid var(--panel-border)', paddingTop: 8 }}>
              {g.players.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
                  <span style={{ fontWeight: 500, letterSpacing: '0.5px' }}>{p.name.toUpperCase()}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{p.year}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
