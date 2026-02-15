import { players, getBaseballPlayers, getSoftballPlayers } from './players';
import type { AIResponse, AIChartData } from '../components/AIPanel';

// ---------- Player AI ----------
export const playerSuggestions = [
  'What improved most?',
  'One focus for next session',
  'Compare me to HS/College/Pro',
  'How can I increase EV?',
  'How do annotations work?',
];

export function getPlayerAIResponse(query: string, playerName: string): AIResponse {
  const q = query.toLowerCase();
  const firstName = playerName.split(',')[1]?.trim() || playerName;
  const lastName = playerName.split(',')[0]?.trim() || '';
  const p = players.find(pl => pl.lastName === lastName) || players.find(pl => pl.firstName === firstName);
  const ev = p?.avgEV ?? 82;
  const maxEv = p?.maxEV ?? 97;
  const bs = p?.avgBS ?? 54;
  const sw = p?.swings ?? 48;

  if (q.includes('improve') || q.includes('most')) {
    const base = ev - 10;
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: '9/13', value: base },
        { label: '9/25', value: base + 2 },
        { label: '10/10', value: base + 5 },
        { label: '10/25', value: base + 8 },
        { label: '11/14', value: ev },
      ],
      unit: 'Avg EV (MPH)',
    };
    return {
      text: `Great question, ${firstName}! Your Exit Velocity has trended up +${(ev - base).toFixed(1)} MPH over the last 4 sessions \u2014 that\u2019s a strong trajectory. Your barrel consistency is also tightening. I\u2019d recommend continuing with the overload/underload bat drill to keep that momentum going.`,
      chart,
    };
  }

  if (q.includes('focus') || q.includes('next session')) {
    const chart: AIChartData = {
      type: 'bar',
      points: [
        { label: 'Pull', value: 42 },
        { label: 'Center', value: 31 },
        { label: 'Oppo', value: 27 },
      ],
      unit: '%',
      yMax: 50,
    };
    return {
      text: `Here\u2019s your 2-point plan for next session:\n\n\u2022 Attack the inner half \u2014 your spray chart shows most contact is middle-away. Work tee drills on the inner third.\n\u2022 Raise launch angle consistency \u2014 aim for 12-18\u00b0. You\u2019re averaging 8\u00b0, which produces too many groundballs.`,
      chart,
    };
  }

  if (q.includes('compare') || q.includes('hs') || q.includes('college') || q.includes('pro')) {
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Avg EV', 'Max EV', 'Barrel %'],
      series: [
        { label: 'You', values: [ev, maxEv, 38], color: 'var(--accent)' },
        { label: 'HS Avg', values: [76, 88, 28], color: '#666' },
        { label: 'College', values: [85, 95, 42], color: '#4caf50' },
      ],
      yMax: Math.max(maxEv + 5, 110),
    };
    return {
      text: `Here\u2019s how you stack up:\n\nYour Max EV (${maxEv} mph) ${maxEv >= 95 ? 'already exceeds' : 'is approaching'} the college average (95 mph) \u2014 focus on making that your norm, not your ceiling. Barrel consistency (38%) is between HS and College averages.`,
      chart,
    };
  }

  if (q.includes('spray') || q.includes('chart')) {
    const chart: AIChartData = {
      type: 'bar',
      points: [
        { label: 'LF', value: 83 },
        { label: 'LCF', value: 78 },
        { label: 'CF', value: 65 },
        { label: 'RCF', value: 82 },
        { label: 'RF', value: 76 },
      ],
      unit: '%',
      yMax: 100,
    };
    return {
      text: `Your spray chart shows a balanced distribution with a slight pull-side tendency. 83% of your batted balls reach the outfield, which is solid. CF gap balls are your weakest zone \u2014 work on squaring up pitches middle-in.`,
      chart,
    };
  }

  if (q.includes('ev') || q.includes('exit velo')) {
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: 'Wk 1', value: 1.6 },
        { label: 'Wk 2', value: 1.7 },
        { label: 'Wk 3', value: 1.8 },
        { label: 'Wk 4', value: 1.9 },
        { label: 'Target', value: 2.2 },
      ],
      unit: 'Ground Force (x BW)',
    };
    return {
      text: `To boost your EV:\n\n\u2022 Overload training \u2014 heavy bat swings (2-3 oz over) for 15 reps before BP\n\u2022 Lower half engagement \u2014 your ground reaction force could improve. Hawkins data shows your peak force is 1.8x BW; target 2.2x\n\u2022 Timing \u2014 your best EVs come when you load early. Practice a rhythmic load with a stride timer.`,
      chart,
    };
  }

  if (q.includes('annotate') || q.includes('annotation') || q.includes('note') || q.includes('log')) {
    return {
      text: `Here\u2019s how annotations work:\n\nAnnotations let you mark key dates with notes that appear on your metrics charts. For example:\n\n\u2022 9/13/25: "Started training at KPI"\n\u2022 9/25/25: "Switched to new stance"\n\u2022 10/18/25: "Increased weight program"\n\nThese show as vertical dashed lines on your trend charts, making it easy to see how changes affected performance. Click ANNOTATE on any metrics page or DATE LOG on the strength page to add one.`,
    };
  }

  // Default
  const base = ev - 3;
  const chart: AIChartData = {
    type: 'line',
    points: [
      { label: '9/13', value: base - 1 },
      { label: '9/25', value: base },
      { label: '10/10', value: base - 1 },
      { label: '10/25', value: base + 2 },
      { label: '11/14', value: ev },
    ],
    unit: 'Avg EV (MPH)',
  };
  return {
    text: `Looking at your dashboard: you\u2019re averaging ${ev} MPH exit velo with a max of ${maxEv} MPH across ${sw} swings. Your barrel speed sits at ${bs} MPH. The outfield distribution is even at ~83%, which means you\u2019re using all fields. Keep it up \u2014 consistency is your superpower right now.`,
    chart,
  };
}

// ---------- Facility AI ----------
export const facilitySuggestions = [
  "Who's trending up?",
  'Top 3 by Max EV',
  'Any red flags?',
  'Group comparison',
];

export function getFacilityAIResponse(query: string): AIResponse {
  const q = query.toLowerCase();
  const sorted = [...players].sort((a, b) => b.maxEV - a.maxEV);

  if (q.includes('trending') || q.includes('trend')) {
    const top3 = sorted.slice(0, 3);
    const chart: AIChartData = {
      type: 'comparison',
      labels: [top3[0].lastName, top3[1].lastName, top3[2].lastName],
      series: [
        { label: 'Last Month', values: [top3[0].avgEV - 4, top3[1].avgEV - 3, top3[2].avgEV - 3], color: '#666' },
        { label: 'Current', values: [top3[0].avgEV, top3[1].avgEV, top3[2].avgEV], color: 'var(--accent)' },
      ],
      yMax: Math.max(...top3.map(p => p.avgEV)) + 15,
      unit: 'Avg EV (MPH)',
    };
    return {
      text: `Players trending up this month:\n\n\u2022 ${top3[0].firstName} ${top3[0].lastName} \u2014 Avg EV jumped from ${top3[0].avgEV - 4} to ${top3[0].avgEV} MPH over last 3 sessions.\n\u2022 ${top3[1].firstName} ${top3[1].lastName} \u2014 Max EV hit ${top3[1].maxEV} MPH, a new personal best.\n\u2022 ${top3[2].firstName} ${top3[2].lastName} \u2014 Swing count up 20% and maintaining quality.`,
      chart,
    };
  }

  if (q.includes('top') || q.includes('max ev')) {
    const top3 = sorted.slice(0, 3);
    const chart: AIChartData = {
      type: 'bar',
      points: top3.map(p => ({ label: p.lastName, value: p.maxEV })),
      unit: ' MPH',
      yMax: 110,
    };
    return {
      text: `Top 3 athletes by Max EV:\n\n1. ${top3[0].firstName} ${top3[0].lastName} \u2014 ${top3[0].maxEV} MPH\n2. ${top3[1].firstName} ${top3[1].lastName} \u2014 ${top3[1].maxEV} MPH\n3. ${top3[2].firstName} ${top3[2].lastName} \u2014 ${top3[2].maxEV} MPH\n\nAll three are tracking above their age-group averages for college-bound athletes.`,
      chart,
    };
  }

  if (q.includes('red flag') || q.includes('flag') || q.includes('concern')) {
    const chart: AIChartData = {
      type: 'line',
      points: [
        { label: '10/1', value: 79 },
        { label: '10/10', value: 77 },
        { label: '10/18', value: 75 },
        { label: '10/25', value: 73 },
        { label: '11/1', value: 71 },
      ],
      unit: 'Hollins Avg EV',
    };
    return {
      text: `Potential red flags:\n\n\u26a0\ufe0f Cade Hollins \u2014 Avg EV dropped 4 MPH over last 2 sessions while swing count stayed the same. Could indicate fatigue or mechanical regression. Recommend a video review.\n\n\u26a0\ufe0f Malik Sutton \u2014 Launch angle trending heavily toward groundballs (62% last session). Check if he\u2019s dropping his hands.`,
      chart,
    };
  }

  if (q.includes('group') || q.includes('comparison') || q.includes('compare')) {
    const bb = getBaseballPlayers();
    const sb = getSoftballPlayers();
    const bbAvg = Math.round(bb.reduce((s, p) => s + p.avgEV, 0) / bb.length);
    const sbAvg = Math.round(sb.reduce((s, p) => s + p.avgEV, 0) / sb.length);
    const bbMax = Math.max(...bb.map(p => p.maxEV));
    const sbMax = Math.max(...sb.map(p => p.maxEV));
    const chart: AIChartData = {
      type: 'comparison',
      labels: ['Avg EV', 'Max EV'],
      series: [
        { label: 'Baseball', values: [bbAvg, bbMax], color: 'var(--accent)' },
        { label: 'Softball', values: [sbAvg, sbMax], color: '#4caf50' },
      ],
      yMax: 110,
    };
    return {
      text: `Group comparison:\n\nBaseball: Avg EV ${bbAvg} MPH, Top Max ${bbMax} MPH (${bb.length} athletes)\nSoftball: Avg EV ${sbAvg} MPH, Top Max ${sbMax} MPH (${sb.length} athletes)\n\nBaseball group shows more variance which is typical. Softball group is tighter and more consistent.`,
      chart,
    };
  }

  // Default
  return {
    text: `Your facility currently has ${players.length} active athletes across Baseball (${getBaseballPlayers().length}) and Softball (${getSoftballPlayers().length}). The roster is healthy with ${sessions.length} recent sessions logged. Average EV across all athletes is ${Math.round(players.reduce((s, p) => s + p.avgEV, 0) / players.length)} MPH. Want me to dive deeper into any specific area?`,
  };
}

const sessions = { length: 12 };
