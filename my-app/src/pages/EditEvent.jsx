import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Upload, X, CheckCircle, AlertTriangle,
  Calendar, Clock, Tag, Heading,
  MapPin, AlignLeft, Camera, Save, Send, ArrowDownToLine
} from 'lucide-react';
import api, { eventAPI } from '../api';
import './Forms.css'; // Utilizing the shared premium form styles

const CATEGORIES = ['Technology', 'Cultural', 'Sports', 'Workshop', 'Seminar'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function EditEvent({ events, onUpdate, theme }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isDark = theme === 'dark';

  const [eventToEdit, setEventToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Technology");
  const [location, setLocation] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [eventStatus, setEventStatus] = useState("draft");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const initialValues = useRef({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventAPI.getEventById(id);
        setEventToEdit(response.data);
      } catch (error) {
        const foundEvent = events.find((e) => e.id === id || e._id === id);
        setEventToEdit(foundEvent || null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id, events]);

  useEffect(() => {
    if (eventToEdit) {
      setEventName(eventToEdit.title || "");
      setDescription(eventToEdit.description || "");
      setLocation(eventToEdit.location || "");
      setCategory(eventToEdit.category || "Technology");
      setEventImage(eventToEdit.image || null);
      setEventStatus(eventToEdit.status || "draft");

      initialValues.current = {
        title: eventToEdit.title || "",
        description: eventToEdit.description || "",
        location: eventToEdit.location || "",
        category: eventToEdit.category || "Technology",
        image: eventToEdit.image || null,
        date: "",
        time: ""
      };

      if (eventToEdit.date && eventToEdit.date.includes("·")) {
        const parts = eventToEdit.date.split("·");
        setDate(parts[0].trim());
        setTime(parts[1].trim());
        initialValues.current.date = parts[0].trim();
        initialValues.current.time = parts[1].trim();
      } else if (eventToEdit.date) {
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

  /* ── Time helpers ── */
  const hour12 = time ? (parseInt(time.split(':')[0]) % 12 || 12).toString().padStart(2, '0') : '';
  const minutePart = time ? time.split(':')[1] : '';
  const isPM = time ? parseInt(time.split(':')[0]) >= 12 : true;

  const setHour = (h12) => {
    const h = parseInt(h12);
    const m = time ? parseInt(time.split(':')[1]) : 0;
    let h24 = h;
    if (isPM && h !== 12) h24 += 12;
    else if (!isPM && h === 12) h24 = 0;
    setTime(`${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  };
  const setMinute = (m) => {
    const h24 = time ? parseInt(time.split(':')[0]) : 12;
    setTime(`${h24.toString().padStart(2, '0')}:${m}`);
  };
  const setPeriod = (period) => {
    if (!time) { setTime(period === 'AM' ? '00:00' : '12:00'); return; }
    const [h, m] = time.split(':');
    let hour = parseInt(h);
    if (period === 'AM' && hour >= 12) hour -= 12;
    else if (period === 'PM' && hour < 12) hour += 12;
    setTime(`${hour.toString().padStart(2, '0')}:${m}`);
  };

  const showToast = (message, success = true) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleUpdate = async () => {
    if (!eventName || !date || !time) {
      showToast("Please fill in all required fields", false);
      return;
    }

    try {
      const dateTime = new Date(`${date}T${time}`).toISOString();
      const updatedEvent = {
        title: eventName,
        description: description,
        date: dateTime,
        location: location,
        category: category,
        image: eventImage,
      };

      const eventId = eventToEdit._id || eventToEdit.id;
      await eventAPI.update(eventId, updatedEvent);

      setHasUnsavedChanges(false);
      showToast("Event updated successfully!");

      setTimeout(() => {
        if (onUpdate) onUpdate(eventId, updatedEvent);
        navigate('/teacher-events');
      }, 1500);
    } catch (error) {
      showToast("Failed to update event", false);
    }
  };

  const handlePublish = async () => {
    if (!eventName || !date || !time) {
      showToast("Please fill in all required fields before publishing", false);
      return;
    }

    setActionLoading(true);
    try {
      const eventId = eventToEdit._id || eventToEdit.id;
      const dateTime = new Date(`${date}T${time}`).toISOString();

      const updatedEvent = {
        title: eventName,
        description: description,
        date: dateTime,
        location: location,
        category: category,
        image: eventImage,
        status: "published"
      };

      await eventAPI.update(eventId, updatedEvent);
      setEventStatus('published');
      setHasUnsavedChanges(false);
      showToast("Event published successfully!");

      setTimeout(() => navigate('/teacher-events'), 1500);
    } catch (error) {
      showToast("Failed to publish event", false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublish = async () => {
    setActionLoading(true);
    try {
      const eventId = eventToEdit._id || eventToEdit.id;
      await eventAPI.unpublish(eventId);
      setEventStatus('draft');
      showToast("Event unpublished! Now only visible to you.");
      setTimeout(() => navigate('/teacher-events'), 1500);
    } catch (error) {
      showToast("Failed to unpublish event", false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      const eventId = eventToEdit._id || eventToEdit.id;
      await eventAPI.complete(eventId);
      setEventStatus('completed');
      showToast("Event marked as completed!");
      setTimeout(() => navigate('/teacher-events'), 1500);
    } catch (error) {
      showToast("Failed to complete event", false);
    } finally {
      setActionLoading(false);
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

  if (loading) {
    return (
      <div className={`page-wrapper${isDark ? ' dark' : ''}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid rgba(37,99,235,0.1)', borderLeftColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!eventToEdit) return <div className={`page-wrapper${isDark ? ' dark' : ''}`} style={{ padding: '20px', textAlign: 'center' }}><h2>Event not found</h2></div>;

  const isCompleted = eventStatus === 'completed';

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''} form-page`}>
      {/* Header */}
      <div className="form-page-header">
        <button className="form-back-btn" onClick={() => hasUnsavedChanges ? setShowCancelPopup(true) : navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="form-page-title">Edit Event</h1>
        <span style={{
          marginLeft: 'auto',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '0.85rem',
          fontWeight: '800',
          textTransform: 'uppercase',
          backgroundColor: eventStatus === 'published' ? 'rgba(16, 185, 129, 0.1)' : eventStatus === 'completed' ? '#f1f5f9' : 'rgba(245, 158, 11, 0.1)',
          color: eventStatus === 'published' ? '#10b981' : eventStatus === 'completed' ? '#475569' : '#d97706',
          border: `1px solid ${eventStatus === 'published' ? 'rgba(16, 185, 129, 0.2)' : eventStatus === 'completed' ? '#e2e8f0' : 'rgba(245, 158, 11, 0.2)'}`
        }}>
          {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
        </span>
      </div>

      <div className="form-main">
        {/* Cover Image */}
        <div className="form-card">
          <div className="form-section-title"><Camera size={16} /> Event Cover Image</div>
          <div className="form-upload-zone" onClick={() => !isCompleted && document.getElementById('evtImg').click()} style={{ cursor: isCompleted ? 'default' : 'pointer' }}>
            {eventImage ? (
              <>
                <img src={eventImage} className="form-upload-preview" alt="Preview" />
                {!isCompleted && (
                  <button className="form-upload-remove" onClick={e => { e.stopPropagation(); setEventImage(null); }}>
                    <X size={16} />
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="form-upload-icon"><Upload size={24} /></div>
                <span>Click to upload cover image</span>
              </>
            )}
            {!isCompleted && <input id="evtImg" type="file" accept="image/*" onChange={handleImageUpload} hidden />}
          </div>
        </div>

        {/* Basic Info */}
        <div className="form-card">
          <div className="form-section-title"><Heading size={16} /> Event Details</div>

          <div className="form-field">
            <div className="form-label">Event Name <span className="form-required">*</span></div>
            <input
              className="form-input"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              disabled={isCompleted}
            />
          </div>

          {/* Date + Time */}
          <div className="form-row">
            <div className="form-field">
              <div className="form-label"><Calendar size={13} /> Date <span className="form-required">*</span></div>
              <input
                className="form-input"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                disabled={isCompleted}
              />
            </div>
            <div className="form-field">
              <div className="form-label"><Clock size={13} /> Time <span className="form-required">*</span></div>
              <div className="form-time-group">
                <select className="form-select" value={hour12} onChange={e => setHour(e.target.value)} disabled={isCompleted}>
                  <option value="">Hr</option>
                  {HOURS.map(h => <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>)}
                </select>
                <span className="form-time-sep">:</span>
                <select className="form-select" value={minutePart} onChange={e => setMinute(e.target.value)} disabled={isCompleted}>
                  <option value="">Min</option>
                  {MINUTES.map(m => <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>)}
                </select>
                <select className="form-select" value={isPM ? 'PM' : 'AM'} onChange={e => setPeriod(e.target.value)} disabled={isCompleted}>
                  <option>AM</option><option>PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category + Location */}
          <div className="form-row">
            <div className="form-field">
              <div className="form-label"><Tag size={13} /> Category</div>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} disabled={isCompleted}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <div className="form-label"><MapPin size={13} /> Location <span className="form-required">*</span></div>
              <input
                className="form-input"
                value={location}
                onChange={e => setLocation(e.target.value)}
                disabled={isCompleted}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-field">
            <div className="form-label"><AlignLeft size={13} /> Description <span className="form-required">*</span></div>
            <textarea
              className="form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={isCompleted}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="form-card">
          <div className="form-btn-row">
            {!isCompleted && (
              <button className="form-btn form-btn-primary" onClick={handleUpdate} disabled={actionLoading}>
                <Save size={16} /> Save Changes
              </button>
            )}

            {eventStatus === 'draft' && (
              <button className="form-btn form-btn-success" onClick={handlePublish} disabled={actionLoading}>
                <Send size={16} /> Publish
              </button>
            )}

            {eventStatus === 'published' && (
              <button className="form-btn form-btn-draft" onClick={handleUnpublish} disabled={actionLoading}>
                <ArrowDownToLine size={16} /> Unpublish
              </button>
            )}

            {!isCompleted && (
              <button className="form-btn" style={{ background: '#1E3A8A', color: '#fff', boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)' }} onClick={handleComplete} disabled={actionLoading}>
                <CheckCircle size={16} /> Complete
              </button>
            )}
          </div>
          <div className="form-cancel-row">
            <button className="form-btn form-btn-danger" onClick={() => navigate(-1)} disabled={actionLoading}>Cancel</button>
          </div>
        </div>
      </div>

      {/* ── Success/Error Popup ── */}
      {showPopup && (
        <div className="form-overlay">
          <div className="form-popup">
            {popupMessage.includes("success") || popupMessage.includes("successfully") || popupMessage.includes("unpublished") ? (
              <CheckCircle size={56} className="form-popup-success-icon" />
            ) : (
              <X size={56} className="form-popup-error-icon" />
            )}
            <h3>{popupMessage.includes("success") || popupMessage.includes("successfully") || popupMessage.includes("unpublished") ? "Success!" : "Error"}</h3>
            <p>{popupMessage}</p>
          </div>
        </div>
      )}

      {/* ── Unsaved Changes Sheet ── */}
      {showCancelPopup && (
        <div className="form-sheet-overlay" onClick={() => setShowCancelPopup(false)}>
          <div className="form-sheet" onClick={e => e.stopPropagation()}>
            <div className="form-sheet-title"><AlertTriangle size={20} color="#f59e0b" /> You have unsaved changes</div>
            <button className="form-sheet-option form-sheet-save" onClick={() => { setShowCancelPopup(false); handleUpdate(); }}>
              <Save size={18} /> Save Changes
            </button>
            <button className="form-sheet-option form-sheet-discard" onClick={() => navigate(-1)}>
              <X size={18} /> Discard Changes
            </button>
            <button className="form-sheet-option form-sheet-cancel" onClick={() => setShowCancelPopup(false)}>
              Keep Editing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditEvent;
