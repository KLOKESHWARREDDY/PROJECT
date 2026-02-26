import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, CheckCircle } from 'lucide-react';
import './Settings.css';

const ThemeSelection = ({ currentTheme, setTheme, theme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [tempTheme, setTempTheme] = useState(currentTheme);
  const [showToast, setShowToast] = useState(false);

  const handleApply = () => {
    setTheme(tempTheme);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''} settings-page`}>
      <header className="settings-header">
        <button className="settings-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="settings-title">App Theme</h2>
      </header>

      <div className="settings-main">
        <div className="settings-card">
          {['light', 'dark'].map(mode => (
            <div
              key={mode}
              className={`settings-option ${tempTheme === mode ? 'active' : ''}`}
              onClick={() => setTempTheme(mode)}
            >
              <div className="settings-option-left">
                <div className="settings-option-icon">
                  {mode === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <span className="settings-option-name">{mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</span>
              </div>
              <div className="settings-radio">
                <div className="settings-radio-inner" />
              </div>
            </div>
          ))}
        </div>

        <button className="settings-btn" onClick={handleApply}>
          Apply Theme
        </button>
      </div>

      {showToast && (
        <div className="settings-toast">
          <CheckCircle size={18} /> Theme updated
        </div>
      )}
    </div>
  );
};

export default ThemeSelection;