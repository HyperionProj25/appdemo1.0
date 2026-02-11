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
  { name: 'DJ SNELTEN', city: 'Lake Zurich, IL', description: 'Former MLB LHP\nDirector of Pitching at GUD Baseball', technologies: ['Trackman', 'Hawkins'] },
  { name: 'BOBBY HILL', city: 'Saratoga, CA', description: '9 Year former MLB Veteran\nHead Coach At West Valley College\nHead Coach at USA Baseball', technologies: ['Blast Motion', 'HitTrax'] },
  { name: 'Nick Sanzeri', city: 'Campbell, CA', description: 'Director of Pitching at the Yard\nPitching Coach at Ohlone College', technologies: ['Trackman'] },
  { name: 'CAMERON CRONE', city: 'Morgan Hill, CA', description: 'Director of Pitching at the\nKinetic Performance Institute', technologies: ['Trackman', 'Hawkins'] },
];
