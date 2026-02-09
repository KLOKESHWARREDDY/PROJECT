import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft } from 'lucide-react';

const EditProfile = ({ user, setUser, theme }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isDark = theme === 'dark';

  // Local state for editing
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [previewImage, setPreviewImage] = useState(user.profileImage);

  // Cross-Platform Image Handler
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a URL that works in browser memory (Web & Mobile)
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const triggerFileInput = () => {
    // Triggers native Android Gallery or Desktop File Explorer
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = () => {
    // --- THIS IS THE CRITICAL FIX ---
    // We update the GLOBAL user state with the new image
    setUser({ 
      ...user, 
      name: name,
      email: email,
      profileImage: previewImage 
    });
    navigate('/profile');
  };

  const styles = {
    container: { backgroundColor: isDark ? '#0f172a' : '#f8fafc', minHeight: '100%', fontFamily: 'sans-serif', padding: '20px', display: 'flex', flexDirection: 'column' },
    header: { display: 'flex', alignItems: 'center', marginBottom: '30px' },
    backIcon: { cursor: 'pointer', marginRight: '15px', color: '#1e293b' },
    headerTitle: { fontSize: '20px', fontWeight: 'bold', color: '#1e293b' },
    
    imageSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' },
    imageWrapper: { position: 'relative', width: '100px', height: '100px', marginBottom: '10px', cursor: 'pointer' },
    profileImg: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
    cameraIcon: { position: 'absolute', bottom: '0', right: '0', backgroundColor: '#5c5cfc', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '2px solid #fff' },
    changePhotoText: { color: '#5c5cfc', fontWeight: '600', fontSize: '14px', cursor: 'pointer', userSelect: 'none' },
    
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#64748b' },
    input: { width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '15px', color: '#1e293b', outline: 'none', boxSizing: 'border-box' },
    
    saveBtn: { width: '100%', backgroundColor: '#5c5cfc', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 15px rgba(92, 92, 252, 0.3)' },
    cancelBtn: { width: '100%', backgroundColor: 'transparent', color: '#94a3b8', padding: '16px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '5px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <ArrowLeft style={styles.backIcon} onClick={() => navigate(-1)} />
        <span style={styles.headerTitle}>Edit Profile</span>
      </div>

      <div style={styles.imageSection}>
        {/* Hidden Native Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />
        <div style={styles.imageWrapper} onClick={triggerFileInput}>
          <img src={previewImage} alt="Profile" style={styles.profileImg} />
          <div style={styles.cameraIcon}><Camera size={16} /></div>
        </div>
        <div style={styles.changePhotoText} onClick={triggerFileInput}>Change Profile Photo</div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Full Name</label>
        <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>College Name</label>
        <input style={styles.input} value={user.college} disabled />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Register Number</label>
        <input style={styles.input} value={user.regNo} disabled />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Email Address</label>
        <input style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      </div>

      <button style={styles.saveBtn} onClick={handleSave}>Save Changes</button>
      <button style={styles.cancelBtn} onClick={() => navigate('/profile')}>Cancel</button>
    </div>
  );
};

export default EditProfile;