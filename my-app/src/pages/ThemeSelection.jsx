import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react'; 

const ThemeSelection = ({ currentTheme, setTheme }) => {
  const navigate = useNavigate();
  const [tempTheme, setTempTheme] = useState(currentTheme);
  const [showToast, setShowToast] = useState(false);

  const handleApply = () => {
    setTheme(tempTheme); // Changes theme globally
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div style={{ padding: '16px', backgroundColor: tempTheme === 'dark' ? '#0f172a' : '#f8fafc', minHeight: '100vh', color: tempTheme === 'dark' ? '#fff' : '#1e293b' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h2 style={{ marginLeft: '16px', fontSize: '18px', fontWeight: 'bold' }}>App Theme</h2>
      </header>
      
      {/* Selection Area */}
      <div style={{ backgroundColor: tempTheme === 'dark' ? '#1e293b' : '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        {['light', 'dark'].map(mode => (
          <div key={mode} onClick={() => setTempTheme(mode)} style={{ display: 'flex', padding: '16px', alignItems: 'center', cursor: 'pointer' }}>
            {mode === 'light' ? <Sun color="#5c5cfc" /> : <Moon color="#5c5cfc" />}
            <span style={{ flex: 1, marginLeft: '12px', fontWeight: 'bold' }}>{mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</span>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #5c5cfc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {tempTheme === mode && <div style={{ width: '10px', height: '10px', backgroundColor: '#5c5cfc', borderRadius: '50%' }} />}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleApply} style={{ width: '100%', backgroundColor: '#5c5cfc', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', marginTop: '40px' }}>
        Apply Theme
      </button>

      {showToast && (
        <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#dcfce7', color: '#166534', padding: '8px 24px', borderRadius: '20px' }}>
          ✓ Theme updated
        </div>
      )}
    </div>
  );
};

export default ThemeSelection;