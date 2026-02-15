import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { players, getPlayerFullName } from '../../data/players'
import Sparkline from '../../components/Sparkline'

type TimeRange = 'Week' | 'Month' | 'Season'
type StatusFilter = 'All' | 'Improving' | 'Stable' | 'Declining'
type SortKey = 'name' | 'avgEV' | 'maxEV' | 'batSpeed' | 'hardHit' | 'swings'
type SortDir = 'asc' | 'desc'

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

const generateTrend = (base: number, variance: number): number[] => {
  const r: number[] = []
  let c = base - variance
  for (let i = 0; i < 8; i++) {
    c += (Math.random() - 0.3) * variance * 0.5
    r.push(Math.round(c * 10) / 10)
  }
  return r
}

const getCellStatus = (playerId: string, colIndex: number): 'improving' | 'stable' | 'declining' => {
  const seed = (parseInt(playerId) * 7 + colIndex * 13) % 100
  if (seed < 30) return 'declining'
  if (seed < 70) return 'stable'
  return 'improving'
}

const getCellStyle = (status: 'improving' | 'stable' | 'declining'): React.CSSProperties => {
  if (status === 'declining') {
    return { backgroundColor: 'var(--color-negative-bg)', color: 'var(--color-negative)' }
  }
  if (status === 'improving') {
    return { backgroundColor: 'var(--color-positive-bg)', color: 'var(--color-positive)' }
  }
  return {}
}

const getPlayerMajorityStatus = (playerId: string): 'Improving' | 'Stable' | 'Declining' => {
  let improving = 0
  let stable = 0
  let declining = 0
  for (let col = 0; col < 5; col++) {
    const status = getCellStatus(playerId, col)
    if (status === 'improving') improving++
    else if (status === 'stable') stable++
    else declining++
  }
  if (improving >= stable && improving >= declining) return 'Improving'
  if (declining >= stable && declining >= improving) return 'Declining'
  return 'Stable'
}

export default function CoachTrends() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<TimeRange>('Month')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const durhamPlayers = players.filter(p => p.sport === 'Baseball' && p.team === 'Durham Bulls')

  const filteredPlayers = statusFilter === 'All'
    ? durhamPlayers
    : durhamPlayers.filter(p => getPlayerMajorityStatus(p.id) === statusFilter)

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    let cmp = 0
    switch (sortKey) {
      case 'name':
        cmp = getPlayerFullName(a).localeCompare(getPlayerFullName(b))
        break
      case 'avgEV':
        cmp = a.avgEV - b.avgEV
        break
      case 'maxEV':
        cmp = a.maxEV - b.maxEV
        break
      case 'batSpeed':
        cmp = a.avgBS - b.avgBS
        break
      case 'hardHit':
        cmp = Math.round((a.avgEV / 95) * 45) - Math.round((b.avgEV / 95) * 45)
        break
      case 'swings':
        cmp = a.swings - b.swings
        break
    }
    return sortDir === 'asc' ? cmp : -cmp
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const avgEV = sortedPlayers.length > 0
    ? Math.round((sortedPlayers.reduce((s, p) => s + p.avgEV, 0) / sortedPlayers.length) * 10) / 10
    : 0
  const avgMaxEV = sortedPlayers.length > 0
    ? Math.round((sortedPlayers.reduce((s, p) => s + p.maxEV, 0) / sortedPlayers.length) * 10) / 10
    : 0
  const avgBS = sortedPlayers.length > 0
    ? Math.round((sortedPlayers.reduce((s, p) => s + p.avgBS, 0) / sortedPlayers.length) * 10) / 10
    : 0
  const avgHardHit = sortedPlayers.length > 0
    ? Math.round(sortedPlayers.reduce((s, p) => s + Math.round((p.avgEV / 95) * 45), 0) / sortedPlayers.length)
    : 0
  const avgSwings = sortedPlayers.length > 0
    ? Math.round(sortedPlayers.reduce((s, p) => s + p.swings, 0) / sortedPlayers.length)
    : 0

  const timeRanges: TimeRange[] = ['Week', 'Month', 'Season']
  const statuses: StatusFilter[] = ['All', 'Improving', 'Stable', 'Declining']

  const columns: { label: string; key: SortKey }[] = [
    { label: 'Player', key: 'name' },
    { label: 'Avg EV', key: 'avgEV' },
    { label: 'Max EV', key: 'maxEV' },
    { label: 'Bat Speed', key: 'batSpeed' },
    { label: 'Hard Hit %', key: 'hardHit' },
    { label: 'Swings', key: 'swings' },
  ]

  const pillBase: React.CSSProperties = {
    padding: '6px 16px',
    borderRadius: 20,
    fontSize: 12,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: 'none',
    outline: 'none',
  }

  const activePill: React.CSSProperties = {
    ...pillBase,
    background: 'var(--accent)',
    color: '#000',
    border: '1px solid var(--accent)',
  }

  const inactivePill: React.CSSProperties = {
    ...pillBase,
    background: 'transparent',
    border: '1px solid var(--orange-border)',
    color: 'var(--muted)',
  }

  const headerCellStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    textAlign: 'left',
    cursor: 'pointer',
    borderBottom: '1px solid var(--orange-border)',
    userSelect: 'none',
  }

  const bodyCellStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    color: 'var(--text)',
    borderBottom: '1px solid rgba(224,172,68,0.08)',
  }

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? ' \u2191' : ' \u2193'
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div className="anim-fade-in" style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 24,
          color: 'var(--text-bright)',
          margin: 0,
          marginBottom: 6,
        }}>
          Team Performance Trends
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--muted)',
          margin: 0,
        }}>
          Durham Bulls — Hitting Group Metrics
        </p>
      </div>

      {/* Filter Bar */}
      <div className="anim-slide-up anim-delay-1" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        marginBottom: 28,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>
            Time Range
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {timeRanges.map(tr => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                style={timeRange === tr ? activePill : inactivePill}
              >
                {tr}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>
            Status
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {statuses.map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={statusFilter === st ? activePill : inactivePill}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="anim-slide-up anim-delay-2" style={{ ...secTitle }}>Player Heatmap</div>
      <div className="anim-slide-up anim-delay-3" style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={headerCellStyle}
                >
                  {col.label}{sortIndicator(col.key)}
                </th>
              ))}
              <th style={{ ...headerCellStyle, cursor: 'default' }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map(p => {
              const hardHit = Math.round((p.avgEV / 95) * 45)
              const trendData = generateTrend(p.avgEV, 3)
              const evStatus = getCellStatus(p.id, 0)
              const maxEvStatus = getCellStatus(p.id, 1)
              const bsStatus = getCellStatus(p.id, 2)
              const hhStatus = getCellStatus(p.id, 3)
              const swingsStatus = getCellStatus(p.id, 4)

              return (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/player/${p.id}/dashboard`)}
                  onMouseEnter={() => setHoveredRow(p.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    cursor: 'pointer',
                    background: hoveredRow === p.id ? 'var(--accent-bg-subtle)' : 'transparent',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <td style={{
                    ...bodyCellStyle,
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    color: 'var(--text-bright)',
                  }}>
                    {getPlayerFullName(p)}
                    <span style={{
                      display: 'block',
                      fontSize: 11,
                      fontWeight: 400,
                      color: 'var(--muted)',
                      marginTop: 2,
                    }}>
                      {p.position}
                    </span>
                  </td>
                  <td style={{ ...bodyCellStyle, ...getCellStyle(evStatus) }}>
                    {p.avgEV.toFixed(1)}
                  </td>
                  <td style={{ ...bodyCellStyle, ...getCellStyle(maxEvStatus) }}>
                    {p.maxEV.toFixed(1)}
                  </td>
                  <td style={{ ...bodyCellStyle, ...getCellStyle(bsStatus) }}>
                    {p.avgBS.toFixed(1)}
                  </td>
                  <td style={{ ...bodyCellStyle, ...getCellStyle(hhStatus) }}>
                    {hardHit}%
                  </td>
                  <td style={{ ...bodyCellStyle, ...getCellStyle(swingsStatus) }}>
                    {p.swings.toLocaleString()}
                  </td>
                  <td style={bodyCellStyle}>
                    <Sparkline data={trendData} width={80} height={24} showEndDot />
                  </td>
                </tr>
              )
            })}

            {/* Team Average Summary Row */}
            {sortedPlayers.length > 0 && (
              <tr style={{
                borderTop: '2px solid var(--orange-border)',
                background: 'rgba(224,172,68,0.04)',
              }}>
                <td style={{
                  ...bodyCellStyle,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--accent)',
                  borderBottom: 'none',
                }}>
                  Team Average
                </td>
                <td style={{
                  ...bodyCellStyle,
                  fontWeight: 700,
                  color: 'var(--text-bright)',
                  borderBottom: 'none',
                }}>
                  {avgEV.toFixed(1)}
                </td>
                <td style={{
                  ...bodyCellStyle,
                  fontWeight: 700,
                  color: 'var(--text-bright)',
                  borderBottom: 'none',
                }}>
                  {avgMaxEV.toFixed(1)}
                </td>
                <td style={{
                  ...bodyCellStyle,
                  fontWeight: 700,
                  color: 'var(--text-bright)',
                  borderBottom: 'none',
                }}>
                  {avgBS.toFixed(1)}
                </td>
                <td style={{
                  ...bodyCellStyle,
                  fontWeight: 700,
                  color: 'var(--text-bright)',
                  borderBottom: 'none',
                }}>
                  {avgHardHit}%
                </td>
                <td style={{
                  ...bodyCellStyle,
                  fontWeight: 700,
                  color: 'var(--text-bright)',
                  borderBottom: 'none',
                }}>
                  {avgSwings.toLocaleString()}
                </td>
                <td style={{ ...bodyCellStyle, borderBottom: 'none' }}>
                  <Sparkline data={generateTrend(avgEV, 2)} width={80} height={24} showEndDot />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {sortedPlayers.length === 0 && (
          <div style={{
            padding: 48,
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--muted)',
          }}>
            No players match the selected filters.
          </div>
        )}
      </div>
    </div>
  )
}
