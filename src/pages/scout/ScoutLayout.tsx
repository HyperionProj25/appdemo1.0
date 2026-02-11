import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { usePersona } from '../../context/PersonaContext'
import Logo from '../../components/Logo'
import AIPanel from '../../components/AIPanel'
import { scoutSuggestions, getScoutAIResponse } from '../../data/personaAI'

export default function ScoutLayout() {
  const { personaLabel, setPersona } = usePersona()
  const navigate = useNavigate()

  const handleLogout = () => {
    setPersona(null)
    navigate('/')
  }

  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
    background: isActive ? 'var(--orange-glow)' : 'transparent',
    borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
    color: isActive ? 'var(--accent)' : 'var(--text)',
    textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 12,
    fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' as const,
    transition: 'all 0.15s ease',
  })

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 200, background: 'var(--panel)', borderRight: '1px solid var(--orange-border)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo section */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--orange-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Logo size={28} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, letterSpacing: '3px', color: 'var(--accent)' }}>BASELINE</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>
            {personaLabel} View
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          <NavLink to="/scout/dashboard" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </NavLink>
          <NavLink to="/scout/watchlist" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Watchlist
          </NavLink>
          <NavLink to="/scout/territory" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Territory
          </NavLink>
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--orange-border)' }}>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', background: 'transparent',
            border: '1px solid var(--muted)', borderRadius: 4, color: 'var(--muted)',
            fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '1.5px',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--muted)' }}
          >
            Switch Role
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        <Outlet />
      </main>

      {/* AI Panel */}
      <AIPanel
        suggestions={scoutSuggestions}
        onQuery={getScoutAIResponse}
        inline={true}
      />
    </div>
  )
}
