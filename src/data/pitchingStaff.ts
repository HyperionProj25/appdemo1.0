export interface PitchArsenal {
  type: 'FF' | 'SI' | 'SL' | 'CB' | 'CH' | 'CT' | 'SW'
  name: string
  usage: number
  velo: number
  spin: number
  ivb: number
  hb: number
  whiffRate: number
  stuffPlus: number
}

export interface Pitcher {
  id: string
  firstName: string
  lastName: string
  role: 'SP' | 'RP' | 'CL'
  throws: 'L' | 'R'
  age: number
  era: number
  whip: number
  kPer9: number
  bbPer9: number
  ip: number
  wins: number
  losses: number
  saves: number
  avgFB: number
  maxFB: number
  stuffPlus: number
  locationPlus: number
  pitchingPlus: number
  arsenal: PitchArsenal[]
  lastAppearance: string
  pitchCount7Day: number
  pitchCount28Day: number
  acwr: number
  readiness: 'green' | 'yellow' | 'red'
}

export const pitchColors: Record<string, string> = {
  FF: '#4caf50',
  SI: '#66bb6a',
  SL: '#2196f3',
  CB: '#f44336',
  CH: '#ffc107',
  CT: '#9c27b0',
  SW: '#00bcd4',
}

export const pitchingStaff: Pitcher[] = [
  // ===== STARTERS (5) =====
  {
    id: 'P001', firstName: 'Tanner', lastName: 'Gould', role: 'SP', throws: 'R', age: 26,
    era: 3.12, whip: 1.08, kPer9: 10.2, bbPer9: 2.8, ip: 142.1, wins: 10, losses: 5, saves: 0,
    avgFB: 95.4, maxFB: 98.1, stuffPlus: 118, locationPlus: 112, pitchingPlus: 115,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 45, velo: 95.4, spin: 2380, ivb: 16.2, hb: -6.8, whiffRate: 24, stuffPlus: 120 },
      { type: 'SL', name: 'Slider', usage: 28, velo: 86.2, spin: 2580, ivb: 1.2, hb: 3.4, whiffRate: 36, stuffPlus: 125 },
      { type: 'CH', name: 'Changeup', usage: 18, velo: 86.8, spin: 1720, ivb: 6.4, hb: -14.2, whiffRate: 30, stuffPlus: 112 },
      { type: 'CB', name: 'Curveball', usage: 9, velo: 79.4, spin: 2820, ivb: -8.6, hb: 5.2, whiffRate: 28, stuffPlus: 108 },
    ],
    lastAppearance: '2026-02-10', pitchCount7Day: 98, pitchCount28Day: 380, acwr: 1.05, readiness: 'green',
  },
  {
    id: 'P002', firstName: 'Sora', lastName: 'Ishida', role: 'SP', throws: 'L', age: 24,
    era: 3.48, whip: 1.15, kPer9: 9.6, bbPer9: 3.1, ip: 128.0, wins: 8, losses: 6, saves: 0,
    avgFB: 93.2, maxFB: 96.4, stuffPlus: 110, locationPlus: 105, pitchingPlus: 108,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 38, velo: 93.2, spin: 2240, ivb: 17.8, hb: 8.4, whiffRate: 22, stuffPlus: 108 },
      { type: 'CH', name: 'Changeup', usage: 24, velo: 84.6, spin: 1680, ivb: 5.2, hb: 15.6, whiffRate: 34, stuffPlus: 122 },
      { type: 'CB', name: 'Curveball', usage: 22, velo: 78.8, spin: 2760, ivb: -9.2, hb: -4.8, whiffRate: 32, stuffPlus: 115 },
      { type: 'SL', name: 'Slider', usage: 16, velo: 84.0, spin: 2420, ivb: 0.8, hb: -2.6, whiffRate: 26, stuffPlus: 98 },
    ],
    lastAppearance: '2026-02-09', pitchCount7Day: 92, pitchCount28Day: 350, acwr: 1.12, readiness: 'yellow',
  },
  {
    id: 'P003', firstName: 'Emilio', lastName: 'Vance', role: 'SP', throws: 'R', age: 28,
    era: 2.85, whip: 1.02, kPer9: 11.1, bbPer9: 2.2, ip: 156.2, wins: 12, losses: 4, saves: 0,
    avgFB: 96.8, maxFB: 99.3, stuffPlus: 124, locationPlus: 118, pitchingPlus: 121,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 42, velo: 96.8, spin: 2520, ivb: 18.4, hb: -5.2, whiffRate: 28, stuffPlus: 128 },
      { type: 'SW', name: 'Sweeper', usage: 26, velo: 82.4, spin: 2680, ivb: -2.4, hb: 14.8, whiffRate: 40, stuffPlus: 132 },
      { type: 'CH', name: 'Changeup', usage: 20, velo: 88.2, spin: 1640, ivb: 4.8, hb: -16.2, whiffRate: 32, stuffPlus: 118 },
      { type: 'SI', name: 'Sinker', usage: 12, velo: 95.6, spin: 2100, ivb: 8.2, hb: -15.4, whiffRate: 14, stuffPlus: 110 },
    ],
    lastAppearance: '2026-02-12', pitchCount7Day: 105, pitchCount28Day: 410, acwr: 0.98, readiness: 'green',
  },
  {
    id: 'P004', firstName: 'Nolan', lastName: 'Bradshaw', role: 'SP', throws: 'R', age: 23,
    era: 4.15, whip: 1.28, kPer9: 8.4, bbPer9: 3.6, ip: 98.2, wins: 5, losses: 7, saves: 0,
    avgFB: 94.0, maxFB: 97.2, stuffPlus: 102, locationPlus: 92, pitchingPlus: 97,
    arsenal: [
      { type: 'SI', name: 'Sinker', usage: 40, velo: 94.0, spin: 2080, ivb: 7.6, hb: -16.8, whiffRate: 12, stuffPlus: 104 },
      { type: 'SL', name: 'Slider', usage: 30, velo: 85.8, spin: 2540, ivb: 0.4, hb: 4.2, whiffRate: 28, stuffPlus: 108 },
      { type: 'CH', name: 'Changeup', usage: 20, velo: 85.2, spin: 1700, ivb: 5.8, hb: -14.0, whiffRate: 24, stuffPlus: 96 },
      { type: 'FF', name: 'Four-Seam', usage: 10, velo: 94.8, spin: 2260, ivb: 14.8, hb: -7.2, whiffRate: 18, stuffPlus: 94 },
    ],
    lastAppearance: '2026-02-08', pitchCount7Day: 85, pitchCount28Day: 320, acwr: 1.22, readiness: 'yellow',
  },
  {
    id: 'P005', firstName: 'Rylan', lastName: 'Tanaka', role: 'SP', throws: 'L', age: 25,
    era: 3.65, whip: 1.18, kPer9: 9.0, bbPer9: 2.9, ip: 118.1, wins: 7, losses: 5, saves: 0,
    avgFB: 92.6, maxFB: 95.8, stuffPlus: 108, locationPlus: 110, pitchingPlus: 109,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 35, velo: 92.6, spin: 2300, ivb: 18.0, hb: 9.2, whiffRate: 20, stuffPlus: 106 },
      { type: 'CT', name: 'Cutter', usage: 25, velo: 88.4, spin: 2380, ivb: 6.2, hb: 0.8, whiffRate: 22, stuffPlus: 112 },
      { type: 'CB', name: 'Curveball', usage: 22, velo: 77.4, spin: 2900, ivb: -10.4, hb: -6.2, whiffRate: 34, stuffPlus: 118 },
      { type: 'CH', name: 'Changeup', usage: 18, velo: 83.8, spin: 1620, ivb: 4.2, hb: 14.8, whiffRate: 28, stuffPlus: 100 },
    ],
    lastAppearance: '2026-02-11', pitchCount7Day: 78, pitchCount28Day: 290, acwr: 0.88, readiness: 'green',
  },

  // ===== RELIEVERS (5) =====
  {
    id: 'P006', firstName: 'Terrence', lastName: 'Holt', role: 'RP', throws: 'R', age: 27,
    era: 2.45, whip: 0.98, kPer9: 12.4, bbPer9: 3.2, ip: 58.2, wins: 4, losses: 2, saves: 0,
    avgFB: 97.2, maxFB: 100.4, stuffPlus: 126, locationPlus: 104, pitchingPlus: 115,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 55, velo: 97.2, spin: 2480, ivb: 17.6, hb: -5.4, whiffRate: 30, stuffPlus: 130 },
      { type: 'SL', name: 'Slider', usage: 35, velo: 88.4, spin: 2620, ivb: -0.8, hb: 5.8, whiffRate: 38, stuffPlus: 128 },
      { type: 'CH', name: 'Changeup', usage: 10, velo: 88.8, spin: 1640, ivb: 5.6, hb: -15.2, whiffRate: 26, stuffPlus: 108 },
    ],
    lastAppearance: '2026-02-13', pitchCount7Day: 52, pitchCount28Day: 185, acwr: 1.15, readiness: 'yellow',
  },
  {
    id: 'P007', firstName: 'Levi', lastName: 'Strand', role: 'RP', throws: 'L', age: 29,
    era: 3.28, whip: 1.12, kPer9: 10.8, bbPer9: 2.6, ip: 52.1, wins: 3, losses: 1, saves: 2,
    avgFB: 92.8, maxFB: 95.2, stuffPlus: 112, locationPlus: 116, pitchingPlus: 114,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 40, velo: 92.8, spin: 2340, ivb: 18.2, hb: 8.0, whiffRate: 24, stuffPlus: 110 },
      { type: 'SL', name: 'Slider', usage: 32, velo: 83.6, spin: 2480, ivb: 0.6, hb: -3.2, whiffRate: 34, stuffPlus: 118 },
      { type: 'CB', name: 'Curveball', usage: 28, velo: 76.8, spin: 2840, ivb: -10.8, hb: -5.6, whiffRate: 30, stuffPlus: 114 },
    ],
    lastAppearance: '2026-02-12', pitchCount7Day: 38, pitchCount28Day: 140, acwr: 0.92, readiness: 'green',
  },
  {
    id: 'P008', firstName: 'Dante', lastName: 'Vasquez', role: 'RP', throws: 'R', age: 25,
    era: 3.92, whip: 1.22, kPer9: 9.2, bbPer9: 3.8, ip: 46.0, wins: 2, losses: 3, saves: 0,
    avgFB: 95.8, maxFB: 98.6, stuffPlus: 106, locationPlus: 88, pitchingPlus: 97,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 50, velo: 95.8, spin: 2400, ivb: 16.0, hb: -6.4, whiffRate: 26, stuffPlus: 112 },
      { type: 'SW', name: 'Sweeper', usage: 30, velo: 83.2, spin: 2720, ivb: -3.0, hb: 16.2, whiffRate: 32, stuffPlus: 120 },
      { type: 'CH', name: 'Changeup', usage: 20, velo: 87.4, spin: 1680, ivb: 5.0, hb: -13.8, whiffRate: 22, stuffPlus: 94 },
    ],
    lastAppearance: '2026-02-11', pitchCount7Day: 62, pitchCount28Day: 230, acwr: 1.35, readiness: 'red',
  },
  {
    id: 'P009', firstName: 'Silas', lastName: 'Park', role: 'RP', throws: 'R', age: 26,
    era: 2.88, whip: 1.05, kPer9: 11.6, bbPer9: 2.4, ip: 50.0, wins: 3, losses: 1, saves: 4,
    avgFB: 96.4, maxFB: 99.8, stuffPlus: 122, locationPlus: 114, pitchingPlus: 118,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 48, velo: 96.4, spin: 2460, ivb: 17.2, hb: -5.8, whiffRate: 28, stuffPlus: 124 },
      { type: 'CT', name: 'Cutter', usage: 28, velo: 90.2, spin: 2340, ivb: 5.8, hb: 1.2, whiffRate: 24, stuffPlus: 116 },
      { type: 'SL', name: 'Slider', usage: 24, velo: 87.0, spin: 2560, ivb: -0.4, hb: 4.6, whiffRate: 36, stuffPlus: 126 },
    ],
    lastAppearance: '2026-02-13', pitchCount7Day: 44, pitchCount28Day: 165, acwr: 1.02, readiness: 'green',
  },
  {
    id: 'P010', firstName: 'Rafael', lastName: 'Correa', role: 'RP', throws: 'L', age: 24,
    era: 3.55, whip: 1.18, kPer9: 10.0, bbPer9: 3.4, ip: 43.1, wins: 2, losses: 2, saves: 0,
    avgFB: 93.4, maxFB: 96.0, stuffPlus: 108, locationPlus: 98, pitchingPlus: 103,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 42, velo: 93.4, spin: 2280, ivb: 17.4, hb: 8.6, whiffRate: 22, stuffPlus: 106 },
      { type: 'CH', name: 'Changeup', usage: 30, velo: 84.2, spin: 1660, ivb: 4.8, hb: 16.0, whiffRate: 32, stuffPlus: 118 },
      { type: 'SL', name: 'Slider', usage: 28, velo: 82.8, spin: 2440, ivb: 0.2, hb: -3.8, whiffRate: 28, stuffPlus: 104 },
    ],
    lastAppearance: '2026-02-10', pitchCount7Day: 28, pitchCount28Day: 110, acwr: 0.78, readiness: 'green',
  },

  // ===== CLOSERS (2) =====
  {
    id: 'P011', firstName: 'DeShawn', lastName: 'Rivers', role: 'CL', throws: 'R', age: 28,
    era: 1.92, whip: 0.88, kPer9: 13.8, bbPer9: 2.8, ip: 42.0, wins: 2, losses: 1, saves: 28,
    avgFB: 98.6, maxFB: 101.8, stuffPlus: 132, locationPlus: 120, pitchingPlus: 126,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 52, velo: 98.6, spin: 2560, ivb: 18.8, hb: -4.6, whiffRate: 34, stuffPlus: 136 },
      { type: 'SL', name: 'Slider', usage: 38, velo: 89.4, spin: 2700, ivb: -1.6, hb: 6.4, whiffRate: 42, stuffPlus: 134 },
      { type: 'CB', name: 'Curveball', usage: 10, velo: 82.0, spin: 2880, ivb: -9.0, hb: 4.8, whiffRate: 30, stuffPlus: 118 },
    ],
    lastAppearance: '2026-02-13', pitchCount7Day: 48, pitchCount28Day: 170, acwr: 1.08, readiness: 'green',
  },
  {
    id: 'P012', firstName: 'Hiroshi', lastName: 'Takeda', role: 'CL', throws: 'R', age: 30,
    era: 2.35, whip: 0.95, kPer9: 12.2, bbPer9: 2.0, ip: 38.1, wins: 1, losses: 0, saves: 18,
    avgFB: 97.0, maxFB: 100.2, stuffPlus: 128, locationPlus: 122, pitchingPlus: 125,
    arsenal: [
      { type: 'FF', name: 'Four-Seam', usage: 44, velo: 97.0, spin: 2500, ivb: 17.8, hb: -5.0, whiffRate: 30, stuffPlus: 130 },
      { type: 'SW', name: 'Sweeper', usage: 32, velo: 84.6, spin: 2740, ivb: -2.8, hb: 15.4, whiffRate: 38, stuffPlus: 132 },
      { type: 'SI', name: 'Sinker', usage: 24, velo: 95.8, spin: 2120, ivb: 8.0, hb: -16.0, whiffRate: 16, stuffPlus: 112 },
    ],
    lastAppearance: '2026-02-12', pitchCount7Day: 36, pitchCount28Day: 148, acwr: 0.95, readiness: 'green',
  },
]

export function getPitcher(id: string): Pitcher | undefined {
  return pitchingStaff.find(p => p.id === id)
}

export function getStarters(): Pitcher[] {
  return pitchingStaff.filter(p => p.role === 'SP')
}

export function getRelievers(): Pitcher[] {
  return pitchingStaff.filter(p => p.role === 'RP')
}

export function getClosers(): Pitcher[] {
  return pitchingStaff.filter(p => p.role === 'CL')
}

export function getPitchingStaff(): Pitcher[] {
  return pitchingStaff
}
