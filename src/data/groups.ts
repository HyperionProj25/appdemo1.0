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
      { name: 'Ridley, Tessa', year: 2026 },
      { name: 'Hewitt, Nora', year: 2026 },
      { name: 'Laine, Piper', year: 2026 },
    ],
  },
  {
    id: 'bg1',
    name: 'BASEBALL GROUP 1 - HITTING',
    year: 2026,
    athleteCount: 5,
    technologies: ['Trackman', 'HitTrax'],
    players: [
      { name: 'Vega, Darius', year: 2026 },
      { name: 'Briggs, Colton', year: 2026 },
      { name: 'Thornton, Jace', year: 2026 },
      { name: 'Briggs, Colton', year: 2026 },
      { name: 'Thornton, Jace', year: 2025 },
    ],
  },
];
