import React from 'react';
import { Search, MapPin, Calendar, Filter } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import GradientHeader from '../components/GradientHeader';

const Events = ({ allEvents, theme, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const styles = {
    container: { backgroundColor: isDark ? '#0f172a' : '#f8fafc', minHeight: '100%', fontFamily: 'sans-serif' },
    content: { padding: '20px' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: isDark ? '#1e293b' : '#fff', padding: '14px 18px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
    input: { border: 'none', outline: 'none', width: '100%', fontSize: '15px', background: 'transparent', color: isDark ? '#fff' : '#000' },
    card: { backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: '24px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.03)', cursor: 'pointer' },
    cardImg: { width: '100%', height: '180px', objectFit: 'cover' },
    cardBody: { padding: '18px' },
    cardTitle: { margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b' },
    cardMeta: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', marginBottom: '6px' },
    categoryTag: { display: 'inline-block', fontSize: '12px', fontWeight: '600', color: '#3b82f6', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '8px', marginBottom: '10px' }
  };

  return (
    <div style={styles.container}>
      <GradientHeader title="Events" subtitle="Discover workshops" showBack={false} />
      <div style={styles.content}>
        <div style={styles.searchBox}>
          <Search size={20} color="#94a3b8" />
          <input style={styles.input} placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Filter size={20} color="#3b82f6" />
        </div>
        {allEvents.map(event => (
          <div key={event.id} style={styles.card} onClick={() => navigate(`/event-details/${event.id}`)}>
            <img src={event.image} alt="" style={styles.cardImg} />
            <div style={styles.cardBody}>
              <span style={styles.categoryTag}>{event.category}</span>
              <h3 style={styles.cardTitle}>{event.title}</h3>
              <div style={styles.cardMeta}><Calendar size={16} /> {event.date}</div>
              <div style={styles.cardMeta}><MapPin size={16} /> {event.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Events;