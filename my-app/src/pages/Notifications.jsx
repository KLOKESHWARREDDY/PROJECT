import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, ClipboardList, XCircle, ChevronRight, Bell, CheckCircle } from 'lucide-react';

const Notifications = ({ theme, user, registrations = [], notificationsList = [] }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const isTeacher = user?.role === 'teacher';

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- TEACHER STATS CALCULATION ---
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  const styles = {
    container: {
      padding: isMobile ? '4vw' : '2vw',
      maxWidth: isMobile ? '100vw' : '50vw',
      margin: '0 auto',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      color: isDark ? '#fff' : '#1e293b'
    },
    header: { display: 'flex', alignItems: 'center', gap: '2vw', marginBottom: '4vh' },
    backBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: isDark ? '#fff' : '#64748b', display: 'flex', alignItems: 'center'
    },
    pageTitle: { fontSize: isMobile ? '6vw' : '2vw', fontWeight: '800' },

    list: { display: 'flex', flexDirection: 'column', gap: '2vh' },

    // Card Style
    item: {
      display: 'flex', alignItems: 'center', gap: '3vw',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      padding: isMobile ? '4vw' : '1.5vw',
      borderRadius: isMobile ? '3vw' : '1vw',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      transition: 'transform 0.2s'
    },
    iconBox: (color, bg) => ({
      width: isMobile ? '12vw' : '3.5vw', height: isMobile ? '12vw' : '3.5vw',
      borderRadius: '50%', backgroundColor: bg, color: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }),
    info: { flex: 1 },
    title: { fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: '600', marginBottom: '0.5vh' },
    count: { fontSize: isMobile ? '3.5vw' : '0.9vw', color: '#64748b' },
    time: { fontSize: isMobile ? '3vw' : '0.8vw', color: '#94a3b8', marginTop: '0.5vh' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={isMobile ? 24 : 24} />
        </button>
        <h1 style={styles.pageTitle}>Notifications</h1>
      </div>

      <div style={styles.list}>

        {/* --- TEACHER VIEW (Registration Stats) --- */}
        {isTeacher ? (
          <>
            <div style={styles.item} onClick={() => navigate('/teacher-registrations')}>
              <div style={styles.iconBox('#4f46e5', '#e0e7ff')}>
                <Users size={isMobile ? 20 : 22} />
              </div>
              <div style={styles.info}>
                <div style={styles.title}>New Registration</div>
                <div style={styles.count}>{pendingCount} pending requests</div>
              </div>
              <ChevronRight size={20} color="#94a3b8" />
            </div>

            <div style={styles.item} onClick={() => navigate('/teacher-registrations')}>
              <div style={styles.iconBox('#16a34a', '#dcfce7')}>
                <ClipboardList size={isMobile ? 20 : 22} />
              </div>
              <div style={styles.info}>
                <div style={styles.title}>Registered Members</div>
                <div style={styles.count}>{approvedCount} active members</div>
              </div>
              <ChevronRight size={20} color="#94a3b8" />
            </div>

            <div style={styles.item} onClick={() => navigate('/teacher-registrations')}>
              <div style={styles.iconBox('#dc2626', '#fee2e2')}>
                <XCircle size={isMobile ? 20 : 22} />
              </div>
              <div style={styles.info}>
                <div style={styles.title}>Registration Rejected</div>
                <div style={styles.count}>{rejectedCount} rejected</div>
              </div>
              <ChevronRight size={20} color="#94a3b8" />
            </div>
          </>
        ) : (
          /* --- STUDENT VIEW (General Notifications) --- */
          notificationsList.length > 0 ? (
            notificationsList.map((notif) => (
              <div key={notif._id || notif.id} style={styles.item}>
                <div style={styles.iconBox('#4f46e5', notif.read ? '#f1f5f9' : '#e0e7ff')}>
                  {notif.type === 'registration' ? <ClipboardList size={20} /> :
                    notif.type === 'approval' ? <CheckCircle size={20} /> :
                      <Bell size={20} />}
                </div>
                <div style={styles.info}>
                  <div style={styles.title}>{notif.title}</div>
                  <div style={styles.count}>{notif.message || notif.desc}</div>
                  <div style={styles.time}>
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : notif.time}
                  </div>
                </div>
                {!notif.read && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4f46e5' }}></div>}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', marginTop: '5vh' }}>
              No new notifications
            </div>
          )
        )}

      </div>
    </div>
  );
};

export default Notifications;