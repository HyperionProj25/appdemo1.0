import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { players, getPlayerFullName } from '../../data/players'
import Sparkline from '../../components/Sparkline'

const levels = ['A', 'A+', 'AA', 'AAA'] as const
type Level = typeof levels[number]

const positions = ['All', 'SS', 'CF', 'RF', 'LF', '1B', '2B', '3B', 'C', 'DH'] as const

const promotionThresholds: Record<Level, { avgEV: number; maxEV: number }> = {
  AAA: { avgEV: 90, maxEV: 104 },
  AA:  { avgEV: 85, maxEV: 99 },
  'A+': { avgEV: 80, maxEV: 94 },
  A:   { avgEV: 78, maxEV: 92 },
}

const levelHeaderColors: Record<Level, string> = {
  A:    'rgba(255,255,255,0.03)',
  'A+': 'rgba(66,133,244,0.06)',
  AA:   'rgba(66,133,244,0.06)',
  AAA:  'rgba(76,175,80,0.06)',
}

const generateTrend = (base: number, variance: number): number[] => {
  const r: number[] = []
  let c = base - variance
  for (let i = 0; i < 8; i++) {
    c += (Math.random() - 0.3) * variance * 0.5
    r.push(Math.round(c * 10) / 10)
  }
  return r
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

function isPromotionReady(player: { avgEV: number; maxEV: number; level: string }): boolean {
  const threshold = promotionThresholds[player.level as Level]
  if (!threshold) return false
  return player.avgEV >= threshold.avgEV && player.maxEV >= threshold.maxEV
}

export default function ScoutPipeline() {
  const navigate = useNavigate()
  const [activePosition, setActivePosition] = useState<string>('All')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const baseballPlayers = players.filter(p => p.sport === 'Baseball')

  const filteredPlayers = activePosition === 'All'
    ? baseballPlayers
    : baseballPlayers.filter(p => p.position === activePosition)

  const getPlayersForLevel = (level: Level) =>
    filteredPlayers
      .filter(p => p.level === level)
      .sort((a, b) => b.avgEV - a.avgEV)

  const getAvgEVForLevel = (levelPlayers: typeof baseballPlayers) => {
    if (levelPlayers.length === 0) return 0
    return Math.round((levelPlayers.reduce((sum, p) => sum + p.avgEV, 0) / levelPlayers.length) * 10) / 10
  }

  const getTopProspect = (levelPlayers: typeof baseballPlayers) => {
    if (levelPlayers.length === 0) return null
    return levelPlayers.reduce((top, p) => (p.avgEV > top.avgEV ? p : top), levelPlayers[0])
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px' }}>
      {/* Header */}
      <div className="anim-fade-in" style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--text-bright)',
            margin: 0,
            marginBottom: 6,
          }}
        >
          Organizational Pipeline
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--muted)',
            margin: 0,
          }}
        >
          Prospect development across all levels
        </p>
      </div>

      {/* Position Filter Bar */}
      <div className="anim-slide-up anim-delay-1" style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {positions.map(pos => {
          const isActive = activePosition === pos
          return (
            <button
              key={pos}
              onClick={() => setActivePosition(pos)}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.5px',
                padding: '7px 16px',
                borderRadius: 20,
                border: isActive ? '1px solid var(--accent)' : '1px solid var(--muted)',
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#000' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {pos}
            </button>
          )
        })}
      </div>

      {/* Pipeline Grid */}
      <div
        className="anim-slide-up anim-delay-2"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          alignItems: 'flex-start',
        }}
      >
        {levels.map(level => {
          const levelPlayers = getPlayersForLevel(level)
          const avgEV = getAvgEVForLevel(levelPlayers)
          const topProspect = getTopProspect(levelPlayers)

          return (
            <div key={level}>
              {/* Column Header Card */}
              <div
                style={{
                  ...cardStyle,
                  background: levelHeaderColors[level],
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--text-bright)',
                    marginBottom: 12,
                  }}
                >
                  {level}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--muted)',
                    }}
                  >
                    Players
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text-bright)',
                    }}
                  >
                    {levelPlayers.length}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--muted)',
                    }}
                  >
                    Avg EV
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--accent)',
                    }}
                  >
                    {avgEV > 0 ? `${avgEV} mph` : '—'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--muted)',
                    }}
                  >
                    Top Prospect
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-bright)',
                    }}
                  >
                    {topProspect ? getPlayerFullName(topProspect) : '—'}
                  </span>
                </div>
              </div>

              {/* Section Title */}
              <div style={secTitle}>
                {level} Roster
              </div>

              {/* Player Cards */}
              {levelPlayers.map(p => {
                const isHovered = hoveredCard === p.id
                const promotionReady = isPromotionReady(p)
                const borderOpacity = Math.min(1, Math.max(0.2, (p.avgEV - 70) / 30))

                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/player/${p.id}/dashboard`)}
                    onMouseEnter={() => setHoveredCard(p.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      ...cardStyle,
                      padding: 16,
                      marginBottom: 12,
                      cursor: 'pointer',
                      borderColor: isHovered
                        ? 'var(--accent)'
                        : `rgba(224,172,68,${borderOpacity})`,
                      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                      transition: 'all 0.2s ease',
                      boxShadow: isHovered
                        ? `inset 0 1px 0 var(--accent-bg-medium), 0 4px 12px rgba(0,0,0,0.3)`
                        : 'inset 0 1px 0 var(--accent-bg-medium)',
                    }}
                  >
                    {/* Player Name, Position, Age */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 10,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 14,
                          fontWeight: 700,
                          color: 'var(--text-bright)',
                        }}
                      >
                        {getPlayerFullName(p)}
                      </span>
                      <span
                        style={{
                          background: 'rgba(224,172,68,0.12)',
                          color: 'var(--accent)',
                          padding: '2px 7px',
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {p.position}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 11,
                          color: 'var(--muted)',
                        }}
                      >
                        Age {p.age}
                      </span>
                      {promotionReady && (
                        <span
                          style={{
                            background: 'var(--color-positive-bg)',
                            color: 'var(--color-positive)',
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.8px',
                            textTransform: 'uppercase',
                          }}
                        >
                          Promotion Ready
                        </span>
                      )}
                    </div>

                    {/* Compact Metrics Row */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 16,
                        marginBottom: 10,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 10,
                            color: 'var(--muted)',
                            marginBottom: 2,
                          }}
                        >
                          Avg EV
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--text-bright)',
                          }}
                        >
                          {p.avgEV}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 10,
                            color: 'var(--muted)',
                            marginBottom: 2,
                          }}
                        >
                          Max EV
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--text-bright)',
                          }}
                        >
                          {p.maxEV}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 10,
                            color: 'var(--muted)',
                            marginBottom: 2,
                          }}
                        >
                          Bat Speed
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--text-bright)',
                          }}
                        >
                          {p.avgBS}
                        </div>
                      </div>
                    </div>

                    {/* Mini Sparkline */}
                    <Sparkline
                      data={generateTrend(p.avgEV, 3)}
                      width={120}
                      height={24}
                      showEndDot
                    />
                  </div>
                )
              })}

              {/* Empty state */}
              {levelPlayers.length === 0 && (
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--muted)',
                    textAlign: 'center',
                    padding: '24px 0',
                  }}
                >
                  No players at this level
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
