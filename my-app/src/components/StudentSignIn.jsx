import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, LogIn, AlertCircle } from 'lucide-react';

const StudentSignIn = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isStudent, setIsStudent] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  // Responsive Check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const styles = {
    // Page & Card Layout
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
      width: isMobile ? '90vw' : '70vw', 
      height: isMobile ? 'auto' : '80vh', 
      minHeight: isMobile ? 'auto' : '600px', 
      maxHeight: '95vh',
      backgroundColor: '#fff', 
      borderRadius: isMobile ? '4vw' : '2vw', 
      overflow: 'hidden',
      boxShadow: '0 2vh 6vh -1vh rgba(0, 0, 0, 0.15)', 
      flexDirection: 'row'
    },

    // Left Panel (Purple - Hidden on Mobile)
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
      maxWidth: '20vw'
    },
    heroImage: { 
      width: '100%', 
      borderRadius: '1vw', 
      objectFit: 'cover' 
    },

    // Right Panel (White Form)
    rightPanel: {
      flex: 1.2, 
      padding: isMobile ? '6vw' : '3vw 4vw', 
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
    title: { 
      fontSize: isMobile ? '6vw' : '2vw', 
      fontWeight: '800', 
      color: '#1f2937', 
      marginBottom: '1vh' 
    },
    subtitle: { 
      fontSize: isMobile ? '3.5vw' : '1vw', 
      color: '#6b7280' 
    },

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
    
    errorText: { 
      fontSize: isMobile ? '3vw' : '0.8vw', 
      color: '#ef4444', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5vw', 
      marginTop: '0.5vh' 
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

    forgotPass: { 
      textAlign: 'right', 
      fontSize: isMobile ? '3vw' : '0.9vw', 
      color: '#6366f1', 
      fontWeight: '600', 
      cursor: 'pointer', 
      marginTop: '-1vh', 
      marginBottom: '2vh' 
    },
    
    bottomLink: {
      textAlign: 'center', 
      marginTop: '3vh', 
      fontSize: isMobile ? '3.5vw' : '1vw', 
      color: '#6b7280',
      paddingBottom: '1vh'
    },
    
    iconBox: {
      position: 'absolute', 
      right: isMobile ? '3vw' : '1vw', 
      top: isMobile ? '2vh' : '1.5vh', 
      cursor: 'pointer', 
      color: '#9ca3af',
      display: 'flex', 
      alignItems: 'center'
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    if(errors[e.target.name]) setErrors({...errors, [e.target.name]: null});
  };
  
  const validate = () => {
    let newErrors = {};
    if(!formData.email.trim()) newErrors.email = "Email is required";
    if(!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ UPDATED HANDLESUBMIT TO CHECK LOCALSTORAGE
  const handleSubmit = () => {
    if(validate()) {
      
      // 1. Get users from Local Storage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // 2. Find user
      const user = existingUsers.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      // 3. Check Credentials & Role
      const selectedRole = isStudent ? 'student' : 'teacher';

      if (user) {
        if (user.role === selectedRole) {
           // Success!
           onLogin(user);
           navigate('/');
        } else {
           // Wrong Role
           setErrors({ 
             password: `Incorrect role. This email is registered as a ${user.role}.` 
           });
        }
      } else {
        // Invalid details
        setErrors({ 
          email: "Invalid email or password" 
        });
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainWrapper}>
        
        {/* LEFT PANEL */}
        <div style={styles.leftPanel}>
          <div style={{fontSize: '3vw', marginBottom: '2vh'}}>👋</div>
          <h1 style={{fontSize: '2.5vw', fontWeight: '800', marginBottom: '1vh'}}>Welcome Back!</h1>
          <p style={{fontSize: '1.1vw', opacity: 0.9, marginBottom: '4vh', maxWidth: '20vw'}}>
            Log in to access your event dashboard, tickets, and certificates.
          </p>
          <div style={styles.glassCard}>
            <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80" alt="Login Illustration" style={styles.heroImage} />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.rightPanel}>
          
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={isMobile ? 20 : 16} /> Home
          </button>

          <div style={styles.header}>
            <h2 style={styles.title}>Login Account</h2>
            <p style={styles.subtitle}>Please sign in to continue</p>
          </div>

          <div style={styles.toggleContainer}>
            <button style={styles.toggleBtn(isStudent)} onClick={() => setIsStudent(true)}>Student</button>
            <button style={styles.toggleBtn(!isStudent)} onClick={() => setIsStudent(false)}>Teacher</button>
          </div>

          {/* FORM */}
          <div style={{animation: 'fadeIn 0.3s ease-in-out'}}>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                style={styles.input(errors.email)} 
                placeholder="you@example.com" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                autoFocus
              />
              {errors.email && <div style={styles.errorText}><AlertCircle size={isMobile ? 14 : 12}/> {errors.email}</div>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={{position:'relative'}}>
                 <input 
                   style={styles.input(errors.password)} 
                   placeholder="••••••" 
                   name="password" 
                   type={showPass ? "text" : "password"} 
                   value={formData.password} 
                   onChange={handleChange} 
                 />
                 <div style={styles.iconBox} onClick={() => setShowPass(!showPass)}>
                   {showPass ? <EyeOff size={isMobile ? 20 : 18}/> : <Eye size={isMobile ? 20 : 18}/>}
                 </div>
              </div>
              {errors.password && <div style={styles.errorText}><AlertCircle size={isMobile ? 14 : 12}/> {errors.password}</div>}
            </div>

            <div style={styles.forgotPass}>Forgot Password?</div>

            <button 
              style={styles.actionBtn} 
              onClick={handleSubmit}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Login <LogIn size={isMobile ? 20 : 18} />
            </button>
          </div>

          {/* DYNAMIC REGISTRATION LINK */}
          <div style={styles.bottomLink}>
            Don't have an account?{' '}
            <Link 
              to={isStudent ? "/signup" : "/teacher-signup"} 
              style={{color: '#6366f1', fontWeight:'bold', textDecoration:'none'}}
            >
              Register {isStudent ? 'as Student' : 'as Teacher'}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentSignIn;