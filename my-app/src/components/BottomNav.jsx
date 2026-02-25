import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Ticket, User, List, CheckSquare } from 'lucide-react';

const BottomNav = ({ theme, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';
  
  // ✅ FIX: Check if user exists before checking role
  const isTeacher = user && user.role === 'teacher';

  const navItems = isTeacher 
    ? [
        { id: 'home', label: 'Home', icon: <Home size={24} />, path: '/' },
        { id: 'my-events', label: 'My Events', icon: <List size={24} />, path: '/teacher-events' },
        { id: 'approvals', label: 'Approvals', icon: <CheckSquare size={24} />, path: '/teacher-registrations' },
        { id: 'profile', label: 'Profile', icon: <User size={24} />, path: '/profile' },
      ]
    : [
        { id: 'home', label: 'Home', icon: <Home size={24} />, path: '/' },
        { id: 'events', label: 'Events', icon: <Calendar size={24} />, path: '/events' },
        { id: 'tickets', label: 'Tickets', icon: <Ticket size={24} />, path: '/my-events' },
        { id: 'profile', label: 'Profile', icon: <User size={24} />, path: '/profile' },
      ];

  const styles = {
    container: {
      position: 'fixed', bottom: 0, left: 0, width: '100%', height: '70px',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderTop: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 1000, boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
      paddingBottom: 'safe-area-inset-bottom'
    },
    navItem: (isActive) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '4px', color: isActive ? '#2563EB' : (isDark ? '#94a3b8' : '#64748b'),
      cursor: 'pointer', width: '60px', transition: 'all 0.2s ease'
    }),
    label: (isActive) => ({
      fontSize: '10px', fontWeight: isActive ? '700' : '500',
    })
  };

  return (
    <div style={styles.container}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div key={item.id} style={styles.navItem(isActive)} onClick={() => navigate(item.path)}>
            {item.icon}
            <span style={styles.label(isActive)}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;