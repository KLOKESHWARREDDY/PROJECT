import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Share2, ArrowLeft, CheckCircle,
  Clock, Tag, User, ArrowRight
} from 'lucide-react';
import { eventAPI } from '../api';
import { toast } from 'react-toastify';
import styles from './EventDetails.module.css';

const EventDetails = ({ allEvents, registrations, theme, onRegister }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const eventIdFromUrl = id;

  // Check registration status
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
      } catch (error) {
        console.log('Error fetching event:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventIdFromUrl]);

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
      setRegistering(false);
    }
  };

  // Helpers
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch { return '—'; }
  };

  const getDaysLeft = (dateStr) => {
    const now = new Date();
    const eventDate = new Date(dateStr);
    const diff = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const resolveAvatar = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p style={{ color: '#A0AEC0', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>Loading event…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.loadingWrap}>
        <p style={{ color: '#A0AEC0', fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: '700' }}>Event not found</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const now = new Date();
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= now;
  const daysLeft = getDaysLeft(event.date);
  const teacherName = event.teacher?.name || 'Faculty Member';
  const teacherEmail = event.teacher?.email || '';
  const teacherAvatar = resolveAvatar(event.teacher?.profileImage);

  // Button states
  const btnClass = isRegistered
    ? (registeredStatus === 'approved' ? styles.isRegistered : styles.isPending)
    : styles.notRegistered;
  const btnLabel = registering ? 'Registering…'
    : isRegistered
      ? (registeredStatus === 'approved' ? '🎟️ View My Ticket' : '⏳ Pending Approval')
      : 'Register Now';

  return (
    <div className={styles.root}>

      {/* Top Nav */}
      <div className={styles.topNav}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to Events
        </button>
        <button className={styles.shareBtn} onClick={() => {
          navigator.clipboard?.writeText(window.location.href);
          toast.success('Link copied!');
        }}>
          <Share2 size={18} />
        </button>
      </div>

      {/* Hero Image */}
      <div className={styles.heroWrap}>
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
          alt={event.title}
          className={styles.heroImage}
        />
        <div className={styles.heroBadgeRow}>
          <span className={`${styles.statusPill} ${isUpcoming ? styles.upcoming : styles.published}`}>
            <span className={styles.statusDot} />
            {isUpcoming ? 'Upcoming' : 'Published'}
          </span>
          {event.category && (
            <span className={styles.categoryPill}>{event.category}</span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.contentWrap}>

        {/* ── Left Column ── */}
        <div className={styles.leftCol}>
          <div>
            <h1 className={styles.eventTitle}>{event.title}</h1>
          </div>

          {/* Meta Cards Grid */}
          <div className={styles.metaGrid}>
            <div className={styles.metaCard}>
              <div className={styles.metaIconBox} style={{ background: '#EEF2FF', color: '#4318FF' }}>
                <Calendar size={22} />
              </div>
              <div>
                <span className={styles.metaLabel}>Date</span>
                <span className={styles.metaValue}>{formatDate(event.date)}</span>
              </div>
            </div>

            <div className={styles.metaCard}>
              <div className={styles.metaIconBox} style={{ background: '#F0FDF4', color: '#16A34A' }}>
                <Clock size={22} />
              </div>
              <div>
                <span className={styles.metaLabel}>Time</span>
                <span className={styles.metaValue}>{formatTime(event.date)}</span>
              </div>
            </div>

            <div className={styles.metaCard}>
              <div className={styles.metaIconBox} style={{ background: '#FFF7ED', color: '#EA580C' }}>
                <MapPin size={22} />
              </div>
              <div>
                <span className={styles.metaLabel}>Location</span>
                <span className={styles.metaValue}>{event.location || 'TBA'}</span>
              </div>
            </div>

            <div className={styles.metaCard}>
              <div className={styles.metaIconBox} style={{ background: '#FFF1F2', color: '#E11D48' }}>
                <Tag size={22} />
              </div>
              <div>
                <span className={styles.metaLabel}>Category</span>
                <span className={styles.metaValue}>{event.category || 'General'}</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>About This Event</h2>
            <p className={styles.descText}>
              {event.description || 'Join us for an immersive experience. This event is open to all participants. Certificate will be provided upon completion.'}
            </p>
          </div>

          {/* Organizer */}
          <div className={styles.organizerStrip}>
            <img
              src={teacherAvatar}
              alt={teacherName}
              className={styles.organizerAvatar}
              onError={(e) => { e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; }}
            />
            <div>
              <div className={styles.organizerLabel}>Organized by</div>
              <div className={styles.organizerName}>{teacherName}</div>
              {teacherEmail && <div className={styles.organizerEmail}>{teacherEmail}</div>}
            </div>
          </div>
        </div>

        {/* ── Right Sticky Column ── */}
        <div className={styles.rightCol}>
          <div className={styles.registerCard}>
            <h3 className={styles.registerCardTitle}>
              {isRegistered ? 'You\'re Registered!' : 'Join This Event'}
            </h3>
            <p className={styles.registerCardSub}>
              {isRegistered
                ? registeredStatus === 'approved'
                  ? 'Your spot is confirmed. View your ticket below.'
                  : 'Your registration is under review by the organizer.'
                : isUpcoming && daysLeft > 0
                  ? `Happening in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Secure your spot now!`
                  : 'Register to attend this event and receive updates.'
              }
            </p>

            {/* Quick info rows */}
            <div className={styles.quickInfo}>
              <div className={styles.quickInfoRow}>
                <div className={styles.quickInfoIcon} style={{ background: '#EEF2FF' }}>
                  <Calendar size={16} color="#4318FF" />
                </div>
                <span>{formatDate(event.date)}</span>
              </div>
              <div className={styles.quickInfoRow}>
                <div className={styles.quickInfoIcon} style={{ background: '#F0FDF4' }}>
                  <MapPin size={16} color="#16A34A" />
                </div>
                <span>{event.location || 'TBA'}</span>
              </div>
              <div className={styles.quickInfoRow}>
                <div className={styles.quickInfoIcon} style={{ background: '#FFF7ED' }}>
                  <User size={16} color="#EA580C" />
                </div>
                <span>{teacherName}</span>
              </div>
            </div>

            <div className={styles.registerDivider} />

            <button
              className={`${styles.registerBtn} ${btnClass}`}
              onClick={handleButtonClick}
              disabled={registering || (isRegistered && registeredStatus === 'pending')}
            >
              {isRegistered ? <CheckCircle size={20} /> : <ArrowRight size={20} />}
              {btnLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
