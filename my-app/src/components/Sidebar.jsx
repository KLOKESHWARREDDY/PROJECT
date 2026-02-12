import React, { useState, useEffect } from 'react';
import { Home, Calendar, Ticket, User, LogOut, Menu, Shield, HelpCircle, CalendarCheck, CheckSquare } from 'lucide-react';
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

  const isTeacher = user.role === 'teacher';

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
    },
    userSection: { 
      marginTop: 'auto', padding: '12px 0', display: 'flex', alignItems: 'center',
      gap: 12, justifyContent: isExpanded ? 'flex-start' : 'center',
      paddingLeft: isExpanded ? 16 : 0
    },
    avatar: { 
      width: 36, height: 36, minWidth: 30, minHeight: 30,
      borderRadius: '50%', objectFit: 'cover',
      backgroundColor: '#f3f4f6'
    },
    userName: {
      display: isExpanded ? 'block' : 'none', fontSize: 14, fontWeight: 'bold', color: isDark ? '#fff' : '#333'
    }
  };

  const imageUrl = getImageUrl(user?.profileImage);

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
              <div style={{display:'flex', justifyContent:'center', minWidth:'20px'}}>{item.icon}</div>
              <span style={styles.navLabel}>{item.label}</span>
            </div>
          );
        })}
        
        <div style={{height: '1px', backgroundColor: isDark ? '#334155' : '#e2e8f0', margin: '12px 16px'}} />

        {footerItems.map((item) => (
           <div 
            key={item.label} 
            style={styles.navItem(location.pathname === item.path)} 
            onClick={() => navigate(item.path)}
            title={!isExpanded ? item.label : ''}
          >
             <div style={{display:'flex', justifyContent:'center', minWidth:'20px'}}>{item.icon}</div>
             <span style={styles.navLabel}>{item.label}</span>
           </div>
        ))}
      </div>

      <div style={styles.userSection}>
        <img 
          src={imageError ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' : imageUrl} 
          alt="User" 
          style={styles.avatar}
          onError={handleImageError}
        />
        <div style={styles.userName}>{user?.name ? user.name.split(' ')[0] : 'User'}</div>
      </div>

      <div style={{...styles.navItem(false), color:'#ef4444', marginTop:'8px'}} onClick={onLogout} title={!isExpanded ? "Log Out" : ""}>
         <div style={{display:'flex', justifyContent:'center', minWidth:'20px'}}><LogOut size={iconSize} /></div>
         <span style={styles.navLabel}>Log Out</span>
      </div>
    </div>
  );
};

export default Sidebar;
