import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, LogIn, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Auth.css';

const StudentSignIn = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isStudent, setIsStudent] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    if (errors.general) setErrors({ ...errors, general: null });
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!formData.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const selectedRole = isStudent ? 'student' : 'teacher';
      if (data.role !== selectedRole) {
        setErrors({ general: `This account is registered as ${data.role}. Please use ${data.role} login.` });
        setLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token || '');
      onLogin(data);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
      setErrors({ general: err.response?.data?.message || 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LEFT PANEL */}
        <div className="auth-left">
          <div className="auth-left-blob1" />
          <div className="auth-left-blob2" />
          <div className="auth-left-emoji">👋</div>
          <h2>Welcome Back!</h2>
          <p>Log in to access your event dashboard, tickets, and certificates.</p>
          <div className="auth-left-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80"
              alt="Students at an event"
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <button className="auth-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={15} /> Home
          </button>

          <div className="auth-header">
            <h2>Login to EventSphere</h2>
            <p>Sign in to continue to your account</p>
          </div>

          {/* Role Toggle */}
          <div className="auth-toggle">
            <button className={isStudent ? 'active' : ''} onClick={() => setIsStudent(true)}>Student</button>
            <button className={!isStudent ? 'active' : ''} onClick={() => setIsStudent(false)}>Teacher</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="auth-error-box">
                <AlertCircle size={15} /> {errors.general}
              </div>
            )}

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <input
                  className={`auth-input${errors.email ? ' error' : ''}`}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoFocus
                />
              </div>
              {errors.email && <div className="auth-error-text"><AlertCircle size={12} />{errors.email}</div>}
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <input
                  className={`auth-input has-icon${errors.password ? ' error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <div className="auth-error-text"><AlertCircle size={12} />{errors.password}</div>}
            </div>

            <Link to="/forgot-password" className="auth-forgot">Forgot Password?</Link>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in…' : <><LogIn size={17} /> Login</>}
            </button>
          </form>

          <div className="auth-bottom-link">
            Don't have an account?
            <Link to={isStudent ? '/signup' : '/teacher-signup'}>
              Register {isStudent ? 'as Student' : 'as Teacher'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentSignIn;
