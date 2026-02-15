import { useState, useEffect } from 'react'
import { players, getPlayerFullName, type Player } from '../../data/players'

const baseballPlayers = players.filter((p) => p.sport === 'Baseball')

const TOOLS = ['Hit', 'Power', 'Run', 'Arm', 'Field', 'Overall'] as const

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const roundTo5 = (v: number) => Math.round(v / 5) * 5

function defaultGrades(p: Player): Record<string, number> {
  const hit = clamp(roundTo5(Math.round((p.avgEV / 92) * 55)), 20, 80)
  const power = clamp(roundTo5(Math.round((p.maxEV / 107) * 60)), 20, 80)
  const run = 50
  const arm = 50
  const field = 50
  const overall = clamp(roundTo5(Math.round((hit + power + run + arm + field) / 5)), 20, 80)
  return { Hit: hit, Power: power, Run: run, Arm: arm, Field: field, Overall: overall }
}

function gradeColor(v: number): string {
  if (v >= 70) return 'var(--color-positive)'
  if (v >= 60) return '#66bb6a'
  if (v >= 50) return '#E0AC44'
  if (v >= 40) return 'var(--color-warning)'
  return 'var(--color-negative)'
}

function generateSummary(p: Player, grades: Record<string, number>): string {
  const power =
    p.maxEV >= 100 ? 'plus raw power' : p.maxEV >= 95 ? 'average raw power' : 'below-average raw power'
  const hitAbility =
    grades.Hit >= 60
      ? 'an advanced feel for the barrel'
      : grades.Hit >= 50
        ? 'a developing hit tool'
        : 'a raw hit tool that needs refinement'
  const batsLabel = p.bats === 'L' ? 'left-handed' : p.bats === 'S' ? 'switch' : 'right-handed'
  return `${getPlayerFullName(p)} is a ${p.age}-year-old ${batsLabel} ${p.position} in the ${p.team} system currently competing at the ${p.level} level. He displays ${power} with a max exit velocity of ${p.maxEV.toFixed(1)} mph and ${hitAbility}, averaging ${p.avgEV.toFixed(1)} mph in exit velocity across ${p.swings.toLocaleString()} tracked swings. His overall profile grades out at a ${grades.Overall} on the 20-80 scale, suggesting a player with ${grades.Overall >= 55 ? 'legitimate upside and a clear path to an everyday role' : 'tools that need further development before reaching his ceiling'}.`
}

function generateStrengths(p: Player, grades: Record<string, number>): string {
  const items: string[] = []
  if (grades.Power >= 55)
    items.push(
      `Plus raw power is the headline tool here — ${p.maxEV.toFixed(1)} mph max exit velocity puts him in elite territory for the ${p.level} level.`
    )
  if (grades.Hit >= 55)
    items.push(
      `Above-average hit tool with consistent barrel accuracy. His ${p.avgEV.toFixed(1)} mph average exit velocity shows he squares the ball up regularly.`
    )
  if (p.avgBS >= 70)
    items.push(
      `Bat speed is a clear asset at ${p.avgBS.toFixed(1)} mph, giving him the ability to catch up to premium velocity.`
    )
  if (items.length === 0)
    items.push(
      `${getPlayerFullName(p)} shows solid fundamentals across the board with a competitive approach at the plate. His bat speed of ${p.avgBS.toFixed(1)} mph gives him a foundation to build on.`
    )
  items.push(
    `At ${p.height} and ${p.weight} lbs, the physical projection is favorable and there may be more power to unlock as he matures into his frame.`
  )
  return items.join(' ')
}

function generateWeaknesses(p: Player, grades: Record<string, number>): string {
  const items: string[] = []
  if (grades.Hit < 50)
    items.push(
      `The hit tool remains a question mark — contact consistency needs to improve before he can be an everyday player.`
    )
  if (grades.Power < 50)
    items.push(
      `Raw power is below-average at this stage, and the game power may play even further down without mechanical adjustments.`
    )
  if (grades.Run <= 45) items.push(`Below-average run times limit his defensive versatility and base-running value.`)
  if (items.length === 0)
    items.push(
      `No glaring weaknesses at this stage, but ${getPlayerFullName(p)} will need to continue refining his approach against upper-level pitching. Swing decisions can be inconsistent against offspeed, and he will need to demonstrate more selectivity as he advances.`
    )
  items.push(
    `Durability and adjustments against advanced pitching at higher levels will ultimately determine his trajectory.`
  )
  return items.join(' ')
}

function generateProjection(p: Player, grades: Record<string, number>): string {
  const ceiling =
    grades.Overall >= 60
      ? 'everyday starter with All-Star upside'
      : grades.Overall >= 50
        ? 'solid regular who can contribute on both sides of the ball'
        : 'bench piece or platoon option at the major league level'
  const timeline = p.level === 'AAA' ? '2026' : p.level === 'AA' ? '2027' : '2028-2029'
  return `Projected as a ${ceiling}. Given his current performance at the ${p.level} level, an ETA of ${timeline} for a major league debut appears realistic. ${getPlayerFullName(p)} has the physical tools and competitive makeup to continue advancing through the system. The key development area will be translating his raw tools into consistent game production against higher-caliber pitching.`
}

function generateComparables(p: Player, grades: Record<string, number>): string {
  const compType =
    grades.Power >= 60
      ? 'power-first'
      : grades.Hit >= 60
        ? 'contact-oriented'
        : 'toolsy, well-rounded'
  return `The profile plays as a ${compType} ${p.position} with a blend of physicality and athleticism. Comparable players at a similar stage of development include mid-round draft picks who leveraged exit velocity gains into meaningful offensive contributions. The swing metrics and physical profile draw loose similarities to players who emerged as productive regulars after refining their approach in the upper minors.`
}

const cardStyle: React.CSSProperties = {
  background: 'var(--panel)',
  border: '1px solid var(--orange-border)',
  borderRadius: 10,
  padding: 24,
  boxShadow: 'inset 0 1px 0 var(--accent-bg-medium)',
}

const secTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  color: 'var(--accent)',
  marginBottom: 18,
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--panel)',
  border: '1px solid var(--orange-border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: 'var(--font-body)',
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 80,
  padding: 12,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--orange-border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 13,
  fontFamily: 'var(--font-body)',
  lineHeight: 1.6,
  resize: 'vertical',
  boxSizing: 'border-box' as const,
}

const generateBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: 'var(--accent)',
  color: '#000',
  border: 'none',
  borderRadius: 8,
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

const exportBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: 'transparent',
  color: 'var(--accent)',
  border: '2px solid var(--accent)',
  borderRadius: 8,
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

export default function ScoutReports() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    baseballPlayers.length > 0 ? baseballPlayers[0].id : ''
  )
  const selectedPlayer = baseballPlayers.find((p) => p.id === selectedPlayerId) || baseballPlayers[0]

  const [grades, setGrades] = useState<Record<string, number>>(() =>
    selectedPlayer ? defaultGrades(selectedPlayer) : { Hit: 50, Power: 50, Run: 50, Arm: 50, Field: 50, Overall: 50 }
  )

  const [generating, setGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  const [reportSections, setReportSections] = useState<Record<string, string>>({
    summary: '',
    strengths: '',
    weaknesses: '',
    projection: '',
    comparables: '',
  })

  useEffect(() => {
    if (selectedPlayer) {
      const newGrades = defaultGrades(selectedPlayer)
      setGrades(newGrades)
      setReportGenerated(false)
    }
  }, [selectedPlayerId])

  // Recalculate Overall whenever other grades change
  useEffect(() => {
    const { Hit, Power, Run, Arm, Field } = grades
    const avg = clamp(roundTo5(Math.round((Hit + Power + Run + Arm + Field) / 5)), 20, 80)
    if (avg !== grades.Overall) {
      setGrades((prev) => ({ ...prev, Overall: avg }))
    }
  }, [grades.Hit, grades.Power, grades.Run, grades.Arm, grades.Field])

  const handleGradeChange = (tool: string, value: number) => {
    setGrades((prev) => ({ ...prev, [tool]: value }))
  }

  const handleGenerate = () => {
    if (!selectedPlayer) return
    setGenerating(true)
    setReportGenerated(false)
    setTimeout(() => {
      setReportSections({
        summary: generateSummary(selectedPlayer, grades),
        strengths: generateStrengths(selectedPlayer, grades),
        weaknesses: generateWeaknesses(selectedPlayer, grades),
        projection: generateProjection(selectedPlayer, grades),
        comparables: generateComparables(selectedPlayer, grades),
      })
      setGenerating(false)
      setReportGenerated(true)
    }, 2500)
  }

  const handleExport = () => {
    alert('PDF export is not available in the demo. In production, this would generate a formatted scouting report PDF.')
  }

  const statItems = selectedPlayer
    ? [
        { label: 'Avg EV', value: `${selectedPlayer.avgEV.toFixed(1)} mph` },
        { label: 'Max EV', value: `${selectedPlayer.maxEV.toFixed(1)} mph` },
        { label: 'Bat Speed', value: `${selectedPlayer.avgBS.toFixed(1)} mph` },
        { label: 'Swings', value: selectedPlayer.swings.toLocaleString() },
        { label: 'Age', value: String(selectedPlayer.age) },
        { label: 'Position', value: selectedPlayer.position },
        { label: 'Level', value: selectedPlayer.level },
        { label: 'Team', value: selectedPlayer.team },
      ]
    : []

  const reportSectionLabels: { key: string; label: string }[] = [
    { key: 'summary', label: 'Summary' },
    { key: 'strengths', label: 'Strengths' },
    { key: 'weaknesses', label: 'Weaknesses' },
    { key: 'projection', label: 'Projection' },
    { key: 'comparables', label: 'Comparables' },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
      {/* Header */}
      <div className="anim-fade-in" style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 28,
            color: 'var(--text-bright)',
            margin: 0,
            marginBottom: 8,
          }}
        >
          Scouting Report Builder
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, fontFamily: 'var(--font-body)' }}>
          Generate professional scouting reports backed by verified data
        </p>
      </div>

      {/* Two-column layout */}
      <div className="anim-slide-up anim-delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 28, alignItems: 'start' }}>
        {/* Left column — Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Player selector */}
          <div style={cardStyle}>
            <div style={secTitle}>Select Player</div>
            <select
              style={selectStyle}
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
            >
              {baseballPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {getPlayerFullName(p)} — {p.position}, {p.team} ({p.level})
                </option>
              ))}
            </select>
          </div>

          {/* Auto-populated metrics */}
          {selectedPlayer && (
            <div style={cardStyle}>
              <div style={secTitle}>Player Metrics</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px 20px',
                }}
              >
                {statItems.map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--muted)',
                        fontFamily: 'var(--font-heading)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: 4,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: 'var(--text-bright)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 20-80 Grade Sliders */}
          <div style={cardStyle}>
            <div style={secTitle}>20-80 Scale Grades</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {TOOLS.map((tool) => {
                const value = grades[tool] ?? 50
                const color = gradeColor(value)
                const isOverall = tool === 'Overall'
                return (
                  <div key={tool}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: isOverall ? 700 : 500,
                          color: isOverall ? 'var(--accent)' : 'var(--text)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {tool}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: color,
                          fontFamily: 'var(--font-mono)',
                          minWidth: 28,
                          textAlign: 'right',
                        }}
                      >
                        {value}
                      </span>
                    </div>
                    {/* Progress bar background */}
                    <div
                      style={{
                        position: 'relative',
                        height: 6,
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: 3,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          width: `${((value - 20) / 60) * 100}%`,
                          background: color,
                          borderRadius: 3,
                          transition: 'width 0.15s ease, background 0.15s ease',
                        }}
                      />
                    </div>
                    {!isOverall && (
                      <input
                        type="range"
                        min={20}
                        max={80}
                        step={5}
                        value={value}
                        onChange={(e) => handleGradeChange(tool, Number(e.target.value))}
                        style={{
                          width: '100%',
                          margin: 0,
                          cursor: 'pointer',
                          accentColor: color,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Generate button */}
          <button
            style={{
              ...generateBtnStyle,
              opacity: generating ? 0.7 : 1,
            }}
            onClick={handleGenerate}
            disabled={generating || !selectedPlayer}
          >
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {/* Right column — Report output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {generating && (
            <div
              style={{
                ...cardStyle,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '3px solid var(--orange-border)',
                  borderTopColor: 'var(--accent)',
                  animation: 'spin 1s linear infinite',
                  marginBottom: 20,
                }}
              />
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: 'var(--accent)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              >
                Generating report...
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                Analyzing player data and building scouting profile
              </div>
              <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
              `}</style>
            </div>
          )}

          {!generating && !reportGenerated && (
            <div
              style={{
                ...cardStyle,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.25 }}>&#128203;</div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: 16,
                  color: 'var(--text-bright)',
                  marginBottom: 8,
                }}
              >
                No Report Generated
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 280, lineHeight: 1.6 }}>
                Select a player, adjust the tool grades, and click "Generate Report" to build a professional scouting
                report.
              </div>
            </div>
          )}

          {!generating && reportGenerated && selectedPlayer && (
            <>
              {/* Report header */}
              <div style={cardStyle}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: 20,
                        color: 'var(--text-bright)',
                      }}
                    >
                      {getPlayerFullName(selectedPlayer)}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                      {selectedPlayer.position} &middot; {selectedPlayer.team} &middot; {selectedPlayer.level} &middot;
                      Age {selectedPlayer.age}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: 28,
                      color: gradeColor(grades.Overall),
                    }}
                  >
                    {grades.Overall}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--muted)',
                        marginLeft: 4,
                        fontFamily: 'var(--font-heading)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      OFP
                    </span>
                  </div>
                </div>

                {/* Grade overview bars */}
                <div style={secTitle}>Tool Grades</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {TOOLS.map((tool) => {
                    const value = grades[tool] ?? 50
                    const color = gradeColor(value)
                    return (
                      <div key={tool} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span
                          style={{
                            width: 60,
                            fontSize: 12,
                            fontWeight: tool === 'Overall' ? 700 : 500,
                            color: tool === 'Overall' ? 'var(--accent)' : 'var(--text)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {tool}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: 10,
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: 5,
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              height: '100%',
                              width: `${((value - 20) / 60) * 100}%`,
                              background: color,
                              borderRadius: 5,
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            width: 28,
                            textAlign: 'right',
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: color,
                          }}
                        >
                          {value}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Editable report sections */}
              {reportSectionLabels.map(({ key, label }) => (
                <div key={key} style={cardStyle}>
                  <div style={secTitle}>{label}</div>
                  <textarea
                    style={textareaStyle}
                    value={reportSections[key]}
                    onChange={(e) =>
                      setReportSections((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    rows={4}
                  />
                </div>
              ))}

              {/* Export PDF button */}
              <button style={exportBtnStyle} onClick={handleExport}>
                Export PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
