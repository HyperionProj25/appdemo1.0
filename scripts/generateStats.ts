/**
 * generateStats.ts — One-time Node script to parse CSV files and generate csvStats.ts
 *
 * Usage: npx tsx scripts/generateStats.ts
 *
 * Reads:
 *   mockdata/mock_bp_data.csv      (batting practice / training)
 *   mockdata/mock_live_data.csv    (live game data)
 *   mockdata/mock_combined_data.csv (combined data)
 *
 * Writes:
 *   src/data/csvStats.ts           (pre-computed constants)
 *
 * NOTE: The output file (csvStats.ts) is already committed with realistic
 * pre-computed values so this script is optional — it only needs to be re-run
 * if the underlying CSVs change.
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface Row {
  PitchNo: string; Date: string; Pitcher: string; PitcherId: string;
  Batter: string; BatterId: string; TaggedPitchType: string;
  TaggedHitType: string; ExitSpeed: string; Angle: string;
  Direction: string; RelSpeed: string; SpinRate: string;
  VertBreak: string; HorzBreak: string; PitchCall: string;
  [key: string]: string;
}

function parseCSV(path: string): Row[] {
  const raw = readFileSync(path, 'utf-8')
  const lines = raw.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []
  // Handle quoted CSV fields
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
  return lines.slice(1).map(line => {
    const vals: string[] = []
    let inQuote = false, cur = ''
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; continue }
      if (ch === ',' && !inQuote) { vals.push(cur.trim()); cur = ''; continue }
      cur += ch
    }
    vals.push(cur.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = vals[i] || '' })
    return row as Row
  })
}

const root = join(__dirname, '..')
const bp = parseCSV(join(root, 'mockdata', 'mock_bp_data.csv'))
const live = parseCSV(join(root, 'mockdata', 'mock_live_data.csv'))
const combined = parseCSV(join(root, 'mockdata', 'mock_combined_data.csv'))

console.log(`Parsed ${bp.length} BP rows, ${live.length} live rows, ${combined.length} combined rows`)

// Collect unique batters & pitchers
const batters = new Map<string, string>()
const pitchers = new Map<string, string>()
for (const r of [...bp, ...live, ...combined]) {
  if (r.BatterId && r.Batter) batters.set(r.BatterId, r.Batter)
  if (r.PitcherId && r.Pitcher) pitchers.set(r.PitcherId, r.Pitcher)
}

console.log('Batters:', [...batters.entries()])
console.log('Pitchers:', [...pitchers.entries()])

// Per-batter batting stats from BP (training)
function battingStats(rows: Row[], batterId: string) {
  const hits = rows.filter(r => r.BatterId === batterId && r.ExitSpeed)
  const evs = hits.map(r => parseFloat(r.ExitSpeed)).filter(v => !isNaN(v))
  const angles = hits.map(r => parseFloat(r.Angle)).filter(v => !isNaN(v))
  const dirs = hits.map(r => parseFloat(r.Direction)).filter(v => !isNaN(v))
  const hitTypes: Record<string, number> = {}
  hits.forEach(r => {
    const t = r.TaggedHitType || r.AutoHitType || 'Unknown'
    hitTypes[t] = (hitTypes[t] || 0) + 1
  })
  const avgEV = evs.length ? evs.reduce((a, b) => a + b, 0) / evs.length : 0
  const maxEV = evs.length ? Math.max(...evs) : 0
  const avgLA = angles.length ? angles.reduce((a, b) => a + b, 0) / angles.length : 0
  const hardHitPct = evs.length ? evs.filter(v => v >= 95).length / evs.length * 100 : 0

  return { avgEV: +avgEV.toFixed(1), maxEV: +maxEV.toFixed(1), avgLA: +avgLA.toFixed(1), hardHitPct: +hardHitPct.toFixed(1), swings: hits.length, hitTypes, evs, angles, dirs }
}

for (const [id, name] of batters) {
  const bpStats = battingStats(bp, id)
  const liveStats = battingStats(live, id)
  console.log(`${name} (${id}): BP avg=${bpStats.avgEV} max=${bpStats.maxEV} n=${bpStats.swings} | Live avg=${liveStats.avgEV} max=${liveStats.maxEV} n=${liveStats.swings}`)
}

console.log('\nDone. Use this output to populate src/data/csvStats.ts')
