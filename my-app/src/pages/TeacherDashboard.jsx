import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Calendar, MapPin, Users, Plus, Sun, Moon, ArrowRight, CheckSquare } from 'lucide-react';

const TeacherDashboard = ({ user, events, registrations = [], theme, toggleTheme, onLogout }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const recentEvents = events.slice(0, 4); 
  const totalParticipants = events.reduce((sum, event) => sum + (event.registrations || 0), 0);
  const pendingRegistrations = registrations ? registrations.filter(r => r.status === 'Pending').length : 0;

  const styles = {
    container: { padding: isMobile ? '4vw' : '2vw', backgroundColor: isDark ? '#0f172a' : '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", maxWidth: isMobile ? '100vw' : '95vw', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3vh', flexWrap: 'wrap', gap: isMobile ? '3vw' : '2vw' },
    profileSection: { display: 'flex', alignItems: 'center', gap: isMobile ? '3vw' : '1vw', cursor: 'pointer' },
    avatar: { width: isMobile ? '12vw' : '4vw', height: isMobile ? '12vw' : '4vw', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4f46e5' },
    welcomeText: { display: 'flex', flexDirection: 'column' },
    hello: { fontSize: isMobile ? '3vw' : '0.9vw', color: '#64748b', fontWeight: '500' },
    name: { fontSize: isMobile ? '4.5vw' : '1.2vw', fontWeight: '800', color: isDark ? '#fff' : '#1e293b' },
    rightHeader: { display: 'flex', alignItems: 'center', gap: isMobile ? '3vw' : '1vw' },
    createBtn: { backgroundColor: '#4f46e5', color: '#fff', padding: isMobile ? '1.5vh 4vw' : '1vh 1.5vw', borderRadius: '50px', border: 'none', fontWeight: 'bold', fontSize: isMobile ? '3.5vw' : '0.9vw', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5vw', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)', whiteSpace: 'nowrap' },
    iconBtn: { width: isMobile ? '10vw' : '3.5vw', height: isMobile ? '10vw' : '3.5vw', borderRadius: '50%', backgroundColor: isDark ? '#1e293b' : '#fff', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', color: isDark ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' },
    heroBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDark ? '#312e81' : '#e0e7ff', borderRadius: isMobile ? '4vw' : '1.5vw', padding: isMobile ? '5vw' : '3vw', marginBottom: '4vh', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: isMobile ? 'auto' : '25vh' },
    heroContent: { maxWidth: isMobile ? '100%' : '40vw', zIndex: 2 },
    heroTitle: { fontSize: isMobile ? '6vw' : '2.5vw', fontWeight: '800', marginBottom: '1vh', color: isDark ? '#fff' : '#1e1b4b', lineHeight: '1.2' },
    heroText: { fontSize: isMobile ? '3.5vw' : '1.1vw', marginBottom: '2vh', color: isDark ? '#c7d2fe' : '#4338ca', lineHeight: '1.6' },
    heroBtn: { backgroundColor: '#1e1b4b', color: '#fff', border: 'none', padding: isMobile ? '1.5vh 5vw' : '1vh 2vw', borderRadius: isMobile ? '2vw' : '0.8vw', fontWeight: 'bold', fontSize: isMobile ? '3.5vw' : '1vw', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30, 27, 75, 0.3)' },
    heroImage: { height: '22vh', objectFit: 'contain', display: isMobile ? 'none' : 'block' },
    statsRow: { display: 'flex', gap: isMobile ? '3vw' : '2vw', marginBottom: '4vh', flexWrap: 'wrap' },
    statCard: { flex: 1, minWidth: isMobile ? '40vw' : '15vw', backgroundColor: isDark ? '#1e293b' : '#fff', padding: isMobile ? '4vw' : '2vw', borderRadius: isMobile ? '3vw' : '1.2vw', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: isMobile ? '3vw' : '1.5vw', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'transform 0.2s' },
    statIconBox: (bg, color) => ({ width: isMobile ? '10vw' : '4vw', height: isMobile ? '10vw' : '4vw', borderRadius: isMobile ? '2.5vw' : '1vw', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    statNumber: { fontSize: isMobile ? '5vw' : '1.5vw', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b' },
    statLabel: { color: isDark ? '#cbd5e1' : '#64748b', fontSize: isMobile ? '3vw' : '1vw' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2vh' },
    sectionTitle: { fontSize: isMobile ? '5vw' : '1.5vw', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b' },
    seeAll: { color: '#3b82f6', cursor: 'pointer', fontSize: isMobile ? '3.5vw' : '0.9vw', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5vw' },
    grid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(20vw, 1fr))', gap: isMobile ? '4vw' : '2vw' },
    eventCard: { backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: isMobile ? '3vw' : '1.2vw', overflow: 'hidden', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', transition: 'all 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' },
    cardImage: { width: '100%', height: isMobile ? '25vh' : '18vh', objectFit: 'cover' },
    cardBody: { padding: isMobile ? '4vw' : '1.5vw', flex: 1, display: 'flex', flexDirection: 'column' },
    cardTitle: { fontSize: isMobile ? '4.5vw' : '1.2vw', fontWeight: 'bold', marginBottom: '1vh', color: isDark ? '#fff' : '#1e293b' },
    cardMeta: { fontSize: isMobile ? '3.5vw' : '0.9vw', color: '#64748b', marginBottom: '0.5vh', display: 'flex', alignItems: 'center', gap: '0.5vw' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.profileSection} onClick={() => navigate('/profile')}>
          <img src={user.profileImage} alt="Profile" style={styles.avatar} />
          <div style={styles.welcomeText}>
            <span style={styles.hello}>Welcome,</span>
            <span style={styles.name}>{user.name}</span>
          </div>
        </div>

        <div style={styles.rightHeader}>
          <button style={styles.createBtn} onClick={() => navigate('/create-event')}>
             <Plus size={isMobile ? 16 : 18} /> {isMobile ? "Add" : "Create Event"}
          </button>
          
          <div style={styles.iconBtn} onClick={toggleTheme}>
            {isDark ? <Sun size={isMobile ? 20 : 20} color="#fbbf24" /> : <Moon size={isMobile ? 20 : 20} />}
          </div>
          
          {/* ✅ FIXED: Navigates to Notifications instead of Logout */}
          <div style={styles.iconBtn} onClick={() => navigate('/notifications')}>
            <Bell size={isMobile ? 20 : 20} />
          </div>
        </div>
      </div>

      <div style={styles.heroBanner}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Manage Your Events</h1>
          <p style={styles.heroText}>Create new workshops, track registrations, and engage students.</p>
          <button style={styles.heroBtn} onClick={() => navigate('/create-event')}>+ New Event</button>
        </div>
        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80" alt="Teacher" style={styles.heroImage} />
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard} onClick={() => navigate('/teacher-events')}>
          <div style={styles.statIconBox('#e0e7ff', '#4338ca')}><Calendar size={24} /></div>
          <div>
            <div style={styles.statNumber}>{events.length}</div>
            <div style={styles.statLabel}>My Events</div>
          </div>
        </div>
        <div style={styles.statCard} onClick={() => navigate('/teacher-events')}>
          <div style={styles.statIconBox('#dcfce7', '#15803d')}><Users size={24} /></div>
          <div>
            <div style={styles.statNumber}>{totalParticipants}</div>
            <div style={styles.statLabel}>Total Participants</div>
          </div>
        </div>
        <div style={styles.statCard} onClick={() => navigate('/teacher-registrations')}>
          <div style={styles.statIconBox('#ffedd5', '#c2410c')}><CheckSquare size={24} /></div>
          <div>
            <div style={styles.statNumber}>{pendingRegistrations}</div>
            <div style={styles.statLabel}>New Registrations</div>
          </div>
        </div>
      </div>

      <div>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}>My Events</div>
          <div style={styles.seeAll} onClick={() => navigate('/teacher-events')}>View all <ArrowRight size={16} /></div>
        </div>
        
        <div style={styles.grid}>
          {recentEvents.map(event => (
            <div key={event.id} style={styles.eventCard} onClick={() => navigate(`/teacher-event-details/${event.id}`)}>
              <img src={event.image} alt={event.title} style={styles.cardImage} />
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{event.title}</h3>
                <div style={styles.cardMeta}><Calendar size={16} /> {event.date}</div>
                <div style={styles.cardMeta}><MapPin size={16} /> {event.location}</div>
                <div style={{ marginTop: 'auto', paddingTop: '1vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ backgroundColor: event.status === 'Active' ? '#dcfce7' : '#f1f5f9', padding: '0.4vh 0.8vw', borderRadius: '1vw', fontSize: '0.8vw', fontWeight: '600', color: event.status === 'Active' ? '#166534' : '#475569' }}>
                    {event.status}
                  </span>
                  <span style={{ fontSize: '0.8vw', fontWeight: '600', color: '#6366f1' }}>{event.registrations || 0} Students</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;