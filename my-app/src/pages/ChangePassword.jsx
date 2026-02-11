import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = ({ theme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [show, setShow] = useState(false);

  // RESPONSIVE CHECK
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    // 1. CONTAINER: Responsive Width
    container: { 
      maxWidth: isMobile ? '90vw' : '40vw', // Wider on mobile, focused on desktop
      margin: '0 auto', 
      padding: isMobile ? '5vw' : '2vw', 
      fontFamily: "'Inter', sans-serif", 
      color: isDark ? '#fff' : '#1e293b',
      minHeight: '100vh'
    },
    // HEADER
    header: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: isMobile ? '3vw' : '1vw', 
      marginBottom: '4vh' 
    },
    backBtn: {
      cursor: 'pointer',
      padding: '0.5vw',
      borderRadius: '50%',
      transition: 'background 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: { 
      fontSize: isMobile ? '6vw' : '2vw', 
      fontWeight: '800' 
    },
    
    // FORM
    form: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: isMobile ? '3vh' : '2.5vh',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      padding: isMobile ? '5vw' : '2.5vw',
      borderRadius: isMobile ? '3vw' : '1.5vw',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1vh'
    },
    label: { 
      display: 'block', 
      fontSize: isMobile ? '3.5vw' : '1vw', 
      fontWeight: '600', 
      color: '#64748b' 
    },
    inputContainer: { 
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    input: { 
      width: '100%', 
      padding: isMobile ? '1.5vh 3vw' : '1.2vh 1vw', 
      paddingRight: '3rem', // Space for eye icon
      borderRadius: isMobile ? '2vw' : '0.8vw', 
      border: isDark ? '1px solid #475569' : '2px solid #e2e8f0', 
      backgroundColor: isDark ? '#0f172a' : '#f8fafc', 
      color: isDark ? '#fff' : '#1e293b', 
      outline: 'none', 
      fontSize: isMobile ? '4vw' : '1.1vw',
      transition: 'border-color 0.2s'
    },
    eyeIcon: {
      position: 'absolute', 
      right: isMobile ? '3vw' : '1vw', 
      cursor: 'pointer', 
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center'
    },
    
    // BUTTON
    btn: { 
      width: '100%', 
      padding: isMobile ? '2vh' : '1.5vh', 
      backgroundColor: '#3b82f6', 
      color: '#fff', 
      border: 'none', 
      borderRadius: isMobile ? '2vw' : '0.8vw', 
      fontWeight: 'bold', 
      fontSize: isMobile ? '4vw' : '1.2vw', 
      cursor: 'pointer', 
      marginTop: '2vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5vw',
      transition: 'transform 0.1s',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div 
          style={styles.backBtn} 
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={isMobile ? 24 : 24} />
        </div>
        <h1 style={styles.title}>Change Password</h1>
      </div>

      <div style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Current Password</label>
          <div style={styles.inputContainer}>
            <input style={styles.input} type="password" placeholder="••••••••" />
            <div style={styles.eyeIcon}><Lock size={isMobile ? 20 : 18} /></div>
          </div>
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>New Password</label>
          <div style={styles.inputContainer}>
            <input style={styles.input} type={show ? "text" : "password"} placeholder="Enter new password" />
            <div style={styles.eyeIcon} onClick={() => setShow(!show)}>
              {show ? <EyeOff size={isMobile ? 20 : 20}/> : <Eye size={isMobile ? 20 : 20}/>}
            </div>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm New Password</label>
          <div style={styles.inputContainer}>
            <input style={styles.input} type="password" placeholder="Repeat new password" />
            <div style={styles.eyeIcon}><Lock size={isMobile ? 20 : 18} /></div>
          </div>
        </div>

        <button 
          style={styles.btn}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <CheckCircle size={isMobile ? 20 : 18} /> Update Password
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;