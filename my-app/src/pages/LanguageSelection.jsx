import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import './Settings.css';

const languages = [
  { code: 'English', name: 'English', flag: '🇺🇸' },
  { code: 'Hindi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'Spanish', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'French', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'German', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'Chinese', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'Japanese', name: '日本語 (Japanese)', flag: '🇯🇵' }
];

const LanguageSelection = ({ currentLanguage, setLanguage, theme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [showToast, setShowToast] = useState(false);

  const handleSelect = (code) => {
    setLanguage(code);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''} settings-page`}>
      <header className="settings-header">
        <button className="settings-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="settings-title">Select Language</h2>
      </header>

      <div className="settings-main">
        <div className="settings-card">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`settings-option ${currentLanguage === lang.code ? 'active' : ''}`}
              onClick={() => handleSelect(lang.code)}
            >
              <div className="settings-option-left">
                <span style={{ fontSize: '24px' }}>{lang.flag}</span>
                <span className="settings-option-name">{lang.name}</span>
              </div>
              {currentLanguage === lang.code && (
                <Check className="settings-check" size={20} />
              )}
            </div>
          ))}
        </div>

        <p style={{
          color: isDark ? '#94a3b8' : '#64748b',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          More languages coming soon!
        </p>
      </div>

      {showToast && (
        <div className="settings-toast">
          <Check size={18} /> Language updated
        </div>
      )}
    </div>
  );
};

export default LanguageSelection;
