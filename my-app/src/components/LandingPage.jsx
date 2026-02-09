import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc'
    },
    // --- NAVBAR ---
    navbar: {
      backgroundColor: '#fff',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      position: 'relative',
      zIndex: 10
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      backgroundColor: '#0ea5e9', // Light Blue
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 'bold'
    },
    logoText: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#0f172a'
    },
    navLinks: {
      display: 'flex',
      gap: '25px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#334155'
    },
    navItem: {
      cursor: 'pointer',
      textDecoration: 'none',
      color: '#334155'
    },
    authButtons: {
      display: 'flex',
      gap: '15px'
    },
    btn: (filled) => ({
      padding: '8px 24px',
      borderRadius: '20px',
      border: 'none',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      backgroundColor: filled ? '#0ea5e9' : '#0ea5e9', // Both blue in your reference
      color: '#fff',
      boxShadow: '0 4px 6px rgba(14, 165, 233, 0.2)'
    }),

    // --- HERO SECTION ---
    heroSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '20px',
      // CSS Pattern to simulate the "doodle" background
      backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 10px 10px',
      backgroundColor: '#f1f5f9'
    },
    // The Blue Box Title
    blueBanner: {
      backgroundColor: '#1e40af', // Darker Blue
      color: '#fff',
      padding: '25px 40px',
      borderRadius: '6px',
      textAlign: 'center',
      marginBottom: '30px',
      maxWidth: '800px',
      width: '100%',
      boxShadow: '0 10px 25px rgba(30, 64, 175, 0.2)'
    },
    bannerTitle: {
      fontSize: '26px',
      fontWeight: 'bold',
      margin: '0 0 10px 0',
      lineHeight: '1.4'
    },
    bannerSub: {
      fontSize: '16px',
      opacity: 0.9,
      fontWeight: '400'
    },

    // The Search Bar Area
    searchContainer: {
      display: 'flex',
      width: '100%',
      maxWidth: '700px',
      height: '55px',
      border: '2px solid #0ea5e9', // Blue Border
      borderRadius: '6px',
      overflow: 'hidden',
      backgroundColor: '#fff'
    },
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      padding: '0 20px',
      fontSize: '16px',
      color: '#334155'
    },
    searchBtn: {
      backgroundColor: '#0ea5e9',
      color: '#fff',
      border: 'none',
      padding: '0 30px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>ES</div>
          <span style={styles.logoText}>EventSphere</span>
        </div>

        {/* Desktop Nav Links (Hidden on small screens logic could be added) */}
        <div style={styles.navLinks}>
          <span style={styles.navItem}>Home</span>
          <span style={styles.navItem}>Events</span>
          <span style={styles.navItem}>Workshops</span>
          <span style={styles.navItem}>About</span>
        </div>

        <div style={styles.authButtons}>
          <button style={styles.btn(true)} onClick={() => navigate('/signup')}>Sign Up</button>
          <button style={styles.btn(true)} onClick={() => navigate('/signin')}>Login</button>
        </div>
      </div>

      {/* Hero Content */}
      <div style={styles.heroSection}>
        
        {/* Blue Box Banner */}
        <div style={styles.blueBanner}>
          <h1 style={styles.bannerTitle}>
            EventSphere - Manage College Events & Workshops <br />
            With Easy Registration in one place
          </h1>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input 
            style={styles.searchInput} 
            placeholder="What event are you looking for?" 
          />
          <button style={styles.searchBtn}>
            Search
          </button>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;