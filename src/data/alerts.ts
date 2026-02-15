export interface SmartAlert {
  id: string
  playerId: string
  type: 'breakout' | 'milestone' | 'concern' | 'mechanical'
  title: string
  message: string
  timestamp: string
  metric?: { label: string; value: string; change?: string }
}

export const smartAlerts: SmartAlert[] = [
  {
    id: 'a1',
    playerId: '3000014',
    type: 'breakout',
    title: 'Shane Beckett — Breakout Alert',
    message: 'Exit velocity jumped 3.8 mph in the last 30 days. Current avg EV of 91 mph puts him in the top 5% of the system. Power gains appear sustainable based on bat speed trajectory.',
    timestamp: '2 hours ago',
    metric: { label: 'Avg EV', value: '91.2', change: '+3.8' },
  },
  {
    id: 'a2',
    playerId: '3000030',
    type: 'milestone',
    title: 'Logan Steele — Career High Max EV',
    message: 'Recorded 107 mph max exit velocity during last session — a new career high. This is the 3rd consecutive session above 105 mph.',
    timestamp: '5 hours ago',
    metric: { label: 'Max EV', value: '107', change: '+2' },
  },
  {
    id: 'a3',
    playerId: '3000008',
    type: 'concern',
    title: 'Malik Sutton — Performance Dip',
    message: 'Avg EV has dropped 4 mph over the past 2 weeks (81 → 77). Possible mechanical regression at hand position. Recommend in-person evaluation.',
    timestamp: '1 day ago',
    metric: { label: 'Avg EV', value: '77', change: '-4.0' },
  },
  {
    id: 'a4',
    playerId: '3000001',
    type: 'mechanical',
    title: 'Reno Castillo — Swing Adjustment Detected',
    message: 'Load timing has shifted earlier by 15ms since last visit. Weight transfer is more consistent, and barrel control through the zone has improved. Positive adjustment.',
    timestamp: '1 day ago',
  },
  {
    id: 'a5',
    playerId: '3000021',
    type: 'breakout',
    title: 'Grant Elwood — Consistency Streak',
    message: '4th straight month with avg EV above 90 mph. No regression, steady improvement curve. One of the most reliable bats in the system.',
    timestamp: '2 days ago',
    metric: { label: 'Avg EV', value: '90', change: '+1.2' },
  },
  {
    id: 'a6',
    playerId: '3000018',
    type: 'milestone',
    title: 'Kai Ashford — Hand Path Improvement',
    message: 'Shortened swing path by approximately 2 inches since mechanical adjustment on Jan 10. Results are showing — quicker to the zone with improved timing.',
    timestamp: '3 days ago',
  },
  {
    id: 'a7',
    playerId: '3000002',
    type: 'concern',
    title: 'Darius Vega — Slight Dip in Contact Quality',
    message: 'Hard hit % dropped from 38% to 32% this week. May be over-swinging for power. Recommend shortening up and focusing on line drives.',
    timestamp: '3 days ago',
    metric: { label: 'Hard Hit%', value: '32%', change: '-6%' },
  },
  {
    id: 'a8',
    playerId: '3000019',
    type: 'mechanical',
    title: 'Reese Langdon — Hip Rotation Emphasis',
    message: 'New hip rotation drill regimen started Dec 20. Still in adjustment period — bat speed has not yet responded but the mechanical foundation looks promising.',
    timestamp: '4 days ago',
  },
]

export const alertColors: Record<SmartAlert['type'], { border: string; bg: string; icon: string }> = {
  breakout:   { border: '#4caf50', bg: 'rgba(76,175,80,0.08)',  icon: '#4caf50' },
  milestone:  { border: '#E0AC44', bg: 'rgba(224,172,68,0.08)', icon: '#E0AC44' },
  concern:    { border: '#e53935', bg: 'rgba(229,57,53,0.08)',  icon: '#e53935' },
  mechanical: { border: '#2196f3', bg: 'rgba(33,150,243,0.08)', icon: '#2196f3' },
}

export const alertIcons: Record<SmartAlert['type'], string> = {
  breakout:   '↑',
  milestone:  '★',
  concern:    '!',
  mechanical: '⚙',
}
