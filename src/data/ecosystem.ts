export interface EcoEvent {
  name: string;
  location: string;
  date: string;
  ageRange: string;
  description: string;
  technologies: string[];
}

export interface EcoLocation {
  name: string;
  city: string;
  technologies: string[];
}

export interface EcoCoach {
  name: string;
  city: string;
  description: string;
  technologies: string[];
}

export const events: EcoEvent[] = [
  {
    name: 'NORCAL SUMMER SHOWCASE',
    location: 'Moraga, CA',
    date: 'JUNE 18',
    ageRange: '15u - 18u',
    description: 'Premier Event for high school athletes to showcase their skills in front of college recruiters',
    technologies: ['Trackman', 'Blast Motion'],
  },
  {
    name: 'NCTB SUMMER KICK OFF',
    location: 'San Jose, CA',
    date: 'JUNE 9',
    ageRange: '14u - 18u',
    description: 'Summer kickoff tournament by NCTB. 2 complexes and 11 fields',
    technologies: ['Trackman'],
  },
];

export const locations: EcoLocation[] = [
  { name: 'KINETIC PERFORMANCE INSTITUTE', city: 'Morgan Hill, CA', technologies: ['Hawkins', 'HitTrax', 'Trackman', 'Blast Motion'] },
  { name: 'DIAMOND TRAINING & DEVELOPMENT', city: 'Sunnyvale, CA', technologies: ['Trackman', 'HitTrax'] },
  { name: 'PARADIGM SPORT', city: 'Santa Cruz, CA', technologies: ['Hawkins', 'HitTrax', 'Blast Motion'] },
  { name: "ROSSY'S TRAINING", city: 'Scotts Valley, CA', technologies: ['Trackman', 'Blast Motion'] },
];

export const coaches: EcoCoach[] = [
  { name: 'MATT HARGROVE', city: 'Lake Zurich, IL', description: 'Former Professional LHP\nDirector of Pitching Development', technologies: ['Trackman', 'Hawkins'] },
  { name: 'STEVE CALDWELL', city: 'Saratoga, CA', description: 'Former Professional Veteran\nHead Coach\nDirector of Hitting Development', technologies: ['Blast Motion', 'HitTrax'] },
  { name: 'CHRIS WELDON', city: 'Campbell, CA', description: 'Director of Pitching Development\nPitching Coach', technologies: ['Trackman'] },
  { name: 'ALEX RAMSTEAD', city: 'Morgan Hill, CA', description: 'Director of Pitching at\nKinetic Performance Institute', technologies: ['Trackman', 'Hawkins'] },
];
