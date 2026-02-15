import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
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

import api, { registrationAPI, eventAPI } from './api';


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
              <Route path="/ticket/:id" element={<TicketConfirmation allEvents={allEvents} theme={theme} onCancel={handleCancel} />} />
              <Route path="/ticket-confirmation/:id" element={<TicketConfirmation allEvents={allEvents} theme={theme} onCancel={handleCancel} />} />
              <Route path="/event-registrations/:id" element={<EventSpecificRegistrations events={allEvents} registrations={registrations} onApprove={handleApproveReg} onReject={handleRejectReg} theme={theme} />} />
            </>
          )}

          {!isTeacher && (
            <>
              <Route path="/events" element={<Events allEvents={filteredEvents} theme={theme} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onRegister={handleRegister} />} />
              <Route path="/events/:id" element={<EventDetails allEvents={allEvents} registrations={registrations} theme={theme} onRegister={handleRegister} />} />
              <Route path="/my-events" element={<MyEvents theme={theme} events={registeredEvents} onCancel={handleCancel} />} />
              <Route path="/ticket/:id" element={<TicketConfirmation allEvents={allEvents} theme={theme} onCancel={handleCancel} />} />
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
  
  const [authLoading, setAuthLoading] = useState(true);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [user, setUser] = useState(null);

  // Initialize auth state and fetch user from API on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Try to restore user from localStorage first
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser && parsedUser.name && parsedUser.name !== 'Guest') {
              setUser(parsedUser);
              setIsAuthenticated(true);
            }
          } catch (e) {
            console.error('Error parsing saved user:', e);
          }
        }
        
        // Then fetch fresh user data from API
        try {
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userData = response.data;
          setUser({ ...userData, token });
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify({ ...userData, token }));
          console.log('[App] User fetched from API on init:', userData.name);
        } catch (error) {
          console.log('[App] Could not fetch user from API:', error.message);
          // If API fails but we have saved user, keep authenticated
          if (savedUser) {
            setIsAuthenticated(true);
          }
        }
      }
      
      setAuthLoading(false);
    };
    
    initAuth();
  }, []);

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

  const handleLogin = useCallback(async (userData) => {
    if (userData) {
      const token = userData.token || '';
      
      // Save to localStorage first
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      // Fetch fresh user data from API
      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const freshUser = response.data;
        setUser({ ...freshUser, token });
        localStorage.setItem('user', JSON.stringify({ ...freshUser, token }));
        console.log('[App] Fresh user fetched after login:', freshUser.name);
      } catch (error) {
        console.log('[App] Could not fetch fresh user:', error.message);
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    // Clear axios default header
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const [allEvents, setAllEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('token') || user?.token;
      if (!token) {
        console.log('[App.js] No token found');
        return;
      }
      
      // Use single endpoint - backend handles role-based filtering
      const response = await api.get('/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Events from API:", response.data)
      console.log("Upcoming events response:", response.data)
      
      const backendEvents = response.data.map(event => ({
        id: event._id,
        _id: event._id,
        title: event.title,
        date: new Date(event.date).toISOString().slice(0, 16).replace('T', ' '),
        location: event.location,
        category: 'Event',
        image: event.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        description: event.description,
        teacher: event.teacher,
        status: event.status || 'draft'
      }));
      
      setAllEvents(backendEvents);
      console.log('[App.js] Events fetched successfully:', backendEvents.length);
    } catch (error) {
      console.log('[App.js] Failed to fetch events, using mock data:', error.message);
    }
  }, [isAuthenticated, user?.token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const [registrations, setRegistrations] = useState([]);

  // Fetch registrations from database - pass student ID
  const fetchRegistrations = useCallback(async () => {
    if (!isAuthenticated || !user?._id) return;
    
    try {
      const token = localStorage.getItem('token') || user?.token;
      if (!token) {
        console.log('[App.js] No token available for fetching registrations');
        return;
      }
      
      console.log('[App.js] Fetching student registrations for user:', user._id);
      const response = await registrationAPI.getStudentRegistrations(user._id);
      console.log('[App.js] Registrations fetched successfully, count:', response.data.length);
      setRegistrations(response.data);
    } catch (error) {
      console.log('[App.js] Failed to fetch registrations:', error.message);
    }
  }, [isAuthenticated, user?._id, user?.token]);

  // Trigger registration refresh when needed (called from EventDetails)
  const refreshRegistrations = useCallback(async () => {
    console.log('[App.js] Refreshing registrations...');
    await fetchRegistrations();
  }, [fetchRegistrations]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Welcome!", typeLabel: "System", desc: "Welcome to EventSphere.", time: "Just now", icon: <CheckCircle size={20} color="#5c5cfc" />, bgColor: 'rgba(92, 92, 252, 0.1)', eventId: 0 }
  ]);
  const [unreadCount, setUnreadCount] = useState(1);

  // handleRegister now accepts an optional callback for navigation
  const handleRegister = useCallback(async (eventId, onSuccess) => {
    // Don't check allEvents - just send to API. Backend validates event exists.
    console.log("[App.js] Registering for event:", eventId);
    
    try {
      // Call API to register
      console.log("[App.js] Sending registration request for eventId:", eventId);
      const response = await registrationAPI.register(eventId);
      console.log("[App.js] Registration response status:", response.status);
      console.log("[App.js] Registration response:", response.data);
      
      if (response.data.registration) {
        console.log("[App.js] Registration saved with ID:", response.data.registration._id);
        console.log("[App.js] Registration status:", response.data.registration.status);
      }
      
      // Update local state if event exists in allEvents - check both id and _id
      setAllEvents(prev => prev.map(ev => (ev.id === eventId || ev._id === eventId) ? { ...ev, status: 'pending' } : ev));
      
      // Refresh registrations from database
      await fetchRegistrations();
      
      console.log("[App.js] Registration completed successfully!");
      toast.success('Registration successful! Waiting for teacher approval.');
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log("[App.js] Registration FAILED:");
      console.log("[App.js] Error:", error.message);
      console.log("[App.js] Error response:", error.response?.data);
      console.log("[App.js] Error status:", error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error('Registration failed: ' + errorMessage);
    }
  }, [allEvents, fetchRegistrations]);

  // Student cancels their registration
  const handleCancel = useCallback(async (registrationId) => { 
    console.log('[App.js] Cancelling registration:', registrationId);
    try {
      const response = await registrationAPI.cancel(registrationId);
      console.log('[App.js] Cancel response:', response.data);
      
      // Remove from local state
      setRegistrations(prev => prev.filter(r => r._id !== registrationId));
      
      toast.success('Registration cancelled successfully!');
    } catch (error) {
      console.log('[App.js] Failed to cancel registration:', error.response?.data || error.message);
      toast.error('Failed to cancel: ' + (error.response?.data?.message || error.message));
    }
  }, []);

  const handleCreateEvent = useCallback(async (newEvent) => {
    try {
      const token = localStorage.getItem('token') || user?.token;
      const response = await api.post('/events', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const backendEvent = {
        id: response.data._id,
        _id: response.data._id,
        title: response.data.title,
        date: new Date(response.data.date).toISOString().slice(0, 16).replace('T', ' '),
        location: response.data.location,
        category: 'Event',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        description: response.data.description,
        status: response.data.status || 'draft'
      };
      
      setAllEvents(prev => [backendEvent, ...prev]);
      console.log('[App.js] Event created successfully');
    } catch (error) {
      console.log('[App.js] Failed to create event:', error.message);
      const mockEvent = { ...newEvent, id: Date.now() };
      setAllEvents(prev => [mockEvent, ...prev]);
    }
  }, [user?.token]);

  const handleDeleteEvent = useCallback(async (eventId, navigateCallback) => { 
    console.log('[App] Deleting event:', eventId);
    try {
      const token = localStorage.getItem('token') || user?.token;
      if (!token) {
        alert('Authentication error. Please login again.');
        return;
      }
      
      // Use eventAPI to delete
      const response = await eventAPI.delete(eventId);
      console.log('[App] Delete response:', response.data);
      console.log('[App] Event deleted successfully from MongoDB');
      
      // Remove from local state after successful delete
      setAllEvents(prev => prev.filter(e => e.id !== eventId && e._id !== eventId));
      
      alert('Event deleted successfully!');
      
      // Navigate if callback provided
      if (navigateCallback) {
        navigateCallback();
      }
    } catch (error) {
      console.error('[App] Error deleting event:', error.message);
      console.error('[App] Error response:', error.response?.data);
      
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete event';
      alert('Error: ' + errorMsg);
    }
  }, [user?.token]);

  const handleUpdateEvent = useCallback(async (eventId, updatedData) => { 
    try {
      const response = await api.put(`/events/${eventId}`, updatedData);
      const updatedEvent = response.data;
      setAllEvents(prev => prev.map(e => (e.id === eventId || e._id === eventId) ? updatedEvent : e));
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      // Fallback to local update if API fails
      setAllEvents(prev => prev.map(e => (e.id === eventId || e._id === eventId) ? updatedData : e));
      throw error;
    }
  }, []);

  const handleApproveReg = useCallback(async (regId) => {
    try {
      console.log('[App.js] Approving registration:', regId);
      const response = await registrationAPI.approve(regId);
      console.log('[App.js] Approve response:', response.data);
      
      // Update local registrations state
      setRegistrations(prev => prev.map(r => 
        r._id === regId ? { ...r, status: 'approved', ticketId: response.data.ticket?.ticketCode } : r
      ));
      
      console.log('[App.js] Registration approved successfully!');
      toast.success('Registration approved! Ticket generated.');
    } catch (error) {
      console.log('[App.js] Failed to approve registration:', error.response?.data || error.message);
      toast.error('Failed to approve: ' + (error.response?.data?.message || error.message));
    }
  }, []);

  const handleRejectReg = useCallback(async (regId) => {
    try {
      console.log('[App.js] Rejecting registration:', regId);
      const response = await registrationAPI.reject(regId);
      console.log('[App.js] Reject response:', response.data);
      
      // Update local registrations state
      setRegistrations(prev => prev.map(r => 
        r._id === regId ? { ...r, status: 'rejected' } : r
      ));
      
      console.log('[App.js] Registration rejected successfully!');
      toast.success('Registration rejected.');
    } catch (error) {
      console.log('[App.js] Failed to reject registration:', error.response?.data || error.message);
      toast.error('Failed to reject: ' + (error.response?.data?.message || error.message));
    }
  }, []);

  const markNotificationsRead = useCallback(() => setUnreadCount(0), []);
  const filteredEvents = allEvents.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
  
  // MyEvents should use registrations from database
  const registeredEvents = registrations.map(reg => ({
    _id: reg.event?._id || reg.event,
    id: reg.event?._id || reg.event,
    title: reg.event?.title || 'Event',
    date: reg.event?.date || '',
    location: reg.event?.location || '',
    image: reg.event?.image || '',
    status: reg.status,
    registrationId: reg._id
  }));

  // Show loading while restoring auth state
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

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
