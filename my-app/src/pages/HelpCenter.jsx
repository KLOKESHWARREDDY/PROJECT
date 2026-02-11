import React, { useState } from 'react';
import { HelpCircle, Mail, ChevronDown, ChevronUp, MessageCircle, FileText } from 'lucide-react';

const HelpCenter = ({ theme }) => {
  const isDark = theme === 'dark';
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I register for an event?",
      answer: "Navigate to the 'Events' page, browse the upcoming events, click on the event card you are interested in, and then click the 'Register Now' button. You will receive a confirmation notification."
    },
    {
      question: "Can I cancel my registration?",
      answer: "Yes. Go to 'My Tickets', find the event you want to cancel, and click the 'Cancel Registration' button. Please note that some paid events may have a cancellation policy."
    },
    {
      question: "How do I change my profile details?",
      answer: "Go to your Profile page and click on 'Edit Profile'. You can update your name, profile photo, and other details there."
    },
    {
      question: "I forgot my password. What should I do?",
      answer: "On the Login screen, click 'Forgot Password?'. Follow the instructions sent to your registered email address to reset your password."
    }
  ];

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
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '20px',
      color: isDark ? '#fff' : '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    faqContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    faqItem: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: '12px',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      overflow: 'hidden',
      transition: 'all 0.2s'
    },
    questionBox: {
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      fontWeight: '600',
      color: isDark ? '#fff' : '#1e293b'
    },
    answerBox: {
      padding: '0 20px 20px 20px',
      color: '#64748b',
      lineHeight: '1.6',
      fontSize: '14px',
      borderTop: isDark ? '1px solid #334155' : '1px solid #f1f5f9'
    },
    contactGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '40px'
    },
    contactCard: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      padding: '25px',
      borderRadius: '16px',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', marginBottom: '20px' }}>
          <HelpCircle size={40} />
        </div>
        <h1 style={styles.title}>Help Center</h1>
        <p style={styles.subtitle}>Need assistance? We're here to help.</p>
      </div>

      {/* FAQ SECTION */}
      <div>
        <h2 style={styles.sectionTitle}><FileText size={20}/> Frequently Asked Questions</h2>
        <div style={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <div key={index} style={styles.faqItem}>
              <div 
                style={styles.questionBox} 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                {openIndex === index ? <ChevronUp size={20} color="#6366f1"/> : <ChevronDown size={20} color="#94a3b8"/>}
              </div>
              {openIndex === index && (
                <div style={styles.answerBox}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT CARDS */}
      <div style={styles.contactGrid}>
        <div 
          style={styles.contactCard}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ marginBottom: '15px', color: '#6366f1' }}><Mail size={32} /></div>
          <h3 style={{ marginBottom: '10px', color: isDark ? '#fff' : '#1e293b' }}>Email Support</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>Get a response within 24 hours.</p>
          <div style={{ fontWeight: 'bold', color: '#6366f1' }}>support@eventsphere.edu</div>
        </div>

        <div 
          style={styles.contactCard}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ marginBottom: '15px', color: '#22c55e' }}><MessageCircle size={32} /></div>
          <h3 style={{ marginBottom: '10px', color: isDark ? '#fff' : '#1e293b' }}>Live Chat</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>Chat with our support team.</p>
          <div style={{ fontWeight: 'bold', color: '#22c55e' }}>Available 9 AM - 6 PM</div>
        </div>
      </div>

    </div>
  );
};

export default HelpCenter;