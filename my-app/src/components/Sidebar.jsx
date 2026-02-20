import React, { useState, useEffect } from 'react';
import { Home, Calendar, Ticket, Menu, Shield, HelpCircle, CalendarCheck, CheckSquare, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ user, theme, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState(false);
  const [iconSize, setIconSize] = useState(20);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth < 1400 ? 18 : 22);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle case where user is null or undefined
  const isTeacher = user?.role === 'teacher';

  const menuItems = isTeacher
    ? [
      { label: 'Dashboard', icon: <Home size={iconSize} />, path: '/' },
      { label: 'My Events', icon: <CalendarCheck size={iconSize} />, path: '/teacher-events' },
      { label: 'Registrations', icon: <CheckSquare size={iconSize} />, path: '/teacher-registrations' },
      { label: 'Profile', icon: <User size={iconSize} />, path: '/profile' },
    ]
    : [
      { label: 'Dashboard', icon: <Home size={iconSize} />, path: '/' },
      { label: 'Events', icon: <Calendar size={iconSize} />, path: '/events' },
      { label: 'My Tickets', icon: <Ticket size={iconSize} />, path: '/my-events' },
      { label: 'Profile', icon: <User size={iconSize} />, path: '/profile' },
    ];

  const footerItems = [
    { label: 'Privacy Policy', icon: <Shield size={iconSize} />, path: '/privacy' },
    { label: 'Help Center', icon: <HelpCircle size={iconSize} />, path: '/help' },
  ];

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
    sidebar: {
      height: '100vh',
      width: isExpanded ? 220 : 60,
      minWidth: isExpanded ? '220px' : '60px',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRight: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      display: 'flex', flexDirection: 'column', padding: '16px 0',
      position: 'fixed', left: 0, top: 0, zIndex: 1000,
      transition: 'width 0.2s ease', overflowX: 'hidden',
    },
    topSection: {
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
      paddingLeft: isExpanded ? 16 : 0, justifyContent: isExpanded ? 'flex-start' : 'center',
      height: 48
    },
    menuBtn: {
      cursor: 'pointer', color: isDark ? '#fff' : '#1e293b',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 36, height: 36, minWidth: 30, minHeight: 30
    },
    logoText: {
      fontSize: 18, fontWeight: '800', color: '#6366f1',
      whiteSpace: 'nowrap', opacity: isExpanded ? 1 : 0, display: isExpanded ? 'block' : 'none'
    },
    nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
    navItem: (isActive) => ({
      display: 'flex', alignItems: 'center', gap: 12,
      width: isExpanded ? '90%' : '100%', margin: isExpanded ? '0 auto' : '0',
      padding: isExpanded ? '10px 12px' : '12px 0',
      borderRadius: isExpanded ? 10 : 0, cursor: 'pointer',
      backgroundColor: isActive ? (isDark ? '#334155' : '#eff6ff') : 'transparent',
      borderLeft: (!isExpanded && isActive) ? '4px solid #6366f1' : '4px solid transparent',
      color: isActive ? '#6366f1' : '#64748b',
      justifyContent: isExpanded ? 'flex-start' : 'center',
      transition: 'all 0.2s'
    }),
    navLabel: {
      fontWeight: '600', fontSize: 14, display: isExpanded ? 'block' : 'none', whiteSpace: 'nowrap'
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.topSection}>
        <div style={styles.menuBtn} onClick={() => setIsExpanded(!isExpanded)}>
          <Menu size={iconSize} />
        </div>
        <div style={styles.logoText}>EventSphere</div>
      </div>

      <div style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.label}
              style={styles.navItem(isActive)}
              onClick={() => navigate(item.path)}
              title={!isExpanded ? item.label : ''}
            >
              <div style={{ display: 'flex', justifyContent: 'center', minWidth: '20px' }}>{item.icon}</div>
              <span style={styles.navLabel}>{item.label}</span>
            </div>
          );
        })}

        <div style={{ height: '1px', backgroundColor: isDark ? '#334155' : '#e2e8f0', margin: '12px 16px' }} />

        {footerItems.map((item) => (
          <div
            key={item.label}
            style={styles.navItem(location.pathname === item.path)}
            onClick={() => navigate(item.path)}
            title={!isExpanded ? item.label : ''}
          >
            <div style={{ display: 'flex', justifyContent: 'center', minWidth: '20px' }}>{item.icon}</div>
            <span style={styles.navLabel}>{item.label}</span>
          </div>
        ))}

        <div
          style={styles.navItem(false)}
          onClick={() => {
            onLogout();
            navigate('/');
          }}
          title={!isExpanded ? 'Log Out' : ''}
        >
          <div style={{ display: 'flex', justifyContent: 'center', minWidth: '20px' }}>
            <LogOut size={iconSize} color="#ef4444" />
          </div>
          <span style={{ ...styles.navLabel, color: '#ef4444' }}>Log Out</span>
        </div>
      </div>

      {/* User Section Removed as per request */}
    </div>
  );
};

export default Sidebar;
