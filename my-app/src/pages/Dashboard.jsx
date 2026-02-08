import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, Ticket, User, Bell, Search } from 'lucide-react';

const Dashboard = ({ upcomingEvents, upcomingCount, regCount }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoGroup}>
          <div style={styles.logoCircle}>ES</div>
          <span style={styles.brandName}>EventSphere</span>
        </div>
        <Bell 
          size={24} 
          style={{ cursor: 'pointer' }} 
          onClick={() => navigate('/notifications')} 
        />
      </header>

      {/* Hero */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold' }}>Hi Student 👋</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Explore college events</p>
      </div>

      {/* Search Bar */}
      <div style={styles.searchWrapper}>
        <Search size={18} style={styles.searchIcon} />
        <input type="text" placeholder="Search events..." style={styles.input} />
      </div>

      {/* Dynamic Statistics Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Upcoming</span>
          <div style={styles.statValue}>{upcomingCount}</div>
        </div>
        <div 
          onClick={() => navigate('/my-events')} 
          style={{ ...styles.statCard, cursor: 'pointer' }}
        >
          <span style={styles.statLabel}>Registered</span>
          <div style={styles.statValue}>{regCount}</div>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>My Tickets</span>
          <div style={styles.statValue}>2</div>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Announcements</span>
          <div style={styles.statValue}>4</div>
        </div>
      </div>

      {/* Section Title */}
      <div style={styles.sectionHeader}>
        <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 'bold' }}>Upcoming Events</h3>
        <span style={styles.seeAll} onClick={() => navigate('/events')}>See all</span>
      </div>

      {/* Horizontal Scroll Area (Synced with Events) */}
      <div style={styles.horizontalScroll}>
        {upcomingEvents.map(event => (
          <div key={event.id} style={styles.eventCard}>
            <div style={{ ...styles.banner, backgroundImage: `url(${event.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={styles.bannerOverlay}>{event.bannerText}</div>
            </div>
            <div style={styles.cardInfo}>
              <p style={{ fontWeight: 'bold', margin: 0, fontSize: '15px' }}>{event.title}</p>
              <div style={styles.cardFooter}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{event.date}</span>
                <button style={styles.regBtn} onClick={() => navigate('/events')}>Register</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav style={styles.bottomNav}>
        <div style={{ ...styles.navItem, color: '#2563eb' }} onClick={() => navigate('/')}>
          <Home size={22} /><span>Home</span>
        </div>
        <div style={styles.navItem} onClick={() => navigate('/events')}>
          <Calendar size={22} /><span>Events</span>
        </div>
        <div style={styles.navItem} onClick={() => navigate('/my-events')}>
          <Ticket size={22} /><span>My Events</span>
        </div>
        {/* Profile Redirection */}
        <div style={styles.navItem} onClick={() => navigate('/profile')}>
          <User size={22} /><span>Profile</span>
        </div>
      </nav>
    </div>
  );
};

const styles = {
  container: { maxWidth: '375px', margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh', padding: '16px', paddingBottom: '100px', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  logoCircle: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  brandName: { fontWeight: '700', fontSize: '18px' },
  searchWrapper: { position: 'relative', marginBottom: '20px' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  input: { width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', boxSizing: 'border-box' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px' },
  statCard: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' },
  statLabel: { fontSize: '12px', color: '#64748b' },
  statValue: { fontSize: '20px', fontWeight: 'bold', marginTop: '4px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  seeAll: { color: '#2563eb', fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
  horizontalScroll: { display: 'flex', gap: '15px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '10px' },
  eventCard: { minWidth: '260px', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', backgroundColor: 'white' },
  banner: { height: '110px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  bannerOverlay: { backgroundColor: 'rgba(37, 99, 235, 0.8)', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' },
  cardInfo: { padding: '12px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  regBtn: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' },
  bottomNav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '375px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid #f1f5f9' },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }
};

export default Dashboard;