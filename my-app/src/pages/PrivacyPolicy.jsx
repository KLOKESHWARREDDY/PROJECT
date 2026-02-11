import React from 'react';
import { Shield, Lock, Eye, Database, Mail, PhoneCall } from 'lucide-react';

const PrivacyPolicy = ({ theme }) => {
  const isDark = theme === 'dark';

  const styles = {
    container: {
      padding: '40px',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100%',
      fontFamily: "'Inter', sans-serif",
      maxWidth: '1000px',
      margin: '0 auto',
      color: isDark ? '#e2e8f0' : '#334155'
    },
    header: {
      marginBottom: '40px',
      textAlign: 'center'
    },
    title: {
      fontSize: '32px',
      fontWeight: '800',
      color: isDark ? '#fff' : '#1e293b',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b'
    },
    section: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: isDark ? '#fff' : '#1e293b'
    },
    text: {
      fontSize: '15px',
      lineHeight: '1.7',
      marginBottom: '15px'
    },
    list: {
      marginLeft: '20px',
      marginBottom: '15px'
    },
    listItem: {
      marginBottom: '8px'
    },
    contactBox: {
      backgroundColor: '#e0e7ff',
      padding: '20px',
      borderRadius: '12px',
      marginTop: '20px',
      color: '#3730a3',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4338ca', marginBottom: '20px' }}>
          <Shield size={40} />
        </div>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.subtitle}>Last updated: April 10, 2026</p>
      </div>

      {/* SECTION 1: Introduction */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Eye size={22} color="#6366f1" /> 1. Introduction
        </h2>
        <p style={styles.text}>
          Welcome to <strong>EventSphere</strong>. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we look after your personal data when you visit our website or use our application and tells you about your privacy rights.
        </p>
      </div>

      {/* SECTION 2: Data We Collect */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Database size={22} color="#6366f1" /> 2. Information We Collect
        </h2>
        <p style={styles.text}>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
        <ul style={styles.list}>
          <li style={styles.listItem}><strong>Identity Data:</strong> includes first name, last name, username, and student/employee ID.</li>
          <li style={styles.listItem}><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
          <li style={styles.listItem}><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          <li style={styles.listItem}><strong>Usage Data:</strong> includes information about how you use our website and event services.</li>
        </ul>
      </div>

      {/* SECTION 3: How We Use Your Data */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Lock size={22} color="#6366f1" /> 3. How We Use Your Data
        </h2>
        <p style={styles.text}>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul style={styles.list}>
          <li style={styles.listItem}>To register you as a new user or event participant.</li>
          <li style={styles.listItem}>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
          <li style={styles.listItem}>To administer and protect our business and this website.</li>
          <li style={styles.listItem}>To deliver relevant website content and advertisements to you.</li>
        </ul>
      </div>

      {/* SECTION 4: Contact Us */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Mail size={22} color="#6366f1" /> 4. Contact Us
        </h2>
        <p style={styles.text}>
          If you have any questions about this privacy policy or our privacy practices, please contact us at:
        </p>
        <div style={styles.contactBox}>
          <Mail size={20} /> eventsphere@gmail.com
        </div>
         <div style={styles.contactBox}>
          <PhoneCall size={20} /> 5216738460
        </div>
      </div>

    </div>
  );
};

export default PrivacyPolicy;