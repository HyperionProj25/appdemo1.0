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

/** Mini inline line chart for AI responses */
function MiniLineChart({ data }: { data: AIChartData }) {
  const pts = data.points || []
  if (pts.length < 2) return null
  const yMax = data.yMax || Math.max(...pts.map(p => p.value)) * 1.15
  const yMin = Math.min(...pts.map(p => p.value)) * 0.85
  const w = 320, h = 110, pad = 24
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
    <div style={{ marginTop: 8, background: 'rgba(20,20,20,0.6)', borderRadius: 6, padding: '8px 6px 4px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 95 }}>
        <defs>
          <linearGradient id="ai-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(224,172,68,0.3)" />
            <stop offset="100%" stopColor="rgba(224,172,68,0.02)" />
          </linearGradient>
        </defs>
        <path d={d + ` L ${svgPts[svgPts.length - 1][0]},${h - pad} L ${svgPts[0][0]},${h - pad} Z`} fill="url(#ai-fill)" />
        <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        {svgPts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="var(--accent)" />
            <text x={x} y={y - 8} fill="var(--text)" fontSize="8" textAnchor="middle" fontWeight="700">{pts[i].value}</text>
            <text x={x} y={h - 6} fill="var(--muted)" fontSize="7.5" textAnchor="middle">{pts[i].label}</text>
          </g>
        ))}
      </svg>
      {data.unit && <div style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'right', paddingRight: 6, marginTop: 2 }}>{data.unit}</div>}
    </div>
  )
}

/** Mini bar chart for comparison data */
function MiniBarChart({ data }: { data: AIChartData }) {
  const pts = data.points || []
  if (pts.length === 0) return null
  const maxVal = data.yMax || Math.max(...pts.map(p => p.value)) * 1.1

  return (
    <div style={{ marginTop: 8, background: 'rgba(20,20,20,0.6)', borderRadius: 6, padding: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
      {pts.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ width: 55, fontSize: 9, fontWeight: 700, color: 'var(--muted)', textAlign: 'right', flexShrink: 0 }}>{p.label}</span>
          <div style={{ flex: 1, height: 14, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(p.value / maxVal) * 100}%`,
              background: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--accent2)' : 'var(--accent3)',
              borderRadius: 3,
              animation: 'growWidth 0.6s ease-out both',
              animationDelay: `${i * 0.1}s`,
            }} />
          </div>
          <span style={{ width: 42, fontSize: 9, color: 'var(--text)', textAlign: 'right', flexShrink: 0, fontWeight: 700 }}>{p.value}{data.unit || ''}</span>
        </div>
      ))}
    </div>
  )
}

/** Mini grouped comparison chart */
function MiniComparisonChart({ data }: { data: AIChartData }) {
  const series = data.series || []
  const labels = data.labels || []
  if (series.length === 0) return null
  const allValues = series.flatMap(s => s.values)
  const maxVal = data.yMax || Math.max(...allValues) * 1.1
  const w = 320, h = 110, pad = 32, barW = 16
  const groupW = series.length * (barW + 3) + 10
  const scaleX = (gi: number) => pad + (gi / Math.max(1, labels.length - 1)) * (w - pad * 2) - groupW / 2
  const scaleY = (v: number) => h - 24 - (v / maxVal) * (h - 36)

  return (
    <div style={{ marginTop: 8, background: 'rgba(20,20,20,0.6)', borderRadius: 6, padding: '8px 6px 4px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 100 }}>
        {labels.map((label, gi) => (
          <g key={gi}>
            {series.map((s, si) => {
              const x = scaleX(gi) + si * (barW + 3) + 5
              const y = scaleY(s.values[gi] || 0)
              const barH = h - 24 - y
              return (
                <g key={si}>
                  <rect x={x} y={y} width={barW} height={barH} fill={s.color} rx="2" opacity="0.85" />
                  <text x={x + barW / 2} y={y - 4} fill="var(--text)" fontSize="7" textAnchor="middle" fontWeight="700">{s.values[gi]}</text>
                </g>
              )
            })}
            <text x={scaleX(gi) + groupW / 2} y={h - 6} fill="var(--muted)" fontSize="7.5" textAnchor="middle">{label}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', paddingBottom: 4 }}>
        {series.map((s, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, color: 'var(--muted)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: 'inline-block' }} />
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <span style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginRight: 4 }}>Analyzing</span>
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
    // Add user message immediately, then show loading
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)
    pendingRef.current = { text: response.text, chart: response.chart }

    // Simulate AI thinking for 3 seconds
    setTimeout(() => {
      const pending = pendingRef.current
      if (pending) {
        setMessages(prev => [...prev, { role: 'ai', text: pending.text, chart: pending.chart }])
        pendingRef.current = null
      }
      setLoading(false)
    }, 3000)
  }

  if (!inline) return null

  return (
    <div style={{
      width: 400, minWidth: 400, background: 'var(--bg)',
      borderLeft: '2px solid var(--accent)',
      display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      <div style={{
        fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14,
        letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--text)',
        padding: '16px 16px 12px', borderBottom: '1px solid var(--panel-border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <img src="/branding/icon.png" alt="" style={{ width: 24, opacity: 0.8 }} />
        BASELINE AI
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && !loading && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: 0.5 }}>
            <img src="/branding/icon.png" alt="" style={{ width: 44, opacity: 0.4 }} />
            <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>Ask me anything about<br />your data</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className="anim-fade-in" style={m.role === 'user' ? {
            alignSelf: 'flex-end', background: 'var(--accent)', color: '#000',
            padding: '10px 14px', borderRadius: '14px 14px 2px 14px', maxWidth: '85%', fontSize: 12,
            fontWeight: 500,
          } : {
            alignSelf: 'flex-start', background: 'var(--panel2)', border: '1px solid var(--panel-border)',
            padding: '12px 14px', borderRadius: '14px 14px 14px 2px', maxWidth: '95%', fontSize: 11.5, lineHeight: 1.65,
          }}>
            {m.role === 'ai' && <div style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6 }}>Baseline AI</div>}
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
            {m.chart && <AIChart data={m.chart} />}
          </div>
        ))}
        {loading && <AILoadingBubble />}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, padding: '6px 14px 8px' }}>
        {messages.length === 0 && !loading && suggestions.map((s, i) => (
          <button key={i} style={{
            fontSize: 10, padding: '6px 12px', borderRadius: 14,
            border: '1px solid var(--card-border)', background: 'var(--panel)',
            color: 'var(--text)', cursor: 'pointer', whiteSpace: 'nowrap',
            transition: 'border-color 0.15s',
          }} onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      <div style={{ display: 'flex', borderTop: '1px solid var(--panel-border)', padding: '10px 12px', gap: 8 }}>
        <input style={{
          flex: 1, padding: '10px 14px', background: 'var(--panel)',
          border: '1px solid var(--card-border)', borderRadius: 6,
          color: 'var(--text)', fontSize: 12,
        }} placeholder="Ask away..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} />
        <button style={{
          width: 38, height: 38, borderRadius: 6, background: loading ? 'var(--accent-dark)' : 'var(--accent)',
          color: '#000', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
        }} onClick={() => send(input)}>&#10148;</button>
      </div>
    </div>
  )
}
