import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { players, getPlayerFullName } from '../../data/players'
import Sparkline from '../../components/Sparkline'
import ChangeIndicator from '../../components/ChangeIndicator'
import { smartAlerts, alertColors, alertIcons, type SmartAlert } from '../../data/alerts'

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
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const visibleAlerts = smartAlerts.filter(a => !dismissedAlerts.has(a.id))

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => new Set(prev).add(id))
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--panel)',
    border: '1px solid var(--orange-border)',
    borderRadius: 10,
    padding: 24,
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

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div className="anim-fade-in" style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 24,
          color: 'var(--text-bright)',
          marginBottom: 4,
        }}>Scout Dashboard</h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--muted)',
        }}>Your upcoming visits and player development updates</p>
      </div>

      {/* Smart Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="anim-slide-up anim-delay-1" style={{ marginBottom: 28 }}>
          <div style={secTitle}>Smart Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visibleAlerts.slice(0, 5).map(alert => {
              const colors = alertColors[alert.type]
              return (
                <div
                  key={alert.id}
                  style={{
                    ...cardStyle,
                    padding: '16px 20px',
                    borderLeft: `4px solid ${colors.border}`,
                    background: colors.bg,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onClick={() => navigate(`/player/${alert.playerId}/dashboard`)}
                  onMouseEnter={e => { e.currentTarget.style.borderLeftColor = colors.border; e.currentTarget.style.transform = 'translateX(2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)' }}
                >
                  {/* Type icon */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: `${colors.border}22`, border: `1px solid ${colors.border}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: colors.icon, flexShrink: 0, marginTop: 2,
                  }}>
                    {alertIcons[alert.type]}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text-bright)' }}>
                        {alert.title}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>
                        {alert.timestamp}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)', lineHeight: 1.55 }}>
                      {alert.message}
                    </div>
                    {alert.metric && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        marginTop: 8, padding: '4px 10px',
                        background: 'var(--surface-tint-2)', borderRadius: 5,
                      }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{alert.metric.label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-bright)' }}>{alert.metric.value}</span>
                        {alert.metric.change && (
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                            color: alert.metric.change.startsWith('-') ? 'var(--color-negative)' : 'var(--color-positive)',
                          }}>
                            {alert.metric.change.startsWith('-') ? '' : '+'}{alert.metric.change}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={e => { e.stopPropagation(); dismissAlert(alert.id) }}
                    style={{
                      background: 'transparent', border: 'none', color: 'var(--muted)',
                      fontSize: 18, cursor: 'pointer', padding: '0 4px', lineHeight: 1,
                      opacity: 0.5, transition: 'opacity 0.15s', flexShrink: 0,
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
                  >
                    &times;
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="anim-slide-up anim-delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
        {[
          { label: 'Active Prospects', value: '12', sub: 'In your territory' },
          { label: 'Upcoming Visits', value: '3', sub: 'This week' },
          { label: 'Hot Prospects', value: '4', sub: 'Trending up' },
          { label: 'Last Report', value: '2d ago', sub: 'Reno Castillo' },
        ].map((stat, i) => (
          <div key={i} style={{ ...cardStyle, padding: 18 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Visits */}
      <div style={secTitle}>Upcoming Visits This Week</div>
      <div className="anim-slide-up anim-delay-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, marginBottom: 36 }}>
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
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                    {player.position} • {player.team} • {player.level}
                  </div>
                </div>
                <div style={{
                  background: 'var(--accent)',
                  color: '#000',
                  padding: '5px 10px',
                  borderRadius: 5,
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}>
                  {new Date(visit.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Since Last Visit */}
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                Since Last Visit ({new Date(visit.lastVisitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>Avg EV</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text-bright)' }}>{player.avgEV}</span>
                    <ChangeIndicator value={evChange} suffix=" mph" />
                  </div>
                  <Sparkline data={generateTrend(player.avgEV, 3)} width={60} height={20} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>Max EV</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text-bright)' }}>{player.maxEV}</span>
                    <ChangeIndicator value={maxEvChange} suffix=" mph" />
                  </div>
                  <Sparkline data={generateTrend(player.maxEV, 4)} width={60} height={20} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>Bat Speed</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text-bright)' }}>{player.avgBS}</span>
                    <ChangeIndicator value={bsChange} suffix=" mph" />
                  </div>
                  <Sparkline data={generateTrend(player.avgBS, 2)} width={60} height={20} />
                </div>
              </div>

              {/* Development Arc */}
              <div style={{
                background: 'var(--accent-bg-subtle)',
                border: '1px solid var(--accent-border-subtle)',
                borderRadius: 6,
                padding: 12,
                marginBottom: 12,
              }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>Development Arc</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)', lineHeight: 1.55 }}>
                  {visit.developmentArc}
                </div>
              </div>

              {/* Mechanical Shifts */}
              {visit.mechanicalShifts.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Mechanical Shifts</div>
                  {visit.mechanicalShifts.map((shift, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                      <span style={{ color: 'var(--accent)', fontSize: 11 }}>•</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>{shift}</span>
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
      <div className="anim-slide-up anim-delay-4" style={{ ...cardStyle, padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--orange-border)' }}>
              {['Player', 'Team', 'Level', 'Position', 'Avg EV', 'Max EV', 'Trend', 'Last Seen'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '1.2px',
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
                  borderBottom: i < 9 ? '1px solid var(--surface-tint-2)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onClick={() => navigate(`/player/${player.id}/dashboard`)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-bg-subtle)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-bright)' }}>
                  {getPlayerFullName(player)}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)' }}>{player.team}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 10px',
                    background: player.level === 'AAA' ? 'var(--color-positive-bg)' : player.level === 'AA' ? 'var(--color-info-bg)' : 'rgba(158,158,158,0.2)',
                    color: player.level === 'AAA' ? 'var(--color-positive)' : player.level === 'AA' ? 'var(--color-info)' : 'var(--muted)',
                    borderRadius: 5,
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    fontWeight: 600,
                  }}>{player.level}</span>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)' }}>{player.position}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: 'var(--text-bright)' }}>{player.avgEV}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{player.maxEV}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Sparkline data={generateTrend(player.avgEV, 3)} width={60} height={16} showEndDot />
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>{player.lastSession}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
