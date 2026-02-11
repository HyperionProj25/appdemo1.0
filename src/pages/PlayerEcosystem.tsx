import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getPlayer, getPlayerName } from '../data/players'
import { events, locations, coaches } from '../data/ecosystem'

const techFilters = ['Trackman', 'HitTrax', 'Blast', 'Hawkins'] as const
type TechFilter = typeof techFilters[number]

const techIcons: Record<TechFilter, string> = {
  Trackman: 'M14 4C8.5 4 4 8.5 4 14s4.5 10 10 10 10-4.5 10-10S19.5 4 14 4zm0 2c2.2 0 4.2.9 5.6 2.4L14 14V6zm-7.6 5.6L12 14H6c0-2.2.9-4.2 2.4-5.6zM14 22c-2.2 0-4.2-.9-5.6-2.4L14 14v8zm1.6-.4L14 14h8c0 2.2-.9 4.2-2.4 5.6z',
  HitTrax: 'M14 4l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z',
  Blast: 'M4 14h6l2-6 2 6h6l2-4h4M14 24V14',
  Hawkins: 'M14 4c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S19.5 4 14 4zm0 4a6 6 0 110 12 6 6 0 010-12zm0 3a3 3 0 100 6 3 3 0 000-6z',
}

export default function PlayerEcosystem() {
  const { playerId } = useParams()
  const player = getPlayer(playerId || '3000002')
  const [activeTab, setActiveTab] = useState<'events' | 'locations' | 'coaches'>('events')
  const [selectedTech, setSelectedTech] = useState<Set<TechFilter>>(new Set())

  if (!player) return <div>Player not found</div>
  const name = getPlayerName(player)

  const toggleTech = (t: TechFilter) => {
    setSelectedTech(prev => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

  const matchesTech = (techs: string[]) => {
    if (selectedTech.size === 0) return true
    return techs.some(t => {
      for (const sel of selectedTech) {
        if (t.toLowerCase().includes(sel.toLowerCase()) || sel.toLowerCase().includes(t.toLowerCase().replace(' motion', ''))) return true
      }
      return false
    })
  }

  const filteredEvents = events.filter(e => matchesTech(e.technologies))
  const filteredLocations = locations.filter(l => matchesTech(l.technologies))
  const filteredCoaches = coaches.filter(c => matchesTech(c.technologies))

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Sidebar playerName={name} playerId={playerId} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', padding: '20px 28px' }}>
        {/* Header */}
        <div className="anim-fade-in" style={{ textAlign: 'center', marginBottom: 16 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, letterSpacing: '5px', textTransform: 'uppercase' }}>BASELINE'S ECOSYSTEM</h1>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, fontStyle: 'italic' }}>Find events, locations and coaches within the Baseline network</p>
        </div>

        {/* Tabs */}
        <div className="anim-fade-in anim-delay-1" style={{ display: 'flex', border: '1px solid var(--orange-border)', borderRadius: 6, overflow: 'hidden', marginBottom: 20 }}>
          {(['events', 'locations', 'coaches'] as const).map(tab => (
            <button key={tab} style={{
              flex: 1, padding: '11px 0', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
              textTransform: 'uppercase', letterSpacing: '2px', border: 'none',
              borderRight: '1px solid var(--orange-border)', cursor: 'pointer',
              background: 'transparent',
              color: activeTab === tab ? 'var(--accent)' : 'var(--muted)',
              boxShadow: activeTab === tab ? 'inset 0 -2px 0 var(--accent)' : 'none',
              transition: 'all 0.15s',
            }} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        {/* Tech filter cards — selectable */}
        <div className="anim-fade-in anim-delay-2" style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {techFilters.map((t) => {
            const isActive = selectedTech.has(t)
            return (
              <button
                key={t}
                onClick={() => toggleTech(t)}
                style={{
                  background: isActive ? 'rgba(224,172,68,0.12)' : 'var(--card-bg)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--card-border)'}`,
                  borderRadius: 6,
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  minWidth: 100,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 12px rgba(224,172,68,0.15)' : 'none',
                }}
              >
                <div style={{ opacity: isActive ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d={techIcons[t]} fill={isActive ? 'var(--accent)' : 'var(--muted)'} style={{ transition: 'fill 0.2s' }} />
                  </svg>
                </div>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--accent)' : 'var(--text)',
                  transition: 'color 0.2s',
                }}>{t.toUpperCase()} <span style={{ fontSize: 8 }}>TM</span></span>
              </button>
            )
          })}
          {selectedTech.size > 0 && (
            <button
              onClick={() => setSelectedTech(new Set())}
              style={{
                padding: '8px 14px',
                background: 'none',
                border: '1px solid var(--card-border)',
                borderRadius: 6,
                color: 'var(--muted)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                alignSelf: 'center',
              }}
            >CLEAR</button>
          )}
        </div>

        {/* Content */}
        <div className="tab-content-enter">
          {activeTab === 'events' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: 'var(--accent)', letterSpacing: '2px', marginBottom: 12 }}>JUNE 2026</h2>
              {filteredEvents.length === 0 && (
                <div style={{ color: 'var(--muted)', fontSize: 12, fontStyle: 'italic', padding: 20, textAlign: 'center' }}>No events match the selected technology filters.</div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {filteredEvents.map((evt, i) => (
                  <div key={i} className="anim-slide-up" style={{ background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '18px', width: 380, boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', animationDelay: `${i * 0.08}s` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>{evt.name}</h3>
                        <div style={{ color: 'var(--accent)', fontSize: 11, fontStyle: 'italic' }}>{evt.location}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>{evt.date}</div>
                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{evt.ageRange}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4, marginBottom: 8 }}>{evt.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {evt.technologies.map((t, j) => {
                        const isHighlight = selectedTech.size > 0 && [...selectedTech].some(s => t.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(t.toLowerCase().replace(' motion', '')))
                        return (
                          <span key={j} style={{
                            ...pillStyle,
                            background: isHighlight ? 'var(--accent)' : '#555',
                            color: isHighlight ? '#000' : 'var(--text)',
                          }}>{t.toUpperCase()}</span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'locations' && (
            <div>
              {filteredLocations.length === 0 && (
                <div style={{ color: 'var(--muted)', fontSize: 12, fontStyle: 'italic', padding: 20, textAlign: 'center' }}>No locations match the selected technology filters.</div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {filteredLocations.map((loc, i) => (
                  <div key={i} className="anim-slide-up" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '18px', width: 260, animationDelay: `${i * 0.08}s` }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{loc.name}</h3>
                    <div style={{ color: 'var(--accent)', fontSize: 11, fontStyle: 'italic', marginBottom: 8 }}>{loc.city}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {loc.technologies.map((t, j) => {
                        const isHighlight = selectedTech.size > 0 && [...selectedTech].some(s => t.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(t.toLowerCase().replace(' motion', '')))
                        return (
                          <span key={j} style={{
                            ...pillStyle,
                            background: isHighlight ? 'var(--accent)' : '#555',
                            color: isHighlight ? '#000' : 'var(--text)',
                          }}>{t.toUpperCase()}</span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'coaches' && (
            <div>
              {filteredCoaches.length === 0 && (
                <div style={{ color: 'var(--muted)', fontSize: 12, fontStyle: 'italic', padding: 20, textAlign: 'center' }}>No coaches match the selected technology filters.</div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {filteredCoaches.map((c, i) => (
                  <div key={i} className="anim-slide-up" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '18px', width: 260, textAlign: 'center', animationDelay: `${i * 0.08}s` }}>
                    <div style={{ marginBottom: 8 }}>
                      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                        <circle cx="22" cy="12" r="6" fill="var(--muted)" opacity="0.5" />
                        <path d="M12 42c0-6 4-12 10-12s10 6 10 12" fill="var(--muted)" opacity="0.5" />
                        <path d="M30 18l6-8" stroke="var(--muted)" strokeWidth="1.5" opacity="0.5" />
                      </svg>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>{c.name}</h3>
                    <div style={{ color: 'var(--accent)', fontSize: 11, fontStyle: 'italic', marginBottom: 6 }}>{c.city}</div>
                    <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4, marginBottom: 8, whiteSpace: 'pre-line' }}>{c.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                      {c.technologies.map((t, j) => {
                        const isHighlight = selectedTech.size > 0 && [...selectedTech].some(s => t.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(t.toLowerCase().replace(' motion', '')))
                        return (
                          <span key={j} style={{
                            ...pillStyle,
                            background: isHighlight ? 'var(--accent)' : '#555',
                            color: isHighlight ? '#000' : 'var(--text)',
                          }}>{t.toUpperCase()}</span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const pillStyle: React.CSSProperties = { display: 'inline-block', padding: '4px 12px', borderRadius: 10, fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', background: '#555', color: 'var(--text)', transition: 'all 0.2s' }
