import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin } from 'lucide-react';
import GradientHeader from '../components/GradientHeader'; // <--- Import

const MyEvents = ({ theme, events, onCancel }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const styles = {
    container: {
      padding: 0,
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      maxWidth: '430px', margin: '0 auto',
      fontFamily: 'sans-serif'
    },
    content: { padding: '20px' },
    emptyState: { textAlign: 'center', marginTop: '60px' },
    ticketCard: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
      position: 'relative'
    },
    statusBadge: (status) => ({
      position: 'absolute', top: '16px', right: '16px',
      fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px',
      backgroundColor: status === 'approved' ? '#dcfce7' : '#fef3c7',
      color: status === 'approved' ? '#16a34a' : '#d97706'
    })
  };

  return (
    <div style={styles.container}>
      {/* HEADER MATCHING THE IMAGE */}
      <GradientHeader 
        title="My Tickets" 
        subtitle={`${events.length} registered events`} 
        showBack={true} 
      />

      <div style={styles.content}>
        {events.length === 0 ? (
          <div style={styles.emptyState}>
            <Ticket size={60} color="#cbd5e1" />
            <p style={{ color: '#94a3b8', margin: '20px 0' }}>No tickets yet</p>
            <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold' }} onClick={() => navigate('/events')}>
              Browse Events
            </button>
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} style={styles.ticketCard}>
              <span style={styles.statusBadge(event.status)}>{event.status}</span>
              <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', paddingRight: '70px', color: isDark ? '#fff' : '#1e293b' }}>{event.title}</h3>
              <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '5px' }}><Calendar size={14} /> {event.date}</div>
              <div style={{ color: '#64748b', fontSize: '13px' }}><MapPin size={14} /> {event.location}</div>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate(`/ticket-confirmation/${event.id}`)}>View</button>
                <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #fee2e2', backgroundColor: '#fff', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => onCancel(event.id)}>Cancel</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyEvents;