import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Forms.css'; // Utilizing Premium Forms CSS

const ChangePassword = ({ theme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      await axios.put(
        'http://localhost:5000/api/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token || user?.token}` } }
      );

      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => navigate(-1), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''} form-page`}>
      <div className="form-page-header">
        <button className="form-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="form-page-title">Change Password</h1>
      </div>

      <div className="form-main">
        {error && (
          <div className="form-msg form-msg-error">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {success && (
          <div className="form-msg form-msg-success">
            <CheckCircle size={15} /> {success}
          </div>
        )}

        <div className="form-card">
          <div className="form-field">
            <label className="form-label">Current Password</label>
            <div className="auth-input-wrap">
              <input
                className="form-input has-icon"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <div className="auth-eye-btn" style={{ pointerEvents: 'none' }}><Lock size={18} /></div>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">New Password</label>
            <div className="auth-input-wrap">
              <input
                className="form-input has-icon"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-field" style={{ marginBottom: 0 }}>
            <label className="form-label">Confirm New Password</label>
            <div className="auth-input-wrap">
              <input
                className="form-input has-icon"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="form-card">
          <button
            className="form-btn form-btn-primary"
            onClick={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? 'Updating...' : <><CheckCircle size={18} /> Update Password</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
