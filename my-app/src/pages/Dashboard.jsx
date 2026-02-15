import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Calendar, MapPin, Clock, ArrowRight, Sun, Moon } from 'lucide-react';
import { authAPI, registrationAPI, eventAPI } from '../api';

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

  // Sync user from props when it changes (e.g., after login)
  useEffect(() => {
    if (user && user.name && user.name !== 'Guest') {
      setCurrentUser(user);
      setLoading(false);
    } else {
      // Try to restore from localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.name && parsed.name !== 'Guest') {
            setCurrentUser(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing saved user:', e);
        }
      }
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ FETCH FRESH USER DATA ON MOUNT (only if user exists)
  useEffect(() => {
    // Skip if no user yet
    if (!user || !user.name || user.name === 'Guest') {
      return;
    }
    
    const fetchLatestUserData = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await authAPI.getProfile();
        
        // Merge new data with existing token
        const updatedUser = {
          ...JSON.parse(savedUser),
          ...response.data,
          token: token // Always preserve token
        };
        
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.log('Could not fetch latest user data:', error.message);
      }
    };
    
    fetchLatestUserData();
  }, [user]);

  // ✅ FETCH REAL REGISTRATION COUNT
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setRealRegCount(0);
          setLoadingRegs(false);
          return;
        }
        
        const response = await registrationAPI.getMyRegistrations();
        
        const registrations = response.data || [];
        setRealRegCount(registrations.length);
      } catch (error) {
        console.log('Error fetching registrations:', error.message);
        setRealRegCount(0);
      } finally {
        setLoadingRegs(false);
      }
    };
    
    fetchRegistrations();
  }, []);

  // ✅ FETCH ACTIVE EVENTS FOR STUDENTS
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Student token:", token);
        
        const response = await eventAPI.getAll();
        console.log("Student events response:", response.data);
        
        setStudentEvents(response.data);
      } catch (error) {
        console.log('Error fetching events:', error.message);
        setStudentEvents([]);
      }
    };
    
    fetchEvents();
  }, []);

  // ✅ GET FULL IMAGE URL
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  // ✅ HANDLE IMAGE ERROR
  const handleImageError = () => {
    setImageError(true);
  };

  const styles = {
    container: {
      padding: isMobile ? '16px' : '30px',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      maxWidth: isMobile ? '100vw' : '95vw',
      margin: '0 auto'
    },
    header: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '30px', 
      flexWrap: 'wrap', 
      gap: isMobile ? '12px' : '30px' 
    },
    profileSection: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: isMobile ? '12px' : '15px', 
      cursor: 'pointer' 
    },
    avatar: { 
      width: isMobile ? '48px' : '60px', 
      height: isMobile ? '48px' : '60px', 
      borderRadius: '50%', 
      objectFit: 'cover', 
      border: '2px solid #6366f1',
      backgroundColor: '#f3f4f6'
    },
    welcomeText: { display: 'flex', flexDirection: 'column' },
    hello: { 
      fontSize: isMobile ? '14px' : '16px', 
      color: '#64748b', 
      fontWeight: '500' 
    },
    name: { 
      fontSize: isMobile ? '18px' : '22px', 
      fontWeight: '800', 
      color: isDark ? '#fff' : '#1e293b' 
    },
    rightHeader: { display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '15px' },
    searchContainer: {
      display: 'flex', 
      alignItems: 'center', 
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: '50px', 
      padding: isMobile ? '12px 16px' : '10px 24px', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      width: isMobile ? '40vw' : '25vw',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      display: isMobile ? 'none' : 'flex'
    },
    searchIcon: { color: '#94a3b8', marginRight: '10px', width: '20px' },
    input: { 
      border: 'none', outline: 'none', background: 'transparent', 
      fontSize: '14px', color: isDark ? '#fff' : '#334155', flex: 1, fontWeight: '500' 
    },
    iconBtn: {
      width: isMobile ? '40px' : '50px', 
      height: isMobile ? '40px' : '50px', 
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
      width: '12px', height: '12px', 
      backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #fff' 
    },
    heroBanner: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      backgroundColor: isDark ? '#312e81' : '#e0e7ff',
      borderRadius: isMobile ? '20px' : '25px', 
      padding: isMobile ? '20px' : '45px', 
      marginBottom: '40px', position: 'relative', overflow: 'hidden', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      height: isMobile ? 'auto' : '180px',
      minHeight: isMobile ? '180px' : 'auto'
    },
    heroContent: { maxWidth: isMobile ? '100%' : '500px', zIndex: 2 },
    heroTitle: { 
      fontSize: isMobile ? '24px' : '36px', 
      fontWeight: '800', marginBottom: '12px', 
      color: isDark ? '#fff' : '#1e1b4b', lineHeight: '1.2' 
    },
    heroText: { 
      fontSize: isMobile ? '14px' : '18px', 
      marginBottom: '20px', color: isDark ? '#c7d2fe' : '#4338ca', lineHeight: '1.6' 
    },
    heroBtn: { 
      backgroundColor: '#1e1b4b', color: '#fff', border: 'none', 
      padding: isMobile ? '12px 24px' : '12px 30px', 
      borderRadius: isMobile ? '12px' : '14px', 
      fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px', 
      cursor: 'pointer', boxShadow: '0 4px 12px rgba(30, 27, 75, 0.3)' 
    },
    heroImage: { 
      height: '160px', objectFit: 'contain', 
      display: isMobile ? 'none' : 'block' 
    },
    statsRow: { 
      display: 'flex', gap: isMobile ? '12px' : '30px', marginBottom: '40px', flexWrap: 'wrap' 
    },
    statCard: { 
      flex: 1, minWidth: isMobile ? '150px' : '200px', 
      backgroundColor: isDark ? '#1e293b' : '#fff', 
      padding: isMobile ? '16px' : '24px', 
      borderRadius: isMobile ? '16px' : '20px', 
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
      display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)' 
    },
    statIconBox: (bg, color) => ({ 
      width: isMobile ? '40px' : '60px', 
      height: isMobile ? '40px' : '60px', 
      borderRadius: isMobile ? '12px' : '16px', 
      backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' 
    }),
    statNumber: { 
      fontSize: isMobile ? '20px' : '28px', 
      fontWeight: 'bold', 
      color: isDark ? '#fff' : '#1e293b' 
    },
    statLabel: { 
      color: isDark ? '#cbd5e1' : '#64748b', 
      fontSize: isMobile ? '12px' : '14px' 
    },
    sectionHeader: { 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' 
    },
    sectionTitle: { 
      fontSize: isMobile ? '20px' : '24px', 
      fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b' 
    },
    seeAll: { 
      fontSize: isMobile ? '14px' : '16px', 
      color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' 
    },
    grid: { 
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: isMobile ? '16px' : '30px' 
    },
    eventCard: { 
      backgroundColor: isDark ? '#1e293b' : '#fff', 
      borderRadius: isMobile ? '16px' : '20px', 
      overflow: 'hidden', 
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
      transition: 'all 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)' 
    },
    cardImage: { 
      width: '100%', 
      height: isMobile ? '140px' : '180px', 
      objectFit: 'cover' 
    },
    cardBody: { 
      padding: isMobile ? '16px' : '20px', 
      flex: 1, display: 'flex', flexDirection: 'column' 
    },
    cardTitle: { 
      fontSize: isMobile ? '16px' : '18px', 
      fontWeight: 'bold', marginBottom: '8px', color: isDark ? '#fff' : '#1e293b' 
    },
    cardMeta: { 
      fontSize: isMobile ? '12px' : '14px', 
      color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' 
    }
  };

  const imageUrl = getImageUrl(currentUser?.profileImage);

  // Show loading while user data is being restored
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: isDark ? '#0f172a' : '#f8fafc'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.profileSection} onClick={() => navigate('/profile')}>
          <img 
            src={imageError ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' : imageUrl} 
            alt="Profile" 
            style={styles.avatar}
            onError={handleImageError}
          />
          <div style={styles.welcomeText}>
            <span style={styles.hello}>Welcome back,</span>
            <span style={styles.name}>{currentUser?.name ? currentUser.name.split(' ')[0] : 'User'}</span>
          </div>
        </div>

        <div style={styles.rightHeader}>
          {!isMobile && (
            <div style={styles.searchContainer}>
              <Search style={styles.searchIcon} />
              <input style={styles.input} placeholder="Search events..." />
            </div>
          )}
          
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
          <div style={styles.statIconBox('#e0e7ff', '#4338ca')}><Calendar size={24} /></div>
          <div>
            <div style={styles.statNumber}>{studentEvents.length}</div>
            <div style={styles.statLabel}>Total Events</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIconBox('#dcfce7', '#15803d')}><Clock size={24} /></div>
          <div>
            <div style={styles.statNumber}>{loadingRegs ? '...' : realRegCount}</div>
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
          {studentEvents.slice(0, 3).map(event => (
            <div key={event._id} style={styles.eventCard} onClick={() => {
              console.log("Clicked Event ID:", event.id || event._id);
              navigate(`/events/${event.id || event._id}`);
            }}>
              <img src={event.image} alt={event.title} style={styles.cardImage} />
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{event.title}</h3>
                <div style={styles.cardMeta}><Calendar size={16} /> {event.date.split('·')[0]}</div>
                <div style={styles.cardMeta}><MapPin size={16} /> {event.location}</div>
                <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#475569' }}>{event.category}</span>
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
