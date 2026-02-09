import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Settings, LogOut, ChevronRight, ArrowLeft } from 'lucide-react';

const Profile = ({ user, theme, onLogout }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const styles = {
    container: { backgroundColor: isDark ? '#0f172a' : '#f8fafc', minHeight: '100%', fontFamily: 'sans-serif', paddingBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    header: { width: '100%', padding: '20px', display: 'flex', alignItems: 'center', marginBottom: '10px' },
    backArrow: { cursor: 'pointer', color: isDark ? '#fff' : '#1e293b', marginRight: '15px', display: 'flex', alignItems: 'center' },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b', paddingRight: '24px' },
    
    profileCard: { backgroundColor: isDark ? '#1e293b' : '#fff', width: '90%', maxWidth: '380px', borderRadius: '24px', padding: '30px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    avatarContainer: { width: '90px', height: '90px', borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #5c5cfc, #a78bfa)', marginBottom: '15px' },
    
    // Object-fit cover ensures any image size (car or person) fits the circle perfectly
    avatar: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff' },
    
    name: { fontSize: '20px', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b', margin: '0 0 5px 0' },
    email: { fontSize: '13px', color: '#64748b', marginBottom: '15px' },
    badge: { backgroundColor: '#5c5cfc', color: '#fff', padding: '6px 24px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'inline-block' },
    
    detailsCard: { backgroundColor: isDark ? '#1e293b' : '#fff', width: '90%', maxWidth: '380px', borderRadius: '16px', padding: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
    detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' },
    detailLabel: { color: '#94a3b8', fontWeight: '500' },
    detailValue: { color: isDark ? '#fff' : '#1e293b', fontWeight: '600' },
    
    menuButton: { width: '90%', maxWidth: '380px', backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: '16px', padding: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
    menuLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
    iconBox: (bg, color) => ({ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    menuText: { fontSize: '15px', fontWeight: '600', color: isDark ? '#fff' : '#1e293b' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.backArrow} onClick={() => navigate(-1)}><ArrowLeft size={24} /></div>
        <div style={styles.headerTitle}>Profile</div>
      </div>

      <div style={styles.profileCard}>
        <div style={styles.avatarContainer}>
          {/* DISPLAY THE GLOBAL IMAGE */}
          <img src={user.profileImage} alt="Profile" style={styles.avatar} />
        </div>
        <h2 style={styles.name}>{user.name}</h2>
        <p style={styles.email}>{user.email}</p>
        <div style={styles.badge}>Student</div>
      </div>

      <div style={styles.detailsCard}>
        <div style={styles.detailRow}><span style={styles.detailLabel}>College Name</span><span style={styles.detailValue}>{user.college}</span></div>
        <div style={styles.detailRow}><span style={styles.detailLabel}>Register Number</span><span style={styles.detailValue}>{user.regNo}</span></div>
      </div>

      <button style={styles.menuButton} onClick={() => navigate('/edit-profile')}>
        <div style={styles.menuLeft}><div style={styles.iconBox('#eff6ff', '#5c5cfc')}><User size={20} /></div><span style={styles.menuText}>Edit Profile</span></div><ChevronRight size={18} color="#cbd5e1" />
      </button>

      <button style={styles.menuButton} onClick={() => navigate('/change-password')}>
        <div style={styles.menuLeft}><div style={styles.iconBox('#eff6ff', '#5c5cfc')}><Lock size={20} /></div><span style={styles.menuText}>Change Password</span></div><ChevronRight size={18} color="#cbd5e1" />
      </button>

      <button style={styles.menuButton} onClick={() => navigate('/settings')}>
        <div style={styles.menuLeft}><div style={styles.iconBox('#eff6ff', '#5c5cfc')}><Settings size={20} /></div><span style={styles.menuText}>Settings</span></div><ChevronRight size={18} color="#cbd5e1" />
      </button>

      <button style={styles.menuButton} onClick={onLogout}>
        <div style={styles.menuLeft}><div style={styles.iconBox('#fef2f2', '#ef4444')}><LogOut size={20} /></div><span style={{ ...styles.menuText, color: '#ef4444' }}>Logout</span></div><ChevronRight size={18} color="#cbd5e1" />
      </button>
    </div>
  );
};

export default Profile;