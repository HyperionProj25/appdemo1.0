import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

interface SidebarProps {
  playerName?: string;
  playerId?: string;
  facilityMode?: boolean;
}

export default function Sidebar({ playerName, playerId, facilityMode }: SidebarProps) {
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

  return (
    <div style={{
      width: 190, minWidth: 190, background: 'var(--bg)', borderRight: '1px solid var(--panel-border)',
      display: 'flex', flexDirection: 'column', padding: '16px 0', height: '100%', overflow: 'auto', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 16px', borderBottom: '1px solid var(--panel-border)' }}>
        <Logo size={44} />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, color: 'var(--text)',
            letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{facilityMode ? 'KPI - MH' : (playerName || 'Player')}</div>
          <button style={{
            fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase',
            letterSpacing: '1px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '3px 0 0',
          }} onClick={() => navigate('/')}>LOG OUT</button>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', padding: '16px 0', gap: 2 }}>
        {[
          { label: 'Hitting', key: 'hitting' },
          { label: 'Pitching', key: 'pitching' },
          { label: 'Strength', key: 'strength' },
        ].map(item => (
          <button key={item.key} style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase',
            letterSpacing: '1.5px', background: 'none', border: 'none',
            borderLeft: `3px solid ${active === item.key ? 'var(--accent)' : 'transparent'}`,
            padding: '11px 18px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
            color: active === item.key ? 'var(--accent)' : 'var(--muted)',
          }} onClick={() => handleNav(item.key)}>{item.label}</button>
        ))}

        {facilityMode && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 18px 4px', borderLeft: '3px solid var(--accent)' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent)' }}>FACILITY PANEL</span>
              <span style={{ fontSize: 8, color: 'var(--accent)' }}>&#9650;</span>
            </div>
            <button style={{
              fontFamily: 'var(--font-body)', fontSize: 11,
              color: active === 'facility' ? 'var(--accent)' : 'var(--accent-light)',
              background: 'none', border: 'none', padding: '5px 18px 5px 24px', textAlign: 'left', cursor: 'pointer',
            }} onClick={() => handleNav('user-management')}>&bull; User Management</button>
            <button style={{
              fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--accent-light)',
              background: 'none', border: 'none', padding: '5px 18px 5px 24px', textAlign: 'left', cursor: 'pointer',
            }}>&bull; Leaderboards</button>
          </>
        )}

        <button style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase',
          letterSpacing: '1.5px', background: 'none', border: 'none',
          borderLeft: `3px solid ${active === 'ecosystem' ? 'var(--accent)' : 'transparent'}`,
          padding: '11px 18px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
          color: active === 'ecosystem' ? 'var(--accent)' : 'var(--muted)',
        }} onClick={() => handleNav('ecosystem')}>Ecosystem</button>
      </nav>
    </div>
  )
}
