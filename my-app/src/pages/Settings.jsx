import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Globe, Shield, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import './Settings.css';

const Settings = ({ theme, user }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const SettingRow = ({ icon, label, onClick, iconCls = '' }) => (
    <div className="settings-row" onClick={onClick}>
      <div className="settings-row-left">
        <div className={`settings-icon-wrap ${iconCls}`}>{icon}</div>
        {label}
      </div>
      <ChevronRight className="settings-chevron" size={20} />
    </div>
  );

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''} settings-page`}>
      <div className="settings-header">
        <button className="settings-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="settings-title">Settings</h1>
      </div>

      <div className="settings-main">
        <div>
          <div className="settings-section-title">Preferences</div>
          <div className="settings-card">
            <SettingRow icon={<Moon size={20} />} iconCls="settings-icon-amber" label="Theme" onClick={() => navigate('/settings/theme')} />
            <SettingRow icon={<Globe size={20} />} label="Language" onClick={() => navigate('/settings/language')} />
          </div>
        </div>

        <div>
          <div className="settings-section-title">Support</div>
          <div className="settings-card">
            <SettingRow icon={<Shield size={20} />} iconCls="settings-icon-green" label="Privacy Policy" onClick={() => navigate('/privacy-policy')} />
            <SettingRow icon={<HelpCircle size={20} />} label="Help Center" onClick={() => navigate('/help-center')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;