import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AIPanel from '../components/AIPanel'
import { facilitySuggestions, getFacilityAIResponse } from '../data/mockAI'
import { useState } from 'react'

export default function FacilityLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showAI, setShowAI] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const activeTab = location.pathname.includes('/players')
    ? 'players'
    : location.pathname.includes('/groups')
    ? 'groups'
    : 'sessions'

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Sidebar facilityMode playerId="3000002" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Header */}
        <div style={{ padding: '24px 32px 0', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 30, letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--text-bright)' }}>USER MANAGEMENT</h1>
        </div>

        {/* Tabs */}
        <div style={{ padding: '14px 28px 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', border: '1px solid var(--orange-border)', borderRadius: 8, overflow: 'hidden', width: 520 }}>
            {(['sessions', 'players', 'groups'] as const).map(tab => (
              <button key={tab} style={{
                flex: 1, padding: '12px 0', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13,
                textTransform: 'uppercase', letterSpacing: '1.5px', border: 'none',
                borderRight: '1px solid var(--orange-border)', cursor: 'pointer',
                background: 'transparent',
                color: activeTab === tab ? 'var(--accent)' : 'var(--muted)',
                boxShadow: activeTab === tab ? 'inset 0 -2px 0 var(--accent)' : 'none',
                transition: 'all 0.15s',
              }} onClick={() => navigate(`/facility/${tab}`)}>{tab}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
          <Outlet />
        </div>

        {/* AI Toggle Button */}
        {!showAI && (
          <button style={{
            position: 'absolute', bottom: 20, right: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 10,
            padding: '12px 16px', cursor: 'pointer',
          }} onClick={() => setShowAI(true)}>
            <img src="/branding/icon.png" alt="" style={{ width: 34 }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text)', textAlign: 'center', lineHeight: 1.3 }}>TALK TO<br/>YOUR DATA</span>
          </button>
        )}
      </div>

      {showAI && (
        <div style={{ position: 'relative' }}>
          <button style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: 'var(--panel)', border: '1px solid var(--card-border)', color: 'var(--text)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }} onClick={() => setShowAI(false)}>&times;</button>
          <AIPanel suggestions={facilitySuggestions} onQuery={(q) => getFacilityAIResponse(q)} />
        </div>
      )}
    </div>
  )
}
