import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password Updated Successfully!");
    navigate('/profile');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h2 style={styles.headerTitle}>Change Password</h2>
        <div style={{ width: 24 }}></div>
      </header>

      <form style={styles.form} onSubmit={handleUpdate}>
        <div style={styles.group}>
          <label style={styles.label}>Current Password</label>
          <input 
            type="password" 
            placeholder="Enter current password" 
            style={styles.input} 
            value={passwords.current}
            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
            required
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>New Password</label>
          <input 
            type="password" 
            placeholder="Enter new password" 
            style={styles.input} 
            value={passwords.new}
            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
            required
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Confirm New Password</label>
          <input 
            type="password" 
            placeholder="Re-enter new password" 
            style={styles.input} 
            value={passwords.confirm}
            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
            required
          />
        </div>

        <button type="submit" style={styles.updateBtn}>Update Password</button>
        <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>Cancel</button>
      </form>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #f1f5f9' },
  headerTitle: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
  form: { padding: '24px' },
  group: { marginBottom: '20px' },
  label: { fontSize: '12px', color: '#94a3b8', marginBottom: '8px', display: 'block', fontWeight: '500' },
  input: { 
    width: '100%', 
    padding: '14px 16px', 
    borderRadius: '12px', 
    border: '1px solid #f1f5f9', 
    backgroundColor: '#f8fafc', 
    boxSizing: 'border-box', 
    outline: 'none'
  },
  updateBtn: { 
    width: '100%', 
    padding: '14px', 
    backgroundColor: '#5c5cfc', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    marginTop: '20px', 
    cursor: 'pointer'
  },
  cancelBtn: { 
    width: '100%', 
    padding: '14px', 
    backgroundColor: 'transparent', 
    color: '#94a3b8', 
    border: 'none', 
    fontWeight: '600', 
    cursor: 'pointer',
    marginTop: '10px' 
  }
};

export default ChangePassword;