import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Ticket, User, LogOut, Settings } from 'lucide-react';

const Sidebar = ({ user, theme, onLogout }) => {
  const isDark = theme === 'dark';
  
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/events', icon: <Calendar size={20} />, label: 'Events' },
    { path: '/my-events', icon: <Ticket size={20} />, label: 'My Events' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div 
      className="desktop-sidebar"
      style={{
        width: '260px',
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderRight: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100
      }}
    >
      {/* Logo Section */}
      <div style={{ 
        padding: '0 20px', 
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#4f46e5',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          ES
        </div>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: isDark ? '#fff' : '#1e293b',
          margin: 0
        }}>
          EventSphere
        </h1>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              color: isActive 
                ? '#4f46e5' 
                : isDark 
                  ? '#94a3b8' 
                  : '#64748b',
              backgroundColor: isActive 
                ? isDark 
                  ? 'rgba(79, 70, 229, 0.15)' 
                  : 'rgba(79, 70, 229, 0.1)' 
                : 'transparent',
              fontWeight: isActive ? '600' : '500',
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              marginBottom: '4px'
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div style={{ 
        padding: '20px',
        borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        marginTop: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '15px'
        }}>
          <img 
            src={user.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"}
            alt={user.name}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div>
            <p style={{
              margin: 0,
              fontWeight: '600',
              color: isDark ? '#fff' : '#1e293b',
              fontSize: '14px'
            }}>
              {user.name?.split(' ')[0]}
            </p>
            <p style={{
              margin: 0,
              color: isDark ? '#94a3b8' : '#64748b',
              fontSize: '12px'
            }}>
              {user.role === 'teacher' ? 'Teacher' : 'Student'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px 12px',
            backgroundColor: 'transparent',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            borderRadius: '8px',
            color: isDark ? '#94a3b8' : '#64748b',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
