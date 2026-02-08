import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Home, Calendar, Ticket, User, MapPin, Clock } from 'lucide-react';

const Events = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  // Register button function
  const handleRegister = (eventName) => {
    alert(`Successfully registered for: ${eventName}`);
  };

  const filters = ['All', 'Tech', 'Cultural', 'Sports', 'Workshops'];

  // Event data with high-quality working image URLs
  const allEvents = [
    {
      id: 1,
      title: "Campus Tech Summit 2024",
      date: "Mar 18, 2024 - 10:00 AM",
      location: "Main Auditorium, Block A",
      category: "Tech",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" 
    },
    {
      id: 2,
      title: "Annual Cultural Night",
      date: "Mar 22, 2024 - 6:30 PM",
      location: "Open Air Theatre",
      category: "Cultural",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Spring Sports Fest",
      date: "Mar 30, 2024 - 8:00 AM",
      location: "University Sports Ground",
      category: "Sports",
      image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const filteredEvents = activeFilter === 'All' 
    ? allEvents 
    : allEvents.filter(event => event.category === activeFilter);

  const styles = {
    container: { maxWidth: '375px', margin: '0 auto', backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', position: 'relative' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #f1f5f9' },
    searchWrapper: { position: 'relative', padding: '16px' },
    searchIcon: { position: 'absolute', left: '28px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    input: { width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', boxSizing: 'border-box' },
    filterRow: { display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 16px 16px', scrollbarWidth: 'none' },
    filterChip: (isActive) => ({
      padding: '8px 20px', borderRadius: '10px', border: 'none',
      backgroundColor: isActive ? '#e0e7ff' : '#f8fafc',
      color: isActive ? '#2563eb' : '#64748b',
      fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
    }),
    scrollArea: { flex: 1, overflowY: 'auto', padding: '0 16px 100px' },
    card: { borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '20px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    cardImage: { width: '100%', height: '160px', objectFit: 'cover' },
    cardBody: { padding: '16px' },
    cardTitle: { margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' },
    detailRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginBottom: '6px' },
    regBtn: { width: '100%', padding: '12px', backgroundColor: '#5c5cfc', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    bottomNav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '375px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid #f1f5f9' },
    navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }
  };

  return (
    <div style={styles.container}>
      {/* Header with Filter Icon */}
      <div style={styles.header}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>Events</h2>
        <Filter size={24} style={{ cursor: 'pointer', color: '#333' }} />
      </div>

      {/* Search Wrapper */}
      <div style={styles.searchWrapper}>
        <Search size={18} style={styles.searchIcon} />
        <input type="text" placeholder="Search events..." style={styles.input} />
      </div>

      {/* Horizontal Scroll Filter Chips */}
      <div style={styles.filterRow}>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={styles.filterChip(activeFilter === filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Vertical Scroll Area for Events */}
      <div style={styles.scrollArea}>
        {filteredEvents.map(event => (
          <div key={event.id} style={styles.card}>
            <img src={event.image} alt={event.title} style={styles.cardImage} />
            <div style={styles.cardBody}>
              <h4 style={styles.cardTitle}>{event.title}</h4>
              <div style={styles.detailRow}><Clock size={14} /><span>{event.date}</span></div>
              <div style={styles.detailRow}><MapPin size={14} /><span>{event.location}</span></div>
              <button style={styles.regBtn} onClick={() => handleRegister(event.title)}>Register</button>
            </div>
          </div>
        ))}
      </div>

      {/* Persistent Bottom Nav */}
      <nav style={styles.bottomNav}>
        <div style={styles.navItem} onClick={() => navigate('/')}><Home size={22} /><span>Home</span></div>
        <div style={{...styles.navItem, color: '#2563eb', fontWeight: 'bold'}} onClick={() => navigate('/events')}><Calendar size={22} /><span>Events</span></div>
        <div style={styles.navItem} onClick={() => navigate('/my-events')}><Ticket size={22} /><span>My Events</span></div>
        <div style={styles.navItem} onClick={() => navigate('/profile')}><User size={22} /><span>Profile</span></div>
      </nav>
    </div>
  );
};

export default Events;