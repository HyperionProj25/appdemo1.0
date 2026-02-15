import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { players, getPlayerFullName, teams } from '../../data/players'
import Sparkline from '../../components/Sparkline'
import ChangeIndicator from '../../components/ChangeIndicator'

const generateTrend = (base: number, variance: number): number[] => {
  const result: number[] = []
  let current = base - variance
  for (let i = 0; i < 8; i++) {
    current += (Math.random() - 0.3) * variance * 0.5
    result.push(Math.round(current * 10) / 10)
  }
  return result
}

export default function CoachRoster() {
  const navigate = useNavigate()
  const [selectedTeam, setSelectedTeam] = useState<string>('Durham Bulls')
  const [sortBy, setSortBy] = useState<'name' | 'avgEV' | 'maxEV' | 'avgBS'>('avgEV')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const teamRoster = players
    .filter(p => p.team === selectedTeam && p.sport === 'Baseball')
    .sort((a, b) => {
      const aVal = sortBy === 'name' ? `${a.lastName}${a.firstName}` : a[sortBy]
      const bVal = sortBy === 'name' ? `${b.lastName}${b.firstName}` : b[sortBy]
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortDir('desc')
    }
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--panel)',
    border: '1px solid var(--orange-border)',
    borderRadius: 10,
    boxShadow: 'inset 0 1px 0 var(--accent-bg-medium)',
  }

  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'var(--accent)',
    marginBottom: 18,
  }

  // Calculate team averages
  const teamAvgEV = teamRoster.length > 0 ? (teamRoster.reduce((sum, p) => sum + p.avgEV, 0) / teamRoster.length).toFixed(1) : '0'
  const teamMaxEV = teamRoster.length > 0 ? Math.max(...teamRoster.map(p => p.maxEV)) : 0
  const teamAvgBS = teamRoster.length > 0 ? (teamRoster.reduce((sum, p) => sum + p.avgBS, 0) / teamRoster.length).toFixed(1) : '0'

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div className="anim-fade-in" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--text-bright)', marginBottom: 4 }}>
          Roster Management
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--muted)' }}>
          Manage and track your hitting roster metrics
        </p>
      </div>

      {/* Team Selection */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
          Select Team
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          {teams.map(team => (
            <button
              key={team}
              onClick={() => setSelectedTeam(team)}
              style={{
                padding: '10px 16px',
                background: selectedTeam === team ? 'var(--accent)' : 'transparent',
                border: `1px solid ${selectedTeam === team ? 'var(--accent)' : 'var(--muted)'}`,
                borderRadius: 6,
                color: selectedTeam === team ? '#000' : 'var(--text)',
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      {/* Team Stats Summary */}
      <div className="anim-slide-up anim-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Roster Size</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{teamRoster.length}</div>
        </div>
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Team Avg EV</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--text-bright)' }}>{teamAvgEV}</div>
        </div>
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Team Max EV</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{teamMaxEV}</div>
        </div>
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Team Avg BS</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--text-bright)' }}>{teamAvgBS}</div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="anim-slide-up anim-delay-2" style={secTitle}>Full Roster</div>
      <div className="anim-slide-up anim-delay-3" style={{ ...cardStyle, padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--orange-border)' }}>
              {[
                { key: 'name', label: 'Player' },
                { key: 'position', label: 'Pos' },
                { key: 'age', label: 'Age' },
                { key: 'bats', label: 'B/T' },
                { key: 'avgEV', label: 'Avg EV' },
                { key: 'maxEV', label: 'Max EV' },
                { key: 'avgBS', label: 'Bat Speed' },
                { key: 'trend', label: 'EV Trend' },
                { key: 'swings', label: 'Swings' },
                { key: 'status', label: 'Status' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => ['name', 'avgEV', 'maxEV', 'avgBS'].includes(col.key) ? handleSort(col.key as any) : null}
                  style={{
                    padding: '12px 16px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    color: sortBy === col.key ? 'var(--accent)' : 'var(--muted)',
                    textAlign: 'left',
                    cursor: ['name', 'avgEV', 'maxEV', 'avgBS'].includes(col.key) ? 'pointer' : 'default',
                  }}
                >
                  {col.label}
                  {sortBy === col.key && <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamRoster.map((player, i) => {
              const evChange = (Math.random() - 0.3) * 4
              return (
                <tr
                  key={player.id}
                  style={{ borderBottom: i < teamRoster.length - 1 ? '1px solid var(--surface-tint-2)' : 'none', cursor: 'pointer' }}
                  onClick={() => navigate(`/player/${player.id}/dashboard`)}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--text-bright)' }}>
                      {getPlayerFullName(player)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>
                      {player.height} • {player.weight} lbs
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)' }}>{player.position}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>{player.age}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>{player.bats}/{player.throws}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color: 'var(--text-bright)' }}>{player.avgEV}</span>
                      <ChangeIndicator value={evChange} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>{player.maxEV}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text)' }}>{player.avgBS} mph</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Sparkline data={generateTrend(player.avgEV, 3)} width={60} height={20} showEndDot />
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--muted)' }}>{player.swings}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '5px 10px',
                      background: evChange > 1 ? 'var(--color-positive-bg)' : evChange < -1 ? 'var(--color-negative-bg)' : 'rgba(158,158,158,0.15)',
                      color: evChange > 1 ? 'var(--color-positive)' : evChange < -1 ? 'var(--color-negative)' : 'var(--muted)',
                      borderRadius: 6,
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}>
                      {evChange > 1 ? 'Hot' : evChange < -1 ? 'Cold' : 'Steady'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
