import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Globe, Shield, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';

const Settings = ({ theme, user }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif', color: isDark ? '#fff' : '#1e293b' },
    header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' },
    title: { fontSize: '24px', fontWeight: 'bold' },
    
    sectionTitle: { fontSize: '13px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', marginLeft: '10px' },
    card: { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '16px', overflow: 'hidden', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', marginBottom: '30px' },
    row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: isDark ? '1px solid #334155' : '1px solid #f1f5f9', cursor: 'pointer' },
    left: { display: 'flex', alignItems: 'center', gap: '15px', fontWeight: '500' }
  };

  const SettingRow = ({ icon, label, onClick }) => (
    <div style={styles.row} onClick={onClick}>
      <div style={styles.left}>{icon} {label}</div>
      <ChevronRight size={18} color="#cbd5e1" />
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <ArrowLeft style={{cursor:'pointer'}} onClick={() => navigate(-1)} />
        <h1 style={styles.title}>Settings</h1>
      </div>

      <div style={styles.sectionTitle}>Preferences</div>
      <div style={styles.card}>
        <SettingRow icon={<Moon size={20} />} label="Theme" onClick={() => navigate('/settings/theme')} />
        <SettingRow icon={<Globe size={20} />} label="Language" onClick={() => navigate('/settings/language')} />
      </div>

      <div style={styles.sectionTitle}>Support</div>
      <div style={styles.card}>
        <SettingRow icon={<Shield size={20} />} label="Privacy Policy" />
        <SettingRow icon={<HelpCircle size={20} />} label="Help Center" />
      </div>
    </div>
  );
};

export default Settings;