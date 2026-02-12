import { Routes, Route, Navigate } from 'react-router-dom'
import LoginScreen from './pages/LoginScreen'
import FacilityLayout from './pages/FacilityLayout'
import SessionsTab from './pages/SessionsTab'
import PlayersTab from './pages/PlayersTab'
import GroupsTab from './pages/GroupsTab'
import PlayerDashboard from './pages/PlayerDashboard'
import PlayerMetrics from './pages/PlayerMetrics'
import PlayerPitching from './pages/PlayerPitching'
import PlayerPitchingMetrics from './pages/PlayerPitchingMetrics'
import PlayerStrength from './pages/PlayerStrength'
import PlayerEcosystem from './pages/PlayerEcosystem'

// Public website pages
import WebsiteLayout from './pages/website/WebsiteLayout'
import HomePage from './pages/website/HomePage'
import ProductPage from './pages/website/ProductPage'
import AboutPage from './pages/website/AboutPage'
import ContactPage from './pages/website/ContactPage'

// New persona layouts and pages
import ScoutLayout from './pages/scout/ScoutLayout'
import ScoutDashboard from './pages/scout/ScoutDashboard'
import ScoutWatchlist from './pages/scout/ScoutWatchlist'
import CoachLayout from './pages/coach/CoachLayout'
import CoachDashboard from './pages/coach/CoachDashboard'
import CoachRoster from './pages/coach/CoachRoster'
import CoachMatchupPrep from './pages/coach/CoachMatchupPrep'
import AgentLayout from './pages/agent/AgentLayout'
import AgentDashboard from './pages/agent/AgentDashboard'

export default function App() {
  return (
    <Routes>
      {/* Login / Role Selection */}
      <Route path="/" element={<LoginScreen />} />

      {/* Scout Routes */}
      <Route path="/scout" element={<ScoutLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ScoutDashboard />} />
        <Route path="watchlist" element={<ScoutWatchlist />} />
        <Route path="territory" element={<ScoutWatchlist />} />
      </Route>

      {/* Coach Routes */}
      <Route path="/coach" element={<CoachLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CoachDashboard />} />
        <Route path="roster" element={<CoachRoster />} />
        <Route path="matchup" element={<CoachMatchupPrep />} />
        <Route path="trends" element={<CoachDashboard />} />
      </Route>

      {/* Agent Routes */}
      <Route path="/agent" element={<AgentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AgentDashboard />} />
        <Route path="clients" element={<AgentDashboard />} />
        <Route path="contracts" element={<AgentDashboard />} />
        <Route path="reports" element={<AgentDashboard />} />
      </Route>

      {/* Legacy Facility Routes */}
      <Route path="/facility" element={<FacilityLayout />}>
        <Route index element={<Navigate to="sessions" replace />} />
        <Route path="sessions" element={<SessionsTab />} />
        <Route path="players" element={<PlayersTab />} />
        <Route path="groups" element={<GroupsTab />} />
      </Route>

      {/* Shared Player Routes (accessible from any persona) */}
      <Route path="/player/:playerId/dashboard" element={<PlayerDashboard />} />
      <Route path="/player/:playerId/metrics" element={<PlayerMetrics />} />
      <Route path="/player/:playerId/pitching" element={<PlayerPitching />} />
      <Route path="/player/:playerId/pitching/metrics" element={<PlayerPitchingMetrics />} />
      <Route path="/player/:playerId/strength" element={<PlayerStrength />} />
      <Route path="/player/:playerId/ecosystem" element={<PlayerEcosystem />} />

      {/* Public Website */}
      <Route path="/site" element={<WebsiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
