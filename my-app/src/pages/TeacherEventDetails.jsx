import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Edit3, Trash2, Users, AlertTriangle } from 'lucide-react';

const TeacherEventDetails = ({ events, onDelete, theme }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isDark = theme === 'dark';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Find event by ID
  const event = events.find((e) => e.id === parseInt(id));
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Responsive listener
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!event) return <div style={{padding:'20px', color: isDark?'#fff':'#000'}}>Event not found</div>;

  const handleDelete = () => {
    onDelete(event.id);
    navigate('/');
  };

  const styles = {
    container: { padding: '20px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', minHeight: '100vh', color: isDark ? '#fff' : '#1e293b' },
    card: { backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: '15px', overflow: 'hidden', marginTop: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    image: { width: '100%', height: isMobile ? '200px' : '300px', objectFit: 'cover' },
    content: { padding: '20px' },
    btnGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '30px' },
    btn: (bg, color) => ({
      backgroundColor: bg, color: color, padding: '12px', borderRadius: '8px', 
      border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px'
    })
  };

  return (
    <div style={styles.container}>
      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
        <ArrowLeft onClick={() => navigate(-1)} cursor="pointer" />
        <h2>Event Details</h2>
      </div>

      <div style={styles.card}>
        <img src={event.image} alt={event.title} style={styles.image} />
        <div style={styles.content}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
             <h1>{event.title}</h1>
             <span style={{
                backgroundColor: event.status === 'Active' ? '#dcfce7' : '#f1f5f9', 
                padding: '5px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', 
                color: event.status === 'Active' ? '#166534' : '#475569' 
             }}>
                {event.status}
             </span>
          </div>
          
          <div style={{display:'flex', gap:'20px', margin:'15px 0', color:'#64748b'}}>
            <span><Calendar size={18}/> {event.date.split('·')[0]}</span>
            <span><Clock size={18}/> {event.date.split('·')[1] || '10:00 AM'}</span>
          </div>
          <p>{event.desc || "No description provided for this event."}</p>

          <div style={styles.btnGrid}>
            <button style={styles.btn('#4f46e5', '#fff')} onClick={() => navigate(`/edit-event/${event.id}`)}>
              <Edit3 size={18}/> Edit Event
            </button>

            {/* ✅ UPDATED: Navigates to Event Specific Registrations */}
            <button style={styles.btn(isDark?'#334155':'#e0e7ff', isDark?'#fff':'#4338ca')} onClick={() => navigate(`/event-registrations/${event.id}`)}>
              <Users size={18}/> View Registrations
            </button>

            <button style={{...styles.btn('#fee2e2', '#ef4444'), gridColumn:'1/-1'}} onClick={() => setShowDeletePopup(true)}>
              <Trash2 size={18}/> Delete Event
            </button>
          </div>
        </div>
      </div>

      {showDeletePopup && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background: isDark?'#1e293b':'#fff', padding:'30px', borderRadius:'15px', textAlign:'center', width:'80%', maxWidth:'350px'}}>
            <AlertTriangle size={40} color="#ef4444" style={{marginBottom:'10px'}}/>
            <h3 style={{color: isDark?'#fff':'#000'}}>Delete Event?</h3>
            <p style={{color:'#64748b', marginBottom:'20px'}}>This action cannot be undone.</p>
            <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
              <button onClick={() => setShowDeletePopup(false)} style={{padding:'10px 20px', borderRadius:'8px', border:'none', cursor:'pointer'}}>Cancel</button>
              <button onClick={handleDelete} style={{padding:'10px 20px', borderRadius:'8px', border:'none', background:'#ef4444', color:'#fff', cursor:'pointer'}}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherEventDetails;