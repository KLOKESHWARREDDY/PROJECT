import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save } from 'lucide-react';

const EditProfile = ({ user, setUser, theme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  // 1. REF FOR HIDDEN FILE INPUT
  const fileInputRef = useRef(null); 

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Local state for editing
  const [formData, setFormData] = useState({
    name: user.name || "",
    college: user.college || "",
    regNo: user.regNo || "",
    email: user.email || "",
    profileImage: user.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
  });

  // Handle Text Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. TRIGGER FILE PICKER
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // 3. HANDLE FILE SELECTION
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update local state with new image preview
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes to global user state
  const handleSave = () => {
    setUser({ ...user, ...formData });
    navigate('/profile');
  };

  const styles = {
    container: {
      padding: isMobile ? '4vw' : '2vw',
      maxWidth: isMobile ? '100vw' : '50vw',
      margin: '0 auto',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      color: isDark ? '#fff' : '#1e293b'
    },
    header: { display: 'flex', alignItems: 'center', gap: '2vw', marginBottom: '4vh' },
    backBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: isDark ? '#fff' : '#64748b', display: 'flex', alignItems: 'center'
    },
    pageTitle: { fontSize: isMobile ? '6vw' : '2vw', fontWeight: '800' },

    // Avatar Section
    avatarContainer: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4vh',
      position: 'relative'
    },
    avatarWrapper: {
      position: 'relative', width: isMobile ? '25vw' : '8vw', height: isMobile ? '25vw' : '8vw',
    },
    avatar: {
      width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
      border: `4px solid ${isDark ? '#1e293b' : '#fff'}`,
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    cameraBtn: {
      position: 'absolute', bottom: '0', right: '0',
      backgroundColor: '#4f46e5', color: '#fff',
      width: isMobile ? '8vw' : '2.5vw', height: isMobile ? '8vw' : '2.5vw',
      borderRadius: '50%', border: `3px solid ${isDark ? '#0f172a' : '#fff'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    changeText: {
      marginTop: '1vh', color: '#4f46e5', fontWeight: '600', fontSize: isMobile ? '3.5vw' : '0.9vw', cursor: 'pointer'
    },

    // Form
    form: { display: 'flex', flexDirection: 'column', gap: '2.5vh' },
    label: { 
      fontSize: isMobile ? '3.5vw' : '0.9vw', fontWeight: '600', marginBottom: '0.8vh', 
      color: isDark ? '#cbd5e1' : '#475569' 
    },
    input: {
      width: '100%', padding: isMobile ? '1.5vh 3vw' : '1.2vh 1vw',
      borderRadius: isMobile ? '2vw' : '0.6vw',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      color: isDark ? '#fff' : '#1e293b',
      fontSize: isMobile ? '4vw' : '1vw',
      outline: 'none', transition: 'border-color 0.2s'
    },
    saveBtn: {
      marginTop: '3vh', width: '100%', padding: isMobile ? '2vh' : '1.5vh',
      backgroundColor: '#4f46e5', color: '#fff',
      border: 'none', borderRadius: isMobile ? '2vw' : '0.8vw',
      fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5vw',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={isMobile ? 24 : 24} />
        </button>
        <h1 style={styles.pageTitle}>Edit Profile</h1>
      </div>

      {/* Avatar Upload */}
      <div style={styles.avatarContainer}>
        <div style={styles.avatarWrapper}>
          <img src={formData.profileImage} alt="Profile" style={styles.avatar} />
          
          {/* ✅ CLICKABLE CAMERA BUTTON */}
          <div style={styles.cameraBtn} onClick={handleImageClick}>
            <Camera size={isMobile ? 16 : 18} />
          </div>
        </div>
        
        {/* Clickable Text */}
        <span style={styles.changeText} onClick={handleImageClick}>Change Profile Photo</span>

        {/* ✅ HIDDEN INPUT */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {/* Form Fields */}
      <div style={styles.form}>
        <div>
          <label style={styles.label}>Full Name</label>
          <input 
            style={styles.input} 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
          />
        </div>

        <div>
          <label style={styles.label}>College Name</label>
          <input 
            style={styles.input} 
            name="college" 
            value={formData.college} 
            onChange={handleChange} 
          />
        </div>

        <div>
          <label style={styles.label}>Register Number / ID</label>
          <input 
            style={styles.input} 
            name="regNo" 
            value={formData.regNo} 
            onChange={handleChange} 
          />
        </div>

        <div>
          <label style={styles.label}>Email Address</label>
          <input 
            style={styles.input} 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
          />
        </div>

        <button style={styles.saveBtn} onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;