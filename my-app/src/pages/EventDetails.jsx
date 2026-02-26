import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Share2, ArrowLeft, CheckCircle } from 'lucide-react';
import { eventAPI } from '../api';
import { toast } from 'react-toastify';
import './EventDetails.css';

const EventDetails = ({ allEvents, registrations, theme, onRegister, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const eventIdFromUrl = id;

  const registration = registrations?.find(reg => {
    const regEventId = reg.event?._id || reg.event;
    return regEventId === eventIdFromUrl || regEventId === String(eventIdFromUrl);
  });
  const isRegistered = !!registration;
  const registeredStatus = registration?.status;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventAPI.getEventById(eventIdFromUrl);
        setEvent(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventIdFromUrl]);

  if (loading) {
    return (
      <div className={`page-wrapper ed-page ${isDark ? 'dark' : ''}`}>
        <div className="ed-loading">
          <div className="ed-spinner"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={`page-wrapper ed-page ${isDark ? 'dark' : ''}`}>
        <div className="ed-empty">
          <h2>Event not found</h2>
          <button className="ed-back-btn" onClick={() => navigate('/events')}>Back to Events</button>
        </div>
      </div>
    );
  }

  const handleButtonClick = async () => {
    if (isRegistered) {
      if (registeredStatus === 'approved') {
        navigate(`/ticket-confirmation/${registration._id}`);
      } else {
        navigate('/my-events');
      }
    } else {
      setRegistering(true);
      await onRegister(eventIdFromUrl, () => {
        setRegistering(false);
        navigate('/my-events');
      });
    }
  };

  return (
    <div className={`page-wrapper ed-page ${isDark ? 'dark' : ''}`}>

      {/* Navigation Header */}
      <div className="ed-nav-header">
        <button className="ed-icon-btn" onClick={() => navigate(-1)} title="Go Back">
          <ArrowLeft size={24} />
        </button>
        <button className="ed-icon-btn" title="Share Event">
          <Share2 size={24} />
        </button>
      </div>

      <div className="ed-container">
        {/* Left Column: Image */}
        <div className="ed-image-wrap">
          <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} alt={event.title} className="ed-image" />
          <div className="ed-image-overlay" />
        </div>

        {/* Right Column: Info */}
        <div className="ed-info-col">
          <div className="ed-info-header">
            <span className="ed-category-badge">{event.category || 'Event'}</span>
            <h1 className="ed-title">{event.title}</h1>
          </div>

          <div className="ed-meta-card">
            <div className="ed-meta-row">
              <div className="ed-icon-box"><Calendar size={24} /></div>
              <div>
                <span className="ed-meta-label">Date & Time</span>
                <span className="ed-meta-value">{event.date}</span>
              </div>
            </div>

            <div className="ed-meta-divider" />

            <div className="ed-meta-row">
              <div className="ed-icon-box"><MapPin size={24} /></div>
              <div>
                <span className="ed-meta-label">Location</span>
                <span className="ed-meta-value">{event.location || 'TBA'}</span>
              </div>
            </div>
          </div>

          <div className="ed-about-section">
            <h3 className="ed-about-title">About Event</h3>
            <p className="ed-about-text">
              {event.description ||
                "Join us for an immersive experience learning about the latest in technology. This workshop is suitable for all levels. Certificate provided upon completion."}
            </p>
          </div>

          {/* DYNAMIC REGISTER BUTTON */}
          <button
            className={`ed-register-btn ${isRegistered ? 'registered' : ''}`}
            onClick={handleButtonClick}
            disabled={registering}
          >
            {registering ? (
              <span className="ed-register-content">
                <span className="ed-btn-spinner"></span> Registering...
              </span>
            ) : isRegistered ? (
              <span className="ed-register-content">
                <CheckCircle size={22} />
                {registeredStatus === 'approved' ? 'View Ticket' : 'Registration Pending'}
              </span>
            ) : (
              <span className="ed-register-content">Register Now</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
