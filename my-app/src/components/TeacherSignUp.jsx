import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '../api';
import './Auth.css';

const DEPTS = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'Management', 'MBA', 'MCA'];

const TeacherSignUp = ({ onLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', email: '', collegeName: '', empId: '', department: '', password: '', confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
    else if (!formData.email.endsWith('@gmail.com')) errs.email = 'Only Gmail accounts are allowed';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.collegeName.trim()) errs.collegeName = 'College name is required';
    if (!formData.empId.trim()) errs.empId = 'Employee ID is required';
    if (!formData.department || formData.department === 'Select') errs.department = 'Select Department';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) errs.agreeTerms = 'Please accept the Terms & Privacy Policy';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setSubmitting(true);
    try {
      const res = await authAPI.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'teacher',
        college: formData.collegeName,
        department: formData.department,
        regNo: formData.empId,
      });
      const userData = res.data;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', userData.token || '');
      onLogin(userData);
      navigate('/');
    } catch (err) {
      setErrors({ email: err.response?.data?.message || 'Registration failed' });
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  const StepDots = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
      {[1, 2, 3].map(n => (
        <div key={n} style={{
          width: n === step ? 20 : 8, height: 8, borderRadius: 4,
          background: n <= step ? '#7c3aed' : '#e2e8f0',
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  );

  const stepTitles = ['Teacher Info', 'Professional Details', 'Secure Account'];

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LEFT PANEL */}
        <div className="auth-left" style={{ background: 'linear-gradient(150deg, #1e1b4b 0%, #7c3aed 100%)' }}>
          <div className="auth-left-blob1" />
          <div className="auth-left-blob2" />
          <div className="auth-left-emoji">🎓</div>
          <h2>Teacher Portal</h2>
          <p>Manage events, track student registrations, and make an impact.</p>
          <div className="auth-left-img-wrap">
            <img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400&q=80" alt="Teacher" />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          {step > 1 ? (
            <button className="auth-back-btn" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={15} /> Back
            </button>
          ) : (
            <button className="auth-back-btn" onClick={() => navigate('/')}>
              <ArrowLeft size={15} /> Home
            </button>
          )}

          <div className="auth-header">
            <h2>{stepTitles[step - 1]}</h2>
            <p>Step {step} of 3</p>
          </div>
          <StepDots />

          {/* STEP 1 */}
          {step === 1 && (
            <div className="auth-form">
              {errors.email && (
                <div className="auth-error-box"><AlertCircle size={15} />{errors.email}</div>
              )}
              <div className="auth-field">
                <label>Full Name</label>
                <input className={`auth-input${errors.fullName ? ' error' : ''}`}
                  name="fullName" placeholder="e.g. Dr. Sarah Smith"
                  value={formData.fullName} onChange={handleChange} autoFocus />
                {errors.fullName && <div className="auth-error-text"><AlertCircle size={12} />{errors.fullName}</div>}
              </div>
              <div className="auth-field">
                <label>Official Gmail</label>
                <input className={`auth-input${errors.email ? ' error' : ''}`}
                  name="email" type="email" placeholder="teacher@gmail.com"
                  value={formData.email} onChange={handleChange} />
                {errors.email && <div className="auth-error-text"><AlertCircle size={12} />{errors.email}</div>}
              </div>
              <button className="auth-submit-btn" onClick={handleNext}
                style={{ background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)' }}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="auth-form">
              <div className="auth-field">
                <label>College / Institution</label>
                <input className={`auth-input${errors.collegeName ? ' error' : ''}`}
                  name="collegeName" placeholder="e.g. Engineering Tech Institute"
                  value={formData.collegeName} onChange={handleChange} />
                {errors.collegeName && <div className="auth-error-text"><AlertCircle size={12} />{errors.collegeName}</div>}
              </div>
              <div className="auth-row">
                <div className="auth-field">
                  <label>Employee ID</label>
                  <input className={`auth-input${errors.empId ? ' error' : ''}`}
                    name="empId" placeholder="EMP-001"
                    value={formData.empId} onChange={handleChange} />
                  {errors.empId && <div className="auth-error-text"><AlertCircle size={12} />{errors.empId}</div>}
                </div>
                <div className="auth-field">
                  <label>Department</label>
                  <select className={`auth-select${errors.department ? ' error' : ''}`}
                    name="department" value={formData.department} onChange={handleChange}>
                    <option value="">Select</option>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  {errors.department && <div className="auth-error-text"><AlertCircle size={12} />{errors.department}</div>}
                </div>
              </div>
              <button className="auth-submit-btn" onClick={handleNext}
                style={{ background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)' }}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="auth-form">
              <div className="auth-field">
                <label>Password</label>
                <div className="auth-input-wrap">
                  <input className={`auth-input has-icon${errors.password ? ' error' : ''}`}
                    name="password" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
                    value={formData.password} onChange={handleChange} />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <div className="auth-error-text"><AlertCircle size={12} />{errors.password}</div>}
              </div>
              <div className="auth-field">
                <label>Confirm Password</label>
                <input className={`auth-input${errors.confirmPassword ? ' error' : ''}`}
                  name="confirmPassword" type="password" placeholder="Re-enter password"
                  value={formData.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <div className="auth-error-text"><AlertCircle size={12} />{errors.confirmPassword}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <input type="checkbox" checked={agreeTerms}
                  onChange={e => { setAgreeTerms(e.target.checked); if (e.target.checked) setErrors(p => ({ ...p, agreeTerms: null })); }}
                  style={{ accentColor: '#7c3aed', width: 16, height: 16 }} />
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>I agree to Terms &amp; Privacy Policy</span>
              </div>
              {errors.agreeTerms && <div className="auth-error-text" style={{ marginBottom: 12 }}><AlertCircle size={12} />{errors.agreeTerms}</div>}
              <button className="auth-submit-btn" onClick={handleSubmit} disabled={submitting}
                style={{ background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #1e1b4b, #7c3aed)' }}>
                {submitting ? 'Creating Account…' : <><CheckCircle size={17} /> Complete Registration</>}
              </button>
            </div>
          )}

          <div className="auth-bottom-link">
            Already registered? <Link to="/signin">Login here</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherSignUp;