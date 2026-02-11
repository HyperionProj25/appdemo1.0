import { players, getPlayerFullName } from './players'
import type { AIResponse, AIChartData } from '../components/AIPanel'

// ============================================
// SCOUT AI - Territory coverage, prospect updates
// ============================================
export const scoutSuggestions = [
  "Who's hot in my territory?",
  "Summarize Garcia's development",
  "Compare my top 3 prospects",
  "Any mechanical changes to note?",
  "Prep me for tomorrow's visit",
]

export function getScoutAIResponse(query: string): AIResponse {
  const q = query.toLowerCase()

  if (q.includes('hot') || q.includes('trending') || q.includes('up')) {
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Rodriguez', 'Clark', 'Lee'],
      series: [
        { label: 'Last Month', values: [88, 89, 87], color: '#666' },
        { label: 'Current', values: [91, 92, 90], color: 'var(--accent)' },
      ],
      yMax: 100,
    }
    return {
      text: `Here are your hot prospects this month:\n\n🔥 Ethan Rodriguez — Avg EV jumped 3.5 mph to 91. His bat speed gains are translating. He's ready for a harder look.\n\n🔥 Chris Clark — Career-high 107 max EV. Power is legit and sustainable based on swing mechanics.\n\n🔥 Jordan Lee — Quietly consistent. 4th straight month above 90 EV with improved selectivity.\n\nRecommendation: Rodriguez should be prioritized for your next front office call.`,
      chart,
    }
  }

  if (q.includes('garcia') || q.includes('marco')) {
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
      text: `Marco Garcia Development Summary:\n\n📈 Exit Velocity: +3.5 mph since October (86 → 89.4)\n📈 Max EV: Touched 104 mph, up from 101\n📈 Bat Speed: 56 mph, top 15% in system\n\nMechanical Notes:\n• Adjusted load timing in November — more consistent weight transfer\n• Shortened swing path by ~2 inches\n• Better barrel control through the zone\n\nProjection: On current trajectory, Marco projects as a 40-grade hit tool with 55 raw power. The bat speed gains are real and sustainable.\n\nRecommendation: Worth a 40-man consideration this offseason.`,
      chart,
    }
  }

  if (q.includes('compare') || q.includes('top 3') || q.includes('top three')) {
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Avg EV', 'Max EV', 'Bat Speed'],
      series: [
        { label: 'Rodriguez', values: [91, 106, 58], color: 'var(--accent)' },
        { label: 'Clark', values: [92, 107, 59], color: '#4caf50' },
        { label: 'Garcia', values: [89, 104, 56], color: '#2196f3' },
      ],
      yMax: 115,
    }
    return {
      text: `Top 3 Prospect Comparison:\n\n1. Chris Clark (AAA)\n   • Most raw power in the system\n   • 107 max EV, 59 mph bat speed\n   • Ready for MLB looks\n\n2. Ethan Rodriguez (AAA)\n   • Best improvement trajectory\n   • +4.2 mph EV year-over-year\n   • Elite bat-to-ball skills\n\n3. Marco Garcia (AAA)\n   • Most refined approach\n   • Mechanical improvements showing\n   • Highest floor of the three\n\nAll three are legitimate MLB prospects. Clark has the highest ceiling, Garcia the highest floor.`,
      chart,
    }
  }

  if (q.includes('mechanical') || q.includes('changes') || q.includes('shift')) {
    return {
      text: `Recent Mechanical Changes in Your Territory:\n\n🔧 Marco Garcia (Jan 15)\n   • Load timing adjusted — earlier stride initiation\n   • Result: More consistent weight transfer, +2 mph EV\n\n🔧 Tyler Morrison (Jan 10)\n   • Stance widened 2 inches\n   • Result: Better balance, fewer swing-and-misses\n\n🔧 Brandon Williams (Dec 28)\n   • Hand path shortened\n   • Result: Quicker to the zone, improved timing\n\n🔧 Dylan Martinez (Dec 20)\n   • Hip rotation emphasis\n   • Result: Still in adjustment period, monitor closely\n\nNone of these changes raise red flags. All are positive development adjustments.`,
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
      text: `Prep for Tomorrow's Visit — Ethan Rodriguez:\n\n📍 Location: Durham Bulls facility\n🎯 Key Focus Areas:\n\n1. Power Surge Verification\n   • Avg EV: 91 mph (+3.8 since last visit)\n   • Is this sustainable? Watch his swing plane\n\n2. Mechanical Consistency\n   • Load timing was inconsistent in December\n   • Check if adjustments have stuck\n\n3. Interview Points\n   • Ask about offseason training regimen\n   • Gauge mental readiness for callup\n\nTalking Points for Front Office:\n• Power is playing up, not just hot streak\n• Mechanical improvements are documented\n• Ready for the next level conversation`,
      chart,
    }
  }

  // Default
  return {
    text: `Your territory currently has 12 active prospects across 4 affiliates:\n\n• AAA (Durham): 8 players — 3 trending up\n• AA (Montgomery): 6 players — 1 breakout candidate\n• A+ (Charleston): 4 players — steady development\n• A (Bowling Green): 4 players — early stage\n\nKey insight: Your AAA group is stronger than league average this year. Rodriguez and Clark are legitimate 40-man candidates.\n\nWhat would you like to dive into?`,
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
]

export function getCoachAIResponse(query: string): AIResponse {
  const q = query.toLowerCase()

  if (q.includes('trending') || q.includes('team') || q.includes('how')) {
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: 'W1', value: 83.2 },
        { label: 'W2', value: 84.1 },
        { label: 'W3', value: 84.8 },
        { label: 'W4', value: 85.4 },
      ],
      unit: 'Team Avg EV',
    }
    return {
      text: `Team Trend Report — Durham Bulls:\n\n📈 Team Avg EV: 85.4 mph (+2.2 from month start)\n📈 Hard Hit %: 42.3% (+3.5% month-over-month)\n📈 Barrel Rate: 11.2% (up from 9.8%)\n\nTop Performers This Week:\n1. Chris Clark — 92 Avg EV, .340/.380/.620\n2. Jordan Lee — 90 Avg EV, consistent contact\n3. Marco Garcia — Mechanical gains paying off\n\nConcern: Jayden Portes is in a 2-week slump. Consider adjusting his approach.`,
      chart,
    }
  }

  if (q.includes('struggling') || q.includes('slump') || q.includes('cold')) {
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Last Month', 'This Week'],
      series: [
        { label: 'Portes EV', values: [81, 77], color: '#e53935' },
        { label: 'Bravo EV', values: [84, 80], color: '#ffc107' },
      ],
      yMax: 90,
    }
    return {
      text: `Players Currently Struggling:\n\n🔴 Jayden Portes (Catcher)\n   • Avg EV down 4 mph (81 → 77)\n   • Launch angle trending negative\n   • Possible cause: Hand position at setup\n   • Recommendation: Tee work focusing on staying through the ball\n\n🟡 Angel Bravo (CF)\n   • Slight dip, nothing alarming\n   • May be over-swinging for power\n   • Recommendation: Shorten up, focus on line drives\n\nNeither is a major concern yet, but Portes needs intervention this week.`,
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
      text: `Matchup Prep — vs Derek Williams (RHP, Nashville):\n\n🎯 His Arsenal:\n• Fastball (58%) — 97 mph avg, rides up\n• Slider (22%) — Sharp, 85 mph\n• Changeup (12%) — Fades arm-side\n• Curveball (8%) — Loopy, hittable\n\n📊 Your Team vs His Pitch Types:\n• vs FB: .285 — Attack early in counts\n• vs SL: .242 — Lay off down-and-away\n• vs CB: .221 — Weakness, he'll exploit it\n\n💡 Game Plan:\n1. Be aggressive in fastball counts\n2. Don't chase the slider\n3. Stack lefties — he's worse vs LHH (.310 BAA)\n\nLineup suggestion: Lead with Morrison, Bravo, Thompson.`,
      chart,
    }
  }

  if (q.includes('swing') || q.includes('changes') || q.includes('adjust')) {
    return {
      text: `Recommended Swing Adjustments:\n\n🔧 Jayden Portes\n   • Issue: Dropping hands at load\n   • Fix: Hands stay at shoulder height\n   • Drill: Mirror work, 50 dry swings/day\n\n🔧 Austin Brown\n   • Issue: Early hip rotation, losing power\n   • Fix: Stay closed longer\n   • Drill: Stride separation drill\n\n🔧 Kevin Jackson\n   • Issue: Collapsing back side\n   • Fix: Maintain posture through swing\n   • Drill: Back leg stability work\n\nAll three are fixable within a week with focused BP. Want me to create a drill sequence for any of them?`,
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
      text: `Left vs Right-Handed Hitter Analysis:\n\n🔵 Left-Handed Hitters (6):\n• Avg EV: 86.2 mph\n• Hard Hit: 44.1%\n• Best: Tyler Morrison, Jake Thompson\n\n🔴 Right-Handed Hitters (9):\n• Avg EV: 84.1 mph\n• Hard Hit: 40.3%\n• Best: Chris Clark, Jordan Lee\n\nTonight's Recommendation:\nAgainst RHP Derek Williams, stack your lefties. Morrison should hit 2nd, Thompson 5th for RBI opportunities.\n\nYour lefties hit .310 vs RHP this month. Use that advantage.`,
      chart,
    }
  }

  // Default
  return {
    text: `Coach Dashboard Summary:\n\n👥 Active Roster: 15 hitters\n📊 Team Avg EV: 85.2 mph\n📈 Trending Up: 8 players\n📉 Needs Attention: 2 players\n\nToday's Priority:\n1. Review Portes' swing mechanics\n2. Prep lineup for tonight's RHP\n3. Check in with Thompson on oblique\n\nWhat area would you like to focus on?`,
  }
}

// ============================================
// AGENT AI - Contract prep, development evidence
// ============================================
export const agentSuggestions = [
  "Build Rodriguez's arb case",
  "Compare Clark to recent deals",
  "What's Lee's market value?",
  "Generate talking points",
  "Export development summary",
]

export function getAgentAIResponse(query: string): AIResponse {
  const q = query.toLowerCase()

  if (q.includes('rodriguez') || q.includes('arb case') || q.includes('ethan')) {
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: '2024', value: 85 },
        { label: 'Early 25', value: 87 },
        { label: 'Mid 25', value: 89 },
        { label: '2026', value: 91 },
      ],
      unit: 'Avg EV Trend',
    }
    return {
      text: `Ethan Rodriguez — Arbitration Case Builder:\n\n📈 Documented Growth (Verified Data):\n• Exit Velocity: +6.1 mph over 2 years (85 → 91.2)\n• Max EV: +8 mph (98 → 106)\n• Barrel Rate: 8.2% → 14.1% (+72% improvement)\n• Bat Speed: 55 → 58 mph (+5.5%)\n\n💰 Comparable Contracts:\n• Similar profile player A: $2.1M (Arb 2, 2024)\n• Similar profile player B: $1.8M (Arb 2, 2024)\n\n🎯 Recommended Ask: $2.0M - $2.3M\n\n📋 Key Talking Points:\n1. "Sustained improvement, not a hot streak"\n2. "Power gains are mechanical, not age-based"\n3. "Top 15% exit velo in the system"\n\nThis is a strong case. The data supports premium value.`,
      chart,
    }
  }

  if (q.includes('clark') || q.includes('deals') || q.includes('compare')) {
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Avg EV', 'Max EV', 'Barrel%'],
      series: [
        { label: 'Clark', values: [92, 107, 15], color: 'var(--accent)' },
        { label: 'Comp A', values: [90, 105, 13], color: '#4caf50' },
        { label: 'Comp B', values: [89, 103, 12], color: '#2196f3' },
      ],
      yMax: 115,
    }
    return {
      text: `Chris Clark — Market Comparison:\n\n📊 Clark's Profile:\n• Avg EV: 92.1 mph (94th percentile)\n• Max EV: 107 mph (elite)\n• Barrel Rate: 15.2% (well above average)\n\n💰 Comparable Recent Deals:\n\n1. Comp A (Arb 2, 2024): $2.8M\n   • Similar power profile\n   • Clark has better max EV\n\n2. Comp B (Arb 2, 2024): $2.4M\n   • Slightly lower power numbers\n   • Clark clearly outperforms\n\n🎯 Recommended Range: $2.6M - $3.0M\n\nClark's power metrics are elite. The data supports a top-of-market ask for his service time. His 107 mph max EV puts him in rare company.`,
      chart,
    }
  }

  if (q.includes('lee') || q.includes('market value') || q.includes('jordan')) {
    const chart: AIChartData = {
      type: 'bar',
      points: [
        { label: '2024', value: 87 },
        { label: '2025', value: 89 },
        { label: '2026', value: 90 },
      ],
      unit: ' Avg EV',
      yMax: 95,
    }
    return {
      text: `Jordan Lee — Market Value Assessment:\n\n📈 Development Arc:\n• Consistent 3-year improvement trend\n• Avg EV: 87 → 89 → 90 mph\n• No regression, steady gains\n\n💎 Value Proposition:\n• Reliability over ceiling\n• Defensive asset (3B, above average)\n• Leadership intangibles\n\n💰 Market Value: $1.6M - $1.9M (Arb 1)\n\n📋 Negotiation Angle:\n"Jordan represents low-risk, consistent production. His development curve is exactly what organizations pay for — no volatility, just steady improvement."\n\nThis is a floor play, not a ceiling play. Position accordingly.`,
      chart,
    }
  }

  if (q.includes('talking points') || q.includes('generate')) {
    return {
      text: `Auto-Generated Talking Points for Your Clients:\n\n📋 Ethan Rodriguez (Arb 2):\n1. Exit velocity improved 4.2 mph YoY — top 15% in system\n2. Barrel rate increased 72% — elite improvement trajectory  \n3. Zero stretches of 10+ games below .250 — consistency\n4. Mechanical changes documented and sustainable\n\n📋 Chris Clark (Arb 2):\n1. 107 mph max EV — rare power profile\n2. Career-best marks in every power category\n3. 3 consecutive seasons of improvement\n4. Age-appropriate development, peak years ahead\n\n📋 Jordan Lee (Arb 1):\n1. Steady 3-year improvement trend, no regression\n2. Plus defense adds roster flexibility value\n3. Clubhouse presence, leadership metrics\n4. Low-risk, high-floor profile\n\nAll talking points are backed by verified Baseline data. Export-ready for meetings.`,
    }
  }

  if (q.includes('export') || q.includes('summary') || q.includes('pdf')) {
    return {
      text: `Development Summary — Export Ready:\n\n📄 I can generate the following reports:\n\n1. Full Development Resume (PDF)\n   • Career arc visualization\n   • Key metrics with trend lines\n   • Comparable player analysis\n   • Talking points summary\n\n2. One-Page Snapshot\n   • Quick reference for meetings\n   • Key stats highlighted\n   • Visual trend charts\n\n3. Arbitration Data Pack\n   • All supporting evidence\n   • Comparable contracts\n   • Recommended ask range\n\nClick "Export Resume" on any client card to generate. All data is verified through Baseline's tracking system — no opinions, just facts.\n\nWhich format would be most useful for your next meeting?`,
    }
  }

  // Default
  return {
    text: `Agent Dashboard Summary:\n\n👥 Active Clients: 3 players\n💰 Total Contract Value: $2.77M\n📅 Upcoming: 2 arbitration-eligible this offseason\n\n🎯 Priority Actions:\n1. Rodriguez arb case — strong, ready to file\n2. Clark market comp — research complete\n3. Lee value assessment — done\n\nBaseline gives you what no other agent has: verified development data that stands up in negotiation. Every trend, every improvement, documented.\n\nWhat would you like to work on?`,
  }
}
