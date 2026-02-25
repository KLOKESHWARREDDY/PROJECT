import React, { useState, useEffect } from 'react';
import {
  Home, Calendar, Ticket, Menu, X,
  Shield, HelpCircle, CalendarCheck,
  CheckSquare, User, LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user, theme, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isTeacher = user?.role === 'teacher';

  const menuItems = isTeacher
    ? [
      { label: 'Dashboard', icon: <Home size={19} />, path: '/' },
      { label: 'My Events', icon: <CalendarCheck size={19} />, path: '/teacher-events' },
      { label: 'Registrations', icon: <CheckSquare size={19} />, path: '/teacher-registrations' },
      { label: 'Profile', icon: <User size={19} />, path: '/profile' },
    ]
    : [
      { label: 'Dashboard', icon: <Home size={19} />, path: '/' },
      { label: 'Events', icon: <Calendar size={19} />, path: '/events' },
      { label: 'My Tickets', icon: <Ticket size={19} />, path: '/my-events' },
      { label: 'Profile', icon: <User size={19} />, path: '/profile' },
    ];

  const footerItems = [
    { label: 'Privacy', icon: <Shield size={19} />, path: '/privacy' },
    { label: 'Help', icon: <HelpCircle size={19} />, path: '/help' },
  ];

  const getImageUrl = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  const NavItem = ({ item, danger = false }) => {
    const isActive = location.pathname === item.path;
    return (
      <button
        className={`sidebar-item${isActive ? ' active' : ''}${danger ? ' sidebar-item-logout' : ''}`}
        onClick={() => navigate(item.path)}
      >
        <span className="sidebar-item-icon">{item.icon}</span>
        <span className="sidebar-item-label">{item.label}</span>
        {/* Tooltip (visible only when collapsed, via CSS) */}
        <span className="sidebar-tooltip">{item.label}</span>
      </button>
    );
  };

  return (
    <div className={`sidebar${isExpanded ? ' expanded' : ''}${isDark ? ' dark' : ''}`}>

      {/* Toggle Row */}
      <div className="sidebar-top">
        {isExpanded && <span className="sidebar-logo-text">EventSphere</span>}
        <button className="sidebar-toggle" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <X size={17} /> : <Menu size={20} />}
        </button>
      </div>

      {/* User Mini (shows name when expanded) */}
      {isExpanded && (
        <div className="sidebar-user" onClick={() => navigate('/profile')}>
          <img
            src={imageError
              ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
              : getImageUrl(user?.profileImage)}
            alt="avatar"
            className="sidebar-user-img"
            onError={() => setImageError(true)}
          />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name?.split(' ')[0] || 'User'}</div>
            <div className="sidebar-user-role">{user?.role || 'student'}</div>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav className="sidebar-nav">
        {menuItems.map(item => <NavItem key={item.label} item={item} />)}
        <div className="sidebar-divider" />
        {footerItems.map(item => <NavItem key={item.label} item={item} />)}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button
          className="sidebar-item sidebar-item-logout"
          onClick={() => { onLogout(); navigate('/'); }}
        >
          <span className="sidebar-item-icon"><LogOut size={19} /></span>
          <span className="sidebar-item-label">Log Out</span>
          <span className="sidebar-tooltip">Log Out</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
