import { useNavigate } from 'react-router-dom'
import { players, getPlayerFullName } from '../../data/players'
import Sparkline from '../../components/Sparkline'
import ChangeIndicator from '../../components/ChangeIndicator'

// Mock agent client data
const agentClients = [
  {
    playerId: '3000014',
    contractValue: 850000,
    yearsRemaining: 2,
    serviceTime: '2.145',
    arbStatus: 'Pre-Arb Year 3',
    talkingPoints: [
      'Exit velocity improved 4.2 mph year-over-year, now top 15% in system',
      'Barrel rate increased from 8.2% to 14.1% - elite improvement trajectory',
      'Consistent performer: Zero stretches of 10+ games below .250 AVG',
    ],
    seasonGrowth: { avgEV: 3.8, maxEV: 5.2, barrelPct: 5.9 },
  },
  {
    playerId: '3000021',
    contractValue: 720000,
    yearsRemaining: 1,
    serviceTime: '3.089',
    arbStatus: 'Arb 1 Eligible',
    talkingPoints: [
      'Power surge in second half: 18 HR vs 9 HR in first half',
      'Bat speed improvement of 2.3 mph translating to harder contact',
      'Defensive metrics stable - no regression in value',
    ],
    seasonGrowth: { avgEV: 2.1, maxEV: 3.5, barrelPct: 3.2 },
  },
  {
    playerId: '3000030',
    contractValue: 1200000,
    yearsRemaining: 1,
    serviceTime: '4.156',
    arbStatus: 'Arb 2 Eligible',
    talkingPoints: [
      'Career-best exit velocity marks across all pitch types',
      'Reduced strikeout rate by 4.2% while maintaining power',
      'Consistent hard-hit rate improvement over 3 consecutive seasons',
    ],
    seasonGrowth: { avgEV: 4.5, maxEV: 6.1, barrelPct: 7.3 },
  },
]

// Generate trend data
const generateTrend = (base: number, variance: number, points: number = 8): number[] => {
  const result: number[] = []
  let current = base - variance * 1.5
  for (let i = 0; i < points; i++) {
    current += (Math.random() * 0.5 + 0.2) * variance * 0.4
    result.push(Math.round(current * 10) / 10)
  }
  return result
}

const formatCurrency = (val: number) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  return `$${(val / 1000).toFixed(0)}K`
}

export default function AgentDashboard() {
  const navigate = useNavigate()

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
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--text-bright)', marginBottom: 4 }}>
          Agent Dashboard
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--muted)' }}>
          Client development tracking and contract preparation
        </p>
      </div>

      {/* Quick Stats */}
      <div className="anim-slide-up anim-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Active Clients', value: agentClients.length.toString(), sub: 'In MiLB system' },
          { label: 'Total Value', value: '$2.77M', sub: 'Combined contracts' },
          { label: 'Arb Eligible', value: '2', sub: 'This offseason' },
          { label: 'Avg Growth', value: '+3.5%', sub: 'YoY improvement' },
        ].map((stat, i) => (
          <div key={i} style={{ ...cardStyle, padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>{stat.value}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Client Cards */}
      <div style={secTitle}>Client Development Resumes</div>
      <div className="anim-slide-up anim-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {agentClients.map((client) => {
          const player = players.find(p => p.id === client.playerId)
          if (!player) return null

          return (
            <div key={client.playerId} style={cardStyle}>
              <div style={{ display: 'flex', gap: 24 }}>
                {/* Left: Player Info */}
                <div style={{ width: 280 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text-bright)' }}>
                        {getPlayerFullName(player)}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                        {player.position} • {player.team} • {player.level}
                      </div>
                    </div>
                  </div>

                  {/* Contract Info */}
                  <div style={{ background: 'var(--accent-bg-subtle)', border: '1px solid var(--accent-border-subtle)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Current Value</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{formatCurrency(client.contractValue)}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Service Time</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--text-bright)' }}>{client.serviceTime}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--accent-border-subtle)' }}>
                      <span style={{
                        padding: '5px 10px',
                        background: 'var(--color-info-bg)',
                        color: 'var(--color-info)',
                        borderRadius: 6,
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        fontWeight: 600,
                      }}>
                        {client.arbStatus}
                      </span>
                    </div>
                  </div>

                  {/* Growth Metrics */}
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '1px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                    Season-Over-Season Growth
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>Avg EV</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--text-bright)' }}>{player.avgEV}</span>
                        <ChangeIndicator value={client.seasonGrowth.avgEV} size="md" />
                      </div>
                      <Sparkline data={generateTrend(player.avgEV, 4)} width={80} height={20} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>Max EV</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--text-bright)' }}>{player.maxEV}</span>
                        <ChangeIndicator value={client.seasonGrowth.maxEV} size="md" />
                      </div>
                      <Sparkline data={generateTrend(player.maxEV, 5)} width={80} height={20} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>Barrel %</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--text-bright)' }}>14.1</span>
                        <ChangeIndicator value={client.seasonGrowth.barrelPct} size="md" />
                      </div>
                      <Sparkline data={generateTrend(14, 3)} width={80} height={20} />
                    </div>
                  </div>
                </div>

                {/* Right: Talking Points */}
                <div style={{ flex: 1, borderLeft: '1px solid var(--orange-border)', paddingLeft: 24 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>
                    Arbitration Talking Points
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {client.talkingPoints.map((point, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: 'var(--color-positive-bg)', color: 'var(--color-positive)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, flexShrink: 0,
                        }}>
                          {i + 1}
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--surface-tint-2)' }}>
                    <button
                      onClick={() => navigate(`/player/${player.id}/dashboard`)}
                      style={{
                        padding: '12px 20px',
                        background: 'var(--accent)',
                        border: 'none',
                        borderRadius: 6,
                        color: '#000',
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      View Full Profile
                    </button>
                    <button
                      style={{
                        padding: '12px 20px',
                        background: 'transparent',
                        border: '1px solid var(--muted)',
                        borderRadius: 6,
                        color: 'var(--text)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      Export Resume
                    </button>
                    <button
                      style={{
                        padding: '12px 20px',
                        background: 'transparent',
                        border: '1px solid var(--muted)',
                        borderRadius: 6,
                        color: 'var(--text)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Vision Statement */}
      <div className="anim-slide-up anim-delay-3" style={{
        marginTop: 32,
        padding: 24,
        background: 'linear-gradient(135deg, var(--accent-bg-subtle) 0%, var(--accent-bg-subtle) 100%)',
        border: '1px solid rgba(224,172,68,0.2)',
        borderRadius: 10,
      }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '1.5px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>
          The Baseline Advantage
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
          Baseline gives agents something they've never had: a verified development resume for their players.
          By tracking measurable trend shifts across a player's full arc, agents walk into arbitration and
          contract negotiations with fact-supported evidence that their player's growth is real, sustained,
          and worth investing in. No more arbitrary opinions at the point of decision-making—just hard data
          when it matters most.
        </p>
      </div>
    </div>
  )
}
