import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, MapPin, Users, Plus, Sun, Moon, ArrowRight, CheckSquare } from 'lucide-react';
import { authAPI, registrationAPI, eventAPI } from '../api';

const TeacherDashboard = ({ user, events, theme, toggleTheme, onLogout, isExpanded = true }) => {
  const navigate = useNavigate();
  const isDark = ['dark', 'purple-gradient', 'blue-ocean', 'midnight-dark', 'emerald-dark', 'cherry-dark', 'slate-minimal'].includes(theme);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentUser, setCurrentUser] = useState(user);
  const [imageError, setImageError] = useState(false);
  const [realPendingCount, setRealPendingCount] = useState(0);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [teacherEvents, setTeacherEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

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
  }, [user]);

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

        // Backend returns { count: number }
        const pendingCount = response.data?.count || 0;
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

  // ✅ FETCH TEACHER'S OWN EVENTS
  useEffect(() => {
    const fetchTeacherEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Teacher token:", token);

        const response = await eventAPI.getTeacherEvents();
        console.log("Teacher events response:", response.data);

        setTeacherEvents(response.data);
      } catch (error) {
        console.log('Error fetching teacher events:', error.message);
        setTeacherEvents([]);
      }
    };

    fetchTeacherEvents();
  }, []);

  // ✅ GET FULL IMAGE URL
  const getImageUrl = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  // ✅ HANDLE IMAGE ERROR
  const handleImageError = () => {
    setImageError(true);
  };

  const recentEvents = teacherEvents.slice(0, 4);
  const totalParticipants = teacherEvents.reduce((sum, event) => sum + (event.registrations || 0), 0);

  const styles = {
    container: {
      padding: '0',
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      transition: 'background-color 0.3s ease'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: 'var(--card-bg)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease'
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
      borderRadius: '16px',
      objectFit: 'cover',
      border: '2px solid transparent',
      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #2563EB, #7C3AED)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'content-box, border-box',
      backgroundColor: 'var(--bg-tertiary)'
    },
    welcomeText: { display: 'flex', flexDirection: 'column' },
    hello: {
      fontSize: isMobile ? '14px' : '16px',
      color: 'var(--text-secondary)',
      fontWeight: '500'
    },
    name: {
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: '800',
      color: 'var(--text-primary)'
    },
    rightHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '12px' : '15px'
    },
    createBtn: {
      background: isDark ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
      color: '#fff',
      padding: isMobile ? '12px 20px' : '12px 24px',
      borderRadius: '12px',
      border: 'none',
      fontWeight: 'bold',
      fontSize: isMobile ? '14px' : '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: isDark ? '0 4px 14px rgba(139, 92, 246, 0.4)' : '0 4px 14px rgba(37, 99, 235, 0.3)',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: isDark ? '0 6px 20px rgba(139, 92, 246, 0.6)' : '0 6px 20px rgba(37, 99, 235, 0.5)'
      }
    },
    iconBtn: {
      cursor: 'pointer',
      color: 'var(--text-secondary)',
      transition: 'color 0.2s',
      ':hover': { color: 'var(--primary-color)' }
    },
    mainContent: {
      padding: isMobile ? '24px' : '40px 32px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    },
    heroBanner: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      background: isDark ? 'linear-gradient(135deg, #1E3A8A, #4C1D95)' : 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(124, 58, 237, 0.05))',
      border: `1px solid var(--border-color)`,
      borderRadius: '16px',
      padding: isMobile ? '32px 24px' : '64px 48px',
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(37, 99, 235, 0.05)',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)'
    },
    heroContent: { width: '100%', zIndex: 2, maxWidth: '800px' },
    heroTitle: {
      fontSize: isMobile ? '28px' : '40px',
      fontWeight: '800',
      marginBottom: '16px',
      color: 'var(--text-primary)',
      lineHeight: '1.2'
    },
    heroText: {
      fontSize: isMobile ? '14px' : '18px',
      marginBottom: '32px',
      color: 'var(--text-secondary)',
      lineHeight: '1.6'
    },
    heroBtnContainer: {
      display: 'flex', gap: '12px', marginTop: '24px'
    },
    heroBtnSec: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      border: `2px solid var(--border-color)`,
      padding: isMobile ? '10px 20px' : '10px 24px',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: 'var(--treg-glass-bg)',
        transform: 'translateY(-2px)'
      }
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
      gap: '24px',
      width: '100%'
    },
    statCard: (borderColor, gradient) => ({
      backgroundColor: 'var(--card-bg)',
      padding: isMobile ? '5vw' : '2.5vw',
      borderRadius: '12px',
      boxShadow: 'none',
      border: '1px solid var(--border-color)',
      borderTop: `4px solid ${borderColor}`,
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      boxShadow: isDark ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.02)',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      height: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: isDark ? `0 10px 20px ${borderColor}20` : `0 10px 20px ${borderColor}15`
      }
    }),
    statIconBox: (color) => ({
      width: isMobile ? '48px' : '64px',
      height: isMobile ? '48px' : '64px',
      borderRadius: '16px',
      background: `${color}15`,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    }),
    statNumber: {
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '800',
      color: 'var(--text-primary)'
    },
    statLabel: {
      color: 'var(--text-secondary)',
      fontSize: '13px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginTop: '4px'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    sectionTitle: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '800',
      color: 'var(--text-primary)'
    },
    viewControls: {
      display: 'flex',
      gap: '8px',
      backgroundColor: 'var(--bg-tertiary)',
      padding: '4px',
      borderRadius: '12px'
    },
    viewBtn: (active) => ({
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '700',
      cursor: 'pointer',
      backgroundColor: active ? 'var(--treg-glass-border)' : 'transparent',
      color: active ? 'var(--text-primary)' : 'var(--text-muted)',
      boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.2s ease'
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '20px' : '32px'
    },
    eventCard: {
      backgroundColor: 'var(--treg-card-bg)',
      borderRadius: '16px',
      border: `1px solid var(--treg-glass-border)`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: isDark ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.02)',
      position: 'relative',
      overflow: 'hidden',
      ':hover': {
        transform: 'translateY(-6px)',
        boxShadow: isDark ? '0 12px 24px rgba(124, 58, 237, 0.15)' : '0 12px 24px rgba(124, 58, 237, 0.1)',
        borderColor: '#7C3AED'
      }
    },
    cardImageContainer: {
      position: 'relative',
      width: '100%',
      height: '180px',
      overflow: 'hidden',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px'
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease'
    },
    cardImageOverlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 100%)',
      pointerEvents: 'none'
    },
    cardStatusBadge: (status) => ({
      position: 'absolute',
      top: '16px', right: '16px',
      background: status === 'Active' || status === 'Published'
        ? 'linear-gradient(135deg, #10B981, #059669)'
        : 'linear-gradient(135deg, #F59E0B, #D97706)',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
    }),
    cardBody: {
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '800',
      color: 'var(--text-primary)',
      marginBottom: '12px',
      lineHeight: '1.3'
    },
    cardMeta: {
      fontSize: '13px',
      color: 'var(--text-secondary)',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    cardFooter: {
      marginTop: 'auto',
      paddingTop: '16px',
      borderTop: `1px solid var(--treg-glass-border)`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    cardStudentCount: {
      fontSize: '13px',
      fontWeight: '600',
      color: 'var(--treg-primary)',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    cardActions: {
      display: 'flex',
      gap: '8px'
    },
    actionBtn: (color, bg) => ({
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      color: color,
      backgroundColor: bg,
      border: 'none',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
      ':hover': { opacity: 0.8 }
    }),

    // TABLE VIEW STYLES
    tableContainer: {
      backgroundColor: 'var(--treg-card-bg)',
      borderRadius: '16px',
      border: `1px solid var(--treg-glass-border)`,
      overflow: 'hidden',
      overflowX: 'auto',
      boxShadow: isDark ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.02)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left'
    },
    th: {
      padding: '16px 24px',
      backgroundColor: 'var(--treg-glass-bg)',
      color: 'var(--text-secondary)',
      fontWeight: '600',
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: `1px solid var(--treg-glass-border)`
    },
    td: {
      padding: '16px 24px',
      borderBottom: `1px solid var(--treg-glass-border)`,
      fontSize: '14px',
      color: 'var(--text-main)'
    },
    tdTitle: {
      fontWeight: '700',
      color: 'var(--text-primary)'
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
        backgroundColor: 'var(--bg-primary)',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '4px solid var(--border-color)',
          borderTop: '4px solid var(--primary-color)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={styles.container} >
      <div style={styles.header}>
        <div style={styles.profileSection} onClick={() => navigate('/profile')}>
          <img
            src={imageError ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : imageUrl}
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

      <div style={styles.mainContent}>
        <div style={styles.heroBanner}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Manage Your Events Efficiently</h1>
            <p style={styles.heroText}>Create new workshops, track registrations, and engage students with powerful tools.</p>
            <div style={styles.heroBtnContainer}>
              <button style={styles.createBtn} onClick={() => navigate('/create-event')}>
                + Create Event
              </button>
              <button style={styles.heroBtnSec} onClick={() => navigate('/reports')}>
                View Reports
              </button>
            </div>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard('var(--primary-color)')} onClick={() => navigate('/teacher-events')}>
            <div style={styles.statIconBox('#eff6ff', 'var(--primary-color)')}><Calendar size={24} /></div>
            <div>
              <div style={styles.statNumber}>{teacherEvents.length}</div>
              <div style={styles.statLabel}>Total Events</div>
            </div>
          </div>
          <div style={styles.statCard('var(--success-color)')} onClick={() => navigate('/teacher-events')}>
            <div style={styles.statIconBox('#dcfce7', 'var(--success-color)')}><Users size={24} /></div>
            <div>
              <div style={styles.statNumber}>{teacherEvents.filter(e => e.status === 'Active' || e.status === 'Published').length}</div>
              <div style={styles.statLabel}>Active Events</div>
            </div>
          </div>
          <div style={styles.statCard('var(--warning-color)')} onClick={() => navigate('/teacher-registrations')}>
            <div style={styles.statIconBox('#fef3c7', 'var(--warning-color)')}><CheckSquare size={24} /></div>
            <div>
              <div style={styles.statNumber}>{loadingRegs ? '...' : realPendingCount}</div>
              <div style={styles.statLabel}>Pending Approvals</div>
            </div>
          </div>
          <div style={styles.statCard('var(--accent-color)')} onClick={() => navigate('/teacher-events')}>
            <div style={styles.statIconBox('#e0e7ff', 'var(--accent-color)')}><Bell size={24} /></div>
            <div>
              <div style={styles.statNumber}>{totalParticipants}</div>
              <div style={styles.statLabel}>Total Registrations</div>
            </div>
          </div>
        </div>

        <div>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>My Events</div>
            <div style={styles.viewControls}>
              <button style={styles.viewBtn(viewMode === 'grid')} onClick={() => setViewMode('grid')}>Grid</button>
              <button style={styles.viewBtn(viewMode === 'table')} onClick={() => setViewMode('table')}>Table</button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div style={styles.grid}>
              {recentEvents.map(event => (
                <div key={event.id || event._id} style={styles.eventCard} onClick={() => navigate(`/teacher-event-details/${event.id || event._id}`)}>
                  <div
                    style={styles.cardImageContainer}
                    onMouseEnter={(e) => {
                      e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
                      e.currentTarget.parentElement.style.transform = 'translateY(-4px)';
                      e.currentTarget.parentElement.style.boxShadow = '0 12px 24px -8px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                      e.currentTarget.parentElement.style.transform = 'translateY(0)';
                      e.currentTarget.parentElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                    }}
                  >
                    <img src={event.image} alt={event.title} style={styles.cardImage} />
                    <div style={styles.cardImageOverlay}></div>
                    <div style={styles.cardStatusBadge(event.status)}>{event.status}</div>
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{event.title}</h3>
                    <div style={styles.cardMeta}><Calendar size={14} /> {event.date}</div>
                    <div style={styles.cardMeta}><MapPin size={14} /> {event.location}</div>
                    <div style={styles.cardFooter}>
                      <span style={styles.cardStudentCount}>
                        <Users size={14} /> {event.registrations || 0}
                      </span>
                      <div style={styles.cardActions}>
                        <button style={styles.actionBtn('var(--primary-color)', '#eff6ff')} onClick={(e) => { e.stopPropagation(); navigate(`/edit-event/${event.id || event._id}`); }}>Edit</button>
                        <button style={styles.actionBtn('var(--danger-color)', '#fef2f2')} onClick={(e) => { e.stopPropagation(); }}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Event Title</th>
                    <th style={styles.th}>Date & Location</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Students</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map(event => (
                    <tr key={event.id || event._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/teacher-event-details/${event.id || event._id}`)}>
                      <td style={{ ...styles.td, ...styles.tdTitle }}>{event.title}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><Calendar size={14} color="#64748b" /> {event.date}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}><MapPin size={14} /> {event.location}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ backgroundColor: event.status === 'Active' || event.status === 'Published' ? '#dcfce7' : '#fef3c7', color: event.status === 'Active' || event.status === 'Published' ? '#16a34a' : '#d97706', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                          {event.status}
                        </span>
                      </td>
                      <td style={styles.td}>{event.registrations || 0}</td>
                      <td style={styles.td}>
                        <div style={styles.cardActions}>
                          <button style={styles.actionBtn('var(--primary-color)', '#eff6ff')} onClick={(e) => { e.stopPropagation(); navigate(`/edit-event/${event.id || event._id}`); }}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
