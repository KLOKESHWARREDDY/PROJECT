import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Edit3, Trash2, Users, AlertTriangle, MapPin, Tag } from 'lucide-react';
import { eventAPI } from '../api';

const TeacherEventDetails = ({ events, onDelete, theme }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isDark = theme === 'dark';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Fetch event from backend on mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventAPI.getEventById(id);
        setEvent(response.data);
      } catch (error) {
        // Fallback to finding from props
        const foundEvent = events.find((e) => e.id === id || e._id === id);
        setEvent(foundEvent || null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEvent();
    }
  }, [id, events]);

  // Responsive listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDelete = async () => {
    const eventId = event._id || event.id;
    try {
      await onDelete(eventId, () => navigate('/teacher-events'));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Format date and time
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

  const styles = {
    container: { 
      padding: isMobile ? '4vw' : '20px', 
      backgroundColor: isDark ? '#0f172a' : '#EFF6FF', 
      minHeight: '100vh', 
      color: isDark ? '#fff' : '#1e293b',
      fontFamily: "'Inter', sans-serif"
    },
    header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
    backBtn: { background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#fff' : '#64748b' },
    pageTitle: { fontSize: isMobile ? '6vw' : '24px', fontWeight: '800' },
    
    card: { 
      backgroundColor: isDark ? '#1e293b' : '#ffffff', 
      borderRadius: isMobile ? '4vw' : '15px', 
      overflow: 'hidden', 
      marginTop: '20px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
    },
    image: { width: '100%', height: isMobile ? '200px' : '300px', objectFit: 'cover' },
    content: { padding: isMobile ? '4vw' : '20px' },
    
    titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' },
    title: { fontSize: isMobile ? '5vw' : '24px', fontWeight: 'bold', margin: 0 },
    
    // Status badge
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: event?.status === 'published' ? '#dcfce7' : event?.status === 'draft' ? '#fef3c7' : event?.status === 'completed' ? '#EFF6FF' : '#f1f5f9',
      color: event?.status === 'published' ? '#166534' : event?.status === 'draft' ? '#92400e' : event?.status === 'completed' ? '#1E3A8A' : '#475569',
    },
    
    metaRow: { display: 'flex', gap: isMobile ? '4vw' : '20px', margin: '15px 0', color: '#64748b', flexWrap: 'wrap' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: isMobile ? '3vw' : '14px' },
    
    description: { color: isDark ? '#cbd5e1' : '#475569', lineHeight: '1.6', marginTop: '15px' },
    
    // Button grid
    btnGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '30px' },
    fullWidthBtn: { gridColumn: '1 / -1' },
    
    btn: (bg, color) => ({
      backgroundColor: bg, 
      color: color, 
      padding: isMobile ? '12px' : '12px', 
      borderRadius: isMobile ? '2vw' : '8px', 
      border: 'none', 
      fontWeight: 'bold', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '8px', 
      fontSize: isMobile ? '3.5vw' : '14px'
    }),
    
    // Delete popup
    popupOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
    popup: { background: isDark ? '#1e293b' : '#fff', padding: '30px', borderRadius: '15px', textAlign: 'center', width: '80%', maxWidth: '350px' },
    popupBtnRow: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' },
    cancelBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: isDark ? '#334155' : '#e2e8f0' },
    deleteBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer' },
  };

  if (loading) return <div style={{padding:'20px', color: isDark?'#fff':'#000'}}>Loading...</div>;
  if (!event) return <div style={{padding:'20px', color: isDark?'#fff':'#000'}}>Event not found</div>;

  const eventStatus = event.status || 'draft';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/teacher-events')}>
          <ArrowLeft size={isMobile ? 24 : 24} />
        </button>
        <h1 style={styles.pageTitle}>Event Details</h1>
      </div>

      <div style={styles.card}>
        <img src={event.image} alt={event.title} style={styles.image} />
        
        <div style={styles.content}>
          <div style={styles.titleRow}>
            <h1 style={styles.title}>{event.title}</h1>
            <span style={styles.statusBadge}>
              {eventStatus === 'published' ? 'Published' : eventStatus === 'draft' ? 'Draft' : 'Completed'}
            </span>
          </div>
          
          <div style={styles.metaRow}>
            <span style={styles.metaItem}><Calendar size={isMobile ? 16 : 18}/> {formatDate(event.date)}</span>
            {formatTime(event.date) && (
              <span style={styles.metaItem}><Clock size={isMobile ? 16 : 18}/> {formatTime(event.date)}</span>
            )}
          </div>
          
          <div style={styles.metaRow}>
            <span style={styles.metaItem}><Tag size={isMobile ? 16 : 18}/> {event.category || 'General'}</span>
            <span style={styles.metaItem}><MapPin size={isMobile ? 16 : 18}/> {event.location || 'TBD'}</span>
          </div>
          
          <p style={styles.description}>{event.description || "No description provided."}</p>

          <div style={styles.btnGrid}>
            {/* Edit Button - Show for Draft and Published */}
            {(eventStatus === 'draft' || eventStatus === 'published') && (
              <button 
                style={styles.btn('#2563EB', '#fff')} 
                onClick={() => navigate(`/edit-event/${event._id || event.id}`)}
              >
                <Edit3 size={isMobile ? 16 : 18}/> Edit Event
              </button>
            )}

            {/* View Registrations - Show for Published and Completed */}
            {(eventStatus === 'published' || eventStatus === 'completed') && (
              <button 
                style={styles.btn(isDark ? '#334155' : '#EFF6FF', isDark ? '#fff' : '#1E3A8A')} 
                onClick={() => navigate(`/event-registrations/${event._id || event.id}`)}
              >
                <Users size={isMobile ? 16 : 18}/> View Registrations
              </button>
            )}

            {/* Delete Button - Always show */}
            <button 
              style={{...styles.btn('#fee2e2', '#ef4444'), ...styles.fullWidthBtn}} 
              onClick={() => setShowDeletePopup(true)}
            >
              <Trash2 size={isMobile ? 16 : 18}/> Delete Event
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div style={styles.popupOverlay} onClick={() => setShowDeletePopup(false)}>
          <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={40} color="#ef4444" style={{marginBottom:'10px'}}/>
            <h3 style={{color: isDark?'#fff':'#000', marginBottom: '10px'}}>Delete Event?</h3>
            <p style={{color:'#64748b', marginBottom:'20px'}}>Are you sure you want to delete this event?</p>
            <div style={styles.popupBtnRow}>
              <button onClick={() => setShowDeletePopup(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleDelete} style={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherEventDetails;
