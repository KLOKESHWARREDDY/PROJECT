import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Ensure lucide-react is installed
import './Auth.css';

const StudentSignUp = ({ onLogin }) => { 
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    department: '', // Changed default to empty string for placeholder to show
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const departments = [
    'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Electronics Engineering', 'Information Technology',
    'Business Administration', 'Mathematics', 'Physics', 'Chemistry'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!formData.agreeToTerms) {
      alert('You must agree to the Terms & Policy');
      return;
    }

    const userData = {
      name: formData.fullName,
      email: formData.email,
      regNo: formData.rollNumber,
      college: "Engineering Tech Institute", 
      department: formData.department
    };

    onLogin(userData);
    navigate('/'); 
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* LOGO from Template */}
        <div className="logo-container">
          <div className="auth-logo">ES</div>
        </div>

        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join EventSphere</p>
        </div>

        {/* TOGGLE TABS (Visual only for now, can link to TeacherSignUp) */}
        <div className="toggle-container">
          <button className="toggle-btn active">Student</button>
          <button className="toggle-btn" onClick={() => navigate('/teacher-signup')}>Teacher</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder="Enter full name" 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Roll Number</label>
              <input 
                type="text" 
                name="rollNumber" 
                value={formData.rollNumber} 
                onChange={handleChange} 
                placeholder="Student ID" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select 
                name="department" 
                value={formData.department} 
                onChange={handleChange} 
                required
                style={{ padding: '10px' }} // Fix alignment
              >
                <option value="" disabled>Select Dept</option>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="name@example.com" 
              required 
            />
          </div>
          
           <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                placeholder="Enter phone number" 
                required 
              />
            </div>

          {/* Password with Eye Icon */}
          <div className="form-group">
            <label>Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter password" 
              required 
              minLength="8" 
            />
            <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type={showConfirm ? "text" : "password"} 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              placeholder="Re-enter password" 
              required 
            />
            <div className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                name="agreeToTerms" 
                checked={formData.agreeToTerms} 
                onChange={handleChange} 
                required 
              />
              I agree to the Terms of Service
            </label>
          </div>

          <button type="submit" className="submit-btn">Register</button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? 
            <Link to="/signin" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSignUp;