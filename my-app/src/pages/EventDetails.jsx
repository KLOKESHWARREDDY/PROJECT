import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Share2, ArrowLeft, CheckCircle } from 'lucide-react';

const EventDetails = ({ allEvents, theme, onRegister }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // Find the specific event from the main list
  const event = allEvents.find(e => e.id === parseInt(id));

  if (!event) return <div style={{ padding: '40px', textAlign: 'center', color: isDark ? '#fff' : '#333' }}>Event not found</div>;

  // CHECK IF REGISTERED
  const isRegistered = event.status === 'pending' || event.status === 'approved';

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
      color: isDark ? '#fff' : '#1e293b',
      paddingBottom: '80px', 
    },
    headerNav: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      marginBottom: '20px' 
    },
    iconBtn: {
      background: 'none', 
      border: 'none', 
      cursor: 'pointer',
      color: isDark ? '#fff' : '#1e293b', 
      padding: '10px',
      borderRadius: '50%', 
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '40px',
      alignItems: 'start'
    },
    image: {
      width: '100%', 
      height: '400px', 
      objectFit: 'cover',
      borderRadius: '24px', 
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    },
    infoCol: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px' 
    },
    title: { 
      fontSize: '36px', 
      fontWeight: '800', 
      lineHeight: '1.2', 
      marginBottom: '10px' 
    },
    row: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '16px' 
    },
    iconBox: {
      width: '56px', 
      height: '56px', 
      borderRadius: '16px',
      backgroundColor: isDark ? '#1e293b' : '#eff6ff',
      color: '#3b82f6', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: isDark ? '1px solid #334155' : 'none'
    },
    label: { 
      fontSize: '13px', 
      color: '#64748b', 
      fontWeight: '600', 
      display: 'block', 
      marginBottom: '4px' 
    },
    value: { 
      fontSize: '16px', 
      fontWeight: '700' 
    },
    descTitle: { 
      fontSize: '22px', 
      fontWeight: 'bold', 
      marginBottom: '12px' 
    },
    descText: { 
      lineHeight: '1.8', 
      color: isDark ? '#cbd5e1' : '#475569', 
      fontSize: '16px' 
    },

    // Dynamic Button Style
    registerBtn: (registered) => ({
      width: '100%',
      padding: '18px',
      // Green if registered, Blue if not
      backgroundColor: registered ? '#10b981' : '#3b82f6', 
      color: '#fff',
      border: 'none',
      borderRadius: '16px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: registered ? '0 8px 25px rgba(16, 185, 129, 0.4)' : '0 8px 25px rgba(59, 130, 246, 0.4)',
      marginTop: '20px',
      transition: 'transform 0.2s',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    })
  };

  const handleButtonClick = () => {
    if (isRegistered) {
      // If approved, show ticket. If pending, go to My Events.
      if (event.status === 'approved') {
        navigate(`/ticket-confirmation/${event.id}`);
      } else {
        navigate('/my-events');
      }
    } else {
      // Register logic
      onRegister(event.id);
      // Wait a bit to show change, then navigate (optional)
      setTimeout(() => navigate('/my-events'), 500);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Navigation Header */}
      <div style={styles.headerNav}>
        <button style={styles.iconBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <button style={styles.iconBtn}>
          <Share2 size={24} />
        </button>
      </div>

      <div style={styles.grid}>
        {/* Left Column: Image */}
        <img src={event.image} alt={event.title} style={styles.image} />

        {/* Right Column: Info */}
        <div style={styles.infoCol}>
          <div>
            <h1 style={styles.title}>{event.title}</h1>
            <span style={{ 
              backgroundColor: isDark ? '#334155' : '#f1f5f9', 
              padding: '6px 12px', 
              borderRadius: '20px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: isDark ? '#e2e8f0' : '#475569' 
            }}>
              {event.category}
            </span>
          </div>
          
          <div style={styles.row}>
            <div style={styles.iconBox}><Calendar size={28} /></div>
            <div>
              <span style={styles.label}>Date & Time</span>
              <span style={styles.value}>{event.date}</span>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.iconBox}><MapPin size={28} /></div>
            <div>
              <span style={styles.label}>Location</span>
              <span style={styles.value}>{event.location}</span>
            </div>
          </div>

          <div>
            <h3 style={styles.descTitle}>About Event</h3>
            <p style={styles.descText}>
              Join us for an immersive experience learning about the latest in technology. 
              This workshop is suitable for all levels. Certificate provided upon completion.
            </p>
          </div>

          {/* DYNAMIC REGISTER BUTTON */}
          <button 
            style={styles.registerBtn(isRegistered)} 
            onClick={handleButtonClick}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isRegistered ? (
              <>
                <CheckCircle size={22} />
                {event.status === 'approved' ? 'View Ticket' : 'Registration Pending'}
              </>
            ) : (
              'Register Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;