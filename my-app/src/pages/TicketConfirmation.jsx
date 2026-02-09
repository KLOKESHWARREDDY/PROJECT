import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

const TicketConfirmation = ({ allEvents, theme, onCancel }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); 
  const isDark = theme === 'dark';

  const event = allEvents.find(e => e.id === parseInt(id));

  // Validation: If ticket doesn't exist or isn't approved
  if (!event || event.status !== 'approved') {
     return (
       <div style={{ padding: '20px', color: isDark ? '#fff' : '#000', textAlign: 'center', marginTop: '50px' }}>
         <p>Ticket not found or registration cancelled.</p>
         <button onClick={() => navigate('/')} style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}>Go Home</button>
       </div>
     );
  }

  const handleConfirmCancel = () => {
    onCancel(event.id); 
    setShowModal(false); 
    navigate('/'); 
  };

  const styles = {
    container: {
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'sans-serif',
      position: 'relative' 
    },
    header: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '15px', 
      marginBottom: '30px',
      marginTop: '10px'
    },
    title: { fontSize: '20px', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b', margin: 0 },
    
    ticketCard: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: '24px',
      padding: '30px 20px',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      marginBottom: '30px',
      position: 'relative'
    },
    eventName: { fontSize: '22px', fontWeight: '800', color: isDark ? '#fff' : '#1e293b', marginBottom: '8px' },
    status: { color: '#94a3b8', fontSize: '14px', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
    divider: { borderTop: '2px dashed #e2e8f0', margin: '25px 0', position: 'relative' },
    notchLeft: { position: 'absolute', left: -30, top: -12, width: '24px', height: '24px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '50%' },
    notchRight: { position: 'absolute', right: -30, top: -12, width: '24px', height: '24px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '50%' },
    detailLabel: { fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' },
    detailValue: { fontSize: '16px', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b', marginBottom: '20px' },
    qrContainer: { marginTop: '10px', padding: '10px', backgroundColor: '#fff', display: 'inline-block', borderRadius: '12px' },
    qrImage: { width: '140px', height: '140px', objectFit: 'contain' },
    ticketId: { marginTop: '15px', fontSize: '13px', color: '#94a3b8', backgroundColor: isDark ? '#0f172a' : '#f1f5f9', padding: '8px 16px', borderRadius: '20px', display: 'inline-block', fontFamily: 'monospace' },
    
    primaryBtn: { width: '100%', backgroundColor: '#2563eb', color: '#fff', padding: '16px', borderRadius: '16px', border: 'none', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', cursor: 'pointer' },
    cancelTextBtn: { width: '100%', backgroundColor: 'transparent', color: '#ef4444', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },

    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
    modalContent: { backgroundColor: isDark ? '#1e293b' : '#fff', width: '100%', maxWidth: '430px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '30px 24px', textAlign: 'center', animation: 'slideUp 0.3s ease-out', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)' },
    modalTitle: { fontSize: '20px', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b', marginBottom: '10px' },
    modalText: { fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' },
    modalBtnDanger: { width: '100%', backgroundColor: '#fee2e2', color: '#ef4444', padding: '16px', borderRadius: '16px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '12px' },
    modalBtnCancel: { width: '100%', backgroundColor: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#fff' : '#64748b', padding: '16px', borderRadius: '16px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {/* ARROW CLICK -> GOES TO HOME PAGE ('/') */}
        <ArrowLeft 
          size={24} 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', color: isDark ? '#fff' : '#1e293b' }} 
        />
        <h2 style={styles.title}>Your Ticket</h2>
      </div>

      <div style={styles.ticketCard}>
        <h1 style={styles.eventName}>{event.title}</h1>
        <div style={styles.status}>Confirmed <CheckCircle size={14} color="#22c55e" /></div>

        <div style={styles.divider}>
          <div style={styles.notchLeft}></div>
          <div style={styles.notchRight}></div>
        </div>

        <div>
          <div style={styles.detailLabel}>Date & Time</div>
          <div style={styles.detailValue}>{event.date.replace('·', '|')}</div>
        </div>

        <div>
          <div style={styles.detailLabel}>Venue</div>
          <div style={styles.detailValue}>{event.location}</div>
        </div>

        <div style={styles.divider}>
          <div style={styles.notchLeft}></div>
          <div style={styles.notchRight}></div>
        </div>

        <div style={styles.qrContainer}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${event.title}`} alt="QR Code" style={styles.qrImage} />
        </div>
        <div>
          <span style={styles.ticketId}>ID: #82991-T{event.id}</span>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button style={styles.primaryBtn} onClick={() => navigate('/my-events')}>
          View All Tickets
        </button>
        <button style={styles.cancelTextBtn} onClick={() => setShowModal(true)}>
          Cancel Registration
        </button>
      </div>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modalContent}>
            <div style={{ width: '50px', height: '50px', backgroundColor: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <h3 style={styles.modalTitle}>Cancel Registration?</h3>
            <p style={styles.modalText}>
              Are you sure you want to cancel your seat for <b>{event.title}</b>? This action cannot be undone.
            </p>
            
            <button style={styles.modalBtnDanger} onClick={handleConfirmCancel}>
              Yes, Cancel It
            </button>
            <button style={styles.modalBtnCancel} onClick={() => setShowModal(false)}>
              No, Keep Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketConfirmation;