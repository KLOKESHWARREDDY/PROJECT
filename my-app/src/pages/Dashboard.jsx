import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Calendar, MapPin, Clock, ArrowRight, Sun, Moon } from 'lucide-react';

const Dashboard = ({ user, events, theme, regCount, unreadCount, onReadNotifications, toggleTheme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // 1. RESPONSIVE CHECK
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    // 1. CONTAINER
    container: {
      padding: isMobile ? '4vw' : '2vw', 
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      maxWidth: isMobile ? '100vw' : '95vw',
      margin: '0 auto'
    },
    // HEADER
    header: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '3vh', 
      flexWrap: 'wrap', 
      gap: isMobile ? '3vw' : '2vw' 
    },
    profileSection: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: isMobile ? '3vw' : '1vw', 
      cursor: 'pointer' 
    },
    avatar: { 
      width: isMobile ? '12vw' : '4vw', 
      height: isMobile ? '12vw' : '4vw', 
      borderRadius: '50%', 
      objectFit: 'cover', 
      border: '2px solid #6366f1' 
    },
    welcomeText: { display: 'flex', flexDirection: 'column' },
    hello: { 
      fontSize: isMobile ? '3vw' : '0.9vw', 
      color: '#64748b', 
      fontWeight: '500' 
    },
    name: { 
      fontSize: isMobile ? '4.5vw' : '1.2vw', 
      fontWeight: '800', 
      color: isDark ? '#fff' : '#1e293b' 
    },

    rightHeader: { display: 'flex', alignItems: 'center', gap: isMobile ? '3vw' : '1vw' },
    
    // SEARCH BAR
    searchContainer: {
      display: 'flex', 
      alignItems: 'center', 
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: '50px', 
      padding: isMobile ? '1.5vh 3vw' : '0.8vh 1.5vw', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      width: isMobile ? '40vw' : '25vw', // Wider on mobile relative to icons
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      display: isMobile ? 'none' : 'flex' // Hide search on very small screens if needed, or adjust
    },
    // Mobile Search Icon Button (if hiding full bar)
    mobileSearchBtn: {
      display: isMobile ? 'flex' : 'none',
      width: '10vw', height: '10vw', borderRadius: '50%',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      alignItems: 'center', justifyContent: 'center',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
    },

    searchIcon: { color: '#94a3b8', marginRight: '0.5vw', width: '1.2vw' },
    input: { 
      border: 'none', outline: 'none', background: 'transparent', 
      fontSize: '0.9vw', color: isDark ? '#fff' : '#334155', flex: 1, fontWeight: '500' 
    },

    iconBtn: {
      width: isMobile ? '10vw' : '3.5vw', 
      height: isMobile ? '10vw' : '3.5vw', 
      borderRadius: '50%', 
      backgroundColor: isDark ? '#1e293b' : '#fff',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
      color: isDark ? '#fff' : '#6366f1',
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      cursor: 'pointer', position: 'relative', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s'
    },
    badge: { 
      position: 'absolute', top: '0', right: '0', 
      width: isMobile ? '2.5vw' : '0.8vw', 
      height: isMobile ? '2.5vw' : '0.8vw', 
      backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #fff' 
    },

    // HERO BANNER
    heroBanner: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      backgroundColor: isDark ? '#312e81' : '#e0e7ff',
      borderRadius: isMobile ? '4vw' : '1.5vw', 
      padding: isMobile ? '5vw' : '3vw', 
      marginBottom: '4vh', position: 'relative', overflow: 'hidden', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      height: isMobile ? 'auto' : '25vh',
      minHeight: isMobile ? '25vh' : 'auto'
    },
    heroContent: { maxWidth: isMobile ? '100%' : '40vw', zIndex: 2 },
    heroTitle: { 
      fontSize: isMobile ? '6vw' : '2.5vw', 
      fontWeight: '800', marginBottom: '1vh', 
      color: isDark ? '#fff' : '#1e1b4b', lineHeight: '1.2' 
    },
    heroText: { 
      fontSize: isMobile ? '3.5vw' : '1.1vw', 
      marginBottom: '2vh', color: isDark ? '#c7d2fe' : '#4338ca', lineHeight: '1.6' 
    },
    heroBtn: { 
      backgroundColor: '#1e1b4b', color: '#fff', border: 'none', 
      padding: isMobile ? '1.5vh 5vw' : '1vh 2vw', 
      borderRadius: isMobile ? '2vw' : '0.8vw', 
      fontWeight: 'bold', fontSize: isMobile ? '3.5vw' : '1vw', 
      cursor: 'pointer', boxShadow: '0 4px 12px rgba(30, 27, 75, 0.3)' 
    },
    heroImage: { 
      height: '22vh', objectFit: 'contain', 
      display: isMobile ? 'none' : 'block' // Hide image on mobile to save space
    },

    // STATS ROW
    statsRow: { 
      display: 'flex', gap: isMobile ? '3vw' : '2vw', marginBottom: '4vh', flexWrap: 'wrap' 
    },
    statCard: { 
      flex: 1, minWidth: isMobile ? '40vw' : '15vw', 
      backgroundColor: isDark ? '#1e293b' : '#fff', 
      padding: isMobile ? '4vw' : '2vw', 
      borderRadius: isMobile ? '3vw' : '1.2vw', 
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
      display: 'flex', alignItems: 'center', gap: isMobile ? '3vw' : '1.5vw', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)' 
    },
    statIconBox: (bg, color) => ({ 
      width: isMobile ? '10vw' : '4vw', 
      height: isMobile ? '10vw' : '4vw', 
      borderRadius: isMobile ? '2.5vw' : '1vw', 
      backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' 
    }),
    
    statNumber: { 
      fontSize: isMobile ? '5vw' : '1.5vw', 
      fontWeight: 'bold', 
      color: isDark ? '#fff' : '#1e293b' 
    },
    statLabel: { 
      color: isDark ? '#cbd5e1' : '#64748b', 
      fontSize: isMobile ? '3vw' : '1vw' 
    },
    
    sectionHeader: { 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2vh' 
    },
    sectionTitle: { 
      fontSize: isMobile ? '5vw' : '1.5vw', 
      fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b' 
    },
    seeAll: { 
      fontSize: isMobile ? '3.5vw' : '1vw', 
      color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3vw', fontWeight: '600' 
    },
    
    // GRID
    grid: { 
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(20vw, 1fr))', 
      gap: isMobile ? '4vw' : '2vw' 
    },
    eventCard: { 
      backgroundColor: isDark ? '#1e293b' : '#fff', 
      borderRadius: isMobile ? '3vw' : '1.2vw', 
      overflow: 'hidden', 
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
      transition: 'all 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)' 
    },
    cardImage: { 
      width: '100%', 
      height: isMobile ? '25vh' : '18vh', 
      objectFit: 'cover' 
    },
    cardBody: { 
      padding: isMobile ? '4vw' : '1.5vw', 
      flex: 1, display: 'flex', flexDirection: 'column' 
    },
    cardTitle: { 
      fontSize: isMobile ? '4.5vw' : '1.2vw', 
      fontWeight: 'bold', marginBottom: '1vh', color: isDark ? '#fff' : '#1e293b' 
    },
    cardMeta: { 
      fontSize: isMobile ? '3.5vw' : '0.9vw', 
      color: '#64748b', marginBottom: '0.5vh', display: 'flex', alignItems: 'center', gap: '0.5vw' 
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.profileSection} onClick={() => navigate('/profile')}>
          <img src={user.profileImage} alt="Profile" style={styles.avatar} />
          <div style={styles.welcomeText}>
            <span style={styles.hello}>Welcome back,</span>
            <span style={styles.name}>{user.name.split(' ')[0]}</span>
          </div>
        </div>

        <div style={styles.rightHeader}>
          {/* Desktop Search */}
          {!isMobile && (
            <div style={styles.searchContainer}>
              <Search style={styles.searchIcon} />
              <input style={styles.input} placeholder="Search events..." />
            </div>
          )}
          
          {/* Mobile Search Icon (Placeholder action) */}
          {isMobile && (
            <div style={styles.iconBtn} onClick={() => navigate('/events')}>
               <Search size={20} />
            </div>
          )}
          
          <div style={styles.iconBtn} onClick={toggleTheme} title="Toggle Theme">
            {isDark ? <Sun size={isMobile ? 24 : 20} color="#fbbf24" /> : <Moon size={isMobile ? 24 : 20} />}
          </div>

          <div style={styles.iconBtn} onClick={() => { onReadNotifications(); navigate('/notifications'); }}>
            <Bell size={isMobile ? 24 : 20} />
            {unreadCount > 0 && <div style={styles.badge}></div>}
          </div>
        </div>
      </div>

      <div style={styles.heroBanner}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Discover New Skills!</h1>
          <p style={styles.heroText}>Join workshops, seminars, and events to boost your career.</p>
          <button style={styles.heroBtn} onClick={() => navigate('/events')}>Explore Events</button>
        </div>
        <img src="https://img.freepik.com/free-vector/happy-student-with-graduation-cap-diploma_23-2147954930.jpg?w=740" alt="Student" style={styles.heroImage} />
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statIconBox('#e0e7ff', '#4338ca')}><Calendar size={isMobile ? 24 : 24} /></div>
          <div>
            <div style={styles.statNumber}>{events.length}</div>
            <div style={styles.statLabel}>Total Events</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIconBox('#dcfce7', '#15803d')}><Clock size={isMobile ? 24 : 24} /></div>
          <div>
            <div style={styles.statNumber}>{regCount}</div>
            <div style={styles.statLabel}>Registered</div>
          </div>
        </div>
      </div>

      <div>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}>Upcoming Events</div>
          <div style={styles.seeAll} onClick={() => navigate('/events')}>View all <ArrowRight size={16} /></div>
        </div>
        <div style={styles.grid}>
          {events.slice(0, 3).map(event => (
            <div key={event.id} style={styles.eventCard} onClick={() => navigate(`/event-details/${event.id}`)}>
              <img src={event.image} alt={event.title} style={styles.cardImage} />
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{event.title}</h3>
                <div style={styles.cardMeta}><Calendar size={16} /> {event.date.split('·')[0]}</div>
                <div style={styles.cardMeta}><MapPin size={16} /> {event.location}</div>
                <div style={{ marginTop: 'auto', paddingTop: '1vh' }}>
                  <span style={{ backgroundColor: '#f1f5f9', padding: isMobile ? '1vh 3vw' : '0.4vh 0.8vw', borderRadius: '1vw', fontSize: isMobile ? '3vw' : '0.8vw', fontWeight: '600', color: '#475569' }}>{event.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;