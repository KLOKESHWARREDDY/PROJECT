import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, ChevronRight, Filter } from 'lucide-react';
import { eventAPI } from '../api';

const TeacherMyEvents = ({ events, theme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState("All");
  const [teacherEvents, setTeacherEvents] = useState([]);

  // RESPONSIVE CHECK
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ FETCH TEACHER'S OWN EVENTS
  useEffect(() => {
    const fetchTeacherEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("TeacherMyEvents token:", token);
        
        const response = await eventAPI.getTeacherEvents();
        console.log("TeacherMyEvents response:", response.data);
        
        setTeacherEvents(response.data);
      } catch (error) {
        console.log('Error fetching teacher events:', error.message);
        setTeacherEvents([]);
      }
    };
    
    fetchTeacherEvents();
  }, []);

  const filteredEvents = teacherEvents.filter((event) => {
    console.log("Filtering:", activeFilter, "===", event.status);
    if (activeFilter === "All") return true;
    return event.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  const styles = {
    container: {
      padding: isMobile ? '4vw' : '2vw',
      maxWidth: isMobile ? '100vw' : '60vw',
      margin: '0 auto',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      color: isDark ? '#fff' : '#1e293b'
    },
    header: { display: 'flex', alignItems: 'center', gap: '2vw', marginBottom: '3vh' },
    backBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: isDark ? '#fff' : '#64748b', display: 'flex', alignItems: 'center'
    },
    pageTitle: { fontSize: isMobile ? '6vw' : '2vw', fontWeight: '800' },

    // Filter Bar
    filterBar: {
      display: 'flex', gap: '1vw', marginBottom: '3vh', overflowX: 'auto', paddingBottom: '1vh'
    },
    filterBtn: (isActive) => ({
      padding: isMobile ? '1vh 4vw' : '0.8vh 1.5vw',
      borderRadius: '2vw', border: 'none', cursor: 'pointer',
      fontSize: isMobile ? '3.5vw' : '0.9vw', fontWeight: '600', whiteSpace: 'nowrap',
      backgroundColor: isActive ? '#4f46e5' : (isDark ? '#1e293b' : '#fff'),
      color: isActive ? '#fff' : (isDark ? '#94a3b8' : '#64748b'),
      border: isActive ? 'none' : (isDark ? '1px solid #334155' : '1px solid #e2e8f0'),
      transition: 'all 0.2s'
    }),

    // Event Card
    eventCard: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: isMobile ? '3vw' : '1.2vw',
      padding: isMobile ? '3vw' : '1.5vw',
      marginBottom: '2vh',
      display: 'flex', gap: '2vw', alignItems: 'center',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      cursor: 'pointer', transition: 'transform 0.1s',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    },
    eventImage: {
      width: isMobile ? '18vw' : '5vw', height: isMobile ? '18vw' : '5vw',
      borderRadius: isMobile ? '2vw' : '0.8vw', objectFit: 'cover'
    },
    eventInfo: { flex: 1 },
    eventTitle: { fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold', marginBottom: '0.5vh' },
    eventMeta: { display: 'flex', gap: '2vw', color: '#64748b', fontSize: isMobile ? '3vw' : '0.85vw' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '0.5vw' },
    
    // Status Badge - Updated for Draft/Published/Completed
    statusBadge: (status) => ({
      padding: '0.4vh 1.5vw', borderRadius: '2vw',
      fontSize: isMobile ? '2.5vw' : '0.7vw', fontWeight: '700', textTransform: 'uppercase',
      backgroundColor: status === 'published' ? '#dcfce7' : status === 'draft' ? '#fef3c7' : status === 'completed' ? '#e0e7ff' : '#f1f5f9',
      color: status === 'published' ? '#166534' : status === 'draft' ? '#92400e' : status === 'completed' ? '#4338ca' : '#475569'
    }),
    arrow: { color: isDark ? '#475569' : '#cbd5e1' }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    if (dateStr.includes('·')) return dateStr.split('·')[0];
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  // Helper to format time
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('·')) return dateStr.split('·')[1];
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={isMobile ? 24 : 24} />
        </button>
        <h1 style={styles.pageTitle}>My Created Events</h1>
      </div>

      {/* Updated filter buttons for Draft/Published/Completed */}
      <div style={styles.filterBar}>
        {['All', 'draft', 'published', 'completed'].map((filter) => (
          <button 
            key={filter} 
            style={styles.filterBtn(activeFilter === filter)}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div 
              key={event._id} 
              style={styles.eventCard}
              onClick={() => {
                const eventId = event.id || event._id;
                console.log("Clicked Event ID:", eventId, "Status:", event.status);
                // Go to event details page
                navigate(`/teacher-event-details/${eventId}`);
              }}
            >
              <img src={event.image} alt={event.title} style={styles.eventImage} />
              
              <div style={styles.eventInfo}>
                <h3 style={styles.eventTitle}>{event.title}</h3>
                <div style={styles.eventMeta}>
                  <span style={styles.metaItem}><Calendar size={12}/> {formatDate(event.date)}</span>
                  {formatTime(event.date) && (
                    <span style={styles.metaItem}><Clock size={12}/> {formatTime(event.date)}</span>
                  )}
                </div>
              </div>

              <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.5vh'}}>
                <span style={styles.statusBadge(event.status)}>
                  {event.status === 'published' ? 'Published' : event.status === 'draft' ? 'Draft' : 'Completed'}
                </span>
                <ChevronRight size={16} style={styles.arrow} />
              </div>
            </div>
          ))
        ) : (
          <div style={{textAlign:'center', padding:'5vh', color:'#64748b'}}>
            No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} events found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherMyEvents;
