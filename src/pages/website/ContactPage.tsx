import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FadeSection } from './shared'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    role: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const existing = JSON.parse(localStorage.getItem('baseline-inquiries') || '[]')
    existing.push({ ...form, timestamp: new Date().toISOString() })
    localStorage.setItem('baseline-inquiries', JSON.stringify(existing))
    setSubmitted(true)
  }

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="ws-page-hero">
        <div className="ws-hero-label">Get In Touch</div>
        <h1>Let's Talk</h1>
        <p>
          Interested in Baseline? Request access, schedule a walkthrough,
          or reach out with any questions.
        </p>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section className="ws-section ws-section--alt">
        <div className="ws-container">
          <FadeSection>
            <div className="ws-contact-grid">
              <div>
                {submitted ? (
                  <div className="ws-success">
                    <h3>Thank You</h3>
                    <p>We've received your inquiry and will be in touch shortly.</p>
                    <div style={{ marginTop: 24 }}>
                      <Link to="/site" className="ws-btn-secondary" style={{ fontSize: 11 }}>
                        Back to Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form className="ws-form" onSubmit={handleSubmit}>
                    <div className="ws-form-row">
                      <div className="ws-form-group">
                        <label className="ws-form-label">First Name</label>
                        <input
                          className="ws-form-input"
                          type="text"
                          placeholder="John"
                          value={form.firstName}
                          onChange={e => update('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="ws-form-group">
                        <label className="ws-form-label">Last Name</label>
                        <input
                          className="ws-form-input"
                          type="text"
                          placeholder="Smith"
                          value={form.lastName}
                          onChange={e => update('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="ws-form-group">
                      <label className="ws-form-label">Email</label>
                      <input
                        className="ws-form-input"
                        type="email"
                        placeholder="john@organization.com"
                        value={form.email}
                        onChange={e => update('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="ws-form-group">
                      <label className="ws-form-label">Organization</label>
                      <input
                        className="ws-form-input"
                        type="text"
                        placeholder="Team or company name"
                        value={form.organization}
                        onChange={e => update('organization', e.target.value)}
                      />
                    </div>

                    <div className="ws-form-group">
                      <label className="ws-form-label">Your Role</label>
                      <select
                        className="ws-form-select"
                        value={form.role}
                        onChange={e => update('role', e.target.value)}
                        required
                      >
                        <option value="">Select your role</option>
                        <option value="scout">Scout</option>
                        <option value="coach">Coach</option>
                        <option value="agent">Agent</option>
                        <option value="front-office">Front Office</option>
                        <option value="facility">Training Facility</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="ws-form-group">
                      <label className="ws-form-label">Message</label>
                      <textarea
                        className="ws-form-textarea"
                        placeholder="Tell us about your interest in Baseline..."
                        value={form.message}
                        onChange={e => update('message', e.target.value)}
                      />
                    </div>

                    <button type="submit" className="ws-btn-primary" style={{ width: '100%' }}>
                      Submit Inquiry
                    </button>
                  </form>
                )}
              </div>

              <div className="ws-contact-info">
                <h3>Other Ways to Connect</h3>
                <p>
                  Prefer a direct conversation? Reach out through any of the channels
                  below and we'll get back to you within 24 hours.
                </p>

                <div className="ws-contact-detail">
                  <span>Email</span>
                  <p>hello@baselineanalytics.com</p>
                </div>
                <div className="ws-contact-detail">
                  <span>Demo</span>
                  <p>
                    <Link to="/" style={{ color: '#E0AC44', textDecoration: 'none' }}>
                      Launch the interactive demo
                    </Link>
                  </p>
                </div>
                <div className="ws-contact-detail">
                  <span>Location</span>
                  <p>United States</p>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="ws-cta">
        <FadeSection>
          <h2>Not ready to reach out?</h2>
          <p>Explore the platform demo on your own terms — no sign-up required.</p>
          <div className="ws-cta-actions">
            <Link to="/" className="ws-btn-primary">Launch Demo</Link>
            <Link to="/site/product" className="ws-btn-secondary">View Product</Link>
          </div>
        </FadeSection>
      </section>
    </>
  )
}
