import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GradientHeader = ({ title, subtitle, showBack = false, rightElement }) => {
  const navigate = useNavigate();

  const styles = {
    header: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563EB 100%)', // Blue -> Purple
      padding: '24px 24px 32px 24px',
      color: '#fff',
      borderBottomLeftRadius: '30px',
      borderBottomRightRadius: '30px',
      marginBottom: '20px',
      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.25)',
      position: 'relative',
      zIndex: 10
    },
    topRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    backBtn: {
      width: '38px', height: '38px', borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Glass effect
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      cursor: 'pointer', backdropFilter: 'blur(5px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    title: { fontSize: '26px', fontWeight: '800', margin: '0', letterSpacing: '-0.5px' },
    subtitle: { fontSize: '14px', opacity: 0.9, fontWeight: '500', marginTop: '4px' }
  };

  return (
    <div style={styles.header}>
      <div style={styles.topRow}>
        {showBack ? (
          <div style={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} color="#fff" />
          </div>
        ) : <div style={{width: 38}}></div>}
        {rightElement && <div>{rightElement}</div>}
      </div>
      <h1 style={styles.title}>{title}</h1>
      {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
    </div>
  );
};

export default GradientHeader;