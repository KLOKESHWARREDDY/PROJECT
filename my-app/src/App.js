import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar } from 'lucide-react';
import './App.css'; // Ensure CSS is imported
import { translations } from './data/translations';

// Components
import Sidebar from './pages/Sidebar'; // <--- NEW IMPORT
import BottomNav from './components/BottomNav';
import LandingPage from './components/LandingPage';
import StudentSignIn from './components/StudentSignIn';
import StudentSignUp from './components/StudentSignUp';
import TeacherSignUp from './components/TeacherSignUp';

// Pages
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import MyEvents from './pages/MyEvents';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import Settings from './pages/Settings'; 
import ThemeSelection from './pages/ThemeSelection';
import LanguageSelection from './pages/LanguageSelection'; 
import EventDetails from './pages/EventDetails';
import Notifications from './pages/Notifications';
import TicketConfirmation from './pages/TicketConfirmation'; 

const AppContent = ({ 
  isAuthenticated, handleLogin, handleLogout, 
  theme, setTheme, user, setUser, 
  allEvents, handleRegister, handleCancel, 
  searchTerm, setSearchTerm, registeredEvents, filteredEvents, 
  notifications, unreadCount, markNotificationsRead, t
}) => {
  const location = useLocation();
  const isDark = theme === 'dark';
  
  // Apply Dark Mode Class to Body
  React.useEffect(() => {
    document.body.className = isDark ? 'dark-mode' : 'light-mode';
  }, [isDark]);

  const showNavOn = ['/', '/events', '/my-events', '/profile'];
  const shouldShowNav = showNavOn.includes(location.pathname) && isAuthenticated;

  // Render Logic
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0f172a' : '#fff' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<StudentSignIn onLogin={handleLogin} />} /> 
          <Route path="/signup" element={<StudentSignUp onLogin={handleLogin} />} />
          <Route path="/teacher-signup" element={<TeacherSignUp onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* 1. DESKTOP SIDEBAR */}
      <Sidebar user={user} theme={theme} onLogout={handleLogout} />

      {/* 2. MAIN CONTENT AREA */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard user={user} events={allEvents} theme={theme} regCount={registeredEvents.length} onRegister={handleRegister} unreadCount={unreadCount} onReadNotifications={markNotificationsRead} t={t} />} />
          <Route path="/events" element={<Events allEvents={filteredEvents} theme={theme} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onRegister={handleRegister} t={t} />} />
          <Route path="/my-events" element={<MyEvents theme={theme} events={registeredEvents} onCancel={handleCancel} t={t} />} />
          <Route path="/profile" element={<Profile user={user} theme={theme} t={t} onLogout={handleLogout} />} />
          <Route path="/edit-profile" element={<EditProfile user={user} setUser={setUser} theme={theme} />} />
          <Route path="/change-password" element={<ChangePassword theme={theme} />} />
          <Route path="/settings" element={<Settings theme={theme} user={user} onLogout={handleLogout} />} />
          <Route path="/settings/theme" element={<ThemeSelection currentTheme={theme} setTheme={setTheme} />} />
          <Route path="/settings/language" element={<LanguageSelection currentLanguage={user.language || 'English'} setLanguage={(lang) => setUser({...user, language: lang})} theme={theme} />} />
          <Route path="/event-details/:id" element={<EventDetails allEvents={allEvents} theme={theme} onRegister={handleRegister} t={t} />} />
          <Route path="/ticket-confirmation/:id" element={<TicketConfirmation allEvents={allEvents} theme={theme} onCancel={handleCancel} />} />
          <Route path="/notifications" element={<Notifications theme={theme} notificationsList={notifications} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* Spacer for mobile bottom nav */}
        <div style={{ height: '80px' }} className="mobile-only-spacer"></div>
      </div>

      {/* 3. MOBILE BOTTOM NAV */}
      {shouldShowNav && (
        <div className="mobile-bottom-nav" style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 100 }}>
          <BottomNav theme={theme} t={t} />
        </div>
      )}
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState('light'); 
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [user, setUser] = useState({
    name: "Lokesh1.kk2007",
    email: "lokesh1.kk2007@gmail.com",
    college: "Engineering Tech Institute",
    regNo: "ETI-2024-001",
    language: "English",
    role: "student",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" 
  });

  const handleLogin = (userData) => { if (userData) setUser(prev => ({ ...prev, ...userData })); setIsAuthenticated(true); };
  const handleLogout = () => { setIsAuthenticated(false); setUser({ name: "Guest", email: "guest@college.edu", college: "Engineering Tech Institute", regNo: "ETI-2024-001", language: "English", role: "student", profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" }); };

  const t = translations[user.language] || translations['English'];

  // Mock Data
  const [allEvents, setAllEvents] = useState([
    { id: 1, title: "AI & Future Tech Workshop", date: "Apr 05, 2024 · 09:00 AM", location: "Innovation Lab", category: "Tech", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", status: 'idle' },
    { id: 2, title: "Inter-College Music Battle", date: "Apr 12, 2024 · 05:00 PM", location: "Main Stadium", category: "Cultural", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80", status: 'idle' },
    { id: 3, title: "University Basketball Finals", date: "Apr 20, 2024 · 10:00 AM", location: "Indoor Sports Complex", category: "Sports", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80", status: 'idle' }
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "AI & Future Tech Workshop", typeLabel: "Registration Approved", desc: "Your seat has been confirmed.", time: "2h ago", icon: <CheckCircle size={20} color="#5c5cfc" />, bgColor: 'rgba(92, 92, 252, 0.1)', eventId: 1 },
    { id: 2, title: "Inter-College Music Battle", typeLabel: "New Event Added", desc: "Registration is now open!", time: "5h ago", icon: <Calendar size={20} color="#22c55e" />, bgColor: 'rgba(34, 197, 94, 0.1)', eventId: 2 }
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const markNotificationsRead = () => setUnreadCount(0);
  const handleRegister = (eventId) => { setAllEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, status: 'pending' } : ev)); setTimeout(() => { setAllEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, status: 'approved' } : ev)); setUnreadCount(prev => prev + 1); setNotifications(prev => [{ id: Date.now(), title: "Registration Confirmed", typeLabel: "Approved", desc: "You are registered successfully!", time: "Just now", icon: <CheckCircle size={20} color="#5c5cfc" />, bgColor: 'rgba(92, 92, 252, 0.1)', eventId: eventId }, ...prev]); }, 3000); };
  const handleCancelRegistration = (eventId) => { setAllEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, status: 'idle' } : ev)); };
  const filteredEvents = allEvents.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const registeredEvents = allEvents.filter(e => e.status === 'pending' || e.status === 'approved');

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout} theme={theme} setTheme={setTheme} user={user} setUser={setUser} allEvents={allEvents} handleRegister={handleRegister} handleCancel={handleCancelRegistration} searchTerm={searchTerm} setSearchTerm={setSearchTerm} registeredEvents={registeredEvents} filteredEvents={filteredEvents} notifications={notifications} unreadCount={unreadCount} markNotificationsRead={markNotificationsRead} t={t} />
    </Router>
  );
}

export default App;