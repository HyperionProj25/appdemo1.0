import { useState } from 'react'
import { groups } from '../data/groups'

export default function GroupsTab() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '14px 0' }}>
      {groups.map(g => (
        <div key={g.id} style={{
          background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6,
          padding: '16px 20px', width: 280, boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-bright)', marginBottom: 6 }}>{g.name}</h3>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)' }}>{g.year}</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13 }}>{g.athleteCount} ATHLETES</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {g.technologies.map((t, i) => (
              <span key={i} style={{ display: 'inline-block', padding: '5px 10px', borderRadius: 10, fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', background: '#555', color: 'var(--text)' }}>{t.toUpperCase()}</span>
            ))}
            <button style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }} onClick={() => toggle(g.id)}>
              {expanded[g.id] ? '\u25B2' : '\u25BC'}
            </button>
          </div>

          {expanded[g.id] && (
            <div style={{ marginTop: 14, borderTop: '1px solid var(--panel-border)', paddingTop: 10 }}>
              {g.players.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                  <span style={{ fontWeight: 500, letterSpacing: '0.5px' }}>{p.name.toUpperCase()}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{p.year}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
