import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Moon, Sun, Globe, Bell, Shield, FileText, LogOut, ChevronRight, User 
} from 'lucide-react';

const Settings = ({ theme, user }) => { // Receives 'user' to show current language
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: isDark ? '#0f172a' : '#fff',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '30px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#1e293b',
      margin: 0
    },
    section: {
      marginBottom: '25px'
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
      marginBottom: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    optionItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
      borderRadius: '16px',
      marginBottom: '10px',
      cursor: 'pointer',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
    },
    optionLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    iconBox: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    optionText: {
      fontSize: '16px',
      fontWeight: '600',
      color: isDark ? '#fff' : '#1e293b'
    },
    optionRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    badge: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500'
    },
    logoutBtn: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#fee2e2',
      color: '#ef4444',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft 
          size={24} 
          onClick={() => navigate(-1)} 
          style={{ cursor: 'pointer', color: isDark ? '#fff' : '#1e293b' }} 
        />
        <h2 style={styles.title}>Settings</h2>
      </div>

      {/* --- GENERAL SECTION --- */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>General</div>
        
        {/* Notifications */}
        <div style={styles.optionItem} onClick={() => navigate('/notifications')}>
          <div style={styles.optionLeft}>
            <div style={{ ...styles.iconBox, backgroundColor: '#e0e7ff', color: '#4338ca' }}>
              <Bell size={20} />
            </div>
            <span style={styles.optionText}>Notifications</span>
          </div>
          <ChevronRight size={18} color="#cbd5e1" />
        </div>

        {/* App Theme */}
        <div style={styles.optionItem} onClick={() => navigate('/settings/theme')}>
          <div style={styles.optionLeft}>
            <div style={{ ...styles.iconBox, backgroundColor: '#f3e8ff', color: '#9333ea' }}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span style={styles.optionText}>App Theme</span>
          </div>
          <div style={styles.optionRight}>
            <span style={styles.badge}>{isDark ? 'Dark' : 'Light'}</span>
            <ChevronRight size={18} color="#cbd5e1" />
          </div>
        </div>

        {/* Language - NOW CLICKABLE & SHOWS CURRENT LANGUAGE */}
        <div style={styles.optionItem} onClick={() => navigate('/settings/language')}>
          <div style={styles.optionLeft}>
            <div style={{ ...styles.iconBox, backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
              <Globe size={20} />
            </div>
            <span style={styles.optionText}>Language</span>
          </div>
          <div style={styles.optionRight}>
            <span style={styles.badge}>{user?.language || 'English'}</span>
            <ChevronRight size={18} color="#cbd5e1" />
          </div>
        </div>
      </div>

      {/* --- SUPPORT SECTION --- */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Support</div>

        <div style={styles.optionItem}>
          <div style={styles.optionLeft}>
            <div style={{ ...styles.iconBox, backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <Shield size={20} />
            </div>
            <span style={styles.optionText}>Privacy Policy</span>
          </div>
          <ChevronRight size={18} color="#cbd5e1" />
        </div>

        <div style={styles.optionItem}>
          <div style={styles.optionLeft}>
            <div style={{ ...styles.iconBox, backgroundColor: '#ffedd5', color: '#ea580c' }}>
              <FileText size={20} />
            </div>
            <span style={styles.optionText}>Terms & Conditions</span>
          </div>
          <ChevronRight size={18} color="#cbd5e1" />
        </div>
      </div>

      {/* Logout Button */}
      <button style={styles.logoutBtn} onClick={() => alert("Logged out!")}>
        <LogOut size={20} /> Log Out
      </button>
    </div>
  );
};

export default Settings;