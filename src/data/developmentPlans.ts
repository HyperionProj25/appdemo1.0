export interface DevelopmentGoal {
  id: string
  title: string
  metric: string
  current: number
  target: number
  unit: string
  status: 'on-track' | 'needs-attention' | 'ahead'
}

export interface FocusArea {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export interface Milestone {
  id: string
  title: string
  date: string
  achieved: boolean
}

export interface DrillRecommendation {
  id: string
  name: string
  description: string
  frequency: string
  linkedGoal: string
}

export interface CoachingNote {
  id: string
  date: string
  author: string
  text: string
}

export interface DevelopmentPlan {
  goals: DevelopmentGoal[]
  focusAreas: FocusArea[]
  milestones: Milestone[]
  drills: DrillRecommendation[]
  notes: CoachingNote[]
}

// Generate a deterministic plan based on player metrics
export function generatePlan(playerId: string, avgEV: number, maxEV: number, avgBS: number, swings: number): DevelopmentPlan {
  const needsPower = maxEV < 100
  const needsBatSpeed = avgBS < 54
  const needsConsistency = swings < 45

  const goals: DevelopmentGoal[] = []
  let gid = 1

  if (needsPower) {
    goals.push({
      id: `g${gid++}`, title: 'Increase Max Exit Velocity', metric: 'Max EV',
      current: maxEV, target: maxEV + 5, unit: 'mph',
      status: maxEV >= (maxEV + 5) * 0.8 ? 'on-track' : 'needs-attention',
    })
  }
  if (needsBatSpeed) {
    goals.push({
      id: `g${gid++}`, title: 'Improve Bat Speed', metric: 'Bat Speed',
      current: avgBS, target: avgBS + 4, unit: 'mph',
      status: avgBS >= 52 ? 'on-track' : 'needs-attention',
    })
  }
  goals.push({
    id: `g${gid++}`, title: 'Raise Average Exit Velocity', metric: 'Avg EV',
    current: avgEV, target: Math.round(avgEV * 1.05), unit: 'mph',
    status: avgEV >= 85 ? 'ahead' : 'on-track',
  })
  if (needsConsistency) {
    goals.push({
      id: `g${gid++}`, title: 'Increase Quality Swing Count', metric: 'Swings',
      current: swings, target: swings + 10, unit: 'swings/session',
      status: 'on-track',
    })
  }

  const focusAreas: FocusArea[] = [
    { id: 'f1', title: 'Barrel Control', description: 'Maintain consistent barrel path through the hitting zone. Focus on staying inside the ball.', priority: needsPower ? 'high' : 'medium' },
    { id: 'f2', title: 'Timing & Rhythm', description: 'Develop consistent load timing to improve weight transfer and swing efficiency.', priority: needsBatSpeed ? 'high' : 'low' },
    { id: 'f3', title: 'Plate Discipline', description: 'Improve pitch selection and reduce chase rate on breaking balls outside the zone.', priority: needsConsistency ? 'high' : 'medium' },
  ]

  const milestones: Milestone[] = [
    { id: 'm1', title: 'Complete swing assessment', date: '2026-01-10', achieved: true },
    { id: 'm2', title: 'Establish baseline metrics', date: '2026-01-15', achieved: true },
    { id: 'm3', title: 'First progress check', date: '2026-02-01', achieved: true },
    { id: 'm4', title: 'Mid-program evaluation', date: '2026-02-15', achieved: false },
    { id: 'm5', title: 'Target metric review', date: '2026-03-01', achieved: false },
    { id: 'm6', title: 'Program completion', date: '2026-03-15', achieved: false },
  ]

  const drills: DrillRecommendation[] = [
    { id: 'd1', name: 'Tee Work — Inside/Outside', description: 'Alternate inside and outside tee placement. Focus on barrel accuracy and launch angle consistency.', frequency: '3x per week, 25 swings each', linkedGoal: goals[0]?.id || 'g1' },
    { id: 'd2', name: 'Overload/Underload Training', description: 'Use weighted bat progression (26oz → 30oz → 33oz) to build bat speed through contrast training.', frequency: '2x per week, 15 min sessions', linkedGoal: needsBatSpeed ? 'g2' : 'g1' },
    { id: 'd3', name: 'Front Toss Recognition', description: 'Identify pitch type and location before swinging. Builds pitch selection and timing.', frequency: '2x per week, 20 reps', linkedGoal: goals[goals.length - 1]?.id || 'g3' },
    { id: 'd4', name: 'Live BP — Situational', description: 'Simulate game at-bats with specific count scenarios. Focus on approach adjustments.', frequency: '1x per week, full session', linkedGoal: 'g1' },
  ]

  const notes: CoachingNote[] = [
    { id: 'n1', date: '2026-02-10', author: 'Coach Reynolds', text: 'Good session today. Bat path is more direct to the ball. Need to maintain posture through the swing — collapsing on the backside still shows up under fatigue.' },
    { id: 'n2', date: '2026-02-05', author: 'Coach Reynolds', text: 'Introduced overload training. Player responded well. Bat speed showed +1 mph increase during session. Will monitor fatigue.' },
    { id: 'n3', date: '2026-01-28', author: 'Coach Whitmore', text: 'Initial assessment complete. Strong raw power but inconsistent barrel contact. Timing mechanism needs refinement — load is late on velocity.' },
  ]

  return { goals, focusAreas, milestones, drills, notes }
}
