import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import './App.css';

// Components
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import LandingPage from './components/LandingPage';

// Auth Pages
import StudentSignIn from './components/StudentSignIn';
import StudentSignUp from './components/StudentSignUp';
import TeacherSignUp from './components/TeacherSignUp';
import TeacherSignIn from './components/TeacherSignIn';

// Student Pages
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import MyEvents from './pages/MyEvents';
import TicketConfirmation from './pages/TicketConfirmation';

// Teacher Pages
import TeacherDashboard from './pages/TeacherDashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import TeacherMyEvents from './pages/TeacherMyEvents';
import TeacherEventDetails from './pages/TeacherEventDetails';
import TeacherRegistrations from './pages/TeacherRegistrations';
import EventSpecificRegistrations from './pages/EventSpecificRegistrations';

// Shared Pages
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import ThemeSelection from './pages/ThemeSelection';
import EventDetails from './pages/EventDetails';
import Notifications from './pages/Notifications';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HelpCenter from './pages/HelpCenter';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import LanguageSelection from './pages/LanguageSelection';

import api from './api';

// Default user state
const defaultUser = {
  name: "Guest",
  email: "",
  college: "",
  regNo: "",
  role: "student",
  profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
};

// Default mock data
const defaultEvents = [
  { id: 1, title: "AI & Future Tech Workshop", date: "2024-04-05 09:00", location: "Innovation Lab", category: "Tech", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", description: "Learn about AI and future tech" },
  { id: 2, title: "Inter-College Music Battle", date: "2024-03-12 17:00", location: "Main Stadium", category: "Cultural", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80", description: "Music competition between colleges" },
  { id: 3, title: "Cyber Security Seminar", date: "2024-05-20 10:00", location: "Auditorium", category: "Seminar", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", description: "Learn about cyber security" }
];

const AppContent = ({ 
  isAuthenticated, handleLogin, handleLogout,
  theme, setTheme, user, setUser,
  allEvents, handleRegister, handleCancel,
  searchTerm, setSearchTerm, registeredEvents, filteredEvents,
  notifications, unreadCount, markNotificationsRead,
  handleCreateEvent, handleDeleteEvent, handleUpdateEvent,
  registrations, handleApproveReg, handleRejectReg
}) => {
  const location = useLocation();
  const isDark = theme === 'dark';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.className = isDark ? 'dark-mode' : 'light-mode';
    document.body.style.backgroundColor = isDark ? '#0f172a' : '#f8fafc';
    document.body.style.margin = '0';
  }, [isDark]);

  const isTeacher = user?.role === 'teacher';
  const showNavOn = ['/', '/events', '/my-events', '/profile', '/dashboard', '/teacher-events', '/teacher-registrations'];
  const shouldShowNav = showNavOn.includes(location.pathname) && isAuthenticated;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0f172a' : '#fff' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<StudentSignIn onLogin={handleLogin} />} />
          <Route path="/signup" element={<StudentSignUp onLogin={handleLogin} />} />
          <Route path="/teacher-signup" element={<TeacherSignUp onLogin={handleLogin} />} />
          <Route path="/teacher-signin" element={<TeacherSignIn onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {!isMobile && <Sidebar key={user?._id || user?.profileImage || 'sidebar'} user={user} theme={theme} onLogout={handleLogout} />}
      <div className="main-content" style={{ 
        flex: 1, marginLeft: isMobile ? '0px' : '60px', width: isMobile ? '100%' : 'calc(100% - 60px)', 
        backgroundColor: isDark ? '#0f172a' : '#f8fafc', minHeight: '100vh', paddingBottom: '80px', transition: 'margin-left 0.3s ease' 
      }}>
        <Routes>
          <Route path="/" element={
            isTeacher ? (
              <TeacherDashboard key={user?._id || 'teacher-dash'} user={user} events={allEvents} theme={theme} toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onLogout={handleLogout} />
            ) : (
              <Dashboard key={user?._id || 'student-dash'} user={user} events={allEvents} theme={theme} toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onRegister={handleRegister} unreadCount={unreadCount} onReadNotifications={markNotificationsRead} />
            )
          } />
          
          {isTeacher && (
            <>
              <Route path="/create-event" element={<CreateEvent onCreate={handleCreateEvent} theme={theme} />} />
              <Route path="/edit-event/:id" element={<EditEvent events={allEvents} onUpdate={handleUpdateEvent} theme={theme} />} />
              <Route path="/teacher-events" element={<TeacherMyEvents events={allEvents} theme={theme} />} />
              <Route path="/teacher-event-details/:id" element={<TeacherEventDetails events={allEvents} onDelete={handleDeleteEvent} theme={theme} />} />
              <Route path="/teacher-registrations" element={<TeacherRegistrations registrations={registrations} onApprove={handleApproveReg} onReject={handleRejectReg} theme={theme} />} />
              <Route path="/event-registrations/:id" element={<EventSpecificRegistrations events={allEvents} registrations={registrations} onApprove={handleApproveReg} onReject={handleRejectReg} theme={theme} />} />
            </>
          )}

          {!isTeacher && (
            <>
              <Route path="/events" element={<Events allEvents={filteredEvents} theme={theme} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onRegister={handleRegister} />} />
              <Route path="/my-events" element={<MyEvents theme={theme} events={registeredEvents} onCancel={handleCancel} />} />
              <Route path="/event-details/:id" element={<EventDetails allEvents={allEvents} theme={theme} onRegister={handleRegister} />} />
              <Route path="/ticket-confirmation/:id" element={<TicketConfirmation allEvents={allEvents} theme={theme} onCancel={handleCancel} />} />
            </>
          )}

          <Route path="/profile" element={<Profile user={user} theme={theme} onLogout={handleLogout} setUser={setUser} />} />
          <Route path="/edit-profile" element={<EditProfile user={user} setUser={setUser} theme={theme} />} />
          <Route path="/change-password" element={<ChangePassword theme={theme} />} />
          <Route path="/settings/theme" element={<ThemeSelection currentTheme={theme} setTheme={setTheme} />} />
          <Route path="/settings/language" element={<LanguageSelection currentLanguage="English" setLanguage={() => {}} theme={theme} />} />
          <Route path="/notifications" element={<Notifications theme={theme} user={user} registrations={registrations} notificationsList={notifications} />} />
          <Route path="/privacy" element={<PrivacyPolicy theme={theme} />} />
          <Route path="/help" element={<HelpCenter theme={theme} />} />
          <Route path="/settings" element={<Settings theme={theme} user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {shouldShowNav && isMobile && <BottomNav theme={theme} user={user} />}
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('isAuthenticated');
    return saved === 'true';
  });
  
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultUser;
      }
    }
    return defaultUser;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  useEffect(() => {
    if (user && user.name !== "Guest") {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  const handleLogin = useCallback((userData) => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token || '');
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(defaultUser);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
  }, []);

  const [allEvents, setAllEvents] = useState(defaultEvents);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  const fetchEvents = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setEventsLoading(true);
    try {
      const token = localStorage.getItem('token') || user?.token;
      if (!token) {
        console.log('[App.js] No token found');
        setEventsLoading(false);
        return;
      }
      
      const response = await api.get('/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const backendEvents = response.data.map(event => ({
        id: event._id,
        title: event.title,
        date: new Date(event.date).toISOString().slice(0, 16).replace('T', ' '),
        location: event.location,
        category: 'Event',
        image: event.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        description: event.description,
        createdBy: event.createdBy
      }));
      
      setAllEvents(backendEvents);
      setEventsError(null);
      console.log('[App.js] Events fetched successfully:', backendEvents.length);
    } catch (error) {
      console.log('[App.js] Failed to fetch events, using mock data:', error.message);
      setEventsError(error.message);
    } finally {
      setEventsLoading(false);
    }
  }, [isAuthenticated, user?.token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const [registrations, setRegistrations] = useState([
    { id: 101, name: "Rahul Kumar", email: "rahul@student.edu", event: "AI & Future Tech Workshop", status: "Pending" },
    { id: 102, name: "Priya Sharma", email: "priya@student.edu", event: "Web Dev Bootcamp", status: "Approved" },
    { id: 103, name: "Amit Verma", email: "amit@student.edu", event: "Inter-College Music Battle", status: "Pending" }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Welcome!", typeLabel: "System", desc: "Welcome to EventSphere.", time: "Just now", icon: <CheckCircle size={20} color="#5c5cfc" />, bgColor: 'rgba(92, 92, 252, 0.1)', eventId: 0 }
  ]);
  const [unreadCount, setUnreadCount] = useState(1);

  const handleRegister = useCallback((eventId) => { 
    const event = allEvents.find(e => e.id === eventId);
    setAllEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, status: 'pending' } : ev)); 
    if(event) {
      const newReg = { id: Date.now(), name: user.name, email: user.email, event: event.title, status: "Pending" };
      setRegistrations(prev => [newReg, ...prev]);
    }
  }, [allEvents, user]);

  const handleCancel = useCallback((eventId) => { 
    setAllEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, status: 'idle' } : ev)); 
  }, []);

  const handleCreateEvent = useCallback(async (newEvent) => {
    try {
      const token = localStorage.getItem('token') || user?.token;
      const response = await api.post('/events', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const backendEvent = {
        id: response.data._id,
        title: response.data.title,
        date: new Date(response.data.date).toISOString().slice(0, 16).replace('T', ' '),
        location: response.data.location,
        category: 'Event',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        description: response.data.description
      };
      
      setAllEvents(prev => [backendEvent, ...prev]);
      console.log('[App.js] Event created successfully');
    } catch (error) {
      console.log('[App.js] Failed to create event:', error.message);
      const mockEvent = { ...newEvent, id: Date.now() };
      setAllEvents(prev => [mockEvent, ...prev]);
    }
  }, [user?.token]);

  const handleDeleteEvent = useCallback((eventId) => { 
    setAllEvents(prev => prev.filter(e => e.id !== eventId)); 
  }, []);

  const handleUpdateEvent = useCallback((eventId, updatedData) => { 
    setAllEvents(prev => prev.map(e => e.id === eventId ? updatedData : e)); 
  }, []);

  const handleApproveReg = useCallback((regId) => {
    let approvedEventName = "";
    setRegistrations(prev => prev.map(r => {
      if (r.id === regId) {
        approvedEventName = r.event; 
        return { ...r, status: 'Approved' };
      }
      return r;
    }));
    if (approvedEventName) {
      setAllEvents(prev => prev.map(ev => 
        ev.title === approvedEventName ? { ...ev, status: 'approved' } : ev
      ));
      const newNotif = { id: Date.now(), title: approvedEventName, typeLabel: "Approved", desc: "Your registration has been approved!", time: "Just now", icon: <CheckCircle size={20} color="#16a34a" />, bgColor: '#dcfce7' };
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const handleRejectReg = useCallback((regId) => {
    let rejectedEventName = "";
    setRegistrations(prev => prev.map(r => {
      if (r.id === regId) {
        rejectedEventName = r.event;
        return { ...r, status: 'Rejected' };
      }
      return r;
    }));
    if (rejectedEventName) {
      setAllEvents(prev => prev.map(ev => 
        ev.title === rejectedEventName ? { ...ev, status: 'idle' } : ev
      ));
      const newNotif = { id: Date.now(), title: rejectedEventName, typeLabel: "Rejected", desc: "Your registration was rejected.", time: "Just now", icon: <XCircle size={20} color="#ef4444" />, bgColor: '#fee2e2' };
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const markNotificationsRead = useCallback(() => setUnreadCount(0), []);
  const filteredEvents = allEvents.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const registeredEvents = allEvents.filter(e => e.status === 'pending' || e.status === 'approved');

  return (
    <Router>
      <AppContent 
        isAuthenticated={isAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout}
        theme={theme} setTheme={setTheme} toggleTheme={toggleTheme} user={user} setUser={setUser}
        allEvents={allEvents} registrations={registrations} registeredEvents={registeredEvents}
        filteredEvents={filteredEvents} notifications={notifications} unreadCount={unreadCount}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        handleRegister={handleRegister} handleCancel={handleCancel} markNotificationsRead={markNotificationsRead}
        handleCreateEvent={handleCreateEvent} handleDeleteEvent={handleDeleteEvent} handleUpdateEvent={handleUpdateEvent}
        handleApproveReg={handleApproveReg} handleRejectReg={handleRejectReg}
      />
    </Router>
  );
}

export default App;
