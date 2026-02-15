import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, CheckCircle, Calendar, Clock, Tag, MapPin, AlignLeft, Save, AlertTriangle, FileText, Trash2 } from 'lucide-react';
import { eventAPI } from '../api';

function CreateEvent({ onCreate, theme }) {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Technology");
  const [eventImage, setEventImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  // --- ACTIONS ---

  // 1. Save as Draft (local only)
  const handleSaveDraft = () => {
    const draftEvent = {
      id: Date.now(),
      title: eventName || "Untitled Draft",
      desc: description,
      date: date ? `${date} · ${time}` : "Date TBD",
      location: location || "Location TBD",
      category,
      image: eventImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
      registrations: 0,
      status: 'draft' 
    };
    onCreate(draftEvent);
    navigate(-1);
  };

  // 2. Discard
  const handleDiscard = () => {
    navigate(-1);
  };

  // 3. Publish Event (saves to MongoDB)
  const handlePublish = async () => {
    setError("");
    
    // Validation
    if (!eventName) {
      setError("Event name is required");
      return;
    }
    if (!description) {
      setError("Description is required");
      return;
    }
    if (!date) {
      setError("Date is required");
      return;
    }
    if (!time) {
      setError("Time is required");
      return;
    }
    if (!location) {
      setError("Location is required");
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const dateTime = new Date(`${date}T${time}`);
      
      // Create event data for backend
      const eventData = {
        title: eventName,
        description: description,
        date: dateTime.toISOString(),
        location: location,
        status: 'draft'
      };

      console.log('📝 Publishing event:', eventData);

      // Call backend API
      const response = await eventAPI.create(eventData);
      
      console.log('✅ Event saved to MongoDB:', response.data);

      // Also update local state
      const newEvent = {
        id: response.data._id,
        title: response.data.title,
        desc: response.data.description,
        date: `${date} · ${time}`,
        location: response.data.location,
        category,
        image: eventImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
        registrations: 0,
        status: 'Active',
        teacher: response.data.teacher
      };

      onCreate(newEvent);
      setShowSuccessPopup(true);
      
      setTimeout(() => {
        navigate('/teacher-events'); 
      }, 1500);
      
    } catch (err) {
      console.error('❌ Error creating event:', err);
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEventImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const styles = {
    container: {
      padding: isMobile ? '4vw' : '2vw',
      maxWidth: isMobile ? '100vw' : '50vw',
      margin: '0 auto',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      color: isDark ? '#fff' : '#1e293b',
      paddingBottom: '10vh'
    },
    header: { display: 'flex', alignItems: 'center', gap: '2vw', marginBottom: '3vh' },
    backBtn: { background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#fff' : '#64748b', display: 'flex', alignItems: 'center' },
    pageTitle: { fontSize: isMobile ? '6vw' : '2vw', fontWeight: '800' },
    
    form: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      padding: isMobile ? '5vw' : '2.5vw',
      borderRadius: isMobile ? '4vw' : '1.5vw',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
    },
    
    uploadBox: {
      border: isDark ? '2px dashed #475569' : '2px dashed #cbd5e1',
      borderRadius: '1.5vw',
      height: isMobile ? '25vh' : '25vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', marginBottom: '3vh',
      position: 'relative', overflow: 'hidden',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc'
    },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
    uploadText: { marginTop: '10px', color: '#64748b', fontSize: isMobile ? '3.5vw' : '0.9vw' },

    label: { fontSize: isMobile ? '3.5vw' : '0.9vw', fontWeight: '600', marginBottom: '0.8vh', display: 'flex', alignItems: 'center', gap: '0.5vw', color: isDark ? '#cbd5e1' : '#334155' },
    input: {
      width: '100%', padding: isMobile ? '1.5vh 3vw' : '1.2vh 1vw',
      borderRadius: isMobile ? '2vw' : '0.8vw',
      border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: isDark ? '#0f172a' : '#fff',
      color: isDark ? '#fff' : '#1e293b',
      fontSize: isMobile ? '4vw' : '1vw',
      outline: 'none'
    },
    row: { display: 'flex', gap: isMobile ? '3vw' : '1.5vw', marginBottom: '2.5vh' },
    col: { flex: 1 },

    // Error message
    errorText: {
      color: '#ef4444',
      fontSize: isMobile ? '3vw' : '0.85vw',
      marginBottom: '1vh'
    },

    // Buttons
    submitBtn: {
      width: '100%', padding: isMobile ? '2vh' : '1.5vh',
      backgroundColor: loading ? '#94a3b8' : '#4f46e5', color: '#fff',
      border: 'none', borderRadius: isMobile ? '2vw' : '0.8vw',
      fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold',
      cursor: loading ? 'not-allowed' : 'pointer', marginTop: '2vh',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5vw'
    },
    cancelBtn: {
      width: '100%', padding: isMobile ? '2vh' : '1.5vh',
      backgroundColor: 'transparent', color: isDark ? '#94a3b8' : '#64748b',
      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
      borderRadius: isMobile ? '2vw' : '0.8vw',
      fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold',
      cursor: 'pointer', marginTop: '1.5vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    },

    // Popup Styles
    popupOverlay: {
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', 
      zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    },
    popup: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      width: '100%', maxWidth: '500px',
      borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
      padding: '30px', animation: 'slideUp 0.3s ease-out',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.2)'
    },
    popupTitle: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', color: isDark ? '#fff' : '#1e293b' },
    popupOption: (color, bg) => ({
      width: '100%', padding: '15px', marginBottom: '10px',
      borderRadius: '12px', border: 'none',
      backgroundColor: bg, color: color,
      fontSize: '1rem', fontWeight: '600',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
    })
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => setShowCancelPopup(true)}>
          <ArrowLeft size={isMobile ? 24 : 24} />
        </button>
        <h1 style={styles.pageTitle}>Create Event</h1>
      </div>

      <div style={styles.form}>
        {/* Error Message */}
        {error && (
          <div style={styles.errorText}>{error}</div>
        )}

        {/* Image Upload */}
        <div style={{marginBottom:'2.5vh'}}>
          <div style={styles.label}>Event Cover Image</div>
          <div style={styles.uploadBox} onClick={() => document.getElementById('fileInput').click()}>
            {eventImage ? <img src={eventImage} style={styles.previewImg} alt="Preview"/> : (
              <>
                <Upload size={32} color="#94a3b8" />
                <span style={styles.uploadText}>Tap to upload image</span>
              </>
            )}
            <input id="fileInput" type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </div>
        </div>

        {/* Event Name */}
        <div style={{marginBottom:'2.5vh'}}>
          <label style={styles.label}>Event Name *</label>
          <input 
            style={styles.input} 
            placeholder="e.g. AI Workshop" 
            value={eventName} 
            onChange={(e) => setEventName(e.target.value)} 
          />
        </div>

        {/* Date & Time */}
        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}><Calendar size={16}/> Date *</label>
            <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={styles.col}>
            <label style={styles.label}><Clock size={16}/> Time *</label>
            <input style={styles.input} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        {/* Category & Location */}
        <div style={styles.row}>
           <div style={styles.col}>
             <label style={styles.label}><Tag size={16}/> Category</label>
             <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
               <option>Technology</option>
               <option>Cultural</option>
               <option>Sports</option>
               <option>Workshop</option>
               <option>Seminar</option>
             </select>
           </div>
           <div style={styles.col}>
             <label style={styles.label}><MapPin size={16}/> Location *</label>
             <input style={styles.input} placeholder="e.g. Auditorium" value={location} onChange={(e) => setLocation(e.target.value)} />
           </div>
        </div>

        {/* Description */}
        <div style={{marginBottom:'2.5vh'}}>
          <label style={styles.label}><AlignLeft size={16}/> Description *</label>
          <textarea 
            style={{...styles.input, height: '100px', resize: 'none'}} 
            placeholder="Event details..." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        {/* Submit Button */}
        <button style={styles.submitBtn} onClick={handlePublish} disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Event'}
        </button>

        {/* Cancel Button */}
        <button style={styles.cancelBtn} onClick={() => setShowCancelPopup(true)}>
          Cancel
        </button>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div style={{background:'#fff', padding:'30px', borderRadius:'20px', textAlign:'center', animation:'popIn 0.3s ease'}}>
            <CheckCircle size={50} color="#10b981" style={{marginBottom:'10px'}}/>
            <h3 style={{color:'#1f2937'}}>Event Published!</h3>
          </div>
        </div>
      )}

      {/* Cancel Popup */}
      {showCancelPopup && (
        <div style={styles.popupOverlay} onClick={() => setShowCancelPopup(false)}>
          <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div style={styles.popupTitle}>Unsaved Changes</div>
            
            <button style={styles.popupOption('#15803d', '#dcfce7')} onClick={handleSaveDraft}>
              <FileText size={20}/> Save as Draft
            </button>
            
            <button style={styles.popupOption('#b91c1c', '#fee2e2')} onClick={handleDiscard}>
              <Trash2 size={20}/> Don't Save
            </button>
            
            <button style={styles.popupOption(isDark?'#fff':'#333', isDark?'#334155':'#f1f5f9')} onClick={() => setShowCancelPopup(false)}>
              <X size={20}/> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEvent;
