import { useNavigate, Link } from 'react-router-dom'
import { usePersona, Persona } from '../context/PersonaContext'

const personas: Array<{ id: Persona; title: string; subtitle: string; description: string; icon: JSX.Element }> = [
  {
    id: 'scout',
    title: 'Scout',
    subtitle: 'Territory Coverage',
    description: 'Track prospects across your territory. See development arcs, mechanical shifts, and everything that happens between visits.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    id: 'coach',
    title: 'Hitting Coach',
    subtitle: 'Team Management',
    description: 'Manage your roster, prep for matchups, and track trend data across your entire hitting group.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'pitching_coach',
    title: 'Pitching Coach',
    subtitle: 'Pitcher Development',
    description: 'Develop arms, manage bullpen workloads, design pitches, and prepare game plans with data-driven insights.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="6" r="3" />
        <path d="M8 9c-3 0-5 2-5 4v2" />
        <path d="M11 8l4-4" />
        <path d="M15 4l2.5-.5L18 6l-3 3" />
        <path d="M18 6c1-1 2.5-.5 3 0s1 2 0 3" />
        <path d="M12 17a5 5 0 0 1 10 0" />
        <circle cx="17" cy="13" r="2" />
      </svg>
    ),
  },
  {
    id: 'agent',
    title: 'Agent',
    subtitle: 'Client Representation',
    description: 'Build verified development resumes with fact-supported evidence for arbitration and contract negotiations.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'player',
    title: 'Player',
    subtitle: 'Personal Analytics',
    description: 'Track your development across hitting, pitching, and strength. See how you stack up and where to focus next.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
        <path d="M17 10l2 2 4-4" />
      </svg>
    ),
  },
]

export default function LoginScreen() {
  const navigate = useNavigate()
  const { setPersona } = usePersona()

  const handlePersonaSelect = (persona: Persona) => {
    setPersona(persona)
    const route = persona === 'player' ? '/player/3000002/dashboard'
      : persona === 'pitching_coach' ? '/pitching-coach/dashboard'
      : `/${persona}/dashboard`
    navigate(route)
  }

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0a', position: 'relative', overflow: 'hidden',
    }}>
      {/* Home button */}
      <Link to="/site" style={{
        position: 'absolute', top: 24, left: 28, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '1px',
        color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Website
      </Link>

      {/* Background streaks */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          linear-gradient(135deg, transparent 30%, rgba(30,30,30,0.4) 30%, rgba(30,30,30,0.4) 31%, transparent 31%),
          linear-gradient(135deg, transparent 50%, rgba(25,25,25,0.5) 50%, rgba(25,25,25,0.5) 52%, transparent 52%),
          linear-gradient(135deg, transparent 65%, rgba(35,35,35,0.3) 65%, rgba(35,35,35,0.3) 67%, transparent 67%),
          linear-gradient(135deg, transparent 78%, rgba(30,30,30,0.4) 78%, rgba(30,30,30,0.4) 80%, transparent 80%)
        `,
      }} />

      <div className="anim-fade-in" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 1280, width: '100%', padding: '48px 24px 36px' }}>
        {/* Logo */}
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 28, letterSpacing: '8px', color: 'var(--accent-bright)', marginBottom: 4 }}>BASELINE</div>
        <img src="/branding/icon.png" alt="Baseline" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, letterSpacing: '2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 36 }}>
          Professional Demo
        </div>

        {/* Persona Selection */}
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, letterSpacing: '1.5px', color: 'var(--text)', textTransform: 'uppercase', marginBottom: 24 }}>
          Select Your Role
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, width: '100%', marginBottom: 36 }}>
          {personas.map((persona, i) => (
            <button
              className={`anim-scale-in anim-delay-${i + 2}`}
              key={persona.id}
              onClick={() => handlePersonaSelect(persona.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '28px 20px',
                background: 'var(--panel)',
                border: '1px solid var(--orange-border)',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(224,172,68,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--orange-border)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ color: 'var(--accent)', marginBottom: 16 }}>
                {persona.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 6 }}>
                {persona.title}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 14 }}>
                {persona.subtitle}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
                {persona.description}
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--orange-border)' }} />
          <span style={{ padding: '0 18px', fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Or explore facility demo
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--orange-border)' }} />
        </div>

        {/* Legacy demo button */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button onClick={() => navigate('/facility/sessions')} style={{
            padding: '13px 36px', background: 'transparent', border: '1px solid var(--muted)', borderRadius: 6,
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: 'var(--muted)', cursor: 'pointer', transition: 'all 0.2s',
          }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--muted)' }}>Facility Demo</button>
        </div>
      </div>
    </div>
  )
}
