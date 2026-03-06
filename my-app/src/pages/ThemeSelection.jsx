import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import './ThemeSelection.css';

const THEMES = [
  {
    id: 'light',
    name: 'Default Light',
    primary: '#8b5cf6',
    bg: '#f8fafc',
    card: '#ffffff'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    primary: '#818cf8',
    bg: '#0f172a',
    card: '#1e293b'
  },
  {
    id: 'purple-gradient',
    name: 'Purple Gradient',
    primary: '#d946ef',
    bg: '#1e1b4b',
    card: '#4c1d95'
  },
  {
    id: 'blue-ocean',
    name: 'Blue Ocean',
    primary: '#0ea5e9',
    bg: '#082f49',
    card: '#0c4a6e'
  },
  {
    id: 'midnight-dark',
    name: 'Midnight Dark',
    primary: '#fafafa',
    bg: '#000000',
    card: '#18181b'
  },
  {
    id: 'emerald-dark',
    name: 'Emerald Dark',
    primary: '#10b981',
    bg: '#064e3b',
    card: '#065f46'
  },
  {
    id: 'sunset-light',
    name: 'Sunset Glow',
    primary: '#f97316',
    bg: '#fff7ed',
    card: '#ffedd5'
  },
  {
    id: 'cherry-dark',
    name: 'Cherry Red',
    primary: '#f43f5e',
    bg: '#4c0519',
    card: '#881337'
  },
  {
    id: 'slate-minimal',
    name: 'Slate Minimal',
    primary: '#94a3b8',
    bg: '#0f172a',
    card: '#1e293b'
  },
  {
    id: 'sakura-light',
    name: 'Sakura Pink',
    primary: '#ec4899',
    bg: '#fdf2f8',
    card: '#fce7f3'
  }
];

const ThemeSelection = ({ currentTheme, setTheme }) => {
  const navigate = useNavigate();
  const [tempTheme, setTempTheme] = useState(currentTheme);
  const [showToast, setShowToast] = useState(false);
  const isDark = ['dark', 'purple-gradient', 'blue-ocean', 'midnight-dark', 'emerald-dark', 'cherry-dark', 'slate-minimal'].includes(currentTheme);

  const handleApply = () => {
    setTheme(tempTheme); // Changes theme globally
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className={`theme-selection-page ${currentTheme}`} style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background Glows */}
      <div className="treg-bg-glow treg-glow-primary"></div>
      <div className="treg-bg-glow treg-glow-secondary"></div>

      <header className="theme-header">
        <button className="theme-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="theme-title">Theme Selector</h2>
          <p className="theme-subtitle" style={{ color: 'var(--treg-text-muted)', marginTop: '4px' }}>
            Choose your preferred dashboard theme.
          </p>
        </div>
      </header>

      {/* Selection Area */}
      <div className="theme-cards-container">
        {THEMES.map((themeOption) => (
          <div
            key={themeOption.id}
            className={`theme-card ${tempTheme === themeOption.id ? 'active' : ''}`}
            onClick={() => setTempTheme(themeOption.id)}
            style={{
              backgroundColor: 'var(--treg-card-bg)',
              borderColor: tempTheme === themeOption.id ? 'var(--treg-primary)' : 'var(--treg-glass-border)'
            }}
          >
            <div className="theme-card-content">
              {/* Preview Bubble */}
              <div
                className="theme-preview-bubble"
                style={{
                  background: `linear-gradient(135deg, ${themeOption.bg} 0%, ${themeOption.card} 100%)`,
                  border: `2px solid ${themeOption.primary}`
                }}
              >
                <div
                  className="theme-preview-accent"
                  style={{ backgroundColor: themeOption.primary }}
                ></div>
              </div>
              <span className="theme-card-label" style={{ color: 'var(--treg-text-main)' }}>
                {themeOption.name}
              </span>
            </div>
            <div className="theme-card-radio"></div>
          </div>
        ))}
      </div>

      <button className="theme-apply-btn" onClick={handleApply}>
        Apply Theme
      </button>

      {/* Modern Toast Notification */}
      <div className={`theme-toast ${showToast ? 'visible' : ''}`}>
        <CheckCircle2 size={24} color="#10b981" />
        <span>Theme successfully updated!</span>
      </div>
    </div>
  );
};

export default ThemeSelection;