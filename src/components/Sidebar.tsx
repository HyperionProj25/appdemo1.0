import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

interface SidebarProps {
  playerName?: string;
  playerId?: string;
  facilityMode?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

/** Inline SVG icons for nav items */
const NavIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'hitting':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="3" /><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" />
        </svg>
      )
    case 'pitching':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 'strength':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M6 5v14" /><path d="M18 5v14" /><path d="M6 12h12" /><path d="M3 8h3" /><path d="M3 16h3" /><path d="M18 8h3" /><path d="M18 16h3" />
        </svg>
      )
    case 'ecosystem':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    case 'facility':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    default:
      return null
  }
}

export default function Sidebar({ playerName, playerId, facilityMode, collapsed = false, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => {
    const path = location.pathname
    if (path.includes('/pitching')) return 'pitching'
    if (path.includes('/strength')) return 'strength'
    if (path.includes('/ecosystem')) return 'ecosystem'
    if (path.includes('/facility')) return 'facility'
    return 'hitting'
  }

  const active = getActiveKey()
  const id = playerId || '3000002'

  const handleNav = (key: string) => {
    if (facilityMode) {
      switch (key) {
        case 'hitting': navigate(`/player/${id}/dashboard`); break
        case 'pitching': navigate(`/player/${id}/pitching`); break
        case 'strength': navigate(`/player/${id}/strength`); break
        case 'ecosystem': navigate(`/player/${id}/ecosystem`); break
        case 'user-management': navigate('/facility/sessions'); break
      }
      return
    }
    switch (key) {
      case 'hitting': navigate(`/player/${id}/dashboard`); break
      case 'pitching': navigate(`/player/${id}/pitching`); break
      case 'strength': navigate(`/player/${id}/strength`); break
      case 'ecosystem': navigate(`/player/${id}/ecosystem`); break
    }
  }

  const labelStyle: React.CSSProperties = {
    opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto',
    overflow: 'hidden', whiteSpace: 'nowrap', transition: 'opacity 0.2s ease, width 0.2s ease',
  }

  return (
    <div style={{
      width: collapsed ? 56 : 190, minWidth: collapsed ? 56 : 190, background: 'var(--bg)', borderRight: '1px solid var(--panel-border)',
      display: 'flex', flexDirection: 'column', padding: '16px 0', height: '100%', overflow: 'hidden', flexShrink: 0,
      transition: 'width 0.3s ease, min-width 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12, padding: collapsed ? '0 0 18px' : '0 18px 18px', borderBottom: '1px solid var(--panel-border)', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <Logo size={collapsed ? 32 : 44} />
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, color: 'var(--text)',
              letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{facilityMode ? 'KPI - MH' : (playerName || 'Player')}</div>
            <button style={{
              fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase',
              letterSpacing: '1px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '4px 0 0',
            }} onClick={() => navigate('/')}>LOG OUT</button>
          </div>
        )}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', padding: '16px 0', gap: 4, flex: 1 }}>
        {[
          { label: 'Hitting', key: 'hitting' },
          { label: 'Pitching', key: 'pitching' },
          { label: 'Strength', key: 'strength' },
        ].map(item => (
          <button key={item.key} style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase',
            letterSpacing: '1.2px', background: 'none', border: 'none',
            borderLeft: `3px solid ${active === item.key ? 'var(--accent)' : 'transparent'}`,
            padding: collapsed ? '12px 0' : '12px 20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
            color: active === item.key ? 'var(--accent)' : 'var(--muted)',
            display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }} onClick={() => handleNav(item.key)} onMouseEnter={e => { if (active !== item.key) e.currentTarget.style.background = 'rgba(224,172,68,0.06)' }} onMouseLeave={e => { e.currentTarget.style.background = 'none' }}>
            <NavIcon type={item.key} />
            <span style={labelStyle}>{item.label}</span>
          </button>
        ))}

        {facilityMode && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: collapsed ? '16px 0 6px' : '16px 20px 6px', borderLeft: '3px solid var(--accent)', justifyContent: collapsed ? 'center' : 'flex-start' }}>
              {!collapsed && (
                <>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--accent)' }}>FACILITY PANEL</span>
                  <span style={{ fontSize: 9, color: 'var(--accent)' }}>&#9650;</span>
                </>
              )}
              {collapsed && <NavIcon type="facility" />}
            </div>
            {!collapsed && (
              <>
                <button style={{
                  fontFamily: 'var(--font-body)', fontSize: 12,
                  color: active === 'facility' ? 'var(--accent)' : 'var(--accent-light)',
                  background: 'none', border: 'none', padding: '7px 20px 7px 26px', textAlign: 'left', cursor: 'pointer',
                }} onClick={() => handleNav('user-management')}>&bull; User Management</button>
                <button style={{
                  fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--accent-light)',
                  background: 'none', border: 'none', padding: '7px 20px 7px 26px', textAlign: 'left', cursor: 'pointer',
                }}>&bull; Leaderboards</button>
              </>
            )}
          </>
        )}

        <button style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase',
          letterSpacing: '1.2px', background: 'none', border: 'none',
          borderLeft: `3px solid ${active === 'ecosystem' ? 'var(--accent)' : 'transparent'}`,
          padding: collapsed ? '12px 0' : '12px 20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
          color: active === 'ecosystem' ? 'var(--accent)' : 'var(--muted)',
          display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }} onClick={() => handleNav('ecosystem')} onMouseEnter={e => { if (active !== 'ecosystem') e.currentTarget.style.background = 'rgba(224,172,68,0.06)' }} onMouseLeave={e => { e.currentTarget.style.background = 'none' }}>
          <NavIcon type="ecosystem" />
          <span style={labelStyle}>Ecosystem</span>
        </button>
      </nav>

      {/* Collapse toggle */}
      {onToggle && (
        <button onClick={onToggle} style={{
          background: 'none', border: 'none', padding: '10px', cursor: 'pointer',
          color: 'var(--muted)', display: 'flex', justifyContent: 'center', transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
            <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
