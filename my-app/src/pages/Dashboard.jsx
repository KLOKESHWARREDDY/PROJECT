import React from 'react';
import { Bell, Clock, MapPin } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import GradientHeader from '../components/GradientHeader';

const Dashboard = ({ user, events, theme, regCount, unreadCount, onReadNotifications, t }) => {
  const navigate = useNavigate(); 
  const isDark = theme === 'dark';

  const styles = {
    container: { backgroundColor: isDark ? '#0f172a' : '#f8fafc', minHeight: '100%', fontFamily: 'sans-serif', width: '100%', maxWidth: '1000px', margin: '0 auto' },
    content: { padding: '20px', paddingBottom: '30px' },
    // Stats
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '25px' },
    statCard: { backgroundColor: isDark ? '#1e293b' : '#fff', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
    statNumber: { fontSize: '28px', fontWeight: '800', color: isDark?'#fff':'#1e293b' },
    statLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600' },
    // Events
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', margin: 0, color: isDark ? '#fff' : '#1e293b' },
    seeAllBtn: { background: 'none', border: 'none', color: '#3b82f6', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
    eventCard: { backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: '20px', padding: '12px', marginBottom: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' },
    eventImg: { width: '80px', height: '80px', borderRadius: '15px', objectFit: 'cover' },
    eventInfo: { flex: 1 },
    eventTitle: { margin: '0 0 6px 0', fontSize: '16px', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b' },
    eventMeta: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '4px' },
    bellWrapper: { position: 'relative', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '14px' }
  };

  const NotificationIcon = (
    <div style={styles.bellWrapper} onClick={() => { onReadNotifications(); navigate('/notifications'); }}>
      <Bell size={22} color="#fff" />
      {unreadCount > 0 && <span style={{ position: 'absolute', top: 10, right: 10, width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }}></span>}
    </div>
  );

  return (
    <div style={styles.container}>
      <GradientHeader 
        title={`Hi, ${user.name.split(' ')[0]}`} 
        subtitle="Find your next event" 
        rightElement={NotificationIcon} 
      />
      <div style={styles.content}>
        <div style={styles.statsRow}>
          <div style={styles.statCard}><div style={styles.statNumber}>{events.length}</div><div style={styles.statLabel}>Upcoming</div></div>
          <div style={styles.statCard}><div style={styles.statNumber}>{regCount}</div><div style={styles.statLabel}>Registered</div></div>
        </div>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Popular Events</h3>
          <button style={styles.seeAllBtn} onClick={() => navigate('/events')}>See All</button>
        </div>
        {events.map(event => (
          <div key={event.id} style={styles.eventCard} onClick={() => navigate(`/event-details/${event.id}`)}>
            <img src={event.image} alt="" style={styles.eventImg} />
            <div style={styles.eventInfo}>
              <h4 style={styles.eventTitle}>{event.title}</h4>
              <div style={styles.eventMeta}><Clock size={14} /> {event.date.split('·')[0]}</div>
              <div style={styles.eventMeta}><MapPin size={14} /> {event.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Dashboard;