import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  HelpCircle,
  ArrowLeft,
  Upload,
  Camera,
  Lock,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  Sun,
  Moon,
  LogOut,
  GraduationCap
} from 'lucide-react';
import './Settings.css';
import './TeacherProfile.css';

const Settings = ({ theme = 'light', setTheme, user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Form states (mock)
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane.doe@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    role: user?.role === 'teacher' ? 'Teacher' : 'Student',
    department: user?.department || 'Computer Science'
  });

  // Toggles states
  const [notifications, setNotifications] = useState({
    reminders: true,
    confirmations: true,
    announcements: false
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showEvents: false
  });

  const [language, setLanguage] = useState(localStorage.getItem('preferredLanguage') || 'en');

  // ✅ LANGUAGE TRANSLATION LOGIC
  const changeLanguage = async (langCode) => {
    setLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);

    try {
      const textNodes = [];
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let n;
      while ((n = walk.nextNode())) {
        const val = n.nodeValue.trim();
        if (
          val.length > 0 &&
          !['SCRIPT', 'STYLE', 'NOSCRIPT', 'OPTION'].includes(n.parentNode.nodeName)
        ) {
          textNodes.push(n);
        }
      }

      // If switching back to English, simply restore the original text saved in nodes
      if (langCode === 'en') {
        textNodes.forEach(node => {
          if (node.originalText !== undefined) {
            node.nodeValue = node.originalText;
          }
        });
        return;
      }

      const translateNode = async (node) => {
        try {
          if (node.originalText === undefined) {
            node.originalText = node.nodeValue;
          }
          if (!node.originalText.trim()) return;

          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${langCode}&dt=t&q=${encodeURIComponent(node.originalText)}`;
          const res = await fetch(url);
          const data = await res.json();

          if (data && data[0]) {
            node.nodeValue = data[0].map(item => item[0]).join('');
          }
        } catch (e) {
          console.error('Translation error:', e);
        }
      };

      const batchSize = 10;
      for (let i = 0; i < textNodes.length; i += batchSize) {
        const chunk = textNodes.slice(i, i + batchSize);
        await Promise.all(chunk.map(translateNode));
        await new Promise(r => setTimeout(r, 30));
      }
    } catch (err) {
      console.error('Language change failed:', err);
    }
  };

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Nav Items definition
  const navItems = [
    { id: 'profile', label: 'Profile Settings', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={18} /> },
    { id: 'theme', label: 'Theme & Appearance', icon: <Palette size={18} /> },
    { id: 'language', label: 'Language Options', icon: <Globe size={18} /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={18} /> },
  ];

  // Helper for toggle switches
  const ToggleSwitch = ({ active, onClick }) => (
    <div className={`settings-toggle ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="settings-toggle-knob"></div>
    </div>
  );

  return (
    <div className={`page-wrapper tp-full-page ${theme === 'light' ? 'light' : 'dark'}`}>
      {/* Background Glows */}
      <div className="treg-bg-glow treg-glow-purple"></div>
      <div className="treg-bg-glow treg-glow-blue"></div>

      <div className="settings-page">
        <div className="settings-header">
          <button className="settings-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="settings-title">Dashboard Settings</h1>
        </div>

        <div className="settings-layout">
          {/* Sidebar Navigation */}
          <aside className="settings-sidebar">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`settings-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </aside>

          {/* Main Content Area */}
          <main className="settings-content">

            {/* PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              !isEditingProfile ? (
                <div className="tp-container" style={{ padding: 0, margin: 0, maxWidth: '100%', minHeight: 'auto', gridTemplateColumns: 'minmax(300px, 320px) 1fr', gap: '32px' }}>
                  {/* Left Column: Profile Card */}
                  <aside className="tp-profile-card" style={{ padding: '40px 24px' }}>
                    <div className="tp-avatar-wrapper" style={{ width: '180px', height: '180px', marginBottom: '24px' }}>
                      <img
                        src={user?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                        alt={profileData.name || "Avatar"}
                        className="tp-avatar"
                      />
                    </div>
                    <h1 className="tp-name" style={{ textTransform: 'uppercase', fontSize: '32px' }}>{profileData.name}</h1>
                    <span className="tp-role-badge" style={{ textTransform: 'uppercase', marginTop: '12px', fontSize: '11px', padding: '6px 16px' }}>{profileData.role} Account</span>
                  </aside>

                  {/* Right Column: Content */}
                  <div className="tp-content-col" style={{ gap: '24px' }}>
                    {/* Academic Information */}
                    <section className="tp-card" style={{ padding: '32px' }}>
                      <h2 className="tp-section-title">
                        <GraduationCap size={22} color="var(--treg-primary)" />
                        Academic Information
                      </h2>
                      <div className="tp-info-grid" style={{ gap: '24px' }}>
                        <div className="tp-info-item">
                          <span className="tp-label">College Name</span>
                          <span className="tp-value">{user?.college || 'RJS'}</span>
                        </div>
                        <div className="tp-info-item">
                          <span className="tp-label">Department</span>
                          <span className="tp-value">{profileData.department || 'CSE'}</span>
                        </div>
                        <div className="tp-info-item">
                          <span className="tp-label">Employee ID</span>
                          <span className="tp-value">{user?.regNo || '1'}</span>
                        </div>
                      </div>
                    </section>

                    <section className="tp-settings-section">
                      <h2 className="tp-section-title">
                        <Shield size={22} color="var(--treg-primary)" />
                        Account Settings
                      </h2>
                      <div className="tp-settings-grid" style={{ gridTemplateColumns: 'minmax(280px, 1fr)' }}>
                        {/* Edit Profile */}
                        <div className="tp-action-panel tp-edit" onClick={() => setIsEditingProfile(true)}>
                          <div className="tp-icon-wrapper">
                            <User size={22} />
                          </div>
                          <div className="tp-action-text">
                            <span className="tp-action-title">Edit Profile</span>
                            <span className="tp-action-sub">Update personal info</span>
                          </div>
                          <ChevronRight size={18} color="var(--treg-text-dim)" />
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="settings-panel">
                  <div className="settings-panel-header">
                    <div className="settings-panel-icon-wrapper">
                      <User size={24} />
                    </div>
                    <h2 className="settings-panel-title">Edit Profile Details</h2>
                  </div>
                  <p className="settings-panel-desc">Update your personal information and profile appearance.</p>

                  <div className="settings-profile-header">
                    <div className="settings-avatar-wrapper">
                      <img
                        src={user?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                        alt="Profile"
                        className="settings-avatar"
                      />
                      <div className="settings-avatar-overlay">
                        <Camera size={16} />
                      </div>
                    </div>
                    <div className="settings-avatar-actions">
                      <button className="settings-upload-btn">
                        <Upload size={16} /> Upload New Picture
                      </button>
                      <button className="settings-remove-btn">Remove Picture</button>
                    </div>
                  </div>

                  <div className="settings-form-grid">
                    <div className="settings-form-group">
                      <label className="settings-label">Full Name</label>
                      <input
                        type="text"
                        className="settings-input"
                        value={profileData.name}
                        onChange={(e) => handleInputChange({ name: 'name', value: e.target.value })}
                      />
                    </div>
                    <div className="settings-form-group">
                      <label className="settings-label">Email Address</label>
                      <input
                        type="email"
                        className="settings-input"
                        value={profileData.email}
                        disabled
                      />
                    </div>
                    <div className="settings-form-group">
                      <label className="settings-label">Phone Number</label>
                      <input
                        type="tel"
                        className="settings-input"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange({ name: 'phone', value: e.target.value })}
                      />
                    </div>
                    <div className="settings-form-group">
                      <label className="settings-label">Account Type</label>
                      <input
                        type="text"
                        className="settings-input"
                        value={profileData.role}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="settings-form-group" style={{ marginBottom: '32px' }}>
                    <label className="settings-label">Password Setup</label>
                    <p className="settings-item-desc" style={{ marginBottom: '8px' }}>Ensure your account is using a long, random password to stay secure.</p>
                    <button className="settings-pwd-btn" onClick={() => navigate('/change-password')}>
                      <Lock size={16} /> Change Password
                    </button>
                  </div>

                  <div className="settings-actions">
                    <button className="settings-cancel-btn" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                    <button className="settings-save-btn" onClick={() => setIsEditingProfile(false)}>Save Changes</button>
                  </div>
                </div>
              )
            )}

            {/* NOTIFICATION SETTINGS */}
            {activeTab === 'notifications' && (
              <div className="settings-panel">
                <div className="settings-panel-header">
                  <div className="settings-panel-icon-wrapper">
                    <Bell size={24} />
                  </div>
                  <h2 className="settings-panel-title">Notification Preferences</h2>
                </div>
                <p className="settings-panel-desc">Choose what updates you want to receive and how you receive them.</p>

                <div className="settings-list">
                  <div className="settings-list-item">
                    <div className="settings-item-info">
                      <span className="settings-item-title">Event Reminders</span>
                      <span className="settings-item-desc">Get notified 24 hours before your registered events begin.</span>
                    </div>
                    <ToggleSwitch active={notifications.reminders} onClick={() => toggleNotification('reminders')} />
                  </div>

                  <div className="settings-list-item">
                    <div className="settings-item-info">
                      <span className="settings-item-title">Registration Confirmations</span>
                      <span className="settings-item-desc">Receive a notification when your event registration is approved.</span>
                    </div>
                    <ToggleSwitch active={notifications.confirmations} onClick={() => toggleNotification('confirmations')} />
                  </div>

                  <div className="settings-list-item">
                    <div className="settings-item-info">
                      <span className="settings-item-title">College Announcements</span>
                      <span className="settings-item-desc">Stay updated with general announcements from the administration.</span>
                    </div>
                    <ToggleSwitch active={notifications.announcements} onClick={() => toggleNotification('announcements')} />
                  </div>
                </div>
              </div>
            )}

            {/* PRIVACY SETTINGS */}
            {activeTab === 'privacy' && (
              <div className="settings-panel">
                <div className="settings-panel-header">
                  <div className="settings-panel-icon-wrapper">
                    <Shield size={24} />
                  </div>
                  <h2 className="settings-panel-title">Privacy & Security</h2>
                </div>
                <p className="settings-panel-desc">Control who can see your information and manage your account security.</p>

                <div className="settings-list">
                  <div className="settings-list-item">
                    <div className="settings-item-info">
                      <span className="settings-item-title">Public Profile</span>
                      <span className="settings-item-desc">Allow other students and teachers to view your basic profile information.</span>
                    </div>
                    <ToggleSwitch active={privacy.showProfile} onClick={() => togglePrivacy('showProfile')} />
                  </div>

                  <div className="settings-list-item">
                    <div className="settings-item-info">
                      <span className="settings-item-title">Display Registered Events</span>
                      <span className="settings-item-desc">Show your upcoming registered events on your public profile.</span>
                    </div>
                    <ToggleSwitch active={privacy.showEvents} onClick={() => togglePrivacy('showEvents')} />
                  </div>
                </div>
              </div>
            )}

            {/* THEME SETTINGS */}
            {activeTab === 'theme' && (
              <div className="settings-panel">
                <div className="settings-panel-header">
                  <div className="settings-panel-icon-wrapper">
                    <Palette size={24} />
                  </div>
                  <h2 className="settings-panel-title">Theme & Appearance</h2>
                </div>
                <p className="settings-panel-desc">Customize the look and feel of your dashboard experience.</p>

                <div className="settings-options-grid">
                  <div
                    className={`settings-option-card ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => {
                      if (setTheme) setTheme('light');
                    }}
                  >
                    <div className="settings-option-icon">
                      <Sun size={24} />
                    </div>
                    <span className="settings-option-label">Light Mode</span>
                  </div>

                  <div
                    className={`settings-option-card ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => {
                      if (setTheme) setTheme('dark');
                    }}
                  >
                    <div className="settings-option-icon">
                      <Moon size={24} />
                    </div>
                    <span className="settings-option-label">Dark Mode</span>
                  </div>
                </div>

                <div style={{ marginTop: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderTop: '1px solid var(--treg-glass-border)' }}>
                    <div className="settings-item-info">
                      <span className="settings-item-title">Advanced Theme Settings</span>
                      <span className="settings-item-desc">Go to the dedicated theme selection page for more options.</span>
                    </div>
                    <button className="settings-pwd-btn" onClick={() => navigate('/settings/theme')} style={{ marginTop: 0 }}>
                      Open Theme Selector
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LANGUAGE SETTINGS */}
            {activeTab === 'language' && (
              <div className="settings-panel">
                <div className="settings-panel-header">
                  <div className="settings-panel-icon-wrapper">
                    <Globe size={24} />
                  </div>
                  <h2 className="settings-panel-title">Language Options</h2>
                </div>
                <p className="settings-panel-desc">Select your preferred language for the application interface.</p>

                <div className="settings-form-group" style={{ maxWidth: '400px' }}>
                  <label className="settings-label">Display Language</label>
                  <div className="settings-select-wrapper">
                    <select
                      className="settings-select"
                      value={language}
                      onChange={(e) => changeLanguage(e.target.value)}
                    >
                      <option value="en">English (US)</option>
                      <option value="hi">Hindi (हिंदी)</option>
                      <option value="te">Telugu (తెలుగు)</option>
                      <option value="ta">Tamil (தமிழ்)</option>
                      <option value="kn">Kannada (ಕನ್ನಡ)</option>
                      <option value="ml">Malayalam (മലയാളം)</option>
                      <option value="mr">Marathi (मराठी)</option>
                      <option value="bn">Bengali (বাংলা)</option>
                      <option value="gu">Gujarati (ગુજરાતી)</option>
                      <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                      <option value="or">Odia (ଓଡ଼ିଆ)</option>
                      <option value="ur">Urdu (اردو)</option>
                      <option value="as">Assamese (অসমীয়া)</option>
                    </select>
                    <ChevronRight size={16} className="settings-select-icon" style={{ transform: 'translateY(-50%) rotate(90deg)' }} />
                  </div>
                </div>
              </div>
            )}

            {/* HELP & SUPPORT */}
            {activeTab === 'help' && (
              <div className="settings-panel">
                <div className="settings-panel-header">
                  <div className="settings-panel-icon-wrapper">
                    <HelpCircle size={24} />
                  </div>
                  <h2 className="settings-panel-title">Help & Support</h2>
                </div>
                <p className="settings-panel-desc">Get assistance with your account, report issues, or contact our support team.</p>

                <div className="settings-interactive-row" onClick={() => navigate('/help')}>
                  <div className="settings-interactive-left">
                    <div className="settings-interactive-icon">
                      <HelpCircle size={20} />
                    </div>
                    <span className="settings-interactive-label">Visit Help Center</span>
                  </div>
                  <ChevronRight size={20} className="settings-interactive-right" />
                </div>

                <div className="settings-interactive-row" onClick={() => navigate('/report-issue')}>
                  <div className="settings-interactive-left">
                    <div className="settings-interactive-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--treg-danger)' }}>
                      <AlertTriangle size={20} />
                    </div>
                    <span className="settings-interactive-label">Report an Issue</span>
                  </div>
                  <ChevronRight size={20} className="settings-interactive-right" />
                </div>

                <div className="settings-interactive-row">
                  <div className="settings-interactive-left">
                    <div className="settings-interactive-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--treg-secondary)' }}>
                      <MessageSquare size={20} />
                    </div>
                    <span className="settings-interactive-label">Contact Support</span>
                  </div>
                  <ChevronRight size={20} className="settings-interactive-right" />
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;