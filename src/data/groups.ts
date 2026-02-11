export interface Group {
  id: string;
  name: string;
  year: number;
  athleteCount: number;
  technologies: string[];
  players: { name: string; year: number }[];
}

export const groups: Group[] = [
  {
    id: 'sg1',
    name: 'SOFTBALL GROUP 1 - HITTING',
    year: 2026,
    athleteCount: 3,
    technologies: ['Hawkins', 'HitTrax', 'Trackman', 'Blast Motion'],
    players: [
      { name: 'Griswold, Abby', year: 2026 },
      { name: 'Baker, Sarah', year: 2026 },
      { name: 'Daniels, Brea', year: 2026 },
    ],
  },
  {
    id: 'bg1',
    name: 'BASEBALL GROUP 1 - HITTING',
    year: 2026,
    athleteCount: 5,
    technologies: ['Trackman', 'HitTrax'],
    players: [
      { name: 'Bravo, Angel', year: 2026 },
      { name: 'Lucq, Mason', year: 2026 },
      { name: 'Duncan, Wyatt', year: 2026 },
      { name: 'Lucq, Mason', year: 2026 },
      { name: 'Duncan, Wyatt', year: 2025 },
    ],
  },
];
