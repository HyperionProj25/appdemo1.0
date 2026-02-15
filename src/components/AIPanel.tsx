import { useState, useEffect, useRef } from 'react'

export interface AIChartData {
  type: 'line' | 'bar' | 'comparison'
  points?: { label: string; value: number }[]
  series?: { label: string; values: number[]; color: string }[]
  labels?: string[]
  yMax?: number
  unit?: string
}

export interface AIResponse {
  text: string
  chart?: AIChartData
}

interface AIPanelProps {
  suggestions: string[]
  onQuery: (query: string) => AIResponse
  inline?: boolean
}

interface Message {
  role: 'user' | 'ai' | 'loading'
  text: string
  chart?: AIChartData
}

/** Line chart for AI responses */
function MiniLineChart({ data }: { data: AIChartData }) {
  const pts = data.points || []
  if (pts.length < 2) return null
  const yMax = data.yMax || Math.max(...pts.map(p => p.value)) * 1.15
  const yMin = Math.min(...pts.map(p => p.value)) * 0.85
  const w = 460, h = 200, pad = 32
  const scaleX = (i: number) => pad + (i / (pts.length - 1)) * (w - pad * 2)
  const scaleY = (v: number) => h - pad - ((v - yMin) / (yMax - yMin)) * (h - pad * 2)

  // Catmull-Rom smooth path
  const svgPts: [number, number][] = pts.map((p, i) => [scaleX(i), scaleY(p.value)])
  let d = `M ${svgPts[0][0]} ${svgPts[0][1]}`
  for (let i = 0; i < svgPts.length - 1; i++) {
    const p0 = svgPts[Math.max(0, i - 1)]
    const p1 = svgPts[i]
    const p2 = svgPts[i + 1]
    const p3 = svgPts[Math.min(svgPts.length - 1, i + 2)]
    const t = 0.3
    d += ` C ${p1[0] + (p2[0] - p0[0]) * t},${p1[1] + (p2[1] - p0[1]) * t} ${p2[0] - (p3[0] - p1[0]) * t},${p2[1] - (p3[1] - p1[1]) * t} ${p2[0]},${p2[1]}`
  }

  return (
    <div style={{ background: 'rgba(20,20,20,0.6)', borderRadius: 8, padding: '12px 10px 8px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 180 }}>
        <defs>
          <linearGradient id="ai-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(224,172,68,0.3)" />
            <stop offset="100%" stopColor="rgba(224,172,68,0.02)" />
          </linearGradient>
        </defs>
        <path d={d + ` L ${svgPts[svgPts.length - 1][0]},${h - pad} L ${svgPts[0][0]},${h - pad} Z`} fill="url(#ai-fill)" />
        <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
        {svgPts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="var(--accent)" />
            <text x={x} y={y - 10} fill="var(--text)" fontSize="13" textAnchor="middle" fontWeight="700">{pts[i].value}</text>
            <text x={x} y={h - 8} fill="var(--muted)" fontSize="12" textAnchor="middle">{pts[i].label}</text>
          </g>
        ))}
      </svg>
      {data.unit && <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'right', paddingRight: 10, marginTop: 4 }}>{data.unit}</div>}
    </div>
  )
}

/** Bar chart for comparison data */
function MiniBarChart({ data }: { data: AIChartData }) {
  const pts = data.points || []
  if (pts.length === 0) return null
  const maxVal = data.yMax || Math.max(...pts.map(p => p.value)) * 1.1

  return (
    <div style={{ background: 'rgba(20,20,20,0.6)', borderRadius: 8, padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
      {pts.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <span style={{ width: 70, fontSize: 14, fontWeight: 700, color: 'var(--muted)', textAlign: 'right', flexShrink: 0 }}>{p.label}</span>
          <div style={{ flex: 1, height: 26, background: '#1a1a1a', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(p.value / maxVal) * 100}%`,
              background: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--accent2)' : 'var(--accent3)',
              borderRadius: 5,
              animation: 'growWidth 0.6s ease-out both',
              animationDelay: `${i * 0.1}s`,
            }} />
          </div>
          <span style={{ width: 55, fontSize: 14, color: 'var(--text)', textAlign: 'right', flexShrink: 0, fontWeight: 700 }}>{p.value}{data.unit || ''}</span>
        </div>
      ))}
    </div>
  )
}

/** Grouped comparison chart */
function MiniComparisonChart({ data }: { data: AIChartData }) {
  const series = data.series || []
  const labels = data.labels || []
  if (series.length === 0) return null
  const allValues = series.flatMap(s => s.values)
  const maxVal = data.yMax || Math.max(...allValues) * 1.1
  const w = 460, h = 200, pad = 40, barW = 22
  const groupW = series.length * (barW + 4) + 12
  const scaleX = (gi: number) => pad + (gi / Math.max(1, labels.length - 1)) * (w - pad * 2) - groupW / 2
  const scaleY = (v: number) => h - 30 - (v / maxVal) * (h - 44)

  return (
    <div style={{ background: 'rgba(20,20,20,0.6)', borderRadius: 8, padding: '12px 10px 8px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 180 }}>
        {labels.map((label, gi) => (
          <g key={gi}>
            {series.map((s, si) => {
              const x = scaleX(gi) + si * (barW + 4) + 6
              const y = scaleY(s.values[gi] || 0)
              const barH = h - 30 - y
              return (
                <g key={si}>
                  <rect x={x} y={y} width={barW} height={barH} fill={s.color} rx="3" opacity="0.85" />
                  <text x={x + barW / 2} y={y - 5} fill="var(--text)" fontSize="12" textAnchor="middle" fontWeight="700">{s.values[gi]}</text>
                </g>
              )
            })}
            <text x={scaleX(gi) + groupW / 2} y={h - 8} fill="var(--muted)" fontSize="12" textAnchor="middle">{label}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', paddingBottom: 8, paddingTop: 4 }}>
        {series.map((s, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, display: 'inline-block' }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function AIChart({ data }: { data: AIChartData }) {
  switch (data.type) {
    case 'line': return <MiniLineChart data={data} />
    case 'bar': return <MiniBarChart data={data} />
    case 'comparison': return <MiniComparisonChart data={data} />
    default: return null
  }
}

/** Loading indicator with animated logo */
function AILoadingBubble() {
  return (
    <div className="anim-fade-in" style={{
      alignSelf: 'flex-start', background: 'var(--panel2)', border: '1px solid var(--panel-border)',
      padding: '16px 20px', borderRadius: '14px 14px 14px 2px', maxWidth: '90%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    }}>
      <div style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Glow ring behind logo */}
        <div className="ai-loading-ring" style={{
          position: 'absolute', inset: -6, borderRadius: '50%',
          border: '2px solid var(--accent)', opacity: 0.3,
        }} />
        <div className="ai-loading-ring" style={{
          position: 'absolute', inset: -12, borderRadius: '50%',
          border: '1px solid var(--accent)', opacity: 0.15,
          animationDelay: '0.5s',
        }} />
        {/* Pulsing logo */}
        <img src="/branding/icon.png" alt="" className="ai-loading-logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', marginRight: 5 }}>Analyzing</span>
        <span className="ai-loading-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
        <span className="ai-loading-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
        <span className="ai-loading-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
      </div>
    </div>
  )
}

export default function AIPanel({ suggestions, onQuery, inline = true }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pendingRef = useRef<{ text: string; chart?: AIChartData } | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const send = (text: string) => {
    if (!text.trim() || loading) return
    const response = onQuery(text)
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)
    pendingRef.current = { text: response.text, chart: response.chart }

    // Loading at current size, then expand when answer arrives
    setTimeout(() => {
      const pending = pendingRef.current
      if (pending) {
        setMessages(prev => [...prev, { role: 'ai', text: pending.text, chart: pending.chart }])
        pendingRef.current = null
      }
      setLoading(false)
      setExpanded(true)
    }, 3000)
  }

  if (!inline) return null

  return (
    <div style={{
      width: expanded ? 700 : 400, minWidth: 400, background: 'var(--bg)',
      borderLeft: '2px solid var(--accent)',
      display: 'flex', flexDirection: 'column', height: '100%',
      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{
        fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14,
        letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--text)',
        padding: '16px 16px 12px', borderBottom: '1px solid var(--panel-border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <img src="/branding/icon.png" alt="" style={{ width: 24, opacity: 0.8 }} />
        <span style={{ flex: 1 }}>BASELINE AI</span>
        <button
          onClick={() => setExpanded(e => !e)}
          title={expanded ? 'Collapse panel' : 'Expand panel'}
          style={{
            background: 'none', border: '1px solid var(--card-border)', borderRadius: 4,
            color: 'var(--muted)', cursor: 'pointer', padding: '2px 6px', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--card-border)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {expanded
              ? <><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></>
              : <><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></>
            }
          </svg>
        </button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.length === 0 && !loading && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0.5 }}>
            <img src="/branding/icon.png" alt="" style={{ width: 44, opacity: 0.4 }} />
            <div style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>Ask me anything about<br />your data</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className="anim-fade-in" style={m.role === 'user' ? {
            alignSelf: 'flex-end', background: 'var(--accent)', color: '#000',
            padding: '12px 18px', borderRadius: '14px 14px 2px 14px', maxWidth: '85%', fontSize: 14,
            fontWeight: 500,
          } : {
            alignSelf: 'flex-start', background: 'var(--panel2)', border: '1px solid var(--panel-border)',
            padding: '16px 18px', borderRadius: '14px 14px 14px 2px', maxWidth: '100%', width: '100%', fontSize: 14, lineHeight: 1.7,
          }}>
            {m.role === 'ai' && <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 10 }}>Baseline AI</div>}
            {m.chart && <AIChart data={m.chart} />}
            <div style={{ whiteSpace: 'pre-wrap', marginTop: m.chart ? 12 : 0 }}>{m.text}</div>
          </div>
        ))}
        {loading && <AILoadingBubble />}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '8px 18px 10px' }}>
        {messages.length === 0 && !loading && suggestions.map((s, i) => (
          <button key={i} style={{
            fontSize: 13, padding: '9px 16px', borderRadius: 14,
            border: '1px solid var(--card-border)', background: 'var(--panel)',
            color: 'var(--text)', cursor: 'pointer', whiteSpace: 'nowrap',
            transition: 'border-color 0.15s',
          }} onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      <div style={{ display: 'flex', borderTop: '1px solid var(--panel-border)', padding: '12px 14px', gap: 10 }}>
        <input style={{
          flex: 1, padding: '12px 16px', background: 'var(--panel)',
          border: '1px solid var(--card-border)', borderRadius: 8,
          color: 'var(--text)', fontSize: 14,
        }} placeholder="Ask away..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} />
        <button style={{
          width: 42, height: 42, borderRadius: 8, background: loading ? 'var(--accent-dark)' : 'var(--accent)',
          color: '#000', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
        }} onClick={() => send(input)}>&#10148;</button>
      </div>
    </div>
  )
}
