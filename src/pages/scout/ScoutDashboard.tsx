import { useNavigate } from 'react-router-dom'
import { players, getPlayerFullName } from '../../data/players'
import Sparkline from '../../components/Sparkline'
import ChangeIndicator from '../../components/ChangeIndicator'

// Mock upcoming visits data
const upcomingVisits = [
  {
    playerId: '3000001',
    scheduledDate: '2026-02-12',
    lastVisitDate: '2026-01-15',
    previousMetrics: { avgEV: 86, maxEV: 101, avgBS: 53 },
    developmentArc: 'Marco has shown consistent power gains over the past 3 months. His bat speed improvements are translating to harder contact, with exit velocity trending up 3.5% since November.',
    mechanicalShifts: ['Adjusted load timing - more consistent weight transfer', 'Shortened swing path by 2 inches'],
  },
  {
    playerId: '3000014',
    scheduledDate: '2026-02-14',
    lastVisitDate: '2026-01-08',
    previousMetrics: { avgEV: 88, maxEV: 103, avgBS: 55 },
    developmentArc: 'Ethan continues to be one of the most advanced hitters in the system. His plate discipline has improved significantly, and he\'s making more consistent hard contact.',
    mechanicalShifts: ['Widened stance slightly for better balance', 'Improved hip rotation speed'],
  },
  {
    playerId: '3000021',
    scheduledDate: '2026-02-15',
    lastVisitDate: '2025-12-20',
    previousMetrics: { avgEV: 87, maxEV: 102, avgBS: 54 },
    developmentArc: 'Jordan\'s power numbers have plateaued but his consistency has improved. Focus should be on maintaining mechanics through the season.',
    mechanicalShifts: ['Minor hand position adjustment at setup'],
  },
]

// Mock trend data for sparklines
const generateTrend = (base: number, variance: number, points: number = 8): number[] => {
  const result: number[] = []
  let current = base - variance
  for (let i = 0; i < points; i++) {
    current += (Math.random() - 0.3) * variance * 0.5
    result.push(Math.round(current * 10) / 10)
  }
  return result
}

export default function ScoutDashboard() {
  const navigate = useNavigate()

  const cardStyle: React.CSSProperties = {
    background: 'var(--panel)',
    border: '1px solid var(--orange-border)',
    borderRadius: 8,
    padding: 20,
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
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 24,
          color: 'var(--text-bright)',
          marginBottom: 4,
        }}>Scout Dashboard</h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--muted)',
        }}>Your upcoming visits and player development updates</p>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Active Prospects', value: '12', sub: 'In your territory' },
          { label: 'Upcoming Visits', value: '3', sub: 'This week' },
          { label: 'Hot Prospects', value: '4', sub: 'Trending up' },
          { label: 'Last Report', value: '2d ago', sub: 'Marco Garcia' },
        ].map((stat, i) => (
          <div key={i} style={{ ...cardStyle, padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>{stat.value}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Visits */}
      <div style={secTitle}>Upcoming Visits This Week</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {upcomingVisits.map((visit) => {
          const player = players.find(p => p.id === visit.playerId)
          if (!player) return null

          const evChange = player.avgEV - visit.previousMetrics.avgEV
          const maxEvChange = player.maxEV - visit.previousMetrics.maxEV
          const bsChange = player.avgBS - visit.previousMetrics.avgBS

          return (
            <div
              key={visit.playerId}
              style={{ ...cardStyle, cursor: 'pointer', transition: 'all 0.15s' }}
              onClick={() => navigate(`/player/${player.id}/dashboard`)}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--orange-border)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Player Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text-bright)' }}>
                    {getPlayerFullName(player)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    {player.position} • {player.team} • {player.level}
                  </div>
                </div>
                <div style={{
                  background: 'var(--accent)',
                  color: '#000',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}>
                  {new Date(visit.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Since Last Visit */}
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                Since Last Visit ({new Date(visit.lastVisitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Avg EV</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text-bright)' }}>{player.avgEV}</span>
                    <ChangeIndicator value={evChange} suffix=" mph" />
                  </div>
                  <Sparkline data={generateTrend(player.avgEV, 3)} width={60} height={20} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Max EV</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text-bright)' }}>{player.maxEV}</span>
                    <ChangeIndicator value={maxEvChange} suffix=" mph" />
                  </div>
                  <Sparkline data={generateTrend(player.maxEV, 4)} width={60} height={20} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Bat Speed</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text-bright)' }}>{player.avgBS}</span>
                    <ChangeIndicator value={bsChange} suffix=" mph" />
                  </div>
                  <Sparkline data={generateTrend(player.avgBS, 2)} width={60} height={20} />
                </div>
              </div>

              {/* Development Arc */}
              <div style={{
                background: 'rgba(224,172,68,0.05)',
                border: '1px solid rgba(224,172,68,0.15)',
                borderRadius: 6,
                padding: 12,
                marginBottom: 12,
              }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '1px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 6 }}>Development Arc</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>
                  {visit.developmentArc}
                </div>
              </div>

              {/* Mechanical Shifts */}
              {visit.mechanicalShifts.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '1px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Mechanical Shifts</div>
                  {visit.mechanicalShifts.map((shift, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                      <span style={{ color: 'var(--accent)', fontSize: 10 }}>•</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text)' }}>{shift}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Territory Overview */}
      <div style={secTitle}>Territory Overview</div>
      <div style={{ ...cardStyle, padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--orange-border)' }}>
              {['Player', 'Team', 'Level', 'Position', 'Avg EV', 'Max EV', 'Trend', 'Last Seen'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px',
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
            {players.filter(p => p.sport === 'Baseball').slice(0, 10).map((player, i) => (
              <tr
                key={player.id}
                style={{
                  borderBottom: i < 9 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onClick={() => navigate(`/player/${player.id}/dashboard`)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,172,68,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-bright)' }}>
                  {getPlayerFullName(player)}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>{player.team}</td>
                <td style={{ padding: '12px 16px' }}>
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
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>{player.position}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: 'var(--text-bright)' }}>{player.avgEV}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{player.maxEV}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Sparkline data={generateTrend(player.avgEV, 3)} width={50} height={16} showEndDot />
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>{player.lastSession}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
