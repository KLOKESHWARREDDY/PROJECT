import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, MapPin, Users, Plus, Sun, Moon, ArrowRight, CheckSquare } from 'lucide-react';
import { authAPI, registrationAPI } from '../api';

const TeacherDashboard = ({ user, events, theme, toggleTheme, onLogout }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentUser, setCurrentUser] = useState(user);
  const [imageError, setImageError] = useState(false);
  const [realPendingCount, setRealPendingCount] = useState(0);
  const [loadingRegs, setLoadingRegs] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ FETCH FRESH USER DATA ON MOUNT
  useEffect(() => {
    const fetchLatestUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await authAPI.getProfile();
        
        setCurrentUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.log('Could not fetch latest user data:', error.message);
      }
    };
    
    fetchLatestUserData();
  }, []);

  // ✅ FETCH REAL PENDING REGISTRATION COUNT
  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setRealPendingCount(0);
          setLoadingRegs(false);
          return;
        }
        
        const response = await registrationAPI.getAllPendingRegistrations();
        
        const registrations = response.data || [];
        const pendingCount = registrations.length;
        setRealPendingCount(pendingCount);
      } catch (error) {
        console.log('Error fetching registrations:', error.message);
        setRealPendingCount(0);
      } finally {
        setLoadingRegs(false);
      }
    };
    
    fetchPendingRegistrations();
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

  const recentEvents = events.slice(0, 4); 
  const totalParticipants = events.reduce((sum, event) => sum + (event.registrations || 0), 0);

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
      border: '2px solid #4f46e5',
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
    rightHeader: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: isMobile ? '12px' : '15px' 
    },
    createBtn: { 
      backgroundColor: '#4f46e5', 
      color: '#fff', 
      padding: isMobile ? '12px 20px' : '12px 24px', 
      borderRadius: '50px', 
      border: 'none', 
      fontWeight: 'bold', 
      fontSize: isMobile ? '14px' : '16px', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)', 
      whiteSpace: 'nowrap' 
    },
    iconBtn: { 
      width: isMobile ? '40px' : '50px', 
      height: isMobile ? '40px' : '50px', 
      borderRadius: '50%', 
      backgroundColor: isDark ? '#1e293b' : '#fff', 
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
      color: isDark ? '#fff' : '#64748b', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      cursor: 'pointer', 
      transition: 'transform 0.2s',
      position: 'relative' 
    },
    heroBanner: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      backgroundColor: isDark ? '#312e81' : '#e0e7ff', 
      borderRadius: isMobile ? '20px' : '25px', 
      padding: isMobile ? '20px' : '45px', 
      marginBottom: '40px', 
      position: 'relative', 
      overflow: 'hidden', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
      height: isMobile ? 'auto' : '180px',
      minHeight: isMobile ? '180px' : 'auto'
    },
    heroContent: { maxWidth: isMobile ? '100%' : '500px', zIndex: 2 },
    heroTitle: { 
      fontSize: isMobile ? '24px' : '36px', 
      fontWeight: '800', 
      marginBottom: '12px', 
      color: isDark ? '#fff' : '#1e1b4b', 
      lineHeight: '1.2' 
    },
    heroText: { 
      fontSize: isMobile ? '14px' : '18px', 
      marginBottom: '20px', 
      color: isDark ? '#c7d2fe' : '#4338ca', 
      lineHeight: '1.6' 
    },
    heroBtn: { 
      backgroundColor: '#1e1b4b', 
      color: '#fff', 
      border: 'none', 
      padding: isMobile ? '12px 24px' : '12px 30px', 
      borderRadius: isMobile ? '12px' : '14px', 
      fontWeight: 'bold', 
      fontSize: isMobile ? '14px' : '16px', 
      cursor: 'pointer', 
      boxShadow: '0 4px 12px rgba(30, 27, 75, 0.3)' 
    },
    heroImage: { 
      height: '160px', 
      objectFit: 'contain', 
      display: isMobile ? 'none' : 'block' 
    },
    statsRow: { 
      display: 'flex', 
      gap: isMobile ? '12px' : '30px', 
      marginBottom: '40px', 
      flexWrap: 'wrap' 
    },
    statCard: { 
      flex: 1, 
      minWidth: isMobile ? '150px' : '200px', 
      backgroundColor: isDark ? '#1e293b' : '#fff', 
      padding: isMobile ? '16px' : '24px', 
      borderRadius: isMobile ? '16px' : '20px', 
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
      display: 'flex', 
      alignItems: 'center', 
      gap: isMobile ? '12px' : '20px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)', 
      cursor: 'pointer', 
      transition: 'transform 0.2s' 
    },
    statIconBox: (bg, color) => ({ 
      width: isMobile ? '40px' : '60px', 
      height: isMobile ? '40px' : '60px', 
      borderRadius: isMobile ? '12px' : '16px', 
      backgroundColor: bg, 
      color: color, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
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
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '20px' 
    },
    sectionTitle: { 
      fontSize: isMobile ? '20px' : '24px', 
      fontWeight: 'bold', 
      color: isDark ? '#fff' : '#1e293b' 
    },
    seeAll: { 
      color: '#3b82f6', 
      cursor: 'pointer', 
      fontSize: isMobile ? '14px' : '16px', 
      fontWeight: '600', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px' 
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
      transition: 'all 0.2s', 
      cursor: 'pointer', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)' 
    },
    cardImage: { 
      width: '100%', 
      height: isMobile ? '140px' : '180px', 
      objectFit: 'cover' 
    },
    cardBody: { 
      padding: isMobile ? '16px' : '20px', 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column' 
    },
    cardTitle: { 
      fontSize: isMobile ? '16px' : '18px', 
      fontWeight: 'bold', 
      marginBottom: '8px', 
      color: isDark ? '#fff' : '#1e293b' 
    },
    cardMeta: { 
      fontSize: isMobile ? '12px' : '14px', 
      color: '#64748b', 
      marginBottom: '6px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px' 
    }
  };

  const imageUrl = getImageUrl(currentUser?.profileImage);

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
            <span style={styles.hello}>Welcome,</span>
            <span style={styles.name}>{currentUser?.name || 'Teacher'}</span>
          </div>
        </div>

        <div style={styles.rightHeader}>
          <button style={styles.createBtn} onClick={() => navigate('/create-event')}>
             <Plus size={isMobile ? 16 : 18} /> {isMobile ? "Add" : "Create Event"}
          </button>
          
          <div style={styles.iconBtn} onClick={toggleTheme}>
            {isDark ? <Sun size={isMobile ? 20 : 20} color="#fbbf24" /> : <Moon size={isMobile ? 20 : 20} />}
          </div>
          
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
            <div style={styles.statNumber}>{loadingRegs ? '...' : realPendingCount}</div>
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
                <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ backgroundColor: event.status === 'Active' ? '#dcfce7' : '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: event.status === 'Active' ? '#166534' : '#475569' }}>
                    {event.status}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1' }}>{event.registrations || 0} Students</span>
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
