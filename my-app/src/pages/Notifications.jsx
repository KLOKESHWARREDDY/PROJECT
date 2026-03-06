import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Users, ClipboardList, XCircle, ChevronRight,
  Bell, CheckCircle, Clock, Calendar, Inbox, Search
} from 'lucide-react';
import './Notifications.css';

const Notifications = ({ theme, user, registrations = [], notificationsList = [] }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, unread, important

  const isTeacher = user?.role === 'teacher';

  // --- DATA PROCESSING ---
  const teacherNotifications = useMemo(() => {
    if (!isTeacher) return [];

    const pending = registrations.filter(r => r.status === 'pending').map(r => ({
      id: `pending-${r._id}`,
      type: 'registration',
      title: 'New Registration Pending',
      message: `User ${r.student?.name || 'Someone'} applied for ${r.event?.title || 'an event'}.`,
      time: r.createdAt,
      status: 'pending',
      path: '/teacher-registrations',
      icon: <Users size={20} />,
      color: '#4f46e5',
      bg: '#e0e7ff'
    }));

    const approved = registrations.filter(r => r.status === 'approved').slice(0, 5).map(r => ({
      id: `approved-${r._id}`,
      type: 'approval',
      title: 'Registration Approved',
      message: `You approved ${r.student?.name || 'User'} for ${r.event?.title || 'Event'}.`,
      time: r.updatedAt || r.createdAt,
      status: 'approved',
      path: '/teacher-registrations',
      icon: <CheckCircle size={20} />,
      color: '#16a34a',
      bg: '#dcfce7'
    }));

    return [...pending, ...approved].sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [isTeacher, registrations]);

  const displayList = isTeacher ? teacherNotifications : notificationsList;

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') return displayList.filter(n => !n.read);
    return displayList;
  }, [displayList, filter]);

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="back-button-container">
          <button className="notifications-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="notifications-page-title">Notifications</h1>
        </div>

        <div className="notifications-actions">
          <div
            className={`action-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </div>
          <div
            className={`action-chip ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </div>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.read && !isTeacher; // Teacher stats aren't exactly "notifications" in the same way here

            return (
              <div
                key={notif.id || notif._id}
                className={`notification-card ${isUnread ? 'unread' : ''}`}
                onClick={() => {
                  if (notif.path) navigate(notif.path);
                  else if (notif.type === 'publish' && notif.relatedId) navigate(`/events/${notif.relatedId}`);
                  else if (['registration', 'approval', 'registration_sent', 'rejection'].includes(notif.type)) navigate('/my-events');
                  else navigate('/events');
                }}
              >
                <div
                  className="notification-icon-wrapper"
                  style={{
                    backgroundColor: notif.bg || (notif.type === 'rejection' ? '#fee2e2' : notif.type === 'approval' ? '#dcfce7' : '#e0e7ff'),
                    color: notif.color || (notif.type === 'rejection' ? '#dc2626' : notif.type === 'approval' ? '#16a34a' : '#4f46e5')
                  }}
                >
                  {notif.icon || (
                    notif.type === 'approval' ? <CheckCircle size={20} /> :
                      notif.type === 'rejection' ? <XCircle size={20} /> :
                        notif.type === 'registration' || notif.type === 'registration_sent' ? <ClipboardList size={20} /> :
                          <Bell size={20} />
                  )}
                </div>

                <div className="notification-info">
                  <div className="notification-title-row">
                    <h3 className="notification-card-title">{notif.title}</h3>
                    {notif.status && (
                      <span className={`status-indicator`} style={{
                        backgroundColor: notif.bg,
                        color: notif.color
                      }}>
                        {notif.status}
                      </span>
                    )}
                  </div>
                  <p className="notification-card-message">{notif.message || notif.desc}</p>

                  <div className="notification-meta">
                    <span className="notification-time">
                      <Clock size={12} />
                      {new Date(notif.time || notif.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <ChevronRight size={18} className="chevron-icon" style={{ opacity: 0.3 }} />
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Inbox size={64} />
            </div>
            <h3>All caught up!</h3>
            <p>You don't have any notifications {filter === 'unread' ? 'to read' : 'at the moment'}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
