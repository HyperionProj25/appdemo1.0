import { useState, useEffect, useRef } from 'react'

/* ================================================
   Cycling AI Typing Text
   ================================================ */

const aiInsights = [
  'Bat speed has increased 3.2 mph over the last 4 sessions. Mechanical refinements are translating to measurable gains at the plate.',
  'Attack angle consistency improved from 62% to 78%. The hitter is finding his swing plane more reliably against off-speed pitches.',
  'Exit velocity trending upward — 70.9, 96.8, 98.1 mph across recent sessions. Hard-hit rate now at 42%, up from 31% baseline.',
  'Swing decision quality shows improved zone discipline. Chase rate down 8% with no loss in swing frequency on in-zone pitches.',
]

function CyclingTypingText() {
  const [textIdx, setTextIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'paused' | 'clearing'>('typing')

  useEffect(() => {
    const text = aiInsights[textIdx]

    if (phase === 'typing') {
      if (charIdx < text.length) {
        const t = setTimeout(() => setCharIdx(c => c + 1), 22)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('paused'), 2200)
      return () => clearTimeout(t)
    }

    if (phase === 'paused') {
      const t = setTimeout(() => setPhase('clearing'), 300)
      return () => clearTimeout(t)
    }

    if (phase === 'clearing') {
      const t = setTimeout(() => {
        setTextIdx(i => (i + 1) % aiInsights.length)
        setCharIdx(0)
        setPhase('typing')
      }, 500)
      return () => clearTimeout(t)
    }
  }, [charIdx, phase, textIdx])

  const displayText = phase === 'clearing' ? '' : aiInsights[textIdx].slice(0, charIdx)

  return (
    <>
      {displayText}
      <span className="ws-typing-cursor">|</span>
    </>
  )
}

/* ================================================
   Floating Gradient Orbs
   ================================================ */

export function FloatingOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div className="ws-orb" style={{ width: 500, height: 500, top: '-15%', right: '-10%', background: 'radial-gradient(circle, rgba(224,172,68,0.07), transparent 70%)', animation: 'ws-orbDrift 25s ease-in-out infinite' }} />
      <div className="ws-orb" style={{ width: 400, height: 400, bottom: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(174,142,81,0.05), transparent 70%)', animation: 'ws-orbDrift 30s ease-in-out infinite reverse' }} />
      <div className="ws-orb" style={{ width: 300, height: 300, top: '40%', left: '50%', background: 'radial-gradient(circle, rgba(255,198,85,0.035), transparent 70%)', animation: 'ws-orbDrift 20s ease-in-out infinite 5s' }} />
    </div>
  )
}

/* ================================================
   Animated Stat Counter
   ================================================ */

export function StatCounter({ end, suffix = '', prefix = '', duration = 2000 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.5, root: document.querySelector('.ws-root') }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const start = performance.now()
    let raf: number
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * end))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [started, end, duration])

  return <span ref={ref}>{prefix}{value}{suffix}</span>
}

/* ================================================
   Animated Bar Chart (internal)
   ================================================ */

function AnimatedBars() {
  const heights = [55, 72, 40, 88, 65, 78, 50, 92, 60, 85, 45, 70]

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 56 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            background: h > 80 ? '#E0AC44' : h > 65 ? 'rgba(224,172,68,0.35)' : '#1e1e1e',
            borderRadius: '2px 2px 0 0',
            animation: `ws-barGrow 0.8s ease-out ${0.6 + i * 0.06}s both`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  )
}

/* ================================================
   Mini Trend Sparkline (internal)
   ================================================ */

function Sparkline() {
  const points = [20, 24, 18, 28, 32, 30, 38, 35, 42, 40, 48]
  const w = 120
  const h = 32
  const stepX = w / (points.length - 1)
  const maxVal = Math.max(...points)
  const minVal = Math.min(...points)

  const d = points
    .map((val, i) => {
      const x = i * stepX
      const y = h - ((val - minVal) / (maxVal - minVal)) * h
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0AC44" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E0AC44" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${d} L${w},${h} L0,${h} Z`}
        fill="url(#sparkGrad)"
        style={{ animation: 'ws-fadeInSlow 1.5s ease-out 1s both' }}
      />
      <path
        d={d}
        fill="none"
        stroke="#E0AC44"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          strokeDasharray: 400,
          strokeDashoffset: 400,
          animation: 'ws-drawLine 2s ease-out 0.8s forwards',
        }}
      />
    </svg>
  )
}

/* ================================================
   Metric Card (internal)
   ================================================ */

function MetricCard({ label, value, unit, positive, sparkline }: { label: string; value: string; unit: string; positive?: boolean; sparkline?: boolean }) {
  return (
    <div style={{
      background: '#141414',
      border: '1px solid #1e1e1e',
      borderRadius: 6,
      padding: '12px 14px',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        fontFamily: "'GT America Mono', monospace",
        fontSize: 8,
        letterSpacing: '1.5px',
        textTransform: 'uppercase' as const,
        color: '#555',
        marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: "'GT America Standard', sans-serif",
        fontWeight: 700,
        fontSize: 18,
        color: positive ? '#4caf50' : '#E0AC44',
        lineHeight: 1,
        marginBottom: sparkline ? 8 : 0,
      }}>
        {value}<span style={{ fontSize: 10, color: '#555', marginLeft: 2 }}>{unit}</span>
      </div>
      {sparkline && <Sparkline />}
    </div>
  )
}

/* ================================================
   Hero Dashboard Mockup
   ================================================ */

export function HeroDashboardMockup() {
  return (
    <div className="ws-mockup-wrapper">
      <div className="ws-mockup-glow" />
      <div className="ws-mockup-window">
        {/* Chrome */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 32, background: '#0c0c0c',
          borderBottom: '1px solid #1a1a1a', borderRadius: '10px 10px 0 0',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <span style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 3, color: '#444' }}>BASELINE</span>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', minHeight: 320 }}>
          {/* Sidebar */}
          <div style={{ width: 130, background: '#090909', borderRight: '1px solid #1a1a1a', padding: '16px 0', flexShrink: 0 }}>
            {[
              { label: 'Dashboard', active: true },
              { label: 'Roster', active: false },
              { label: 'Watchlist', active: false },
              { label: 'AI Analysis', active: false },
              { label: 'Reports', active: false },
            ].map(item => (
              <div key={item.label} style={{
                padding: '8px 16px',
                fontFamily: "'GT America Mono', monospace", fontSize: 9,
                color: item.active ? '#E0AC44' : '#3a3a3a',
                borderLeft: item.active ? '2px solid #E0AC44' : '2px solid transparent',
                background: item.active ? 'rgba(224,172,68,0.04)' : 'transparent',
              }}>{item.label}</div>
            ))}
            <div style={{ margin: '16px 16px 0', padding: '10px 12px', background: 'rgba(224,172,68,0.04)', border: '1px solid rgba(224,172,68,0.12)', borderRadius: 6 }}>
              <div style={{ fontFamily: "'GT America Mono', monospace", fontSize: 7, letterSpacing: 1, textTransform: 'uppercase' as const, color: '#E0AC44', marginBottom: 4 }}>Active</div>
              <div style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 14, color: '#fff' }}>Scout</div>
              <div style={{ fontFamily: "'GT America Mono', monospace", fontSize: 8, color: '#444' }}>Territory A</div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: 16, background: '#0e0e0e', overflow: 'hidden' }}>
            {/* Metrics Row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <MetricCard label="Bat Speed" value="70.9" unit="mph" sparkline />
              <MetricCard label="Exit Velo" value="108.3" unit="mph" />
              <MetricCard label="Trend" value="+12" unit="%" positive />
            </div>

            {/* Chart */}
            <div style={{
              background: '#111', border: '1px solid #1a1a1a',
              borderRadius: 6, padding: 14, marginBottom: 14,
            }}>
              <div style={{ fontFamily: "'GT America Mono', monospace", fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#444', marginBottom: 10 }}>
                Session Performance
              </div>
              <AnimatedBars />
            </div>

            {/* AI Panel */}
            <div style={{
              background: 'rgba(224,172,68,0.02)',
              border: '1px solid rgba(224,172,68,0.12)',
              borderRadius: 6, padding: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 18, height: 18, borderRadius: 4,
                  background: 'rgba(224,172,68,0.1)', fontSize: 10,
                }}>&#9889;</span>
                <span style={{
                  fontFamily: "'GT America Standard', sans-serif", fontWeight: 700,
                  fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#E0AC44',
                }}>AI Insight</span>
                <span className="ws-ai-live-dot" />
              </div>
              <div style={{
                fontFamily: "'GT America Mono', monospace",
                fontSize: 10, color: '#777', lineHeight: 1.65, minHeight: 36,
              }}>
                <CyclingTypingText />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================
   Floating Mini AI Panel (standalone)
   ================================================ */

export function FloatingAIPanel() {
  return (
    <div className="ws-floating-panel ws-floating-panel--ai">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 20, height: 20, borderRadius: 5,
          background: 'rgba(224,172,68,0.1)', border: '1px solid rgba(224,172,68,0.15)',
          fontSize: 11,
        }}>&#9889;</span>
        <span style={{
          fontFamily: "'GT America Standard', sans-serif", fontWeight: 700,
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#E0AC44',
        }}>AI Analysis</span>
        <span className="ws-ai-live-dot" />
      </div>
      <div style={{
        fontFamily: "'GT America Mono', monospace",
        fontSize: 11, color: '#888', lineHeight: 1.7, minHeight: 40,
      }}>
        <CyclingTypingText />
      </div>
    </div>
  )
}

/* ================================================
   Animated Player Card
   ================================================ */

export function AnimatedPlayerCard() {
  const stats = [
    { label: 'Bat Speed', value: 71, max: 110, display: '70.9 mph' },
    { label: 'Exit Velo', value: 108, max: 120, display: '108.3 mph' },
    { label: 'Attack Angle', value: 12, max: 30, display: '12°' },
    { label: 'Hard Hit %', value: 42, max: 100, display: '42%' },
    { label: 'Zone Disc', value: 68, max: 100, display: '68%' },
  ]

  return (
    <div className="ws-floating-panel ws-floating-panel--player">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(224,172,68,0.08)', border: '1px solid rgba(224,172,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 16, color: '#E0AC44',
        }}>RC</div>
        <div>
          <div style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 17, color: '#fff' }}>Reno Castillo</div>
          <div style={{ fontFamily: "'GT America Mono', monospace", fontSize: 11, color: '#555', letterSpacing: 1 }}>
            OF &middot; R/R &middot; 6'2" 195
          </div>
        </div>
      </div>

      {stats.map((stat, i) => (
        <div key={stat.label} style={{ marginBottom: i < stats.length - 1 ? 16 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontFamily: "'GT America Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const, color: '#555' }}>{stat.label}</span>
            <span style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 12, color: '#E0AC44' }}>{stat.display}</span>
          </div>
          <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(stat.value / stat.max) * 100}%`,
              background: 'linear-gradient(90deg, #AE8E51, #E0AC44, #FFC655)',
              borderRadius: 2,
              animation: `ws-barGrow 1s ease-out ${1 + i * 0.15}s both`,
              transformOrigin: 'left',
            }} />
          </div>
        </div>
      ))}

      <div style={{ marginTop: 20, padding: '10px 12px', background: 'rgba(224,172,68,0.04)', border: '1px solid rgba(224,172,68,0.12)', borderRadius: 6 }}>
        <div style={{ fontFamily: "'GT America Mono', monospace", fontSize: 9, color: '#666', lineHeight: 1.5 }}>
          <span style={{ color: '#E0AC44' }}>&#9650; Trending:</span> Bat speed +3.2 mph over last 4 sessions
        </div>
      </div>
    </div>
  )
}

/* ================================================
   Animated Roster Grid
   ================================================ */

export function AnimatedRosterGrid() {
  const players = [
    { initials: 'JD', name: 'J. Davis', status: 'hot' },
    { initials: 'MT', name: 'M. Torres', status: 'normal' },
    { initials: 'KR', name: 'K. Rivera', status: 'hot' },
    { initials: 'BW', name: 'B. Wilson', status: 'normal' },
    { initials: 'AL', name: 'A. Lee', status: 'watch' },
    { initials: 'SC', name: 'S. Chen', status: 'hot' },
    { initials: 'RJ', name: 'R. Jackson', status: 'normal' },
    { initials: 'DP', name: 'D. Patel', status: 'watch' },
    { initials: 'CF', name: 'C. Foster', status: 'normal' },
    { initials: 'LM', name: 'L. Martinez', status: 'hot' },
    { initials: 'TK', name: 'T. Kim', status: 'normal' },
    { initials: 'NB', name: 'N. Brown', status: 'normal' },
  ]

  const getColor = (s: string) => s === 'hot' ? '#E0AC44' : s === 'watch' ? '#e53935' : '#333'
  const getBg = (s: string) => s === 'hot' ? 'rgba(224,172,68,0.06)' : s === 'watch' ? 'rgba(229,57,53,0.04)' : '#111'

  return (
    <div className="ws-floating-panel ws-floating-panel--roster">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#fff' }}>Active Roster</span>
        <span style={{ fontFamily: "'GT America Mono', monospace", fontSize: 10, color: '#444' }}>12 Players</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {players.map((p, i) => (
          <div key={p.initials + i} style={{
            background: getBg(p.status),
            border: `1px solid ${p.status !== 'normal' ? getColor(p.status) + '33' : '#1c1c1c'}`,
            borderRadius: 6, padding: '10px 6px', textAlign: 'center',
            animation: `ws-fadeInUp 0.5s ease-out ${i * 0.05}s both`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: p.status !== 'normal' ? getColor(p.status) + '18' : '#1a1a1a',
              margin: '0 auto 5px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 9,
              color: p.status !== 'normal' ? getColor(p.status) : '#555',
            }}>{p.initials}</div>
            <div style={{ fontFamily: "'GT America Mono', monospace", fontSize: 8, color: '#555' }}>{p.name}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 16 }}>
        <span style={{ fontFamily: "'GT America Mono', monospace", fontSize: 9, color: '#555' }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#E0AC44', marginRight: 4, verticalAlign: 'middle' }} />Trending Up
        </span>
        <span style={{ fontFamily: "'GT America Mono', monospace", fontSize: 9, color: '#555' }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#e53935', marginRight: 4, verticalAlign: 'middle' }} />Watch List
        </span>
      </div>
    </div>
  )
}

/* ================================================
   Animated Scout Radar
   ================================================ */

export function AnimatedScoutRadar() {
  return (
    <div className="ws-floating-panel ws-floating-panel--radar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#fff' }}>Territory Map</span>
        <span style={{ fontFamily: "'GT America Mono', monospace", fontSize: 10, color: '#E0AC44' }}>7 Active</span>
      </div>
      <svg width="260" height="200" viewBox="0 0 260 200" fill="none" style={{ display: 'block', margin: '0 auto' }}>
        {/* Grid */}
        <circle cx="130" cy="100" r="85" stroke="#1a1a1a" strokeWidth="0.5" />
        <circle cx="130" cy="100" r="60" stroke="#1a1a1a" strokeWidth="0.5" />
        <circle cx="130" cy="100" r="35" stroke="#1a1a1a" strokeWidth="0.5" />
        <line x1="45" y1="100" x2="215" y2="100" stroke="#1a1a1a" strokeWidth="0.5" />
        <line x1="130" y1="15" x2="130" y2="185" stroke="#1a1a1a" strokeWidth="0.5" />
        <line x1="60" y1="30" x2="200" y2="170" stroke="#1a1a1a" strokeWidth="0.3" />
        <line x1="200" y1="30" x2="60" y2="170" stroke="#1a1a1a" strokeWidth="0.3" />

        {/* Sweep line */}
        <line x1="130" y1="100" x2="215" y2="60" stroke="#E0AC44" strokeWidth="0.5" opacity="0.3">
          <animateTransform attributeName="transform" type="rotate" from="0 130 100" to="360 130 100" dur="8s" repeatCount="indefinite" />
        </line>

        {/* Data points */}
        {[
          { cx: 160, cy: 65, r: 5, delay: '0s' },
          { cx: 95, cy: 130, r: 4, delay: '0.3s' },
          { cx: 175, cy: 130, r: 6, delay: '0.6s' },
          { cx: 100, cy: 75, r: 3.5, delay: '0.9s' },
          { cx: 145, cy: 55, r: 4, delay: '1.2s' },
          { cx: 155, cy: 110, r: 3, delay: '1.5s' },
          { cx: 110, cy: 105, r: 5, delay: '1.8s' },
        ].map((pt, i) => (
          <g key={i}>
            <circle cx={pt.cx} cy={pt.cy} r={pt.r + 8} fill="#E0AC44" opacity="0">
              <animate attributeName="opacity" values="0;0.08;0" dur="3s" begin={pt.delay} repeatCount="indefinite" />
              <animate attributeName="r" values={`${pt.r + 4};${pt.r + 12};${pt.r + 4}`} dur="3s" begin={pt.delay} repeatCount="indefinite" />
            </circle>
            <circle cx={pt.cx} cy={pt.cy} r={pt.r} fill="#E0AC44" opacity="0" style={{ animation: `ws-dotPop 0.6s ease-out ${pt.delay} forwards` }} />
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ================================================
   Animated Pitching Staff
   ================================================ */

export function AnimatedPitchingStaff() {
  const arsenal = [
    { pitch: 'FF', velo: '94.2', spin: '2340', pct: 85 },
    { pitch: 'SL', velo: '86.1', spin: '2580', pct: 68 },
    { pitch: 'CH', velo: '84.7', spin: '1720', pct: 52 },
    { pitch: 'CB', velo: '79.3', spin: '2810', pct: 45 },
  ]

  return (
    <div className="ws-floating-panel ws-floating-panel--roster">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#fff' }}>Pitching Staff</span>
        <span style={{ fontFamily: "'GT America Mono', monospace", fontSize: 10, color: '#E0AC44' }}>5 Active</span>
      </div>

      {/* Velocity readout */}
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16,
        padding: '12px 14px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 6,
      }}>
        <span style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 28, color: '#E0AC44' }}>94.2</span>
        <span style={{ fontFamily: "'GT America Mono', monospace", fontSize: 10, color: '#555', letterSpacing: 1 }}>MPH AVG</span>
        <span style={{ marginLeft: 'auto', fontFamily: "'GT America Mono', monospace", fontSize: 10, color: '#4caf50' }}>+1.3</span>
      </div>

      {/* Arsenal bars */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'GT America Mono', monospace", fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#444', marginBottom: 10 }}>
          Arsenal Mix
        </div>
        {arsenal.map((p, i) => (
          <div key={p.pitch} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 11, color: '#fff' }}>{p.pitch}</span>
              <span style={{ fontFamily: "'GT America Mono', monospace", fontSize: 9, color: '#555' }}>{p.velo} mph · {p.spin} rpm</span>
            </div>
            <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${p.pct}%`,
                background: i === 0 ? '#E0AC44' : i === 1 ? 'rgba(224,172,68,0.6)' : 'rgba(224,172,68,0.35)',
                borderRadius: 2,
                animation: `ws-barGrow 1s ease-out ${1 + i * 0.15}s both`,
                transformOrigin: 'left',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Workload indicator */}
      <div style={{ padding: '10px 12px', background: 'rgba(224,172,68,0.04)', border: '1px solid rgba(224,172,68,0.12)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50', flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: "'GT America Mono', monospace", fontSize: 9, color: '#666', lineHeight: 1.5 }}>
            <span style={{ color: '#E0AC44' }}>ACWR:</span> 0.92 — Optimal workload range
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================
   Animated Report Document
   ================================================ */

export function AnimatedReportDoc() {
  return (
    <div className="ws-floating-panel ws-floating-panel--report">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#fff' }}>Development Resume</span>
      </div>

      {/* Header bar */}
      <div style={{ height: 3, width: '40%', background: '#E0AC44', borderRadius: 2, marginBottom: 20, animation: 'ws-lineGrow 1s ease-out 0.5s both' }} />

      {/* Text lines */}
      {[100, 85, 92, 0, 78, 88, 70, 0, 95, 60].map((w, i) => (
        w === 0
          ? <div key={i} style={{ height: 12 }} />
          : <div key={i} style={{
              height: 2, width: `${w}%`, background: '#1e1e1e',
              borderRadius: 2, marginBottom: 8,
              animation: `ws-lineGrow 0.6s ease-out ${0.8 + i * 0.08}s both`,
            }} />
      ))}

      {/* Stat boxes */}
      <div style={{ display: 'flex', gap: 10, margin: '16px 0' }}>
        {[
          { label: 'Overall', value: 'A-' },
          { label: 'Power', value: '72' },
          { label: 'Contact', value: '85' },
        ].map((s, i) => (
          <div key={s.label} style={{
            flex: 1, padding: '10px 8px', textAlign: 'center',
            background: 'rgba(224,172,68,0.04)', border: '1px solid rgba(224,172,68,0.12)',
            borderRadius: 6, animation: `ws-fadeInUp 0.5s ease-out ${1.5 + i * 0.1}s both`,
          }}>
            <div style={{ fontFamily: "'GT America Mono', monospace", fontSize: 8, letterSpacing: 1, textTransform: 'uppercase' as const, color: '#555', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'GT America Standard', sans-serif", fontWeight: 700, fontSize: 16, color: '#E0AC44' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* More lines */}
      {[88, 72, 95].map((w, i) => (
        <div key={`b${i}`} style={{
          height: 2, width: `${w}%`, background: '#1e1e1e',
          borderRadius: 2, marginBottom: 8,
          animation: `ws-lineGrow 0.6s ease-out ${2 + i * 0.08}s both`,
        }} />
      ))}
    </div>
  )
}
