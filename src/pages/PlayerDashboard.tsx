import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import AIPanel from '../components/AIPanel'
import RadarChart from '../components/RadarChart'
import { getPlayer, getPlayerName } from '../data/players'
import { playerSuggestions, getPlayerAIResponse } from '../data/mockAI'
import { getBatterStats, hittingBenchmarks, normalizeHitting } from '../data/csvStats'

const TC: Record<string, string> = {
  popup: 'var(--color-popup)',
  linedrive: 'var(--color-linedrive)',
  flyball: 'var(--color-flyball)',
  groundball: 'var(--color-groundball)',
}

export default function PlayerDashboard() {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const player = getPlayer(playerId || '3000002')
  const [mode, setMode] = useState<'training' | 'live'>('training')
  const [showAI, setShowAI] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [dotCount, setDotCount] = useState(0)

  const stats = getBatterStats(playerId || '3000002')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Stagger dot entrance
  const dots = mode === 'training' ? stats.trainingDots : stats.liveDots
  const cdots = mode === 'training' ? stats.trainingContact : stats.liveContact

  useEffect(() => {
    setDotCount(0)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDotCount(i)
      if (i >= dots.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [mode, dots.length])

  if (!player) return <div style={{ padding: 40, color: '#fff' }}>Player not found. <button onClick={() => navigate('/facility/players')} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Back</button></div>

  const name = getPlayerName(player)
  const ht = stats.hitTypes
  const evo = mode === 'live' ? 3 : 0
  const bso = mode === 'live' ? -2 : 0
  const swo = mode === 'live' ? 12 : 0

  const ofSpray = mode === 'training' ? stats.outfieldSpray : stats.liveOutfieldSpray
  const ifSpray = mode === 'training' ? stats.infieldSpray : stats.liveInfieldSpray

  const radarValues = normalizeHitting(player.avgEV + evo, player.avgBS + bso, player.swings)

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar playerName={name} playerId={playerId} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '20px 28px 14px' }}>
        {/* Header row */}
        <div className="anim-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/branding/icon.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--text-bright)' }}>BASELINE HITTING</h1>
          </div>
          <button style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, letterSpacing: '2px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>UPLOAD</button>
        </div>

        {/* Controls row */}
        <div className="anim-fade-in anim-delay-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" disabled title="Coming soon">DATE</button>
          </div>
          <div style={{ display: 'flex', border: '1px solid var(--orange-border)', borderRadius: 6, overflow: 'hidden' }}>
            {(['training', 'live'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '8px 26px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11,
                textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', border: 'none',
                borderRight: m === 'training' ? '1px solid var(--orange-border)' : 'none',
                background: mode === m ? 'var(--accent)' : 'transparent', color: mode === m ? '#000' : 'var(--muted)',
                transition: 'all 0.15s'
              }}>{m}</button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0, overflow: 'auto' }}>
          {/* ROW 1 — Player Summary + How You Stack Up */}
          <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
            {/* Player Summary */}
            <div className={`anim-slide-up anim-delay-2 ${mounted ? 'card-glow' : ''}`} style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '16px 20px', boxShadow: 'inset 0 1px 0 var(--accent)' }}>
              <div style={secHead}>PLAYER SUMMARY</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px' }}>
                {[
                  { label: 'AVG EV', val: `${player.avgEV + evo}`, unit: 'MPH', highlight: false },
                  { label: 'MAX EV', val: `${player.maxEV + evo}`, unit: 'MPH', highlight: true },
                  { label: 'AVG BS', val: `${player.avgBS + bso}`, unit: 'MPH', highlight: false },
                  { label: 'SWINGS', val: `${player.swings + swo}`, unit: '', highlight: false },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: s.highlight ? 'var(--accent)' : 'var(--muted)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--text-bright)', background: '#1e1e1e', borderRadius: 6, padding: '6px 8px', border: '1px solid #2a2a2a' }}>
                      {s.val}{s.unit && <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', marginLeft: 4 }}>{s.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How You Stack Up — RadarChart */}
            <div className="anim-slide-up anim-delay-3" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '16px 20px', boxShadow: 'inset 0 1px 0 var(--accent)' }}>
              <div style={secHead}>HOW YOU STACK UP</div>
              <RadarChart
                values={radarValues}
                labels={['EV', 'QoC', 'BS']}
                benchmarks={hittingBenchmarks}
                size={200}
              />
            </div>
          </div>

          {/* ROW 2 — Distribution + Session Analysis + Contact Point */}
          <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
            {/* Outfield / Infield Distribution */}
            <div className="anim-slide-up anim-delay-4" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px 16px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <div style={secHead2}>OUTFIELD DISTRIBUTION</div>
              {ofSpray.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 34, fontSize: 11, fontWeight: 700, textAlign: 'right', flexShrink: 0, color: 'var(--text)' }}>{d.label}</span>
                  <div style={{ flex: 1, height: 18, background: '#1a1a1a', borderRadius: 4, overflow: 'hidden' }}>
                    <div className="dist-bar" style={{ height: '100%', width: `${d.pct}%`, background: 'linear-gradient(90deg,#8a6a2a,var(--accent))', borderRadius: 4, animationDelay: `${0.2 + i * 0.08}s` }} />
                  </div>
                  <span style={{ width: 44, fontSize: 11, color: 'var(--muted)', textAlign: 'right', flexShrink: 0 }}>{d.pct}%</span>
                </div>
              ))}
              <div style={{ ...secHead2, marginTop: 12 }}>INFIELD DISTRIBUTION</div>
              {ifSpray.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 34, fontSize: 11, fontWeight: 700, textAlign: 'right', flexShrink: 0, color: 'var(--text)' }}>{d.label}</span>
                  <div style={{ flex: 1, height: 18, background: '#1a1a1a', borderRadius: 4, overflow: 'hidden' }}>
                    <div className="dist-bar" style={{ height: '100%', width: `${d.pct}%`, background: 'linear-gradient(90deg,#8a6a2a,var(--accent))', borderRadius: 4, animationDelay: `${0.5 + i * 0.08}s` }} />
                  </div>
                  <span style={{ width: 44, fontSize: 11, color: 'var(--muted)', textAlign: 'right', flexShrink: 0 }}>{d.pct}%</span>
                </div>
              ))}
            </div>

            {/* Session Analysis */}
            <div className="anim-slide-up anim-delay-5" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px 16px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={secHead2}>SESSION ANALYSIS</div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 90" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                  <rect x="10" y="5" width="80" height="72" fill="none" stroke="rgba(80,80,80,0.25)" strokeWidth="0.4" />
                  <line x1="10" y1="41" x2="90" y2="41" stroke="rgba(80,80,80,0.12)" strokeWidth="0.3" />
                  <line x1="50" y1="5" x2="50" y2="77" stroke="rgba(80,80,80,0.12)" strokeWidth="0.3" />
                  <rect x="28" y="18" width="44" height="44" fill="none" stroke="rgba(120,120,120,0.25)" strokeWidth="0.4" />
                  {dots.slice(0, dotCount).map((d, i) => (
                    <circle key={i} cx={d.x} cy={d.y} r="1.5" fill={TC[d.type]} opacity="0.9">
                      <animate attributeName="r" from="0" to="1.5" dur="0.3s" fill="freeze" />
                      <animate attributeName="opacity" from="0" to="0.9" dur="0.3s" fill="freeze" />
                    </circle>
                  ))}
                </svg>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 12px', justifyContent: 'center', fontSize: 10, color: 'var(--muted)', paddingTop: 6, flexShrink: 0 }}>
                {[
                  { t: 'popup', l: 'POP-UP', c: 'var(--color-popup)' },
                  { t: 'linedrive', l: 'LINE-DRIVE', c: 'var(--color-linedrive)' },
                  { t: 'flyball', l: 'FLY-BALL', c: 'var(--color-flyball)' },
                  { t: 'groundball', l: 'GROUNDBALL', c: 'var(--color-groundball)' },
                ].map((x, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.5px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: x.c, display: 'inline-block' }} />{x.l} <b>{(ht as Record<string, number>)[x.t]}%</b>
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Point */}
            <div className="anim-slide-up anim-delay-6" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px 16px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={secHead2}>CONTACT POINT</div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                  {[5, 4, 3, 2, 1, 0, -1].map((v, i) => (
                    <text key={i} x="11" y={8 + i * 12.5} fill="var(--muted)" fontSize="7" textAnchor="end" fontWeight="700">{v}</text>
                  ))}
                  <line x1="14" y1="2" x2="14" y2="88" stroke="rgba(80,80,80,0.15)" strokeWidth="0.3" />
                  <polygon points="44,82 50,90 56,82 54,77 46,77" fill="none" stroke="rgba(120,120,120,0.35)" strokeWidth="0.5" />
                  {cdots.slice(0, dotCount).map((d, i) => (
                    <circle key={i} cx={d.x} cy={d.y} r="1.5" fill={TC[d.type]} opacity="0.9">
                      <animate attributeName="r" from="0" to="1.5" dur="0.3s" fill="freeze" />
                    </circle>
                  ))}
                </svg>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 12px', justifyContent: 'center', fontSize: 10, color: 'var(--muted)', paddingTop: 6, flexShrink: 0 }}>
                {[
                  { l: 'POP-UP', c: 'var(--color-popup)' },
                  { l: 'LINE-DRIVE', c: 'var(--color-linedrive)' },
                  { l: 'FLY-BALL', c: 'var(--color-flyball)' },
                  { l: 'GROUNDBALL', c: 'var(--color-groundball)' },
                ].map((x, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.5px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: x.c, display: 'inline-block' }} />{x.l}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '6px 0', flexShrink: 0 }}>
            <button style={{ padding: '9px 18px', background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 6, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, color: 'var(--accent)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1.5px', transition: 'all 0.2s' }} onClick={() => navigate(`/player/${playerId}/metrics`)} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,172,68,0.1)'; e.currentTarget.style.borderColor = 'var(--accent)' }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--panel)'; e.currentTarget.style.borderColor = 'var(--orange-border)' }}>VIEW METRICS &rarr;</button>
          </div>
        </div>
      </div>

      {/* AI Panel or toggle */}
      {showAI ? (
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowAI(false)} style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: 'var(--panel)', border: '1px solid var(--card-border)', color: 'var(--text)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>&times;</button>
          <AIPanel suggestions={playerSuggestions} onQuery={(q) => getPlayerAIResponse(q, name)} />
        </div>
      ) : (
        <button onClick={() => setShowAI(true)} style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 10, padding: '12px 16px', cursor: 'pointer', zIndex: 100 }}>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text)', textAlign: 'center', lineHeight: 1.3 }}>TALK TO<br />YOUR DATA</span>
          <img src="/branding/icon.png" alt="" style={{ width: 34 }} />
        </button>
      )}
    </div>
  )
}

const secHead: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text)', textAlign: 'center', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--orange-border)' }
const secHead2: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-bright)', marginBottom: 8, paddingBottom: 5, borderBottom: '1px solid var(--orange-border)', flexShrink: 0 }
