import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft, Clock, CheckCircle } from 'lucide-react';

const EventDetails = ({ allEvents, theme, onRegister }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  // Find the event data based on the ID in the URL
  const event = allEvents.find(e => e.id === parseInt(id));

  if (!event) return <div style={{ padding: '20px', color: isDark ? '#fff' : '#000' }}>Event not found</div>;

  const styles = {
    container: {
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      maxWidth: '430px', 
      margin: '0 auto',   
      position: 'relative',
      paddingBottom: '160px', 
      fontFamily: 'sans-serif',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)'
    },
    topHeader: {
      padding: '16px',
      textAlign: 'center',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      fontWeight: 'bold',
      fontSize: '18px',
      color: isDark ? '#fff' : '#1e293b',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    bannerContainer: {
      width: '100%',
      height: '260px',
      position: 'relative'
    },
    bannerImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    contentCard: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderTopLeftRadius: '30px',
      borderTopRightRadius: '30px',
      marginTop: '-40px', 
      padding: '24px',
      position: 'relative',
      zIndex: 1,
      minHeight: '500px'
    },
    badge: {
      display: 'inline-block',
      backgroundColor: '#5c5cfc',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginBottom: '16px',
      textTransform: 'uppercase'
    },
    title: {
      fontSize: '24px',
      fontWeight: '800',
      color: isDark ? '#fff' : '#1e293b',
      marginBottom: '20px',
      lineHeight: '1.3'
    },
    infoRow: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
      alignItems: 'flex-start'
    },
    infoIcon: {
      color: '#64748b',
      marginTop: '2px',
      flexShrink: 0
    },
    infoText: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: isDark ? '#fff' : '#1e293b',
      marginBottom: '2px'
    },
    subLabel: {
      fontSize: '13px',
      color: '#94a3b8'
    },
    divider: {
      height: '1px',
      backgroundColor: isDark ? '#334155' : '#f1f5f9',
      margin: '24px 0'
    },
    aboutHeader: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#1e293b',
      marginBottom: '12px'
    },
    description: {
      color: '#94a3b8',
      fontSize: '14px',
      lineHeight: '1.6'
    },
    footer: {
      position: 'fixed',
      bottom: 0,
      left: '50%', 
      transform: 'translateX(-50%)', 
      width: '100%',
      maxWidth: '430px', 
      backgroundColor: isDark ? '#1e293b' : '#fff',
      padding: '20px 24px',
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      zIndex: 100,
      boxSizing: 'border-box'
    },
    btnBase: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    registerBtn: {
      backgroundColor: '#5c5cfc',
      color: '#fff',
      cursor: 'pointer'
    },
    pendingBtn: {
      backgroundColor: '#f59e0b', // Orange/Yellow
      color: '#fff',
      cursor: 'default'
    },
    approvedBtn: {
      backgroundColor: '#22c55e', // Green
      color: '#fff',
      cursor: 'pointer'
    },
    backBtn: {
      width: '100%',
      backgroundColor: 'transparent',
      color: isDark ? '#fff' : '#1e293b',
      padding: '16px',
      borderRadius: '12px',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topHeader}>
         Event Details
      </div>

      <div style={styles.bannerContainer}>
        <img src={event.image} alt={event.title} style={styles.bannerImage} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)' }}></div>
      </div>

      <div style={styles.contentCard}>
        <span style={styles.badge}>{event.category || 'EVENT'}</span>
        <h1 style={styles.title}>{event.title}</h1>

        <div style={styles.infoRow}>
          <Calendar size={20} style={styles.infoIcon} />
          <div style={styles.infoText}>
            <span style={styles.label}>{event.date.split('·')[0]}</span>
            <span style={styles.subLabel}>{event.date.split('·')[1]}</span>
          </div>
        </div>

        <div style={styles.infoRow}>
          <MapPin size={20} style={styles.infoIcon} />
          <div style={styles.infoText}>
            <span style={styles.label}>{event.location}</span>
            <span style={styles.subLabel}>Central Campus</span>
          </div>
        </div>

        <div style={styles.infoRow}>
          <Users size={20} style={styles.infoIcon} />
          <div style={styles.infoText}>
            <span style={styles.label}>45 Seats Left</span>
            <span style={styles.subLabel}>Hurry up, filling fast!</span>
          </div>
        </div>

        <div style={styles.divider}></div>

        <h3 style={styles.aboutHeader}>About Event</h3>
        <p style={styles.description}>
          Join us for the biggest student tech summit of the year. Explore the latest in AI, Blockchain, and Cloud Computing with industry experts. Lunch and certificates provided for all attendees.
        </p>
      </div>

      {/* --- THIS IS THE CRITICAL FIX --- */}
      <div style={styles.footer}>
        
        {/* If Status is IDLE (Not registered), show 'Request Registration' */}
        {(!event.status || event.status === 'idle') && (
          <button 
            style={{ ...styles.btnBase, ...styles.registerBtn }}
            onClick={() => {
              onRegister(event.id);
              navigate('/my-events'); // Redirects to My Events to show "Processing"
            }}
          >
            Request Registration
          </button>
        )}

        {/* If Status is PENDING, show 'Waiting Approval' */}
        {event.status === 'pending' && (
          <button 
            style={{ ...styles.btnBase, ...styles.pendingBtn }}
            disabled
          >
            <Clock size={20} /> Waiting Approval...
          </button>
        )}

        {/* If Status is APPROVED, show 'View Ticket' */}
        {event.status === 'approved' && (
          <button 
            style={{ ...styles.btnBase, ...styles.approvedBtn }}
            onClick={() => navigate(`/ticket-confirmation/${event.id}`)}
          >
            <CheckCircle size={20} /> View Ticket
          </button>
        )}

        <button 
          style={styles.backBtn} 
          onClick={() => navigate(-1)} 
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EventDetails;