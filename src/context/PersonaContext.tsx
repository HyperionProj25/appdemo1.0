import { createContext, useContext, useState, ReactNode } from 'react'

export type Persona = 'scout' | 'coach' | 'pitching_coach' | 'agent' | 'player' | null

interface PersonaContextType {
  persona: Persona
  setPersona: (p: Persona) => void
  personaLabel: string
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined)

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>(() => {
    const saved = localStorage.getItem('baseline-persona')
    return (saved as Persona) || null
  })

  const handleSetPersona = (p: Persona) => {
    setPersona(p)
    if (p) {
      localStorage.setItem('baseline-persona', p)
    } else {
      localStorage.removeItem('baseline-persona')
    }
  }

  const personaLabel = persona === 'scout' ? 'Scout'
    : persona === 'coach' ? 'Hitting Coach'
    : persona === 'pitching_coach' ? 'Pitching Coach'
    : persona === 'agent' ? 'Agent'
    : persona === 'player' ? 'Player'
    : ''

  return (
    <PersonaContext.Provider value={{ persona, setPersona: handleSetPersona, personaLabel }}>
      {children}
    </PersonaContext.Provider>
  )
}

export function usePersona() {
  const ctx = useContext(PersonaContext)
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider')
  return ctx
}
