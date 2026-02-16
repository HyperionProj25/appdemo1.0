import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import AIPanel from '../components/AIPanel'
import RadarChart from '../components/RadarChart'
import PitchTooltip from '../components/PitchTooltip'
import FilterLegend from '../components/FilterLegend'
import { getPlayer, getPlayerName } from '../data/players'
import { playerSuggestions, getPlayerAIResponse } from '../data/mockAI'
import { getBatterStats, hittingBenchmarks, normalizeHitting, SPRAY_ZONES, getSprayZone, pitchColors } from '../data/csvStats'
import type { ScatterDot, ContactDot } from '../data/csvStats'

const TC: Record<string, string> = {
  popup: 'var(--color-popup)',
  linedrive: 'var(--color-linedrive)',
  flyball: 'var(--color-flyball)',
  groundball: 'var(--color-groundball)',
}

const HIT_TYPES = ['popup', 'linedrive', 'flyball', 'groundball']
const HIT_FILTER_ITEMS = [
  { key: 'popup', label: 'POP-UP', color: 'var(--color-popup)' },
  { key: 'linedrive', label: 'LINE', color: 'var(--color-linedrive)' },
  { key: 'flyball', label: 'FLY', color: 'var(--color-flyball)' },
  { key: 'groundball', label: 'GB', color: 'var(--color-groundball)' },
]

const ALL_ZONES = SPRAY_ZONES.map(z => z.key)

const LIVE_PITCH_TYPES = ['FB', 'CB', 'CH', 'SL', 'CT']
const LIVE_PITCH_FILTER_ITEMS = LIVE_PITCH_TYPES.map(k => ({ key: k, label: k, color: pitchColors[k] }))
const VELO_RANGES = [
  { key: '<85', label: '<85', min: 0, max: 84.9 },
  { key: '85-90', label: '85-90', min: 85, max: 90 },
  { key: '90-95', label: '90-95', min: 90, max: 95 },
  { key: '95+', label: '95+', min: 95, max: 999 },
]

interface DotId { plot: 'sa' | 'cp'; idx: number }

export default function PlayerDashboard() {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const player = getPlayer(playerId || '3000002')
  const [mode, setMode] = useState<'training' | 'live'>('training')
  const [showAI, setShowAI] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [dotCount, setDotCount] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeHitTypes, setActiveHitTypes] = useState<Set<string>>(() => new Set(HIT_TYPES))
  const [activeZones, setActiveZones] = useState<Set<string>>(() => new Set(ALL_ZONES))
  const [zoneFilter, setZoneFilter] = useState<'all' | 'in' | 'out'>('all')
  const [activePitchTypes, setActivePitchTypes] = useState<Set<string>>(() => new Set(LIVE_PITCH_TYPES))
  const [activeVeloRanges, setActiveVeloRanges] = useState<Set<string>>(() => new Set(VELO_RANGES.map(v => v.key)))

  // Hover / select state
  const [hoveredDot, setHoveredDot] = useState<DotId | null>(null)
  const [selectedDot, setSelectedDot] = useState<DotId | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const saRef = useRef<HTMLDivElement>(null)
  const cpRef = useRef<HTMLDivElement>(null)

  const stats = getBatterStats(playerId || '3000002')

  useEffect(() => { setMounted(true) }, [])

  const allDots = mode === 'training' ? stats.trainingDots : stats.liveDots
  const allCdots = mode === 'training' ? stats.trainingContact : stats.liveContact
  const allZonesActive = activeZones.size === ALL_ZONES.length

  // In zone / out of zone percentages
  const inZoneCount = allDots.filter(d => d.inZone).length
  const inZonePct = allDots.length ? +(inZoneCount / allDots.length * 100).toFixed(1) : 0
  const outZonePct = allDots.length ? +((allDots.length - inZoneCount) / allDots.length * 100).toFixed(1) : 0

  // Live mode filter helper
  const passesLiveFilters = (d: ScatterDot | ContactDot) => {
    if (mode !== 'live') return true
    if (d.pitchType && !activePitchTypes.has(d.pitchType)) return false
    if (d.pitchVelo !== undefined) {
      const allVeloActive = activeVeloRanges.size === VELO_RANGES.length
      if (!allVeloActive) {
        const matchesVelo = VELO_RANGES.some(vr => activeVeloRanges.has(vr.key) && d.pitchVelo! >= vr.min && d.pitchVelo! <= vr.max)
        if (!matchesVelo) return false
      }
    }
    return true
  }

  // Cross-filter: hit type + spray zone + zone filter + live filters
  const dots = allDots.filter(d =>
    activeHitTypes.has(d.type) &&
    (allZonesActive || activeZones.has(getSprayZone(d.dir))) &&
    (zoneFilter === 'all' || (zoneFilter === 'in' ? d.inZone : !d.inZone)) &&
    passesLiveFilters(d)
  )
  const cdots = allCdots.filter(d =>
    activeHitTypes.has(d.type) &&
    (allZonesActive || activeZones.has(getSprayZone(d.dir))) &&
    (zoneFilter === 'all' || (zoneFilter === 'in' ? d.inZone : !d.inZone)) &&
    passesLiveFilters(d)
  )

  // Compute average contact zone for filtered dots (for the highlight box)
  const avgContactZone = useMemo(() => {
    if (cdots.length < 3 || (allZonesActive && activeHitTypes.size === HIT_TYPES.length)) return null
    const sumX = cdots.reduce((s, d) => s + d.x, 0) / cdots.length
    const sumY = cdots.reduce((s, d) => s + d.y, 0) / cdots.length
    // Standard deviation for zone size
    const sdX = Math.sqrt(cdots.reduce((s, d) => s + (d.x - sumX) ** 2, 0) / cdots.length)
    const sdY = Math.sqrt(cdots.reduce((s, d) => s + (d.y - sumY) ** 2, 0) / cdots.length)
    return { cx: sumX, cy: sumY, w: Math.max(5, sdX * 0.8), h: Math.max(5, sdY * 0.8) }
  }, [cdots, allZonesActive, activeHitTypes.size])

  // Average session zone for strike zone highlight
  const avgSessionZone = useMemo(() => {
    if (dots.length < 3 || (allZonesActive && activeHitTypes.size === HIT_TYPES.length)) return null
    const sumX = dots.reduce((s, d) => s + d.x, 0) / dots.length
    const sumY = dots.reduce((s, d) => s + d.y, 0) / dots.length
    const sdX = Math.sqrt(dots.reduce((s, d) => s + (d.x - sumX) ** 2, 0) / dots.length)
    const sdY = Math.sqrt(dots.reduce((s, d) => s + (d.y - sumY) ** 2, 0) / dots.length)
    return { cx: sumX, cy: sumY, w: Math.max(5, sdX * 0.8), h: Math.max(5, sdY * 0.8) }
  }, [dots, allZonesActive, activeHitTypes.size])

  // Spray zone distribution (computed from actual dots, always sums to 100%)
  const ofSpray = mode === 'training' ? stats.outfieldSpray : stats.liveOutfieldSpray
  const ifSpray = mode === 'training' ? stats.infieldSpray : stats.liveInfieldSpray

  useEffect(() => {
    setDotCount(0)
    setHoveredDot(null)
    setSelectedDot(null)
    setTooltipPos(null)
    setZoneFilter('all')
    setActivePitchTypes(new Set(LIVE_PITCH_TYPES))
    setActiveVeloRanges(new Set(VELO_RANGES.map(v => v.key)))
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
  const radarValues = normalizeHitting(player.avgEV + evo, player.avgBS + bso, player.swings)

  // Hit type filter handlers
  const handleToggle = useCallback((key: string) => {
    setActiveHitTypes(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      if (next.size === 0) return prev
      return next
    })
    setSelectedDot(null); setHoveredDot(null); setTooltipPos(null)
  }, [])

  const handleReset = useCallback(() => {
    setActiveHitTypes(new Set(HIT_TYPES))
    setSelectedDot(null); setHoveredDot(null); setTooltipPos(null)
  }, [])

  // Spray zone toggle handlers
  const handleZoneToggle = useCallback((key: string) => {
    setActiveZones(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      if (next.size === 0) return prev
      return next
    })
    setSelectedDot(null); setHoveredDot(null); setTooltipPos(null)
  }, [])

  const handleZoneReset = useCallback(() => {
    setActiveZones(new Set(ALL_ZONES))
    setSelectedDot(null); setHoveredDot(null); setTooltipPos(null)
  }, [])

  // Live pitch type filter handlers
  const handlePitchTypeToggle = useCallback((key: string) => {
    setActivePitchTypes(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      if (next.size === 0) return prev
      return next
    })
    setSelectedDot(null); setHoveredDot(null); setTooltipPos(null)
  }, [])

  const handlePitchTypeReset = useCallback(() => {
    setActivePitchTypes(new Set(LIVE_PITCH_TYPES))
    setSelectedDot(null); setHoveredDot(null); setTooltipPos(null)
  }, [])

  // Velocity range toggle
  const handleVeloToggle = useCallback((key: string) => {
    setActiveVeloRanges(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      if (next.size === 0) return prev
      return next
    })
    setSelectedDot(null); setHoveredDot(null); setTooltipPos(null)
  }, [])

  // Dot event helpers
  const getMousePos = (e: React.MouseEvent, container: HTMLDivElement | null) => {
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
    if (selectedDot?.idx === idx) {
      setSelectedDot(null); setTooltipPos(null)
    } else {
      setSelectedDot({ plot, idx }); setTooltipPos(getMousePos(e, container))
    }
  }

  const handleBgClick = () => { setSelectedDot(null); setTooltipPos(null) }

  // Dot visual state — cross-plot: same swing index highlights on BOTH charts
  const dotState = (plot: DotId['plot'], idx: number) => {
    const isHovered = hoveredDot?.plot === plot && hoveredDot?.idx === idx
    const isCrossHover = hoveredDot !== null && hoveredDot.plot !== plot && hoveredDot.idx === idx
    const isSelected = selectedDot?.idx === idx // same swing on both plots
    const hasSelection = selectedDot !== null
    return { isHovered, isCrossHover, isSelected, hasSelection }
  }

  const dotRadius = (base: number, isHovered: boolean, isSelected: boolean, isCrossHover: boolean) => {
    if (isHovered) return base * 1.8
    if (isSelected || isCrossHover) return base * 1.5
    return base
  }

  const dotOpacity = (isHovered: boolean, isSelected: boolean, isCrossHover: boolean, hasSelection: boolean) => {
    if (isHovered || isSelected || isCrossHover) return 1.0
    if (hasSelection) return 0.3
    return 0.9
  }

  const dotStroke = (isHovered: boolean, isSelected: boolean, isCrossHover: boolean) => {
    if (isSelected) return { stroke: '#fff', strokeWidth: 0.6 }
    if (isHovered || isCrossHover) return { stroke: '#fff', strokeWidth: 0.4 }
    return {}
  }

  // Derive which spray zone the selected swing belongs to
  const selectedSwingZone = useMemo(() => {
    if (!selectedDot) return null
    const d = selectedDot.plot === 'sa' ? dots[selectedDot.idx] : cdots[selectedDot.idx]
    return d ? getSprayZone(d.dir) : null
  }, [selectedDot, dots, cdots])

  const dirLabel = (deg: number) => deg < -25 ? 'Pull' : deg < 10 ? 'Center' : 'Oppo'

  const contactPosDesc = (d: ContactDot) => {
    const horiz = d.x < 40 ? 'Inside' : d.x > 60 ? 'Outside' : 'Middle'
    const vert = d.y < 30 ? 'High' : d.y > 55 ? 'Low' : 'Mid'
    return `${vert} / ${horiz}`
  }

  const saTooltipFields = (d: ScatterDot) => {
    const fields: { label: string; value: string | number }[] = [
      { label: 'EV', value: `${d.ev} mph` },
      { label: 'LA', value: `${d.la}°` },
      { label: 'Type', value: d.type },
      { label: 'Dir', value: `${dirLabel(d.dir)} (${getSprayZone(d.dir)})` },
    ]
    if (mode === 'live' && d.pitchType) {
      fields.push({ label: 'Pitch', value: d.pitchType })
      if (d.pitchVelo) fields.push({ label: 'Velo', value: `${d.pitchVelo} mph` })
    }
    return fields
  }

  const cpTooltipFields = (d: ContactDot) => {
    const fields: { label: string; value: string | number }[] = [
      { label: 'Type', value: d.type },
      { label: 'Position', value: contactPosDesc(d) },
      { label: 'Dir', value: getSprayZone(d.dir) },
    ]
    if (mode === 'live' && d.pitchType) {
      fields.push({ label: 'Pitch', value: d.pitchType })
      if (d.pitchVelo) fields.push({ label: 'Velo', value: `${d.pitchVelo} mph` })
    }
    return fields
  }

  // Active tooltip
  const activeDotId = selectedDot || hoveredDot
  let tooltipFields: { label: string; value: string | number }[] | null = null
  let tooltipColor: string | undefined
  let tooltipContainerW = 0, tooltipContainerH = 0

  if (activeDotId && tooltipPos) {
    const ref = activeDotId.plot === 'sa' ? saRef : cpRef
    if (ref.current) {
      tooltipContainerW = ref.current.offsetWidth
      tooltipContainerH = ref.current.offsetHeight
    }
    if (activeDotId.plot === 'sa') {
      const d = dots[activeDotId.idx]
      if (d) { tooltipFields = saTooltipFields(d); tooltipColor = TC[d.type] }
    } else {
      const d = cdots[activeDotId.idx]
      if (d) { tooltipFields = cpTooltipFields(d); tooltipColor = TC[d.type] }
    }
  }

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar playerName={name} playerId={playerId} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '22px 30px 16px' }}>
        {/* Header row */}
        <div className="anim-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/branding/icon.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--text-bright)' }}>BASELINE HITTING</h1>
          </div>
          <button style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, letterSpacing: '1.5px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>UPLOAD</button>
        </div>

        {/* Controls row */}
        <div className="anim-fade-in anim-delay-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <FilterLegend items={HIT_FILTER_ITEMS} active={activeHitTypes} onToggle={handleToggle} onReset={handleReset} />
            <button className="btn" disabled title="Coming soon">DATE</button>
          </div>
          <div style={{ display: 'flex', border: '1px solid var(--orange-border)', borderRadius: 6, overflow: 'hidden' }}>
            {(['training', 'live'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '9px 28px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: '1.5px', cursor: 'pointer', border: 'none',
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
            <div className={`anim-slide-up anim-delay-2 ${mounted ? 'card-glow' : ''}`} style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px 18px', boxShadow: 'inset 0 1px 0 var(--accent)' }}>
              <div style={secHead}>PLAYER SUMMARY</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                {[
                  { label: 'AVG EV', val: `${player.avgEV + evo}`, unit: 'MPH', highlight: false },
                  { label: 'MAX EV', val: `${player.maxEV + evo}`, unit: 'MPH', highlight: true },
                  { label: 'AVG BS', val: `${player.avgBS + bso}`, unit: 'MPH', highlight: false },
                  { label: 'SWINGS', val: `${player.swings + swo}`, unit: '', highlight: false },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, letterSpacing: '1.2px', textTransform: 'uppercase', color: s.highlight ? 'var(--accent)' : 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--text-bright)', background: '#1e1e1e', borderRadius: 8, padding: '7px 10px', border: '1px solid #2a2a2a' }}>
                      {s.val}{s.unit && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', marginLeft: 4 }}>{s.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="anim-slide-up anim-delay-3" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px 18px', boxShadow: 'inset 0 1px 0 var(--accent)' }}>
              <div style={secHead}>HOW YOU STACK UP</div>
              <RadarChart values={radarValues} labels={['EV', 'QoC', 'BS']} benchmarks={hittingBenchmarks} size={180} />
            </div>
          </div>

          {/* ROW 2 — Spray Zones + Session Analysis + Contact Point */}
          <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
            {/* Spray Zone Selector */}
            <div className="anim-slide-up anim-delay-4" style={{ width: 280, minWidth: 280, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px 16px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <div style={secHead2}>SPRAY ZONES</div>
              {/* Clickable zone buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                <button
                  onClick={handleZoneReset}
                  style={{
                    padding: '8px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '1px', background: allZonesActive ? 'rgba(224,172,68,0.12)' : 'var(--panel)',
                    border: `1px solid ${allZonesActive ? 'var(--accent)' : 'var(--card-border)'}`,
                    borderRadius: 6, color: allZonesActive ? 'var(--accent)' : 'var(--muted)',
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center',
                  }}
                >ALL ZONES</button>
                {SPRAY_ZONES.map(z => {
                  const isActive = activeZones.has(z.key)
                  const isSwingZone = selectedSwingZone === z.key
                  const pct = ofSpray.find(s => s.label === z.key)?.pct || 0
                  return (
                    <button
                      key={z.key}
                      onClick={() => handleZoneToggle(z.key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', fontSize: 12, fontWeight: 600,
                        background: isSwingZone ? 'rgba(224,172,68,0.15)' : isActive ? 'var(--panel)' : 'transparent',
                        border: `1px solid ${isSwingZone ? 'var(--accent)' : isActive ? 'var(--card-border)' : 'rgba(60,60,60,0.3)'}`,
                        borderRadius: 6, color: isActive ? 'var(--text)' : 'var(--muted)',
                        opacity: isActive ? 1 : 0.4, cursor: 'pointer', transition: 'all 0.2s',
                        textAlign: 'left',
                        boxShadow: isSwingZone ? '0 0 8px rgba(224,172,68,0.3)' : 'none',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, width: 32 }}>{z.key}</span>
                      <div style={{ flex: 1, height: 14, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: isActive ? 'var(--accent)' : 'rgba(120,120,120,0.3)', borderRadius: 3, transition: 'width 0.3s' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, width: 36, textAlign: 'right', color: isActive ? 'var(--text-bright)' : 'var(--muted)' }}>{pct}%</span>
                    </button>
                  )
                })}
              </div>

              <div style={{ ...secHead2, marginTop: 4 }}>INFIELD</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ifSpray.map(d => (
                  <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, width: 32, color: 'var(--text)' }}>{d.label}</span>
                    <div style={{ flex: 1, height: 14, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${d.pct}%`, background: 'var(--accent)', borderRadius: 3, opacity: 0.6 }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, width: 36, textAlign: 'right', color: 'var(--text-bright)' }}>{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Analysis */}
            <div className="anim-slide-up anim-delay-5" ref={saRef} style={{ flex: 0.85, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px 16px', display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }} onClick={handleBgClick}>
              <div style={secHead2}>SESSION ANALYSIS</div>
              {/* In Zone / Out of Zone toggle + live mode filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6, flexShrink: 0 }}>
                <button
                  onClick={() => setZoneFilter(zoneFilter === 'in' ? 'all' : 'in')}
                  style={{
                    padding: '4px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.8px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s',
                    background: zoneFilter === 'in' ? 'rgba(76,175,80,0.15)' : 'var(--panel)',
                    border: `1px solid ${zoneFilter === 'in' ? '#4caf50' : 'var(--card-border)'}`,
                    color: zoneFilter === 'in' ? '#4caf50' : 'var(--muted)',
                  }}
                >IN ZONE {inZonePct}%</button>
                <button
                  onClick={() => setZoneFilter(zoneFilter === 'out' ? 'all' : 'out')}
                  style={{
                    padding: '4px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.8px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s',
                    background: zoneFilter === 'out' ? 'rgba(244,67,54,0.15)' : 'var(--panel)',
                    border: `1px solid ${zoneFilter === 'out' ? '#f44336' : 'var(--card-border)'}`,
                    color: zoneFilter === 'out' ? '#f44336' : 'var(--muted)',
                  }}
                >OUT OF ZONE {outZonePct}%</button>
                {mode === 'live' && (
                  <>
                    <div style={{ width: 1, height: 18, background: 'var(--card-border)', margin: '0 4px' }} />
                    <FilterLegend items={LIVE_PITCH_FILTER_ITEMS} active={activePitchTypes} onToggle={handlePitchTypeToggle} onReset={handlePitchTypeReset} />
                    <div style={{ width: 1, height: 18, background: 'var(--card-border)', margin: '0 4px' }} />
                    {VELO_RANGES.map(vr => {
                      const isActive = activeVeloRanges.has(vr.key)
                      return (
                        <button
                          key={vr.key}
                          onClick={() => handleVeloToggle(vr.key)}
                          style={{
                            padding: '4px 8px', fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.5px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s',
                            background: isActive ? 'rgba(224,172,68,0.12)' : 'transparent',
                            border: `1px solid ${isActive ? 'var(--accent)' : 'rgba(60,60,60,0.3)'}`,
                            color: isActive ? 'var(--accent)' : 'var(--muted)',
                            opacity: isActive ? 1 : 0.5,
                          }}
                        >{vr.label}</button>
                      )
                    })}
                  </>
                )}
              </div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 90" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                  <rect x="10" y="5" width="80" height="72" fill="none" stroke="rgba(80,80,80,0.25)" strokeWidth="0.6" />
                  <line x1="10" y1="41" x2="90" y2="41" stroke="rgba(80,80,80,0.12)" strokeWidth="0.3" />
                  <line x1="50" y1="5" x2="50" y2="77" stroke="rgba(80,80,80,0.12)" strokeWidth="0.3" />
                  {/* Inner rect = real strike zone: ±0.71ft wide (17in plate), 1.5-3.5ft tall */}
                  <rect x="36" y="21" width="28" height="32" fill="none" stroke="rgba(120,120,120,0.25)" strokeWidth="0.6" />
                  {avgSessionZone && (
                    <rect
                      x={avgSessionZone.cx - avgSessionZone.w / 2} y={avgSessionZone.cy - avgSessionZone.h / 2}
                      width={avgSessionZone.w} height={avgSessionZone.h}
                      rx="2" ry="2"
                      fill="rgba(224,172,68,0.08)" stroke="var(--accent)" strokeWidth="0.4"
                      strokeDasharray="2,1.5" opacity="0.7"
                      style={{ transition: 'x 0.3s ease, y 0.3s ease, width 0.3s ease, height 0.3s ease' }}
                    />
                  )}
                  {dots.slice(0, dotCount).map((d, i) => {
                    const { isHovered, isCrossHover, isSelected, hasSelection } = dotState('sa', i)
                    const r = dotRadius(1.3, isHovered, isSelected, isCrossHover)
                    const op = dotOpacity(isHovered, isSelected, isCrossHover, hasSelection)
                    const st = dotStroke(isHovered, isSelected, isCrossHover)
                    return (
                      <circle
                        key={i} cx={d.x} cy={d.y} r={r}
                        fill={TC[d.type]}
                        opacity={op}
                        style={{ cursor: 'pointer', transition: 'r 0.15s, opacity 0.15s' }}
                        {...st}
                        onMouseEnter={e => handleDotEnter('sa', i, e, saRef.current)}
                        onMouseLeave={handleDotLeave}
                        onClick={e => handleDotClick('sa', i, e, saRef.current)}
                      />
                    )
                  })}
                </svg>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', justifyContent: 'center', fontSize: 12, color: 'var(--muted)', paddingTop: 6, flexShrink: 0 }}>
                {[
                  { t: 'popup', l: 'POP-UP', c: 'var(--color-popup)' },
                  { t: 'linedrive', l: 'LINE-DRIVE', c: 'var(--color-linedrive)' },
                  { t: 'flyball', l: 'FLY-BALL', c: 'var(--color-flyball)' },
                  { t: 'groundball', l: 'GROUNDBALL', c: 'var(--color-groundball)' },
                ].filter(x => activeHitTypes.has(x.t)).map((x, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.5px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: x.c, display: 'inline-block' }} />{x.l} <b>{(ht as Record<string, number>)[x.t]}%</b>
                  </span>
                ))}
              </div>
              {activeDotId?.plot === 'sa' && tooltipFields && tooltipPos && (
                <PitchTooltip fields={tooltipFields} x={tooltipPos.x} y={tooltipPos.y} accentColor={tooltipColor} containerW={tooltipContainerW} containerH={tooltipContainerH} />
              )}
            </div>

            {/* Contact Point */}
            <div className="anim-slide-up anim-delay-6" ref={cpRef} style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px 16px', display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }} onClick={handleBgClick}>
              <div style={secHead2}>CONTACT POINT</div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                  {/* Depth axis — real Trackman ContactPositionY: 1.5-3.5 ft in front of plate */}
                  {[3.5, 3.0, 2.5, 2.0, 1.5].map((v, i) => {
                    const svgY = 75 - ((v - 1.5) / 2.0) * 65
                    return (
                      <g key={i}>
                        <text x="16" y={svgY + 1.5} fill="var(--muted)" fontSize="3.5" textAnchor="end" fontWeight="600">{v}</text>
                        <line x1="18" y1={svgY} x2="82" y2={svgY} stroke="rgba(80,80,80,0.08)" strokeWidth="0.2" />
                      </g>
                    )
                  })}
                  <line x1="18" y1="10" x2="18" y2="75" stroke="rgba(80,80,80,0.15)" strokeWidth="0.3" />
                  <text x="4" y="42" fill="var(--muted)" fontSize="3" textAnchor="middle" transform="rotate(-90,4,42)">DEPTH (ft)</text>
                  {/* Home plate reference at bottom */}
                  <polygon points="44,80 50,85 56,80 56,77 44,77" fill="rgba(100,100,100,0.06)" stroke="rgba(140,140,140,0.3)" strokeWidth="0.4" />
                  <text x="50" y="92" fill="var(--muted)" fontSize="3" textAnchor="middle">HOME PLATE</text>
                  <text x="28" y="92" fill="var(--muted)" fontSize="2.5" textAnchor="middle">INSIDE</text>
                  <text x="72" y="92" fill="var(--muted)" fontSize="2.5" textAnchor="middle">OUTSIDE</text>
                  <text x="50" y="6" fill="var(--muted)" fontSize="2.5" textAnchor="middle" opacity="0.6">OUT FRONT</text>
                  {/* Average contact zone highlight (when filtering) */}
                  {avgContactZone && (
                    <rect
                      x={avgContactZone.cx - avgContactZone.w / 2} y={avgContactZone.cy - avgContactZone.h / 2}
                      width={avgContactZone.w} height={avgContactZone.h}
                      rx="2" ry="2"
                      fill="rgba(224,172,68,0.08)" stroke="var(--accent)" strokeWidth="0.4"
                      strokeDasharray="2,1.5" opacity="0.7"
                      style={{ transition: 'x 0.3s ease, y 0.3s ease, width 0.3s ease, height 0.3s ease' }}
                    />
                  )}
                  {cdots.slice(0, dotCount).map((d, i) => {
                    const { isHovered, isCrossHover, isSelected, hasSelection } = dotState('cp', i)
                    const r = dotRadius(1.3, isHovered, isSelected, isCrossHover)
                    const op = dotOpacity(isHovered, isSelected, isCrossHover, hasSelection)
                    const st = dotStroke(isHovered, isSelected, isCrossHover)
                    return (
                      <circle
                        key={i} cx={d.x} cy={d.y} r={r}
                        fill={TC[d.type]}
                        opacity={op}
                        style={{ cursor: 'pointer', transition: 'r 0.15s, opacity 0.15s' }}
                        {...st}
                        onMouseEnter={e => handleDotEnter('cp', i, e, cpRef.current)}
                        onMouseLeave={handleDotLeave}
                        onClick={e => handleDotClick('cp', i, e, cpRef.current)}
                      />
                    )
                  })}
                </svg>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', justifyContent: 'center', fontSize: 12, color: 'var(--muted)', paddingTop: 6, flexShrink: 0 }}>
                {[
                  { t: 'popup', l: 'POP-UP', c: 'var(--color-popup)' },
                  { t: 'linedrive', l: 'LINE-DRIVE', c: 'var(--color-linedrive)' },
                  { t: 'flyball', l: 'FLY-BALL', c: 'var(--color-flyball)' },
                  { t: 'groundball', l: 'GROUNDBALL', c: 'var(--color-groundball)' },
                ].filter(x => activeHitTypes.has(x.t)).map((x, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.5px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: x.c, display: 'inline-block' }} />{x.l}
                  </span>
                ))}
              </div>
              {activeDotId?.plot === 'cp' && tooltipFields && tooltipPos && (
                <PitchTooltip fields={tooltipFields} x={tooltipPos.x} y={tooltipPos.y} accentColor={tooltipColor} containerW={tooltipContainerW} containerH={tooltipContainerH} />
              )}
            </div>
          </div>
          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '6px 0', flexShrink: 0 }}>
            <button style={{ padding: '10px 20px', background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 8, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, color: 'var(--accent)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1.2px', transition: 'all 0.2s' }} onClick={() => navigate(`/player/${playerId}/metrics`)} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,172,68,0.1)'; e.currentTarget.style.borderColor = 'var(--accent)' }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--panel)'; e.currentTarget.style.borderColor = 'var(--orange-border)' }}>VIEW METRICS &rarr;</button>
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
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text)', textAlign: 'center', lineHeight: 1.3 }}>TALK TO<br />YOUR DATA</span>
          <img src="/branding/icon.png" alt="" style={{ width: 34 }} />
        </button>
      )}
    </div>
  )
}

const secHead: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text)', textAlign: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--orange-border)' }
const secHead2: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text-bright)', marginBottom: 10, paddingBottom: 7, borderBottom: '1px solid var(--orange-border)', flexShrink: 0 }
