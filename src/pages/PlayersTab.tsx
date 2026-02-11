import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { players, getPlayerName } from '../data/players'

export default function PlayersTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? players.filter(p => {
        const q = search.toLowerCase()
        const name = getPlayerName(p).toLowerCase()
        return name.includes(q) || p.sport.toLowerCase().includes(q) || String(p.gradYear).includes(q)
      })
    : players

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 10, fontSize: 14, color: 'var(--muted)', pointerEvents: 'none' }}>&#128269;</span>
            <input
              type="text"
              placeholder="Search athletes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '9px 14px 9px 34px', background: 'var(--panel)', border: '1px solid var(--card-border)',
                borderRadius: 6, color: 'var(--text)', fontSize: 12, fontFamily: 'var(--font-body)',
                width: 220, transition: 'border-color 0.15s',
              }}
            />
          </div>
          <button className="btn" disabled title="Coming soon">DATE</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" disabled title="Coming soon">ASSIGN TO GROUP</button>
          <button className="btn" disabled title="Coming soon">ANNOTATE</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '18px 22px' }}>
        <h3 style={secTitle}>ATHLETES{search && ` (${filtered.length})`}</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>SPORT</th>
              <th>GRAD YEAR</th>
              <th>LAST SESSION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/player/${p.id}/dashboard`)}>
                <td style={{ fontWeight: 700, textTransform: 'uppercase' }}>{getPlayerName(p)}</td>
                <td style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>{p.sport.toUpperCase()}</td>
                <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{p.gradYear}</td>
                <td>{p.lastSession}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic', padding: 20 }}>
                  No athletes match "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const secTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14,
  textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text)',
  marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--orange-border)',
}
