import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ClipboardList, XCircle, CheckCircle, Bell, ChevronRight, Flame, Rocket, Info, Trash2 } from 'lucide-react';
import './Pages.css';

const Notifications = ({ theme, user, registrations = [], notificationsList = [], onDeleteNotification }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const isTeacher = user?.role === 'teacher';

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;
  const unreadCount = notificationsList.filter(n => !n.read).length;
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = notificationsList.filter(n => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  const timeString = (ts) => {
    if (!ts) return '';
    try { return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return ts; }
  };

  const getNotifIconCls = (type) => {
    if (type === 'approval') return 'page-notif-icon page-notif-icon-green';
    if (type === 'rejection') return 'page-notif-icon page-notif-icon-red';
    if (type === 'registration_sent') return 'page-notif-icon page-notif-icon-amber';
    if (type === 'new_event') return 'page-notif-icon page-notif-icon-indigo';
    if (type === 'popular_event') return 'page-notif-icon page-notif-icon-red';
    if (type === 'event_update') return 'page-notif-icon page-notif-icon-amber';
    return 'page-notif-icon page-notif-icon-indigo';
  };

  const getNotifIcon = (type) => {
    if (type === 'approval') return <CheckCircle size={18} />;
    if (type === 'rejection') return <XCircle size={18} />;
    if (type === 'registration' || type === 'registration_sent') return <ClipboardList size={18} />;
    if (type === 'new_event') return <Rocket size={18} />;
    if (type === 'popular_event') return <Flame size={18} />;
    if (type === 'event_update') return <Info size={18} />;
    return <Bell size={18} />;
  };

  const handleNotifClick = (notif) => {
    if ((notif.type === 'publish' || notif.type === 'new_event' || notif.type === 'popular_event' || notif.type === 'event_update') && notif.relatedId) {
      navigate(`/events/${notif.relatedId}`);
    } else if (['registration', 'approval', 'registration_sent', 'rejection'].includes(notif.type)) navigate('/my-events');
    else navigate('/events');
  };

  return (
    <div className={`devze-page-wrapper${isDark ? ' dark' : ''}`}>
      <div className="devze-main-content">
        {isTeacher ? (
          <div className="page-card" style={{ borderRadius: 18, border: '1px solid #e2e8f0', background: isDark ? 'rgba(30,41,59,0.8)' : '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            {/* TEACHER — registration stats */}
            <div className="page-notif-list">
              {[
                { icon: <Users size={18} />, iconCls: 'page-notif-icon page-notif-icon-indigo', title: 'New Registrations', msg: `${pendingCount} pending request${pendingCount !== 1 ? 's' : ''}` },
                { icon: <CheckCircle size={18} />, iconCls: 'page-notif-icon page-notif-icon-green', title: 'Approved Members', msg: `${approvedCount} active member${approvedCount !== 1 ? 's' : ''}` },
                { icon: <XCircle size={18} />, iconCls: 'page-notif-icon page-notif-icon-red', title: 'Rejected Requests', msg: `${rejectedCount} rejected` },
              ].map((item, i) => (
                <div key={i} className="page-notif-item" onClick={() => navigate('/teacher-registrations')}>
                  <div className={item.iconCls}>{item.icon}</div>
                  <div className="page-notif-body">
                    <div className="page-notif-title">{item.title}</div>
                    <div className="page-notif-msg">{item.msg}</div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* STUDENT — general notifications in DevzeMart style */
          <div className="devze-notif-container">
            <div className="devze-breadcrumb">
              Dashboard &gt; All Notifications
            </div>

            <div className="devze-top-header">
              <div className="devze-header-title-wrap">
                <button onClick={() => navigate(-1)} title="Go Back"><ArrowLeft size={24} /></button>
                <h1>All Notifications</h1>
              </div>
            </div>

            <div className="devze-notif-header">
              <button
                className={`devze-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`devze-tab ${activeTab === 'unread' ? 'active' : ''}`}
                onClick={() => setActiveTab('unread')}
              >
                Unread <span className="devze-badge">{unreadCount || ''}</span>
              </button>
            </div>

            {filteredNotifications.length > 0 ? (
              <div className="devze-notif-list">
                {filteredNotifications.map(notif => (
                  <div
                    key={notif._id || notif.id}
                    className={`devze-notif-item${!notif.read ? ' unread' : ''}`}
                    onClick={() => handleNotifClick(notif)}
                  >
                    <div className={getNotifIconCls(notif.type).replace('page-notif', 'devze-notif')}>
                      {/* Only map initials if avatar isn't an icon, assuming an icon for now */}
                      {getNotifIcon(notif.type)}
                    </div>

                    <div className="devze-notif-content">
                      <div className="devze-notif-text">
                        <span className="devze-notif-title">{notif.title}</span> <span className="devze-notif-msg">{notif.message || notif.desc}</span>
                      </div>
                      <div className="devze-notif-time">{timeString(notif.createdAt) || notif.time}</div>
                    </div>

                    {!notif.read && <div className="devze-notif-dot" />}

                    <button
                      className="devze-notif-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteNotification) onDeleteNotification(notif._id || notif.id);
                      }}
                      title="Delete Notification"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="devze-empty-state">
                <div className="devze-empty-icon-wrap">
                  <Bell size={40} className="devze-empty-icon" />
                </div>
                <h3>No notifications yet</h3>
                <p>You're all caught up!</p>
              </div>
            )}

            {notificationsList.length > 0 && (
              <div className="devze-notif-footer">
                <button className="devze-mark-read" onClick={() => { }}>
                  <CheckCircle size={16} /> Mark all as read
                </button>
                <button className="devze-view-all">View All Notifications</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;