import { Link } from 'react-router-dom'
import { FadeSection } from './shared'

export default function AboutPage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="ws-page-hero">
        <div className="ws-hero-label">Our Mission</div>
        <h1>Every Athlete Deserves<br />a Baseline</h1>
        <p>
          We believe the future of player development belongs to those
          who can turn raw data into clear, actionable direction.
        </p>
      </section>

      {/* ===== THE PROBLEM & APPROACH ===== */}
      <section className="ws-section ws-section--alt">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-about-grid">
              <div className="ws-about-block">
                <div className="ws-divider" />
                <h3>The Problem</h3>
                <p>
                  Player development data is fragmented. It lives in disconnected systems,
                  requires manual interpretation, and rarely reaches the people who need
                  it most — in a format they can actually use.
                </p>
                <br />
                <p>
                  Scouts rely on memory between visits. Coaches juggle spreadsheets.
                  Agents build cases from subjective assessments. The data exists.
                  The infrastructure to make it useful doesn't — until now.
                </p>
              </div>
              <div className="ws-about-block">
                <div className="ws-divider" />
                <h3>Our Approach</h3>
                <p>
                  Baseline unifies player development data into a single intelligent platform
                  with purpose-built workflows for the three roles that drive professional
                  baseball decisions: scouts, coaches, and agents.
                </p>
                <br />
                <p>
                  We don't just display data. We contextualize it. AI-powered analysis
                  transforms raw metrics into role-specific insights — so every
                  stakeholder gets exactly the intelligence they need to make better decisions.
                </p>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== WHAT WE BELIEVE ===== */}
      <section className="ws-section">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-text-center" style={{ marginBottom: 64 }}>
              <div className="ws-section-label">What We Believe</div>
              <h2 className="ws-section-title">Built on Principles</h2>
            </div>
          </FadeSection>

          <div className="ws-values-grid">
            <FadeSection delay={0.05}>
              <div className="ws-value">
                <h4>Athlete-Focused</h4>
                <p>
                  Every feature, every metric, every insight is designed to serve athlete
                  development. The player is always at the center.
                </p>
              </div>
            </FadeSection>

            <FadeSection delay={0.15}>
              <div className="ws-value">
                <h4>Data-Driven</h4>
                <p>
                  Opinions have their place. But decisions backed by verified, contextualized
                  data consistently outperform intuition alone.
                </p>
              </div>
            </FadeSection>

            <FadeSection delay={0.25}>
              <div className="ws-value">
                <h4>Professional-Grade</h4>
                <p>
                  Built for the standards of professional baseball. No shortcuts.
                  No compromises. The same rigor the game demands.
                </p>
              </div>
            </FadeSection>

            <FadeSection delay={0.1}>
              <div className="ws-value">
                <h4>Accessible</h4>
                <p>
                  Complex analytics shouldn't require a data science degree. We make
                  powerful insights understandable to everyone in the pipeline.
                </p>
              </div>
            </FadeSection>

            <FadeSection delay={0.2}>
              <div className="ws-value">
                <h4>Transparent</h4>
                <p>
                  Every insight is traceable back to source data. No black boxes.
                  No unexplainable outputs. Trust starts with transparency.
                </p>
              </div>
            </FadeSection>

            <FadeSection delay={0.3}>
              <div className="ws-value">
                <h4>Forward-Looking</h4>
                <p>
                  We don't just report what happened. We identify where things are
                  heading — turning performance data into developmental direction.
                </p>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ===== VISION ===== */}
      <section className="ws-section ws-section--alt">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-text-center" style={{ maxWidth: 700, margin: '0 auto' }}>
              <div className="ws-divider-center" />
              <h2 style={{
                fontFamily: "'GT America Standard', sans-serif",
                fontWeight: 700,
                fontSize: 28,
                color: '#fff',
                marginBottom: 20,
                lineHeight: 1.3,
              }}>
                "Where Performance Becomes Direction"
              </h2>
              <p style={{
                fontFamily: "'GT America Mono', monospace",
                fontSize: 15,
                color: '#555',
                lineHeight: 1.8,
              }}>
                Baseline exists because every athlete's development story deserves to be
                told with data — and every decision maker deserves the tools to read it.
                We're building the infrastructure that makes professional player development
                smarter, faster, and more accessible.
              </p>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="ws-cta">
        <FadeSection>
          <h2>Want to learn more?</h2>
          <p>See the platform in action or get in touch with our team.</p>
          <div className="ws-cta-actions">
            <Link to="/" className="ws-btn-primary">Launch Demo</Link>
            <Link to="/site/contact" className="ws-btn-secondary">Contact Us</Link>
          </div>
        </FadeSection>
      </section>
    </>
  )
}
