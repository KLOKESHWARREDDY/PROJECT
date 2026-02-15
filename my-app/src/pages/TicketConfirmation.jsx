import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; 
import { ArrowLeft, Download, Share2, MapPin, Calendar, Clock, User, Mail } from 'lucide-react';
import axios from 'axios';

const TicketConfirmation = ({ allEvents, theme, onCancel }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  // State for ticket data
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug: Log the ID received
  console.log('TicketConfirmation - Received ID from params:', id);
  console.log('ID length:', id?.length);

  // Fetch ticket data from API
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        console.log('Fetching ticket for registration ID:', id);
        
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/registrations/ticket/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('API Response:', response.data);
        setTicket(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        console.error('Error response:', err.response?.data);
        setError(err.response?.data?.message || 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ color: isDark ? '#fff' : '#1e293b' }}>Loading ticket...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        padding: '20px'
      }}>
        <div style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</div>
        <button 
          onClick={() => navigate(-1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // No ticket data
  if (!ticket) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ color: isDark ? '#fff' : '#1e293b' }}>No ticket found</div>
      </div>
    );
  }

  // Use ticket data with optional chaining
  const eventTitle = ticket?.event?.title || 'Event';
  const eventDate = ticket?.event?.date ? new Date(ticket.event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : 'Date not available';
  const eventLocation = ticket?.event?.location || 'Location not available';
  const studentName = ticket?.student?.name || 'Student';
  const studentEmail = ticket?.student?.email || 'Email not available';
  const ticketCode = ticket?.ticketCode || 'N/A';

  const styles = {
    // Page Background
    container: {
      minHeight: '100vh',
      backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', sans-serif"
    },
    
    // 1. TICKET CONTAINER
    ticketWrapper: {
      width: '100%',
      maxWidth: '380px', // Standard Mobile Ticket Width
      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))', // Soft shadow around the whole shape
      marginBottom: '30px'
    },

    // 2. TOP PART (Gradient Header)
    ticketTop: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', // Premium Gradient
      padding: '30px',
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      color: '#fff',
      position: 'relative',
      textAlign: 'center'
    },
    eventImage: {
      width: '80px', height: '80px', borderRadius: '16px',
      border: '4px solid rgba(255,255,255,0.2)',
      objectFit: 'cover', marginBottom: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    },
    eventTitle: { fontSize: '22px', fontWeight: '800', lineHeight: '1.3', marginBottom: '8px' },
    eventCategory: { 
      display: 'inline-block', padding: '4px 12px', borderRadius: '20px', 
      background: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: '600',
      backdropFilter: 'blur(4px)'
    },

    // 3. MIDDLE PART (White Details)
    ticketBody: {
      backgroundColor: '#fff',
      padding: '30px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    row: { display: 'flex', alignItems: 'center', gap: '12px', color: '#334155' },
    label: { fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
    value: { fontSize: '15px', fontWeight: '700', color: '#1e293b' },

    // 4. CUTOUTS (The "Tear Line" Effect)
    tearLine: {
      position: 'relative',
      height: '1px',
      backgroundColor: '#fff',
      backgroundImage: 'linear-gradient(to right, #ccc 50%, rgba(255,255,255,0) 0%)',
      backgroundPosition: 'bottom',
      backgroundSize: '15px 1px',
      backgroundRepeat: 'repeat-x'
    },
    notchLeft: {
      position: 'absolute', top: '-10px', left: '-10px', width: '20px', height: '20px',
      borderRadius: '50%', backgroundColor: isDark ? '#0f172a' : '#f1f5f9', zIndex: 10
    },
    notchRight: {
      position: 'absolute', top: '-10px', right: '-10px', width: '20px', height: '20px',
      borderRadius: '50%', backgroundColor: isDark ? '#0f172a' : '#f1f5f9', zIndex: 10
    },

    // 5. BOTTOM PART (QR Code)
    ticketBottom: {
      backgroundColor: '#fff',
      padding: '30px',
      borderBottomLeftRadius: '24px',
      borderBottomRightRadius: '24px',
      textAlign: 'center',
      borderTop: '2px dashed #e2e8f0'
    },
    scanText: { fontSize: '12px', color: '#94a3b8', marginTop: '15px', letterSpacing: '1px', fontWeight: '600' },

    // Buttons
    actionRow: { display: 'flex', gap: '15px', width: '100%', maxWidth: '380px' },
    actionBtn: {
      flex: 1, padding: '14px', borderRadius: '14px', border: 'none',
      fontSize: '14px', fontWeight: '600', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    },
    downloadBtn: { backgroundColor: '#1e293b', color: '#fff' },
    shareBtn: { backgroundColor: '#fff', color: '#1e293b', border: '1px solid #e2e8f0' }
  };

  return (
    <div style={styles.container}>
      {/* Header Navigation */}
      <div style={{ width: '100%', maxWidth: '380px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <div style={{ cursor: 'pointer', padding: '10px', background: '#fff', borderRadius: '12px' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} color="#1e293b" />
        </div>
        <span style={{ marginLeft: '15px', fontWeight: '700', fontSize: '18px', color: isDark?'#fff':'#1e293b' }}>Ticket Details</span>
      </div>

      {/* The Ticket Card */}
      <div style={styles.ticketWrapper}>
        
        {/* Top: Gradient Header */}
        <div style={styles.ticketTop}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>🎫</div>
          <div style={styles.eventTitle}>{eventTitle}</div>
          <span style={styles.eventCategory}>Event Ticket</span>
        </div>

        {/* Middle: Details */}
        <div style={styles.ticketBody}>
          {/* Punch Holes for the visual gap */}
          <div style={styles.notchLeft}></div>
          <div style={styles.notchRight}></div>

          {/* Student Info */}
          <div style={styles.row}>
            <User size={20} color="#6366f1" />
            <div>
              <div style={styles.label}>Student Name</div>
              <div style={styles.value}>{studentName}</div>
            </div>
          </div>
          <div style={styles.row}>
            <Mail size={20} color="#6366f1" />
            <div>
              <div style={styles.label}>Email</div>
              <div style={styles.value}>{studentEmail}</div>
            </div>
          </div>

          {/* Event Details */}
          <div style={styles.row}>
            <Calendar size={20} color="#6366f1" />
            <div>
              <div style={styles.label}>Date</div>
              <div style={styles.value}>{eventDate}</div>
            </div>
          </div>
          <div style={styles.row}>
            <MapPin size={20} color="#6366f1" />
            <div>
              <div style={styles.label}>Location</div>
              <div style={styles.value}>{eventLocation}</div>
            </div>
          </div>
        </div>

        {/* Bottom: QR Code */}
        <div style={styles.ticketBottom}>
           <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
             {ticket?.qrCode ? (
               <QRCodeSVG value={ticket.qrCode} size={140} fgColor="#1e293b" />
             ) : (
               <QRCodeSVG value={`TICKET-${ticketCode}`} size={140} fgColor="#1e293b" />
             )}
           </div>
           <div style={styles.scanText}>TICKET CODE: {ticketCode}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionRow}>
        <button style={{...styles.actionBtn, ...styles.downloadBtn}}>
          <Download size={18} /> Download
        </button>
        <button style={{...styles.actionBtn, ...styles.shareBtn}}>
          <Share2 size={18} /> Share
        </button>
      </div>

    </div>
  );
};

export default TicketConfirmation;
