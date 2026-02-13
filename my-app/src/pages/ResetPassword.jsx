import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authAPI } from '../api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved === 'dark');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await authAPI.resetPassword(token, password);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      padding: '20px'
    },
    card: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#1e293b',
      textAlign: 'center',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      textAlign: 'center',
      marginBottom: '30px'
    },
    input: {
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      backgroundColor: isDark ? '#0f172a' : '#fff',
      color: isDark ? '#fff' : '#1e293b',
      fontSize: '14px',
      marginBottom: '20px',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: '#4f46e5',
      color: '#fff',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1
    },
    message: {
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      textAlign: 'center',
      marginTop: '20px',
      backgroundColor: message?.includes('successful') 
        ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#dcfce7')
        : (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2'),
      color: message?.includes('successful') 
        ? (isDark ? '#6ee7b7' : '#16a34a')
        : (isDark ? '#fca5a5' : '#dc2626')
    },
    backLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '20px',
      color: '#4f46e5',
      textDecoration: 'none',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 Reset Password</h1>
        <p style={styles.subtitle}>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}

        <Link to="/signin" style={styles.backLink}>
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
