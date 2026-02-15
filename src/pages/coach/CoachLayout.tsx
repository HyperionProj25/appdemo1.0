import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { usePersona } from '../../context/PersonaContext'
import Logo from '../../components/Logo'
import AIPanel from '../../components/AIPanel'
import { coachSuggestions, getCoachAIResponse } from '../../data/personaAI'

export default function CoachLayout() {
  const { personaLabel, setPersona } = usePersona()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    setPersona(null)
    navigate('/')
  }

  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0, padding: sidebarOpen ? '12px 16px' : '12px 0',
    justifyContent: sidebarOpen ? 'flex-start' : 'center',
    background: isActive ? 'var(--orange-glow)' : 'transparent',
    borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
    color: isActive ? 'var(--accent)' : 'var(--text)',
    textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 13,
    fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' as const,
    transition: 'all 0.15s ease',
  })

  const labelStyle: React.CSSProperties = {
    opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0,
    overflow: 'hidden', whiteSpace: 'nowrap', transition: 'opacity 0.2s ease, width 0.2s ease',
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 200 : 56, background: 'var(--panel)', borderRight: '1px solid var(--orange-border)',
        display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Logo section */}
        <div style={{ padding: sidebarOpen ? '20px 16px' : '20px 0', borderBottom: '1px solid var(--orange-border)', display: 'flex', flexDirection: 'column', alignItems: sidebarOpen ? 'flex-start' : 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: sidebarOpen ? 8 : 0, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
            <Logo size={28} />
            <span style={{ ...labelStyle, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, letterSpacing: '3px', color: 'var(--accent)' }}>BASELINE</span>
          </div>
          {sidebarOpen && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase' }}>
              {personaLabel} View
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          <NavLink to="/coach/dashboard" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            <span style={labelStyle}>Dashboard</span>
          </NavLink>
          <NavLink to="/coach/roster" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span style={labelStyle}>Roster</span>
          </NavLink>
          <NavLink to="/coach/matchup" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span style={labelStyle}>Matchup Prep</span>
          </NavLink>
          <NavLink to="/coach/trends" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span style={labelStyle}>Trends</span>
          </NavLink>
          <NavLink to="/coach/development" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span style={labelStyle}>Development</span>
          </NavLink>
          <NavLink to="/coach/sessions" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span style={labelStyle}>Sessions</span>
          </NavLink>
        </nav>

        {/* Collapse toggle */}
        <button onClick={() => setSidebarOpen(o => !o)} style={{
          background: 'none', border: 'none', padding: '10px', cursor: 'pointer',
          color: 'var(--muted)', display: 'flex', justifyContent: 'center', transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sidebarOpen ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s ease' }}>
            <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
          </svg>
        </button>

        {/* Footer */}
        <div style={{ padding: sidebarOpen ? '16px' : '16px 8px', borderTop: '1px solid var(--orange-border)' }}>
          <button onClick={handleLogout} style={{
            width: '100%', padding: sidebarOpen ? '12px' : '8px', background: 'transparent',
            border: '1px solid var(--muted)', borderRadius: 6, color: 'var(--muted)',
            fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
            overflow: 'hidden', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--muted)' }}
          >
            {sidebarOpen ? 'Switch Role' : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        <Outlet />
      </main>

      {/* AI Panel */}
      <AIPanel
        suggestions={coachSuggestions}
        onQuery={getCoachAIResponse}
        inline={true}
      />
    </div>
  )
}
