import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ClipboardList, XCircle, CheckCircle, Bell, ChevronRight } from 'lucide-react';
import './Pages.css';

const Notifications = ({ theme, user, registrations = [], notificationsList = [] }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const isTeacher = user?.role === 'teacher';

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  const timeString = (ts) => {
    if (!ts) return '';
    try { return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return ts; }
  };

  const getNotifIconCls = (type) => {
    if (type === 'approval') return 'page-notif-icon page-notif-icon-green';
    if (type === 'rejection') return 'page-notif-icon page-notif-icon-red';
    if (type === 'registration_sent') return 'page-notif-icon page-notif-icon-amber';
    return 'page-notif-icon page-notif-icon-indigo';
  };

  const getNotifIcon = (type) => {
    if (type === 'approval') return <CheckCircle size={18} />;
    if (type === 'rejection') return <XCircle size={18} />;
    if (type === 'registration' || type === 'registration_sent') return <ClipboardList size={18} />;
    return <Bell size={18} />;
  };

  const handleNotifClick = (notif) => {
    if (notif.type === 'publish' && notif.relatedId) navigate(`/events/${notif.relatedId}`);
    else if (['registration', 'approval', 'registration_sent', 'rejection'].includes(notif.type)) navigate('/my-events');
    else navigate('/events');
  };

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''}`}>
      <div className="page-header">
        <button className="page-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="page-title">Notifications</h1>
      </div>

      <div className="page-main">
        <div className="page-card" style={{ borderRadius: 18, border: '1px solid #e2e8f0', background: isDark ? 'rgba(30,41,59,0.8)' : '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          {isTeacher ? (
            /* TEACHER — registration stats */
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
          ) : notificationsList.length > 0 ? (
            /* STUDENT — general notifications */
            <div className="page-notif-list">
              {notificationsList.map(notif => (
                <div
                  key={notif._id || notif.id}
                  className={`page-notif-item${!notif.read ? ' unread' : ''}`}
                  onClick={() => handleNotifClick(notif)}
                >
                  <div className="page-notif-dot-wrap">
                    <div className={`page-notif-dot${notif.read ? ' read' : ''}`} />
                  </div>
                  <div className={getNotifIconCls(notif.type)}>
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="page-notif-body">
                    <div className="page-notif-title">{notif.title}</div>
                    <div className="page-notif-msg">{notif.message || notif.desc}</div>
                    <div className="page-notif-time">{timeString(notif.createdAt) || notif.time}</div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              ))}
            </div>
          ) : (
            <div className="page-empty">
              <Bell size={40} strokeWidth={1.5} />
              <p>No notifications yet</p>
              <span>You're all caught up!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;