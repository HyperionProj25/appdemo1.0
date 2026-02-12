import { Link } from 'react-router-dom'
import { FadeSection } from './shared'
import {
  FloatingOrbs,
  AnimatedScoutRadar,
  AnimatedRosterGrid,
  AnimatedReportDoc,
  AnimatedPlayerCard,
  FloatingAIPanel,
} from './AnimatedMockups'

export default function ProductPage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="ws-page-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs />
        <div className="ws-grid-bg" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="ws-hero-label">The Platform</div>
          <h1>One Platform.<br />Three Professional Workflows.</h1>
          <p>Complete coverage of the player development pipeline — from raw biomechanical data to role-specific intelligence that drives decisions.</p>
        </div>
      </section>

      {/* ===== SCOUT WORKFLOW ===== */}
      <section className="ws-section ws-section--alt">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-split-section">
              <div className="ws-feature-text">
                <div className="ws-section-label">Scout Workflow</div>
                <h3>Territory Coverage</h3>
                <div className="ws-feature-sub">Track Every Prospect Between Visits</div>
                <p>
                  Cover more ground without missing a beat. Baseline tracks prospect development
                  continuously, so you see everything that happened since your last visit — not
                  just a snapshot of one session.
                </p>
                <ul className="ws-feature-list">
                  <li>Development arc tracking across sessions</li>
                  <li>Mechanical shift detection and alerts</li>
                  <li>Cross-territory prospect comparison</li>
                  <li>AI-generated scouting summaries</li>
                  <li>Custom watchlist management</li>
                </ul>
              </div>
              <div className="ws-split-visual">
                <AnimatedScoutRadar />
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== COACH WORKFLOW ===== */}
      <section className="ws-section">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-split-section">
              <div className="ws-split-visual">
                <AnimatedRosterGrid />
              </div>
              <div className="ws-feature-text">
                <div className="ws-section-label">Coach Workflow</div>
                <h3>Team Management</h3>
                <div className="ws-feature-sub">Data-Driven Roster Decisions</div>
                <p>
                  See your entire hitting group at a glance. Prep for upcoming matchups with
                  trend data that shows what's actually changing — and use AI-powered analysis
                  to stay ahead of mechanical issues before they become problems.
                </p>
                <ul className="ws-feature-list">
                  <li>Full roster performance overview</li>
                  <li>Matchup preparation with pitcher profiles</li>
                  <li>Group trend analysis and comparison</li>
                  <li>Session-over-session progress tracking</li>
                  <li>Automated coaching recommendations</li>
                </ul>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== AGENT WORKFLOW ===== */}
      <section className="ws-section ws-section--alt">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-split-section">
              <div className="ws-feature-text">
                <div className="ws-section-label">Agent Workflow</div>
                <h3>Client Representation</h3>
                <div className="ws-feature-sub">Evidence-Backed Negotiations</div>
                <p>
                  Build verified development resumes backed by real data — not subjective
                  assessments. Present fact-supported evidence in arbitration hearings and
                  contract negotiations with professional-grade reports.
                </p>
                <ul className="ws-feature-list">
                  <li>Verified development resume generation</li>
                  <li>Arbitration evidence compilation</li>
                  <li>Contract value analysis with metrics</li>
                  <li>Comparative performance benchmarking</li>
                  <li>Exportable professional reports</li>
                </ul>
              </div>
              <div className="ws-split-visual">
                <AnimatedReportDoc />
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== PLAYER EXPERIENCE ===== */}
      <section className="ws-section">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-split-section">
              <div className="ws-split-visual">
                <AnimatedPlayerCard />
              </div>
              <div className="ws-feature-text">
                <div className="ws-section-label">Player Experience</div>
                <h3>Your Career,<br />Quantified</h3>
                <div className="ws-feature-sub">Development Tracking That Follows You</div>
                <p>
                  Every swing, every session, every season builds your verified performance profile.
                  Baseline gives players ownership of their development story — backed by data
                  that speaks louder than subjective evaluation.
                </p>
                <ul className="ws-feature-list">
                  <li>Personal performance dashboard</li>
                  <li>Historical trend visualization</li>
                  <li>Peer benchmarking comparisons</li>
                  <li>AI-powered training recommendations</li>
                  <li>Shareable development portfolio</li>
                </ul>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== AI INTELLIGENCE ===== */}
      <section className="ws-section ws-section--alt" style={{ position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs />
        <div className="ws-container" style={{ position: 'relative', zIndex: 1 }}>
          <FadeSection>
            <div className="ws-split-section">
              <div className="ws-feature-text">
                <div className="ws-section-label">AI Intelligence</div>
                <h3>Context-Aware<br />Analysis</h3>
                <div className="ws-feature-sub">The Brain Behind the Platform</div>
                <p>
                  Baseline's AI engine processes every data point through the lens of player
                  development. It doesn't just flag changes — it explains why they matter and
                  what to do about them.
                </p>
                <ul className="ws-feature-list">
                  <li>Natural language performance summaries</li>
                  <li>Anomaly detection and early warnings</li>
                  <li>Role-specific insight delivery</li>
                  <li>Historical context for every metric</li>
                  <li>Predictive development modeling</li>
                </ul>
              </div>
              <div className="ws-split-visual">
                <FloatingAIPanel />
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className="ws-section">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-text-center">
              <div className="ws-section-label">Capabilities</div>
              <h2 className="ws-section-title" style={{ marginBottom: 8 }}>What Baseline Tracks</h2>
              <p className="ws-section-subtitle centered" style={{ marginBottom: 64 }}>
                Over 50 performance metrics captured, analyzed, and contextualized in real time.
              </p>
            </div>
          </FadeSection>

          <div className="ws-grid-3">
            {[
              { title: 'Bat Speed & Power', desc: 'Peak bat speed, hand speed, power output, and time-to-contact across every swing.' },
              { title: 'Attack Angle & Path', desc: 'Swing plane analysis, attack angle consistency, and bat path optimization metrics.' },
              { title: 'Exit Velocity', desc: 'Ball speed off the bat with quality of contact analysis and hard-hit rate tracking.' },
              { title: 'Launch Angle', desc: 'Vertical and horizontal launch angle distribution with optimal zone targeting.' },
              { title: 'Pitch Recognition', desc: 'Zone discipline, chase rates, whiff rates, and pitch type performance breakdowns.' },
              { title: 'Strength & Conditioning', desc: 'Force plate metrics, rotational power, and physical development benchmarks.' },
            ].map((item, i) => (
              <FadeSection key={item.title} delay={i * 0.08}>
                <div className="ws-card">
                  <h3 style={{ fontSize: 18, marginBottom: 12 }}>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTEGRATIONS ===== */}
      <section className="ws-section ws-section--alt">
        <div className="ws-container ws-text-center">
          <FadeSection>
            <div className="ws-section-label">Ecosystem</div>
            <h2 className="ws-section-title" style={{ marginBottom: 8 }}>One Platform. Every Source.</h2>
            <p className="ws-section-subtitle centered" style={{ marginBottom: 64 }}>
              Baseline integrates with the tools you already use, unifying data
              into a single intelligent platform.
            </p>
          </FadeSection>

          <FadeSection delay={0.15}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              {['HitTrax', 'Blast Motion', 'Trackman', 'Rapsodo', 'Force Plates'].map(name => (
                <div key={name} style={{
                  padding: '18px 32px',
                  background: '#0d0d0d',
                  border: '1px solid #1c1c1c',
                  borderRadius: 8,
                  fontFamily: "'GT America Standard', sans-serif",
                  fontWeight: 700, fontSize: 14, color: '#555', letterSpacing: '1px',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,172,68,0.3)'; e.currentTarget.style.color = '#E0AC44' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1c1c1c'; e.currentTarget.style.color = '#555' }}
                >{name}</div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="ws-cta">
        <FadeSection>
          <h2>See it in action</h2>
          <p>Explore the interactive demo and experience every workflow firsthand.</p>
          <div className="ws-cta-actions">
            <Link to="/" className="ws-btn-primary">Launch Demo</Link>
            <Link to="/site/contact" className="ws-btn-secondary">Request Access</Link>
          </div>
        </FadeSection>
      </section>
    </>
  )
}
