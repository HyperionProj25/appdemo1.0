import { useState } from 'react'
import { players, getPlayerFullName } from '../../data/players'
import { generatePlan, type DevelopmentPlan, type CoachingNote } from '../../data/developmentPlans'

const cardStyle: React.CSSProperties = {
  background: 'var(--panel)', border: '1px solid var(--orange-border)',
  borderRadius: 10, padding: 24, boxShadow: 'inset 0 1px 0 var(--accent-bg-medium)',
}

const secTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
  textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent)', marginBottom: 18,
}

const durhamPlayers = players.filter(p => p.sport === 'Baseball' && p.team === 'Durham Bulls')

function statusColor(status: 'on-track' | 'needs-attention' | 'ahead'): string {
  if (status === 'ahead') return 'var(--color-positive)'
  if (status === 'on-track') return 'var(--color-positive)'
  return 'var(--color-negative)'
}

function statusLabel(status: 'on-track' | 'needs-attention' | 'ahead'): string {
  if (status === 'ahead') return 'Ahead'
  if (status === 'on-track') return 'On Track'
  return 'Needs Attention'
}

function priorityColor(priority: 'high' | 'medium' | 'low'): string {
  if (priority === 'high') return 'var(--color-negative)'
  if (priority === 'medium') return 'var(--accent)'
  return 'var(--color-positive)'
}

function progressColor(pct: number): string {
  if (pct >= 80) return 'var(--color-positive)'
  if (pct >= 50) return 'var(--accent)'
  return 'var(--color-negative)'
}

export default function CoachDevelopment() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('')
  const [plan, setPlan] = useState<DevelopmentPlan | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [noteText, setNoteText] = useState('')

  const selectedPlayer = durhamPlayers.find(p => p.id === selectedPlayerId) || null

  function handlePlayerChange(id: string) {
    setSelectedPlayerId(id)
    if (!id) { setPlan(null); return }
    const p = durhamPlayers.find(pl => pl.id === id)
    if (p) {
      setPlan(generatePlan(p.id, p.avgEV, p.maxEV, p.avgBS, p.swings))
    }
  }

  function handleAiSuggest() {
    if (!selectedPlayer) return
    setAiLoading(true)
    setTimeout(() => {
      setPlan(generatePlan(selectedPlayer.id, selectedPlayer.avgEV, selectedPlayer.maxEV, selectedPlayer.avgBS, selectedPlayer.swings))
      setAiLoading(false)
    }, 2000)
  }

  function handleAddNote() {
    if (!plan || !noteText.trim()) return
    const newNote: CoachingNote = {
      id: `n${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: 'Coach Reynolds',
      text: noteText.trim(),
    }
    setPlan({ ...plan, notes: [newNote, ...plan.notes] })
    setNoteText('')
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
      {/* Header */}
      <div className="anim-fade-in" style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 28,
          color: 'var(--text-bright)', margin: 0, marginBottom: 6,
        }}>
          Player Development Plans
        </h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
          Track goals, milestones, and drill recommendations
        </p>
      </div>

      {/* Player Selector Row */}
      <div className="anim-slide-up anim-delay-1" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <select
          value={selectedPlayerId}
          onChange={e => handlePlayerChange(e.target.value)}
          style={{
            background: 'var(--panel)', border: '1px solid var(--orange-border)',
            borderRadius: 8, padding: '10px 16px', color: 'var(--text-bright)',
            fontFamily: 'var(--font-body)', fontSize: 14, minWidth: 260,
            outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="">Select a player...</option>
          {durhamPlayers.map(p => (
            <option key={p.id} value={p.id}>
              {getPlayerFullName(p)} — {p.position}
            </option>
          ))}
        </select>

        <button
          onClick={handleAiSuggest}
          disabled={!selectedPlayer || aiLoading}
          style={{
            background: aiLoading ? 'transparent' : 'transparent',
            border: '1px solid var(--accent)', borderRadius: 8,
            padding: '10px 20px', color: 'var(--accent)',
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
            textTransform: 'uppercase', letterSpacing: '1px',
            cursor: selectedPlayer && !aiLoading ? 'pointer' : 'not-allowed',
            opacity: selectedPlayer ? 1 : 0.4,
            transition: 'all 0.2s ease',
            animation: aiLoading ? 'pulse 1.5s ease-in-out infinite' : 'none',
          }}
        >
          {aiLoading ? 'Analyzing...' : 'AI Suggest Plan'}
        </button>

      </div>

      {/* No player selected state */}
      {!plan && (
        <div className="anim-slide-up anim-delay-2" style={{
          ...cardStyle, textAlign: 'center', padding: 64,
          color: 'var(--muted)', fontSize: 15,
        }}>
          Select a player above to view their development plan.
        </div>
      )}

      {/* Plan content */}
      {plan && selectedPlayer && (
        <div className="anim-slide-up anim-delay-3" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Goals Section */}
            <div style={cardStyle}>
              <div style={secTitle}>Goals</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {plan.goals.map(goal => {
                  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))
                  return (
                    <div key={goal.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-bright)', marginBottom: 2 }}>
                            {goal.title}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                            {goal.metric}: {goal.current} / {goal.target} {goal.unit}
                          </div>
                        </div>
                        <span style={{
                          padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                          letterSpacing: '0.8px', textTransform: 'uppercase',
                          background: `${statusColor(goal.status)}22`,
                          color: statusColor(goal.status),
                        }}>
                          {statusLabel(goal.status)}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div style={{
                        height: 8, borderRadius: 4, background: 'var(--surface-tint-3)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 4,
                          width: `${pct}%`,
                          background: progressColor(pct),
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Focus Areas Section */}
            <div style={cardStyle}>
              <div style={secTitle}>Focus Areas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {plan.focusAreas.map(area => (
                  <div key={area.id} style={{
                    background: 'var(--surface-tint-1)', borderRadius: 8,
                    padding: 16, border: '1px solid var(--surface-tint-2)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-bright)' }}>
                        {area.title}
                      </span>
                      <span style={{
                        padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.8px', textTransform: 'uppercase',
                        background: `${priorityColor(area.priority)}22`,
                        color: priorityColor(area.priority),
                      }}>
                        {area.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                      {area.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Milestone Timeline */}
            <div style={cardStyle}>
              <div style={secTitle}>Milestone Timeline</div>
              <div style={{ position: 'relative', paddingLeft: 24 }}>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute', left: 5, top: 6, bottom: 6,
                  width: 2, background: 'var(--orange-border)',
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {plan.milestones.map(ms => (
                    <div key={ms.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
                      {/* Dot */}
                      <div style={{
                        position: 'absolute', left: -24, top: 2,
                        width: 12, height: 12, borderRadius: '50%',
                        border: '2px solid',
                        borderColor: ms.achieved ? 'var(--color-positive)' : 'var(--orange-border)',
                        background: ms.achieved ? 'var(--color-positive)' : 'transparent',
                        flexShrink: 0,
                      }} />
                      <div>
                        <div style={{
                          fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)',
                          marginBottom: 2,
                        }}>
                          {ms.date}
                        </div>
                        <div style={{
                          fontSize: 13, color: ms.achieved ? 'var(--text-bright)' : 'var(--muted)',
                          fontWeight: ms.achieved ? 600 : 400,
                        }}>
                          {ms.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drill Recommendations */}
            <div style={cardStyle}>
              <div style={secTitle}>Drill Recommendations</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {plan.drills.map(drill => {
                  const linkedGoal = plan.goals.find(g => g.id === drill.linkedGoal)
                  return (
                    <div key={drill.id} style={{
                      background: 'var(--surface-tint-1)', borderRadius: 8,
                      padding: 16, border: '1px solid var(--surface-tint-2)',
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-bright)', marginBottom: 4 }}>
                        {drill.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8 }}>
                        {drill.description}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)',
                        }}>
                          {drill.frequency}
                        </span>
                        {linkedGoal && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.8px',
                            textTransform: 'uppercase', color: 'var(--muted)',
                            background: 'var(--surface-tint-2)', padding: '3px 8px',
                            borderRadius: 4,
                          }}>
                            {linkedGoal.metric}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Coaching Notes */}
            <div style={cardStyle}>
              <div style={secTitle}>Coaching Notes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
                {plan.notes.map(note => (
                  <div key={note.id} style={{
                    borderLeft: '3px solid var(--orange-border)',
                    paddingLeft: 14,
                  }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                        {note.date}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
                        {note.author}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55 }}>
                      {note.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Note */}
              <div style={{ borderTop: '1px solid var(--orange-border)', paddingTop: 16 }}>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Add a coaching note..."
                  rows={3}
                  style={{
                    width: '100%', background: 'var(--bg)', border: '1px solid var(--orange-border)',
                    borderRadius: 8, padding: 12, color: 'var(--text-bright)',
                    fontFamily: 'var(--font-body)', fontSize: 13, resize: 'vertical',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim()}
                  style={{
                    marginTop: 10, background: 'var(--accent)', border: 'none',
                    borderRadius: 6, padding: '8px 20px', color: '#1a1a1a',
                    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
                    textTransform: 'uppercase', letterSpacing: '1px',
                    cursor: noteText.trim() ? 'pointer' : 'not-allowed',
                    opacity: noteText.trim() ? 1 : 0.5,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
