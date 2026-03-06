import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Calendar, MapPin, Clock, ArrowRight, Sun, Moon, Star, CheckCircle, ClipboardList, Award, TrendingUp } from 'lucide-react';
import { authAPI, registrationAPI, eventAPI } from '../api';
import styles from './Dashboard.module.css';

const Dashboard = ({ user, theme, unreadCount, onReadNotifications, toggleTheme }) => {
  const navigate = useNavigate();
  const isDark = ['dark', 'purple-gradient', 'blue-ocean', 'midnight-dark', 'emerald-dark', 'cherry-dark', 'slate-minimal'].includes(theme);
  const [currentUser, setCurrentUser] = useState(user);
  const [imageError, setImageError] = useState(false);
  const [realRegCount, setRealRegCount] = useState(0);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [studentEvents, setStudentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  // Sync user from props when it changes
  useEffect(() => {
    if (user && user.name && user.name !== 'Guest') {
      setCurrentUser(user);
      setLoading(false);
    } else {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.name && parsed.name !== 'Guest') {
            setCurrentUser(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing saved user:', e);
        }
      }
      setLoading(false);
    }
  }, [user]);

  // Fetch fresh user data
  useEffect(() => {
    if (!user || !user.name || user.name === 'Guest') return;

    const fetchLatestUserData = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await authAPI.getProfile();
        const updatedUser = {
          ...JSON.parse(savedUser),
          ...response.data,
          token
        };

        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.log('Could not fetch latest user data:', error.message);
      }
    };
    fetchLatestUserData();
  }, [user]);

  // Fetch registrations
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setRealRegCount(0);
          setLoadingRegs(false);
          return;
        }

        const response = await registrationAPI.getMyRegistrations();
        setRealRegCount(response.data?.length || 0);
      } catch (error) {
        console.log('Error fetching registrations:', error.message);
        setRealRegCount(0);
      } finally {
        setLoadingRegs(false);
      }
    };
    fetchRegistrations();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.getAll();
        setStudentEvents(response.data);
      } catch (error) {
        console.log('Error fetching events:', error.message);
        setStudentEvents([]);
      }
    };
    fetchEvents();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  const imageUrl = getImageUrl(currentUser?.profileImage);

  // Functional Calendar Data
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const currentYear = currentMonthDate.getFullYear();
  const currentMonth = currentMonthDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();

  const parseEventDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d) ? null : d;
  };

  const hasEventOnDate = (day) => {
    return studentEvents.some(event => {
      const eDate = parseEventDate(event.date);
      if (!eDate) return false;
      return eDate.getFullYear() === currentYear &&
        eDate.getMonth() === currentMonth &&
        eDate.getDate() === day;
    });
  };

  const filteredUpcomingEvents = selectedDate ? studentEvents.filter(event => {
    const eDate = parseEventDate(event.date);
    if (!eDate) return false;
    return eDate.getFullYear() === selectedDate.getFullYear() &&
      eDate.getMonth() === selectedDate.getMonth() &&
      eDate.getDate() === selectedDate.getDate();
  }) : [];

  const displayEvents = selectedDate
    ? filteredUpcomingEvents
    : studentEvents.filter(event => {
      const eDate = parseEventDate(event.date);
      if (!eDate) return false;
      // fallback to upcoming events from today
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return eDate >= todayStart;
    });

  const nextMonth = () => {
    setCurrentMonthDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonthDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (loading) {
    return (
      <div className={`page-wrapper ${isDark ? 'dark' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ width: 40, height: 40, border: '4px solid #e2e8f0', borderTop: '4px solid #4318FF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`page-wrapper ${isDark ? 'dark' : ''}`}>
      <div className={styles.dashboardRoot}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.profileInfo} onClick={() => navigate('/profile')}>
            <div className={styles.avatarWrapper}>
              <img
                src={imageError ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : imageUrl}
                className={styles.avatar}
                alt="Profile"
                onError={() => setImageError(true)}
              />
            </div>
            <div className={styles.greetingText}>
              <span>Good Morning,</span>
              <span className={styles.userName}>{currentUser?.name || 'Student'}</span>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.searchBar}>
              <Search size={18} color="#A3AED0" />
              <input
                type="text"
                placeholder="Search for events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle Theme">
              {isDark ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} />}
            </button>

            <button className={styles.iconBtn} onClick={() => { onReadNotifications(); navigate('/notifications'); }} title="Notifications">
              <Bell size={20} />
              {unreadCount > 0 && <div className={styles.badge} />}
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className={styles.heroBanner}>
          <div className={styles.heroContent}>
            <h1>Boost your skills with EventSphere!</h1>
            <p>Don't miss out on the latest workshops and technical seminars happening this week.</p>
            <button className={styles.heroBtn} onClick={() => navigate('/events')}>Explore Events</button>
          </div>
          <img
            src="https://img.freepik.com/free-vector/happy-student-with-graduation-cap-diploma_23-2147954930.jpg?w=740"
            alt="Hero"
            className={styles.heroImg}
          />
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#E9EDF7', color: '#4318FF' }}>
              <TrendingUp size={28} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Total Events</span>
              <span className={styles.statVal}>{studentEvents.length}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#E2FBE7', color: '#05CD99' }}>
              <CheckCircle size={28} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Registered</span>
              <span className={styles.statVal}>{realRegCount}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#FFF3E0', color: '#FFA000' }}>
              <Star size={28} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Top Category</span>
              <span className={styles.statVal}>Technical</span>
            </div>
          </div>
        </div>

        {/* Calendar and Upcoming Row */}
        <div className={styles.sideBySideRow}>
          {/* Calendar */}
          <div className={styles.calendarCard}>
            <div className={styles.sectionHead} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className={styles.sectionTitle}>Calendar</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>&lt;</button>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{monthNames[currentMonth]} {currentYear}</span>
                <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>&gt;</button>
              </div>
            </div>
            <div className={styles.calendarMock}>
              {days.map(d => <div key={d} className={styles.calDay}>{d}</div>)}
              {blanks.map(b => <div key={`blank-${b}`} className={styles.calDate} style={{ visibility: 'hidden' }}></div>)}
              {dates.map(d => {
                const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
                const isToday = today.getDate() === d && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
                const hasEvent = hasEventOnDate(d);
                return (
                  <div
                    key={d}
                    onClick={() => setSelectedDate(isSelected ? null : new Date(currentYear, currentMonth, d))}
                    className={`${styles.calDate} ${isSelected ? styles.active : (isToday ? styles.today : '')} ${hasEvent ? styles.hasEvent : ''}`}
                    style={{ cursor: 'pointer', border: isToday && !isSelected ? '2px solid #4318FF' : '', borderRadius: isToday && !isSelected ? '8px' : '' }}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming List */}
          <div className={styles.upcomingCard}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle} style={{ fontSize: '16px' }}>
                {selectedDate
                  ? `Events on ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()].substring(0, 3)}`
                  : 'Upcoming Events'}
              </h2>
            </div>
            <div className={styles.upcomingList}>
              {displayEvents.length > 0 ? (
                displayEvents.slice(0, 3).map((event, idx) => {
                  const eDate = parseEventDate(event.date);
                  const displayDay = eDate ? eDate.getDate() : '--';
                  const displayMonth = eDate ? monthNames[eDate.getMonth()].substring(0, 3).toUpperCase() : 'TBA';
                  return (
                    <div key={idx} className={styles.upcomingItem} style={{ cursor: 'pointer' }} onClick={() => navigate(`/events/${event._id}`)}>
                      <div className={styles.dateBox}>
                        <span>{displayDay}</span>
                        <span>{displayMonth}</span>
                      </div>
                      <div className={styles.upcomingInfo}>
                        <h4>{event.title}</h4>
                        <span>{event.location || 'College Campus'}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#A3AED0' }}>
                  No events found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className={styles.mainArea}>
          {/* Registered Events */}
          <section>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Registered Events</h2>
              <div className={styles.viewAll} onClick={() => navigate('/registrations')}>
                My Tickets <ArrowRight size={18} />
              </div>
            </div>
            <div className={styles.eventGrid}>
              {studentEvents.length > 0 ? (
                studentEvents.slice(2, 5).map((event) => (
                  <div key={event._id} className={styles.eventCard} onClick={() => navigate(`/events/${event._id}`)}>
                    <div className={styles.eventImgWrap}>
                      <img src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"} alt={event.title} />
                    </div>
                    <div className={styles.eventBody}>
                      <h3 className={styles.eventTitle}>{event.title}</h3>
                      <div className={styles.eventMeta}>
                        <Clock size={14} />
                        <span>Happening Soon</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', color: '#A3AED0', border: '1px dashed #E2E8F0' }}>
                  You haven't registered for any events yet. Explore and join!
                </div>
              )}
            </div>
          </section>

          {/* Featured Events */}
          <section>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Featured Events</h2>
              <div className={styles.viewAll} onClick={() => navigate('/events')}>
                See all <ArrowRight size={18} />
              </div>
            </div>
            <div className={styles.eventGrid}>
              {studentEvents.slice(0, 3).map((event) => (
                <div key={event._id} className={styles.eventCard} onClick={() => navigate(`/events/${event._id}`)}>
                  <div className={styles.eventImgWrap}>
                    <img src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"} alt={event.title} />
                    <span className={styles.categoryBadge}>{event.category || 'General'}</span>
                  </div>
                  <div className={styles.eventBody}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <div className={styles.eventMeta}>
                      <Calendar size={14} />
                      <span>{event.date?.split('·')[0] || 'Date TBA'}</span>
                    </div>
                    <div className={styles.eventMeta}>
                      <MapPin size={14} />
                      <span>{event.location || 'Online'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
