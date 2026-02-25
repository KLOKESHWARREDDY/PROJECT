import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { authAPI } from '../api';
import './Forms.css';

const EditProfile = ({ user, setUser, theme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user?.profileImage || '');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    regNo: user?.regNo || '',
    email: user?.email || '',
  });

  /* sync when user prop arrives */
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', college: user.college || '', regNo: user.regNo || '', email: user.email || '' });
      setPreviewUrl(user.profileImage || '');
    }
  }, [user]);

  const getImageUrl = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setMessage('');
    try {
      const result = await authAPI.uploadProfileImage(file);
      setPreviewUrl(result.profileImage);
      setIsSuccess(true);
      setMessage('Image uploaded! Save to apply changes.');
    } catch (err) {
      setIsSuccess(false);
      setMessage(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await authAPI.updateProfile({ name: formData.name, college: formData.college, regNo: formData.regNo, profileImage: previewUrl });
      const saved = localStorage.getItem('user');
      let updated = res.data;
      if (saved) {
        const parsed = JSON.parse(saved);
        updated = { ...parsed, ...res.data, token: parsed.token };
      }
      localStorage.setItem('user', JSON.stringify(updated));
      if (setUser) setUser(updated);
      setIsSuccess(true);
      setMessage('Profile saved successfully!');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      setIsSuccess(false);
      setMessage('Error saving: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const displaySrc = `${getImageUrl(previewUrl)}?t=${Date.now()}`;

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''}`}>

      {/* Header */}
      <div className="form-page-header">
        <button className="form-back-btn" onClick={() => navigate(-1)}><ArrowLeft size={18} /></button>
        <h1 className="form-page-title">Edit Profile</h1>
      </div>

      <div className="form-main">

        {/* Avatar card */}
        <div className="form-card form-avatar-section">
          <div className="form-avatar-wrap">
            <img
              className="form-avatar-img"
              src={displaySrc}
              alt="Profile"
              onError={e => { e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; }}
            />
            <button
              className="form-avatar-cam"
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
              title="Change photo"
            >
              <Camera size={14} />
            </button>
          </div>
          <span className="form-avatar-change" onClick={() => fileInputRef.current.click()}>
            {loading ? 'Uploading…' : 'Change Photo'}
          </span>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>

        {/* Message */}
        {message && (
          <div className={`form-msg ${isSuccess ? 'form-msg-success' : 'form-msg-error'}`}>
            {isSuccess ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {message}
          </div>
        )}

        {/* Fields */}
        <div className="form-card">
          <div className="form-section-title">Personal Information</div>

          <div className="form-field">
            <div className="form-label">Full Name</div>
            <input className="form-input" name="name" value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name" />
          </div>

          <div className="form-field">
            <div className="form-label">College Name</div>
            <input className="form-input" name="college" value={formData.college}
              onChange={e => setFormData({ ...formData, college: e.target.value })}
              placeholder="Your institution" />
          </div>

          <div className="form-field">
            <div className="form-label">{user?.role === 'teacher' ? 'Employee ID' : 'Registration ID'}</div>
            <input className="form-input" name="regNo" value={formData.regNo}
              onChange={e => setFormData({ ...formData, regNo: e.target.value })}
              placeholder={user?.role === 'teacher' ? 'EMP-001' : 'REG-2024'} />
          </div>

          <div className="form-field">
            <div className="form-label">Email <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>(cannot be changed)</span></div>
            <input className="form-input" value={formData.email} disabled />
          </div>
        </div>

        {/* Save */}
        <div className="form-card">
          <button className="form-btn form-btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfile;
