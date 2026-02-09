import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css'; 

const TeacherSignIn = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to extract name from email
    const namePart = formData.email.split('@')[0];
    const displayName = "Prof. " + namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const userData = {
      name: displayName,
      email: formData.email,
      role: 'teacher',
      college: "Engineering Tech Institute"
    };
    
    onLogin(userData); 
    navigate('/'); 
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-container">
          <div className="auth-logo">ES</div>
        </div>

        <div className="auth-header">
          <h2>Teacher Login</h2>
          <p>Welcome back, Professor</p>
        </div>

        {/* Toggle Switch */}
        <div className="toggle-container">
          <button className="toggle-btn" onClick={() => navigate('/signin')}>Student</button>
          <button className="toggle-btn active">Teacher</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="teacher@college.edu" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required />
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link to="#" style={{ fontSize: '13px', color: '#4f46e5', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>

          <button type="submit" className="submit-btn">Login</button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/teacher-signup" className="auth-link">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignIn;