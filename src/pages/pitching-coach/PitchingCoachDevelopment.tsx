import { useState } from 'react'
import { pitchingStaff, type Pitcher } from '../../data/pitchingStaff'

interface DevGoal {
  id: string; title: string; metric: string; current: number; target: number; unit: string
  status: 'on-track' | 'needs-attention' | 'ahead'
}
interface FocusArea { id: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }
interface Milestone { id: string; title: string; date: string; achieved: boolean }
interface Drill { id: string; name: string; description: string; frequency: string; linkedGoal: string }
interface Note { id: string; date: string; author: string; text: string }
interface DevPlan { goals: DevGoal[]; focusAreas: FocusArea[]; milestones: Milestone[]; drills: Drill[]; notes: Note[] }

function generatePitchingPlan(p: Pitcher): DevPlan {
  const goals: DevGoal[] = []
  let gid = 1
  if (p.avgFB < 95) {
    goals.push({ id: `g${gid++}`, title: `Increase FB Velo to ${Math.round(p.avgFB + 2)} mph`, metric: 'Avg FB', current: p.avgFB, target: Math.round(p.avgFB + 2), unit: 'mph', status: p.avgFB >= (p.avgFB + 2) * 0.95 ? 'on-track' : 'needs-attention' })
  }
  if (p.arsenal.length <= 3) {
    goals.push({ id: `g${gid++}`, title: 'Develop New Secondary Pitch', metric: 'Arsenal Size', current: p.arsenal.length, target: p.arsenal.length + 1, unit: 'pitches', status: 'needs-attention' })
  }
  goals.push({ id: `g${gid++}`, title: 'Improve Release Consistency', metric: 'Location+', current: p.locationPlus, target: Math.round(p.locationPlus * 1.05), unit: 'score', status: p.locationPlus >= 110 ? 'ahead' : 'on-track' })
  goals.push({ id: `g${gid++}`, title: 'Reduce Walk Rate', metric: 'BB/9', current: p.bbPer9, target: Math.max(2.0, +(p.bbPer9 - 0.5).toFixed(1)), unit: 'per 9', status: p.bbPer9 <= 2.8 ? 'ahead' : p.bbPer9 <= 3.2 ? 'on-track' : 'needs-attention' })

  const focusAreas: FocusArea[] = [
    { id: 'f1', title: 'Fastball Command', description: 'Ability to locate the fastball to all four quadrants consistently. Key for first-pitch strikes and getting ahead in counts.', priority: p.bbPer9 > 3.0 ? 'high' : 'medium' },
    { id: 'f2', title: 'Secondary Development', description: 'Improving feel and consistency of off-speed pitches. Focus on maintaining arm speed and release point similarity.', priority: p.arsenal.length <= 3 ? 'high' : 'low' },
    { id: 'f3', title: 'Mechanical Consistency', description: 'Repeating delivery mechanics to maintain velocity deep into outings and reduce injury risk.', priority: p.acwr > 1.1 ? 'high' : 'medium' },
  ]

  const milestones: Milestone[] = [
    { id: 'm1', title: 'Pitching assessment', date: '2026-01-08', achieved: true },
    { id: 'm2', title: 'Establish baseline metrics', date: '2026-01-14', achieved: true },
    { id: 'm3', title: 'First bullpen session', date: '2026-01-22', achieved: true },
    { id: 'm4', title: 'Live BP evaluation', date: '2026-02-05', achieved: true },
    { id: 'm5', title: 'In-game test of adjustments', date: '2026-02-20', achieved: false },
    { id: 'm6', title: 'Mid-program review', date: '2026-03-01', achieved: false },
  ]

  const drills: Drill[] = [
    { id: 'd1', name: 'Towel Drill', description: 'Full delivery with towel to reinforce mechanics and arm path. Focus on extension and release point.', frequency: '3x per week, 20 reps', linkedGoal: goals.find(g => g.metric === 'Location+')?.id || 'g1' },
    { id: 'd2', name: 'Weighted Ball Progressions', description: 'Use 3oz, 5oz, 7oz balls for arm speed and velocity development. Follow Driveline protocols.', frequency: '2x per week, prescribed sets', linkedGoal: goals.find(g => g.metric === 'Avg FB')?.id || 'g1' },
    { id: 'd3', name: 'Flat-Ground Progressions', description: 'Focused secondary pitch work without mound. Build feel for new pitch shapes at sub-max effort.', frequency: '3x per week, 15 min', linkedGoal: goals.find(g => g.metric === 'Arsenal Size')?.id || 'g2' },
    { id: 'd4', name: 'Command Bullpen', description: 'Target-focused bullpen with specific count scenarios. Track first-pitch strike rate and zone accuracy.', frequency: '1x per week, 30 pitches', linkedGoal: goals.find(g => g.metric === 'BB/9')?.id || 'g3' },
  ]

  const notes: Note[] = [
    { id: 'n1', date: '2026-02-12', author: 'Coach Palmer', text: `Strong bullpen today. ${p.arsenal[0].name} sat ${p.avgFB} with good life. ${p.arsenal[1]?.name || 'Secondary'} showed improved depth. Release point more consistent than last session.` },
    { id: 'n2', date: '2026-02-06', author: 'Coach Palmer', text: `Live BP went well. Hitters were uncomfortable against the ${p.arsenal[1]?.name || 'secondary pitch'}. Need to work on landing it for strikes more consistently — too many balls in the dirt.` },
    { id: 'n3', date: '2026-01-28', author: 'Coach Brennan', text: `Initial assessment: ${p.firstName} has a strong foundation. The ${p.arsenal[0].name} plays well at ${p.avgFB}. Main area of improvement is command — too many misses arm-side. Mechanical inconsistency in the stride creates release point variability.` },
  ]

  return { goals, focusAreas, milestones, drills, notes }
}

function statusColor(s: 'on-track' | 'needs-attention' | 'ahead') { return s === 'ahead' ? 'var(--color-positive)' : s === 'on-track' ? 'var(--color-positive)' : 'var(--color-negative)' }
function statusLabel(s: 'on-track' | 'needs-attention' | 'ahead') { return s === 'ahead' ? 'Ahead' : s === 'on-track' ? 'On Track' : 'Needs Attention' }
function priorityColor(p: 'high' | 'medium' | 'low') { return p === 'high' ? 'var(--color-negative)' : p === 'medium' ? 'var(--accent)' : 'var(--color-positive)' }
function progressColor(pct: number) { return pct >= 80 ? 'var(--color-positive)' : pct >= 50 ? 'var(--accent)' : 'var(--color-negative)' }

const cardStyle: React.CSSProperties = {
  background: 'var(--panel)', border: '1px solid var(--orange-border)',
  borderRadius: 10, padding: 24, boxShadow: 'inset 0 1px 0 var(--accent-bg-medium)',
}

const secTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
  textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent)', marginBottom: 18,
}

export default function PitchingCoachDevelopment() {
  const [selectedId, setSelectedId] = useState('')
  const [plan, setPlan] = useState<DevPlan | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [noteText, setNoteText] = useState('')

  const selectedPitcher = pitchingStaff.find(p => p.id === selectedId) || null

  function handleChange(id: string) {
    setSelectedId(id)
    if (!id) { setPlan(null); return }
    const p = pitchingStaff.find(pt => pt.id === id)
    if (p) setPlan(generatePitchingPlan(p))
  }

  function handleAiSuggest() {
    if (!selectedPitcher) return
    setAiLoading(true)
    setTimeout(() => {
      setPlan(generatePitchingPlan(selectedPitcher))
      setAiLoading(false)
    }, 2000)
  }

  function handleAddNote() {
    if (!plan || !noteText.trim()) return
    const n: Note = { id: `n${Date.now()}`, date: new Date().toISOString().split('T')[0], author: 'Coach Palmer', text: noteText.trim() }
    setPlan({ ...plan, notes: [n, ...plan.notes] })
    setNoteText('')
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
      <div className="anim-fade-in" style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--text-bright)', margin: 0, marginBottom: 6 }}>
          Pitcher Development Plans
        </h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>
          Track goals, milestones, and drill recommendations for your pitching staff
        </p>
      </div>

      {/* Selector row */}
      <div className="anim-slide-up anim-delay-1" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <select value={selectedId} onChange={e => handleChange(e.target.value)} style={{
          background: 'var(--panel)', border: '1px solid var(--orange-border)',
          borderRadius: 8, padding: '10px 16px', color: 'var(--text-bright)',
          fontFamily: 'var(--font-body)', fontSize: 14, minWidth: 260, outline: 'none', cursor: 'pointer',
        }}>
          <option value="">Select a pitcher...</option>
          {pitchingStaff.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} — {p.role} ({p.throws}HP)</option>)}
        </select>
        <button onClick={handleAiSuggest} disabled={!selectedPitcher || aiLoading} style={{
          background: 'transparent', border: '1px solid var(--accent)', borderRadius: 8,
          padding: '10px 20px', color: 'var(--accent)',
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
          textTransform: 'uppercase', letterSpacing: '1px',
          cursor: selectedPitcher && !aiLoading ? 'pointer' : 'not-allowed',
          opacity: selectedPitcher ? 1 : 0.4,
          animation: aiLoading ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}>
          {aiLoading ? 'Analyzing...' : 'AI Suggest Plan'}
        </button>
      </div>

      {!plan && (
        <div className="anim-slide-up anim-delay-2" style={{ ...cardStyle, textAlign: 'center', padding: 64, color: 'var(--muted)', fontSize: 15 }}>
          Select a pitcher above to view their development plan.
        </div>
      )}

      {plan && selectedPitcher && (
        <div className="anim-slide-up anim-delay-3" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Goals */}
            <div style={cardStyle}>
              <div style={secTitle}>Goals</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {plan.goals.map(goal => {
                  const pct = goal.metric === 'BB/9'
                    ? Math.min(100, Math.round(((goal.current - goal.target) / (goal.current * 0.3)) * 100))
                    : Math.min(100, Math.round((goal.current / goal.target) * 100))
                  const clampedPct = Math.max(0, Math.min(100, pct))
                  return (
                    <div key={goal.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-bright)', marginBottom: 2 }}>{goal.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                            {goal.metric}: {goal.current} / {goal.target} {goal.unit}
                          </div>
                        </div>
                        <span style={{
                          padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                          letterSpacing: '0.8px', textTransform: 'uppercase',
                          background: `${statusColor(goal.status)}22`, color: statusColor(goal.status),
                        }}>{statusLabel(goal.status)}</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'var(--surface-tint-3)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 4, width: `${clampedPct}%`, background: progressColor(clampedPct), transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Focus Areas */}
            <div style={cardStyle}>
              <div style={secTitle}>Focus Areas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {plan.focusAreas.map(area => (
                  <div key={area.id} style={{ background: 'var(--surface-tint-1)', borderRadius: 8, padding: 16, border: '1px solid var(--surface-tint-2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-bright)' }}>{area.title}</span>
                      <span style={{
                        padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.8px', textTransform: 'uppercase',
                        background: `${priorityColor(area.priority)}22`, color: priorityColor(area.priority),
                      }}>{area.priority}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{area.description}</div>
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
                <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 2, background: 'var(--orange-border)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {plan.milestones.map(ms => (
                    <div key={ms.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: -24, top: 2, width: 12, height: 12, borderRadius: '50%',
                        border: '2px solid', borderColor: ms.achieved ? 'var(--color-positive)' : 'var(--orange-border)',
                        background: ms.achieved ? 'var(--color-positive)' : 'transparent', flexShrink: 0,
                      }} />
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{ms.date}</div>
                        <div style={{ fontSize: 13, color: ms.achieved ? 'var(--text-bright)' : 'var(--muted)', fontWeight: ms.achieved ? 600 : 400 }}>{ms.title}</div>
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
                    <div key={drill.id} style={{ background: 'var(--surface-tint-1)', borderRadius: 8, padding: 16, border: '1px solid var(--surface-tint-2)' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-bright)', marginBottom: 4 }}>{drill.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8 }}>{drill.description}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{drill.frequency}</span>
                        {linkedGoal && (
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--muted)', background: 'var(--surface-tint-2)', padding: '3px 8px', borderRadius: 4 }}>
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
                  <div key={note.id} style={{ borderLeft: '3px solid var(--orange-border)', paddingLeft: 14 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{note.date}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>{note.author}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55 }}>{note.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--orange-border)', paddingTop: 16 }}>
                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a coaching note..." rows={3} style={{
                  width: '100%', background: 'var(--bg)', border: '1px solid var(--orange-border)',
                  borderRadius: 8, padding: 12, color: 'var(--text-bright)',
                  fontFamily: 'var(--font-body)', fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                }} />
                <button onClick={handleAddNote} disabled={!noteText.trim()} style={{
                  marginTop: 10, background: 'var(--accent)', border: 'none', borderRadius: 6,
                  padding: '8px 20px', color: '#1a1a1a',
                  fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: '1px',
                  cursor: noteText.trim() ? 'pointer' : 'not-allowed',
                  opacity: noteText.trim() ? 1 : 0.5,
                }}>Add Note</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
