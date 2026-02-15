import { useState } from 'react'
import Sparkline from '../../components/Sparkline'
import { pitchingStaff, type Pitcher } from '../../data/pitchingStaff'

const generateTrend = (base: number, variance: number): number[] => {
  const result: number[] = []
  let current = base - variance
  for (let i = 0; i < 8; i++) {
    current += (Math.random() - 0.3) * variance * 0.5
    result.push(Math.round(current * 10) / 10)
  }
  return result
}

type RoleFilter = 'all' | 'SP' | 'RP' | 'CL'
type SortKey = 'name' | 'era' | 'whip' | 'kPer9' | 'bbPer9' | 'ip' | 'stuffPlus'

export default function PitchingCoachStaff() {
  const [filter, setFilter] = useState<RoleFilter>('all')
  const [sortBy, setSortBy] = useState<SortKey>('stuffPlus')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = filter === 'all'
    ? pitchingStaff
    : pitchingStaff.filter(p => p.role === filter)

  const sorted = [...filtered].sort((a, b) => {
    const aVal = sortBy === 'name' ? `${a.lastName}${a.firstName}` : a[sortBy]
    const bVal = sortBy === 'name' ? `${b.lastName}${b.firstName}` : b[sortBy]
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1
    return aVal < bVal ? 1 : -1
  })

  const handleSort = (col: SortKey) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('desc') }
  }

  const avgERA = filtered.length > 0 ? (filtered.reduce((s, p) => s + p.era, 0) / filtered.length).toFixed(2) : '0'
  const avgStuff = filtered.length > 0 ? Math.round(filtered.reduce((s, p) => s + p.stuffPlus, 0) / filtered.length) : 0
  const avgFBVelo = filtered.length > 0 ? (filtered.reduce((s, p) => s + p.avgFB, 0) / filtered.length).toFixed(1) : '0'

  const cardStyle: React.CSSProperties = {
    background: 'var(--panel)', border: '1px solid var(--orange-border)',
    borderRadius: 10, boxShadow: 'inset 0 1px 0 var(--accent-bg-medium)',
  }

  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
    textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent)', marginBottom: 18,
  }

  const filters: Array<{ key: RoleFilter; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'SP', label: 'Starters' },
    { key: 'RP', label: 'Relievers' },
    { key: 'CL', label: 'Closers' },
  ]

  const stuffColor = (val: number) => val >= 115 ? 'var(--color-positive)' : val >= 100 ? 'var(--color-warning)' : 'var(--color-negative)'
  const readinessColor = (r: Pitcher['readiness']) => r === 'green' ? 'var(--color-positive)' : r === 'yellow' ? 'var(--color-warning)' : 'var(--color-negative)'

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div className="anim-fade-in" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--text-bright)', marginBottom: 4 }}>
          Pitching Staff
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--muted)' }}>
          Manage and track your pitching roster
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '10px 18px',
            background: filter === f.key ? 'var(--accent)' : 'transparent',
            border: `1px solid ${filter === f.key ? 'var(--accent)' : 'var(--muted)'}`,
            borderRadius: 6,
            color: filter === f.key ? '#000' : 'var(--text)',
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>{f.label}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="anim-slide-up anim-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Staff Size', value: filtered.length.toString() },
          { label: 'Avg ERA', value: avgERA },
          { label: 'Avg Stuff+', value: avgStuff.toString() },
          { label: 'Avg FB Velo', value: `${avgFBVelo}` },
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: i === 2 ? stuffColor(avgStuff) : 'var(--accent)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Roster table */}
      <div className="anim-slide-up anim-delay-2" style={secTitle}>Full Roster</div>
      <div className="anim-slide-up anim-delay-3" style={{ ...cardStyle, padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--orange-border)' }}>
              {[
                { key: 'name', label: 'Name' },
                { key: 'role', label: 'Role' },
                { key: 'throws', label: 'T' },
                { key: 'era', label: 'ERA' },
                { key: 'whip', label: 'WHIP' },
                { key: 'kPer9', label: 'K/9' },
                { key: 'bbPer9', label: 'BB/9' },
                { key: 'ip', label: 'IP' },
                { key: 'stuffPlus', label: 'Stuff+' },
                { key: 'readiness', label: 'Ready' },
                { key: 'trend', label: 'Trend' },
              ].map(col => (
                <th key={col.key}
                  onClick={() => ['name', 'era', 'whip', 'kPer9', 'bbPer9', 'ip', 'stuffPlus'].includes(col.key) ? handleSort(col.key as SortKey) : null}
                  style={{
                    padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 10,
                    fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase',
                    color: sortBy === col.key ? 'var(--accent)' : 'var(--muted)', textAlign: 'left',
                    cursor: ['name', 'era', 'whip', 'kPer9', 'bbPer9', 'ip', 'stuffPlus'].includes(col.key) ? 'pointer' : 'default',
                  }}>
                  {col.label}
                  {sortBy === col.key && <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p.id}
                style={{ borderBottom: i < sorted.length - 1 ? '1px solid var(--surface-tint-2)' : 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-bg-subtle)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--text-bright)' }}>
                    {p.firstName} {p.lastName}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>
                    Age {p.age} — {p.wins}W-{p.losses}L{p.saves > 0 ? `, ${p.saves} SV` : ''}
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.8px',
                    background: p.role === 'SP' ? 'var(--color-info-bg)' : p.role === 'CL' ? 'var(--color-negative-bg)' : 'rgba(158,158,158,0.15)',
                    color: p.role === 'SP' ? 'var(--color-info)' : p.role === 'CL' ? 'var(--color-negative)' : 'var(--muted)',
                  }}>{p.role}</span>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>{p.throws}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: p.era <= 3.0 ? 'var(--color-positive)' : 'var(--text-bright)' }}>{p.era.toFixed(2)}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>{p.whip.toFixed(2)}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: p.kPer9 >= 11 ? 'var(--accent)' : 'var(--text)' }}>{p.kPer9.toFixed(1)}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: p.bbPer9 >= 3.5 ? 'var(--color-warning)' : 'var(--text)' }}>{p.bbPer9.toFixed(1)}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>{p.ip.toFixed(1)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                    background: `${stuffColor(p.stuffPlus)}22`, color: stuffColor(p.stuffPlus),
                  }}>{p.stuffPlus}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: readinessColor(p.readiness),
                    boxShadow: `0 0 6px ${readinessColor(p.readiness)}55`,
                  }} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Sparkline data={generateTrend(p.stuffPlus, 5)} width={50} height={18} showEndDot />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
