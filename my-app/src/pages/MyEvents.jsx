import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Clock } from 'lucide-react';
import './MyEvents.css';

const MyEvents = ({ theme, events, onCancel }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  return (
    <div className={`page-wrapper my-events-page ${isDark ? 'dark' : ''}`}>
      <div className="my-events-header">
        <h1 className="my-events-title">My Tickets</h1>
        <p className="my-events-subtitle">Manage your upcoming events and registrations.</p>
      </div>

      {events.length === 0 ? (
        <div className="my-events-empty">
          <Ticket size={64} className="empty-icon" strokeWidth={1.5} />
          <h3>No tickets yet</h3>
          <p>You haven't registered for any events yet.</p>
          <button className="browse-btn" onClick={() => navigate('/events')}>
            Browse Events
          </button>
        </div>
      ) : (
        <div className="ticket-list">
          {events.map(event => (
            <div key={event._id} className="ticket-card">
              <div className="ticket-info">
                <span className={`ticket-badge ${event.status}`}>
                  {event.status === 'approved' ? 'Confirmed' : 'Pending Approval'}
                </span>
                <h3 className="ticket-title">{event.title}</h3>

                <div className="ticket-meta-row">
                  <div className="ticket-meta-item"><Calendar size={16} /> {event.date}</div>
                  <div className="ticket-meta-item"><MapPin size={16} /> {event.location}</div>
                  <div className="ticket-meta-item"><Clock size={16} /> 09:00 AM</div>
                </div>
              </div>

              <div className="ticket-actions">
                {event.status === 'approved' && (
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/ticket/${event.registrationId}`)}
                  >
                    View Ticket
                  </button>
                )}
                <button
                  className="btn-cancel"
                  onClick={() => onCancel(event.registrationId)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;