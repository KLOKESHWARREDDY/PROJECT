import React from 'react';
import { Shield, Lock, Eye, Database, Mail, PhoneCall } from 'lucide-react';
import './InfoPages.css';

const PrivacyPolicy = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''} info-page`}>

      {/* HEADER */}
      <div className="info-header">
        <div className="info-icon-wrap blue">
          <Shield size={40} />
        </div>
        <h1 className="info-title">Privacy Policy</h1>
        <p className="info-subtitle">Last updated: April 10, 2026</p>
      </div>

      <div className="info-main">
        {/* SECTION 1: Introduction */}
        <div className="info-card">
          <h2 className="info-section-title">
            <Eye className="info-section-icon" size={24} /> 1. Introduction
          </h2>
          <p className="info-text">
            Welcome to <strong>EventSphere</strong>. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we look after your personal data when you visit our website or use our application and tells you about your privacy rights.
          </p>
        </div>

        {/* SECTION 2: Data We Collect */}
        <div className="info-card">
          <h2 className="info-section-title">
            <Database className="info-section-icon" size={24} /> 2. Information We Collect
          </h2>
          <p className="info-text">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
          <ul className="info-list">
            <li><strong>Identity Data:</strong> includes first name, last name, username, and student/employee ID.</li>
            <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
            <li><strong>Usage Data:</strong> includes information about how you use our website and event services.</li>
          </ul>
        </div>

        {/* SECTION 3: How We Use Your Data */}
        <div className="info-card">
          <h2 className="info-section-title">
            <Lock className="info-section-icon" size={24} /> 3. How We Use Your Data
          </h2>
          <p className="info-text">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="info-list">
            <li>To register you as a new user or event participant.</li>
            <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
            <li>To administer and protect our business and this website.</li>
            <li>To deliver relevant website content and advertisements to you.</li>
          </ul>
        </div>

        {/* SECTION 4: Contact Us */}
        <div className="info-card">
          <h2 className="info-section-title">
            <Mail className="info-section-icon" size={24} /> 4. Contact Us
          </h2>
          <p className="info-text">
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <div className="info-contact-box">
            <Mail className="info-contact-icon" size={22} /> eventsphere@gmail.com
          </div>
          <div className="info-contact-box">
            <PhoneCall className="info-contact-icon" size={22} /> 5216738460
          </div>
        </div>
      </div>

    </div>
  );
};

export default PrivacyPolicy;