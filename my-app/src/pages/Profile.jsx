import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogOut } from 'lucide-react';
import axios from 'axios';

const Profile = ({ user: initialUser, theme, onLogout, setUser }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [user, setLocalUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ GET TOKEN from localStorage
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (token) return token;
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return parsed?.token || null;
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    return null;
  };

  // ✅ FETCH USER DATA - runs when initialUser changes or on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First, try to get user from props
        if (initialUser && initialUser.name && initialUser.name !== 'Guest') {
          setLocalUser(initialUser);
        } else {
          // Try localStorage
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed && parsed.name && parsed.name !== 'Guest') {
              setLocalUser(parsed);
            }
          }
        }

        // Then fetch fresh data from API
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const latestUser = response.data;

        // Update local state with fresh data
        setLocalUser(latestUser);

        // Update parent state if provided
        if (setUser) {
          setUser({ ...latestUser, token: token });
        }

        // Update localStorage
        localStorage.setItem('user', JSON.stringify({ ...latestUser, token: token }));

        console.log('✅ Profile data fetched:', latestUser.email, '- Role:', latestUser.role);

      } catch (error) {
        console.error('Error fetching user data:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [initialUser, setUser]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const styles = {
    container: {
      padding: isMobile ? 20 : 30,
      fontFamily: "'Inter', sans-serif",
      color: isDark ? '#fff' : '#1e293b',
      maxWidth: isMobile ? '100%' : 900,
      margin: '0 auto',
      minHeight: '100vh',
      paddingBottom: 80
    },
    header: {
      marginBottom: 30,
      textAlign: isMobile ? 'center' : 'left'
    },
    pageTitle: {
      fontSize: isMobile ? 28 : 36,
      fontWeight: '800',
      marginBottom: 8
    },
    subTitle: {
      color: '#64748b',
      fontSize: isMobile ? 14 : 16
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? 20 : 30,
      alignItems: 'start'
    },
    profileCard: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: isMobile ? 16 : 24,
      padding: isMobile ? 24 : 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 16
    },
    avatar: {
      width: isMobile ? 100 : 150,
      height: isMobile ? 100 : 150,
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid #6366f1',
      padding: 4,
      backgroundColor: '#f3f4f6'
    },
    name: {
      fontSize: isMobile ? 20 : 28,
      fontWeight: 'bold',
      marginBottom: 4,
      color: isDark ? '#fff' : '#1e293b'
    },
    email: {
      fontSize: isMobile ? 14 : 16,
      color: '#64748b',
      marginBottom: 20
    },
    badge: {
      backgroundColor: '#e0e7ff',
      color: '#4338ca',
      padding: '8px 20px',
      borderRadius: '50px',
      fontSize: isMobile ? 12 : 14,
      fontWeight: '600'
    },
    rightColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? 16 : 20
    },
    detailsCard: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: isMobile ? 16 : 20,
      padding: isMobile ? 20 : 24,
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: isMobile ? 18 : 20,
      fontWeight: '700',
      marginBottom: 16,
      borderBottom: isDark ? '1px solid #334155' : '1px solid #f1f5f9',
      paddingBottom: 12
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: isDark ? '1px solid #334155' : '1px solid #f8fafc'
    },
    infoLabel: {
      color: '#94a3b8',
      fontSize: isMobile ? 14 : 15,
      fontWeight: '500'
    },
    infoValue: {
      fontWeight: '600',
      fontSize: isMobile ? 14 : 15,
      color: isDark ? '#fff' : '#334155',
      textAlign: 'right'
    },
    settingsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? 12 : 16
    },
    settingCard: (bg, color) => ({
      backgroundColor: isDark ? '#1e293b' : '#fff',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      padding: isMobile ? 16 : 20,
      borderRadius: isMobile ? 12 : 16,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 12 : 16,
      transition: 'transform 0.2s'
    }),
    iconBox: (bg, color) => ({
      width: isMobile ? 40 : 48,
      height: isMobile ? 40 : 48,
      borderRadius: isMobile ? 10 : 12,
      backgroundColor: bg,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })
  };

  const settingsOptions = [
    {
      label: 'Edit Profile',
      sub: 'Update personal info',
      icon: <User size={isMobile ? 20 : 24} />,
      path: '/edit-profile',
      color: '#6366f1',
      bg: '#e0e7ff'
    },
    {
      label: 'Security',
      sub: 'Change password',
      icon: <Lock size={isMobile ? 20 : 24} />,
      path: '/change-password',
      color: '#10b981',
      bg: '#d1fae5'
    },
    {
      label: 'Log Out',
      sub: 'Sign out of account',
      icon: <LogOut size={isMobile ? 20 : 24} />,
      action: onLogout,
      color: '#ef4444',
      bg: '#fee2e2'
    }
  ];

  const imageUrl = getImageUrl(user?.profileImage);

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
        <h1 style={styles.pageTitle}>My Profile</h1>
        <p style={styles.subTitle}>Manage your account details</p>
      </div>

      <div style={styles.mainGrid}>
        <div style={styles.profileCard}>
          <div style={styles.avatarContainer}>
            <img
              src={imageError ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : imageUrl}
              alt="Profile"
              style={styles.avatar}
              onError={handleImageError}
            />
          </div>
          <h2 style={styles.name}>{user?.name || 'Loading...'}</h2>
          <p style={styles.email}>{user?.email || 'Loading...'}</p>
          <span style={styles.badge}>{user?.role === 'student' ? 'Student Account' : 'Teacher Account'}</span>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.detailsCard}>
            <h3 style={styles.sectionTitle}>Academic Information</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>College Name</span>
              <span style={styles.infoValue}>{user?.college || 'N/A'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Department</span>
              <span style={styles.infoValue}>{user?.department || 'N/A'}</span>
            </div>
            <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
              <span style={styles.infoLabel}>Registration ID</span>
              <span style={styles.infoValue}>{user?.regNo || 'N/A'}</span>
            </div>
          </div>

          <div>
            <h3 style={{ ...styles.sectionTitle, borderBottom: 'none', marginBottom: 12 }}>Account Settings</h3>
            <div style={styles.settingsGrid}>
              {settingsOptions.map((opt, index) => (
                <div
                  key={index}
                  style={styles.settingCard(opt.bg, opt.color)}
                  onClick={() => opt.path ? navigate(opt.path) : opt.action()}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={styles.iconBox(opt.bg, opt.color)}>
                    {opt.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: isMobile ? 14 : 16, color: isDark ? '#fff' : '#1e293b' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: isMobile ? 11 : 12, color: '#64748b' }}>
                      {opt.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
