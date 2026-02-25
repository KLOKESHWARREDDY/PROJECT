import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Upload, X, CheckCircle,
  Calendar, Clock, Tag, Heading,
  MapPin, AlignLeft, Camera, Save, Send, ArrowDownToLine
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
  const [location, setLocation] = useState("");
  const [eventImage, setEventImage] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [eventStatus, setEventStatus] = useState("draft");
  const [actionLoading, setActionLoading] = useState(false);

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const initialValues = useRef({});

  // Load data when component mounts
  useEffect(() => {
    if (eventToEdit) {
      setEventName(eventToEdit.title || "");
      setDescription(eventToEdit.description || "");
      setLocation(eventToEdit.location || "");
      setCategory(eventToEdit.category || "Technology");
      setEventImage(eventToEdit.image || null);
      setEventStatus(eventToEdit.status || "draft");

      // Store initial values for change tracking
      initialValues.current = {
        title: eventToEdit.title || "",
        description: eventToEdit.description || "",
        location: eventToEdit.location || "",
        category: eventToEdit.category || "Technology",
        image: eventToEdit.image || null,
        date: "",
        time: ""
      };

      // Parse date/time if stored as string "YYYY-MM-DD · HH:MM"
      if (eventToEdit.date && eventToEdit.date.includes("·")) {
        const parts = eventToEdit.date.split("·");
        setDate(parts[0].trim());
        setTime(parts[1].trim());
        initialValues.current.date = parts[0].trim();
        initialValues.current.time = parts[1].trim();
      } else if (eventToEdit.date) {
        // Handle ISO date string
        try {
          const dateObj = new Date(eventToEdit.date);
          setDate(dateObj.toISOString().split('T')[0]);
          setTime(dateObj.toTimeString().slice(0, 5));
          initialValues.current.date = dateObj.toISOString().split('T')[0];
          initialValues.current.time = dateObj.toTimeString().slice(0, 5);
        } catch (e) {
          setDate(eventToEdit.date || "");
          initialValues.current.date = eventToEdit.date || "";
        }
      }
    }
  }, [eventToEdit]);

  // Track changes
  useEffect(() => {
    const hasChanges =
      eventName !== initialValues.current.title ||
      description !== initialValues.current.description ||
      location !== initialValues.current.location ||
      category !== initialValues.current.category ||
      date !== initialValues.current.date ||
      time !== initialValues.current.time ||
      eventImage !== initialValues.current.image;

    setHasUnsavedChanges(hasChanges);
  }, [eventName, description, location, category, date, time, eventImage]);

  const handleUpdate = async () => {
    if (!eventName || !date || !time) {
      setPopupMessage("Please fill in all required fields");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    try {
      const dateTime = new Date(`${date}T${time}`);

      const updatedEvent = {
        title: eventName,
        description: description,
        date: dateTime.toISOString(),
        location: location,
        category: category,
        image: eventImage,
      };

      const eventId = eventToEdit._id || eventToEdit.id;
      await eventAPI.update(eventId, updatedEvent);

      setPopupMessage("Event updated successfully!");
      setShowPopup(true);
      setHasUnsavedChanges(false);

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

  // Publish Event - Make it visible to public
  const handlePublish = async () => {
    if (!eventName || !date || !time) {
      setPopupMessage("Please fill in all required fields before publishing");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    setActionLoading(true);
    try {
      const eventId = eventToEdit._id || eventToEdit.id;
      const dateTime = new Date(`${date}T${time}`);

      // Update event with new details AND set status to published
      const updatedEvent = {
        title: eventName,
        description: description,
        date: dateTime.toISOString(),
        location: location,
        category: category,
        image: eventImage,
        status: "published"
      };

      console.log("Publishing event with details:", updatedEvent);

      // Use update API with status included
      await eventAPI.update(eventId, updatedEvent);

      setEventStatus('published');
      setPopupMessage("Event published successfully!");
      setShowPopup(true);
      setHasUnsavedChanges(false);

      setTimeout(() => {
        navigate('/teacher-events');
      }, 1500);
    } catch (error) {
      console.error('Error publishing event:', error);
      setPopupMessage("Failed to publish event");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } finally {
      setActionLoading(false);
    }
  };

  // Unpublish Event - Revert to draft
  const handleUnpublish = async () => {
    setActionLoading(true);
    try {
      const eventId = eventToEdit._id || eventToEdit.id;
      await eventAPI.unpublish(eventId);

      setEventStatus('draft');
      setPopupMessage("Event unpublished! Now only visible to you.");
      setShowPopup(true);

      setTimeout(() => {
        navigate('/teacher-events');
      }, 1500);
    } catch (error) {
      console.error('Error unpublishing event:', error);
      setPopupMessage("Failed to unpublish event");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } finally {
      setActionLoading(false);
    }
  };

  // Complete Event - Mark as completed
  const handleComplete = async () => {
    setActionLoading(true);
    try {
      const eventId = eventToEdit._id || eventToEdit.id;
      await eventAPI.complete(eventId);

      setEventStatus('completed');
      setPopupMessage("Event marked as completed!");
      setShowPopup(true);

      setTimeout(() => {
        navigate('/teacher-events');
      }, 1500);
    } catch (error) {
      console.error('Error completing event:', error);
      setPopupMessage("Failed to complete event");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Back with unsaved changes
  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowCancelPopup(true);
    } else {
      navigate(-1);
    }
  };

  const handleSaveDraft = async () => {
    await handleUpdate();
    setShowCancelPopup(false);
  };

  const handleDiscard = () => {
    navigate(-1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEventImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div style={{ padding: '20px', color: isDark ? '#fff' : '#000' }}>Loading...</div>;
  if (!eventToEdit) return <div style={{ padding: '20px' }}>Event not found</div>;

  const styles = {
    container: {
      padding: isMobile ? '4vw' : '2vw',
      maxWidth: isMobile ? '100vw' : '50vw',
      margin: '0 auto',
      backgroundColor: isDark ? '#0f172a' : '#EFF6FF',
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

    // Status Badge
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: eventStatus === 'published' ? '#dcfce7' : eventStatus === 'completed' ? '#EFF6FF' : '#fef3c7',
      color: eventStatus === 'published' ? '#166534' : eventStatus === 'completed' ? '#1E3A8A' : '#92400e',
    },

    form: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
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
      backgroundColor: isDark ? '#0f172a' : '#EFF6FF',
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

    // Button styles
    buttonRow: { display: 'flex', gap: '1vw', marginTop: '2vh', flexWrap: 'wrap' },

    submitBtn: {
      flex: 1,
      padding: isMobile ? '2vh' : '1.5vh',
      backgroundColor: '#2563EB', color: '#fff',
      border: 'none', borderRadius: isMobile ? '2vw' : '0.8vw',
      fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5vw',
      minWidth: '120px'
    },

    publishBtn: {
      flex: 1,
      padding: isMobile ? '2vh' : '1.5vh',
      backgroundColor: actionLoading ? '#94a3b8' : '#10b981',
      color: '#fff',
      border: 'none', borderRadius: isMobile ? '2vw' : '0.8vw',
      fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold',
      cursor: actionLoading ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5vw',
      minWidth: '120px'
    },

    unpublishBtn: {
      flex: 1,
      padding: isMobile ? '2vh' : '1.5vh',
      backgroundColor: actionLoading ? '#94a3b8' : '#f59e0b',
      color: '#fff',
      border: 'none', borderRadius: isMobile ? '2vw' : '0.8vw',
      fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold',
      cursor: actionLoading ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5vw',
      minWidth: '120px'
    },

    completeBtn: {
      flex: 1,
      padding: isMobile ? '2vh' : '1.5vh',
      backgroundColor: actionLoading ? '#94a3b8' : '#2563EB',
      color: '#fff',
      border: 'none', borderRadius: isMobile ? '2vw' : '0.8vw',
      fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold',
      cursor: actionLoading ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5vw',
      minWidth: '120px'
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

    // Popup
    popupOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    popup: {
      backgroundColor: '#ffffff', padding: '30px', borderRadius: '20px',
      textAlign: 'center', width: '80%', maxWidth: '300px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)', animation: 'popIn 0.3s ease'
    },
    popupIcon: {
      fontSize: '40px', marginBottom: '10px',
      color: popupMessage.includes("success") || popupMessage.includes("successfully") ? '#10b981' : '#ef4444'
    },

    // Unsaved Changes Popup
    unsavedPopupOverlay: {
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    },
    unsavedPopup: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
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
        <button style={styles.backBtn} onClick={handleBackClick}>
          <ArrowLeft size={isMobile ? 24 : 20} />
        </button>
        <h1 style={styles.pageTitle}>Edit Event</h1>
        <span style={styles.statusBadge}>
          {eventStatus === 'published' ? 'Published' : eventStatus === 'completed' ? 'Completed' : 'Draft'}
        </span>
      </div>

      <div style={styles.form}>

        {/* Image Upload */}
        <div style={styles.inputGroup}>
          <div style={styles.label}><Camera size={16} /> Event Cover Image</div>
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
          <label style={styles.label}><Heading size={16} /> Event Name</label>
          <input
            style={styles.input}
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            readOnly={eventStatus === 'completed'}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}><Calendar size={16} /> Date</label>
            <input
              style={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              readOnly={eventStatus === 'completed'}
            />
          </div>
          <div style={styles.col}>
            <label style={styles.label}><Clock size={16} /> Time</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {/* Hour */}
              <select
                style={{ ...styles.input, flex: 1, minWidth: '60px' }}
                value={time ? (parseInt(time.split(':')[0]) % 12 || 12).toString().padStart(2, '0') : ''}
                onChange={(e) => {
                  const newHour12 = parseInt(e.target.value);
                  const currentMin = time ? parseInt(time.split(':')[1]) : 0;
                  const currentHour24 = time ? parseInt(time.split(':')[0]) : 12;
                  const isPM = currentHour24 >= 12;

                  let newHour24 = newHour12;
                  if (isPM && newHour12 !== 12) newHour24 += 12;
                  else if (!isPM && newHour12 === 12) newHour24 = 0;

                  setTime(`${newHour24.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`);
                }}
                disabled={eventStatus === 'completed'}
              >
                <option value="" disabled>Hr</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                ))}
              </select>

              <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: isDark ? '#fff' : '#333' }}>:</span>

              {/* Minute */}
              <select
                style={{ ...styles.input, flex: 1, minWidth: '60px' }}
                value={time ? time.split(':')[1] : ''}
                onChange={(e) => {
                  const newMin = e.target.value;
                  const currentHour24 = time ? parseInt(time.split(':')[0]) : 12; // Default to 12 PM if empty
                  setTime(`${currentHour24.toString().padStart(2, '0')}:${newMin}`);
                }}
                disabled={eventStatus === 'completed'}
              >
                <option value="" disabled>Min</option>
                {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                  <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
                ))}
              </select>

              {/* AM/PM */}
              <select
                style={{ ...styles.input, flex: 1, minWidth: '70px' }}
                value={time ? (parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM') : 'PM'} // Default to PM
                onChange={(e) => {
                  const newPeriod = e.target.value;
                  if (!time) {
                    setTime(newPeriod === 'AM' ? '00:00' : '12:00');
                    return;
                  }

                  const [h, m] = time.split(':');
                  let hour = parseInt(h);

                  if (newPeriod === 'AM' && hour >= 12) hour -= 12;
                  else if (newPeriod === 'PM' && hour < 12) hour += 12;

                  setTime(`${hour.toString().padStart(2, '0')}:${m}`);
                }}
                disabled={eventStatus === 'completed'}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>
        <br />

        <div style={styles.inputGroup}>
          <label style={styles.label}><Tag size={16} /> Category</label>
          <select
            style={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={eventStatus === 'completed'}
          >
            <option>Technology</option>
            <option>Workshop</option>
            <option>Seminar</option>
            <option>Cultural</option>
            <option>Sports</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}><MapPin size={16} /> Location</label>
          <input
            style={styles.input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            readOnly={eventStatus === 'completed'}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}><AlignLeft size={16} /> Description</label>
          <textarea
            style={{ ...styles.input, height: '100px', resize: 'none' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly={eventStatus === 'completed'}
          />
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonRow}>
          {/* Save Button - Hide for completed events */}
          {eventStatus !== 'completed' && (
            <button style={styles.submitBtn} onClick={handleUpdate}>
              <Save size={18} /> Save
            </button>
          )}

          {/* Publish Button - Only show for Draft */}
          {eventStatus === 'draft' && (
            <button style={styles.publishBtn} onClick={handlePublish} disabled={actionLoading}>
              <Send size={18} /> Publish
            </button>
          )}

          {/* Unpublish Button - Only show for Published */}
          {eventStatus === 'published' && (
            <button style={styles.unpublishBtn} onClick={handleUnpublish} disabled={actionLoading}>
              <ArrowDownToLine size={18} /> Unpublish
            </button>
          )}

          {/* Complete Button - Show for both Draft and Published */}
          {eventStatus !== 'completed' && (
            <button style={styles.completeBtn} onClick={handleComplete} disabled={actionLoading}>
              <CheckCircle size={18} /> Complete
            </button>
          )}
        </div>

        {/* Cancel Button */}
        <button style={styles.cancelBtn} onClick={handleDiscard}>
          Cancel
        </button>

      </div>

      {/* Success/Error Popup */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <div style={styles.popupIcon}>
              {popupMessage.includes("success") || popupMessage.includes("successfully") ?
                <CheckCircle size={48} color="#10b981" /> :
                <X size={48} color="#ef4444" />}
            </div>
            <h3 style={{ color: '#1f293b', marginBottom: '5px' }}>
              {popupMessage.includes("success") || popupMessage.includes("successfully") ? "Success!" : "Error"}
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>{popupMessage}</p>
          </div>
        </div>
      )}

      {/* Unsaved Changes Popup */}
      {showCancelPopup && (
        <div style={styles.unsavedPopupOverlay} onClick={() => setShowCancelPopup(false)}>
          <div style={styles.unsavedPopup} onClick={(e) => e.stopPropagation()}>
            <div style={styles.popupTitle}>You have unsaved changes</div>

            <button style={styles.popupOption('#15803d', '#dcfce7')} onClick={handleSaveDraft}>
              <Save size={20} /> Save Changes
            </button>

            <button style={styles.popupOption('#b91c1c', '#fee2e2')} onClick={handleDiscard}>
              <X size={20} /> Discard Changes
            </button>

            <button style={styles.popupOption(isDark ? '#fff' : '#333', isDark ? '#334155' : '#f1f5f9')} onClick={() => setShowCancelPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditEvent;
