import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { players, getPlayerFullName } from '../../data/players'
import Sparkline from '../../components/Sparkline'
import ChangeIndicator from '../../components/ChangeIndicator'

// Mock opposing teams data
const opposingTeams = [
  { id: 'norfolk', name: 'Norfolk Tides', abbrev: 'NOR' },
  { id: 'jacksonville', name: 'Jacksonville Jumbo Shrimp', abbrev: 'JAX' },
  { id: 'nashville', name: 'Nashville Sounds', abbrev: 'NAS' },
  { id: 'memphis', name: 'Memphis Redbirds', abbrev: 'MEM' },
]

const opposingPitchers: Record<string, Array<{
  id: string
  name: string
  throws: 'L' | 'R'
  era: number
  pitchMix: { FB: number; SL: number; CH: number; CB: number }
}>> = {
  norfolk: [
    { id: 'p1', name: 'Marcus Webb', throws: 'R', era: 3.45, pitchMix: { FB: 55, SL: 25, CH: 12, CB: 8 } },
    { id: 'p2', name: 'Tyler Johnson', throws: 'L', era: 4.12, pitchMix: { FB: 48, SL: 20, CH: 22, CB: 10 } },
    { id: 'p3', name: 'Kyle Anderson', throws: 'R', era: 3.89, pitchMix: { FB: 60, SL: 18, CH: 15, CB: 7 } },
  ],
  jacksonville: [
    { id: 'p4', name: 'Jordan Mitchell', throws: 'R', era: 3.21, pitchMix: { FB: 52, SL: 28, CH: 10, CB: 10 } },
    { id: 'p5', name: 'Chris Parker', throws: 'L', era: 4.56, pitchMix: { FB: 45, SL: 22, CH: 25, CB: 8 } },
  ],
  nashville: [
    { id: 'p6', name: 'Derek Williams', throws: 'R', era: 2.98, pitchMix: { FB: 58, SL: 22, CH: 12, CB: 8 } },
    { id: 'p7', name: 'Brian Thompson', throws: 'R', era: 3.67, pitchMix: { FB: 50, SL: 30, CH: 8, CB: 12 } },
  ],
  memphis: [
    { id: 'p8', name: 'Ryan Garcia', throws: 'L', era: 3.34, pitchMix: { FB: 42, SL: 25, CH: 28, CB: 5 } },
    { id: 'p9', name: 'Matt Davis', throws: 'R', era: 4.01, pitchMix: { FB: 55, SL: 20, CH: 15, CB: 10 } },
  ],
}

// Mock hitter vs pitch type data
const getHitterVsPitch = (playerId: string) => ({
  vsFB: { avg: 0.280 + Math.random() * 0.1, slg: 0.420 + Math.random() * 0.15 },
  vsSL: { avg: 0.220 + Math.random() * 0.08, slg: 0.350 + Math.random() * 0.12 },
  vsCH: { avg: 0.240 + Math.random() * 0.09, slg: 0.380 + Math.random() * 0.13 },
  vsCB: { avg: 0.200 + Math.random() * 0.07, slg: 0.300 + Math.random() * 0.1 },
})

// Generate trend data
const generateTrend = (base: number, variance: number): number[] => {
  const result: number[] = []
  let current = base - variance
  for (let i = 0; i < 8; i++) {
    current += (Math.random() - 0.3) * variance * 0.5
    result.push(Math.round(current * 10) / 10)
  }
  return result
}

export default function CoachDashboard() {
  const navigate = useNavigate()
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [selectedPitcher, setSelectedPitcher] = useState<string | null>(null)

  const teamRoster = players.filter(p => p.team === 'Durham Bulls' && p.sport === 'Baseball')
  const selectedPitcherData = selectedTeam && selectedPitcher
    ? opposingPitchers[selectedTeam]?.find(p => p.id === selectedPitcher)
    : null

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
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--text-bright)', marginBottom: 4 }}>
          Hitting Coach Dashboard
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)' }}>
          Durham Bulls • AAA Affiliate
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Roster Size', value: teamRoster.length.toString(), sub: 'Active hitters' },
          { label: 'Team Avg EV', value: '85.2', sub: '+2.1 vs last month' },
          { label: 'Team Max EV', value: '107', sub: 'Chris Clark' },
          { label: 'Avg Bat Speed', value: '54.8', sub: 'mph' },
          { label: 'Hard Hit %', value: '42.3%', sub: '+3.5% MoM' },
        ].map((stat, i) => (
          <div key={i} style={{ ...cardStyle, padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>{stat.value}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: Matchup Prep */}
        <div>
          <div style={secTitle}>Matchup Prep</div>
          <div style={cardStyle}>
            {/* Team Selection */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Select Opposing Team
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {opposingTeams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => { setSelectedTeam(team.id); setSelectedPitcher(null) }}
                    style={{
                      padding: '8px 16px',
                      background: selectedTeam === team.id ? 'var(--accent)' : 'transparent',
                      border: `1px solid ${selectedTeam === team.id ? 'var(--accent)' : 'var(--muted)'}`,
                      borderRadius: 4,
                      color: selectedTeam === team.id ? '#000' : 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {team.abbrev}
                  </button>
                ))}
              </div>
            </div>

            {/* Pitcher Selection */}
            {selectedTeam && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                  Select Starting Pitcher
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {opposingPitchers[selectedTeam]?.map(pitcher => (
                    <button
                      key={pitcher.id}
                      onClick={() => setSelectedPitcher(pitcher.id)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: selectedPitcher === pitcher.id ? 'rgba(224,172,68,0.1)' : 'transparent',
                        border: `1px solid ${selectedPitcher === pitcher.id ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 6,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-bright)' }}>
                          {pitcher.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)' }}>
                          {pitcher.throws}HP • {pitcher.era.toFixed(2)} ERA
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {Object.entries(pitcher.pitchMix).map(([pitch, pct]) => (
                          <span key={pitch} style={{
                            padding: '2px 6px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 3,
                            fontFamily: 'var(--font-body)',
                            fontSize: 9,
                            color: 'var(--muted)',
                          }}>
                            {pitch} {pct}%
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pitch Mix Visualization */}
            {selectedPitcherData && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                  {selectedPitcherData.name}'s Pitch Mix
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {Object.entries(selectedPitcherData.pitchMix).map(([pitch, pct]) => (
                    <div key={pitch} style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>{pct}%</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text)' }}>
                        {pitch === 'FB' ? 'Fastball' : pitch === 'SL' ? 'Slider' : pitch === 'CH' ? 'Changeup' : 'Curveball'}
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 6 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hitter vs Pitch Type Table */}
          {selectedPitcherData && (
            <div style={{ marginTop: 20 }}>
              <div style={secTitle}>Your Hitters vs {selectedPitcherData.name}</div>
              <div style={{ ...cardStyle, padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--orange-border)' }}>
                      {['Hitter', 'vs FB', 'vs SL', 'vs CH', 'vs CB', 'Advantage'].map(h => (
                        <th key={h} style={{
                          padding: '10px 12px',
                          fontFamily: 'var(--font-body)',
                          fontSize: 9,
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
                    {teamRoster.slice(0, 8).map((player, i) => {
                      const stats = getHitterVsPitch(player.id)
                      const bestPitch = Object.entries(stats).sort((a, b) => b[1].avg - a[1].avg)[0]
                      return (
                        <tr key={player.id} style={{ borderBottom: i < 7 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-bright)' }}>
                            {getPlayerFullName(player)}
                          </td>
                          {['vsFB', 'vsSL', 'vsCH', 'vsCB'].map(key => {
                            const val = stats[key as keyof typeof stats]
                            const isBest = key === bestPitch[0]
                            return (
                              <td key={key} style={{
                                padding: '10px 12px',
                                fontFamily: 'var(--font-body)',
                                fontSize: 12,
                                color: isBest ? 'var(--accent)' : 'var(--text)',
                                fontWeight: isBest ? 600 : 400,
                              }}>
                                .{Math.round(val.avg * 1000).toString().padStart(3, '0')}
                              </td>
                            )
                          })}
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{
                              padding: '3px 8px',
                              background: 'rgba(76,175,80,0.15)',
                              color: '#4caf50',
                              borderRadius: 4,
                              fontFamily: 'var(--font-body)',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              {bestPitch[0].replace('vs', '')}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Roster Overview */}
        <div>
          <div style={secTitle}>Roster Trends</div>
          <div style={{ ...cardStyle, padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--orange-border)' }}>
                  {['Player', 'Pos', 'Avg EV', 'Trend', 'Max EV', 'BS', 'Status'].map(h => (
                    <th key={h} style={{
                      padding: '10px 12px',
                      fontFamily: 'var(--font-body)',
                      fontSize: 9,
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
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-bright)' }}>
                        {getPlayerFullName(player)}
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>{player.position}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: 'var(--text-bright)' }}>{player.avgEV}</span>
                          <ChangeIndicator value={evChange} />
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <Sparkline data={generateTrend(player.avgEV, 3)} width={50} height={18} showEndDot />
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{player.maxEV}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>{player.avgBS}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          padding: '3px 8px',
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
      </div>
    </div>
  )
}
