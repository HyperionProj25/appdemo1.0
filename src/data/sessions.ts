export interface Session {
  date: string;
  location: string;
  technology: string;
  dataPoints: number;
}

// Technology types cycle to match screenshot pattern
const techs = ['Strength', 'Pitching', 'Hitting', 'Hitting', 'Pitching', 'Hitting', 'Strength', 'Pitching', 'Hitting', 'Pitching', 'Hitting', 'Hitting'];

export const sessions: Session[] = techs.map((tech, i) => ({
  date: '9/13/25',
  location: 'KPI - MH',
  technology: tech,
  dataPoints: 85,
}));

// More varied sessions for player recent sessions
export const playerSessions: Session[] = [
  { date: '9/13/25', location: 'KPI - MH', technology: 'Strength', dataPoints: 85 },
  { date: '9/13/25', location: 'KPI - MH', technology: 'Pitching', dataPoints: 85 },
  { date: '9/13/25', location: 'KPI - MH', technology: 'Hitting', dataPoints: 85 },
  { date: '9/13/25', location: 'KPI - MH', technology: 'Hitting', dataPoints: 85 },
  { date: '9/13/25', location: 'KPI - MH', technology: 'Pitching', dataPoints: 85 },
  { date: '9/13/25', location: 'KPI - MH', technology: 'Hitting', dataPoints: 85 },
];
