import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import './website.css'

export default function WebsiteLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const root = document.querySelector('.ws-root')
    if (!root) return
    const handler = () => setScrolled(root.scrollTop > 60)
    root.addEventListener('scroll', handler)
    return () => root.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.querySelector('.ws-root')?.scrollTo(0, 0)
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="ws-root">
      {/* Ambient depth */}
      <div className="ws-ambient" aria-hidden="true">
        <div className="ws-dot ws-dot-1" />
        <div className="ws-dot ws-dot-2" />
        <div className="ws-dot ws-dot-3" />
        <div className="ws-dot ws-dot-4" />
        <div className="ws-dot ws-dot-5" />
        <div className="ws-dot ws-dot-6" />
        <div className="ws-dot ws-dot-7" />
        <div className="ws-glow ws-glow-1" />
        <div className="ws-glow ws-glow-2" />
      </div>

      <nav className={`ws-nav ${scrolled ? 'ws-nav--solid' : ''}`}>
        <div className="ws-nav-inner">
          <Link to="/site" className="ws-nav-logo">
            <img src="/branding/icon-white.svg" alt="" style={{ height: 28 }} />
            <span>BASELINE</span>
          </Link>

          <button
            className="ws-nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

          <div className={`ws-nav-links ${menuOpen ? 'ws-nav-links--open' : ''}`}>
            <Link to="/site/product" className={location.pathname === '/site/product' ? 'active' : ''}>Product</Link>
            <Link to="/site/about" className={location.pathname === '/site/about' ? 'active' : ''}>About</Link>
            <Link to="/site/contact" className={location.pathname === '/site/contact' ? 'active' : ''}>Contact</Link>
          </div>

          <Link to="/" className="ws-btn-primary ws-nav-cta">Launch Demo</Link>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      <footer className="ws-footer" style={{ position: 'relative', zIndex: 1 }}>
        <div className="ws-footer-inner">
          <div className="ws-footer-top">
            <div className="ws-footer-brand">
              <div className="ws-footer-logo">
                <img src="/branding/icon-white.svg" alt="" style={{ height: 32 }} />
                <span>BASELINE</span>
              </div>
              <p>Where performance becomes direction. The professional-grade analytics platform for baseball's decision makers.</p>
            </div>
            <div className="ws-footer-links">
              <div className="ws-footer-col">
                <h4>Platform</h4>
                <Link to="/site/product">Product Overview</Link>
                <Link to="/">Scout Demo</Link>
                <Link to="/">Coach Demo</Link>
                <Link to="/">Pitching Coach Demo</Link>
                <Link to="/">Agent Demo</Link>
                <Link to="/">Player Demo</Link>
              </div>
              <div className="ws-footer-col">
                <h4>Company</h4>
                <Link to="/site/about">About</Link>
                <Link to="/site/contact">Contact</Link>
                <Link to="/site/contact">Request Access</Link>
              </div>
            </div>
          </div>
          <div className="ws-footer-bottom">
            <div className="ws-footer-divider" />
            <p>&copy; {new Date().getFullYear()} Baseline Analytics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
