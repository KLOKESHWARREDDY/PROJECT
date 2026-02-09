import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css'; // Uses the styles we created earlier

const StudentSignIn = ({ onLogin }) => {
  const navigate = useNavigate();
  
  // State to manage the toggle (Student vs Teacher)
  const [userType, setUserType] = useState('student'); 
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate Login Logic
    // Extract a display name from email (e.g., "john" from "john@email.com")
    const namePart = formData.email.split('@')[0];
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const userData = {
      name: displayName,
      email: formData.email,
      role: userType // Pass the role (Student/Teacher) to the app
    };
    
    onLogin(userData); // Update App State
    navigate('/');     // Redirect to Dashboard
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* LOGO Circle */}
        <div className="logo-container">
          <div className="auth-logo">ES</div>
        </div>

        {/* Header Text */}
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to continue using EventSphere</p>
        </div>

        {/* TOGGLE SWITCH */}
        <div className="toggle-container">
          <button 
            type="button"
            className={`toggle-btn ${userType === 'student' ? 'active' : ''}`}
            onClick={() => setUserType('student')}
          >
            Student
          </button>
          <button 
            type="button"
            className={`toggle-btn ${userType === 'teacher' ? 'active' : ''}`}
            onClick={() => setUserType('teacher')}
          >
            Teacher
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder={userType === 'student' ? "student@university.edu" : "teacher@university.edu"} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••••••" 
              required 
            />
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right', marginTop: '-10px' }}>
            <Link to="/forgot-password" style={{ fontSize: '13px', color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="submit-btn">Login</button>
        </form>

        {/* Footer Register Link */}
        <div className="auth-footer">
          <p>
            Don't have an account? 
            <Link to="/signup" className="auth-link">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSignIn;