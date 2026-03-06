import React, { useState, useEffect } from 'react';
import {
  Home,
  Calendar,
  ClipboardList,
  CalendarDays,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  Shield,
  CalendarCheck,
  CheckSquare,
  User,
  PlusCircle,
  Edit,
  Users
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user, theme, onLogout, isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [iconSize, setIconSize] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth < 1400 ? 18 : 22);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTeacher = user?.role === 'teacher';

  // TEACHER MENU - Updated to modern 10-item layout (8 main + 2 preference/footer)
  const teacherMenuItems = [
    { label: 'Dashboard', icon: <Home size={iconSize} />, path: '/' },
    { label: 'Create Event', icon: <PlusCircle size={iconSize} />, path: '/create-event' },
    { label: 'Manage Events', icon: <Edit size={iconSize} />, path: '/teacher-events' },
    { label: 'Student Registrations', icon: <Users size={iconSize} />, path: '/teacher-registrations' },
    { label: 'Event Reports', icon: <BarChart3 size={iconSize} />, path: '/reports' },
    { label: 'Calendar', icon: <Calendar size={iconSize} />, path: '/calendar' },
  ];

  // STUDENT MENU - Updated to 10 distinct items
  const studentMenuItems = [
    { label: 'Dashboard', icon: <Home size={iconSize} />, path: '/' },
    { label: 'Events', icon: <Calendar size={iconSize} />, path: '/events' },
    { label: 'My Registrations', icon: <ClipboardList size={iconSize} />, path: '/my-events' },
    { label: 'Calendar', icon: <CalendarDays size={iconSize} />, path: '/calendar' }, // Placeholder route
    { label: 'Reports', icon: <BarChart3 size={iconSize} />, path: '/student-reports' }, // Placeholder route
  ];

  const menuItems = isTeacher ? teacherMenuItems : studentMenuItems;

  // Secondary/Footer items specific to Student vs Teacher
  const footerItems = isTeacher
    ? [
      { label: 'Settings', icon: <Settings size={iconSize} />, path: '/settings' },
      { label: 'Privacy Policy', icon: <Shield size={iconSize} />, path: '/privacy' },
      { label: 'Help Center', icon: <HelpCircle size={iconSize} />, path: '/help' },
    ]
    : [
      { label: 'Settings', icon: <Settings size={iconSize} />, path: '/settings' },
      { label: 'Help Center', icon: <HelpCircle size={iconSize} />, path: '/help' },
    ];

  const getImageUrl = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  return (
    <div className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`} style={{ width: isExpanded ? 260 : 80 }}>
      {/* Glow effects for dark mode / SaaS aesthetic */}
      <div className="sidebar-glow"></div>

      {/* Header with Logo */}
      <div className="sidebar-header">
        <div className="menu-toggle" onClick={() => setIsExpanded(!isExpanded)}>
          <Menu size={24} />
        </div>
        <div className="sidebar-logo" style={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}>
          EventSphere
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-title" style={{ opacity: isExpanded ? 1 : 0, display: isExpanded ? 'block' : 'none' }}>
          Menu
        </div>

        {menuItems.map((item) => {
          // Map placeholder routes to actual existing routes for now to avoid errors
          const effectivePath = item.path;

          const isActive = location.pathname === item.path || location.pathname === effectivePath;

          return (
            <div
              key={item.label}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(effectivePath)}
              title={!isExpanded ? item.label : ''}
            >
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-label" style={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}>
                {item.label}
              </span>
            </div>
          );
        })}

        <div className="sidebar-divider" />

        <div className="nav-section-title" style={{ opacity: isExpanded ? 1 : 0, display: isExpanded ? 'block' : 'none' }}>
          Preferences
        </div>

        {footerItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.label}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={!isExpanded ? item.label : ''}
            >
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-label" style={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}>
                {item.label}
              </span>
            </div>
          );
        })}

        {/* Ensure LogOut is the 10th functional item for students */}
        <div
          className="nav-item logout-item"
          onClick={() => {
            onLogout();
            navigate('/');
          }}
          title={!isExpanded ? 'Log Out' : ''}
        >
          <div className="nav-icon">
            <LogOut size={iconSize} />
          </div>
          <span className="nav-label" style={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}>
            Log Out
          </span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
