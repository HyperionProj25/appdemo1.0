import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { players, getPlayerFullName } from '../../data/players'

// Mock opposing teams data
const opposingTeams = [
  { id: 'norfolk', name: 'Norfolk Tides', abbrev: 'NOR', record: '45-38' },
  { id: 'jacksonville', name: 'Jacksonville Jumbo Shrimp', abbrev: 'JAX', record: '42-41' },
  { id: 'nashville', name: 'Nashville Sounds', abbrev: 'NAS', record: '48-35' },
  { id: 'memphis', name: 'Memphis Redbirds', abbrev: 'MEM', record: '39-44' },
]

const opposingPitchers: Record<string, Array<{
  id: string
  name: string
  throws: 'L' | 'R'
  era: number
  whip: number
  k9: number
  avgFB: number
  pitchMix: { FB: number; SL: number; CH: number; CB: number }
}>> = {
  norfolk: [
    { id: 'p1', name: 'Marcus Webb', throws: 'R', era: 3.45, whip: 1.21, k9: 9.2, avgFB: 94, pitchMix: { FB: 55, SL: 25, CH: 12, CB: 8 } },
    { id: 'p2', name: 'Tyler Johnson', throws: 'L', era: 4.12, whip: 1.35, k9: 8.1, avgFB: 91, pitchMix: { FB: 48, SL: 20, CH: 22, CB: 10 } },
    { id: 'p3', name: 'Kyle Anderson', throws: 'R', era: 3.89, whip: 1.28, k9: 7.8, avgFB: 93, pitchMix: { FB: 60, SL: 18, CH: 15, CB: 7 } },
  ],
  jacksonville: [
    { id: 'p4', name: 'Jordan Mitchell', throws: 'R', era: 3.21, whip: 1.15, k9: 10.1, avgFB: 96, pitchMix: { FB: 52, SL: 28, CH: 10, CB: 10 } },
    { id: 'p5', name: 'Chris Parker', throws: 'L', era: 4.56, whip: 1.42, k9: 7.5, avgFB: 89, pitchMix: { FB: 45, SL: 22, CH: 25, CB: 8 } },
  ],
  nashville: [
    { id: 'p6', name: 'Derek Williams', throws: 'R', era: 2.98, whip: 1.08, k9: 11.2, avgFB: 97, pitchMix: { FB: 58, SL: 22, CH: 12, CB: 8 } },
    { id: 'p7', name: 'Brian Thompson', throws: 'R', era: 3.67, whip: 1.25, k9: 8.9, avgFB: 94, pitchMix: { FB: 50, SL: 30, CH: 8, CB: 12 } },
  ],
  memphis: [
    { id: 'p8', name: 'Ryan Garcia', throws: 'L', era: 3.34, whip: 1.18, k9: 9.5, avgFB: 92, pitchMix: { FB: 42, SL: 25, CH: 28, CB: 5 } },
    { id: 'p9', name: 'Matt Davis', throws: 'R', era: 4.01, whip: 1.31, k9: 8.2, avgFB: 93, pitchMix: { FB: 55, SL: 20, CH: 15, CB: 10 } },
  ],
}

// Mock hitter performance data
const getHitterPerformance = (playerId: string) => ({
  vsFB: { avg: Math.round((0.250 + Math.random() * 0.1) * 1000) / 1000, slg: Math.round((0.400 + Math.random() * 0.15) * 1000) / 1000, whiff: Math.round((18 + Math.random() * 10) * 10) / 10 },
  vsSL: { avg: Math.round((0.200 + Math.random() * 0.08) * 1000) / 1000, slg: Math.round((0.320 + Math.random() * 0.12) * 1000) / 1000, whiff: Math.round((25 + Math.random() * 12) * 10) / 10 },
  vsCH: { avg: Math.round((0.220 + Math.random() * 0.09) * 1000) / 1000, slg: Math.round((0.360 + Math.random() * 0.13) * 1000) / 1000, whiff: Math.round((22 + Math.random() * 11) * 10) / 10 },
  vsCB: { avg: Math.round((0.180 + Math.random() * 0.07) * 1000) / 1000, slg: Math.round((0.280 + Math.random() * 0.1) * 1000) / 1000, whiff: Math.round((28 + Math.random() * 14) * 10) / 10 },
  vsLHP: { avg: Math.round((0.240 + Math.random() * 0.08) * 1000) / 1000, slg: Math.round((0.380 + Math.random() * 0.12) * 1000) / 1000 },
  vsRHP: { avg: Math.round((0.260 + Math.random() * 0.09) * 1000) / 1000, slg: Math.round((0.420 + Math.random() * 0.14) * 1000) / 1000 },
})

export default function CoachMatchupPrep() {
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
          Matchup Preparation
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)' }}>
          Select an opponent and starting pitcher to analyze your lineup matchups
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* Left: Team/Pitcher Selection */}
        <div>
          <div style={secTitle}>Step 1: Select Opponent</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {opposingTeams.map(team => (
              <button
                key={team.id}
                onClick={() => { setSelectedTeam(team.id); setSelectedPitcher(null) }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: selectedTeam === team.id ? 'rgba(224,172,68,0.1)' : 'var(--panel)',
                  border: `1px solid ${selectedTeam === team.id ? 'var(--accent)' : 'var(--orange-border)'}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-bright)' }}>
                    {team.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)' }}>
                    {team.record}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: selectedTeam === team.id ? 'var(--accent)' : 'var(--muted)',
                }}>
                  {team.abbrev}
                </span>
              </button>
            ))}
          </div>

          {selectedTeam && (
            <>
              <div style={secTitle}>Step 2: Select Pitcher</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {opposingPitchers[selectedTeam]?.map(pitcher => (
                  <button
                    key={pitcher.id}
                    onClick={() => setSelectedPitcher(pitcher.id)}
                    style={{
                      padding: '14px 16px',
                      background: selectedPitcher === pitcher.id ? 'rgba(224,172,68,0.1)' : 'var(--panel)',
                      border: `1px solid ${selectedPitcher === pitcher.id ? 'var(--accent)' : 'var(--orange-border)'}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--text-bright)' }}>
                        {pitcher.name}
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>
                        {pitcher.throws}HP • {pitcher.avgFB} mph
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text)' }}>
                        ERA <strong style={{ color: 'var(--accent)' }}>{pitcher.era.toFixed(2)}</strong>
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text)' }}>
                        WHIP <strong>{pitcher.whip.toFixed(2)}</strong>
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text)' }}>
                        K/9 <strong>{pitcher.k9.toFixed(1)}</strong>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Matchup Analysis */}
        <div>
          {!selectedPitcherData ? (
            <div style={{
              ...cardStyle,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 400,
              textAlign: 'center',
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" style={{ marginBottom: 16 }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, color: 'var(--text)', marginBottom: 8 }}>
                Select a pitcher to analyze matchups
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
                Choose an opposing team and starting pitcher from the left panel
              </div>
            </div>
          ) : (
            <>
              {/* Pitcher Profile */}
              <div style={{ ...cardStyle, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text-bright)' }}>
                      {selectedPitcherData.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                      {opposingTeams.find(t => t.id === selectedTeam)?.name} • {selectedPitcherData.throws}HP
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>{selectedPitcherData.era.toFixed(2)}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>ERA</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--text-bright)' }}>{selectedPitcherData.avgFB}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>Avg FB</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--text-bright)' }}>{selectedPitcherData.k9.toFixed(1)}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>K/9</div>
                    </div>
                  </div>
                </div>

                {/* Pitch Mix */}
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Pitch Arsenal
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {Object.entries(selectedPitcherData.pitchMix).map(([pitch, pct]) => (
                    <div key={pitch} style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text)' }}>
                          {pitch === 'FB' ? 'Fastball' : pitch === 'SL' ? 'Slider' : pitch === 'CH' ? 'Changeup' : 'Curveball'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>{pct}%</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hitter Matchups Table */}
              <div style={secTitle}>Your Lineup vs {selectedPitcherData.name}</div>
              <div style={{ ...cardStyle, padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--orange-border)' }}>
                      {['Hitter', 'vs ' + selectedPitcherData.throws + 'HP', 'vs FB', 'vs SL', 'vs CH', 'vs CB', 'Whiff%', 'Advantage'].map(h => (
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
                    {teamRoster.slice(0, 9).map((player, i) => {
                      const perf = getHitterPerformance(player.id)
                      const vsHand = selectedPitcherData.throws === 'L' ? perf.vsLHP : perf.vsRHP
                      const pitchAvgs = [perf.vsFB.avg, perf.vsSL.avg, perf.vsCH.avg, perf.vsCB.avg]
                      const bestIdx = pitchAvgs.indexOf(Math.max(...pitchAvgs))
                      const bestPitch = ['FB', 'SL', 'CH', 'CB'][bestIdx]
                      const avgWhiff = (perf.vsFB.whiff + perf.vsSL.whiff + perf.vsCH.whiff + perf.vsCB.whiff) / 4

                      return (
                        <tr
                          key={player.id}
                          style={{ borderBottom: i < 8 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer' }}
                          onClick={() => navigate(`/player/${player.id}/dashboard`)}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,172,68,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-bright)' }}>
                              {getPlayerFullName(player)}
                            </div>
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)' }}>
                              {player.position} • {player.bats}HB
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: 'var(--text-bright)' }}>
                            .{(vsHand.avg * 1000).toFixed(0).padStart(3, '0')}
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 12, color: bestPitch === 'FB' ? 'var(--accent)' : 'var(--text)', fontWeight: bestPitch === 'FB' ? 600 : 400 }}>
                            .{(perf.vsFB.avg * 1000).toFixed(0).padStart(3, '0')}
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 12, color: bestPitch === 'SL' ? 'var(--accent)' : 'var(--text)', fontWeight: bestPitch === 'SL' ? 600 : 400 }}>
                            .{(perf.vsSL.avg * 1000).toFixed(0).padStart(3, '0')}
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 12, color: bestPitch === 'CH' ? 'var(--accent)' : 'var(--text)', fontWeight: bestPitch === 'CH' ? 600 : 400 }}>
                            .{(perf.vsCH.avg * 1000).toFixed(0).padStart(3, '0')}
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 12, color: bestPitch === 'CB' ? 'var(--accent)' : 'var(--text)', fontWeight: bestPitch === 'CB' ? 600 : 400 }}>
                            .{(perf.vsCB.avg * 1000).toFixed(0).padStart(3, '0')}
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 12, color: avgWhiff > 25 ? '#e53935' : 'var(--text)' }}>
                            {avgWhiff.toFixed(1)}%
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              padding: '4px 10px',
                              background: 'rgba(76,175,80,0.15)',
                              color: '#4caf50',
                              borderRadius: 4,
                              fontFamily: 'var(--font-body)',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              {bestPitch}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div style={{ marginTop: 20, padding: 16, background: 'rgba(224,172,68,0.05)', border: '1px solid rgba(224,172,68,0.2)', borderRadius: 6 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '2px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Matchup Summary
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
                  {selectedPitcherData.name} is a {selectedPitcherData.throws === 'R' ? 'right' : 'left'}-handed pitcher who relies heavily on his fastball ({selectedPitcherData.pitchMix.FB}% usage).
                  Your lineup has {teamRoster.filter(p => p.bats === (selectedPitcherData.throws === 'R' ? 'L' : 'R')).length} opposite-handed hitters who may have the platoon advantage.
                  Focus on attacking early in counts to avoid his {selectedPitcherData.k9 > 9 ? 'high strikeout' : 'moderate'} stuff.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
