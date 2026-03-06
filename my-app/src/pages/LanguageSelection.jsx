import React from 'react';

const languages = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو (Urdu)', flag: '🇮🇳' },
  { code: 'as', name: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
];

const LanguageSelection = ({ currentLanguage, setLanguage, theme }) => {
  const isDark = ['dark', 'purple-gradient', 'blue-ocean', 'midnight-dark', 'emerald-dark', 'cherry-dark', 'slate-minimal'].includes(theme);

  return (
    <div className="settings-container" style={{
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h2 style={{
        color: 'var(--text-primary)',
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
                ? 'var(--treg-glass-bg)'
                : 'var(--treg-card-bg)',
              border: currentLanguage === lang.code
                ? '2px solid var(--treg-primary)'
                : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--treg-shadow)'
            }}
          >
            <span style={{ fontSize: '24px', marginRight: '12px' }}>{lang.flag}</span>
            <span style={{
              color: 'var(--text-primary)',
              fontWeight: currentLanguage === lang.code ? '600' : '400'
            }}>
              {lang.name}
            </span>
            {currentLanguage === lang.code && (
              <span style={{
                marginLeft: 'auto',
                color: 'var(--treg-primary)',
                fontSize: '20px'
              }}>
                ✓
              </span>
            )}
          </div>
        ))}
      </div>

      <p style={{
        color: 'var(--text-muted)',
        marginTop: '24px',
        textAlign: 'center'
      }}>
        More languages coming soon!
      </p>
    </div>
  );
};

export default LanguageSelection;
