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
    borderRadius: 8,
    boxShadow: 'inset 0 1px 0 rgba(224,172,68,0.1)',
  }

  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: 'var(--accent)',
    marginBottom: 16,
  }

  // Calculate team averages
  const teamAvgEV = teamRoster.length > 0 ? (teamRoster.reduce((sum, p) => sum + p.avgEV, 0) / teamRoster.length).toFixed(1) : '0'
  const teamMaxEV = teamRoster.length > 0 ? Math.max(...teamRoster.map(p => p.maxEV)) : 0
  const teamAvgBS = teamRoster.length > 0 ? (teamRoster.reduce((sum, p) => sum + p.avgBS, 0) / teamRoster.length).toFixed(1) : '0'

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--text-bright)', marginBottom: 4 }}>
          Roster Management
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)' }}>
          Manage and track your hitting roster metrics
        </p>
      </div>

      {/* Team Selection */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
          Select Team
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {teams.map(team => (
            <button
              key={team}
              onClick={() => setSelectedTeam(team)}
              style={{
                padding: '8px 16px',
                background: selectedTeam === team ? 'var(--accent)' : 'transparent',
                border: `1px solid ${selectedTeam === team ? 'var(--accent)' : 'var(--muted)'}`,
                borderRadius: 4,
                color: selectedTeam === team ? '#000' : 'var(--text)',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Roster Size</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{teamRoster.length}</div>
        </div>
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Team Avg EV</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--text-bright)' }}>{teamAvgEV}</div>
        </div>
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Team Max EV</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{teamMaxEV}</div>
        </div>
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Team Avg BS</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--text-bright)' }}>{teamAvgBS}</div>
        </div>
      </div>

      {/* Roster Table */}
      <div style={secTitle}>Full Roster</div>
      <div style={{ ...cardStyle, padding: 0 }}>
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
                    padding: '12px 14px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '1.5px',
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
                  style={{ borderBottom: i < teamRoster.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer' }}
                  onClick={() => navigate(`/player/${player.id}/dashboard`)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,172,68,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-bright)' }}>
                      {getPlayerFullName(player)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)' }}>
                      {player.height} • {player.weight} lbs
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>{player.position}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>{player.age}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>{player.bats}/{player.throws}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, color: 'var(--text-bright)' }}>{player.avgEV}</span>
                      <ChangeIndicator value={evChange} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>{player.maxEV}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)' }}>{player.avgBS} mph</td>
                  <td style={{ padding: '12px 14px' }}>
                    <Sparkline data={generateTrend(player.avgEV, 3)} width={60} height={20} showEndDot />
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>{player.swings}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '4px 10px',
                      background: evChange > 1 ? 'rgba(76,175,80,0.15)' : evChange < -1 ? 'rgba(229,57,53,0.15)' : 'rgba(158,158,158,0.15)',
                      color: evChange > 1 ? '#4caf50' : evChange < -1 ? '#e53935' : 'var(--muted)',
                      borderRadius: 4,
                      fontFamily: 'var(--font-body)',
                      fontSize: 9,
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
