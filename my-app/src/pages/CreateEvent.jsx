import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Upload, X, CheckCircle, Calendar, Clock, Tag,
  MapPin, AlignLeft, FileText, Trash2, Send, AlertTriangle
} from 'lucide-react';
import './Forms.css';

const CATEGORIES = ['Technology', 'Cultural', 'Sports', 'Workshop', 'Seminar'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function CreateEvent({ onCreate, theme }) {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    const hasChanges = eventName || description || date || time || location || category || eventImage;
    setHasUnsavedChanges(!!hasChanges);
  }, [eventName, description, date, time, location, category, eventImage]);

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

  /* ── Image ── */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setShowErrorPopup(true); e.target.value = null; return; }
    const reader = new FileReader();
    reader.onloadend = () => setEventImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ── API ── */
  const postEvent = async (status, requiredFields = false) => {
    if (requiredFields) {
      if (!eventName) { setError('Event name is required'); return false; }
      if (!description) { setError('Description is required'); return false; }
      if (!date) { setError('Date is required'); return false; }
      if (!time) { setError('Time is required'); return false; }
      if (!location) { setError('Location is required'); return false; }
    }
    setError('');
    setLoading(true);
    try {
      const dateTime = date && time ? new Date(`${date}T${time}`).toISOString() : '';
      const eventData = {
        title: eventName || 'Untitled Draft',
        description: description || '',
        date: dateTime,
        location: location || '',
        category: category || 'Technology',
        image: eventImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        status,
      };
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/events', eventData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      onCreate({
        id: res.data._id,
        title: res.data.title,
        desc: res.data.description,
        date: date && time ? `${date} · ${time}` : 'Date TBD',
        location: res.data.location,
        category,
        image: eventImage || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
        registrations: 0,
        status: status === 'draft' ? 'Draft' : 'Active',
        teacher: res.data.teacher,
      });
      setSuccessMessage(status === 'draft' ? 'Draft Saved!' : 'Event Published!');
      setShowSuccessPopup(true);
      setTimeout(() => navigate('/teacher-events'), 1500);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to ${status === 'draft' ? 'save draft' : 'publish'}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges) setShowCancelPopup(true);
    else navigate(-1);
  };

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''}`}>

      {/* Header */}
      <div className="form-page-header">
        <button className="form-back-btn" onClick={handleBackClick}><ArrowLeft size={18} /></button>
        <h1 className="form-page-title">Create Event</h1>
      </div>

      <div className="form-main">

        {error && <div className="form-msg form-msg-error"><AlertTriangle size={15} />{error}</div>}

        {/* Cover Image */}
        <div className="form-card">
          <div className="form-section-title">Event Cover</div>
          <div className="form-upload-zone" onClick={() => document.getElementById('evtImg').click()}>
            {eventImage ? (
              <>
                <img src={eventImage} className="form-upload-preview" alt="Preview" />
                <button className="form-upload-remove" onClick={e => { e.stopPropagation(); setEventImage(null); }}>
                  <X size={13} />
                </button>
              </>
            ) : (
              <>
                <div className="form-upload-icon"><Upload size={22} /></div>
                <span>Click to upload cover image</span>
                <small>Max 10 MB · JPG, PNG, WEBP</small>
              </>
            )}
            <input id="evtImg" type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </div>
        </div>

        {/* Basic Info */}
        <div className="form-card">
          <div className="form-section-title">Event Details</div>

          <div className="form-field">
            <div className="form-label"><FileText size={13} /> Event Name <span className="form-required">*</span></div>
            <input className="form-input" placeholder="e.g. AI Workshop" value={eventName} onChange={e => setEventName(e.target.value)} />
          </div>

          {/* Date + Time */}
          <div className="form-row">
            <div className="form-field">
              <div className="form-label"><Calendar size={13} /> Date <span className="form-required">*</span></div>
              <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-field">
              <div className="form-label"><Clock size={13} /> Time <span className="form-required">*</span></div>
              <div className="form-time-group">
                <select className="form-select" value={hour12} onChange={e => setHour(e.target.value)}>
                  <option value="">Hr</option>
                  {HOURS.map(h => <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>)}
                </select>
                <span className="form-time-sep">:</span>
                <select className="form-select" value={minutePart} onChange={e => setMinute(e.target.value)}>
                  <option value="">Min</option>
                  {MINUTES.map(m => <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>)}
                </select>
                <select className="form-select" value={isPM ? 'PM' : 'AM'} onChange={e => setPeriod(e.target.value)}>
                  <option>AM</option><option>PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category + Location */}
          <div className="form-row">
            <div className="form-field">
              <div className="form-label"><Tag size={13} /> Category</div>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <div className="form-label"><MapPin size={13} /> Location <span className="form-required">*</span></div>
              <input className="form-input" placeholder="e.g. Auditorium A" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>

          {/* Description */}
          <div className="form-field">
            <div className="form-label"><AlignLeft size={13} /> Description <span className="form-required">*</span></div>
            <textarea className="form-textarea" placeholder="Describe the event, agenda, requirements…" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>

        {/* Actions */}
        <div className="form-card">
          <div className="form-btn-row">
            <button className="form-btn form-btn-draft" onClick={() => postEvent('draft')} disabled={loading}>
              <FileText size={16} /> {loading ? 'Saving…' : 'Save Draft'}
            </button>
            <button className="form-btn form-btn-success" onClick={() => postEvent('published', true)} disabled={loading}>
              <Send size={16} /> {loading ? 'Publishing…' : 'Publish'}
            </button>
          </div>
          <div className="form-cancel-row" style={{ marginTop: 10 }}>
            <button className="form-btn form-btn-danger" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
          </div>
        </div>
      </div>

      {/* ── Success Popup ── */}
      {showSuccessPopup && (
        <div className="form-overlay">
          <div className="form-popup">
            <CheckCircle size={48} className="form-popup-success-icon" />
            <h3>{successMessage}</h3>
            <p>Redirecting to your events…</p>
          </div>
        </div>
      )}

      {/* ── Image Too Large Popup ── */}
      {showErrorPopup && (
        <div className="form-overlay" onClick={() => setShowErrorPopup(false)}>
          <div className="form-popup" onClick={e => e.stopPropagation()}>
            <AlertTriangle size={48} className="form-popup-error-icon" />
            <h3>File Too Large</h3>
            <p>The image must be smaller than 10 MB.</p>
            <button className="form-btn form-btn-primary" style={{ width: 'auto', padding: '10px 28px' }} onClick={() => setShowErrorPopup(false)}>Got it</button>
          </div>
        </div>
      )}

      {/* ── Unsaved Changes Sheet ── */}
      {showCancelPopup && (
        <div className="form-sheet-overlay" onClick={() => setShowCancelPopup(false)}>
          <div className="form-sheet" onClick={e => e.stopPropagation()}>
            <div className="form-sheet-title"><AlertTriangle size={20} color="#f59e0b" /> You have unsaved changes</div>
            <button className="form-sheet-option form-sheet-save" onClick={() => { setShowCancelPopup(false); postEvent('draft'); }}>
              <FileText size={18} /> Save as Draft
            </button>
            <button className="form-sheet-option form-sheet-discard" onClick={() => navigate(-1)}>
              <Trash2 size={18} /> Discard Changes
            </button>
            <button className="form-sheet-option form-sheet-cancel" onClick={() => setShowCancelPopup(false)}>
              <X size={18} /> Keep Editing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEvent;
