import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Calendar, MapPin, Users, Plus, Sun, Moon,
  ArrowRight, CheckSquare, ChevronRight, Zap
} from 'lucide-react';
import { authAPI, registrationAPI, eventAPI } from '../api';
import './TeacherDashboard.css';

const TeacherDashboard = ({ user, events, theme, toggleTheme, onLogout }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [currentUser, setCurrentUser] = useState(user);
  const [imageError, setImageError] = useState(false);
  const [realPendingCount, setRealPendingCount] = useState(0);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [teacherEvents, setTeacherEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* user sync */
  useEffect(() => {
    if (user?.name && user.name !== 'Guest') { setCurrentUser(user); setLoading(false); }
    else {
      const saved = localStorage.getItem('user');
      if (saved) { try { const p = JSON.parse(saved); if (p?.name && p.name !== 'Guest') { setCurrentUser(p); setLoading(false); return; } } catch { } }
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
        setCurrentUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch { }
    })();
  }, [user]);

  /* pending count */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setRealPendingCount(0); setLoadingRegs(false); return; }
        const res = await registrationAPI.getAllPendingRegistrations();
        setRealPendingCount(res.data?.count || 0);
      } catch { setRealPendingCount(0); } finally { setLoadingRegs(false); }
    })();
  }, []);

  /* teacher events */
  useEffect(() => {
    (async () => {
      try {
        const res = await eventAPI.getTeacherEvents();
        setTeacherEvents(res.data || []);
      } catch { setTeacherEvents([]); }
    })();
  }, []);

  const getImageUrl = url => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  const formatDate = d => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  const recentEvents = teacherEvents.slice(0, 4);
  const totalParticipants = teacherEvents.reduce((s, e) => s + (e.registrations || 0), 0);

  if (loading) {
    return <div className="tdb-loading"><div className="tdb-spinner" /></div>;
  }

  const imageUrl = getImageUrl(currentUser?.profileImage);

  return (
    <div className={`tdb-root${isDark ? ' dark' : ''}`}>

      {/* ── STICKY HEADER ── */}
      <header className="tdb-header">
        <div className="tdb-header-left" onClick={() => navigate('/profile')}>
          <div className="tdb-avatar">
            <img
              src={imageError ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : imageUrl}
              alt="Profile"
              onError={() => setImageError(true)}
            />
          </div>
          <div>
            <div className="tdb-hi">Welcome,</div>
            <div className="tdb-name">{currentUser?.name || 'Teacher'}</div>
          </div>
        </div>

        <div className="tdb-header-actions">
          <button className="tdb-create-btn" onClick={() => navigate('/create-event')}>
            <Plus size={15} /> Create Event
          </button>
          <button className="tdb-icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {isDark ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} />}
          </button>
          <button className="tdb-icon-btn" onClick={() => navigate('/notifications')}>
            <Bell size={16} />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="tdb-main">

        {/* Hero Banner */}
        <div className="tdb-hero">
          <div className="tdb-hero-circle1" /><div className="tdb-hero-circle2" />
          <div className="tdb-hero-content">
            <div className="tdb-hero-eyebrow"><Zap size={12} fill="currentColor" /> Teacher Dashboard</div>
            <h2>Manage Your Events</h2>
            <p>Create workshops, track registrations, and engage with your students — all in one place.</p>
            <button className="tdb-hero-btn" onClick={() => navigate('/create-event')}>
              <Plus size={15} /> New Event
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80"
            alt="Teaching"
            className="tdb-hero-img"
          />
        </div>

        {/* ── GLASSMORPHISM STAT CARDS ── */}
        <div className="tdb-stats">
          {[
            { label: 'My Events', value: teacherEvents.length, icon: <Calendar size={20} />, cls: 'tdb-icon-indigo', path: '/teacher-events' },
            { label: 'Total Participants', value: totalParticipants, icon: <Users size={20} />, cls: 'tdb-icon-emerald', path: '/teacher-events' },
            { label: 'Pending Requests', value: loadingRegs ? '…' : realPendingCount, icon: <CheckSquare size={20} />, cls: 'tdb-icon-amber', path: '/teacher-registrations' },
          ].map((s, i) => (
            <div className="tdb-stat-card" key={i} onClick={() => navigate(s.path)}>
              <div className={`tdb-stat-icon ${s.cls}`}>{s.icon}</div>
              <div>
                <div className="tdb-stat-value">{s.value}</div>
                <div className="tdb-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── EVENT CARDS ── */}
        <div className="tdb-card">
          <div className="tdb-card-header">
            <div className="tdb-card-title">
              <Calendar size={15} className="tdb-card-title-icon" /> My Events
            </div>
            <button className="tdb-card-link" onClick={() => navigate('/teacher-events')}>
              View all <ChevronRight size={12} />
            </button>
          </div>

          {recentEvents.length > 0 ? (
            <div className="tdb-events-grid">
              {recentEvents.map(ev => (
                <div
                  key={ev._id || ev.id}
                  className="tdb-event-card"
                  onClick={() => navigate(`/teacher-event-details/${ev._id || ev.id}`)}
                >
                  <div className="tdb-event-img-wrap">
                    <img
                      src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
                      alt={ev.title}
                      className="tdb-event-img"
                    />
                    <div className="tdb-event-overlay" />
                    <span className={`tdb-event-status ${ev.status === 'Active' ? 'tdb-status-active' : 'tdb-status-draft'}`}>
                      {ev.status || 'Draft'}
                    </span>
                  </div>
                  <div className="tdb-event-body">
                    <div className="tdb-event-title">{ev.title}</div>
                    <div className="tdb-event-meta"><Calendar size={12} /> {formatDate(ev.date)}</div>
                    <div className="tdb-event-meta"><MapPin size={12} /> {ev.location || 'TBD'}</div>
                    <div className="tdb-event-foot">
                      <span className="tdb-event-regs">{ev.registrations || 0} Students</span>
                      <ArrowRight size={14} color="#94a3b8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tdb-empty">
              <Calendar size={40} strokeWidth={1.5} />
              <p>No events yet</p>
              <button
                style={{ marginTop: 8, background: '#4f46e5', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                onClick={() => navigate('/create-event')}
              >
                + Create Your First Event
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default TeacherDashboard;
