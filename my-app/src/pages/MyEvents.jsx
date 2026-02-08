import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, Ticket, User } from 'lucide-react';

const MyEvents = ({ events }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>My Events</h2>
      
      <div style={styles.content}>
        <p style={styles.subLabel}>REGISTERED EVENTS ({events.length})</p>
        
        {events.map(event => (
          <div key={event.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <b style={{ fontSize: '16px' }}>{event.name}</b>
              <span style={styles.regBadge}>REGISTERED</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '10px 0' }} />
            <div style={styles.details}>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
            </div>
          </div>
        ))}
      </div>

      <nav style={styles.bottomNav}>
        <div style={styles.navItem} onClick={() => navigate('/')}><Home size={22} /><span>Home</span></div>
        <div style={styles.navItem} onClick={() => navigate('/events')}><Calendar size={22} /><span>Events</span></div>
        <div style={{ ...styles.navItem, color: '#2563eb', fontWeight: 'bold' }} onClick={() => navigate('/my-events')}><Ticket size={22} /><span>My Events</span></div>
        {/* Profile Redirect */}
        <div style={styles.navItem} onClick={() => navigate('/profile')}><User size={22} /><span>Profile</span></div>
      </nav>
    </div>
  );
};

const styles = {
  container: { maxWidth: '375px', margin: '0 auto', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #eee', margin: 0, fontSize: '18px' },
  content: { padding: '20px' },
  subLabel: { color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  regBadge: { backgroundColor: '#5c5cfc', color: 'white', fontSize: '10px', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
  details: { fontSize: '12px', color: '#64748b', lineHeight: '1.8' },
  bottomNav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '375px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid #f1f5f9' },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }
};

export default MyEvents;