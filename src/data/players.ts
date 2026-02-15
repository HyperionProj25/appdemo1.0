export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  sport: 'Baseball' | 'Softball';
  gradYear: number;
  lastSession: string;
  avgEV: number;
  maxEV: number;
  avgBS: number;
  swings: number;
  avgFB?: number;
  maxFB?: number;
  pitches?: number;
  // NEW FIELDS for MLB demo
  position: string;
  team: string;
  level: 'A' | 'A+' | 'AA' | 'AAA' | 'MLB';
  age: number;
  bats: 'L' | 'R' | 'S';
  throws: 'L' | 'R';
  height: string;
  weight: number;
  contractStatus?: string;
}

// Expanded roster: 30 MiLB players across different levels
export const players: Player[] = [
  // Original players with new fields
  { id: '3000001', firstName: 'Reno', lastName: 'Castillo', sport: 'Baseball', gradYear: 2026, lastSession: '01-15-26', avgEV: 89, maxEV: 104, avgBS: 56, swings: 48, avgFB: 91, maxFB: 97, pitches: 38, position: 'SS', team: 'Durham Bulls', level: 'AAA', age: 24, bats: 'R', throws: 'R', height: "6'1\"", weight: 185, contractStatus: 'Pre-Arb' },
  { id: '3000002', firstName: 'Darius', lastName: 'Vega', sport: 'Baseball', gradYear: 2026, lastSession: '01-14-26', avgEV: 82, maxEV: 97, avgBS: 54, swings: 48, avgFB: 85, maxFB: 92, pitches: 38, position: 'CF', team: 'Durham Bulls', level: 'AAA', age: 23, bats: 'L', throws: 'L', height: "5'11\"", weight: 175, contractStatus: 'Pre-Arb' },
  { id: '3000003', firstName: 'Colton', lastName: 'Briggs', sport: 'Baseball', gradYear: 2026, lastSession: '01-12-26', avgEV: 78, maxEV: 93, avgBS: 51, swings: 42, avgFB: 82, maxFB: 89, pitches: 35, position: '2B', team: 'Montgomery Biscuits', level: 'AA', age: 22, bats: 'R', throws: 'R', height: "5'10\"", weight: 170, contractStatus: 'Pre-Arb' },
  { id: '3000004', firstName: 'Jace', lastName: 'Thornton', sport: 'Baseball', gradYear: 2026, lastSession: '01-13-26', avgEV: 80, maxEV: 95, avgBS: 53, swings: 45, avgFB: 84, maxFB: 91, pitches: 40, position: '3B', team: 'Durham Bulls', level: 'AAA', age: 25, bats: 'R', throws: 'R', height: "6'2\"", weight: 205, contractStatus: 'Arb 1' },
  { id: '3000005', firstName: 'Finn', lastName: 'Calloway', sport: 'Baseball', gradYear: 2026, lastSession: '01-11-26', avgEV: 76, maxEV: 91, avgBS: 49, swings: 39, avgFB: 80, maxFB: 87, pitches: 32, position: 'LF', team: 'Bowling Green Hot Rods', level: 'A', age: 20, bats: 'L', throws: 'L', height: "6'0\"", weight: 180 },
  { id: '3000006', firstName: 'Tessa', lastName: 'Ridley', sport: 'Softball', gradYear: 2026, lastSession: '01-10-26', avgEV: 65, maxEV: 78, avgBS: 46, swings: 44, position: 'SS', team: 'Charleston RiverDogs', level: 'A', age: 21, bats: 'R', throws: 'R', height: "5'7\"", weight: 145 },
  { id: '3000007', firstName: 'Keaton', lastName: 'Voss', sport: 'Baseball', gradYear: 2026, lastSession: '01-09-26', avgEV: 79, maxEV: 94, avgBS: 52, swings: 41, avgFB: 83, maxFB: 90, pitches: 36, position: 'RF', team: 'Montgomery Biscuits', level: 'AA', age: 23, bats: 'R', throws: 'R', height: "6'3\"", weight: 210 },
  { id: '3000008', firstName: 'Malik', lastName: 'Sutton', sport: 'Baseball', gradYear: 2026, lastSession: '01-08-26', avgEV: 77, maxEV: 92, avgBS: 50, swings: 43, avgFB: 81, maxFB: 88, pitches: 34, position: 'C', team: 'Durham Bulls', level: 'AAA', age: 24, bats: 'R', throws: 'R', height: "6'0\"", weight: 195, contractStatus: 'Pre-Arb' },
  { id: '3000009', firstName: 'Nora', lastName: 'Hewitt', sport: 'Softball', gradYear: 2026, lastSession: '01-07-26', avgEV: 63, maxEV: 76, avgBS: 44, swings: 40, position: 'CF', team: 'Charleston RiverDogs', level: 'A', age: 20, bats: 'L', throws: 'L', height: "5'6\"", weight: 140 },
  { id: '3000010', firstName: 'Quinn', lastName: 'Trask', sport: 'Softball', gradYear: 2026, lastSession: '01-06-26', avgEV: 64, maxEV: 77, avgBS: 45, swings: 38, position: '3B', team: 'Bowling Green Hot Rods', level: 'A', age: 21, bats: 'R', throws: 'R', height: "5'8\"", weight: 155 },
  { id: '3000011', firstName: 'Piper', lastName: 'Laine', sport: 'Softball', gradYear: 2026, lastSession: '01-05-26', avgEV: 62, maxEV: 75, avgBS: 43, swings: 36, position: 'LF', team: 'Charleston RiverDogs', level: 'A', age: 19, bats: 'L', throws: 'L', height: "5'5\"", weight: 135 },
  { id: '3000012', firstName: 'Cade', lastName: 'Hollins', sport: 'Baseball', gradYear: 2026, lastSession: '01-04-26', avgEV: 75, maxEV: 90, avgBS: 48, swings: 37, avgFB: 79, maxFB: 86, pitches: 30, position: '1B', team: 'Bowling Green Hot Rods', level: 'A', age: 20, bats: 'L', throws: 'R', height: "6'4\"", weight: 225 },
  { id: '3000013', firstName: 'Nico', lastName: 'Rivas', sport: 'Baseball', gradYear: 2026, lastSession: '01-03-26', avgEV: 81, maxEV: 96, avgBS: 55, swings: 46, avgFB: 86, maxFB: 93, pitches: 42, position: 'DH', team: 'Montgomery Biscuits', level: 'AA', age: 22, bats: 'R', throws: 'R', height: "6'1\"", weight: 200 },

  // NEW PLAYERS (14-30) to reach 30 total
  { id: '3000014', firstName: 'Shane', lastName: 'Beckett', sport: 'Baseball', gradYear: 2025, lastSession: '01-15-26', avgEV: 91, maxEV: 106, avgBS: 58, swings: 52, avgFB: 94, maxFB: 99, pitches: 45, position: 'RF', team: 'Durham Bulls', level: 'AAA', age: 26, bats: 'R', throws: 'R', height: "6'2\"", weight: 215, contractStatus: 'Arb 2' },
  { id: '3000015', firstName: 'Trent', lastName: 'Valen', sport: 'Baseball', gradYear: 2025, lastSession: '01-14-26', avgEV: 87, maxEV: 101, avgBS: 55, swings: 50, position: 'LF', team: 'Durham Bulls', level: 'AAA', age: 25, bats: 'L', throws: 'L', height: "6'0\"", weight: 190, contractStatus: 'Arb 1' },
  { id: '3000016', firstName: 'Cole', lastName: 'Merritt', sport: 'Baseball', gradYear: 2026, lastSession: '01-13-26', avgEV: 84, maxEV: 98, avgBS: 53, swings: 47, avgFB: 88, maxFB: 94, pitches: 40, position: '1B', team: 'Montgomery Biscuits', level: 'AA', age: 23, bats: 'L', throws: 'L', height: "6'3\"", weight: 230 },
  { id: '3000017', firstName: 'Drew', lastName: 'Keegan', sport: 'Baseball', gradYear: 2026, lastSession: '01-12-26', avgEV: 79, maxEV: 94, avgBS: 51, swings: 44, position: '2B', team: 'Bowling Green Hot Rods', level: 'A', age: 21, bats: 'S', throws: 'R', height: "5'9\"", weight: 165 },
  { id: '3000018', firstName: 'Kai', lastName: 'Ashford', sport: 'Baseball', gradYear: 2025, lastSession: '01-11-26', avgEV: 88, maxEV: 102, avgBS: 56, swings: 51, position: 'CF', team: 'Montgomery Biscuits', level: 'AA', age: 24, bats: 'R', throws: 'R', height: "5'11\"", weight: 180, contractStatus: 'Pre-Arb' },
  { id: '3000019', firstName: 'Reese', lastName: 'Langdon', sport: 'Baseball', gradYear: 2026, lastSession: '01-10-26', avgEV: 83, maxEV: 97, avgBS: 52, swings: 46, avgFB: 86, maxFB: 92, pitches: 38, position: 'SS', team: 'Montgomery Biscuits', level: 'AA', age: 22, bats: 'R', throws: 'R', height: "6'0\"", weight: 185 },
  { id: '3000020', firstName: 'Zane', lastName: 'Corbett', sport: 'Baseball', gradYear: 2026, lastSession: '01-09-26', avgEV: 77, maxEV: 92, avgBS: 49, swings: 41, position: 'C', team: 'Bowling Green Hot Rods', level: 'A', age: 20, bats: 'R', throws: 'R', height: "5'11\"", weight: 200 },
  { id: '3000021', firstName: 'Grant', lastName: 'Elwood', sport: 'Baseball', gradYear: 2025, lastSession: '01-08-26', avgEV: 90, maxEV: 105, avgBS: 57, swings: 53, position: '3B', team: 'Durham Bulls', level: 'AAA', age: 25, bats: 'R', throws: 'R', height: "6'1\"", weight: 205, contractStatus: 'Arb 1' },
  { id: '3000022', firstName: 'Brock', lastName: 'Allister', sport: 'Baseball', gradYear: 2026, lastSession: '01-07-26', avgEV: 82, maxEV: 96, avgBS: 53, swings: 48, position: 'RF', team: 'Charleston RiverDogs', level: 'A+', age: 21, bats: 'L', throws: 'R', height: "6'2\"", weight: 195 },
  { id: '3000023', firstName: 'Miles', lastName: 'Prescott', sport: 'Baseball', gradYear: 2026, lastSession: '01-06-26', avgEV: 80, maxEV: 95, avgBS: 51, swings: 45, avgFB: 84, maxFB: 90, pitches: 36, position: 'LF', team: 'Charleston RiverDogs', level: 'A+', age: 22, bats: 'R', throws: 'R', height: "6'0\"", weight: 185 },
  { id: '3000024', firstName: 'Reed', lastName: 'Callahan', sport: 'Baseball', gradYear: 2026, lastSession: '01-05-26', avgEV: 78, maxEV: 93, avgBS: 50, swings: 43, position: 'CF', team: 'Charleston RiverDogs', level: 'A+', age: 21, bats: 'S', throws: 'R', height: "5'10\"", weight: 170 },
  { id: '3000025', firstName: 'Owen', lastName: 'Darcy', sport: 'Baseball', gradYear: 2025, lastSession: '01-04-26', avgEV: 86, maxEV: 100, avgBS: 54, swings: 49, position: 'DH', team: 'Montgomery Biscuits', level: 'AA', age: 24, bats: 'L', throws: 'R', height: "6'1\"", weight: 210, contractStatus: 'Pre-Arb' },
  { id: '3000026', firstName: 'Blake', lastName: 'Whitfield', sport: 'Baseball', gradYear: 2026, lastSession: '01-03-26', avgEV: 81, maxEV: 95, avgBS: 52, swings: 47, avgFB: 85, maxFB: 91, pitches: 39, position: '1B', team: 'Charleston RiverDogs', level: 'A+', age: 22, bats: 'L', throws: 'L', height: "6'4\"", weight: 235 },
  { id: '3000027', firstName: 'Troy', lastName: 'Hensler', sport: 'Baseball', gradYear: 2026, lastSession: '01-02-26', avgEV: 76, maxEV: 91, avgBS: 48, swings: 40, position: 'SS', team: 'Bowling Green Hot Rods', level: 'A', age: 19, bats: 'R', throws: 'R', height: "5'11\"", weight: 175 },
  { id: '3000028', firstName: 'Gavin', lastName: 'Rourke', sport: 'Baseball', gradYear: 2025, lastSession: '01-01-26', avgEV: 85, maxEV: 99, avgBS: 54, swings: 48, position: 'C', team: 'Montgomery Biscuits', level: 'AA', age: 23, bats: 'R', throws: 'R', height: "6'0\"", weight: 205, contractStatus: 'Pre-Arb' },
  { id: '3000029', firstName: 'Wes', lastName: 'Kendrick', sport: 'Baseball', gradYear: 2026, lastSession: '12-31-25', avgEV: 79, maxEV: 94, avgBS: 50, swings: 44, position: '2B', team: 'Charleston RiverDogs', level: 'A+', age: 21, bats: 'R', throws: 'R', height: "5'9\"", weight: 168 },
  { id: '3000030', firstName: 'Logan', lastName: 'Steele', sport: 'Baseball', gradYear: 2025, lastSession: '12-30-25', avgEV: 92, maxEV: 107, avgBS: 59, swings: 54, position: 'RF', team: 'Durham Bulls', level: 'AAA', age: 26, bats: 'R', throws: 'R', height: "6'3\"", weight: 220, contractStatus: 'Arb 2' },
];

export function getPlayer(id: string): Player | undefined {
  return players.find(p => p.id === id);
}

export function getPlayerName(p: Player): string {
  return `${p.lastName}, ${p.firstName}`;
}

export function getPlayerFullName(p: Player): string {
  return `${p.firstName} ${p.lastName}`;
}

export function getBaseballPlayers(): Player[] {
  return players.filter(p => p.sport === 'Baseball');
}

export function getSoftballPlayers(): Player[] {
  return players.filter(p => p.sport === 'Softball');
}

export function getPlayersByTeam(team: string): Player[] {
  return players.filter(p => p.team === team);
}

export function getPlayersByLevel(level: 'A' | 'A+' | 'AA' | 'AAA'): Player[] {
  return players.filter(p => p.level === level);
}

export const teams = ['Durham Bulls', 'Montgomery Biscuits', 'Charleston RiverDogs', 'Bowling Green Hot Rods'] as const;
export type Team = typeof teams[number];
