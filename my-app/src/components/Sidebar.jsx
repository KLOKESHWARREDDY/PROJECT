import React, { useState, useEffect } from 'react';
import { Home, Calendar, Ticket, User, LogOut, Menu, Shield, HelpCircle, List, CheckSquare, CalendarCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ user, theme, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState(false);
  const [iconSize, setIconSize] = useState(20);

  // Responsive Icon Size
  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth < 1400 ? 18 : 22);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ DYNAMIC MENU ITEMS BASED ON ROLE
  const isTeacher = user.role === 'teacher';

  const menuItems = isTeacher 
    ? [
        // TEACHER MENU
        { label: 'Dashboard', icon: <Home size={iconSize} />, path: '/' },
        // ✅ CHANGED ICON HERE: Used CalendarCheck instead of List
        { label: 'My Events', icon: <CalendarCheck size={iconSize} />, path: '/teacher-events' }, 
        { label: 'Registrations', icon: <CheckSquare size={iconSize} />, path: '/teacher-registrations' }, // Approvals Page
        { label: 'Profile', icon: <User size={iconSize} />, path: '/profile' },
      ]
    : [
        // STUDENT MENU
        { label: 'Dashboard', icon: <Home size={iconSize} />, path: '/' },
        { label: 'Events', icon: <Calendar size={iconSize} />, path: '/events' },
        { label: 'My Tickets', icon: <Ticket size={iconSize} />, path: '/my-events' },
        { label: 'Profile', icon: <User size={iconSize} />, path: '/profile' },
      ];

  // Common Footer Items
  const footerItems = [
    { label: 'Privacy Policy', icon: <Shield size={iconSize} />, path: '/privacy' },
    { label: 'Help Center', icon: <HelpCircle size={iconSize} />, path: '/help' },
  ];

  const styles = {
    sidebar: {
      height: '100vh',
      width: isExpanded ? '16vw' : '4vw', 
      minWidth: isExpanded ? '220px' : '60px', 
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRight: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      display: 'flex', flexDirection: 'column', padding: '1vh 0', 
      position: 'fixed', left: 0, top: 0, zIndex: 1000,
      transition: 'width 0.2s ease', overflowX: 'hidden',
    },
    topSection: {
      display: 'flex', alignItems: 'center', gap: '0.5vw', marginBottom: '2vh',
      paddingLeft: isExpanded ? '1vw' : '0', justifyContent: isExpanded ? 'flex-start' : 'center',
      height: '5vh'
    },
    menuBtn: {
      cursor: 'pointer', color: isDark ? '#fff' : '#1e293b', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      width: '2.5vw', height: '2.5vw', minWidth: '30px', minHeight: '30px'
    },
    logoText: {
      fontSize: '1.2vw', fontWeight: '800', color: '#6366f1', 
      whiteSpace: 'nowrap', opacity: isExpanded ? 1 : 0, display: isExpanded ? 'block' : 'none'
    },
    nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5vh' },
    navItem: (isActive) => ({
      display: 'flex', alignItems: 'center', gap: '0.8vw',
      width: isExpanded ? '90%' : '100%', margin: isExpanded ? '0 auto' : '0',
      padding: isExpanded ? '1vh 0.8vw' : '1.5vh 0',
      borderRadius: isExpanded ? '0.6vw' : '0', cursor: 'pointer',
      backgroundColor: isActive ? (isDark ? '#334155' : '#eff6ff') : 'transparent',
      borderLeft: (!isExpanded && isActive) ? '0.3vw solid #6366f1' : '0.3vw solid transparent',
      color: isActive ? '#6366f1' : '#64748b',
      justifyContent: isExpanded ? 'flex-start' : 'center',
      transition: 'all 0.2s'
    }),
    navLabel: { 
      fontWeight: '600', fontSize: '0.9vw', display: isExpanded ? 'block' : 'none', whiteSpace: 'nowrap'
    },
    userSection: { 
      marginTop: 'auto', padding: '1vh 0', display: 'flex', alignItems: 'center', 
      gap: '0.8vw', justifyContent: isExpanded ? 'flex-start' : 'center', 
      paddingLeft: isExpanded ? '1vw' : '0' 
    },
    avatar: { 
      width: '2.5vw', height: '2.5vw', minWidth: '30px', minHeight: '30px',
      borderRadius: '50%', objectFit: 'cover' 
    },
    userName: {
      display: isExpanded ? 'block' : 'none', fontSize: '0.9vw', fontWeight: 'bold', color: isDark ? '#fff' : '#333'
    }
  };

  return (
    <div style={styles.sidebar}>
      {/* Toggle & Logo */}
      <div style={styles.topSection}>
        <div style={styles.menuBtn} onClick={() => setIsExpanded(!isExpanded)}>
          <Menu size={iconSize} />
        </div>
        <div style={styles.logoText}>EventSphere</div>
      </div>

      {/* Main Nav */}
      <div style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.label} style={styles.navItem(isActive)} onClick={() => navigate(item.path)} title={!isExpanded ? item.label : ''}>
              <div style={{display:'flex', justifyContent:'center', minWidth:'20px'}}>{item.icon}</div>
              <span style={styles.navLabel}>{item.label}</span>
            </div>
          );
        })}
        
        {/* Divider */}
        <div style={{height: '1px', backgroundColor: isDark ? '#334155' : '#e2e8f0', margin: '1vh 1vw'}} />

        {/* Footer Items */}
        {footerItems.map((item) => (
           <div key={item.label} style={styles.navItem(location.pathname === item.path)} onClick={() => navigate(item.path)} title={!isExpanded ? item.label : ''}>
             <div style={{display:'flex', justifyContent:'center', minWidth:'20px'}}>{item.icon}</div>
             <span style={styles.navLabel}>{item.label}</span>
           </div>
        ))}
      </div>

      {/* User Info */}
      <div style={styles.userSection}>
        <img src={user.profileImage} alt="User" style={styles.avatar} />
        <div style={styles.userName}>{user.name.split(' ')[0]}</div>
      </div>

      {/* Logout */}
      <div style={{...styles.navItem(false), color:'#ef4444', marginTop:'0.5vh'}} onClick={onLogout} title={!isExpanded ? "Log Out" : ""}>
         <div style={{display:'flex', justifyContent:'center', minWidth:'20px'}}><LogOut size={iconSize} /></div>
         <span style={styles.navLabel}>Log Out</span>
      </div>
    </div>
  );
};

export default Sidebar;