import { useNavigate } from 'react-router-dom'
import Sparkline from '../../components/Sparkline'
import { pitchingStaff, getStarters, pitchColors } from '../../data/pitchingStaff'
import { staffToPlayerMap } from '../../data/csvStats'

const generateTrend = (base: number, variance: number): number[] => {
  const result: number[] = []
  let current = base - variance
  for (let i = 0; i < 8; i++) {
    current += (Math.random() - 0.3) * variance * 0.5
    result.push(Math.round(current * 10) / 10)
  }
  return result
}

// Mock recent appearances
const recentAppearances = [
  { pitcher: 'P011', name: 'DeShawn Rivers', date: 'Feb 13', ip: 1.0, k: 3, bb: 0, er: 0, stuffPlus: 134 },
  { pitcher: 'P009', name: 'Silas Park', date: 'Feb 13', ip: 1.1, k: 2, bb: 1, er: 0, stuffPlus: 120 },
  { pitcher: 'P006', name: 'Terrence Holt', date: 'Feb 13', ip: 1.0, k: 2, bb: 1, er: 1, stuffPlus: 122 },
  { pitcher: 'P003', name: 'Emilio Vance', date: 'Feb 12', ip: 7.0, k: 9, bb: 1, er: 2, stuffPlus: 126 },
  { pitcher: 'P012', name: 'Hiroshi Takeda', date: 'Feb 12', ip: 1.0, k: 2, bb: 0, er: 0, stuffPlus: 130 },
  { pitcher: 'P007', name: 'Levi Strand', date: 'Feb 12', ip: 1.2, k: 2, bb: 0, er: 1, stuffPlus: 110 },
  { pitcher: 'P002', name: 'Sora Ishida', date: 'Feb 9', ip: 6.0, k: 7, bb: 2, er: 3, stuffPlus: 108 },
]

export default function PitchingCoachDashboard() {
  const navigate = useNavigate()
  const staff = pitchingStaff
  const starters = getStarters()
  const staffERA = (staff.reduce((s, p) => s + p.era, 0) / staff.length).toFixed(2)
  const staffWHIP = (staff.reduce((s, p) => s + p.whip, 0) / staff.length).toFixed(2)
  const avgK9 = (staff.reduce((s, p) => s + p.kPer9, 0) / staff.length).toFixed(1)
  const avgStuff = Math.round(staff.reduce((s, p) => s + p.stuffPlus, 0) / staff.length)

  // Next starter logic (simple rotation)
  const nextStarter = starters.sort((a, b) => new Date(a.lastAppearance).getTime() - new Date(b.lastAppearance).getTime())[0]

  // Workload alerts
  const alerts = staff
    .filter(p => p.readiness !== 'green')
    .sort((a, b) => b.acwr - a.acwr)

  const cardStyle: React.CSSProperties = {
    background: 'var(--panel)', border: '1px solid var(--orange-border)',
    borderRadius: 10, padding: 24, boxShadow: 'inset 0 1px 0 var(--accent-bg-medium)',
  }

  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
    textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent)', marginBottom: 18,
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div className="anim-fade-in" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--text-bright)', marginBottom: 4 }}>
          Pitching Coach Dashboard
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--muted)' }}>
          Durham Bulls — AAA Affiliate
        </p>
      </div>

      {/* Quick Stats */}
      <div className="anim-slide-up anim-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, marginBottom: 28 }}>
        {[
          { label: 'Staff ERA', value: staffERA, sub: '12 pitchers', isName: false },
          { label: 'Staff WHIP', value: staffWHIP, sub: 'Season average', isName: false },
          { label: 'Avg K/9', value: avgK9, sub: 'Across staff', isName: false },
          { label: 'Avg Stuff+', value: avgStuff.toString(), sub: avgStuff >= 110 ? 'Above average' : 'League average', isName: false },
          { label: 'Next Starter', value: nextStarter ? nextStarter.lastName : '--', sub: nextStarter ? `${nextStarter.avgFB} mph FB` : '', isName: true },
        ].map((stat, i) => (
          <div key={i} style={{ ...cardStyle, padding: 18 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontFamily: stat.isName ? 'var(--font-heading)' : 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left column */}
        <div className="anim-slide-up anim-delay-2">
          {/* Today's Starter */}
          {nextStarter && (
            <div style={{ marginBottom: 24 }}>
              <div style={secTitle}>Next Starter</div>
              <div style={{ ...cardStyle, background: 'var(--accent-bg-subtle)', border: '1px solid var(--accent)', cursor: 'pointer' }} onClick={() => { const pid = staffToPlayerMap[nextStarter.id]; if (pid) navigate(`/player/${pid}/pitching`) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4 }}>
                      {nextStarter.firstName} {nextStarter.lastName}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)' }}>
                      {nextStarter.throws}HP — {nextStarter.era} ERA, {nextStarter.whip} WHIP
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 14px', borderRadius: 6,
                    background: nextStarter.stuffPlus >= 115 ? 'var(--color-positive-bg)' : 'var(--color-warning-bg)',
                    color: nextStarter.stuffPlus >= 115 ? 'var(--color-positive)' : 'var(--color-warning)',
                    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16,
                  }}>
                    {nextStarter.stuffPlus} Stuff+
                  </div>
                </div>

                {/* Arsenal mini bars */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  {nextStarter.arsenal.map(pitch => (
                    <div key={pitch.type} style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: pitchColors[pitch.type] || 'var(--muted)', fontWeight: 600 }}>{pitch.type}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>{pitch.usage}%</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--surface-tint-3)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${pitch.usage}%`, background: pitchColors[pitch.type] || 'var(--accent)', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Velocity sparkline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Velo Trend</span>
                  <Sparkline data={generateTrend(nextStarter.avgFB, 1.5)} width={100} height={20} showEndDot />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-bright)' }}>{nextStarter.avgFB} mph</span>
                </div>
              </div>
            </div>
          )}

          {/* Staff Alerts */}
          <div>
            <div style={secTitle}>Staff Alerts</div>
            {alerts.length === 0 && (
              <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                All pitchers are green — no workload concerns.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {alerts.map(p => {
                const color = p.readiness === 'red' ? 'var(--color-negative)' : 'var(--color-warning)'
                return (
                  <div key={p.id} style={{
                    ...cardStyle, padding: 16,
                    borderLeft: `4px solid ${color}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--text-bright)', marginBottom: 2 }}>
                          {p.firstName} {p.lastName}
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
                          ACWR: {p.acwr.toFixed(2)} — {p.pitchCount7Day} pitches (7d) / {p.pitchCount28Day} (28d)
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.8px',
                        background: `${color}22`, color,
                      }}>
                        {p.readiness === 'red' ? 'High Risk' : 'Monitor'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Recent Appearances */}
        <div className="anim-slide-up anim-delay-3">
          <div style={secTitle}>Recent Appearances</div>
          <div style={{ ...cardStyle, padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--orange-border)' }}>
                  {['Pitcher', 'Date', 'IP', 'K', 'BB', 'ER', 'Stuff+'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 10,
                      fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase',
                      color: 'var(--muted)', textAlign: 'left',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentAppearances.map((app, i) => (
                  <tr key={i} style={{ borderBottom: i < recentAppearances.length - 1 ? '1px solid var(--surface-tint-2)' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                    onClick={() => { const pid = staffToPlayerMap[app.pitcher]; if (pid) navigate(`/player/${pid}/pitching`) }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--row-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-bright)', fontWeight: 600 }}>{app.name}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>{app.date}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>{app.ip.toFixed(1)}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-bright)' }}>{app.k}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: app.bb >= 2 ? 'var(--color-warning)' : 'var(--text)' }}>{app.bb}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: app.er >= 3 ? 'var(--color-negative)' : 'var(--text)' }}>{app.er}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                        background: app.stuffPlus >= 120 ? 'var(--color-positive-bg)' : app.stuffPlus >= 100 ? 'var(--color-warning-bg)' : 'var(--color-negative-bg)',
                        color: app.stuffPlus >= 120 ? 'var(--color-positive)' : app.stuffPlus >= 100 ? 'var(--color-warning)' : 'var(--color-negative)',
                      }}>{app.stuffPlus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
