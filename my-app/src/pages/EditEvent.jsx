import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Upload, X, CheckCircle, 
  Calendar, Clock, Tag, Heading, 
  MapPin, AlignLeft, Camera, Save, Send
} from 'lucide-react';
import api, { eventAPI } from '../api';

function EditEvent({ events, onUpdate, theme }) {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ Get ID from URL
  const isDark = theme === 'dark';

  console.log("EditEvent - Received ID:", id);
  console.log("EditEvent - Available events:", events.map(e => ({ id: e.id, _id: e._id, title: e.title })));

  // Responsive Check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // State for event from API
  const [eventToEdit, setEventToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event from backend on mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("EditEvent - Token:", token);
        
        const response = await eventAPI.getEventById(id);
        console.log("EditEvent - Event response:", response.data);
        
        setEventToEdit(response.data);
      } catch (error) {
        console.log('Error fetching event:', error.message);
        // Fallback to finding from props
        const foundEvent = events.find((e) => e.id === id || e._id === id);
        setEventToEdit(foundEvent || null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEvent();
    }
  }, [id, events]);

  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Technology");
  const [location, setLocation] = useState(""); // Added Location
  const [eventImage, setEventImage] = useState(null);
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [eventStatus, setEventStatus] = useState(eventToEdit?.status || "draft");

  // Load data when component mounts
  useEffect(() => {
    if (eventToEdit) {
      setEventName(eventToEdit.title || "");
      setDescription(eventToEdit.description || "");
      setLocation(eventToEdit.location || "");
      setCategory(eventToEdit.category || "Technology");
      setEventImage(eventToEdit.image || null);
      setEventStatus(eventToEdit.status || "draft");
      
      // Parse date/time if stored as string "YYYY-MM-DD · HH:MM"
      if (eventToEdit.date && eventToEdit.date.includes("·")) {
        const parts = eventToEdit.date.split("·");
        setDate(parts[0].trim());
        setTime(parts[1].trim());
      } else {
        setDate(eventToEdit.date || "");
        setTime(eventToEdit.time || "");
      }
    }
  }, [eventToEdit]);

  const handleUpdate = async () => {
    if (!eventName || !date || !time) {
      setPopupMessage("Please fill in all required fields");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    try {
      const updatedEvent = {
        title: eventName,
        description: description,
        date: `${date} · ${time}`,
        location: location,
        category: category,
        image: eventImage,
      };

      const eventId = eventToEdit._id || eventToEdit.id;
      await api.put(`/events/${eventId}`, updatedEvent);
      
      setPopupMessage("Event updated successfully!");
      setShowPopup(true);

      setTimeout(() => {
        if (onUpdate) onUpdate(eventId, updatedEvent);
        navigate('/teacher-events');
      }, 1500);
    } catch (error) {
      console.error('Error updating event:', error);
      setPopupMessage("Failed to update event");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  const handlePublish = async () => {
    if (!eventName || !date || !time) {
      setPopupMessage("Please fill in all required fields before publishing");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    try {
      const updatedEvent = {
        title: eventName,
        description: description,
        date: `${date} · ${time}`,
        location: location,
        category: category,
        image: eventImage,
        status: 'active',
      };

      const eventId = eventToEdit._id || eventToEdit.id;
      await api.put(`/events/${eventId}`, updatedEvent);

      setPopupMessage("Event published successfully!");
      setShowPopup(true);

      setTimeout(() => {
        if (onUpdate) onUpdate(eventId, { ...updatedEvent, status: 'active' });
        navigate('/teacher-events');
      }, 1500);
    } catch (error) {
      console.error('Error publishing event:', error);
      setPopupMessage("Failed to publish event");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
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

  if (loading) return <div style={{padding:'20px', color: isDark?'#fff':'#000'}}>Loading...</div>;
  if (!eventToEdit) return <div style={{padding:'20px'}}>Event not found</div>;

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
    header: {
      display: 'flex', alignItems: 'center', gap: '2vw', marginBottom: '3vh'
    },
    backBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: isDark ? '#fff' : '#64748b', display: 'flex', alignItems: 'center'
    },
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
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', marginBottom: '3vh',
      position: 'relative', overflow: 'hidden',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      transition: 'border-color 0.2s'
    },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
    removeBtn: {
      position: 'absolute', top: '10px', right: '10px',
      backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
      border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer'
    },
    uploadText: { marginTop: '10px', color: '#64748b', fontSize: isMobile ? '3.5vw' : '0.9vw' },

    label: { 
      fontSize: isMobile ? '3.5vw' : '0.9vw', fontWeight: '600', 
      marginBottom: '0.8vh', display: 'flex', alignItems: 'center', gap: '0.5vw',
      color: isDark ? '#cbd5e1' : '#334155'
    },
    inputGroup: { marginBottom: '2.5vh' },
    input: {
      width: '100%', padding: isMobile ? '1.5vh 3vw' : '1.2vh 1vw',
      borderRadius: isMobile ? '2vw' : '0.8vw',
      border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: isDark ? '#0f172a' : '#fff',
      color: isDark ? '#fff' : '#1e293b',
      fontSize: isMobile ? '4vw' : '1vw',
      outline: 'none', boxSizing: 'border-box'
    },
    row: { display: 'flex', gap: isMobile ? '3vw' : '1.5vw' },
    col: { flex: 1 },

    submitBtn: {
      width: '100%', padding: isMobile ? '2vh' : '1.5vh',
      backgroundColor: '#4f46e5', color: '#fff',
      border: 'none', borderRadius: isMobile ? '2vw' : '0.8vw',
      fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold',
      cursor: 'pointer', marginTop: '2vh',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5vw'
    },

    popupOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    popup: {
      backgroundColor: '#fff', padding: '30px', borderRadius: '20px',
      textAlign: 'center', width: '80%', maxWidth: '300px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)', animation: 'popIn 0.3s ease'
    },
    popupIcon: {
      fontSize: '40px', marginBottom: '10px',
      color: popupMessage.includes("success") ? '#10b981' : '#ef4444'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={isMobile ? 24 : 20} />
        </button>
        <h1 style={styles.pageTitle}>Edit Event</h1>
      </div>

      <div style={styles.form}>
        
        {/* Image Upload */}
        <div style={styles.inputGroup}>
          <div style={styles.label}><Camera size={16}/> Event Cover Image</div>
          <div style={styles.uploadBox} onClick={() => document.getElementById('fileInput').click()}>
            {eventImage ? (
              <>
                <img src={eventImage} alt="Preview" style={styles.previewImg} />
                <button style={styles.removeBtn} onClick={(e) => { e.stopPropagation(); setEventImage(null); }}>
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <Upload size={32} color="#94a3b8" />
                <span style={styles.uploadText}>Tap to upload image</span>
              </>
            )}
            <input id="fileInput" type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </div>
        </div>

        {/* Inputs */}
        <div style={styles.inputGroup}>
          <label style={styles.label}><Heading size={16}/> Event Name</label>
          <input style={styles.input} value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </div>

        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}><Calendar size={16}/> Date</label>
            <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={styles.col}>
            <label style={styles.label}><Clock size={16}/> Time</label>
            <input style={styles.input} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <br/>

        <div style={styles.inputGroup}>
          <label style={styles.label}><Tag size={16}/> Category</label>
          <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Technology</option>
            <option>Workshop</option>
            <option>Seminar</option>
            <option>Cultural</option>
            <option>Sports</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}><MapPin size={16}/> Location</label>
          <input style={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}><AlignLeft size={16}/> Description</label>
          <textarea 
            style={{...styles.input, height: '100px', resize: 'none'}} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <button style={styles.submitBtn} onClick={handleUpdate}>
          Save Changes <Save size={18} />
        </button>

        {eventStatus?.toLowerCase() === 'draft' && (
          <button 
            style={{...styles.submitBtn, backgroundColor: '#10b981', marginTop: '10px'}} 
            onClick={handlePublish}
          >
            Publish Event <Send size={18} />
          </button>
        )}

      </div>

      {/* Popup */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <div style={styles.popupIcon}>
              {popupMessage.includes("success") ? <CheckCircle size={48} color="#10b981"/> : <X size={48} color="#ef4444"/>}
            </div>
            <h3 style={{color: '#1e293b', marginBottom:'5px'}}>{popupMessage.includes("success") ? "Success!" : "Error"}</h3>
            <p style={{color: '#64748b', fontSize:'14px'}}>{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditEvent;