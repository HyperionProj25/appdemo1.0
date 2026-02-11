import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import AnimatedChart from '../components/AnimatedChart'
import { getPlayer, getPlayerName } from '../data/players'
import { getBatterStats } from '../data/csvStats'

export default function PlayerMetrics() {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const player = getPlayer(playerId || '3000002')
  const [activeTab, setActiveTab] = useState('exit-velocity')
  const [showAnnotate, setShowAnnotate] = useState(false)
  const [annotations, setAnnotations] = useState([
    { date: '9/25', label: 'New program' },
    { date: '10/13', label: 'Stance change' },
    { date: '11/1', label: 'Weight increase' },
  ])
  const [notes, setNotes] = useState([
    { date: '9/13/25', text: 'STARTED TRAINING AT KPI' },
    { date: '9/25/25', text: 'NEW HITTING STANCE WITH COACH MALONE (HORRIBLE IDEA)' },
    { date: '11/1/25', text: 'INCREASED WEIGHT PROGRAM TO 3X/WEEK \u2014 TARGETING LOWER HALF POWER' },
  ])
  const [newNote, setNewNote] = useState('')
  const [newDate, setNewDate] = useState('')
  const [dateError, setDateError] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [fadeKey, setFadeKey] = useState(0)

  if (!player) return <div>Player not found</div>
  const name = getPlayerName(player)
  const stats = getBatterStats(playerId || '3000002')

  const tabConfig: Record<string, {
    points: { date: string; value: number }[]
    yMin: number; yMax: number; yTicks: number[]
    unit: string
  }> = {
    'exit-velocity': {
      points: stats.evTrend,
      yMin: 65, yMax: 100,
      yTicks: [70, 80, 90, 100],
      unit: ' MPH',
    },
    'launch-angle': {
      points: stats.laTrend,
      yMin: 0, yMax: 30,
      yTicks: [5, 10, 15, 20, 25, 30],
      unit: '\u00B0',
    },
    'outcome': {
      points: stats.outcomeTrend,
      yMin: 15, yMax: 55,
      yTicks: [20, 30, 40, 50],
      unit: '%',
    },
  }

  const cfg = tabConfig[activeTab] || tabConfig['exit-velocity']

  function handleTabChange(key: string) {
    setActiveTab(key)
    setFadeKey(k => k + 1)
  }

  function handleSaveAnnotation() {
    if (!newNote.trim() || !newDate.trim()) return
    // Validate date format: M/D or M/D/YY
    const dateRegex = /^\d{1,2}\/\d{1,2}(\/\d{2,4})?$/
    if (!dateRegex.test(newDate.trim())) {
      setDateError(true)
      return
    }
    setDateError(false)
    const parts = newDate.trim().split('/')
    const shortDate = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : newDate.trim()
    setAnnotations(prev => [...prev, { date: shortDate, label: newNote.trim() }])
    setNotes(prev => [{ date: newDate.trim(), text: newNote.toUpperCase() }, ...prev])
    setNewNote('')
    setNewDate('')
    setShowAnnotate(false)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
  }

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Sidebar playerName={name} playerId={playerId} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '20px 28px 14px' }}>
        <div className="anim-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexShrink: 0 }}>
          <div />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, letterSpacing: '5px', textTransform: 'uppercase' }}>BASELINE HITTING</h1>
          <button className="btn btn--accent" onClick={() => setShowAnnotate(true)}>ANNOTATE</button>
        </div>

        <div className="anim-fade-in anim-delay-1" style={{ display: 'flex', gap: 8, marginBottom: 14, flexShrink: 0 }}>
          <button className="btn" onClick={() => navigate(`/player/${playerId}/dashboard`)}>{'\u2190'} BACK TO DASHBOARD</button>
          <button className="btn" disabled title="Coming soon">DATE</button>
        </div>

        {/* Tab bar */}
        <div className="anim-fade-in anim-delay-2" style={{ display: 'flex', border: '1px solid var(--orange-border)', borderRadius: 6, overflow: 'hidden', marginBottom: 14, flexShrink: 0 }}>
          {[
            { key: 'exit-velocity', label: 'EXIT VELOCITY' },
            { key: 'launch-angle', label: 'LAUNCH ANGLE' },
            { key: 'outcome', label: 'OUTCOME %' },
          ].map(t => (
            <button key={t.key} style={{
              flex: 1, padding: '10px 0', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '1.5px', border: 'none',
              borderRight: '1px solid var(--orange-border)', cursor: 'pointer',
              background: activeTab === t.key ? 'var(--accent)' : 'transparent',
              color: activeTab === t.key ? '#000' : 'var(--muted)',
              transition: 'all 0.15s',
            }} onClick={() => handleTabChange(t.key)}>{t.label}</button>
          ))}
        </div>

        {/* Chart with AnimatedChart — cross-fade on tab change */}
        <div key={fadeKey} className="anim-slide-up anim-delay-3" style={{ flex: 1, minHeight: 0, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '16px', marginBottom: 14, boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', display: 'flex' }}>
          <AnimatedChart
            points={cfg.points}
            yMin={cfg.yMin}
            yMax={cfg.yMax}
            yTicks={cfg.yTicks}
            annotations={annotations}
            unit={cfg.unit}
            width={540}
            height={200}
          />
        </div>

        {/* Bottom sections */}
        <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
          <div className="anim-slide-up anim-delay-5" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '16px' }}>
            <div style={secTitle}>RECENT EVENT NOTES</div>
            {notes.map((n, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, fontStyle: 'italic', marginBottom: 3 }}>{n.date}</div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.4 }}>{n.text}</div>
              </div>
            ))}
          </div>
          <div className="anim-slide-up anim-delay-6" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '16px' }}>
            <div style={secTitle}>EVENTS ATTENDED</div>
            <div style={{ marginBottom: 12 }}><div style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, fontStyle: 'italic', marginBottom: 3 }}>9/25/25</div><div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.4 }}>NORCAL WORLD SERIES</div></div>
            <div style={{ marginBottom: 12 }}><div style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, fontStyle: 'italic', marginBottom: 3 }}>8/20/25</div><div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.4 }}>CCB CLASSIC</div></div>
          </div>
        </div>
      </div>

      {savedFlash && (
        <div className="anim-fade-in" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#000', padding: '10px 24px', borderRadius: 6, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, letterSpacing: '1px', zIndex: 2000, boxShadow: '0 4px 20px rgba(224,172,68,0.4)' }}>
          ANNOTATION SAVED
        </div>
      )}

      {showAnnotate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAnnotate(false)}>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 10, padding: 28, width: 440 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Add Annotation</h3>
            <label style={fieldLabel}>DATE</label>
            <input
              type="text"
              placeholder="e.g. 10/5 or 10/5/25"
              value={newDate}
              onChange={e => { setNewDate(e.target.value); setDateError(false) }}
              style={{ ...fieldInput, borderColor: dateError ? '#e53935' : 'var(--card-border)' }}
            />
            {dateError && <div style={{ fontSize: 10, color: '#e53935', marginTop: 4 }}>Enter a valid date (M/D or M/D/YY)</div>}
            <label style={{ ...fieldLabel, marginTop: 12 }}>NOTE</label>
            <textarea
              style={{ ...fieldInput, resize: 'vertical' }}
              placeholder="What happened on this date?"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              rows={3}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button className="btn" onClick={() => { setShowAnnotate(false); setNewDate(''); setNewNote(''); }}>Cancel</button>
              <button className="btn btn--accent" onClick={handleSaveAnnotation}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const secTitle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12, paddingBottom: 7, borderBottom: '1px solid var(--orange-border)' }
const fieldLabel: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: 6 }
const fieldInput: React.CSSProperties = { display: 'block', width: '100%', padding: 14, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-body)' }
