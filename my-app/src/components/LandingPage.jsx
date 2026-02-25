import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, ArrowRight, CheckCircle,
  MapPin, Layers, MousePointer, Shield,
  BookOpen, Award, Users, Zap, TrendingUp, Star, ChevronRight
} from 'lucide-react';
import logo from '../logo.png';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const features = [
    { icon: <MapPin size={22} />, title: 'Smart Discovery', desc: 'Find events by venue, category, or interest with intelligent filtering.' },
    { icon: <Layers size={22} />, title: 'Centralized Hub', desc: 'One dashboard for registrations, tickets, and attendance tracking.' },
    { icon: <MousePointer size={22} />, title: 'Seamless Workflow', desc: 'From event creation to certification — every step automated.' },
    { icon: <Shield size={22} />, title: 'Secure & Private', desc: 'Role-based access keeps student and faculty data protected.' },
  ];

  const steps = [
    { num: '01', title: 'Create & Publish', body: 'Teachers set dates, venues, and banners. Content goes live on the student feed instantly.' },
    { num: '02', title: 'Register & Track', body: 'Students browse events and click Register. Requests appear as Pending in My Tickets.' },
    { num: '03', title: 'Approve & Analyze', body: 'Teachers approve students and digital tickets are auto-generated immediately.' },
  ];

  return (
    <div>
      {/* ── NAVBAR ── */}
      <nav className={`lp-nav${scrolled ? ' lp-nav-scrolled' : ''}`}>
        <div className="lp-nav-logo" onClick={() => scrollTo('home')}>
          <img src={logo} alt="EventSphere logo" />
          <span className="lp-nav-logo-text">EventSphere</span>
        </div>

        <ul className="lp-nav-links">
          {['home', 'events', 'workshops', 'about'].map(s => (
            <li key={s} onClick={() => scrollTo(s)} style={{ textTransform: 'capitalize' }}>{s}</li>
          ))}
        </ul>

        <div className="lp-nav-actions">
          <button className="lp-btn-ghost" onClick={() => navigate('/signin')}>Log in</button>
          <button className="lp-btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
        </div>

        <button className="lp-nav-mobile-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lp-mobile-menu">
          {['home', 'events', 'workshops', 'about'].map(s => (
            <span key={s} onClick={() => scrollTo(s)} style={{ textTransform: 'capitalize' }}>{s}</span>
          ))}
          <hr />
          <span onClick={() => navigate('/signin')}>Log in</span>
          <button className="lp-btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="home" className="lp-hero">
        <div className="lp-hero-blob1" />
        <div className="lp-hero-blob2" />
        <div className="lp-hero-inner">
          <div className="lp-hero-badge">
            <Zap size={12} fill="currentColor" />
            Smart College Event Management Platform
          </div>
          <h1 className="lp-hero-title">
            Campus events,{' '}
            <span>managed brilliantly</span>
          </h1>
          <p className="lp-hero-sub">
            EventSphere streamlines the full lifecycle of college events — from creation to approval.
            Designed for students, built for faculty.
          </p>
          <div className="lp-hero-ctas">
            <button className="lp-btn-primary" onClick={() => navigate('/signup')}>
              Start for Free&nbsp;&nbsp;<ArrowRight size={16} style={{ verticalAlign: 'middle' }} />
            </button>
            <button className="lp-btn-secondary" onClick={() => scrollTo('about')}>
              See How It Works
            </button>
          </div>
          <div className="lp-hero-stats">
            {[['500+', 'Events Hosted'], ['12K+', 'Students Enrolled'], ['200+', 'Faculty Members']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div className="lp-hero-stat-value">{v}</div>
                <div className="lp-hero-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-section lp-section-center lp-features">
        <div className="lp-section-eyebrow lp-eyebrow-violet"><TrendingUp size={12} /> Core Features</div>
        <h2 className="lp-section-title">Everything you need to run events</h2>
        <p className="lp-section-sub">A complete, integrated toolkit built for modern college campuses.</p>
        <div className="lp-features-grid">
          {features.map(f => (
            <div className="lp-feature-card" key={f.title}>
              <div className="lp-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="events" className="lp-section lp-section-center lp-steps">
        <div className="lp-section-eyebrow lp-eyebrow-emerald"><CheckCircle size={12} /> Simple Process</div>
        <h2 className="lp-section-title">How EventSphere works</h2>
        <p className="lp-section-sub">Three simple steps from idea to approved attendance.</p>
        <div className="lp-steps-grid">
          {steps.map(s => (
            <div className="lp-step-card" key={s.num}>
              <div className="lp-step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WORKSHOPS (Dark) ── */}
      <section id="workshops" className="lp-section lp-section-center lp-workshops">
        <div className="lp-section-eyebrow lp-eyebrow-indigo"><BookOpen size={12} /> Professional Development</div>
        <h2 className="lp-section-title" style={{ color: '#fff' }}>Workshops &amp; Training</h2>
        <p className="lp-section-sub" style={{ color: '#94a3b8' }}>
          Beyond cultural fests — run intensive skill-building sessions with limited seats.
        </p>
        <div className="lp-workshop-card">
          <div className="lp-workshop-icon-box"><BookOpen size={52} /></div>
          <div className="lp-workshop-body">
            <h3>Skill Development Events</h3>
            <p>
              Workshops are special events focused on learning — often with capped enrollment and specific prerequisites.
              Use the <strong style={{ color: '#818cf8' }}>Workshop</strong> category to tag these high-value sessions.
            </p>
            <ul className="lp-workshop-list">
              {['Hands-on coding bootcamps', 'Certification seminars', 'Guest lecture series'].map(i => (
                <li key={i}><CheckCircle size={14} color="#818cf8" />{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── PORTALS ── */}
      <section id="about" className="lp-section lp-section-center lp-portals">
        <div className="lp-section-eyebrow lp-eyebrow-amber"><Star size={12} /> Two Portals, One Platform</div>
        <h2 className="lp-section-title">Choose your role</h2>
        <p className="lp-section-sub">EventSphere is built for both sides of the campus experience.</p>
        <div className="lp-portals-grid">
          {/* Student */}
          <div className="lp-portal-card lp-portal-indigo">
            <div className="lp-portal-header">
              <div className="lp-portal-avatar lp-avatar-indigo"><Users size={20} /></div>
              <div>
                <div className="lp-portal-title">Student Portal</div>
                <div className="lp-portal-sub">Discover, register &amp; attend</div>
              </div>
            </div>
            <ul className="lp-portal-list">
              {['Browse and filter events by category', 'Register with one click', 'Track ticket status in real-time', 'View full participation history'].map(i => (
                <li key={i}><CheckCircle size={14} color="#4f46e5" style={{ flexShrink: 0 }} />{i}</li>
              ))}
            </ul>
            <button className="lp-portal-cta lp-cta-indigo" onClick={() => navigate('/signin')}>
              Student Login <ArrowRight size={15} />
            </button>
            <div className="lp-portal-register">
              No account?&nbsp;
              <span className="lp-register-indigo" onClick={() => navigate('/signup')}>Register as Student</span>
            </div>
          </div>

          {/* Teacher */}
          <div className="lp-portal-card lp-portal-violet">
            <div className="lp-portal-header">
              <div className="lp-portal-avatar lp-avatar-violet"><Award size={20} /></div>
              <div>
                <div className="lp-portal-title">Teacher Portal</div>
                <div className="lp-portal-sub">Create, approve &amp; manage</div>
              </div>
            </div>
            <ul className="lp-portal-list">
              {['Create and publish events instantly', 'Set capacity limits and deadlines', 'Approve or reject student registrations', 'Generate digital tickets automatically'].map(i => (
                <li key={i}><CheckCircle size={14} color="#7c3aed" style={{ flexShrink: 0 }} />{i}</li>
              ))}
            </ul>
            <button className="lp-portal-cta lp-cta-violet" onClick={() => navigate('/teacher-signin')}>
              Teacher Login <ArrowRight size={15} />
            </button>
            <div className="lp-portal-register">
              New faculty?&nbsp;
              <span className="lp-register-violet" onClick={() => navigate('/teacher-signup')}>Register as Teacher</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="lp-cta-banner">
        <h2>Ready to transform campus events?</h2>
        <p>Join thousands of students and faculty who manage their campus life with EventSphere.</p>
        <div className="lp-cta-banner-btns">
          <button className="lp-btn-white" onClick={() => navigate('/signup')}>Sign Up as Student</button>
          <button className="lp-btn-outline-white" onClick={() => navigate('/teacher-signup')}>Register as Teacher</button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <img src={logo} alt="EventSphere" />
          <span>EventSphere</span>
        </div>
        <p className="lp-footer-copy">© 2024 EventSphere College Management. All rights reserved.</p>
        <div className="lp-footer-links">
          <span>Privacy Policy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;