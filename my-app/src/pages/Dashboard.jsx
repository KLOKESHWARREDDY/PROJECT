import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Calendar, MapPin, Clock,
  ArrowRight, Sun, Moon, TrendingUp,
  CheckCircle, Users, Zap, ChevronRight
} from 'lucide-react';
import { authAPI, registrationAPI, eventAPI } from '../api';
import './Dashboard.css';

/* ─── Mini Calendar ─── */
const MiniCalendar = ({ isDark }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="db-calendar">
      <div className="db-cal-month">{MONTHS[month]} {year}</div>
      <div className="db-cal-grid">
        {DAYS.map(d => <div key={d} className="db-cal-dayname">{d}</div>)}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`db-cal-day${!d ? ' db-cal-day-empty' : ''}${d === today ? ' db-cal-day-today' : ''}`}
          >
            {d || ''}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Status Badge ─── */
const StatusBadge = ({ status }) => {
  const cls = { pending: 'db-badge-pending', approved: 'db-badge-approved', rejected: 'db-badge-rejected' };
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
  return <span className={cls[status] || 'db-badge-pending'}>{label}</span>;
};

/* ─── Dashboard ─── */
const Dashboard = ({ user, events, theme, unreadCount, onReadNotifications, toggleTheme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentUser, setCurrentUser] = useState(user);
  const [imageError, setImageError] = useState(false);
  const [realRegCount, setRealRegCount] = useState(0);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [studentEvents, setStudentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentRegs, setRecentRegs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  /* resize */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* user sync */
  useEffect(() => {
    if (user?.name && user.name !== 'Guest') {
      setCurrentUser(user); setLoading(false);
    } else {
      const saved = localStorage.getItem('user');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (p?.name && p.name !== 'Guest') { setCurrentUser(p); setLoading(false); return; }
        } catch { }
      }
      setLoading(false);
    }
  }, [user]);

  /* fresh profile */
  useEffect(() => {
    if (!user?.name || user.name === 'Guest') return;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await authAPI.getProfile();
        const updated = { ...JSON.parse(localStorage.getItem('user') || '{}'), ...res.data, token };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      } catch { }
    })();
  }, [user]);

  /* registrations */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setRealRegCount(0); setLoadingRegs(false); return; }
        const res = await registrationAPI.getMyRegistrations();
        const regs = res.data || [];
        setRealRegCount(regs.length);
        setRecentRegs(regs.slice(0, 6));
      } catch { setRealRegCount(0); } finally { setLoadingRegs(false); }
    })();
  }, []);

  /* events */
  useEffect(() => {
    (async () => {
      try {
        const res = await eventAPI.getAll();
        setStudentEvents(res.data || []);
      } catch { setStudentEvents([]); }
    })();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try { return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return dateStr; }
  };

  const upcomingEvents = studentEvents.filter(e => new Date(e.date) >= new Date()).slice(0, 4);

  const filteredEvents = studentEvents
    .filter(e => e.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="db-loading">
        <div className="db-spinner" />
      </div>
    );
  }

  const imageUrl = getImageUrl(currentUser?.profileImage);
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Student';

  return (
    <div className={`db-root${isDark ? ' db-dark' : ''}`}>

      {/* ── STICKY HEADER ── */}
      <header className="db-header">
        <div className="db-header-greeting">
          <div className="db-header-hi">Welcome back,</div>
          <div className="db-header-name">{firstName}</div>
        </div>

        {!isMobile && (
          <div className="db-search-wrap">
            <Search size={15} className="db-search-icon" />
            <input
              className="db-search-input"
              placeholder="Search events…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div className="db-header-actions">
          {isMobile && (
            <button className="db-icon-btn" onClick={() => navigate('/events')}>
              <Search size={16} />
            </button>
          )}
          <button className="db-icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {isDark ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} />}
          </button>
          <button
            className="db-icon-btn"
            onClick={() => { onReadNotifications?.(); navigate('/notifications'); }}
          >
            <Bell size={16} />
            {unreadCount > 0 && <span className="db-badge" />}
          </button>
          <button className="db-avatar-btn" onClick={() => navigate('/profile')}>
            <img
              src={imageError ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : imageUrl}
              alt="Profile"
              onError={() => setImageError(true)}
            />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="db-main">

        {/* Hero banner */}
        <div className="db-hero">
          <div className="db-hero-circle1" />
          <div className="db-hero-circle2" />
          <div className="db-hero-eyebrow">
            <Zap size={12} fill="currentColor" /> Student Dashboard
          </div>
          <h2>Discover your next<br />big opportunity 🚀</h2>
          <p>Explore seminars, hackathons, and skill-building sessions tailored for your growth.</p>
          <button className="db-hero-btn" onClick={() => navigate('/events')}>
            Explore Events <ArrowRight size={14} />
          </button>
        </div>

        {/* ── GLASSMORPHISM STAT CARDS ── */}
        <div className="db-stats-row">
          {[
            { label: 'Total Events', value: studentEvents.length, icon: <Calendar size={18} />, cls: 'db-stat-icon-indigo' },
            { label: 'Registered', value: loadingRegs ? '—' : realRegCount, icon: <CheckCircle size={18} />, cls: 'db-stat-icon-emerald' },
            { label: 'Upcoming', value: upcomingEvents.length, icon: <TrendingUp size={18} />, cls: 'db-stat-icon-violet' },
          ].map((s, i) => (
            <div className="db-stat-card" key={i}>
              <div className={`db-stat-icon ${s.cls}`}>{s.icon}</div>
              <div>
                <div className="db-stat-value">{s.value}</div>
                <div className="db-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CALENDAR + UPCOMING EVENTS ── */}
        <div className="db-widget-row">

          {/* Mini Calendar */}
          <div className="db-card">
            <div className="db-card-header">
              <div className="db-card-title">
                <Calendar size={15} className="db-card-title-icon" /> Calendar
              </div>
            </div>
            <MiniCalendar isDark={isDark} />
          </div>

          {/* Upcoming Events */}
          <div className="db-card">
            <div className="db-card-header">
              <div className="db-card-title">
                <Clock size={15} className="db-card-title-icon" /> Upcoming Events
              </div>
              <button className="db-card-link" onClick={() => navigate('/events')}>
                View all <ChevronRight size={12} />
              </button>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="db-upcoming-list">
                {upcomingEvents.map((ev, i) => (
                  <div
                    key={ev._id || i}
                    className="db-upcoming-item"
                    onClick={() => navigate(`/events/${ev._id || ev.id}`)}
                  >
                    <div className="db-upcoming-day-badge">
                      {ev.date ? new Date(ev.date).getDate() : '?'}
                    </div>
                    <div className="db-upcoming-info">
                      <div className="db-upcoming-title">{ev.title}</div>
                      <div className="db-upcoming-meta">
                        <MapPin size={11} />
                        {ev.location || 'TBD'}
                      </div>
                    </div>
                    <div className="db-upcoming-date">{formatDate(ev.date)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="db-empty">
                <Calendar size={34} strokeWidth={1.5} />
                <p>No upcoming events</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RECENT REGISTRATIONS TABLE ── */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <Users size={15} className="db-card-title-icon" /> Recent Registrations
            </div>
            <button className="db-card-link" onClick={() => navigate('/my-events')}>
              View all <ChevronRight size={12} />
            </button>
          </div>

          {recentRegs.length > 0 ? (
            <div className="db-reg-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegs.map((reg, i) => (
                    <tr key={reg._id || i} onClick={() => navigate('/my-events')}>
                      <td>
                        <div className="db-table-event-cell">
                          {reg.event?.image && (
                            <img src={reg.event.image} alt="" className="db-table-event-img" />
                          )}
                          <span className="db-table-event-name">{reg.event?.title || 'Event'}</span>
                        </div>
                      </td>
                      <td>{formatDate(reg.event?.date)}</td>
                      <td>{reg.event?.location || '—'}</td>
                      <td><StatusBadge status={reg.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="db-empty">
              <CheckCircle size={36} strokeWidth={1.5} />
              <p>No registrations yet</p>
              <span>Register for events to see them here</span>
              <button className="db-empty-btn" onClick={() => navigate('/events')}>Browse Events</button>
            </div>
          )}
        </div>

        {/* ── EVENT CARDS GRID ── */}
        <div>
          <div className="db-events-header">
            <h3 className="db-events-title">
              {searchTerm ? `Results for "${searchTerm}"` : 'All Events'}
            </h3>
            <button className="db-card-link" onClick={() => navigate('/events')}>
              See all <ArrowRight size={13} />
            </button>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="db-events-grid">
              {filteredEvents.map(ev => (
                <div
                  key={ev._id}
                  className="db-event-card"
                  onClick={() => navigate(`/events/${ev._id || ev.id}`)}
                >
                  <div className="db-event-img-wrap">
                    <img
                      src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
                      alt={ev.title}
                      className="db-event-img"
                    />
                    <div className="db-event-img-overlay" />
                    {ev.category && (
                      <span className="db-event-category">{ev.category}</span>
                    )}
                  </div>
                  <div className="db-event-body">
                    <div className="db-event-title">{ev.title}</div>
                    <div className="db-event-meta">
                      <Calendar size={12} /> {formatDate(ev.date)}
                    </div>
                    <div className="db-event-meta">
                      <MapPin size={12} /> {ev.location || 'TBD'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="db-card">
              <div className="db-empty">
                <Calendar size={40} strokeWidth={1.5} />
                <p>No events found</p>
                {searchTerm && <span>Try a different search term</span>}
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
