import { Link } from 'react-router-dom'
import { FadeSection } from './shared'
import {
  FloatingOrbs,
  HeroDashboardMockup,
  StatCounter,
  FloatingAIPanel,
  AnimatedPlayerCard,
  AnimatedRosterGrid,
} from './AnimatedMockups'

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="ws-hero">
        <FloatingOrbs />
        <div className="ws-grid-bg" />
        <div className="ws-hero-content">
          <div className="ws-hero-label">Professional Baseball Analytics</div>
          <h1>Where Performance<br />Becomes Direction</h1>
          <p className="ws-hero-sub">
            The professional-grade analytics platform turning raw player data
            into actionable intelligence — for scouts, coaches, and agents
            who demand more.
          </p>
          <div className="ws-hero-actions">
            <Link to="/site/product" className="ws-btn-primary">Explore the Platform</Link>
            <Link to="/site/contact" className="ws-btn-secondary">Request Access</Link>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT SHOWCASE ===== */}
      <section className="ws-showcase">
        <div className="ws-showcase-inner">
          <FadeSection>
            <HeroDashboardMockup />
          </FadeSection>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="ws-section--alt" style={{ padding: 0 }}>
        <div className="ws-container">
          <div className="ws-stats-bar">
            <div className="ws-stat">
              <div className="ws-stat-value"><StatCounter end={50} suffix="+" /></div>
              <div className="ws-stat-label">Performance Metrics</div>
            </div>
            <div className="ws-stat">
              <div className="ws-stat-value">Real-Time</div>
              <div className="ws-stat-label">Biomechanical Analysis</div>
            </div>
            <div className="ws-stat">
              <div className="ws-stat-value">AI-Powered</div>
              <div className="ws-stat-label">Trend Detection</div>
            </div>
            <div className="ws-stat">
              <div className="ws-stat-value"><StatCounter end={3} /></div>
              <div className="ws-stat-label">Professional Workflows</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ROLE CARDS ===== */}
      <section className="ws-section">
        <div className="ws-container ws-text-center">
          <FadeSection>
            <div className="ws-section-label">Built For Professionals</div>
            <h2 className="ws-section-title">Three Roles. One Platform.</h2>
            <p className="ws-section-subtitle centered" style={{ marginBottom: 64 }}>
              Purpose-built workflows for every stakeholder in the player development pipeline.
            </p>
          </FadeSection>

          <div className="ws-grid-3">
            <FadeSection delay={0.1}>
              <div className="ws-card">
                <div className="ws-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
                  </svg>
                </div>
                <h3>Scout</h3>
                <div className="ws-card-sub">Territory Coverage</div>
                <p>Track prospects across your territory. See development arcs, mechanical shifts, and everything that happens between visits.</p>
              </div>
            </FadeSection>

            <FadeSection delay={0.2}>
              <div className="ws-card">
                <div className="ws-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3>Coach</h3>
                <div className="ws-card-sub">Team Management</div>
                <p>Manage your roster, prep for matchups, and track trend data across your entire hitting group with data-driven confidence.</p>
              </div>
            </FadeSection>

            <FadeSection delay={0.3}>
              <div className="ws-card">
                <div className="ws-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <h3>Agent</h3>
                <div className="ws-card-sub">Client Representation</div>
                <p>Build verified development resumes with fact-supported evidence for arbitration and contract negotiations.</p>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ===== FOR PLAYERS ===== */}
      <section className="ws-section ws-section--alt">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-split-section">
              <div className="ws-feature-text">
                <div className="ws-section-label">For Players</div>
                <h3>Your Development,<br />Documented</h3>
                <div className="ws-feature-sub">Performance Profile That Follows Your Career</div>
                <p>
                  Every session builds your story. Baseline tracks your development across
                  every metric, every session, every season — creating a verified performance
                  profile that follows you throughout your career.
                </p>
                <ul className="ws-feature-list">
                  <li>Personal development dashboard</li>
                  <li>Cross-session progress visualization</li>
                  <li>Verified performance benchmarks</li>
                  <li>Exportable development resume</li>
                  <li>AI-powered training recommendations</li>
                </ul>
              </div>
              <div className="ws-split-visual">
                <AnimatedPlayerCard />
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== FOR COACHES ===== */}
      <section className="ws-section">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-split-section">
              <div className="ws-split-visual">
                <AnimatedRosterGrid />
              </div>
              <div className="ws-feature-text">
                <div className="ws-section-label">For Coaches</div>
                <h3>The Coaching<br />Advantage</h3>
                <div className="ws-feature-sub">See Your Entire Team at a Glance</div>
                <p>
                  Identify trends before they become problems. Prep for every matchup with
                  data you can trust. Baseline gives you the complete picture of your
                  hitting group — no spreadsheets required.
                </p>
                <ul className="ws-feature-list">
                  <li>Real-time session monitoring</li>
                  <li>Group performance comparison</li>
                  <li>Automated trend detection alerts</li>
                  <li>Matchup preparation tools</li>
                  <li>Practice planning analytics</li>
                </ul>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== AI SHOWCASE ===== */}
      <section className="ws-section ws-section--alt" style={{ position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs />
        <div className="ws-container" style={{ position: 'relative', zIndex: 1 }}>
          <FadeSection>
            <div className="ws-split-section">
              <div className="ws-feature-text">
                <div className="ws-section-label">AI Intelligence</div>
                <h3>Insights That<br />Drive Decisions</h3>
                <div className="ws-feature-sub">Not Just Data — Direction</div>
                <p>
                  Baseline's AI doesn't just crunch numbers. It contextualizes performance
                  data against historical baselines, identifies meaningful trends, and delivers
                  role-specific insights in plain language.
                </p>
                <p>
                  Whether you're a scout evaluating a prospect, a coach monitoring your roster,
                  or an agent building a case — the AI adapts its analysis to what matters most
                  to you.
                </p>
              </div>
              <div className="ws-split-visual">
                <FloatingAIPanel />
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== PLATFORM FEATURES ===== */}
      <section className="ws-section">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-text-center">
              <div className="ws-section-label">The Platform</div>
              <h2 className="ws-section-title" style={{ marginBottom: 8 }}>Every Athlete Deserves a Baseline</h2>
              <p className="ws-section-subtitle centered" style={{ marginBottom: 64 }}>
                A complete development ecosystem that captures, analyzes, and contextualizes
                every aspect of player performance.
              </p>
            </div>
          </FadeSection>

          <div className="ws-grid-2">
            <FadeSection delay={0.05}>
              <div className="ws-card">
                <div className="ws-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3>Historical Data Collection</h3>
                <p>Capture and store every session's metrics, building a comprehensive longitudinal record of player development over time.</p>
              </div>
            </FadeSection>
            <FadeSection delay={0.15}>
              <div className="ws-card">
                <div className="ws-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h3>AI-Driven Insights</h3>
                <p>Intelligent analysis that surfaces meaningful trends, flags mechanical changes, and provides contextual recommendations automatically.</p>
              </div>
            </FadeSection>
            <FadeSection delay={0.25}>
              <div className="ws-card">
                <div className="ws-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <h3>Cross-Session Trends</h3>
                <p>Track development over time. See how metrics evolve across sessions, weeks, and seasons with powerful longitudinal analysis.</p>
              </div>
            </FadeSection>
            <FadeSection delay={0.35}>
              <div className="ws-card">
                <div className="ws-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <h3>Ecosystem Integration</h3>
                <p>Unified view across HitTrax, Blast Motion, Trackman, and more. One platform for your entire training technology stack.</p>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="ws-section ws-section--alt">
        <div className="ws-container ws-text-center">
          <FadeSection>
            <div className="ws-section-label">How It Works</div>
            <h2 className="ws-section-title" style={{ marginBottom: 64 }}>From Raw Data to Clear Direction</h2>
          </FadeSection>

          <div className="ws-grid-3">
            {[
              { num: '1', title: 'Capture', desc: 'Data flows in from training sessions, games, and biomechanical assessments across your technology stack.' },
              { num: '2', title: 'Analyze', desc: 'AI-powered analysis identifies trends, flags anomalies, and contextualizes every data point against historical baselines.' },
              { num: '3', title: 'Direct', desc: 'Purpose-built dashboards deliver role-specific insights that drive decisions — not just display data.' },
            ].map((step, i) => (
              <FadeSection key={step.num} delay={i * 0.12}>
                <div style={{ padding: '0 16px' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    border: '1px solid rgba(224,172,68,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontFamily: "'GT America Standard', sans-serif",
                    fontWeight: 700, fontSize: 20, color: '#E0AC44',
                  }}>{step.num}</div>
                  <h3 style={{
                    fontFamily: "'GT America Standard', sans-serif",
                    fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 8,
                  }}>{step.title}</h3>
                  <p style={{
                    fontFamily: "'GT America Mono', monospace",
                    fontSize: 13, color: '#555', lineHeight: 1.7,
                  }}>{step.desc}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BACKED BY ===== */}
      <section className="ws-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="ws-container ws-text-center">
          <FadeSection>
            <div style={{ fontFamily: "'GT America Mono', monospace", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#555', marginBottom: 24 }}>
              Backed By
            </div>
            <img
              src="/branding/google-cloud-startups.png"
              alt="Google Cloud for Startups"
              style={{ height: 48, objectFit: 'contain', filter: 'brightness(0.85)', opacity: 0.9 }}
            />
          </FadeSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="ws-cta">
        <FadeSection>
          <h2>Ready to see the platform in action?</h2>
          <p>Launch the interactive demo to explore Baseline's professional workflows firsthand.</p>
          <div className="ws-cta-actions">
            <Link to="/" className="ws-btn-primary">Launch Demo</Link>
            <Link to="/site/contact" className="ws-btn-secondary">Request Access</Link>
          </div>
        </FadeSection>
      </section>
    </>
  )
}
