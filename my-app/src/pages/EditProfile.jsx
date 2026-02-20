import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { authAPI } from '../api';

const EditProfile = ({ user, setUser, theme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(user?.profileImage || '');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    regNo: user?.regNo || '',
    email: user?.email || '',
  });

  // Sync form data with user prop when it becomes available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        regNo: user.regNo || '',
        email: user.email || '',
      });
      setPreviewUrl(user.profileImage || '');
    }
  }, [user]);

  // DEBUG: Log user role
  useEffect(() => {
    console.log('🔐 EditProfile - User role:', user?.role);
    console.log('🔄 EditProfile Loaded - v2 (Upload Fix Applied)');
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await authAPI.uploadProfileImage(file);
      setPreviewUrl(result.profileImage);
      setMessage('Image uploaded! Now save other changes.');
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`Upload Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const data = {
        name: formData.name,
        college: formData.college,
        regNo: formData.regNo,
        profileImage: previewUrl
      };

      const response = await authAPI.updateProfile(data);

      // Update localStorage with new user data
      const savedUser = localStorage.getItem('user');
      let updatedUserData = response.data;

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        updatedUserData = {
          ...parsed,
          ...response.data,
          token: parsed.token
        };
      }

      localStorage.setItem('user', JSON.stringify(updatedUserData));

      if (setUser) {
        setUser(updatedUserData);
      }

      setMessage('Profile saved successfully!');

      setTimeout(() => {
        navigate('/profile');
      }, 1000);

    } catch (error) {
      console.error('Save error:', error);
      setMessage('Error saving profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: isMobile ? 20 : 30,
      maxWidth: isMobile ? '100%' : 500,
      margin: '0 auto',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      color: isDark ? '#fff' : '#1e293b'
    },
    header: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 },
    backBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: isDark ? '#fff' : '#64748b', display: 'flex', alignItems: 'center'
    },
    pageTitle: { fontSize: isMobile ? 24 : 32, fontWeight: '800' },
    avatarContainer: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30
    },
    avatarWrapper: {
      position: 'relative', width: isMobile ? 100 : 120, height: isMobile ? 100 : 120
    },
    avatar: {
      width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
      border: `4px solid ${isDark ? '#1e293b' : '#fff'}`,
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    cameraBtn: {
      position: 'absolute', bottom: 0, right: 0,
      backgroundColor: '#4f46e5', color: '#fff',
      width: isMobile ? 32 : 40, height: isMobile ? 32 : 40,
      borderRadius: '50%', border: `3px solid ${isDark ? '#0f172a' : '#fff'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    changeText: {
      marginTop: 10, color: '#4f46e5', fontWeight: '600', fontSize: isMobile ? 14 : 16, cursor: 'pointer'
    },
    form: { display: 'flex', flexDirection: 'column', gap: 20 },
    label: {
      fontSize: isMobile ? 14 : 16, fontWeight: '600', marginBottom: 8,
      color: isDark ? '#cbd5e1' : '#475569'
    },
    input: {
      width: '100%', padding: isMobile ? 12 : 14,
      borderRadius: isMobile ? 10 : 12,
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      color: isDark ? '#fff' : '#1e293b',
      fontSize: isMobile ? 16 : 16,
      outline: 'none'
    },
    saveBtn: {
      marginTop: 25, width: '100%', padding: isMobile ? 16 : 18,
      backgroundColor: loading ? '#94a3b8' : '#4f46e5',
      color: '#fff', border: 'none', borderRadius: isMobile ? 12 : 14,
      fontSize: isMobile ? 16 : 18, fontWeight: 'bold',
      cursor: loading ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
    },
    message: {
      marginTop: 15, padding: 12,
      backgroundColor: (message.includes('saved') || message.includes('uploaded')) ? '#dcfce7' : '#fee2e2',
      color: (message.includes('saved') || message.includes('uploaded')) ? '#166534' : '#991b1b',
      borderRadius: 8, fontSize: isMobile ? 14 : 14, textAlign: 'center'
    }
  };

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const getImageUrl = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={styles.pageTitle}>Edit Profile</h1>
      </div>

      <div style={styles.avatarContainer}>
        <div style={styles.avatarWrapper}>
          <img
            src={`${getImageUrl(previewUrl)}?t=${new Date().getTime()}`}
            alt="Profile"
            style={styles.avatar}
            onError={(e) => {
              console.error('Image load failed for:', e.target.src);
              e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            }}
          />
          <div
            style={{ ...styles.cameraBtn, opacity: loading ? 0.7 : 1 }}
            onClick={() => fileInputRef.current.click()}
          >
            <Camera size={isMobile ? 16 : 18} />
          </div>
        </div>
        <span style={styles.changeText} onClick={() => fileInputRef.current.click()}>
          {loading ? 'Uploading...' : 'Change Photo'}
        </span>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.form}>
        <div>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label style={styles.label}>College Name</label>
          <input
            style={styles.input}
            name="college"
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
          />
        </div>

        <div>
          <label style={styles.label}>{user?.role === 'teacher' ? 'Employee ID' : 'Registration ID'}</label>
          <input
            style={styles.input}
            name="regNo"
            value={formData.regNo}
            onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
          />
        </div>

        <div>
          <label style={styles.label}>Email (cannot change)</label>
          <input
            style={{ ...styles.input, opacity: 0.7 }}
            name="email"
            value={formData.email}
            disabled
          />
        </div>

        <button
          style={styles.saveBtn}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
