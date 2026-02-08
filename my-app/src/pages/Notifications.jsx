import React from 'react';
import { ArrowLeft, CheckCircle, Calendar, RefreshCw, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  const containerStyle = { maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' };
  const headerStyle = { display: 'flex', alignItems: 'center', marginBottom: '25px' };
  const cardStyle = { display: 'flex', gap: '15px', padding: '15px', borderRadius: '12px', border: '1px solid #f0f0ff', marginBottom: '12px' };
  const iconBox = (bg) => ({ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: bg, display: 'flex', justifyContent: 'center', alignItems: 'center' });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
        <h2 style={{ marginLeft: '15px', fontSize: '18px' }}>Notifications</h2>
      </div>

      <div style={cardStyle}>
        <div style={iconBox('#5c5cfc')}><CheckCircle color="white" size={20} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ color: '#5c5cfc', fontSize: '14px' }}>Registration approved</b><span style={{ fontSize: '10px', color: '#aaa' }}>2h ago</span></div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Your account has been verified. You can now access all features.</p>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={iconBox('#f0f0ff')}><Calendar color="#5c5cfc" size={20} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ color: '#333', fontSize: '14px' }}>New event added</b><span style={{ fontSize: '10px', color: '#aaa' }}>Yesterday</span></div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>"Summer Workshop" has been added to your calendar.</p>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={iconBox('#f0f0ff')}><RefreshCw color="#5c5cfc" size={20} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ color: '#333', fontSize: '14px' }}>Event updated</b><span style={{ fontSize: '10px', color: '#aaa' }}>Yesterday</span></div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>The location for "Team Lunch" has been changed to Main Hall.</p>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={iconBox('#f0f0ff')}><MessageSquare color="#5c5cfc" size={20} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ color: '#333', fontSize: '14px' }}>New comment</b><span style={{ fontSize: '10px', color: '#aaa' }}>2d ago</span></div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Sarah replied to your post regarding the design updates.</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;