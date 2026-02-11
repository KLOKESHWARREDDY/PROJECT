import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogOut } from 'lucide-react';

const Profile = ({ user, theme, onLogout }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // Cross-platform check: Detect if screen is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    container: {
      padding: isMobile ? '5vw' : '2vw',
      fontFamily: "'Inter', sans-serif",
      color: isDark ? '#fff' : '#1e293b',
      maxWidth: isMobile ? '100vw' : '90vw',
      margin: '0 auto',
      minHeight: '100vh',
      paddingBottom: '10vh'
    },
    header: {
      marginBottom: '4vh',
      textAlign: isMobile ? 'center' : 'left'
    },
    pageTitle: {
      fontSize: isMobile ? '7vw' : '2.5vw', // Larger on mobile
      fontWeight: '800',
      marginBottom: '1vh'
    },
    subTitle: {
      color: '#64748b',
      fontSize: isMobile ? '3.5vw' : '1vw'
    },
    mainGrid: {
      display: 'grid',
      // Mobile: 1 Column | Desktop: 2 Columns
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(30vw, 1fr))',
      gap: isMobile ? '4vh' : '2vw',
      alignItems: 'start'
    },

    // --- LEFT CARD: User Info ---
    profileCard: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: isMobile ? '4vw' : '2vw',
      padding: isMobile ? '6vw' : '3vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: '0 0.5vh 1vh rgba(0,0,0,0.02)'
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: '2vh'
    },
    avatar: {
      width: isMobile ? '25vw' : '10vw', // Responsive Avatar
      height: isMobile ? '25vw' : '10vw',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid #6366f1',
      padding: '4px'
    },
    name: {
      fontSize: isMobile ? '5vw' : '1.8vw',
      fontWeight: 'bold',
      marginBottom: '0.5vh',
      color: isDark ? '#fff' : '#1e293b'
    },
    email: {
      fontSize: isMobile ? '3.5vw' : '1vw',
      color: '#64748b',
      marginBottom: '2.5vh'
    },
    badge: {
      backgroundColor: '#e0e7ff',
      color: '#4338ca',
      padding: isMobile ? '1vh 4vw' : '0.5vh 1.5vw',
      borderRadius: '50px',
      fontSize: isMobile ? '3vw' : '0.9vw',
      fontWeight: '600'
    },

    // --- RIGHT SIDE: Details & Settings ---
    rightColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '3vh' : '2vw'
    },
    detailsCard: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: isMobile ? '4vw' : '1.5vw',
      padding: isMobile ? '5vw' : '2vw',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: isMobile ? '4.5vw' : '1.2vw',
      fontWeight: '700',
      marginBottom: '2vh',
      borderBottom: isDark ? '1px solid #334155' : '1px solid #f1f5f9',
      paddingBottom: '1vh'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1.5vh 0',
      borderBottom: isDark ? '1px solid #334155' : '1px solid #f8fafc'
    },
    infoLabel: {
      color: '#94a3b8',
      fontSize: isMobile ? '3.5vw' : '1vw',
      fontWeight: '500'
    },
    infoValue: {
      fontWeight: '600',
      fontSize: isMobile ? '3.5vw' : '1vw',
      color: isDark ? '#fff' : '#334155',
      textAlign: 'right'
    },
    
    // --- SETTINGS GRID ---
    settingsGrid: {
      display: 'grid',
      // Mobile: 1 Column (Full Width) | Desktop: 3 Columns
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(10vw, 1fr))',
      gap: isMobile ? '2vh' : '1.5vw'
    },
    settingCard: (bg, color) => ({
      backgroundColor: isDark ? '#1e293b' : '#fff',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      padding: isMobile ? '4vw' : '1.5vw',
      borderRadius: isMobile ? '3vw' : '1.2vw',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '4vw' : '1vw',
      transition: 'transform 0.2s'
    }),
    iconBox: (bg, color) => ({
      width: isMobile ? '10vw' : '3vw',
      height: isMobile ? '10vw' : '3vw',
      borderRadius: isMobile ? '2.5vw' : '0.8vw',
      backgroundColor: bg,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })
  };

  // Options Array - PREFERENCES REMOVED
  const settingsOptions = [
    { 
      label: 'Edit Profile', 
      sub: 'Update personal info', 
      icon: <User size={isMobile ? 24 : 20} />, 
      path: '/edit-profile', 
      color: '#6366f1', 
      bg: '#e0e7ff' 
    },
    { 
      label: 'Security', 
      sub: 'Change password', 
      icon: <Lock size={isMobile ? 24 : 20} />, 
      path: '/change-password', 
      color: '#10b981', 
      bg: '#d1fae5' 
    },
    { 
      label: 'Log Out', 
      sub: 'Sign out of account', 
      icon: <LogOut size={isMobile ? 24 : 20} />, 
      action: onLogout, 
      color: '#ef4444', 
      bg: '#fee2e2' 
    }
  ];

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>My Profile</h1>
        <p style={styles.subTitle}>Manage your account details</p>
      </div>

      <div style={styles.mainGrid}>
        
        {/* LEFT: Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.avatarContainer}>
            <img src={user.profileImage} alt="Profile" style={styles.avatar} />
          </div>
          <h2 style={styles.name}>{user.name}</h2>
          <p style={styles.email}>{user.email}</p>
          <span style={styles.badge}>{user.role === 'student' ? 'Student Account' : 'Teacher Account'}</span>
        </div>

        {/* RIGHT: Details & Actions */}
        <div style={styles.rightColumn}>
          
          {/* Academic Info */}
          <div style={styles.detailsCard}>
            <h3 style={styles.sectionTitle}>Academic Information</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>College Name</span>
              <span style={styles.infoValue}>{user.college}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Department</span>
              <span style={styles.infoValue}>CSE</span>
            </div>
            <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
              <span style={styles.infoLabel}>Registration ID</span>
              <span style={styles.infoValue}>{user.regNo}</span>
            </div>
          </div>

          {/* Account Settings Grid */}
          <div>
            <h3 style={{ ...styles.sectionTitle, borderBottom: 'none', marginBottom: '1vh' }}>Account Settings</h3>
            <div style={styles.settingsGrid}>
              {settingsOptions.map((opt, index) => (
                <div 
                  key={index} 
                  style={styles.settingCard(opt.bg, opt.color)}
                  onClick={() => opt.path ? navigate(opt.path) : opt.action()}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={styles.iconBox(opt.bg, opt.color)}>
                    {opt.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: isMobile ? '4vw' : '1vw', color: isDark ? '#fff' : '#1e293b' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: isMobile ? '3vw' : '0.8vw', color: '#64748b' }}>
                      {opt.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;