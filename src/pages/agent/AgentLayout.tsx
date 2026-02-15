import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { usePersona } from '../../context/PersonaContext'
import Logo from '../../components/Logo'
import AIPanel from '../../components/AIPanel'
import { agentSuggestions, getAgentAIResponse } from '../../data/personaAI'

export default function AgentLayout() {
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
          <NavLink to="/agent/dashboard" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            <span style={labelStyle}>Dashboard</span>
          </NavLink>
          <NavLink to="/agent/clients" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span style={labelStyle}>Clients</span>
          </NavLink>
          <NavLink to="/agent/contracts" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span style={labelStyle}>Contracts</span>
          </NavLink>
          <NavLink to="/agent/reports" style={({ isActive }) => linkStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span style={labelStyle}>Export Reports</span>
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
        suggestions={agentSuggestions}
        onQuery={getAgentAIResponse}
        inline={true}
      />
    </div>
  )
}
