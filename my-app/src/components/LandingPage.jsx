import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BarChart3, Ticket, ShieldCheck, Zap,
  Users, Calendar, Globe, Menu, X, Bell, Lock,
  CheckCircle, BookOpen, Award, TrendingUp, Clock, Database
} from 'lucide-react';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const go = (path) => { navigate(path); setMenuOpen(false); };
  const goTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  const marqueeItems = [
    'Computer Science Dept', 'Electronics Dept', 'Cultural Committee', 'Placement Cell',
    'Sports Club', 'MBA Department', 'Civil Engineering', 'Mechanical Dept',
    'Architecture Dept', 'Student Council', 'Law College', 'Medical School',
    // duplicate for seamless loop
    'Computer Science Dept', 'Electronics Dept', 'Cultural Committee', 'Placement Cell',
    'Sports Club', 'MBA Department', 'Civil Engineering', 'Mechanical Dept',
    'Architecture Dept', 'Student Council', 'Law College', 'Medical School',
  ];

  const features = [
    { icon: <BarChart3 size={22} />, color: 'iIndigo', title: 'Real-Time Analytics', desc: 'Live dashboards showing registrations, attendance trends, and event performance — updated as it happens.' },
    { icon: <Ticket size={22} />, color: 'iGreen', title: 'Smart Ticketing', desc: 'Automated digital tickets generated the moment a faculty member approves a student registration.' },
    { icon: <ShieldCheck size={22} />, color: 'iOrange', title: 'Role-Based Access', desc: 'Dedicated secure portals for students, faculty, and admins. Each sees only what they need.' },
    { icon: <Bell size={22} />, color: 'iPurple', title: 'Instant Notifications', desc: 'Students get real-time alerts on approval, rejection, reminders, and event updates.' },
    { icon: <Lock size={22} />, color: 'iRose', title: 'Approval Workflow', desc: 'Faculty review pending registrations and approve or reject with one click — no emails needed.' },
    { icon: <Database size={22} />, color: 'iCyan', title: 'Centralised Data', desc: 'All events, registrations, and student activity stored in one secure, searchable database.' },
  ];

  const advantages = [
    { icon: <Clock size={22} />, color: 'iIndigo', title: 'Saves Hours of Admin Work', desc: 'No more paper forms, spreadsheets, or manual attendance tracking. Everything runs automatically.' },
    { icon: <Globe size={22} />, color: 'iGreen', title: 'Works for Any College', desc: 'Plug-and-play setup. Any college, any size, any department can start using EventSphere in minutes.' },
    { icon: <TrendingUp size={22} />, color: 'iOrange', title: 'Data-Driven Decisions', desc: 'See which events attract the most students, which departments are most active, and where to grow.' },
    { icon: <CheckCircle size={22} />, color: 'iPurple', title: '100% Paperless Workflow', desc: 'From creation to registration to approval — everything is digital. Eco-friendly and friction-free.' },
    { icon: <Users size={22} />, color: 'iRose', title: 'Better Student Engagement', desc: 'Students discover and join events instantly from any device. Participation rates go up.' },
    { icon: <BookOpen size={22} />, color: 'iCyan', title: 'Full Historical Record', desc: 'Every event and registration is archived. Pull reports, audit trails, or certificates any time.' },
  ];

  const barH = [28, 52, 40, 76, 55, 92, 65, 84, 48];
  const tableRows = [
    { name: 'AI Workshop 2026', n: '48 reg', color: '#4F46E5', s: 'open' },
    { name: 'Tech Cultural Fest', n: '120 reg', color: '#06D6A0', s: 'open' },
    { name: 'Leadership Seminar', n: '32 reg', color: '#F97316', s: 'closed' },
  ];

  return (
    <div className={styles.root}>

      {/* ── NAVBAR ── */}
      <nav className={styles.navbar}>
        <div className={styles.logo} onClick={() => goTo('home')}>
          <div className={styles.logoBadge}><Globe size={18} /></div>
          <span className={styles.logoText}>Event<span className={styles.logoAccent}>Sphere</span></span>
        </div>
        <div className={styles.navLinks}>
          <button className={styles.navLink} onClick={() => goTo('features')}>Features</button>
          <button className={styles.navLink} onClick={() => goTo('advantages')}>Advantages</button>
          <button className={styles.navLink} onClick={() => goTo('how')}>How It Works</button>
          <button className={styles.navLink} onClick={() => goTo('portals')}>Portals</button>
        </div>
        <div className={styles.navRight}>
          <button className={styles.navLogin} onClick={() => go('/signin')}>Log in</button>
          <button className={styles.navCta} onClick={() => go('/signup')}>Get Started Free</button>
        </div>
        <button className={styles.mobileBtn} onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <span onClick={() => goTo('features')}>Features</span>
          <span onClick={() => goTo('advantages')}>Advantages</span>
          <span onClick={() => goTo('how')}>How It Works</span>
          <span onClick={() => go('/signin')}>Log in</span>
          <span onClick={() => go('/signup')} style={{ color: 'var(--p)', fontWeight: 800 }}>Get Started Free →</span>
        </div>
      )}

      {/* ── HERO ── */}
      <header id="home" className={styles.hero}>
        <div className={styles.heroBadge}>
          <div className={styles.badgeDot} />
          Available for Any College · Zero Setup Fee
        </div>

        <h1 className={styles.heroTitle}>
          Your College Deserves a<br />
          <span className={styles.heroGrad}>Smarter Event System.</span>
        </h1>

        <p className={styles.heroSub}>
          EventSphere is a <strong>free, all-in-one campus event platform</strong> that any college can set up in minutes.
          Create events, manage registrations, approve students, and track analytics —
          all without a single paper form.
        </p>

        <div className={styles.heroBtns}>
          <button className={styles.btnPrimary} onClick={() => go('/signup')}>
            Set Up Your College <ArrowRight size={18} />
          </button>
          <button className={styles.btnSecondary} onClick={() => goTo('features')}>
            See All Features
          </button>
        </div>
        <p className={styles.heroNote}>
          <span>✓ Free for all colleges</span> &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Works for any department
        </p>

        {/* Dashboard Mockup */}
        <div className={styles.mockupWrap}>
          <div className={styles.mockup}>
            <div className={styles.mockupChrome}>
              <div className={`${styles.dot} ${styles.dotR}`} />
              <div className={`${styles.dot} ${styles.dotY}`} />
              <div className={`${styles.dot} ${styles.dotG}`} />
              <div className={styles.mockupUrl}>eventsphere.app/dashboard</div>
            </div>
            <div className={styles.mockupBody}>
              <div className={styles.mockupSide}>
                <div className={`${styles.sideItem} ${styles.sideItemOn}`}><div className={styles.sideD} /> Dashboard</div>
                <div className={styles.sideItem}><div className={styles.sideD} /> Events</div>
                <div className={styles.sideItem}><div className={styles.sideD} /> Registrations</div>
                <div className={styles.sideItem}><div className={styles.sideD} /> Students</div>
                <div className={styles.sideItem}><div className={styles.sideD} /> Analytics</div>
                <div className={styles.sideItem}><div className={styles.sideD} /> Settings</div>
              </div>
              <div className={styles.mockupMain}>
                <div className={styles.mockupStats}>
                  <div className={styles.mStat}><div className={styles.mStatLbl}>My Events</div><div className={styles.mStatVal}>48</div><div className={styles.mStatTag}>↑ 12 this month</div></div>
                  <div className={styles.mStat}><div className={styles.mStatLbl}>Total Registrations</div><div className={styles.mStatVal}>1,284</div><div className={styles.mStatTag}>↑ 24% growth</div></div>
                  <div className={styles.mStat}><div className={styles.mStatLbl}>Pending Approvals</div><div className={styles.mStatVal}>18</div><div className={styles.mStatTag}>Needs review</div></div>
                </div>
                <div className={styles.mockupTable}>
                  <div className={styles.mTblHead}>Recent Events</div>
                  {tableRows.map(r => (
                    <div key={r.name} className={styles.mTblRow}>
                      <div className={styles.mTblDot} style={{ background: r.color }} />
                      <div className={styles.mTblName}>{r.name}</div>
                      <div className={styles.mTblNum}>{r.n}</div>
                      <div className={`${styles.mTblStatus} ${r.s === 'open' ? styles.statusOpen : styles.statusClosed}`}>{r.s}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.mockupGlow} />
        </div>
      </header>

      {/* ── MARQUEE TRUSTED BY ── */}
      <section className={styles.marqueeWrap}>
        <div className={styles.marqueeLabel}>Used by departments across colleges everywhere</div>
        <div className={styles.marqueeTrack}>
          {marqueeItems.map((d, i) => <span key={i} className={styles.marqueeItem}>✦ {d}</span>)}
        </div>
      </section>

      {/* ── STATS ── */}
      <div className={styles.statsSection}>
        {[
          { n: 'Any College', d: 'Can Use EventSphere — For Free' },
          { n: '< 10 sec', d: 'Registration Time Per Student' },
          { n: '100%', d: 'Paperless & Digital Workflow' },
          { n: '3 Roles', d: 'Student · Teacher · Admin' },
        ].map(s => (
          <div key={s.n} className={styles.statBox}>
            <div className={styles.statNum}>{s.n}</div>
            <div className={styles.statDesc}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionCenter}>
          <div className={styles.tag}><Zap size={13} /> Platform Features</div>
          <h2 className={styles.h2}>Everything your campus needs.</h2>
          <p className={styles.sub}>
            Powerful, thoughtfully designed tools that make life easier for every stakeholder on campus.
          </p>
        </div>
        <div className={styles.featGrid}>
          {features.map(f => (
            <div key={f.title} className={styles.featCard}>
              <div className={`${styles.featIcon} ${styles[f.color]}`}>{f.icon}</div>
              <h3 className={styles.featTitle}>{f.title}</h3>
              <p className={styles.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ADVANTAGES ── */}
      <section id="advantages" className={styles.advSection}>
        <div className={styles.sectionCenter}>
          <div className={styles.tag}><TrendingUp size={13} /> Why EventSphere?</div>
          <h2 className={styles.h2}>Real advantages. Real impact.</h2>
          <p className={styles.sub}>
            From saving admin hours to boosting student participation, here's how EventSphere transforms your campus.
          </p>
        </div>
        <div className={styles.advGrid}>
          {advantages.map(a => (
            <div key={a.title} className={styles.advCard}>
              <div className={`${styles.advIcon} ${styles[a.color]}`}>{a.icon}</div>
              <div>
                <div className={styles.advTitle}>{a.title}</div>
                <div className={styles.advDesc}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className={styles.howSection}>
        <div className={styles.sectionCenter}>
          <div className={styles.tag}><Calendar size={13} /> Simple Workflow</div>
          <h2 className={styles.h2}>Up and running in minutes.</h2>
          <p className={styles.sub}>
            Any college can go from sign-up to a live event in three easy steps.
          </p>
        </div>
        <div className={styles.stepsRow}>
          {[
            { n: '1', title: 'Set Up Your College', desc: "Register your college, create department accounts, and onboard teachers in under 5 minutes. No IT team needed." },
            { n: '2', title: 'Create & Publish Events', desc: "Teachers create events with dates, venues, banners, and capacity. Published instantly to the student feed." },
            { n: '3', title: 'Students Register & Get Tickets', desc: "Students browse, register, and receive digital tickets. Teachers approve with one click. Everyone stays updated." },
          ].map(s => (
            <div key={s.n} className={styles.stepBox}>
              <div className={styles.stepNum}>{s.n}</div>
              <div className={styles.stepTitle}>{s.title}</div>
              <div className={styles.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLE PORTALS ── */}
      <section id="portals" className={styles.rolesSection}>
        <div className={styles.sectionCenter}>
          <div className={styles.tag}><Users size={13} /> Role-Based Portals</div>
          <h2 className={styles.h2}>A perfect experience for every role.</h2>
          <p className={styles.sub}>
            Every user gets a tailored, distraction-free dashboard built exactly for their needs.
          </p>
        </div>
        <div className={styles.rolesGrid}>
          {/* Student */}
          <div className={styles.roleCard}>
            <div className={styles.roleHead}>
              <div className={`${styles.roleIconCircle} ${styles.iIndigo}`}><Users size={22} /></div>
              <div className={styles.roleName}>Students</div>
            </div>
            <ul className={styles.roleList}>
              {['Browse & discover all campus events', 'Register for events in one click', 'Track approval status in real time', 'Download and view digital tickets', 'View full registration history'].map(item => (
                <li key={item}>
                  <div className={`${styles.roleCheckIcon} ${styles.iIndigo}`}>✓</div>
                  {item}
                </li>
              ))}
            </ul>
            <button className={`${styles.roleBtn} ${styles.iIndigo}`} style={{ boxShadow: '0 10px 24px rgba(79,70,229,.28)' }} onClick={() => go('/signup')}>
              Student Sign Up <ArrowRight size={16} />
            </button>
          </div>

          {/* Faculty */}
          <div className={styles.roleCard}>
            <div className={styles.roleHead}>
              <div className={`${styles.roleIconCircle} ${styles.iOrange}`}><Award size={22} /></div>
              <div className={styles.roleName}>Faculty / Staff</div>
            </div>
            <ul className={styles.roleList}>
              {['Create & publish events instantly', 'Manage registrations & approvals', 'Send bulk notifications to students', 'View live analytics & attendance', 'Export student lists for records'].map(item => (
                <li key={item}>
                  <div className={`${styles.roleCheckIcon} ${styles.iOrange}`}>✓</div>
                  {item}
                </li>
              ))}
            </ul>
            <button className={`${styles.roleBtn} ${styles.iOrange}`} style={{ boxShadow: '0 10px 24px rgba(249,115,22,.28)' }} onClick={() => go('/teacher-signin')}>
              Faculty Portal <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>
            Ready to modernize<br />your campus events?
          </h2>
          <p className={styles.ctaP}>
            Free for every college. No credit card. Full access from day one.
          </p>
          <div className={styles.ctaBtns}>
            <button className={styles.ctaWhiteBtn} onClick={() => go('/signup')}>
              Set Up Your College — It's Free
            </button>
            <button className={styles.ctaGhostBtn} onClick={() => go('/signin')}>
              Log In <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div>
          <div className={styles.footerBrand}>Event<span style={{ color: 'var(--p)' }}>Sphere</span></div>
          <div className={styles.footerTag}>
            The smart campus event platform — built for every college, every department, every student.
          </div>
        </div>

        <div className={styles.footerCol}>
          <div className={styles.footerColTitle}>Product</div>
          <button className={styles.fLink} onClick={() => goTo('features')}>Features</button>
          <button className={styles.fLink} onClick={() => goTo('advantages')}>Advantages</button>
          <button className={styles.fLink} onClick={() => goTo('how')}>How It Works</button>
          <button className={styles.fLink} onClick={() => goTo('portals')}>Portals</button>
        </div>

        <div className={styles.footerCol}>
          <div className={styles.footerColTitle}>For Students</div>
          <button className={styles.fLink} onClick={() => go('/events')}>Browse Events</button>
          <button className={styles.fLink} onClick={() => go('/signup')}>Create Account</button>
          <button className={styles.fLink} onClick={() => go('/signin')}>Student Login</button>
        </div>

        <div className={styles.footerCol}>
          <div className={styles.footerColTitle}>For Faculty</div>
          <button className={styles.fLink} onClick={() => go('/teacher-signin')}>Faculty Login</button>
          <button className={styles.fLink} onClick={() => go('/teacher-signup')}>Faculty Register</button>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerCopy}>© 2026 EventSphere — Open for every college.</div>
          <div className={styles.footerBadge}><Zap size={12} /> Built with purpose</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;