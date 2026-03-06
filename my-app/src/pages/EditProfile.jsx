import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check, Save } from 'lucide-react';
import { authAPI } from '../api';
import './EditProfile.css';

const EditProfile = ({ user, setUser, theme }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(user?.profileImage || '');

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await authAPI.uploadProfileImage(file);
      setPreviewUrl(result.profileImage);
      setIsSuccess(true);
      setMessage('Profile photo uploaded! Save to complete.');
    } catch (error) {
      setIsSuccess(false);
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

      const savedUser = localStorage.getItem('user');
      let updatedUserData = response.data;

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        updatedUserData = { ...parsed, ...response.data, token: parsed.token };
      }

      localStorage.setItem('user', JSON.stringify(updatedUserData));

      if (setUser) {
        setUser(updatedUserData);
      }

      setIsSuccess(true);
      setMessage('Profile updated successfully!');

      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (error) {
      setIsSuccess(false);
      setMessage('Error saving profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  return (
    <div className="ep-page-wrapper">
      <div className="ep-bg-glow" />
      <div className="ep-bg-glow-alt" />

      <div className="ep-container">
        <header className="ep-header">
          <button className="ep-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="ep-title">Edit Profile</h1>
        </header>

        <div className="ep-profile-card">
          <div className="ep-avatar-section">
            <div className="ep-avatar-wrapper">
              <img
                src={`${getImageUrl(previewUrl)}?t=${new Date().getTime()}`}
                alt="Profile"
                className="ep-avatar"
              />
              <div className="ep-camera-btn" onClick={() => fileInputRef.current.click()}>
                <Camera size={20} />
              </div>
            </div>
            <span className="ep-change-text" onClick={() => fileInputRef.current.click()}>
              {loading ? 'Processing...' : 'Change Profile Photo'}
            </span>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {message && (
            <div className={`ep-message ${isSuccess ? 'ep-message-success' : 'ep-message-error'}`}>
              {isSuccess ? <Check size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> : null}
              {message}
            </div>
          )}

          <div className="ep-form">
            <div className="ep-field">
              <label className="ep-label">Display Name</label>
              <input
                className="ep-input"
                placeholder="Your high-rank name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="ep-field">
              <label className="ep-label">College / Organization</label>
              <input
                className="ep-input"
                placeholder="Where you lead"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              />
            </div>

            <div className="ep-field">
              <label className="ep-label">
                {user?.role === 'teacher' ? 'Employee Index' : 'Registration Number'}
              </label>
              <input
                className="ep-input"
                placeholder="Profile Identifier"
                value={formData.regNo}
                onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
              />
            </div>

            <div className="ep-field">
              <label className="ep-label">Email Address (Locked)</label>
              <input
                className="ep-input"
                value={formData.email}
                disabled
              />
            </div>

            <button
              className="ep-save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving Changes...' : (
                <>
                  <Save size={20} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
