import React from 'react';
import { Home, Calendar, User, Ticket } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = ({ theme, t }) => { // Accept 't'
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  const navItems = [
    { icon: <Home size={24} />, label: t.home, path: '/' },
    { icon: <Calendar size={24} />, label: t.events, path: '/events' },
    { icon: <Ticket size={24} />, label: t.myEvents, path: '/my-events' },
    { icon: <User size={24} />, label: t.profile, path: '/profile' }
  ];

  const styles = {
    nav: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '16px 0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
      borderTop: isDark ? '1px solid #334155' : '1px solid #f1f5f9',
      zIndex: 1000
    },
    item: (isActive) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      color: isActive ? '#2563eb' : '#94a3b8',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      fontSize: '12px',
      fontWeight: '600'
    })
  };

  return (
    <div style={styles.nav}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button 
            key={item.label} 
            style={styles.item(isActive)}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;