import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

const LanguageSelection = ({ currentLanguage, setLanguage, theme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const languages = [
    { id: 'en', name: 'English', native: 'English' },
    { id: 'te', name: 'Telugu', native: 'తెలుగు' },
    { id: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { id: 'ml', name: 'Malayalam', native: 'മലയാളം' }
  ];

  const handleSelect = (langName) => {
    setLanguage(langName);
    // Optional: Go back automatically after selection
    // navigate(-1); 
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: isDark ? '#0f172a' : '#fff',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '30px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#1e293b',
      margin: 0
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    langItem: (isSelected) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderRadius: '16px',
      backgroundColor: isSelected 
        ? (isDark ? 'rgba(37, 99, 235, 0.2)' : '#eff6ff') // Active color
        : (isDark ? '#1e293b' : '#f8fafc'), // Inactive color
      border: isSelected 
        ? '2px solid #2563eb' 
        : (isDark ? '1px solid #334155' : '1px solid #e2e8f0'),
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }),
    langName: {
      fontWeight: 'bold',
      fontSize: '16px',
      color: isDark ? '#fff' : '#1e293b'
    },
    nativeName: {
      fontSize: '14px',
      color: '#64748b',
      marginTop: '2px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <ArrowLeft 
          size={24} 
          onClick={() => navigate(-1)} 
          style={{ cursor: 'pointer', color: isDark ? '#fff' : '#1e293b' }} 
        />
        <h2 style={styles.title}>Select Language</h2>
      </div>

      <div style={styles.list}>
        {languages.map((lang) => {
          const isSelected = currentLanguage === lang.name;
          return (
            <div 
              key={lang.id} 
              style={styles.langItem(isSelected)}
              onClick={() => handleSelect(lang.name)}
            >
              <div>
                <div style={styles.langName}>{lang.name}</div>
                <div style={styles.nativeName}>{lang.native}</div>
              </div>
              {isSelected && <Check size={20} color="#2563eb" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelection;