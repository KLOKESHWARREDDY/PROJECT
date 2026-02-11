import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, X, User, Mail, Phone, Filter } from 'lucide-react';

const EventSpecificRegistrations = ({ events, registrations, onApprove, onReject, theme }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get Event ID from URL
  const isDark = theme === 'dark';
  
  // Find the specific event
  const event = events.find(e => e.id === parseInt(id));
  
  // State for Filter
  const [activeFilter, setActiveFilter] = useState("Pending"); 

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!event) return <div style={{padding:'20px'}}>Event not found</div>;

  // ✅ FILTER: Show only registrations for THIS event matching the status
  // Note: We match by event title (assuming registration.event === event.title)
  // or you can implement a looser check if names slightly differ.
  const filteredList = registrations.filter(reg => 
    (reg.event === event.title || reg.event.includes(event.category) || event.title.includes(reg.event)) && 
    reg.status === activeFilter
  );

  const styles = {
    container: {
      padding: isMobile ? '4vw' : '2vw',
      maxWidth: isMobile ? '100vw' : '60vw',
      margin: '0 auto',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      color: isDark ? '#fff' : '#1e293b'
    },
    header: { display: 'flex', alignItems: 'center', gap: '2vw', marginBottom: '3vh' },
    backBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: isDark ? '#fff' : '#64748b', display: 'flex', alignItems: 'center'
    },
    pageTitle: { fontSize: isMobile ? '5vw' : '1.8vw', fontWeight: '800' },
    subTitle: { fontSize: isMobile ? '3.5vw' : '1vw', color: '#6366f1', marginLeft: 'auto', fontWeight:'600' },

    filterContainer: {
      display: 'flex', gap: '1vw', marginBottom: '3vh', 
      padding: '0.5vh', backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: '2vw', width: 'fit-content',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
    },
    filterTab: (isActive) => ({
      padding: isMobile ? '1vh 4vw' : '0.8vh 2vw',
      borderRadius: '1.5vw', border: 'none', cursor: 'pointer',
      fontSize: isMobile ? '3.5vw' : '0.9vw', fontWeight: '600',
      backgroundColor: isActive ? '#4f46e5' : 'transparent',
      color: isActive ? '#fff' : (isDark ? '#94a3b8' : '#64748b'),
      transition: 'all 0.2s'
    }),

    listContainer: { display: 'flex', flexDirection: 'column', gap: '2vh' },
    card: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: isMobile ? '3vw' : '1vw',
      padding: isMobile ? '3vw' : '1.2vw',
      display: 'flex', alignItems: 'center', gap: '3vw',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    avatarBox: {
      width: isMobile ? '12vw' : '3.5vw', height: isMobile ? '12vw' : '3.5vw',
      borderRadius: '50%', backgroundColor: isDark ? '#334155' : '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#64748b', fontSize: isMobile ? '4.5vw' : '1.2vw', fontWeight: 'bold'
    },
    cardInfo: { flex: 1 },
    name: { fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b' },
    detail: { fontSize: isMobile ? '3vw' : '0.85vw', color: '#64748b', display:'flex', alignItems:'center', gap:'5px', marginTop:'4px' },
    
    actions: { display: 'flex', gap: '1vw' },
    actionBtn: (type) => ({
      width: isMobile ? '10vw' : '2.5vw', height: isMobile ? '10vw' : '2.5vw',
      borderRadius: '50%', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: type === 'approve' ? '#dcfce7' : '#fee2e2',
      color: type === 'approve' ? '#166534' : '#991b1b'
    }),
    statusBadge: (status) => ({
      padding: '0.5vh 1.5vw', borderRadius: '2vw',
      fontSize: '0.8vw', fontWeight: 'bold',
      backgroundColor: status === 'Approved' ? '#dcfce7' : '#fee2e2',
      color: status === 'Approved' ? '#166534' : '#991b1b'
    }),
    emptyState: { textAlign: 'center', padding: '5vh', color: '#64748b', fontSize: isMobile ? '3.5vw' : '1vw' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={isMobile ? 24 : 24} />
        </button>
        <div style={{display:'flex', flexDirection:'column'}}>
          <h1 style={styles.pageTitle}>Event Registrations</h1>
          <span style={{fontSize:'0.9rem', color:'#64748b'}}>{event.title}</span>
        </div>
      </div>

      <div style={styles.filterContainer}>
        {['Pending', 'Approved', 'Rejected'].map((tab) => (
          <button key={tab} style={styles.filterTab(activeFilter === tab)} onClick={() => setActiveFilter(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.listContainer}>
        {filteredList.length === 0 ? (
          <div style={styles.emptyState}>
            <Filter size={40} style={{opacity:0.3, marginBottom:'10px'}}/>
            <p>No {activeFilter.toLowerCase()} registrations for this event.</p>
          </div>
        ) : (
          filteredList.map((reg) => (
            <div key={reg.id} style={styles.card}>
              <div style={styles.avatarBox}>{reg.name.charAt(0)}</div>
              <div style={styles.cardInfo}>
                <div style={styles.name}>{reg.name}</div>
                <div style={styles.detail}><Mail size={12} /> {reg.email}</div>
                {reg.phone && <div style={styles.detail}><Phone size={12} /> {reg.phone}</div>}
              </div>

              {activeFilter === 'Pending' ? (
                <div style={styles.actions}>
                  <button style={styles.actionBtn('reject')} onClick={() => onReject(reg.id)}><X size={18} /></button>
                  <button style={styles.actionBtn('approve')} onClick={() => onApprove(reg.id)}><Check size={18} /></button>
                </div>
              ) : (
                <div style={styles.statusBadge(reg.status)}>{reg.status}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventSpecificRegistrations;