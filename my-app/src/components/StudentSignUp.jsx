import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';


const StudentSignUp = ({ onLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  // This state tracks if Student or Teacher is selected
  const [isStudent, setIsStudent] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  // RESPONSIVE CHECK
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    collegeName: '',
    rollNo: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  const styles = {
    // Basic Layout
    pageContainer: {
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", 
      backgroundColor: '#f3f4f6', 
      overflow: 'hidden'
    },
    mainWrapper: {
      display: 'flex', 
      width: isMobile ? '90vw' : '75vw', 
      height: isMobile ? 'auto' : '85vh', 
      minHeight: isMobile ? 'auto' : '650px',
      maxHeight: '95vh',
      backgroundColor: '#fff', 
      borderRadius: isMobile ? '4vw' : '2vw', 
      overflow: 'hidden',
      boxShadow: '0 2vh 6vh -1vh rgba(0, 0, 0, 0.15)', 
      flexDirection: 'row'
    },
    
    // Left Panel (Hidden on Mobile)
    leftPanel: {
      flex: 1, 
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      display: isMobile ? 'none' : 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#fff', 
      padding: '4vw', 
      textAlign: 'center'
    },
    glassCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      backdropFilter: 'blur(10px)', 
      borderRadius: '1.5vw',
      padding: '1.5vw', 
      border: '1px solid rgba(255, 255, 255, 0.2)', 
      marginTop: '2vh', 
      maxWidth: '22vw'
    },
    heroImage: { 
      width: '100%', 
      borderRadius: '1vw', 
      objectFit: 'cover' 
    },
    
    // Right Panel
    rightPanel: {
      flex: 1.2, 
      padding: isMobile ? '6vw' : '3vw 5vw', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      backgroundColor: '#fff', 
      position: 'relative'
    },
    header: { 
      textAlign: 'center', 
      marginBottom: '3vh' 
    },
    stepIndicator: { 
      fontSize: isMobile ? '3vw' : '0.8vw', 
      color: '#6366f1', 
      fontWeight: '600', 
      textTransform: 'uppercase', 
      letterSpacing: '1px' 
    },
    title: { 
      fontSize: isMobile ? '6vw' : '2.2vw', 
      fontWeight: '800', 
      color: '#1f2937', 
      marginTop: '0.5vh',
      marginBottom: '1vh' 
    },
    
    // Form Elements
    inputGroup: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.8vh', 
      marginBottom: '2vh' 
    },
    label: { 
      fontSize: isMobile ? '3.5vw' : '0.9vw', 
      fontWeight: '700', 
      color: '#374151', 
      marginLeft: '0.2vw' 
    },
    input: (hasError) => ({
      width: '100%', 
      padding: isMobile ? '1.5vh 3vw' : '1.2vh 1vw', 
      borderRadius: isMobile ? '2vw' : '0.8vw', 
      border: hasError ? '2px solid #ef4444' : '2px solid #e5e7eb',
      backgroundColor: '#fff', 
      fontSize: isMobile ? '4vw' : '1vw', 
      outline: 'none', 
      color: '#111827',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    }),
    
    // Split Row (Roll No & Dept)
    splitRow: {
      display: 'flex',
      gap: isMobile ? '3vw' : '1.5vw', 
      marginBottom: '2vh'
    },
    splitCol: {
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.8vh'
    },

    errorText: { 
      fontSize: isMobile ? '3vw' : '0.8vw', 
      color: '#ef4444', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5vw', 
      marginTop: '0.2vh' 
    },
    
    actionBtn: {
      width: '100%', 
      padding: isMobile ? '2vh' : '1.5vh', 
      borderRadius: isMobile ? '2vw' : '0.8vw', 
      border: 'none',
      background: '#6366f1', 
      color: '#fff', 
      fontSize: isMobile ? '4vw' : '1.1vw', 
      fontWeight: 'bold',
      cursor: 'pointer', 
      marginTop: '1vh', 
      boxShadow: '0 0.5vh 1.5vh rgba(99, 102, 241, 0.3)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '0.5vw',
      transition: 'transform 0.1s'
    },
    backBtn: {
      background: 'none', 
      border: 'none', 
      color: '#6b7280', 
      fontSize: isMobile ? '3.5vw' : '1vw', 
      fontWeight: '600',
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5vw', 
      marginBottom: '2vh',
      alignSelf: 'flex-start'
    },
    toggleContainer: {
      display: 'flex', 
      backgroundColor: '#f3f4f6', 
      borderRadius: isMobile ? '2vw' : '0.8vw', 
      padding: '0.5vh', 
      marginBottom: '3vh'
    },
    toggleBtn: (active) => ({
      flex: 1, 
      padding: isMobile ? '1.5vh' : '1vh', 
      borderRadius: isMobile ? '1.5vw' : '0.6vw', 
      border: 'none', 
      fontSize: isMobile ? '3.5vw' : '0.9vw', 
      fontWeight: '600',
      cursor: 'pointer', 
      backgroundColor: active ? '#6366f1' : 'transparent', 
      color: active ? '#fff' : '#6b7280', 
      transition: 'all 0.2s'
    }),
    
    linkText: {
      textAlign: 'center', 
      marginTop: '3vh', 
      fontSize: isMobile ? '3.5vw' : '1vw', 
      color: '#6b7280',
      paddingBottom: '1vh'
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    if(errors[e.target.name]) setErrors({...errors, [e.target.name]: null});
  };

  const validateStep1 = () => {
    let newErrors = {};
    if(!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if(!formData.email.trim()) newErrors.email = "Email is required";
    else if(!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if(!formData.collegeName.trim()) newErrors.collegeName = "College name is required";
    if(!formData.rollNo.trim()) newErrors.rollNo = isStudent ? "Roll number is required" : "Employee ID is required";
    if(!formData.department || formData.department === "Select") newErrors.department = "Please select a department";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    let newErrors = {};
    if(!formData.password) newErrors.password = "Password is required";
    else if(formData.password.length < 6) newErrors.password = "Password must be at least 6 chars";
    if(formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { 
    if(step === 1) { if(validateStep1()) setStep(2); } 
    else if (step === 2) { if(validateStep2()) setStep(3); }
  };

  const handleBack = () => { if(step > 1) setStep(step - 1); };

  // ✅ LOGIC UPDATE: Save to Local Storage and Login
 const handleSubmit = async () => {
  if (validateStep3()) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: isStudent ? "student" : "teacher",
          college: formData.collegeName,
          department: formData.department,
          regNo: formData.rollNo
        }
      );

      const userData = response.data;

      // Save logged in user with token
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", userData.token || "");

      onLogin(userData);
      navigate("/");

    } catch (error) {
      setErrors({
        email: error.response?.data?.message || "Registration failed"
      });
      setStep(1);
    }
  }
};

  
  // STEP 1: PERSONAL INFO
  const renderStep1 = () => (
    <>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Full Name</label>
        <input style={styles.input(errors.fullName)} placeholder="e.g. John Doe" name="fullName" value={formData.fullName} onChange={handleChange} autoFocus />
        {errors.fullName && <div style={styles.errorText}><AlertCircle size={isMobile ? 12 : 14}/> {errors.fullName}</div>}
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Email Address</label>
        <input style={styles.input(errors.email)} placeholder="you@example.com" name="email" type="email" value={formData.email} onChange={handleChange} />
        {errors.email && <div style={styles.errorText}><AlertCircle size={isMobile ? 12 : 14}/> {errors.email}</div>}
      </div>
      <button style={styles.actionBtn} onClick={handleNext}>Continue <ArrowRight size={isMobile ? 16 : 18} /></button>
    </>
  );

  // STEP 2: ACADEMIC INFO
  const renderStep2 = () => (
    <>
      <div style={styles.toggleContainer}>
        <button style={styles.toggleBtn(isStudent)} onClick={() => setIsStudent(true)}>Student</button>
        <button style={styles.toggleBtn(!isStudent)} onClick={() => setIsStudent(false)}>Teacher</button>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>College Name</label>
        <input style={styles.input(errors.collegeName)} placeholder="Engineering Tech Institute" name="collegeName" value={formData.collegeName} onChange={handleChange} />
        {errors.collegeName && <div style={styles.errorText}><AlertCircle size={isMobile ? 12 : 14}/> {errors.collegeName}</div>}
      </div>
      
      <div style={styles.splitRow}>
        <div style={styles.splitCol}>
          <label style={styles.label}>{isStudent ? "Roll No" : "Emp ID"}</label>
          <input style={styles.input(errors.rollNo)} placeholder={isStudent ? "ID-2024" : "EMP-01"} name="rollNo" value={formData.rollNo} onChange={handleChange} />
          {errors.rollNo && <div style={styles.errorText}><AlertCircle size={isMobile ? 12 : 14}/> {errors.rollNo}</div>}
        </div>
        
        <div style={styles.splitCol}>
          <label style={styles.label}>Dept</label>
          <select style={styles.input(errors.department)} name="department" value={formData.department} onChange={handleChange}>
            <option>Select</option>
            <option>CSE</option><option>ECE</option><option>MECH</option><option>CIVIL</option>
            <option>EEE</option><option>IT</option><option>AI & DS</option><option>MBA</option><option>MCA</option>
          </select>
          {errors.department && <div style={styles.errorText}><AlertCircle size={isMobile ? 12 : 14}/> {errors.department}</div>}
        </div>
      </div>

      <button style={styles.actionBtn} onClick={handleNext}>Continue <ArrowRight size={isMobile ? 16 : 18} /></button>
    </>
  );

  // STEP 3: SECURITY
  const renderStep3 = () => (
    <>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Password</label>
        <div style={{position:'relative'}}>
           <input style={styles.input(errors.password)} placeholder="••••••" name="password" type={showPass ? "text" : "password"} value={formData.password} onChange={handleChange} />
           <div style={{position:'absolute', right: isMobile ? '3vw' : '1vw', top: isMobile ? '1.5vh' : '1.2vh', cursor:'pointer', color:'#9ca3af'}} onClick={() => setShowPass(!showPass)}>
             {showPass ? <EyeOff size={isMobile ? 20 : 20}/> : <Eye size={isMobile ? 20 : 20}/>}
           </div>
        </div>
        {errors.password && <div style={styles.errorText}><AlertCircle size={isMobile ? 12 : 14}/> {errors.password}</div>}
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Confirm Password</label>
        <input style={styles.input(errors.confirmPassword)} placeholder="••••••" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
        {errors.confirmPassword && <div style={styles.errorText}><AlertCircle size={isMobile ? 12 : 14}/> {errors.confirmPassword}</div>}
      </div>
      <div style={{display:'flex', gap: isMobile ? '2vw' : '0.5vw', alignItems:'center', marginTop:'1vh', marginBottom:'2vh'}}>
        <input type="checkbox" style={{width: isMobile ? '4vw' : '1.2vw', height: isMobile ? '4vw' : '1.2vw', accentColor:'#6366f1'}} />
        <span style={{fontSize: isMobile ? '3vw' : '0.85vw', color:'#6b7280'}}>I agree to Terms & Privacy Policy</span>
      </div>
      <button style={{...styles.actionBtn, background:'#10b981'}} onClick={handleSubmit}>
        Complete Registration <CheckCircle size={isMobile ? 16 : 18} />
      </button>
    </>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainWrapper}>
        
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          <div style={{fontSize:'3vw', marginBottom:'1vh'}}>🚀</div>
          <h1 style={{fontSize:'2.5vw', fontWeight:'800', marginBottom:'1vh'}}>Join Us!</h1>
          <p style={{fontSize:'1.1vw', opacity:0.9, marginBottom:'3vh'}}>Create your account in 3 easy steps.</p>
          <div style={styles.glassCard}>
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80" alt="Students" style={styles.heroImage} />
          </div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          {step > 1 && (
            <button style={styles.backBtn} onClick={handleBack}>
              <ArrowLeft size={isMobile ? 16 : 14} /> Back
            </button>
          )}
          
          <div style={styles.header}>
            <div style={styles.stepIndicator}>Step {step} of 3</div>
            <h2 style={styles.title}>{step === 1 ? "Let's get started" : step === 2 ? "Academic Details" : "Set Password"}</h2>
          </div>
          
          <div style={{animation: 'fadeIn 0.3s ease-in-out'}}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>
          
          <div style={styles.linkText}>
            Already have an account? <Link to="/signin" style={{color: '#6366f1', fontWeight:'bold', textDecoration:'none'}}>Login</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentSignUp;