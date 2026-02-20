import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, ArrowRight, CheckCircle,
  Calendar, Users, MapPin, Layers,
  MousePointer, Shield, BookOpen, Award, Video
} from 'lucide-react';
import logo from '../logo.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const styles = {
    container: { fontFamily: "'Inter', sans-serif", overflowX: 'hidden', backgroundColor: '#fff' },

    // --- 1. HEADER ---
    header: {
      position: 'fixed', top: 0, left: 0, width: '100%', height: '70px',
      backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 20px' : '0 50px', boxSizing: 'border-box'
    },
    logoSection: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    logoIcon: { width: '30px', height: '30px', backgroundColor: '#2563eb', borderRadius: '50%' },
    logoText: { fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' },

    navLinks: {
      display: isMobile ? 'none' : 'flex', gap: '30px',
      fontSize: '1rem', fontWeight: '500', color: '#4b5563'
    },
    navItem: { cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: '#2563eb' } },

    authButtons: { display: isMobile ? 'none' : 'flex', gap: '15px', alignItems: 'center' },
    loginLink: { fontWeight: '700', color: '#1e293b', cursor: 'pointer', fontSize: '1rem' },
    signupBtn: {
      backgroundColor: '#2563eb', color: '#fff', padding: '10px 20px',
      borderRadius: '6px', fontWeight: '700', border: 'none', cursor: 'pointer',
      fontSize: '0.95rem'
    },
    mobileMenuBtn: { display: isMobile ? 'block' : 'none', cursor: 'pointer' },

    // --- 2. HERO SECTION ---
    heroSection: {
      marginTop: '70px',
      position: 'relative', height: '60vh', minHeight: '400px',
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80")',
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', color: '#fff', padding: '20px'
    },
    heroTitle: {
      fontSize: isMobile ? '7vw' : '2.8vw', fontWeight: '800',
      textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px'
    },
    heroSubtitle: {
      fontSize: isMobile ? '3.5vw' : '1.1vw', fontWeight: '300',
      marginBottom: '30px', maxWidth: '700px', lineHeight: '1.5'
    },
    learnMoreBtn: {
      backgroundColor: '#f97316', color: '#fff', padding: '12px 30px',
      borderRadius: '4px', fontWeight: '800', border: 'none', cursor: 'pointer',
      textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.5px'
    },

    // --- BLUE STRIP ---
    blueStrip: {
      backgroundColor: '#167ac6', color: '#fff', padding: '20px',
      textAlign: 'center', fontSize: isMobile ? '3vw' : '0.9vw',
      fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase'
    },

    // --- FEATURES GRID ---
    featuresSection: {
      padding: isMobile ? '50px 20px' : '60px 10vw',
      backgroundColor: '#f8fafc', textAlign: 'center'
    },
    grid: {
      display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
      gap: '30px', marginTop: '40px'
    },
    featureCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' },
    iconCircle: {
      width: '70px', height: '70px', borderRadius: '50%',
      border: '2px solid #167ac6', color: '#167ac6', backgroundColor: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '10px'
    },
    featureTitle: { fontWeight: '700', fontSize: '0.9rem', color: '#334155', textTransform: 'uppercase' },
    featureDesc: { fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', maxWidth: '220px' },

    blueBtn: {
      marginTop: '40px', padding: '10px 25px', backgroundColor: '#167ac6', color: '#fff',
      border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
      textTransform: 'uppercase', cursor: 'pointer'
    },

    // --- 3. EVENTS SECTION ---
    eventsSection: { padding: isMobile ? '50px 20px' : '80px 15vw', backgroundColor: '#fff' },
    sectionHeader: { textAlign: 'center', marginBottom: '50px' },
    sectionTitle: { fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', marginBottom: '15px' },
    sectionText: { color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' },

    stepsGrid: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '30px' },
    stepCard: {
      flex: 1, padding: '30px', borderRadius: '15px', backgroundColor: '#f1f5f9',
      border: '1px solid #e2e8f0', textAlign: 'left'
    },
    stepNumber: { fontSize: '3rem', fontWeight: '800', color: '#cbd5e1', marginBottom: '10px' },
    stepHeading: { fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' },
    stepDesc: { color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' },

    // --- 4. WORKSHOPS SECTION ---
    workshopSection: {
      padding: isMobile ? '50px 20px' : '80px 15vw', backgroundColor: '#1e293b', color: '#fff'
    },
    workshopCard: {
      backgroundColor: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '15px',
      border: '1px solid rgba(255,255,255,0.1)', marginTop: '40px',
      display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '40px'
    },
    workshopText: { flex: 1 },
    workshopList: { listStyle: 'none', padding: 0, marginTop: '20px' },
    workshopItem: { display: 'flex', gap: '10px', marginBottom: '15px', opacity: 0.9 },

    // --- 5. ABOUT SECTION ---
    aboutSection: { padding: isMobile ? '50px 20px' : '80px 15vw', backgroundColor: '#f8fafc' },
    splitView: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '50px', marginTop: '40px' },
    roleBox: { flex: 1 },
    roleTitle: { fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },

    infoBlock: { marginBottom: '25px' },
    infoLabel: { fontWeight: '700', color: '#1e293b', marginBottom: '8px', display: 'block', textTransform: 'uppercase', fontSize: '0.85rem' },
    infoText: { color: '#475569', lineHeight: '1.6', fontSize: '0.95rem' },

    portalBtn: (bg) => ({
      width: '100%', padding: '15px', borderRadius: '8px', border: 'none',
      backgroundColor: bg, color: '#fff', fontWeight: 'bold', cursor: 'pointer',
      marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }),
    registerLink: (color) => ({
      textAlign: 'center', marginTop: '15px', fontSize: '0.9rem', color: '#64748b'
    }),
    linkSpan: (color) => ({
      color: color, fontWeight: '700', cursor: 'pointer', marginLeft: '5px'
    }),

    // --- FOOTER ---
    footer: {
      backgroundColor: '#0f172a', color: '#94a3b8', padding: '40px 20px', textAlign: 'center', fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.container}>

      {/* 1. HEADER */}
      <div style={styles.header}>
        <div style={styles.logoSection} onClick={() => scrollToSection('home')}>
          <img src={logo} alt="ES Logo" style={{ height: '10%', width: '10%', borderRadius: '50%', strokeColor: '#ff0000ff', borderWidth: '50%', boxShadow: '0 10px 10px rgba(222, 255, 255, 0.1)', backgroundColor: '#167ac6' }} />
          <span style={styles.logoText}>EventSphere</span>
        </div>

        <div style={styles.navLinks}>
          <span style={styles.navItem} onClick={() => scrollToSection('home')}>Home</span>
          <span style={styles.navItem} onClick={() => scrollToSection('events')}>Events</span>
          <span style={styles.navItem} onClick={() => scrollToSection('workshops')}>Workshops</span>
          <span style={styles.navItem} onClick={() => scrollToSection('about')}>About</span>
        </div>

        <div style={styles.authButtons}>
          <span style={styles.loginLink} onClick={() => navigate('/signin')}>Log in</span>
          <button style={styles.signupBtn} onClick={() => navigate('/signup')}>Sign up free</button>
        </div>

        <div style={styles.mobileMenuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '70px', left: 0, width: '100%', background: '#fff',
          borderBottom: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 999
        }}>
          <span onClick={() => scrollToSection('home')}>Home</span>
          <span onClick={() => scrollToSection('events')}>Events</span>
          <span onClick={() => scrollToSection('workshops')}>Workshops</span>
          <span onClick={() => scrollToSection('about')}>About</span>
          <hr style={{ borderTop: '1px solid #eee' }} />
          <span onClick={() => navigate('/signin')} style={{ fontWeight: 'bold' }}>Log in</span>
          <span onClick={() => navigate('/signup')} style={{ color: '#2563eb', fontWeight: 'bold' }}>Sign up free</span>
        </div>
      )}

      {/* 2. HOME SECTION (Hero) */}
      <div id="home" style={styles.heroSection}>
        <h1 style={styles.heroTitle}>CUSTOMIZED WITH YOU IN MIND</h1>
        <p style={styles.heroSubtitle}>
          Comprehensive event services tailored to impress every time. Manage your college life seamlessly.
        </p>
        <button style={styles.learnMoreBtn} onClick={() => scrollToSection('about')}>Learn More</button>
      </div>

      {/* Blue Strip */}
      <div style={styles.blueStrip}>
        Customized options that are not only what you want — but exactly what you need
      </div>

      {/* Features Grid */}
      <div style={styles.featuresSection}>
        <div style={styles.grid}>
          <div style={styles.featureCard}>
            <div style={styles.iconCircle}><MapPin size={32} /></div>
            <h3 style={styles.featureTitle}>Easy Selection</h3>
            <p style={styles.featureDesc}>Find events by venue, category, or interest with our smart filtering tools.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.iconCircle}><Layers size={32} /></div>
            <h3 style={styles.featureTitle}>Smart Management</h3>
            <p style={styles.featureDesc}>Centralized dashboard for tracking registrations, tickets, and attendance.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.iconCircle}><MousePointer size={32} /></div>
            <h3 style={styles.featureTitle}>Event Logistics</h3>
            <p style={styles.featureDesc}>Seamless workflow from event creation to final certification.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.iconCircle}><Shield size={32} /></div>
            <h3 style={styles.featureTitle}>Secure Data</h3>
            <p style={styles.featureDesc}>Role-based access ensures student and teacher data remains protected.</p>
          </div>
        </div>
        <button style={styles.blueBtn} onClick={() => scrollToSection('events')}>View How It Works</button>
      </div>

      {/* 3. EVENTS SECTION */}
      <div id="events" style={styles.eventsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How to Manage Events</h2>
          <p style={styles.sectionText}>
            EventSphere simplifies the entire lifecycle of an event. Whether you are organizing or attending, we have you covered.
          </p>
        </div>

        <div style={styles.stepsGrid}>
          {/* Step 1 */}
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>01</div>
            <h3 style={styles.stepHeading}>Create & Publish</h3>
            <p style={styles.stepDesc}>
              <strong>Teachers</strong> can use the "Create Event" tool to set dates, venues, and banners. Once published, it instantly appears on the student feed.
            </p>
          </div>
          {/* Step 2 */}
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>02</div>
            <h3 style={styles.stepHeading}>Register & Track</h3>
            <p style={styles.stepDesc}>
              <strong>Students</strong> browse the "Events" tab and click "Register". The request moves to "Pending" status in their "My Tickets" dashboard.
            </p>
          </div>
          {/* Step 3 */}
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>03</div>
            <h3 style={styles.stepHeading}>Approve & Analyze</h3>
            <p style={styles.stepDesc}>
              <strong>Teachers</strong> review the "Registrations" list. Approving a student notifies them instantly and generates their digital ticket.
            </p>
          </div>
        </div>
      </div>

      {/* 4. WORKSHOPS SECTION */}
      <div id="workshops" style={styles.workshopSection}>
        <div style={styles.sectionHeader}>
          <h2 style={{ ...styles.sectionTitle, color: '#fff' }}>Workshops & Training</h2>
          <p style={{ ...styles.sectionText, color: '#94a3b8' }}>
            Did you know? EventSphere isn't just for cultural fests. You can create and join intensive skill-building sessions.
          </p>
        </div>

        <div style={styles.workshopCard}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <BookOpen size={120} color="#38bdf8" opacity={0.8} />
          </div>
          <div style={styles.workshopText}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '15px' }}>Skill Development</h3>
            <p style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
              Workshops are special events focused on learning. They often have limited seats and specific prerequisites.
              Use the "Workshop" category when creating an event to highlight these opportunities.
            </p>
            <ul style={styles.workshopList}>
              <li style={styles.workshopItem}><CheckCircle size={20} color="#38bdf8" /> Hands-on coding bootcamps</li>
              <li style={styles.workshopItem}><CheckCircle size={20} color="#38bdf8" /> Certification seminars</li>
              <li style={styles.workshopItem}><CheckCircle size={20} color="#38bdf8" /> Guest lecture series</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. ABOUT SECTION */}
      <div id="about" style={styles.aboutSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>App Info & Advantages</h2>
          <p style={styles.sectionText}>
            Understand the power of EventSphere for your specific role.
          </p>
        </div>

        <div style={styles.splitView}>

          {/* STUDENT INFO */}
          <div style={styles.roleBox}>
            <div style={{ ...styles.roleTitle, color: '#2563eb' }}>
              <Users size={28} /> Student Portal
            </div>

            <div style={styles.infoBlock}>
              <span style={styles.infoLabel}>How to Control</span>
              <p style={styles.infoText}>
                Log in using your college email. Use the sidebar to navigate between "Events" (to find new things)
                and "My Tickets" (to see what you've signed up for). You can cancel requests if you change your mind.
              </p>
            </div>

            <div style={styles.infoBlock}>
              <span style={styles.infoLabel}>Advantages</span>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={styles.infoText}>No more paper forms.</li>
                <li style={styles.infoText}>Real-time status updates (Pending/Approved).</li>
                <li style={styles.infoText}>Centralized history of all your participation.</li>
              </ul>
            </div>

            <button style={styles.portalBtn('#2563eb')} onClick={() => navigate('/signin')}>
              Student Login <ArrowRight size={18} />
            </button>
            {/* ✅ ADDED: Register as Student Link */}
            <div style={styles.registerLink()}>
              Don't have an account?
              <span style={styles.linkSpan('#2563eb')} onClick={() => navigate('/signup')}>Register as Student</span>
            </div>
          </div>

          {/* TEACHER INFO */}
          <div style={styles.roleBox}>
            <div style={{ ...styles.roleTitle, color: '#f97316' }}>
              <Award size={28} /> Teacher Portal
            </div>

            <div style={styles.infoBlock}>
              <span style={styles.infoLabel}>How to Control</span>
              <p style={styles.infoText}>
                Log in via the dedicated Teacher Portal. Your dashboard gives you a "Create Event" button.
                Use the "Registrations" tab to see a list of students waiting for approval and click "Approve" or "Reject".
              </p>
            </div>

            <div style={styles.infoBlock}>
              <span style={styles.infoLabel}>Advantages</span>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={styles.infoText}>Effortless attendee management.</li>
                <li style={styles.infoText}>Instant visibility of registration counts.</li>
                <li style={styles.infoText}>Ability to edit or cancel events on the fly.</li>
              </ul>
            </div>

            <button style={styles.portalBtn('#f97316')} onClick={() => navigate('/teacher-signin')}>
              Teacher Login <ArrowRight size={18} />
            </button>
            {/* ✅ ADDED: Register as Teacher Link */}
            <div style={styles.registerLink()}>
              New Faculty?
              <span style={styles.linkSpan('#f97316')} onClick={() => navigate('/teacher-signup')}>Register as Teacher</span>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <div style={{ fontWeight: '800', fontSize: '1.5rem', color: '#fff', marginBottom: '10px' }}>EventSphere</div>
        <p>© 2024 EventSphere College Management. All rights reserved.</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '0.8rem' }}>
          <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          <span style={{ cursor: 'pointer' }}>Contact Support</span>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;