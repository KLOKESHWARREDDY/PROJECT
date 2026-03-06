import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Upload, X, CheckCircle, Calendar, Clock, Tag, MapPin, AlignLeft, Send, FileText, Trash2, AlertTriangle } from 'lucide-react';
import './CreateEvent.css';

function CreateEvent({ onCreate, theme }) {
  const navigate = useNavigate();
  const isDark = ['dark', 'purple-gradient', 'blue-ocean', 'midnight-dark', 'emerald-dark', 'cherry-dark', 'slate-minimal'].includes(theme);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Form state
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Popups
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialValues = useRef({ eventName: "", description: "", date: "", time: "", location: "", category: "" });

  useEffect(() => {
    const hasChanges =
      eventName !== initialValues.current.eventName ||
      description !== initialValues.current.description ||
      date !== initialValues.current.date ||
      time !== initialValues.current.time ||
      location !== initialValues.current.location ||
      category !== initialValues.current.category ||
      eventImage !== null;

    setHasUnsavedChanges(hasChanges);
  }, [eventName, description, date, time, location, category, eventImage]);

  // --- ACTIONS ---

  const handleSaveDraft = async () => {
    setError("");
    setLoading(true);
    try {
      const dateTime = date && time ? new Date(`${date}T${time}`) : null;
      const eventData = {
        title: eventName || "Untitled Draft",
        description: description || "",
        date: dateTime ? dateTime.toISOString() : "",
        location: location || "",
        category: category || "Technology",
        image: eventImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        status: "draft"
      };

      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:5000/api/events", eventData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      const newEvent = {
        id: response.data._id,
        title: response.data.title,
        desc: response.data.description,
        date: date && time ? `${date} · ${time}` : "Date TBD",
        location: response.data.location,
        category: category,
        image: eventImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
        registrations: 0,
        status: 'Draft'
      };

      onCreate(newEvent);
      setSuccessMessage("Draft Saved!");
      setShowSuccessPopup(true);
      setTimeout(() => navigate('/teacher-events'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!eventName || !description || !date || !time || !location) {
      setError("Please fill in all required fields marked with *");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const dateTime = new Date(`${date}T${time}`);
      const eventData = {
        title: eventName,
        description: description,
        date: dateTime.toISOString(),
        location: location,
        category: category || "Technology",
        image: eventImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        status: "published"
      };

      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:5000/api/events", eventData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      const newEvent = {
        id: response.data._id,
        title: response.data.title,
        desc: response.data.description,
        date: `${date} · ${time}`,
        location: response.data.location,
        category: category,
        image: eventImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
        registrations: 0,
        status: 'Active'
      };

      onCreate(newEvent);
      setSuccessMessage("Event Published!");
      setShowSuccessPopup(true);
      setTimeout(() => navigate('/teacher-events'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to publish event");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => navigate(-1);

  const handleBackClick = () => {
    if (hasUnsavedChanges && (eventName || description || date || time || location)) {
      setShowCancelPopup(true);
    } else {
      navigate(-1);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setShowErrorPopup(true);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setEventImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="ce-page-wrapper">
      <div className="ce-bg-glow" />
      <div className="ce-bg-glow-alt" />

      <div className="ce-container">
        <header className="ce-header">
          <button className="ce-back-btn" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="ce-title">Create Event</h1>
        </header>

        <div className="ce-form-card">
          {error && <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '700', marginBottom: '-16px' }}>{error}</div>}

          <div className="ce-field">
            <label className="ce-label">Event Cover Image</label>
            <div className="ce-image-upload" onClick={() => document.getElementById('fileInput').click()}>
              {eventImage ? <img src={eventImage} className="ce-preview-img" alt="Preview" /> : (
                <div className="ce-upload-placeholder">
                  <Upload size={40} color="var(--elite-accent)" />
                  <span>Tap to upload high-quality cover</span>
                </div>
              )}
              <input id="fileInput" type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </div>
          </div>

          <div className="ce-field">
            <label className="ce-label">Event Name *</label>
            <input
              className="ce-input"
              placeholder="e.g. AI & Future Tech Summit"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className="ce-row">
            <div className="ce-field">
              <label className="ce-label"><Calendar size={16} /> Date *</label>
              <input className="ce-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="ce-field">
              <label className="ce-label"><Clock size={16} /> Time *</label>
              <div className="ce-time-grid">
                <select
                  className="ce-select"
                  value={time ? (parseInt(time.split(':')[0]) % 12 || 12).toString().padStart(2, '0') : ''}
                  onChange={(e) => {
                    const newHour12 = parseInt(e.target.value);
                    const currentMin = time ? parseInt(time.split(':')[1]) : 0;
                    const currentHour24 = time ? parseInt(time.split(':')[0]) : 12;
                    const isPM = currentHour24 >= 12;
                    let newHour24 = newHour12 === 12 ? (isPM ? 12 : 0) : (isPM ? newHour12 + 12 : newHour12);
                    setTime(`${newHour24.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`);
                  }}
                >
                  <option value="" disabled>Hr</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                    <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <span className="ce-time-separator">:</span>
                <select
                  className="ce-select"
                  value={time ? time.split(':')[1] : ''}
                  onChange={(e) => {
                    const newMin = e.target.value;
                    const currentHour24 = time ? parseInt(time.split(':')[0]) : 12;
                    setTime(`${currentHour24.toString().padStart(2, '0')}:${newMin}`);
                  }}
                >
                  <option value="" disabled>Min</option>
                  {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                    <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <select
                  className="ce-select"
                  value={time ? (parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM') : 'PM'}
                  onChange={(e) => {
                    const newPeriod = e.target.value;
                    if (!time) { setTime(newPeriod === 'AM' ? '00:00' : '12:00'); return; }
                    const [h, m] = time.split(':');
                    let hour = parseInt(h);
                    if (newPeriod === 'AM' && hour >= 12) hour -= 12;
                    else if (newPeriod === 'PM' && hour < 12) hour += 12;
                    setTime(`${hour.toString().padStart(2, '0')}:${m}`);
                  }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="ce-row">
            <div className="ce-field">
              <label className="ce-label"><Tag size={16} /> Category</label>
              <select className="ce-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" disabled>Select Category</option>
                <option>Technology</option>
                <option>Cultural</option>
                <option>Sports</option>
                <option>Workshop</option>
                <option>Seminar</option>
              </select>
            </div>
            <div className="ce-field">
              <label className="ce-label"><MapPin size={16} /> Location *</label>
              <input className="ce-input" placeholder="e.g. Grand Auditorium" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          <div className="ce-field">
            <label className="ce-label"><AlignLeft size={16} /> Description *</label>
            <textarea
              className="ce-textarea"
              placeholder="Unfold the event story here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="ce-actions">
            <button className="ce-btn ce-btn-draft" onClick={handleSaveDraft} disabled={loading}>
              <FileText size={20} />
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
            <button className="ce-btn ce-btn-publish" onClick={handlePublish} disabled={loading}>
              <Send size={20} />
              {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>

          <button className="ce-btn ce-btn-cancel" onClick={handleDiscard}>
            Cancel Creation
          </button>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="ce-popup-overlay">
          <div className="ce-popup">
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '24px', borderRadius: '50%', marginBottom: '12px' }}>
              <CheckCircle size={64} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>{successMessage}</h3>
            <p style={{ color: 'var(--elite-text-muted)', fontWeight: '600' }}>Taking you to your event console...</p>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="ce-popup-overlay" onClick={() => setShowErrorPopup(false)}>
          <div className="ce-popup" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={64} color="#ef4444" />
            <h3 style={{ fontSize: '24px', fontWeight: '900' }}>File Too Large</h3>
            <p style={{ color: 'var(--elite-text-muted)' }}>Cover images must be under 10MB for optimal performance.</p>
            <button className="ce-btn ce-btn-publish" style={{ backgroundColor: '#ef4444' }} onClick={() => setShowErrorPopup(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      {showCancelPopup && (
        <div className="ce-popup-overlay" onClick={() => setShowCancelPopup(false)}>
          <div className="ce-popup" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={64} color="#f59e0b" />
            <h3 style={{ fontSize: '24px', fontWeight: '900' }}>Unsaved Changes</h3>
            <p style={{ color: 'var(--elite-text-muted)' }}>You have progress that hasn't been saved yet.</p>
            <button className="ce-btn ce-btn-publish" onClick={handleSaveDraft}>Save as Draft</button>
            <button className="ce-btn ce-btn-cancel" style={{ width: '100%' }} onClick={handleDiscard}>Discard Changes</button>
            <button className="ce-btn ce-btn-draft" style={{ width: '100%' }} onClick={() => setShowCancelPopup(false)}>Keep Editing</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEvent;
