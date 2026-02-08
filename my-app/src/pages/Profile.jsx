import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, Ticket, User, ChevronRight, Settings, Lock, Edit3, LogOut, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Edit3 size={20} color="#5c5cfc" />, label: 'Edit Profile', bg: '#f0f0ff' },
    { icon: <Lock size={20} color="#5c5cfc" />, label: 'Change Password', bg: '#f0f0ff' },
    { icon: <Settings size={20} color="#5c5cfc" />, label: 'Settings', bg: '#f0f0ff' },
    { icon: <LogOut size={20} color="#ef4444" />, label: 'Logout', bg: '#fff0f0', color: '#ef4444' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Profile</h2>
        <div style={{ width: 24 }}></div> {/* Spacer */}
      </div>

      <div style={styles.scrollArea}>
        {/* User Card */}
        <div style={styles.userCard}>
          <div style={styles.avatarWrapper}>
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
              alt="Priya Sharma" 
              style={styles.avatar} 
            />
          </div>
          <h3 style={{ margin: '10px 0 5px 0' }}>Priya Sharma</h3>
          <p style={styles.email}>priya.sharma@university.edu</p>
          <span style={styles.badge}>Student</span>
        </div>

        {/* Info Section */}
        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>College Name</span>
            <span style={styles.infoValue}>Engineering Tech Instit...</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Register Number</span>
            <span style={styles.infoValue}>ETI-2023-4589</span>
          </div>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <div key={index} style={styles.menuItem}>
            <div style={{ ...styles.iconBox, backgroundColor: item.bg }}>{item.icon}</div>
            <span style={{ flex: 1, marginLeft: '15px', color: item.color || '#333', fontWeight: '500' }}>
              {item.label}
            </span>
            <ChevronRight size={20} color="#94a3b8" />
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav style={styles.bottomNav}>
        <div style={styles.navItem} onClick={() => navigate('/')}><Home size={22} /><span>Home</span></div>
        <div style={styles.navItem} onClick={() => navigate('/events')}><Calendar size={22} /><span>Events</span></div>
        <div style={styles.navItem} onClick={() => navigate('/my-events')}><Ticket size={22} /><span>My Events</span></div>
        <div style={{...styles.navItem, color: '#2563eb', fontWeight: 'bold'}}><User size={22} /><span>Profile</span></div>
      </nav>
    </div>
  );
};

const styles = {
  container: { maxWidth: '375px', margin: '0 auto', backgroundColor: '#f8fafc', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'white' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '20px' },
  userCard: { backgroundColor: 'white', borderRadius: '20px', padding: '25px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  avatarWrapper: { width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #5c5cfc', margin: '0 auto', padding: '3px' },
  avatar: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' },
  email: { color: '#94a3b8', fontSize: '13px', marginBottom: '12px' },
  badge: { backgroundColor: '#5c5cfc', color: 'white', padding: '4px 15px', borderRadius: '20px', fontSize: '12px' },
  infoBox: { backgroundColor: 'white', borderRadius: '15px', padding: '15px', marginBottom: '20px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '13px' },
  infoLabel: { color: '#94a3b8' },
  infoValue: { color: '#333', fontWeight: '600' },
  menuItem: { display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '12px 15px', borderRadius: '15px', marginBottom: '12px', cursor: 'pointer' },
  iconBox: { width: '40px', height: '40px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  bottomNav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '375px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid #f1f5f9' },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }
};

export default Profile;