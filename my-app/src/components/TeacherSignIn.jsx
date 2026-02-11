import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, LogIn, AlertCircle } from 'lucide-react';

const TeacherSignIn = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ email: '', password: '' });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    pageContainer: { height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", backgroundColor: '#f3f4f6', overflow: 'hidden' },
    mainWrapper: { display: 'flex', width: isMobile ? '90vw' : '70vw', height: isMobile ? 'auto' : '80vh', backgroundColor: '#fff', borderRadius: isMobile ? '4vw' : '2vw', overflow: 'hidden', boxShadow: '0 2vh 6vh -1vh rgba(0, 0, 0, 0.15)', flexDirection: 'row' },
    leftPanel: { flex: 1, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', display: isMobile ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '4vw', textAlign: 'center' },
    rightPanel: { flex: 1.2, padding: isMobile ? '6vw' : '3vw 4vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff' },
    input: (hasError) => ({ width: '100%', padding: isMobile ? '1.5vh 3vw' : '1.2vh 1vw', borderRadius: isMobile ? '2vw' : '0.8vw', border: hasError ? '2px solid #ef4444' : '2px solid #e5e7eb', backgroundColor: '#fff', fontSize: isMobile ? '4vw' : '1vw', outline: 'none', color: '#111827', boxSizing: 'border-box' }),
    actionBtn: { width: '100%', padding: '1.5vh', borderRadius: '0.8vw', border: 'none', background: '#312e81', color: '#fff', fontSize: '1.1vw', fontWeight: 'bold', cursor: 'pointer', marginTop: '1vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5vw' },
    title: { fontSize: isMobile ? '6vw' : '2vw', fontWeight: '800', color: '#1f2937', marginBottom: '1vh' },
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    if(errors[e.target.name]) setErrors({...errors, [e.target.name]: null});
  };

  const handleSubmit = () => {
    if(!formData.email || !formData.password) {
      setErrors({ email: "Credentials required" });
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      if (user.role === 'teacher') {
         onLogin(user);
         navigate('/');
      } else {
         setErrors({ password: "This account is for Students. Please use Student Login." });
      }
    } else {
      setErrors({ email: "Invalid email or password" });
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainWrapper}>
        <div style={styles.leftPanel}>
          <div style={{fontSize: '3vw', marginBottom: '2vh'}}>👨‍🏫</div>
          <h1 style={{fontSize: '2.5vw', fontWeight: '800', marginBottom: '1vh'}}>Teacher Login</h1>
          <p style={{fontSize: '1.1vw', opacity: 0.9, marginBottom: '4vh'}}>Access your event management dashboard.</p>
        </div>

        <div style={styles.rightPanel}>
          <button style={{background:'none', border:'none', color:'#6b7280', fontSize:'1vw', fontWeight:'600', cursor:'pointer', display:'flex', gap:'0.5vw', marginBottom:'2vh'}} onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Home
          </button>

          <h2 style={styles.title}>Teacher Sign In</h2>
          <p style={{color:'#6b7280', marginBottom:'3vh'}}>Welcome back, Professor.</p>

          <div style={{display:'flex', flexDirection:'column', gap:'2vh'}}>
            <div>
              <label style={{fontWeight:'700', color:'#374151', fontSize:'0.9vw'}}>Email Address</label>
              <input style={styles.input(errors.email)} placeholder="sarah@college.edu" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <div style={{color:'#ef4444', fontSize:'0.8vw', marginTop:'0.5vh'}}><AlertCircle size={12}/> {errors.email}</div>}
            </div>

            <div>
              <label style={{fontWeight:'700', color:'#374151', fontSize:'0.9vw'}}>Password</label>
              <div style={{position:'relative'}}>
                 <input style={styles.input(errors.password)} placeholder="••••••" name="password" type={showPass ? "text" : "password"} value={formData.password} onChange={handleChange} />
                 <div style={{position:'absolute', right:'1vw', top:'1.2vh', cursor:'pointer', color:'#9ca3af'}} onClick={() => setShowPass(!showPass)}>
                   {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                 </div>
              </div>
              {errors.password && <div style={{color:'#ef4444', fontSize:'0.8vw', marginTop:'0.5vh'}}><AlertCircle size={12}/> {errors.password}</div>}
            </div>

            <button style={styles.actionBtn} onClick={handleSubmit}>
              Login <LogIn size={18} />
            </button>
          </div>

          <div style={{textAlign:'center', marginTop:'3vh', color:'#6b7280', fontSize:'1vw'}}>
            New here? <Link to="/teacher-signup" style={{color: '#312e81', fontWeight:'bold', textDecoration:'none'}}>Register as Teacher</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignIn;