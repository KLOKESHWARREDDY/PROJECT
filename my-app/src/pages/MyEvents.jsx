import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Clock } from 'lucide-react';

const MyEvents = ({ theme, events, onCancel }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const styles = {
    container: {
      padding: '24px',
      fontFamily: 'sans-serif',
      maxWidth: '1000px', // Slightly narrower for reading list comfort
      margin: '0 auto',
      minHeight: '100vh',
      color: isDark ? '#fff' : '#1e293b'
    },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px' },
    subtitle: { color: '#64748b', fontSize: '16px' },

    // Empty State
    emptyState: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '60px 20px', textAlign: 'center',
      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
      borderRadius: '20px', border: isDark ? '1px dashed #334155' : '2px dashed #e2e8f0'
    },
    browseBtn: {
      marginTop: '20px',
      backgroundColor: '#3b82f6', color: '#fff',
      padding: '12px 24px', borderRadius: '8px',
      border: 'none', fontWeight: 'bold', cursor: 'pointer',
      fontSize: '15px'
    },

    // Ticket List
    list: { display: 'flex', flexDirection: 'column', gap: '20px' },
    
    // Ticket Card (Horizontal Layout)
    ticketCard: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: '16px',
      padding: '24px',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column', // Mobile first: stacked
      gap: '20px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
      position: 'relative',
      // Responsive Desktop style
      '@media (min-width: 768px)': {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    },
    // Left side of ticket
    ticketInfo: { flex: 1 },
    ticketTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' },
    metaRow: { display: 'flex', gap: '20px', flexWrap: 'wrap', color: '#64748b', fontSize: '14px' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '6px' },
    
    // Status Badge
    badge: (status) => ({
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginBottom: '12px',
      backgroundColor: status === 'approved' ? '#dcfce7' : '#fef3c7',
      color: status === 'approved' ? '#15803d' : '#b45309'
    }),

    // Action Buttons
    actions: {
      display: 'flex',
      gap: '12px',
      marginTop: '10px'
    },
    viewBtn: {
      flex: 1,
      padding: '10px 20px',
      borderRadius: '8px',
      backgroundColor: '#f1f5f9',
      color: '#0f172a',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px'
    },
    cancelBtn: {
      flex: 1,
      padding: '10px 20px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      color: '#ef4444',
      border: '1px solid #fee2e2',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Tickets</h1>
        <p style={styles.subtitle}>Manage your upcoming events and registrations.</p>
      </div>

      {events.length === 0 ? (
        <div style={styles.emptyState}>
          <Ticket size={64} color="#cbd5e1" strokeWidth={1.5} />
          <h3 style={{ marginTop: '20px', color: isDark ? '#fff' : '#334155' }}>No tickets yet</h3>
          <p style={{ color: '#94a3b8' }}>You haven't registered for any events yet.</p>
          <button style={styles.browseBtn} onClick={() => navigate('/events')}>
            Browse Events
          </button>
        </div>
      ) : (
        <div style={styles.list}>
          {events.map(event => (
            <div key={event._id} style={styles.ticketCard}>
              <div style={styles.ticketInfo}>
                <span style={styles.badge(event.status)}>
                  {event.status === 'approved' ? 'Confirmed' : 'Pending Approval'}
                </span>
                <h3 style={styles.ticketTitle}>{event.title}</h3>
                
                <div style={styles.metaRow}>
                  <div style={styles.metaItem}><Calendar size={16} /> {event.date}</div>
                  <div style={styles.metaItem}><MapPin size={16} /> {event.location}</div>
                  <div style={styles.metaItem}><Clock size={16} /> 09:00 AM</div>
                </div>
              </div>

              <div style={styles.actions}>
                {event.status === 'approved' && (
                  <button 
                    style={styles.viewBtn} 
                    onClick={() => navigate(`/ticket/${event.registrationId}`)}
                  >
                    View Ticket
                  </button>
                )}
                <button 
                  style={styles.cancelBtn} 
                  onClick={() => onCancel(event.registrationId)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;