import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Edit3, Trash2, Users, AlertTriangle, MapPin, Tag } from 'lucide-react';
import { eventAPI } from '../api';
import './TeacherEventDetails.css';

const TeacherEventDetails = ({ events, onDelete, theme }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isDark = theme === 'dark';
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventAPI.getEventById(id);
        setEvent(response.data);
      } catch (error) {
        const foundEvent = events.find((e) => e.id === id || e._id === id);
        setEvent(foundEvent || null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, events]);

  const handleDelete = async () => {
    const eventId = event._id || event.id;
    try {
      await onDelete(eventId, () => navigate('/teacher-events'));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    if (dateStr.includes('·')) return dateStr.split('·')[0];
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('·')) return dateStr.split('·')[1];
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className={`page-wrapper ted-page ${isDark ? 'dark' : ''}`}>
        <div className="ted-loading"><div className="ted-spinner"></div></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={`page-wrapper ted-page ${isDark ? 'dark' : ''}`}>
        <div className="ted-empty">
          <h2>Event not found</h2>
          <button className="ted-back-home-btn" onClick={() => navigate('/teacher-events')}>Back to Events</button>
        </div>
      </div>
    );
  }

  const eventStatus = event.status || 'draft';

  return (
    <div className={`page-wrapper ted-page ${isDark ? 'dark' : ''}`}>
      <div className="ted-nav-header">
        <button className="ted-icon-btn" onClick={() => navigate('/teacher-events')} title="Go Back">
          <ArrowLeft size={24} />
        </button>
        <h1 className="ted-page-title">Manage Event</h1>
      </div>

      <div className="ted-card">
        <div className="ted-image-wrap">
          <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} alt={event.title} className="ted-image" />
          <div className="ted-image-overlay" />
        </div>

        <div className="ted-content">
          <div className="ted-title-row">
            <h1 className="ted-title">{event.title}</h1>
            <span className={`ted-status-badge ${eventStatus}`}>
              {eventStatus === 'published' ? 'Published' : eventStatus === 'draft' ? 'Draft' : 'Completed'}
            </span>
          </div>

          <div className="ted-meta-grid">
            <div className="ted-meta-item">
              <div className="ted-meta-icon"><Calendar size={20} /></div>
              <div className="ted-meta-text">
                <span className="ted-meta-label">Date</span>
                <span className="ted-meta-value">{formatDate(event.date)}</span>
              </div>
            </div>
            {formatTime(event.date) && (
              <div className="ted-meta-item">
                <div className="ted-meta-icon"><Clock size={20} /></div>
                <div className="ted-meta-text">
                  <span className="ted-meta-label">Time</span>
                  <span className="ted-meta-value">{formatTime(event.date)}</span>
                </div>
              </div>
            )}
            <div className="ted-meta-item">
              <div className="ted-meta-icon"><Tag size={20} /></div>
              <div className="ted-meta-text">
                <span className="ted-meta-label">Category</span>
                <span className="ted-meta-value">{event.category || 'General'}</span>
              </div>
            </div>
            <div className="ted-meta-item">
              <div className="ted-meta-icon"><MapPin size={20} /></div>
              <div className="ted-meta-text">
                <span className="ted-meta-label">Location</span>
                <span className="ted-meta-value">{event.location || 'TBD'}</span>
              </div>
            </div>
          </div>

          <div className="ted-desc-section">
            <h3 className="ted-desc-title">Description</h3>
            <p className="ted-desc-text">{event.description || "No description provided."}</p>
          </div>

          <div className="ted-btn-grid">
            {/* Edit Button - Show for Draft and Published */}
            {(eventStatus === 'draft' || eventStatus === 'published') && (
              <button
                className="ted-btn primary"
                onClick={() => navigate(`/edit-event/${event._id || event.id}`)}
              >
                <Edit3 size={18} /> Edit Event
              </button>
            )}

            {/* View Registrations - Show for Published and Completed */}
            {(eventStatus === 'published' || eventStatus === 'completed') && (
              <button
                className="ted-btn secondary"
                onClick={() => navigate(`/event-registrations/${event._id || event.id}`)}
              >
                <Users size={18} /> View Registrations
              </button>
            )}

            {/* Delete Button - Always show */}
            <button
              className="ted-btn danger full-width"
              onClick={() => setShowDeletePopup(true)}
            >
              <Trash2 size={18} /> Delete Event
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="ted-popup-overlay" onClick={() => setShowDeletePopup(false)}>
          <div className="ted-popup" onClick={(e) => e.stopPropagation()}>
            <div className="ted-popup-icon"><AlertTriangle size={32} /></div>
            <h3>Delete Event?</h3>
            <p>Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="ted-popup-actions">
              <button className="ted-popup-cancel" onClick={() => setShowDeletePopup(false)}>Cancel</button>
              <button className="ted-popup-delete" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherEventDetails;
