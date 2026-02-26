import React, { useState } from 'react';
import { HelpCircle, Mail, ChevronDown, ChevronUp, MessageCircle, FileText } from 'lucide-react';
import './InfoPages.css';

const HelpCenter = ({ theme, openChat }) => {
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

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''} info-page`}>

      {/* HEADER */}
      <div className="info-header">
        <div className="info-icon-wrap green">
          <HelpCircle size={40} />
        </div>
        <h1 className="info-title">Help Center</h1>
        <p className="info-subtitle">Need assistance? We're here to help.</p>
      </div>

      <div className="info-main">
        {/* FAQ SECTION */}
        <div>
          <h2 className="info-section-title"><FileText className="info-section-icon" size={24} /> Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                <div
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  {faq.question}
                  {openIndex === index ? <ChevronUp size={20} className="info-section-icon" /> : <ChevronDown size={20} color="#94a3b8" />}
                </div>
                {openIndex === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT CARDS */}
        <div className="contact-grid">
          <div
            className="contact-card"
            onClick={() => window.location.href = 'mailto:support@eventsphere.edu'}
          >
            <div className="contact-card-icon blue"><Mail size={32} /></div>
            <h3>Email Support</h3>
            <p>Get a response within 24 hours.</p>
            <div className="contact-card-action">support@eventsphere.edu</div>
          </div>

          <div
            className="contact-card"
            onClick={openChat}
          >
            <div className="contact-card-icon green"><MessageCircle size={32} /></div>
            <h3>Live Chat</h3>
            <p>Chat with our support team.</p>
            <div className="contact-card-action green">Available 9 AM - 6 PM</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HelpCenter;