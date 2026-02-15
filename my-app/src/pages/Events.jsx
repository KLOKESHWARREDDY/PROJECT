import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Filter, ArrowRight, X, Check } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../api';

const Events = ({ allEvents, theme, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // Local state for events
  const [events, setEvents] = useState([]);

  // 1. FILTER STATE
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Events page token:", token);
        
        const response = await eventAPI.getAll();
        console.log("Events page response:", response.data);
        
        setEvents(response.data);
      } catch (error) {
        console.log('Error fetching events:', error.message);
        setEvents([]);
      }
    };
    
    fetchEvents();
  }, []);

  // Categories
  const categories = ['All', 'Tech', 'Cultural', 'Sports', 'Workshop', 'Seminar'];

  // 2. FILTER LOGIC
  const filteredEvents = events.filter(event => {
    if (activeCategory === 'All') return true;
    return event.category === activeCategory;
  });

  // 3. RESPONSIVE CHECK
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    // 1. CONTAINER: Responsive Width
    container: { 
      padding: isMobile ? '4vw' : '2vw', 
      fontFamily: "'Inter', sans-serif", 
      maxWidth: isMobile ? '100vw' : '95vw',
      width: isMobile ? '100%' : 'auto',
      margin: '0 auto',
      minHeight: '100vh',
      color: isDark ? '#fff' : '#1e293b'
    },
    header: { marginBottom: '4vh' },
    title: { 
      fontSize: isMobile ? '6vw' : '2.5vw', 
      fontWeight: '800', 
      marginBottom: '1vh' 
    },
    subtitle: { 
      color: '#64748b', 
      fontSize: isMobile ? '3.5vw' : '1.2vw' 
    },

    // Controls Section
    controls: { 
      display: 'flex', 
      gap: isMobile ? '2vw' : '1.5vw', 
      marginBottom: '3vh', 
      flexWrap: 'wrap' 
    },
    
    // Search Box: Responsive Size
    searchBox: {
      flex: 1, 
      minWidth: isMobile ? '60vw' : '25vw', 
      display: 'flex', 
      alignItems: 'center',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      borderRadius: isMobile ? '2vw' : '1vw', 
      padding: isMobile ? '1.5vh 3vw' : '1vh 1.5vw',
      boxShadow: '0 0.5vh 1vh rgba(0,0,0,0.02)'
    },
    input: {
      border: 'none', 
      outline: 'none', 
      width: '100%', 
      fontSize: isMobile ? '3.5vw' : '1.1vw', 
      marginLeft: '2vw',
      backgroundColor: 'transparent', 
      color: isDark ? '#fff' : '#1e293b'
    },
    
    // Filter Button
    filterBtn: {
      display: 'flex', 
      alignItems: 'center', 
      gap: '1vw', 
      padding: isMobile ? '0 4vw' : '0 2vw',
      borderRadius: isMobile ? '2vw' : '1vw',
      backgroundColor: showFilters ? '#3b82f6' : (isDark ? '#334155' : '#fff'),
      border: showFilters ? '1px solid #3b82f6' : (isDark ? '1px solid #475569' : '1px solid #e2e8f0'),
      color: showFilters ? '#fff' : (isDark ? '#fff' : '#475569'),
      cursor: 'pointer', 
      fontWeight: '600', 
      fontSize: isMobile ? '3.5vw' : '1vw',
      transition: 'all 0.2s',
      height: 'auto',
      minHeight: '40px'
    },

    // Filter Chips Area
    filterPanel: {
      display: showFilters ? 'flex' : 'none',
      gap: isMobile ? '2vw' : '1vw',
      flexWrap: 'wrap',
      marginBottom: '4vh',
      padding: isMobile ? '3vw' : '1.5vw',
      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
      borderRadius: isMobile ? '3vw' : '1vw',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      animation: 'fadeIn 0.2s ease-in-out'
    },
    chip: (isActive) => ({
      padding: isMobile ? '1vh 4vw' : '0.8vh 1.5vw',
      borderRadius: '50px',
      fontSize: isMobile ? '3vw' : '1vw',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      display: 'flex', 
      alignItems: 'center', 
      gap: '1vw',
      backgroundColor: isActive ? '#3b82f6' : (isDark ? '#334155' : '#fff'),
      color: isActive ? '#fff' : (isDark ? '#94a3b8' : '#64748b'),
      boxShadow: isActive ? '0 0.5vh 1.5vh rgba(59, 130, 246, 0.3)' : '0 0.2vh 0.5vh rgba(0,0,0,0.02)'
    }),

    // Grid System
    grid: {
      display: 'grid',
      // Mobile: 1 Column | Desktop: Responsive Columns
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(22vw, 1fr))',
      gap: isMobile ? '4vh' : '2vw'
    },
    card: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: isMobile ? '4vw' : '1.5vw', 
      overflow: 'hidden',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%'
    },
    // Image Height in VH
    cardImage: { 
      width: '100%', 
      height: isMobile ? '25vh' : '20vh', 
      objectFit: 'cover' 
    },
    cardBody: { 
      padding: isMobile ? '4vw' : '1.5vw', 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column' 
    },
    categoryTag: {
      display: 'inline-block', 
      fontSize: isMobile ? '3vw' : '0.9vw', 
      fontWeight: '600',
      color: '#3b82f6', 
      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
      padding: isMobile ? '0.5vh 2vw' : '0.4vh 0.8vw', 
      borderRadius: '0.8vw', 
      marginBottom: '1.5vh', 
      width: 'fit-content'
    },
    cardTitle: { 
      fontSize: isMobile ? '4.5vw' : '1.4vw', 
      fontWeight: 'bold', 
      marginBottom: '1.5vh', 
      lineHeight: '1.3',
      color: isDark ? '#fff' : '#1e293b'
    },
    meta: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1.5vw', 
      fontSize: isMobile ? '3.5vw' : '1vw', 
      color: '#64748b', 
      marginBottom: '1vh' 
    },
    footer: { 
      marginTop: 'auto', 
      paddingTop: '2vh', 
      borderTop: isDark ? '1px solid #334155' : '1px solid #f1f5f9', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      color: '#3b82f6', 
      fontWeight: '600', 
      fontSize: isMobile ? '3.5vw' : '1vw' 
    },
    
    // Empty State
    noResults: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '5vh',
      color: '#94a3b8',
      fontSize: isMobile ? '4vw' : '1.2vw'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Explore Events</h1>
        <p style={styles.subtitle}>Discover workshops, competitions, and seminars.</p>
      </div>

      {/* Search & Filter Button */}
      <div style={styles.controls}>
        <div style={styles.searchBox}>
          <Search size={isMobile ? 20 : 20} color="#94a3b8" />
          <input 
            style={styles.input} 
            placeholder="Search events..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <button 
          style={styles.filterBtn} 
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X size={isMobile ? 20 : 18} /> : <Filter size={isMobile ? 20 : 18} />} 
          {showFilters ? 'Close' : 'Filters'}
        </button>
      </div>

      {/* Filter Selection Panel */}
      <div style={styles.filterPanel}>
        {categories.map(cat => (
          <button 
            key={cat} 
            style={styles.chip(activeCategory === cat)}
            onClick={() => setActiveCategory(cat)}
          >
            {activeCategory === cat && <Check size={14} />}
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div style={styles.grid}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div 
              key={event._id} 
              style={styles.card} 
              onClick={() => {
                console.log("Clicked Event ID:", event.id || event._id);
                navigate(`/events/${event.id || event._id}`);
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 1vh 2vh rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <img src={event.image} alt="" style={styles.cardImage} />
              <div style={styles.cardBody}>
                <span style={styles.categoryTag}>{event.category}</span>
                <h3 style={styles.cardTitle}>{event.title}</h3>
                
                <div style={styles.meta}>
                  <Calendar size={isMobile ? 18 : 16} /> {event.date}
                </div>
                <div style={styles.meta}>
                  <MapPin size={isMobile ? 18 : 16} /> {event.location}
                </div>

                <div style={styles.footer}>
                  View Details <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>
            <h3>No events found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;