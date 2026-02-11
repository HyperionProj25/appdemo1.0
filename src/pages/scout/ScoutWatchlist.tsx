import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { players, getPlayerFullName } from '../../data/players'
import Sparkline from '../../components/Sparkline'
import ChangeIndicator from '../../components/ChangeIndicator'

// Full watchlist data
const watchlistPlayers = [
  { playerId: '3000001', priority: 'high', notes: 'Power trajectory excellent. Ready for callup discussion.', lastVisit: '2026-01-15' },
  { playerId: '3000014', priority: 'high', notes: 'Most advanced bat in system. Tracking for September.', lastVisit: '2026-01-08' },
  { playerId: '3000021', priority: 'high', notes: 'Consistent producer. Arb 1 eligible, strong case.', lastVisit: '2025-12-20' },
  { playerId: '3000002', priority: 'medium', notes: 'Speed tool plus. Working on power development.', lastVisit: '2026-01-10' },
  { playerId: '3000030', priority: 'high', notes: 'Top power prospect. Career-high exit velo marks.', lastVisit: '2026-01-05' },
  { playerId: '3000015', priority: 'medium', notes: 'Solid all-around. Good makeup, leadership qualities.', lastVisit: '2026-01-02' },
  { playerId: '3000018', priority: 'medium', notes: 'Breakout candidate. Mechanical adjustments paying off.', lastVisit: '2025-12-28' },
  { playerId: '3000016', priority: 'low', notes: 'Development track. Needs more AB at AA level.', lastVisit: '2025-12-15' },
  { playerId: '3000019', priority: 'medium', notes: 'Defensive asset. Bat coming around lately.', lastVisit: '2025-12-22' },
  { playerId: '3000025', priority: 'low', notes: 'Monitoring progress. Inconsistent performance.', lastVisit: '2025-12-10' },
]

const generateTrend = (base: number, variance: number): number[] => {
  const result: number[] = []
  let current = base - variance
  for (let i = 0; i < 8; i++) {
    current += (Math.random() - 0.3) * variance * 0.5
    result.push(Math.round(current * 10) / 10)
  }
  return result
}

export default function ScoutWatchlist() {
  const navigate = useNavigate()
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')

  const filteredList = watchlistPlayers.filter(wp => {
    const player = players.find(p => p.id === wp.playerId)
    if (!player) return false
    if (filterPriority !== 'all' && wp.priority !== filterPriority) return false
    if (filterLevel !== 'all' && player.level !== filterLevel) return false
    return true
  })

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

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--text-bright)', marginBottom: 4 }}>
          Watchlist
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)' }}>
          {watchlistPlayers.length} players in your territory
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Priority
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'high', 'medium', 'low'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                style={{
                  padding: '6px 14px',
                  background: filterPriority === p ? 'var(--accent)' : 'transparent',
                  border: `1px solid ${filterPriority === p ? 'var(--accent)' : 'var(--muted)'}`,
                  borderRadius: 4,
                  color: filterPriority === p ? '#000' : 'var(--text)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Level
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'AAA', 'AA', 'A+', 'A'].map(l => (
              <button
                key={l}
                onClick={() => setFilterLevel(l)}
                style={{
                  padding: '6px 14px',
                  background: filterLevel === l ? 'var(--accent)' : 'transparent',
                  border: `1px solid ${filterLevel === l ? 'var(--accent)' : 'var(--muted)'}`,
                  borderRadius: 4,
                  color: filterLevel === l ? '#000' : 'var(--text)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Watchlist Table */}
      <div style={{ ...cardStyle, padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--orange-border)' }}>
              {['Priority', 'Player', 'Team', 'Level', 'Pos', 'Avg EV', 'Max EV', 'Trend', 'Last Visit', 'Notes'].map(h => (
                <th key={h} style={{
                  padding: '12px 14px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  textAlign: 'left',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredList.map((wp, i) => {
              const player = players.find(p => p.id === wp.playerId)
              if (!player) return null

              return (
                <tr
                  key={wp.playerId}
                  style={{
                    borderBottom: i < filteredList.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/player/${player.id}/dashboard`)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,172,68,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 10px',
                      background: wp.priority === 'high' ? 'rgba(229,57,53,0.15)' : wp.priority === 'medium' ? 'rgba(255,193,7,0.15)' : 'rgba(158,158,158,0.15)',
                      color: wp.priority === 'high' ? '#e53935' : wp.priority === 'medium' ? '#ffc107' : 'var(--muted)',
                      borderRadius: 4,
                      fontFamily: 'var(--font-body)',
                      fontSize: 9,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}>
                      {wp.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-bright)' }}>
                    {getPlayerFullName(player)}
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>{player.team}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '2px 8px',
                      background: player.level === 'AAA' ? 'rgba(76,175,80,0.2)' : player.level === 'AA' ? 'rgba(33,150,243,0.2)' : 'rgba(158,158,158,0.2)',
                      color: player.level === 'AAA' ? '#4caf50' : player.level === 'AA' ? '#2196f3' : 'var(--muted)',
                      borderRadius: 4,
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      fontWeight: 600,
                    }}>{player.level}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>{player.position}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: 'var(--text-bright)' }}>{player.avgEV}</span>
                      <ChangeIndicator value={(Math.random() - 0.3) * 3} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{player.maxEV}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <Sparkline data={generateTrend(player.avgEV, 3)} width={50} height={18} showEndDot />
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>
                    {new Date(wp.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text)', maxWidth: 200 }}>
                    {wp.notes}
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
