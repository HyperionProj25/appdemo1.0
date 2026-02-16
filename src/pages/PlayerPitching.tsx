import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import AIPanel from '../components/AIPanel'
import RadarChart from '../components/RadarChart'
import DonutGauge from '../components/DonutGauge'
import PitchTooltip from '../components/PitchTooltip'
import FilterLegend from '../components/FilterLegend'
import { getPlayer, getPlayerName } from '../data/players'
import { playerSuggestions, getPlayerAIResponse } from '../data/mockAI'
import { getPitcherForPlayer, pitchColors, pitchingBenchmarks, normalizePitching } from '../data/csvStats'
import type { PitchDot, MovementDot, ReleaseDot } from '../data/csvStats'

const PITCH_TYPES = ['FB', 'CB', 'CH', 'SL', 'CT']
const PITCH_FILTER_ITEMS = PITCH_TYPES.map(k => ({ key: k, label: k, color: pitchColors[k] }))

interface DotId { plot: 'sz' | 'mv' | 'rp'; idx: number }

export default function PlayerPitching() {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const player = getPlayer(playerId || '3000002')
  const [mode, setMode] = useState<'training' | 'live'>('training')
  const [showAI, setShowAI] = useState(false)
  const [activeTypes, setActiveTypes] = useState<Set<string>>(() => new Set(PITCH_TYPES))
  const [dotCount, setDotCount] = useState(0)
  const [fadeKey, setFadeKey] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Hover / select state
  const [hoveredDot, setHoveredDot] = useState<DotId | null>(null)
  const [selectedDot, setSelectedDot] = useState<DotId | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const szRef = useRef<HTMLDivElement>(null)
  const mvRef = useRef<HTMLDivElement>(null)
  const rpRef = useRef<HTMLDivElement>(null)

  const pitcher = getPitcherForPlayer(playerId || '3000002')

  if (!player) return <div style={{ padding: 40, color: '#fff' }}>Player not found</div>
  const name = getPlayerName(player)

  const pitchTypes = mode === 'training' ? pitcher.trainingPitchTypes : pitcher.livePitchTypes
  const allDots = mode === 'training' ? pitcher.trainingDots : pitcher.liveDots
  const allMovement = mode === 'training' ? pitcher.trainingMovementDots : pitcher.liveMovementDots
  const allRelease = mode === 'training' ? pitcher.trainingReleaseDots : pitcher.liveReleaseDots

  // Build index map: for each dot in allDots, track its original index so cross-plot works
  // After filtering, filteredDots[i] came from allDots[szOrigIdx[i]]
  const szOrigIdx: number[] = []
  const filteredDots = allDots.filter((d, i) => { if (activeTypes.has(d.type)) { szOrigIdx.push(i); return true } return false })
  const mvOrigIdx: number[] = []
  const filteredMovement = allMovement.filter((d, i) => { if (activeTypes.has(d.type)) { mvOrigIdx.push(i); return true } return false })
  const rpOrigIdx: number[] = []
  const filteredRelease = allRelease.filter((d, i) => { if (activeTypes.has(d.type)) { rpOrigIdx.push(i); return true } return false })
  const filteredPitchTypes = pitchTypes.filter(pt => activeTypes.has(pt.abbr))

  const fbOffset = mode === 'live' ? 2 : 0
  const pitchCountOffset = mode === 'live' ? 18 : 0

  const fbType = pitchTypes.find(pt => pt.abbr === 'FB')
  const avgSpin = fbType ? fbType.spin : 2400
  const weakContact = 32
  const radarValues = normalizePitching(pitcher.avgFB + fbOffset, avgSpin, weakContact)

  // Stagger dots + clear selection on mode change
  useEffect(() => {
    setDotCount(0)
    setFadeKey(k => k + 1)
    setHoveredDot(null)
    setSelectedDot(null)
    setTooltipPos(null)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDotCount(i)
      if (i >= filteredDots.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [mode, filteredDots.length])

  // Filter toggle
  const handleToggle = useCallback((key: string) => {
    setActiveTypes(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      if (next.size === 0) return prev // don't allow empty
      return next
    })
    setSelectedDot(null)
    setHoveredDot(null)
    setTooltipPos(null)
  }, [])

  const handleReset = useCallback(() => {
    setActiveTypes(new Set(PITCH_TYPES))
    setSelectedDot(null)
    setHoveredDot(null)
    setTooltipPos(null)
  }, [])

  // Helpers for dot events
  const getMousePos = (e: React.MouseEvent, container: HTMLDivElement | null): { x: number; y: number } => {
    if (!container) return { x: 0, y: 0 }
    const rect = container.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleDotEnter = (plot: DotId['plot'], idx: number, e: React.MouseEvent, container: HTMLDivElement | null) => {
    setHoveredDot({ plot, idx })
    setTooltipPos(getMousePos(e, container))
  }

  const handleDotLeave = () => {
    setHoveredDot(null)
    if (!selectedDot) setTooltipPos(null)
  }

  const handleDotClick = (plot: DotId['plot'], idx: number, e: React.MouseEvent, container: HTMLDivElement | null) => {
    e.stopPropagation()
    if (selectedDot?.plot === plot && selectedDot?.idx === idx) {
      setSelectedDot(null)
      setTooltipPos(null)
    } else {
      setSelectedDot({ plot, idx })
      setTooltipPos(getMousePos(e, container))
    }
  }

  const handleBgClick = () => {
    setSelectedDot(null)
    setTooltipPos(null)
  }

  // Resolve a DotId to its original (unfiltered) index in allDots
  const toOrigIdx = (dotId: DotId): number => {
    if (dotId.plot === 'sz') return szOrigIdx[dotId.idx] ?? -1
    if (dotId.plot === 'mv') return mvOrigIdx[dotId.idx] ?? -1
    return rpOrigIdx[dotId.idx] ?? -1
  }

  // Dot visual state helpers — cross-plot: same original pitch index highlights on all charts
  const dotState = (plot: DotId['plot'], idx: number) => {
    const origMap = plot === 'sz' ? szOrigIdx : plot === 'mv' ? mvOrigIdx : rpOrigIdx
    const myOrigIdx = origMap[idx] ?? -1

    const isHovered = hoveredDot?.plot === plot && hoveredDot?.idx === idx
    const isCrossHover = hoveredDot !== null && !isHovered && toOrigIdx(hoveredDot) === myOrigIdx
    const isSelected = selectedDot !== null && toOrigIdx(selectedDot) === myOrigIdx
    const hasSelection = selectedDot !== null
    return { isHovered: isHovered || isCrossHover, isSelected, hasSelection }
  }

  const dotRadius = (base: number, isHovered: boolean, isSelected: boolean) => {
    if (isHovered) return base * 1.8
    if (isSelected) return base * 1.5
    return base
  }

  const dotOpacity = (isHovered: boolean, isSelected: boolean, hasSelection: boolean) => {
    if (isHovered || isSelected) return 1.0
    if (hasSelection) return 0.3
    return 0.85
  }

  const dotStroke = (isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return { stroke: '#fff', strokeWidth: 0.6 }
    if (isHovered) return { stroke: '#fff', strokeWidth: 0.4 }
    return {}
  }

  // Tooltip fields
  const szTooltipFields = (d: PitchDot) => [
    { label: 'Pitch', value: d.type },
    { label: 'Velo', value: `${d.velo} mph` },
    { label: 'Spin', value: `${Math.round(d.spin)} rpm` },
    { label: 'V Break', value: `${d.vBreak} in` },
    { label: 'H Break', value: `${d.hBreak} in` },
  ]

  const mvTooltipFields = (d: MovementDot) => [
    { label: 'Pitch', value: d.type },
    { label: 'HB', value: `${d.x} in` },
    { label: 'IVB', value: `${d.y} in` },
    { label: 'Velo', value: `${d.velo} mph` },
  ]

  const rpTooltipFields = (d: ReleaseDot) => [
    { label: 'Pitch', value: d.type },
    { label: 'Velo', value: `${d.velo} mph` },
    { label: 'Height', value: `${d.cy} ft` },
    { label: 'Offset', value: `${d.cx} ft` },
  ]

  // Active tooltip data
  const activeDotId = selectedDot || hoveredDot
  let tooltipFields: { label: string; value: string | number }[] | null = null
  let tooltipColor: string | undefined
  let tooltipContainerW = 0, tooltipContainerH = 0

  if (activeDotId && tooltipPos) {
    const ref = activeDotId.plot === 'sz' ? szRef : activeDotId.plot === 'mv' ? mvRef : rpRef
    if (ref.current) {
      tooltipContainerW = ref.current.offsetWidth
      tooltipContainerH = ref.current.offsetHeight
    }
    if (activeDotId.plot === 'sz') {
      const d = filteredDots[activeDotId.idx]
      if (d) { tooltipFields = szTooltipFields(d); tooltipColor = pitchColors[d.type] }
    } else if (activeDotId.plot === 'mv') {
      const d = filteredMovement[activeDotId.idx]
      if (d) { tooltipFields = mvTooltipFields(d); tooltipColor = pitchColors[d.type] }
    } else {
      const d = filteredRelease[activeDotId.idx]
      if (d) { tooltipFields = rpTooltipFields(d); tooltipColor = pitchColors[d.type] }
    }
  }

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Sidebar playerName={name} playerId={playerId} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '20px 28px 14px' }}>
        {/* Header */}
        <div className="anim-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, justifyContent: 'center', flexShrink: 0 }}>
          <img src="/branding/icon.png" alt="" style={{ width: 40 }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, letterSpacing: '5px', textTransform: 'uppercase' }}>BASELINE PITCHING</h1>
        </div>

        {/* Controls */}
        <div className="anim-fade-in anim-delay-1" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <FilterLegend items={PITCH_FILTER_ITEMS} active={activeTypes} onToggle={handleToggle} onReset={handleReset} />
            <button className="btn" disabled title="Coming soon">DATE</button>
          </div>
          <div style={{ display: 'flex', border: '1px solid var(--orange-border)', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={() => setMode('training')} style={{ padding: '10px 26px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.5px', cursor: 'pointer', border: 'none', borderRight: '1px solid var(--orange-border)', background: mode === 'training' ? 'var(--accent)' : 'transparent', color: mode === 'training' ? '#000' : 'var(--muted)', transition: 'all 0.15s' }}>TRAINING</button>
            <button onClick={() => setMode('live')} style={{ padding: '10px 26px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.5px', cursor: 'pointer', border: 'none', background: mode === 'live' ? 'var(--accent)' : 'transparent', color: mode === 'live' ? '#000' : 'var(--muted)', transition: 'all 0.15s' }}>LIVE</button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0, overflow: 'auto' }}>
          {/* Top row: Summary + Stack Up */}
          <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
            <div className="anim-slide-up anim-delay-2" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 8, padding: '18px 22px', boxShadow: 'inset 0 1px 0 var(--accent)' }}>
              <div style={secHead}>PLAYER SUMMARY</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                {[
                  { label: 'AVG FB', val: `${pitcher.avgFB + fbOffset}`, unit: 'MPH', highlight: false },
                  { label: 'MAX FB', val: `${pitcher.maxFB + fbOffset}`, unit: 'MPH', highlight: true },
                  { label: 'AVG BS', val: `${pitcher.avgBS}`, unit: 'MPH', highlight: false },
                  { label: 'PITCHES', val: `${pitcher.pitches + pitchCountOffset}`, unit: '', highlight: false },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, letterSpacing: '1.2px', textTransform: 'uppercase', color: s.highlight ? 'var(--accent)' : 'var(--muted)', marginBottom: 5 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 22, color: 'var(--text-bright)', background: '#1e1e1e', borderRadius: 8, padding: '7px 10px', border: '1px solid #2a2a2a' }}>
                      {s.val}{s.unit && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', marginLeft: 4 }}>{s.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="anim-slide-up anim-delay-3" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 8, padding: '18px 22px', boxShadow: 'inset 0 1px 0 var(--accent)', display: 'flex', flexDirection: 'column' }}>
              <div style={secHead}>HOW YOU STACK UP</div>
              <RadarChart
                values={radarValues}
                labels={['FB Velo', 'WC', 'FB Spin']}
                benchmarks={pitchingBenchmarks}
                size={200}
              />
            </div>
          </div>

          {/* Bottom row: Pitch Usage | Strike Zone | Movement | Release */}
          <div key={fadeKey} className="tab-content-enter" style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
            {/* Pitch type usage with DonutGauge */}
            <div className="anim-slide-up anim-delay-4" style={{ width: 220, minWidth: 220, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 8, padding: '16px', boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', overflow: 'auto' }}>
              <div style={secHead2}>PITCH USAGE</div>
              {filteredPitchTypes.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, width: 26, color: 'var(--text)', flexShrink: 0 }}>{pt.abbr}</div>
                  <div style={{ flexShrink: 0 }}>
                    <DonutGauge value={pt.usage} label={`${pt.usage}`} size={68} color={pt.color} strokeWidth={5} />
                  </div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.5, fontSize: 10, fontFamily: 'var(--font-mono)' }}>
                    <div>Velo: {pt.velo}</div>
                    <div>VB: {pt.vBreak}</div>
                    <div>HB: {pt.hBreak}</div>
                    <div>Spin: {pt.spin}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strike Zone / Session Analysis — zoomed so zone fills chart */}
            <div className="anim-slide-up anim-delay-5" ref={szRef} style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 8, padding: '16px', boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }} onClick={handleBgClick}>
              <div style={secHead2}>SESSION ANALYSIS</div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="22 8 56 62" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                  {/* Strike zone rect */}
                  <rect x="36" y="21" width="28" height="32" fill="none" stroke="rgba(150,150,150,0.35)" strokeWidth="0.5" />
                  {/* 3x3 zone grid */}
                  <line x1="36" y1="31.7" x2="64" y2="31.7" stroke="rgba(120,120,120,0.1)" strokeWidth="0.25" />
                  <line x1="36" y1="42.3" x2="64" y2="42.3" stroke="rgba(120,120,120,0.1)" strokeWidth="0.25" />
                  <line x1="45.3" y1="21" x2="45.3" y2="53" stroke="rgba(120,120,120,0.1)" strokeWidth="0.25" />
                  <line x1="54.7" y1="21" x2="54.7" y2="53" stroke="rgba(120,120,120,0.1)" strokeWidth="0.25" />
                  {filteredDots.slice(0, dotCount).map((d, i) => {
                    const { isHovered, isSelected, hasSelection } = dotState('sz', i)
                    const r = dotRadius(1.3, isHovered, isSelected)
                    const op = dotOpacity(isHovered, isSelected, hasSelection)
                    const st = dotStroke(isHovered, isSelected)
                    return (
                      <circle
                        key={i} cx={d.x} cy={d.y} r={r}
                        fill={pitchColors[d.type] || '#888'}
                        opacity={op}
                        style={{ cursor: 'pointer', transition: 'r 0.15s, opacity 0.15s' }}
                        {...st}
                        onMouseEnter={e => handleDotEnter('sz', i, e, szRef.current)}
                        onMouseLeave={handleDotLeave}
                        onClick={e => handleDotClick('sz', i, e, szRef.current)}
                      />
                    )
                  })}
                </svg>
              </div>
              {activeDotId?.plot === 'sz' && tooltipFields && tooltipPos && (
                <PitchTooltip fields={tooltipFields} x={tooltipPos.x} y={tooltipPos.y} accentColor={tooltipColor} containerW={tooltipContainerW} containerH={tooltipContainerH} />
              )}
            </div>

            {/* Movement Plot — HB vs IVB, skinnier */}
            <div className="anim-slide-up anim-delay-6" ref={mvRef} style={{ flex: 0.7, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 8, padding: '16px', boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }} onClick={handleBgClick}>
              <div style={secHead2}>MOVEMENT PLOT</div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                  {[-20, -10, 0, 10, 20].map(v => {
                    const svgX = 50 + (v / 25) * 40
                    const svgY = 48 - (v / 25) * 40
                    return (
                      <g key={v}>
                        <line x1={svgX} y1="8" x2={svgX} y2="88" stroke="rgba(80,80,80,0.12)" strokeWidth="0.25" />
                        <line x1="10" y1={svgY} x2="90" y2={svgY} stroke="rgba(80,80,80,0.12)" strokeWidth="0.25" />
                      </g>
                    )
                  })}
                  <line x1="10" y1="48" x2="90" y2="48" stroke="rgba(120,120,120,0.3)" strokeWidth="0.35" />
                  <line x1="50" y1="8" x2="50" y2="88" stroke="rgba(120,120,120,0.3)" strokeWidth="0.35" />
                  <text x="50" y="96" fill="var(--muted)" fontSize="4.5" textAnchor="middle" fontWeight="600">HB (in)</text>
                  <text x="3" y="48" fill="var(--muted)" fontSize="4.5" textAnchor="middle" fontWeight="600" transform="rotate(-90, 3, 48)">IVB (in)</text>
                  {[-20, -10, 0, 10, 20].map(v => (
                    <g key={`t${v}`}>
                      <text x={50 + (v / 25) * 40} y="92" fill="var(--muted)" fontSize="3.5" textAnchor="middle">{v}</text>
                      <text x="8" y={49 - (v / 25) * 40} fill="var(--muted)" fontSize="3.5" textAnchor="end">{v}</text>
                    </g>
                  ))}
                  {filteredMovement.map((d, i) => {
                    const cx = 50 + (d.x / 25) * 40
                    const cy = 48 - (d.y / 25) * 40
                    const { isHovered, isSelected, hasSelection } = dotState('mv', i)
                    const r = dotRadius(1.3, isHovered, isSelected)
                    const op = dotOpacity(isHovered, isSelected, hasSelection)
                    const st = dotStroke(isHovered, isSelected)
                    return (
                      <circle
                        key={i} cx={cx} cy={cy} r={r}
                        fill={pitchColors[d.type] || '#888'}
                        opacity={op}
                        style={{ cursor: 'pointer', transition: 'r 0.15s, opacity 0.15s' }}
                        {...st}
                        onMouseEnter={e => handleDotEnter('mv', i, e, mvRef.current)}
                        onMouseLeave={handleDotLeave}
                        onClick={e => handleDotClick('mv', i, e, mvRef.current)}
                      />
                    )
                  })}
                </svg>
              </div>
              {activeDotId?.plot === 'mv' && tooltipFields && tooltipPos && (
                <PitchTooltip fields={tooltipFields} x={tooltipPos.x} y={tooltipPos.y} accentColor={tooltipColor} containerW={tooltipContainerW} containerH={tooltipContainerH} />
              )}
            </div>

            {/* Release Point — clean chart, no stick figure */}
            <div className="anim-slide-up anim-delay-7" ref={rpRef} style={{ flex: 0.6, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 8, padding: '16px', boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }} onClick={handleBgClick}>
              <div style={secHead2}>RELEASE POINT</div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                  {/* Grid lines */}
                  {[-2, -1, 0, 1, 2].map(v => {
                    const svgX = 50 + (v / 3) * 38
                    return <line key={`vg${v}`} x1={svgX} y1="10" x2={svgX} y2="90" stroke="rgba(80,80,80,0.1)" strokeWidth="0.25" />
                  })}
                  {[4, 5, 6].map(v => {
                    const svgY = 90 - ((v - 3) / 4) * 80
                    return <line key={`hg${v}`} x1="12" y1={svgY} x2="88" y2={svgY} stroke="rgba(80,80,80,0.1)" strokeWidth="0.25" />
                  })}
                  {/* Crosshair at typical release area */}
                  <line x1="12" y1="30" x2="88" y2="30" stroke="rgba(120,120,120,0.15)" strokeWidth="0.25" strokeDasharray="2,2" />
                  <line x1="63" y1="10" x2="63" y2="90" stroke="rgba(120,120,120,0.15)" strokeWidth="0.25" strokeDasharray="2,2" />
                  {/* Axis labels */}
                  <text x="50" y="97" fill="var(--muted)" fontSize="4" textAnchor="middle" fontWeight="600">HORIZ. OFFSET (ft)</text>
                  <text x="5" y="50" fill="var(--muted)" fontSize="4" textAnchor="middle" fontWeight="600" transform="rotate(-90, 5, 50)">HEIGHT (ft)</text>
                  {/* Tick labels */}
                  {[-2, -1, 0, 1, 2].map(v => (
                    <text key={`xt${v}`} x={50 + (v / 3) * 38} y="93" fill="var(--muted)" fontSize="3.5" textAnchor="middle">{v}</text>
                  ))}
                  {[3, 4, 5, 6, 7].map(v => (
                    <text key={`yt${v}`} x="10" y={91 - ((v - 3) / 4) * 80} fill="var(--muted)" fontSize="3.5" textAnchor="end">{v}</text>
                  ))}
                  {/* Data dots */}
                  {filteredRelease.map((d, i) => {
                    const cx = 50 + (d.cx / 3) * 38
                    const cy = 90 - ((d.cy - 3) / 4) * 80
                    const { isHovered, isSelected, hasSelection } = dotState('rp', i)
                    const r = dotRadius(2.2, isHovered, isSelected)
                    const op = dotOpacity(isHovered, isSelected, hasSelection) * d.opacity
                    const st = dotStroke(isHovered, isSelected)
                    return (
                      <circle
                        key={i} cx={cx} cy={cy} r={r}
                        fill={pitchColors[d.type] || 'var(--accent)'}
                        opacity={op}
                        style={{ cursor: 'pointer', transition: 'r 0.15s, opacity 0.15s' }}
                        {...st}
                        onMouseEnter={e => handleDotEnter('rp', i, e, rpRef.current)}
                        onMouseLeave={handleDotLeave}
                        onClick={e => handleDotClick('rp', i, e, rpRef.current)}
                      />
                    )
                  })}
                </svg>
              </div>
              {activeDotId?.plot === 'rp' && tooltipFields && tooltipPos && (
                <PitchTooltip fields={tooltipFields} x={tooltipPos.x} y={tooltipPos.y} accentColor={tooltipColor} containerW={tooltipContainerW} containerH={tooltipContainerH} />
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '8px 0', flexShrink: 0 }}>
            <button style={{ padding: '10px 20px', background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 8, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, color: 'var(--accent)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1.2px', transition: 'all 0.2s' }} onClick={() => navigate(`/player/${playerId}/pitching/metrics`)} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,172,68,0.1)'; e.currentTarget.style.borderColor = 'var(--accent)' }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--panel)'; e.currentTarget.style.borderColor = 'var(--orange-border)' }}>VIEW METRICS &rarr;</button>
          </div>
        </div>
      </div>

      {showAI ? (
        <div style={{ position: 'relative' }}>
          <button style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: 'var(--panel)', border: '1px solid var(--card-border)', color: 'var(--text)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }} onClick={() => setShowAI(false)}>&times;</button>
          <AIPanel suggestions={playerSuggestions} onQuery={(q) => getPlayerAIResponse(q, name)} />
        </div>
      ) : (
        <button style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 10, padding: '14px 18px', cursor: 'pointer', zIndex: 100 }} onClick={() => setShowAI(true)}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, color: 'var(--text)', textAlign: 'center' as const, lineHeight: 1.3 }}>TALK TO<br />YOUR DATA</span>
          <img src="/branding/icon.png" alt="" style={{ width: 34 }} />
        </button>
      )}
    </div>
  )
}

const secHead: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text)', textAlign: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--orange-border)' }
const secHead2: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text-bright)', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--orange-border)', flexShrink: 0 }
