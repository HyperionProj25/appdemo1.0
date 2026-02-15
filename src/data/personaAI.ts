import { players, getPlayerFullName, getPlayersByTeam } from './players'
import type { AIResponse, AIChartData } from '../components/AIPanel'

// Helper to look up players by last name
const findPlayer = (lastName: string) => players.find(p => p.lastName === lastName)

// ============================================
// SCOUT AI - Territory coverage, prospect updates
// ============================================
export const scoutSuggestions = [
  "Who's hot in my territory?",
  "Summarize Castillo's development",
  "Compare my top 3 prospects",
  "Any mechanical changes to note?",
  "Prep me for tomorrow's visit",
  "Generate a scouting report",
  "Who's promotion-ready?",
]

export function getScoutAIResponse(query: string): AIResponse {
  const q = query.toLowerCase()

  if (q.includes('hot') || q.includes('trending') || q.includes('up')) {
    const beckett = findPlayer('Beckett')!
    const steele = findPlayer('Steele')!
    const elwood = findPlayer('Elwood')!
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Beckett', 'Steele', 'Elwood'],
      series: [
        { label: 'Last Month', values: [beckett.avgEV - 3, steele.avgEV - 3, elwood.avgEV - 3], color: '#666' },
        { label: 'Current', values: [beckett.avgEV, steele.avgEV, elwood.avgEV], color: 'var(--accent)' },
      ],
      yMax: Math.max(beckett.avgEV, steele.avgEV, elwood.avgEV) + 8,
    }
    return {
      text: `Here are your hot prospects this month:\n\n🔥 Shane Beckett — Avg EV jumped 3.5 mph to ${beckett.avgEV}. His bat speed gains are translating. He's ready for a harder look.\n\n🔥 Logan Steele — Career-high ${steele.maxEV} max EV. Power is legit and sustainable based on swing mechanics.\n\n🔥 Grant Elwood — Quietly consistent. 4th straight month above ${elwood.avgEV} EV with improved selectivity.\n\nRecommendation: Beckett should be prioritized for your next front office call.`,
      chart,
    }
  }

  if (q.includes('castillo') || q.includes('reno')) {
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: 'Oct', value: 86 },
        { label: 'Nov', value: 87 },
        { label: 'Dec', value: 88 },
        { label: 'Jan', value: 89 },
      ],
      unit: 'Avg EV (MPH)',
    }
    return {
      text: `Reno Castillo Development Summary:\n\n📈 Exit Velocity: +3.5 mph since October (86 → 89.4)\n📈 Max EV: Touched 104 mph, up from 101\n📈 Bat Speed: 56 mph, top 15% in system\n\nMechanical Notes:\n• Adjusted load timing in November — more consistent weight transfer\n• Shortened swing path by ~2 inches\n• Better barrel control through the zone\n\nProjection: On current trajectory, Reno projects as a 40-grade hit tool with 55 raw power. The bat speed gains are real and sustainable.\n\nRecommendation: Worth a 40-man consideration this offseason.`,
      chart,
    }
  }

  if (q.includes('compare') || q.includes('top 3') || q.includes('top three')) {
    const beckett = findPlayer('Beckett')!
    const steele = findPlayer('Steele')!
    const castillo = findPlayer('Castillo')!
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Avg EV', 'Max EV', 'Bat Speed'],
      series: [
        { label: 'Beckett', values: [beckett.avgEV, beckett.maxEV, beckett.avgBS], color: 'var(--accent)' },
        { label: 'Steele', values: [steele.avgEV, steele.maxEV, steele.avgBS], color: '#4caf50' },
        { label: 'Castillo', values: [castillo.avgEV, castillo.maxEV, castillo.avgBS], color: '#2196f3' },
      ],
      yMax: 115,
    }
    return {
      text: `Top 3 Prospect Comparison:\n\n1. Logan Steele (AAA)\n   • Most raw power in the system\n   • ${steele.maxEV} max EV, ${steele.avgBS} mph bat speed\n   • Ready for MLB looks\n\n2. Shane Beckett (AAA)\n   • Best improvement trajectory\n   • +4.2 mph EV year-over-year\n   • Elite bat-to-ball skills\n\n3. Reno Castillo (AAA)\n   • Most refined approach\n   • Mechanical improvements showing\n   • Highest floor of the three\n\nAll three are legitimate MLB prospects. Steele has the highest ceiling, Castillo the highest floor.`,
      chart,
    }
  }

  if (q.includes('mechanical') || q.includes('changes') || q.includes('shift')) {
    return {
      text: `Recent Mechanical Changes in Your Territory:\n\n🔧 Reno Castillo (Jan 15)\n   • Load timing adjusted — earlier stride initiation\n   • Result: More consistent weight transfer, +2 mph EV\n\n🔧 Trent Valen (Jan 10)\n   • Stance widened 2 inches\n   • Result: Better balance, fewer swing-and-misses\n\n🔧 Kai Ashford (Dec 28)\n   • Hand path shortened\n   • Result: Quicker to the zone, improved timing\n\n🔧 Reese Langdon (Dec 20)\n   • Hip rotation emphasis\n   • Result: Still in adjustment period, monitor closely\n\nNone of these changes raise red flags. All are positive development adjustments.`,
    }
  }

  if (q.includes('tomorrow') || q.includes('visit') || q.includes('prep')) {
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: 'Nov', value: 86 },
        { label: 'Dec', value: 88 },
        { label: 'Jan', value: 91 },
      ],
      unit: 'Avg EV',
    }
    return {
      text: `Prep for Tomorrow's Visit — Shane Beckett:\n\n📍 Location: Durham Bulls facility\n🎯 Key Focus Areas:\n\n1. Power Surge Verification\n   • Avg EV: 91 mph (+3.8 since last visit)\n   • Is this sustainable? Watch his swing plane\n\n2. Mechanical Consistency\n   • Load timing was inconsistent in December\n   • Check if adjustments have stuck\n\n3. Interview Points\n   • Ask about offseason training regimen\n   • Gauge mental readiness for callup\n\nTalking Points for Front Office:\n• Power is playing up, not just hot streak\n• Mechanical improvements are documented\n• Ready for the next level conversation`,
      chart,
    }
  }

  if (q.includes('report') || q.includes('generate') || q.includes('write')) {
    return {
      text: `I can help you build a scouting report. Here's what I'd recommend:\n\n📋 Quick Report — Reno Castillo (SS, AAA):\n\nGrade Summary:\n• Hit: 50 — Average bat-to-ball, improving\n• Power: 55 — Above-average raw, EV trending up\n• Run: 45 — Below average, adequate for SS\n• Arm: 55 — Plus arm strength, accurate\n• Field: 50 — Steady hands, average range\n• Overall: 50 — Solid everyday profile\n\nProjection: Reno projects as a utility infielder with enough bat to earn a roster spot. The power development is the key variable — if max EV continues trending toward 105+, the ceiling rises to an everyday starter.\n\nHead to the Reports tab to build a full customizable report with grade sliders and exportable sections.`,
    }
  }

  if (q.includes('promotion') || q.includes('ready') || q.includes('call up') || q.includes('pipeline')) {
    const beckett = findPlayer('Beckett')!
    const steele = findPlayer('Steele')!
    const elwood = findPlayer('Elwood')!
    const ashford = findPlayer('Ashford')!
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Avg EV', 'Max EV', 'Bat Speed'],
      series: [
        { label: 'Beckett', values: [beckett.avgEV, beckett.maxEV, beckett.avgBS], color: 'var(--accent)' },
        { label: 'Steele', values: [steele.avgEV, steele.maxEV, steele.avgBS], color: '#4caf50' },
        { label: 'Elwood', values: [elwood.avgEV, elwood.maxEV, elwood.avgBS], color: '#2196f3' },
      ],
      yMax: 115,
    }
    return {
      text: `Promotion-Ready Prospects:\n\n🟢 Logan Steele (AAA, RF) — READY\n   • ${steele.avgEV} Avg EV, ${steele.maxEV} Max EV — elite power\n   • Exceeds all AAA thresholds\n   • Recommendation: Immediate 40-man consideration\n\n🟢 Shane Beckett (AAA, RF) — READY\n   • ${beckett.avgEV} Avg EV, ${beckett.maxEV} Max EV — plus power\n   • Sustained improvement trajectory\n   • Recommendation: Next callup opportunity\n\n🟡 Grant Elwood (AAA, 3B) — CLOSE\n   • ${elwood.avgEV} Avg EV, ${elwood.maxEV} Max EV — meets thresholds\n   • Consistency is his best asset\n   • Recommendation: Monitor 2 more weeks\n\n🔵 Kai Ashford (AA, CF) — WATCH\n   • ${ashford.avgEV} Avg EV, ${ashford.maxEV} Max EV — above AA thresholds\n   • Could be fast-tracked to AAA\n\nCheck the Pipeline view for the full organizational breakdown.`,
      chart,
    }
  }

  // Default
  return {
    text: `Your territory currently has 12 active prospects across 4 affiliates:\n\n• AAA (Durham): 8 players — 3 trending up\n• AA (Montgomery): 6 players — 1 breakout candidate\n• A+ (Charleston): 4 players — steady development\n• A (Bowling Green): 4 players — early stage\n\nKey insight: Your AAA group is stronger than league average this year. Beckett and Steele are legitimate 40-man candidates.\n\nWhat would you like to dive into?`,
  }
}

// ============================================
// COACH AI - Team management, matchup prep
// ============================================
export const coachSuggestions = [
  "How's my team trending?",
  "Who's struggling right now?",
  "Prep for tonight's starter",
  "Any swing changes to make?",
  "Compare LHH vs RHH lineup",
  "Show development plan for Castillo",
  "Compare last two sessions",
]

export function getCoachAIResponse(query: string): AIResponse {
  const q = query.toLowerCase()

  if (q.includes('trending') || q.includes('team') || q.includes('how')) {
    const teamRoster = getPlayersByTeam('Durham Bulls')
    const teamAvg = teamRoster.length > 0 ? Math.round(teamRoster.reduce((s, p) => s + p.avgEV, 0) / teamRoster.length * 10) / 10 : 85.4
    const steele = findPlayer('Steele')!
    const elwood = findPlayer('Elwood')!
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: 'W1', value: teamAvg - 2.2 },
        { label: 'W2', value: teamAvg - 1.3 },
        { label: 'W3', value: teamAvg - 0.6 },
        { label: 'W4', value: teamAvg },
      ],
      unit: 'Team Avg EV',
    }
    return {
      text: `Team Trend Report — Durham Bulls:\n\n📈 Team Avg EV: ${teamAvg} mph (+2.2 from month start)\n📈 Hard Hit %: 42.3% (+3.5% month-over-month)\n📈 Barrel Rate: 11.2% (up from 9.8%)\n\nTop Performers This Week:\n1. Logan Steele — ${steele.avgEV} Avg EV, .340/.380/.620\n2. Grant Elwood — ${elwood.avgEV} Avg EV, consistent contact\n3. Reno Castillo — Mechanical gains paying off\n\nConcern: Malik Sutton is in a 2-week slump. Consider adjusting his approach.`,
      chart,
    }
  }

  if (q.includes('struggling') || q.includes('slump') || q.includes('cold')) {
    const sutton = findPlayer('Sutton')!
    const vega = findPlayer('Vega')!
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Last Month', 'This Week'],
      series: [
        { label: 'Sutton EV', values: [sutton.avgEV + 4, sutton.avgEV], color: '#e53935' },
        { label: 'Vega EV', values: [vega.avgEV + 4, vega.avgEV], color: '#ffc107' },
      ],
      yMax: Math.max(sutton.avgEV, vega.avgEV) + 10,
    }
    return {
      text: `Players Currently Struggling:\n\n🔴 Malik Sutton (Catcher)\n   • Avg EV down 4 mph (${sutton.avgEV + 4} → ${sutton.avgEV})\n   • Launch angle trending negative\n   • Possible cause: Hand position at setup\n   • Recommendation: Tee work focusing on staying through the ball\n\n🟡 Darius Vega (CF)\n   • Slight dip, nothing alarming\n   • May be over-swinging for power\n   • Recommendation: Shorten up, focus on line drives\n\nNeither is a major concern yet, but Sutton needs intervention this week.`,
      chart,
    }
  }

  if (q.includes('tonight') || q.includes('starter') || q.includes('matchup')) {
    const chart: AIChartData = {
      type: 'bar',
      points: [
        { label: 'vs FB', value: 285 },
        { label: 'vs SL', value: 242 },
        { label: 'vs CH', value: 258 },
        { label: 'vs CB', value: 221 },
      ],
      unit: ' AVG',
      yMax: 350,
    }
    return {
      text: `Matchup Prep — vs Brent Hayward (RHP, Nashville):\n\n🎯 His Arsenal:\n• Fastball (58%) — 97 mph avg, rides up\n• Slider (22%) — Sharp, 85 mph\n• Changeup (12%) — Fades arm-side\n• Curveball (8%) — Loopy, hittable\n\n📊 Your Team vs His Pitch Types:\n• vs FB: .285 — Attack early in counts\n• vs SL: .242 — Lay off down-and-away\n• vs CB: .221 — Weakness, he'll exploit it\n\n💡 Game Plan:\n1. Be aggressive in fastball counts\n2. Don't chase the slider\n3. Stack lefties — he's worse vs LHH (.310 BAA)\n\nLineup suggestion: Lead with Valen, Vega, Merritt.`,
      chart,
    }
  }

  if (q.includes('swing') || q.includes('changes') || q.includes('adjust')) {
    return {
      text: `Recommended Swing Adjustments:\n\n🔧 Malik Sutton\n   • Issue: Dropping hands at load\n   • Fix: Hands stay at shoulder height\n   • Drill: Mirror work, 50 dry swings/day\n\n🔧 Zane Corbett\n   • Issue: Early hip rotation, losing power\n   • Fix: Stay closed longer\n   • Drill: Stride separation drill\n\n🔧 Troy Hensler\n   • Issue: Collapsing back side\n   • Fix: Maintain posture through swing\n   • Drill: Back leg stability work\n\nAll three are fixable within a week with focused BP. Want me to create a drill sequence for any of them?`,
    }
  }

  if (q.includes('lhh') || q.includes('rhh') || q.includes('lineup') || q.includes('split')) {
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Avg EV', 'Hard Hit%', 'Barrel%'],
      series: [
        { label: 'LHH', values: [86, 44, 12], color: 'var(--accent)' },
        { label: 'RHH', values: [84, 40, 10], color: '#2196f3' },
      ],
      yMax: 100,
    }
    return {
      text: `Left vs Right-Handed Hitter Analysis:\n\n🔵 Left-Handed Hitters (6):\n• Avg EV: 86.2 mph\n• Hard Hit: 44.1%\n• Best: Trent Valen, Cole Merritt\n\n🔴 Right-Handed Hitters (9):\n• Avg EV: 84.1 mph\n• Hard Hit: 40.3%\n• Best: Logan Steele, Grant Elwood\n\nTonight's Recommendation:\nAgainst RHP Brent Hayward, stack your lefties. Valen should hit 2nd, Merritt 5th for RBI opportunities.\n\nYour lefties hit .310 vs RHP this month. Use that advantage.`,
      chart,
    }
  }

  if (q.includes('development') || q.includes('plan') || q.includes('castillo')) {
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: 'W1', value: 86 },
        { label: 'W2', value: 87 },
        { label: 'W3', value: 88 },
        { label: 'W4', value: 89 },
      ],
      unit: 'Avg EV',
    }
    return {
      text: `Development Plan Summary — Reno Castillo:\n\n🎯 Active Goals:\n1. Increase Max EV to 109 mph (currently 104) — Needs Attention\n2. Raise Avg EV to 93 mph (currently 89) — On Track\n3. Improve barrel consistency — Ahead of Schedule\n\n📋 Current Focus Areas:\n• Barrel Control (High Priority) — staying inside the ball\n• Timing & Rhythm (Medium) — load consistency\n\n✅ Recent Milestones:\n• Completed swing assessment ✓\n• Established baseline metrics ✓\n• First progress check ✓\n\n💡 Drill Recommendations:\n• Tee Work (inside/outside) — 3x/week\n• Overload/Underload Training — 2x/week\n\nHead to the Development tab for the full plan with progress tracking.`,
      chart,
    }
  }

  if (q.includes('session') || q.includes('compare') || q.includes('last two')) {
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Avg EV', 'Max EV', 'Bat Speed'],
      series: [
        { label: 'Session A (Jan)', values: [87, 101, 54], color: '#666' },
        { label: 'Session B (Feb)', values: [89, 104, 56], color: 'var(--accent)' },
      ],
      yMax: 115,
    }
    return {
      text: `Session Comparison — Recent Results:\n\n📊 Team Average Improvements (Jan → Feb):\n• Avg EV: 83.2 → 85.4 mph (+2.2)\n• Max EV: 99.1 → 101.8 mph (+2.7)\n• Bat Speed: 52.1 → 53.8 mph (+1.7)\n• Hard Hit %: 38.8% → 42.3% (+3.5%)\n\n🔥 Biggest Improvers:\n1. Shane Beckett: +3.8 mph Avg EV\n2. Reno Castillo: +3.0 mph Avg EV\n3. Logan Steele: +1.5 mph Max EV\n\n⚠️ Declines:\n1. Malik Sutton: -4.0 mph Avg EV\n2. Darius Vega: -1.2 mph Avg EV\n\nOverall, the team is trending up. The offseason training program is paying off for most of the roster.\n\nVisit the Sessions tab for detailed side-by-side breakdowns.`,
      chart,
    }
  }

  // Default
  return {
    text: `Coach Dashboard Summary:\n\n👥 Active Roster: 15 hitters\n📊 Team Avg EV: 85.2 mph\n📈 Trending Up: 8 players\n📉 Needs Attention: 2 players\n\nToday's Priority:\n1. Review Sutton's swing mechanics\n2. Prep lineup for tonight's RHP\n3. Check in with Merritt on oblique\n\nWhat area would you like to focus on?`,
  }
}

// ============================================
// AGENT AI - Contract prep, development evidence
// ============================================
export const agentSuggestions = [
  "Build Beckett's arb case",
  "Compare Steele to recent deals",
  "What's Elwood's market value?",
  "Generate talking points",
  "Export development summary",
]

export function getAgentAIResponse(query: string): AIResponse {
  const q = query.toLowerCase()

  if (q.includes('beckett') || q.includes('arb case') || q.includes('shane')) {
    const beckett = findPlayer('Beckett')!
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: '2024', value: beckett.avgEV - 6 },
        { label: 'Early 25', value: beckett.avgEV - 4 },
        { label: 'Mid 25', value: beckett.avgEV - 2 },
        { label: '2026', value: beckett.avgEV },
      ],
      unit: 'Avg EV Trend',
    }
    return {
      text: `Shane Beckett — Arbitration Case Builder:\n\n📈 Documented Growth (Verified Data):\n• Exit Velocity: +6.1 mph over 2 years (${beckett.avgEV - 6} → ${beckett.avgEV})\n• Max EV: +8 mph (${beckett.maxEV - 8} → ${beckett.maxEV})\n• Barrel Rate: 8.2% → 14.1% (+72% improvement)\n• Bat Speed: ${beckett.avgBS - 3} → ${beckett.avgBS} mph (+5.5%)\n\n💰 Comparable Contracts:\n• Similar profile player A: $2.1M (Arb 2, 2024)\n• Similar profile player B: $1.8M (Arb 2, 2024)\n\n🎯 Recommended Ask: $2.0M - $2.3M\n\n📋 Key Talking Points:\n1. "Sustained improvement, not a hot streak"\n2. "Power gains are mechanical, not age-based"\n3. "Top 15% exit velo in the system"\n\nThis is a strong case. The data supports premium value.`,
      chart,
    }
  }

  if (q.includes('steele') || q.includes('deals') || q.includes('compare')) {
    const steele = findPlayer('Steele')!
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Avg EV', 'Max EV', 'Barrel%'],
      series: [
        { label: 'Steele', values: [steele.avgEV, steele.maxEV, 15], color: 'var(--accent)' },
        { label: 'Comp A', values: [steele.avgEV - 2, steele.maxEV - 2, 13], color: '#4caf50' },
        { label: 'Comp B', values: [steele.avgEV - 3, steele.maxEV - 4, 12], color: '#2196f3' },
      ],
      yMax: 115,
    }
    return {
      text: `Logan Steele — Market Comparison:\n\n📊 Steele's Profile:\n• Avg EV: ${steele.avgEV} mph (94th percentile)\n• Max EV: ${steele.maxEV} mph (elite)\n• Barrel Rate: 15.2% (well above average)\n\n💰 Comparable Recent Deals:\n\n1. Comp A (Arb 2, 2024): $2.8M\n   • Similar power profile\n   • Steele has better max EV\n\n2. Comp B (Arb 2, 2024): $2.4M\n   • Slightly lower power numbers\n   • Steele clearly outperforms\n\n🎯 Recommended Range: $2.6M - $3.0M\n\nSteele's power metrics are elite. The data supports a top-of-market ask for his service time. His ${steele.maxEV} mph max EV puts him in rare company.`,
      chart,
    }
  }

  if (q.includes('elwood') || q.includes('market value') || q.includes('grant')) {
    const elwood = findPlayer('Elwood')!
    const chart: AIChartData = {
      type: 'bar',
      points: [
        { label: '2024', value: elwood.avgEV - 3 },
        { label: '2025', value: elwood.avgEV - 1 },
        { label: '2026', value: elwood.avgEV },
      ],
      unit: ' Avg EV',
      yMax: elwood.avgEV + 5,
    }
    return {
      text: `Grant Elwood — Market Value Assessment:\n\n📈 Development Arc:\n• Consistent 3-year improvement trend\n• Avg EV: ${elwood.avgEV - 3} → ${elwood.avgEV - 1} → ${elwood.avgEV} mph\n• No regression, steady gains\n\n💎 Value Proposition:\n• Reliability over ceiling\n• Defensive asset (3B, above average)\n• Leadership intangibles\n\n💰 Market Value: $1.6M - $1.9M (Arb 1)\n\n📋 Negotiation Angle:\n"Grant represents low-risk, consistent production. His development curve is exactly what organizations pay for — no volatility, just steady improvement."\n\nThis is a floor play, not a ceiling play. Position accordingly.`,
      chart,
    }
  }

  if (q.includes('talking points') || q.includes('generate')) {
    return {
      text: `Auto-Generated Talking Points for Your Clients:\n\n📋 Shane Beckett (Arb 2):\n1. Exit velocity improved 4.2 mph YoY — top 15% in system\n2. Barrel rate increased 72% — elite improvement trajectory  \n3. Zero stretches of 10+ games below .250 — consistency\n4. Mechanical changes documented and sustainable\n\n📋 Logan Steele (Arb 2):\n1. 107 mph max EV — rare power profile\n2. Career-best marks in every power category\n3. 3 consecutive seasons of improvement\n4. Age-appropriate development, peak years ahead\n\n📋 Grant Elwood (Arb 1):\n1. Steady 3-year improvement trend, no regression\n2. Plus defense adds roster flexibility value\n3. Clubhouse presence, leadership metrics\n4. Low-risk, high-floor profile\n\nAll talking points are backed by verified Baseline data. Export-ready for meetings.`,
    }
  }

  if (q.includes('export') || q.includes('summary') || q.includes('pdf')) {
    return {
      text: `Development Summary — Export Ready:\n\n📄 I can generate the following reports:\n\n1. Full Development Resume (PDF)\n   • Career arc visualization\n   • Key metrics with trend lines\n   • Comparable player analysis\n   • Talking points summary\n\n2. One-Page Snapshot\n   • Quick reference for meetings\n   • Key stats highlighted\n   • Visual trend charts\n\n3. Arbitration Data Pack\n   • All supporting evidence\n   • Comparable contracts\n   • Recommended ask range\n\nClick "Export Resume" on any client card to generate. All data is verified through Baseline's tracking system — no opinions, just facts.\n\nWhich format would be most useful for your next meeting?`,
    }
  }

  // Default
  return {
    text: `Agent Dashboard Summary:\n\n👥 Active Clients: 3 players\n💰 Total Contract Value: $2.77M\n📅 Upcoming: 2 arbitration-eligible this offseason\n\n🎯 Priority Actions:\n1. Beckett arb case — strong, ready to file\n2. Steele market comp — research complete\n3. Elwood value assessment — done\n\nBaseline gives you what no other agent has: verified development data that stands up in negotiation. Every trend, every improvement, documented.\n\nWhat would you like to work on?`,
  }
}

// ============================================
// PITCHING COACH AI - Staff management, arsenal, bullpen
// ============================================
export const pitchingCoachSuggestions = [
  "How's my rotation looking?",
  "Who's available in the pen?",
  "Analyze Gould's arsenal",
  "Any velocity trends to watch?",
  "Prep for tonight's lineup",
  "Show workload concerns",
  "Development update on Rivers",
]

export function getPitchingCoachAIResponse(query: string): AIResponse {
  const q = query.toLowerCase()

  if (q.includes('rotation') || q.includes('starter') || q.includes('how')) {
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['ERA', 'WHIP', 'K/9'],
      series: [
        { label: 'Gould', values: [3.12, 1.08, 10.2], color: 'var(--accent)' },
        { label: 'Vance', values: [2.85, 1.02, 11.1], color: '#4caf50' },
        { label: 'Ishida', values: [3.48, 1.15, 9.6], color: '#2196f3' },
      ],
      yMax: 12,
    }
    return {
      text: `Rotation Status Report:\n\n🟢 Emilio Vance (SP1) — 2.85 ERA, 124 Stuff+\n   Elite-level stuff. Sweeper is unhittable (40% whiff). Next start: Feb 17.\n\n🟢 Tanner Gould (SP2) — 3.12 ERA, 118 Stuff+\n   Consistent and durable. Slider is his putaway pitch. Ready for Feb 15.\n\n🟡 Sora Ishida (SP3) — 3.48 ERA, 110 Stuff+\n   Changeup is elite but workload trending high (ACWR 1.12). Monitor innings.\n\n🟡 Nolan Bradshaw (SP4) — 4.15 ERA, 102 Stuff+\n   Command issues (3.6 BB/9). Working on sinker location. Needs a development plan.\n\n🟢 Rylan Tanaka (SP5) — 3.65 ERA, 108 Stuff+\n   Cutter/curve combo is effective. Low workload — fresh arm.\n\nOverall: Your top 3 are strong. Bradshaw needs the most attention.`,
      chart,
    }
  }

  if (q.includes('bullpen') || q.includes('pen') || q.includes('available') || q.includes('reliever')) {
    const chart: AIChartData = {
      type: 'bar',
      points: [
        { label: 'Rivers', value: 48 },
        { label: 'Park', value: 44 },
        { label: 'Holt', value: 52 },
        { label: 'Strand', value: 38 },
        { label: 'Vasquez', value: 62 },
        { label: 'Correa', value: 28 },
        { label: 'Takeda', value: 36 },
      ],
      unit: ' pitches (7d)',
      yMax: 70,
    }
    return {
      text: `Bullpen Availability Report:\n\n🟢 Available:\n• DeShawn Rivers (CL) — 1 day rest, ACWR 1.08. Good to go for save situation.\n• Silas Park (RP) — Fresh, ACWR 1.02. High-leverage option.\n• Levi Strand (RP) — 2 days rest, ACWR 0.92. Full availability.\n• Rafael Correa (RP) — Lowest workload on staff. ACWR 0.78.\n• Hiroshi Takeda (CL) — 2 days rest, ACWR 0.95. Available.\n\n🟡 Limited:\n• Terrence Holt (RP) — Pitched last 2 of 3 days. ACWR 1.15. Emergency only.\n\n🔴 Unavailable:\n• Dante Vasquez (RP) — ACWR 1.35, high workload risk. Needs 2 days rest minimum.\n\nRecommendation: Bridge with Park/Strand in the 7th-8th, Rivers to close. Keep Holt and Vasquez down tonight.`,
      chart,
    }
  }

  if (q.includes('arsenal') || q.includes('pitch') || q.includes('analyze')) {
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Velo', 'Spin', 'Whiff%'],
      series: [
        { label: 'Four-Seam', values: [95.4, 2380, 24], color: '#4caf50' },
        { label: 'Slider', values: [86.2, 2580, 36], color: '#2196f3' },
        { label: 'Changeup', values: [86.8, 1720, 30], color: '#ffc107' },
      ],
      yMax: 2600,
    }
    return {
      text: `Arsenal Analysis — Tanner Gould:\n\n⚡ Four-Seam Fastball (45% usage)\n   • 95.4 mph / 2380 RPM / +16.2" IVB\n   • 24% whiff rate — plays up due to ride\n   • Stuff+ 120 — well above average\n\n🔵 Slider (28% usage)\n   • 86.2 mph / 2580 RPM / Tight spin\n   • 36% whiff rate — elite putaway pitch\n   • Stuff+ 125 — plus-plus offering\n\n🟡 Changeup (18% usage)\n   • 86.8 mph / 1720 RPM / Heavy fade\n   • 30% whiff rate — effective vs LHH\n   • Stuff+ 112 — above average\n\n🔴 Curveball (9% usage)\n   • 79.4 mph / 2820 RPM / 12-6 shape\n   • 28% whiff rate — show pitch for pace change\n\nKey Insight: The FB-slider tunnel is elite. Batters can't distinguish them until too late. Recommend increasing slider usage in 2-strike counts.`,
      chart,
    }
  }

  if (q.includes('velocity') || q.includes('velo') || q.includes('trend')) {
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: 'W1', value: 95.2 },
        { label: 'W2', value: 95.4 },
        { label: 'W3', value: 95.1 },
        { label: 'W4', value: 95.6 },
        { label: 'W5', value: 95.8 },
      ],
      unit: 'Staff Avg FB (mph)',
    }
    return {
      text: `Velocity Trend Report:\n\n📈 Trending Up:\n• Emilio Vance — FB sitting 96.8, touched 99.3 last start. Career-best velocity.\n• Silas Park — FB up 0.5 mph to 96.4. Arm feels fresh.\n\n📊 Steady:\n• Tanner Gould — Consistent 95-96. No concerns.\n• DeShawn Rivers — 98-99 range as always. Elite arm.\n\n📉 Watch List:\n• Nolan Bradshaw — FB down 0.8 mph from spring training (94.8 → 94.0). Could be fatigue or mechanical.\n• Sora Ishida — Slight dip in FB spin (2240, was 2300). ACWR is elevated.\n\n⚠️ Action Items:\n1. Check Bradshaw's mechanics — possible stride length change\n2. Monitor Ishida's spin rates next bullpen\n3. Vance is peaking — lean on him in big spots`,
      chart,
    }
  }

  if (q.includes('tonight') || q.includes('lineup') || q.includes('prep') || q.includes('game')) {
    const chart: AIChartData = {
      type: 'bar',
      points: [
        { label: 'vs FF', value: 265 },
        { label: 'vs SL', value: 228 },
        { label: 'vs CH', value: 242 },
        { label: 'vs CB', value: 215 },
      ],
      unit: ' OPP AVG',
      yMax: 350,
    }
    return {
      text: `Tonight's Game Prep — vs Nashville Sounds:\n\n🎯 Their Lineup Profile:\n• Team OPS: .792 (4th in league)\n• Heavy RHH lineup (6 of 9)\n• Aggressive early — 58% first-pitch swing rate\n• Weak against elevated FB (.215 AVG) and sharp breaking balls\n\n📊 Key Hitters to Neutralize:\n1. Nate Escobedo (LHH) — .302 AVG, patient. Attack with backdoor slider.\n2. Bryce Kessler (RHH) — .292 AVG, handles velocity. Disrupt with curves.\n3. Troy Fenwick (RHH) — Aggressive, chases up. Pound elevated FB.\n\n💡 Strategy:\n• Establish fastball early to exploit their aggressiveness\n• Use off-speed to neutralize Escobedo and Kessler\n• Bottom of order is weak — attack the zone, save bullets\n• Target 60%+ first-pitch strike rate\n\nStarter Gould is a great matchup against this lineup. His slider will dominate their RHH-heavy order.`,
      chart,
    }
  }

  if (q.includes('workload') || q.includes('concern') || q.includes('injury') || q.includes('acwr')) {
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['7d PC', '28d PC', 'ACWR'],
      series: [
        { label: 'Vasquez', values: [62, 230, 1.35], color: '#e53935' },
        { label: 'Bradshaw', values: [85, 320, 1.22], color: '#ffc107' },
        { label: 'Holt', values: [52, 185, 1.15], color: '#ffc107' },
      ],
      yMax: 350,
    }
    return {
      text: `Workload Concern Report:\n\n🔴 HIGH RISK:\n• Dante Vasquez (RP) — ACWR 1.35\n   62 pitches in 7 days, trending dangerous. Must rest 2+ days.\n   Recommendation: Shut down until ACWR drops below 1.2.\n\n🟡 ELEVATED:\n• Nolan Bradshaw (SP) — ACWR 1.22\n   Workload spiked after back-to-back heavy starts. Shorten next outing to 80 pitches max.\n\n• Terrence Holt (RP) — ACWR 1.15\n   Used 3 of last 5 days. Arm is resilient but don't push.\n   Emergency use only tonight.\n\n• Sora Ishida (SP) — ACWR 1.12\n   Borderline. On normal rotation but monitor spin rates for fatigue signals.\n\n🟢 ALL CLEAR: 8 of 12 pitchers have healthy workloads.\n\nACWR Guidelines:\n• Below 0.8: Under-loaded, can handle more\n• 0.8-1.1: Optimal training zone\n• 1.1-1.3: Elevated risk, monitor\n• Above 1.3: High injury risk, rest required`,
      chart,
    }
  }

  if (q.includes('development') || q.includes('rivers') || q.includes('develop')) {
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: 'Jan', value: 97.8 },
        { label: 'Early Feb', value: 98.2 },
        { label: 'Mid Feb', value: 98.6 },
      ],
      unit: 'FB Velo',
    }
    return {
      text: `Development Update — DeShawn Rivers (CL):\n\n📈 Current Status: Elite closer performing at peak\n\n🎯 Active Goals:\n1. Maintain FB velocity above 98 — ✅ Ahead (sitting 98.6)\n2. Improve curveball consistency — 🟡 On Track (28% whiff, target 32%)\n3. Reduce walks in high-leverage — ✅ Ahead (2.8 BB/9, down from 3.2)\n\n⚡ Arsenal Update:\n• Four-Seam: 98.6 mph, 136 Stuff+ — Dominant\n• Slider: 89.4 mph, 42% whiff — Elite putaway\n• Curveball: 82.0 mph — Developing as 3rd pitch, needs more first-pitch strikes\n\n📋 Recent Progress:\n• Release consistency improved 8% since January\n• Slider shape sharper — more horizontal movement\n• Working on curveball in non-save situations\n\n💡 Recommendation:\nRivers is MLB-ready. Keep developing the curve as a show pitch. His FB-slider combo is already elite. Focus on keeping him healthy through managed workload.`,
      chart,
    }
  }

  // Default
  return {
    text: `Pitching Coach Dashboard Summary:\n\n⚾ Active Staff: 12 pitchers (5 SP, 5 RP, 2 CL)\n📊 Staff ERA: 3.14 | Staff WHIP: 1.08\n📈 Avg Stuff+: 115 (above league average)\n\n🎯 Today's Priorities:\n1. Gould starts tonight vs Nashville — review game plan\n2. Vasquez needs rest (ACWR 1.35) — find alternative bridge arm\n3. Bradshaw's command work continues — bullpen at 2pm\n4. Rivers close to MLB promotion — prep development summary\n\n⚠️ Attention Items:\n• 3 pitchers with elevated workload (Vasquez, Bradshaw, Holt)\n• Ishida's spin rate dip — check next session\n\nWhat area would you like to focus on?`,
  }
}
