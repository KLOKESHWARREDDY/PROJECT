import React from 'react';

const languages = [
  { code: 'English', name: 'English', flag: '🇺🇸' },
  { code: 'Hindi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'Spanish', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'French', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'German', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'Chinese', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'Japanese', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'Korean', name: '한국어 (Korean)', flag: '🇰🇷' },
];

const LanguageSelection = ({ currentLanguage, setLanguage, theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="settings-container" style={{ 
      backgroundColor: isDark ? '#0f172a' : '#EFF6FF',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h2 style={{ 
        color: isDark ? '#f1f5f9' : '#1e293b',
        marginBottom: '24px'
      }}>
        Select Language / भाषा चुनें
      </h2>
      
      <div className="settings-list">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={`settings-item ${currentLanguage === lang.code ? 'active' : ''}`}
            onClick={() => setLanguage(lang.code)}
            style={{
              backgroundColor: currentLanguage === lang.code 
                ? (isDark ? '#1e293b' : '#EFF6FF') 
                : (isDark ? '#1e293b' : '#fff'),
              border: currentLanguage === lang.code 
                ? '2px solid #2563EB' 
                : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '24px', marginRight: '12px' }}>{lang.flag}</span>
            <span style={{ 
              color: isDark ? '#f1f5f9' : '#1e293b',
              fontWeight: currentLanguage === lang.code ? '600' : '400'
            }}>
              {lang.name}
            </span>
            {currentLanguage === lang.code && (
              <span style={{ 
                marginLeft: 'auto', 
                color: '#2563EB',
                fontSize: '20px'
              }}>
                ✓
              </span>
            )}
          </div>
        ))}
      </div>
      
      <p style={{ 
        color: isDark ? '#94a3b8' : '#64748b',
        marginTop: '24px',
        textAlign: 'center'
      }}>
        More languages coming soon!
      </p>
    </div>
  );
};

export default LanguageSelection;
