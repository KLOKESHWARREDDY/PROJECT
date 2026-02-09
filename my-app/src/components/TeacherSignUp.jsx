import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; 
import './Auth.css'; // Reuses your existing CSS

const TeacherSignUp = ({ onLogin }) => { 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    employeeId: '', // Teacher specific
    department: '',
    designation: '', // Teacher specific
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const departments = [
    'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Electronics', 'Business Admin', 'Science & Humanities'
  ];

  const designations = [
    'Assistant Professor', 'Associate Professor', 'Professor', 'Head of Department', 'Lab Instructor'
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

    // Create Teacher Data Object
    const userData = {
      name: formData.fullName,
      email: formData.email,
      regNo: formData.employeeId, // Mapping Employee ID to regNo for profile display
      college: "Engineering Tech Institute", 
      role: 'teacher', // Important flag
      department: formData.department,
      designation: formData.designation
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
          <h2>Create Account</h2>
          <p>Join EventSphere as a Teacher</p>
        </div>

        {/* Toggle to switch back to Student Sign Up */}
        <div className="toggle-container">
          <button className="toggle-btn" onClick={() => navigate('/signup')}>Student</button>
          <button className="toggle-btn active">Teacher</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Dr. Sarah Wilson" required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="sarah.w@college.edu" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Employee ID</label>
              <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="EMP-1001" required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select name="department" value={formData.department} onChange={handleChange} required style={{ padding: '10px' }}>
                <option value="" disabled>Select Dept</option>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Designation</label>
            <select name="designation" value={formData.designation} onChange={handleChange} required style={{ padding: '10px' }}>
              <option value="" disabled>Select Designation</option>
              {designations.map(desig => <option key={desig} value={desig}>{desig}</option>)}
            </select>
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
          
          <button type="submit" className="submit-btn">Register as Teacher</button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/signin" className="auth-link">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignUp;