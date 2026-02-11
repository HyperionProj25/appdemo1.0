import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import AIPanel from '../components/AIPanel'
import AnimatedChart from '../components/AnimatedChart'
import { getPlayer, getPlayerName } from '../data/players'
import { getPlayerAIResponse } from '../data/mockAI'
import { getStrengthData } from '../data/csvStats'

export default function PlayerStrength() {
  const { playerId } = useParams()
  const player = getPlayer(playerId || '3000002')
  const [showAI, setShowAI] = useState(true)
  const [activeChart, setActiveChart] = useState('jump-height')
  const [showAnnotate, setShowAnnotate] = useState(false)
  const [logNote, setLogNote] = useState('')
  const [logDate, setLogDate] = useState('')
  const [dateError, setDateError] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const [strengthAnnotations, setStrengthAnnotations] = useState<{ date: string; label: string }[]>(() => {
    return getStrengthData(playerId || '3000002').annotations
  })

  if (!player) return <div>Player not found</div>
  const name = getPlayerName(player)
  const strength = getStrengthData(playerId || '3000002')

  // Gauge animation for the jump height indicator
  const gaugeMax = strength.hsMax
  const gaugeYou = strength.maxJH
  const youPct = Math.min(100, (gaugeYou / gaugeMax) * 100)

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar playerName={name} playerId={playerId} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '20px 28px 14px' }}>
        {/* Header */}
        <div className="anim-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12, flexShrink: 0 }}>
          <img src="/branding/icon.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--text-bright)' }}>BASELINE STRENGTH</h1>
        </div>

        <div className="anim-fade-in anim-delay-1" style={{ marginBottom: 14, flexShrink: 0 }}><button className="btn" disabled title="Coming soon">DATE</button></div>

        {/* Summary: Jump Visual + Stats */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexShrink: 0 }}>
          {/* MAX JUMP HEIGHT card — wider */}
          <div className="anim-slide-up anim-delay-2 card-glow" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '16px 20px', width: 320, display: 'flex', flexDirection: 'column' }}>
            <div style={secHead}>MAX JUMP HEIGHT</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
              <svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', maxHeight: 150 }}>
                {/* Main vertical gauge */}
                <line x1="60" y1="10" x2="60" y2="145" stroke="var(--muted)" strokeWidth="2" />
                <line x1="45" y1="10" x2="75" y2="10" stroke="var(--muted)" strokeWidth="1.2" />
                <line x1="45" y1="145" x2="75" y2="145" stroke="var(--muted)" strokeWidth="1.2" />

                {/* Gauge fill bar */}
                <rect
                  x="54" y={145 - (youPct / 100) * 135}
                  width="12"
                  height={mounted ? (youPct / 100) * 135 : 0}
                  fill="var(--accent)"
                  rx="2"
                  style={{ transition: 'height 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s, y 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s' }}
                />

                {/* HS Max marker */}
                <circle cx="60" cy="20" r="5" fill="var(--muted)" />
                <line x1="40" y1="20" x2="80" y2="20" stroke="rgba(150,150,150,0.5)" strokeWidth="0.5" strokeDasharray="3,2" />
                <text x="88" y="16" fill="var(--muted)" fontSize="8">{'\u2190'} HS MAX</text>
                <text x="88" y="28" fill="var(--muted)" fontSize="10" fontWeight="bold">{strength.hsMax} INCHES</text>

                {/* You marker — animated position */}
                <g style={{ transform: `translateY(${mounted ? 0 : 40}px)`, opacity: mounted ? 1 : 0, transition: 'all 0.8s ease 0.5s' }}>
                  <polygon points="60,88 52,100 68,100" fill="var(--accent)" />
                  <line x1="40" y1="94" x2="80" y2="94" stroke="rgba(224,172,68,0.4)" strokeWidth="0.5" strokeDasharray="3,2" />
                  <text x="88" y="90" fill="var(--muted)" fontSize="8">{'\u2190'} YOU</text>
                  <text x="88" y="102" fill="var(--accent)" fontSize="10" fontWeight="bold">{strength.maxJH} INCHES</text>
                </g>

                {/* Scale marks */}
                {[0, 5, 10, 15, 20, 25].map(v => {
                  const yPos = 145 - (v / gaugeMax) * 135
                  return (
                    <g key={v}>
                      <line x1="47" y1={yPos} x2="53" y2={yPos} stroke="rgba(150,150,150,0.3)" strokeWidth="0.5" />
                      <text x="42" y={yPos + 3} fill="var(--muted)" fontSize="7" textAnchor="end">{v}</text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Stats card */}
          <div className="anim-slide-up anim-delay-3" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '16px 20px' }}>
            <div style={secHead}>STRENGTH SUMMARY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={statLabel}>AVG JH</div>
                <div style={statVal}>{strength.avgJH}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={statLabel}>MAX JH</div>
                <div style={statVal}>{strength.maxJH}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={statLabel}>LAST JUMP</div>
                <div style={statVal}>{strength.lastJump}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={statLabel}>TOTAL JUMPS</div>
                <div style={statVal}>{strength.totalJumps}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' as const, lineHeight: 1.4, marginBottom: 8 }}>
              STRENGTH HAS A BIG IMPACT ON PERFORMANCE. CHANGE SOMETHING UP? LOG IT HERE
            </div>
            <button className="btn btn--accent" onClick={() => setShowAnnotate(true)}>DATE LOG</button>
          </div>
        </div>

        {/* Chart tabs */}
        <div className="anim-fade-in anim-delay-4" style={{ display: 'flex', border: '1px solid var(--orange-border)', borderRadius: 6, overflow: 'hidden', marginBottom: 14, flexShrink: 0 }}>
          {[
            { key: 'jump-height', label: 'JUMP HEIGHT', disabled: false },
            { key: 'sprint-time', label: 'SPRINT TIME', disabled: true },
            { key: 'med-ball', label: 'MED BALL TOSS', disabled: true }
          ].map(t => (
            <button key={t.key} style={{
              flex: 1, padding: '10px 0', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '1.5px', border: 'none',
              borderRight: '1px solid var(--orange-border)', cursor: t.disabled ? 'not-allowed' : 'pointer',
              background: activeChart === t.key ? 'var(--accent)' : 'transparent',
              color: activeChart === t.key ? '#000' : t.disabled ? '#3a3a3a' : 'var(--muted)',
              transition: 'all 0.15s', opacity: t.disabled ? 0.5 : 1,
            }} onClick={() => !t.disabled && setActiveChart(t.key)} disabled={t.disabled} title={t.disabled ? 'Coming soon' : undefined}>{t.label}</button>
          ))}
        </div>

        {/* Chart — using AnimatedChart for smooth curves */}
        <div className="anim-slide-up anim-delay-5" style={{ flex: 1, minHeight: 0, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '16px', boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', display: 'flex' }}>
          <AnimatedChart
            points={strength.jumpData.map(d => ({ date: d.date, value: d.value }))}
            yMin={5}
            yMax={22}
            yTicks={[5, 10, 15, 20]}
            annotations={strengthAnnotations}
            unit=" in"
            width={560}
            height={180}
          />
        </div>
      </div>

      {/* AI Panel or toggle */}
      {showAI ? (
        <div style={{ position: 'relative' }}>
          <button style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: 'var(--panel)', border: '1px solid var(--card-border)', color: 'var(--text)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }} onClick={() => setShowAI(false)}>&times;</button>
          <AIPanel suggestions={['How is my jump height trending?', 'What can I do to improve?', 'Compare to HS average']} onQuery={(q) => getPlayerAIResponse(q, name)} />
        </div>
      ) : (
        <button style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 10, padding: '12px 16px', cursor: 'pointer', zIndex: 100 }} onClick={() => setShowAI(true)}>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, textAlign: 'center' as const, lineHeight: 1.3, color: 'var(--text)' }}>TALK TO<br />YOUR DATA</span>
          <img src="/branding/icon.png" alt="" style={{ width: 34 }} />
        </button>
      )}

      {savedFlash && (
        <div className="anim-fade-in" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#000', padding: '10px 24px', borderRadius: 6, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, letterSpacing: '1px', zIndex: 2000, boxShadow: '0 4px 20px rgba(224,172,68,0.4)' }}>
          DATE LOG SAVED
        </div>
      )}

      {showAnnotate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAnnotate(false)}>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 10, padding: 28, width: 440 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Date Log Entry</h3>
            <label style={fieldLabel}>DATE</label>
            <input
              type="text"
              placeholder="e.g. 10/5 or 10/5/25"
              value={logDate}
              onChange={e => { setLogDate(e.target.value); setDateError(false) }}
              style={{ ...fieldInput, borderColor: dateError ? '#e53935' : 'var(--card-border)' }}
            />
            {dateError && <div style={{ fontSize: 10, color: '#e53935', marginTop: 4 }}>Enter a valid date (M/D or M/D/YY)</div>}
            <label style={{ ...fieldLabel, marginTop: 12 }}>NOTE</label>
            <textarea
              style={{ ...fieldInput, resize: 'vertical' }}
              placeholder="What changed?"
              value={logNote}
              onChange={e => setLogNote(e.target.value)}
              rows={3}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button className="btn" onClick={() => { setShowAnnotate(false); setLogDate(''); setLogNote(''); }}>Cancel</button>
              <button className="btn btn--accent" onClick={() => {
                if (!logNote.trim() || !logDate.trim()) return
                const dateRegex = /^\d{1,2}\/\d{1,2}(\/\d{2,4})?$/
                if (!dateRegex.test(logDate.trim())) { setDateError(true); return }
                setDateError(false)
                const parts = logDate.trim().split('/')
                const shortDate = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : logDate.trim()
                setStrengthAnnotations(prev => [...prev, { date: shortDate, label: logNote.trim() }])
                setLogNote(''); setLogDate(''); setShowAnnotate(false)
                setSavedFlash(true); setTimeout(() => setSavedFlash(false), 2000)
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const secHead: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text)', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--orange-border)', flexShrink: 0 }
const statLabel: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: 4 }
const statVal: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--text-bright)', background: '#1e1e1e', borderRadius: 6, padding: '6px 8px', border: '1px solid #2a2a2a' }
const fieldLabel: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: 6 }
const fieldInput: React.CSSProperties = { display: 'block', width: '100%', padding: 14, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-body)' }
