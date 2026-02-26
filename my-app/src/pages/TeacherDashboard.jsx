import React, { useState, useEffect } from 'react';
import { eventAPI, registrationAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';

/* ── Icons ─────────────────────────────────────────── */
const IconCalendar = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconPeople = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconCheck = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6m-6 8l2 2 4-4" />
  </svg>
);
const IconBell = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M15 17H20L18.59 15.59A1 1 0 0118 14.83V11a6 6 0 10-12 0v3.83a1 1 0 01-.29.71L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
  </svg>
);
const IconMoon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const IconSun = () => (
  <svg width="17" height="17" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const IconPlus = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconDate = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconPin = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconArrow = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M9 5l7 7-7 7" />
  </svg>
);
const IconStudents = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

/* ── Event Card ────────────────────────────────────── */
const EventCard = ({ event, onClick }) => {
  const imageUrl = event.coverImage || event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80';
  const studentCount = event.registeredStudents?.length || event.students || 0;
  let formattedDate = event.date;
  try {
    if (event.date) {
      formattedDate = new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  } catch (e) { }

  return (
    <article className="event-card" onClick={onClick}>
      <div className="card-image-wrap">
        <img src={imageUrl} alt={event.title} className="card-image" />
        <span className={`status-badge status-badge--${event.status}`}>
          {event.status === 'published' ? '● Published' : '● Draft'}
        </span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{event.title}</h3>
        <div className="card-meta">
          <p className="card-meta-item">
            <IconDate /><span>{formattedDate}</span>
          </p>
          <p className="card-meta-item">
            <IconPin /><span>{event.location}</span>
          </p>
        </div>
      </div>

      <div className="card-footer">
        <span className="card-students">
          <IconStudents />
          {studentCount} Students
        </span>
        <span className="card-arrow">
          <IconArrow />
        </span>
      </div>
    </article>
  );
};

/* ── Main Component ────────────────────────────────── */
const TeacherDashboard = ({ user, theme, toggleTheme }) => {
  const isDark = theme === 'dark';
  const displayName = user?.name?.split(' ')[0] || 'Teacher';
  const [stats, setStats] = useState({ totalEvents: 0, totalParticipants: 0, pendingRequests: 0 });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch teacher's events and pending registrations concurrently
        const [eventsRes, pendingRes] = await Promise.all([
          eventAPI.getTeacherEvents(),
          registrationAPI.getAllPendingRegistrations().catch(() => ({ data: { count: 0 } }))
        ]);

        const fetchedEvents = eventsRes.data || [];
        setEvents(fetchedEvents);

        // Calculate stats
        const totalEvents = fetchedEvents.length;
        const totalParticipants = fetchedEvents.reduce((acc, ev) => acc + (ev.registeredStudents?.length || 0), 0);
        const pendingRequests = pendingRes.data?.count || 0;

        setStats({ totalEvents, totalParticipants, pendingRequests });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`td-root${isDark ? ' td-dark' : ''}`}>

      {/* ── TOP NAV ──────────────────────────────── */}
      <nav className="td-nav">
        <div
          className="td-nav__left"
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer' }}
          title="Go to Profile"
        >
          {user?.profileImage ? (
            <img src={user.profileImage} alt={displayName} className="td-avatar" style={{ objectFit: 'cover' }} />
          ) : (
            <div className="td-avatar">{displayName.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <p className="td-nav__greeting">Welcome back,</p>
            <p className="td-nav__name">{displayName}</p>
          </div>
        </div>

        <div className="td-nav__right">
          <button className="td-icon-btn" title="Notifications" onClick={() => navigate('/notifications')}>
            {stats.pendingRequests > 0 && <span className="td-notif-dot"></span>}
            <IconBell />
          </button>
          <button className="td-icon-btn" title="Toggle Dark Mode" onClick={toggleTheme || (() => { })}>
            {isDark ? <IconSun /> : <IconMoon />}
          </button>
          <button className="td-btn-primary" onClick={() => navigate('/create-event')}>
            <IconPlus />
            Create Event
          </button>
        </div>
      </nav>

      {/* ── PAGE CONTENT ─────────────────────────── */}
      <div className="td-page">

        {/* ── HERO ─────────────────────────────── */}
        <section className="td-hero">
          <div className="td-hero__content">
            <p className="td-hero__eyebrow">Teacher Dashboard</p>
            <h1 className="td-hero__title">Manage Your Events</h1>
            <p className="td-hero__subtitle">
              Create workshops, track registrations, and engage with your students — all in one place.
            </p>
            <button className="td-btn-white" onClick={() => navigate('/create-event')}>
              <IconPlus />
              New Event
            </button>
          </div>

          {/* Abstract SVG illustration */}
          <div className="td-hero__illustration" aria-hidden="true">
            <svg width="260" height="200" viewBox="0 0 260 200" fill="none">
              <rect x="50" y="20" width="160" height="108" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              <rect x="58" y="28" width="144" height="92" rx="6" fill="rgba(255,255,255,0.07)" />
              <rect x="68" y="42" width="75" height="7" rx="3.5" fill="rgba(255,255,255,0.55)" />
              <rect x="68" y="54" width="50" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
              <rect x="68" y="68" width="120" height="3" rx="1.5" fill="rgba(255,255,255,0.15)" />
              <rect x="68" y="76" width="95" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
              <rect x="68" y="84" width="108" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
              <rect x="148" y="50" width="11" height="32" rx="3" fill="rgba(167,139,250,0.65)" />
              <rect x="163" y="60" width="11" height="22" rx="3" fill="rgba(196,181,253,0.5)" />
              <rect x="178" y="44" width="11" height="38" rx="3" fill="rgba(167,139,250,0.7)" />
              <rect x="118" y="128" width="4" height="18" rx="2" fill="rgba(255,255,255,0.2)" />
              <rect x="100" y="144" width="60" height="5" rx="2.5" fill="rgba(255,255,255,0.15)" />
              <rect x="4" y="42" width="54" height="38" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <circle cx="16" cy="58" r="7" fill="rgba(196,181,253,0.55)" />
              <rect x="27" y="53" width="24" height="4" rx="2" fill="rgba(255,255,255,0.45)" />
              <rect x="27" y="61" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.28)" />
              <rect x="202" y="36" width="56" height="40" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <rect x="212" y="48" width="36" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
              <rect x="212" y="56" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.28)" />
              <rect x="212" y="63" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.18)" />
              <circle cx="206" cy="158" r="13" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
              <line x1="206" y1="152" x2="206" y2="164" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
              <line x1="200" y1="158" x2="212" y2="158" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="26" cy="162" r="3" fill="rgba(255,255,255,0.35)" />
              <circle cx="236" cy="130" r="2.5" fill="rgba(255,255,255,0.3)" />
              <circle cx="44" cy="122" r="2" fill="rgba(255,255,255,0.25)" />
            </svg>
          </div>
        </section>

        {/* ── STATS ──────────────────────────────── */}
        <div className="td-stats">
          <div className="td-stat-card">
            <div className="td-stat-icon td-stat-icon--indigo"><IconCalendar /></div>
            <div>
              <p className="td-stat-value">{stats.totalEvents}</p>
              <p className="td-stat-label">My Events</p>
            </div>
          </div>
          <div className="td-stat-card">
            <div className="td-stat-icon td-stat-icon--blue"><IconPeople /></div>
            <div>
              <p className="td-stat-value">{stats.totalParticipants}</p>
              <p className="td-stat-label">Total Participants</p>
            </div>
          </div>
          <div className="td-stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/teacher-registrations')}>
            <div className="td-stat-icon td-stat-icon--amber"><IconCheck /></div>
            <div>
              <p className="td-stat-value">{stats.pendingRequests}</p>
              <p className="td-stat-label">Pending Requests</p>
            </div>
          </div>
        </div>

        {/* ── EVENTS SECTION ─────────────────────── */}
        <section className="td-events-section">
          <div className="td-section-header">
            <div>
              <h2 className="td-section-title">My Events</h2>
              <p className="td-section-sub">Manage and track all your upcoming events</p>
            </div>
            <a href="#" className="td-view-all" onClick={(e) => { e.preventDefault(); navigate('/teacher-events'); }}>View all <IconArrow /></a>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading events...</div>
          ) : events.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <IconCalendar />
              <p style={{ marginTop: '12px', fontWeight: '600' }}>No events found</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>You haven't created any events yet.</p>
              <button className="td-btn-primary" style={{ margin: '0 auto' }} onClick={() => navigate('/create-event')}>Create your first event</button>
            </div>
          ) : (
            <div className="td-events-grid">
              {events.slice(0, 4).map(ev => <EventCard key={ev._id || ev.id} event={ev} onClick={() => navigate(`/teacher-event-details/${ev._id || ev.id}`)} />)}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default TeacherDashboard;
