import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, ChevronRight, Filter, Plus, Search, X, Users } from 'lucide-react';
import { eventAPI } from '../api';
import './TeacherMyEvents.css';

const TeacherMyEvents = ({ theme }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [teacherEvents, setTeacherEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // RESPONSIVE CHECK
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ FETCH TEACHER'S OWN EVENTS
  useEffect(() => {
    const fetchTeacherEvents = async () => {
      try {
        const response = await eventAPI.getTeacherEvents();
        setTeacherEvents(response.data);
      } catch (error) {
        console.error('Error fetching teacher events:', error.message);
        setTeacherEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherEvents();
  }, []);

  const filteredEvents = teacherEvents.filter((event) => {
    const matchesFilter = activeFilter === "All" || (
      activeFilter === "published"
        ? (event.status?.toLowerCase() === "published" || event.status?.toLowerCase() === "active")
        : event.status?.toLowerCase() === activeFilter.toLowerCase()
    );

    const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    if (dateStr.includes('·')) return dateStr.split('·')[0];
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ width: 40, height: 40, border: '4px solid var(--border-color)', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="tme-page-wrapper">
      <div className="tme-bg-glow" />
      <div className="tme-bg-glow-alt" />

      <div className="tme-container">
        <header className="tme-header">
          <div className="tme-header-left">
            <button className="tme-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={24} />
            </button>
            <div className="tme-title-group">
              <span className="tme-subtitle">Management Console</span>
              <h1 className="tme-title">My Created Events</h1>
            </div>
          </div>
          {!isMobile && (
            <button
              className="tme-create-btn"
              onClick={() => navigate('/create-event')}
            >
              <Plus size={18} />
              <span>Create Event</span>
            </button>
          )}
        </header>

        <div className="tme-controls">
          {showSearch ? (
            <div className="tme-search-wrapper tme-animate" style={{ flex: 1 }}>
              <Search size={18} className="tme-search-icon" />
              <input
                type="text"
                placeholder="Search events by title or location..."
                className="tme-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button className="tme-search-close" onClick={() => { setShowSearch(false); setSearchQuery(""); }}>
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="tme-filters">
              {['All', 'draft', 'published', 'completed'].map((filter) => (
                <button
                  key={filter}
                  className={`tme-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          )}

          <button
            className={`tme-back-btn ${showSearch ? 'active' : ''}`}
            style={{ width: 'auto', padding: '0 16px' }}
            onClick={() => setShowSearch(!showSearch)}
            title="Search events"
          >
            <Search size={18} />
          </button>
        </div>

        <div className="tme-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div
                key={event._id || event.id}
                className="tme-card tme-animate"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/teacher-event-details/${event.id || event._id}`)}
              >
                <div className="tme-card-image-box">
                  <img src={event.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80'} alt={event.title} className="tme-card-img" />
                  <div className={`tme-status-indicator tme-status-${event.status?.toLowerCase() || 'draft'}`}>
                    {event.status || 'Draft'}
                  </div>
                </div>

                <div className="tme-card-content">
                  <h3 className="tme-card-title">{event.title}</h3>
                  <div className="tme-card-meta">
                    <span className="tme-meta-item">
                      <Calendar size={14} color="var(--elite-accent)" />
                      {formatDate(event.date)}
                    </span>
                    <span className="tme-meta-item">
                      <Clock size={14} color="var(--elite-accent)" />
                      {formatTime(event.date) || 'TBD'}
                    </span>
                    <span className="tme-meta-item">
                      <MapPin size={14} color="var(--elite-accent)" />
                      {event.location || 'Remote'}
                    </span>
                  </div>
                </div>

                <div className="tme-card-footer" style={{ padding: '0 12px 12px 12px', borderTop: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--elite-glass-bg)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--elite-glass-border)' }}>
                    <Users size={14} color="var(--elite-accent)" />
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--elite-text-main)' }}>
                      {event.registrations || 0}
                    </span>
                  </div>
                  <button className="tme-view-btn">
                    Manage <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', background: 'var(--elite-glass-bg)', borderRadius: '32px', border: '1px solid var(--elite-glass-border)' }}>
              <div style={{ display: 'inline-flex', padding: '20px', background: 'var(--elite-glass-bg)', borderRadius: '50%', marginBottom: '24px' }}>
                <Calendar size={48} color="var(--elite-text-muted)" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>No Events Found</h3>
              <p style={{ color: 'var(--elite-text-muted)' }}>Try adjusting your filters or create a new event.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherMyEvents;
