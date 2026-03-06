import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, ArrowRight, X, Check, TrendingUp, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../api';
import styles from './Events.module.css';

const Events = ({ theme, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.getAll();
        setEvents(response.data);
      } catch (error) {
        console.log('Error fetching events:', error.message);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  const categories = ['All', 'Technology', 'Cultural', 'Sports', 'Workshop', 'Seminar'];

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  };

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  const getDaysLeft = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  };

  const getStatus = (event) => {
    const isUpcoming = new Date(event.date) >= new Date();
    return isUpcoming
      ? { label: 'Upcoming', cls: styles.upcoming }
      : { label: 'Published', cls: styles.published };
  };

  const resolveAvatar = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    const matchesSearch =
      event.title?.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      event.location?.toLowerCase().includes((searchTerm || '').toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.eventsRoot}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <TrendingUp size={13} />
          <span>Discover events on campus</span>
        </div>
        <h1 className={styles.title}>Campus Events</h1>
        <p className={styles.subtitle}>
          Explore workshops, competitions, and seminars happening across your campus.
        </p>
      </section>

      {/* ── Search & Filters ── */}
      <div className={styles.commandCenter}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <Search size={18} color="#A0AEC0" />
            <input
              placeholder="Search by title or location…"
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <X size={16} /> : <Filter size={16} />}
            <span>Filter</span>
          </button>
        </div>

        {showFilters && (
          <div className={styles.filterPanel}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.chip} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {activeCategory === cat && <Check size={12} style={{ marginRight: '5px' }} />}
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Event Grid ── */}
      <div className={styles.eventGrid}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => {
            const status = getStatus(event);
            const daysLeft = getDaysLeft(event.date);
            const teacherName = event.teacher?.name || 'Faculty Member';
            const teacherAvatar = resolveAvatar(event.teacher?.profileImage);

            return (
              <div
                key={event._id}
                className={styles.eventCard}
                onClick={() => navigate(`/events/${event.id || event._id}`)}
              >
                {/* ── Cover Image ── */}
                <div className={styles.imageWrapper}>
                  <img
                    src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                    alt={event.title}
                    className={styles.eventImage}
                  />
                  {/* Status badge top-left */}
                  <span className={`${styles.statusBadge} ${status.cls}`}>
                    <span className={styles.statusDot} />
                    {status.label}
                  </span>
                  {/* Category tag top-right */}
                  {event.category && (
                    <span className={styles.categoryTag}>{event.category}</span>
                  )}
                  {/* Days left bottom-right */}
                  {daysLeft !== null && daysLeft <= 30 && (
                    <span className={styles.daysLeftBadge}>{daysLeft}d left</span>
                  )}
                </div>

                {/* ── Card Body ── */}
                <div className={styles.cardBody}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>

                  {/* Meta pills */}
                  <div className={styles.metaRow}>
                    <span className={styles.metaPill}>
                      <Calendar size={12} />
                      {formatDate(event.date)}
                    </span>
                    <span className={styles.metaPill}>
                      <Clock size={12} />
                      {formatTime(event.date)}
                    </span>
                    <span className={styles.metaPill}>
                      <MapPin size={12} />
                      {event.location || 'TBA'}
                    </span>
                  </div>

                  <div className={styles.cardDivider} />

                  {/* Organizer */}
                  <div className={styles.organizerRow}>
                    <img
                      src={teacherAvatar}
                      alt={teacherName}
                      className={styles.organizerAvatar}
                      onError={(e) => {
                        e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                      }}
                    />
                    <div className={styles.organizerInfo}>
                      <span className={styles.organizerRole}>Organizer</span>
                      <span className={styles.organizerName}>{teacherName}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={styles.registerBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event.id || event._id}`);
                    }}
                  >
                    Register Now <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <article className={styles.noResults}>
            <Search size={44} color="#CBD5E0" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#1A202C' }}>
              No events found
            </h3>
            <p style={{ color: '#718096', maxWidth: '340px', margin: '0 auto', fontSize: '15px' }}>
              Try adjusting your filters or search terms.
            </p>
          </article>
        )}
      </div>
    </div>
  );
};

export default Events;
