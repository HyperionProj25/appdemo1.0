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
]

export default function LoginScreen() {
  const navigate = useNavigate()
  const { setPersona } = usePersona()

  const handlePersonaSelect = (persona: Persona) => {
    setPersona(persona)
    navigate(`/${persona}/dashboard`)
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

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 900, padding: '48px 40px 36px' }}>
        {/* Logo */}
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 28, letterSpacing: '8px', color: 'var(--accent-bright)', marginBottom: 4 }}>BASELINE</div>
        <img src="/branding/icon.png" alt="Baseline" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 32 }}>
          Professional Demo
        </div>

        {/* Persona Selection */}
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, letterSpacing: '2px', color: 'var(--text)', textTransform: 'uppercase', marginBottom: 20 }}>
          Select Your Role
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, width: '100%', marginBottom: 32 }}>
          {personas.map(persona => (
            <button
              key={persona.id}
              onClick={() => handlePersonaSelect(persona.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '28px 24px',
                background: 'var(--panel)',
                border: '1px solid var(--orange-border)',
                borderRadius: 8,
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
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4 }}>
                {persona.title}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>
                {persona.subtitle}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                {persona.description}
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--orange-border)' }} />
          <span style={{ padding: '0 16px', fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Or explore legacy demos
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--orange-border)' }} />
        </div>

        {/* Legacy demo buttons */}
        <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 400 }}>
          <button onClick={() => navigate('/facility/sessions')} style={{
            flex: 1, padding: '12px 24px', background: 'transparent', border: '1px solid var(--muted)', borderRadius: 4,
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '2px',
            textTransform: 'uppercase', color: 'var(--muted)', cursor: 'pointer', transition: 'all 0.2s',
          }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--muted)' }}>Facility Demo</button>
          <button onClick={() => navigate('/player/3000002/dashboard')} style={{
            flex: 1, padding: '12px 24px', background: 'transparent', border: '1px solid var(--muted)', borderRadius: 4,
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '2px',
            textTransform: 'uppercase', color: 'var(--muted)', cursor: 'pointer', transition: 'all 0.2s',
          }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--muted)' }}>Player Demo</button>
        </div>
      </div>
    </div>
  )
}
