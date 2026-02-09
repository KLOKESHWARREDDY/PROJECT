import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = ({ theme, notificationsList }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // Use the list passed from App.js (or fallback to empty array)
  const notifications = notificationsList || [];

  const styles = {
    container: { padding: '20px', backgroundColor: isDark ? '#0f172a' : '#fff', minHeight: '100vh', maxWidth: '430px', margin: '0 auto', boxSizing: 'border-box', fontFamily: 'sans-serif' },
    header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' },
    pageTitle: { margin: 0, fontSize: '24px', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b' },
    card: { display: 'flex', gap: '15px', padding: '16px', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9', marginBottom: '15px', backgroundColor: isDark ? '#1e293b' : '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'transform 0.2s ease' },
    iconBox: (bgColor) => ({ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: isDark ? 'rgba(92, 92, 252, 0.1)' : bgColor }), // Force dark mode bg consistency if needed
    cardContent: { flex: 1 },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '2px', alignItems: 'center' },
    mainTitle: { fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b', fontSize: '16px', marginRight: '10px' },
    time: { fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' },
    subTitle: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#5c5cfc', marginBottom: '4px' },
    desc: { margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }
  };

  const handleNotificationClick = (eventId) => {
    if (eventId) {
      navigate(`/event-details/${eventId}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer', color: isDark ? '#fff' : '#1e293b' }} />
        <h2 style={styles.pageTitle}>Notifications</h2>
      </div>

      {notifications.map((note) => (
        <div key={note.id} style={styles.card} onClick={() => handleNotificationClick(note.eventId)}>
          <div style={styles.iconBox(note.bgColor)}>
            {note.icon}
          </div>
          <div style={styles.cardContent}>
            <div style={styles.cardHeader}>
              <span style={styles.mainTitle}>{note.title}</span>
              <span style={styles.time}>{note.time}</span>
            </div>
            <span style={styles.subTitle}>{note.typeLabel}</span>
            <p style={styles.desc}>{note.desc}</p>
          </div>
        </div>
      ))}
      
      {notifications.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '100px', color: '#94a3b8' }}>
          <p>No new notifications</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;