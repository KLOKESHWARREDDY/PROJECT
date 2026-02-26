import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Filter, ArrowRight, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../api';
import './Events.css';

const Events = ({ allEvents, theme, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [events, setEvents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.getAll();
        setEvents(response.data);
      } catch (error) {
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = ['All', 'Technology', 'Cultural', 'Sports', 'Workshop', 'Seminar'];

  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    const matchesSearch = !searchTerm || event.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`page-wrapper ${isDark ? 'dark' : ''} events-page`}>
      <div className="events-header">
        <h1 className="events-title">Explore Events</h1>
        <p className="events-subtitle">Discover workshops, competitions, and seminars.</p>
      </div>

      <div className="events-controls">
        <div className="events-search-box">
          <Search size={20} className="events-search-icon" />
          <input
            className="events-search-input"
            placeholder="Search events by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className={`events-filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X size={isMobile ? 18 : 18} /> : <Filter size={isMobile ? 18 : 18} />}
          {showFilters ? 'Close' : 'Filters'}
        </button>
      </div>

      <div className={`events-filter-panel ${showFilters ? 'show' : ''}`}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`events-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {activeCategory === cat && <Check size={14} />}
            {cat}
          </button>
        ))}
      </div>

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div
              key={event._id}
              className="event-card-item"
              onClick={() => navigate(`/events/${event.id || event._id}`)}
            >
              <div className="event-img-wrap">
                <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} alt={event.title} className="event-img" />
                <div className="event-img-overlay" />
                {event.category && <span className="event-category-tag">{event.category}</span>}
              </div>
              <div className="event-card-body">
                <h3 className="event-card-title">{event.title}</h3>

                <div className="event-meta-info">
                  <div className="event-meta-item">
                    <Calendar size={16} /> {event.date}
                  </div>
                  <div className="event-meta-item">
                    <MapPin size={16} /> {event.location || 'TBA'}
                  </div>
                </div>

                <div className="event-card-footer">
                  <span>View Details</span> <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="events-no-results">
            <Search size={48} strokeWidth={1.5} className="no-result-icon" />
            <h3>No events found</h3>
            <p>Try adjusting your search query or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;