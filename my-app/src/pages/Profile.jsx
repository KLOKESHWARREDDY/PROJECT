import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogOut, GraduationCap, Settings } from 'lucide-react';
import axios from 'axios';
import styles from './Profile.module.css';

const Profile = ({ user: initialUser, theme, onLogout, setUser }) => {
  const navigate = useNavigate();

  const [user, setLocalUser] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ── Token helper ── */
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (token) return token;
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { return JSON.parse(savedUser)?.token || null; } catch { }
    }
    return null;
  };

  /* ── hasFetched ref: fetch profile only ONCE per mount ── */
  const hasFetched = useRef(false);

  /* ── Fetch fresh profile ── */
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchUserData = async () => {
      try {
        // Seed local state immediately from props / localStorage
        if (initialUser?.name && initialUser.name !== 'Guest') {
          setLocalUser(initialUser);
        } else {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed?.name && parsed.name !== 'Guest') setLocalUser(parsed);
          }
        }

        const token = getToken();
        if (!token) { setLoading(false); return; }

        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const latestUser = response.data;
        setLocalUser(latestUser);
        // Update parent ONCE — the hasFetched guard stops any resulting re-trigger
        if (setUser) setUser({ ...latestUser, token });
        localStorage.setItem('user', JSON.stringify({ ...latestUser, token }));
      } catch (err) {
        console.error('Error fetching user data:', err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [initialUser, setUser]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Image URL helper ── */
  const getImageUrl = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  /* ── Settings cards ── */
  const settingsOptions = [
    {
      label: 'Edit Profile',
      sub: 'Update personal info',
      icon: <User size={26} strokeWidth={2.5} />,
      iconCls: styles.iconPrimary,
      onClick: () => navigate('/edit-profile'),
    },
    {
      label: 'Security',
      sub: 'Change password',
      icon: <Lock size={26} strokeWidth={2.5} />,
      iconCls: styles.iconSuccess,
      onClick: () => navigate('/change-password'),
    },
    {
      label: 'Log Out',
      sub: 'Sign out of account',
      icon: <LogOut size={26} strokeWidth={2.5} />,
      iconCls: styles.iconDanger,
      onClick: onLogout,
    },
  ];

  const imageUrl = getImageUrl(user?.profileImage);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className={styles.loadingScreen}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  const isTeacher = user?.role === 'teacher';

  return (
    <div className={`page-wrapper${theme === 'dark' ? ' dark' : ''}`}>
      <div className={styles.profileContainer}>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>My Profile</h1>
          <p className={styles.pageSubtitle}>Manage your account and personal details</p>
        </div>

        <div className={styles.grid}>

          {/* ── LEFT: Profile Card ── */}
          <div className={styles.profileCard}>
            <div className={styles.profileCardBg} />
            <div className={styles.profileCardContent}>

              {/* Avatar with glowing primary ring */}
              <div className={styles.avatarWrap}>
                <div className={styles.avatarRing}>
                  <img
                    className={styles.avatar}
                    src={imageError
                      ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                      : imageUrl}
                    alt="Profile"
                    onError={() => setImageError(true)}
                  />
                </div>
              </div>

              <h2 className={styles.name}>{user?.name || '—'}</h2>
              <p className={styles.email}>{user?.email || '—'}</p>

              <span className={styles.badge}>
                <span className={styles.badgeDot} />
                {isTeacher ? 'Teacher Account' : 'Student Account'}
              </span>

            </div>
          </div>

          {/* ── RIGHT: Details + Settings ── */}
          <div className={styles.rightCol}>

            {/* Academic Information card */}
            <div className={styles.infoCard}>
              <div className={styles.sectionLabel}>
                <GraduationCap size={18} />
                Academic Information
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>College</span>
                  <span className={styles.infoValue}>{user?.college || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Department</span>
                  <span className={styles.infoValue}>{user?.department || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    {isTeacher ? 'Employee ID' : 'Registration ID'}
                  </span>
                  <span className={styles.infoValue}>{user?.regNo || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className={styles.settingsSection}>
              <div className={styles.settingsTitle}>
                <Settings size={16} />
                Account Settings
              </div>
              <div className={styles.settingsGrid}>
                {settingsOptions.map((opt, i) => (
                  <div
                    key={i}
                    className={styles.settingCard}
                    onClick={opt.onClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && opt.onClick()}
                  >
                    <div className={styles.settingCardContent}>
                      <div className={`${styles.settingIconBox} ${opt.iconCls}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <div className={styles.settingCardLabel}>{opt.label}</div>
                        <div className={styles.settingCardSub}>{opt.sub}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
