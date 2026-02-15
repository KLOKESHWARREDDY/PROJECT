import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, User, Mail, Calendar, Filter, Ticket } from 'lucide-react';
import axios from 'axios';
import { registrationAPI } from '../api';
import { toast } from 'react-toastify';

const TeacherRegistrations = ({ theme }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  // State for registrations data
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Filter
  const [activeFilter, setActiveFilter] = useState("Pending");

  // RESPONSIVE CHECK
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // FETCH REAL REGISTRATIONS FROM BACKEND
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        console.log("Fetching teacher registrations...");
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        console.log("Token exists:", !!token);
        
        // Use axios directly to call the teacher endpoint
        const response = await axios.get('/api/registrations/teacher', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Teacher Registrations response:', response.data);
        console.log('Number of registrations:', response.data.length);
        console.log('First registration:', response.data[0]);
        setRegistrations(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching registrations:', err);
        console.error('Error response:', err.response?.data);
        setError(err.response?.data?.message || 'Failed to fetch registrations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegistrations();
  }, []);

  // Filter Logic - use lowercase for comparison since backend returns lowercase status
  const filteredList = registrations.filter(reg => 
    reg.status === activeFilter.toLowerCase()
  );
  
  console.log('Active filter:', activeFilter);
  console.log('Total registrations:', registrations.length);
  console.log('Filtered registrations:', filteredList.length);

  // APPROVE REGISTRATION
  const handleApprove = async (regId) => {
    try {
      const response = await registrationAPI.approve(regId);
      
      console.log('Approved:', response.data);
      
      // Update local state
      setRegistrations(prev => prev.map(reg => 
        reg._id === regId ? { ...reg, status: 'approved', ticketId: response.data.registration.ticketId } : reg
      ));
      
      toast.success('Registration approved! Ticket generated.');
    } catch (err) {
      console.error('Approve error:', err);
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  // REJECT REGISTRATION
  const handleReject = async (regId) => {
    try {
      const response = await registrationAPI.reject(regId);
      
      console.log('Rejected:', response.data);
      
      // Update local state
      setRegistrations(prev => prev.map(reg => 
        reg._id === regId ? { ...reg, status: 'rejected' } : reg
      ));
      toast.success('Registration rejected.');
    } catch (err) {
      console.error('Reject error:', err);
      toast.error(err.response?.data?.message || 'Failed to reject');
    }
  };

  // VIEW TICKET
  const handleViewTicket = (registration) => {
    console.log('View ticket for registration:', registration._id);
    console.log('Registration data:', registration);
    console.log('Event ID:', registration.event?._id || registration.event);
    navigate(`/ticket/${registration._id}`);
  };

  const styles = {
    container: {
      padding: isMobile ? '4vw' : '2vw',
      maxWidth: isMobile ? '100vw' : '60vw',
      margin: '0 auto',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      color: isDark ? '#fff' : '#1e293b'
    },
    
    header: { 
      display: 'flex', alignItems: 'center', gap: '2vw', marginBottom: '3vh' 
    },
    backBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: isDark ? '#fff' : '#64748b', display: 'flex', alignItems: 'center'
    },
    pageTitle: { fontSize: isMobile ? '6vw' : '2vw', fontWeight: '800' },

    // Filter Tabs
    filterContainer: {
      display: 'flex', gap: '1vw', marginBottom: '3vh', 
      padding: '0.5vh', backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: '2vw', width: 'fit-content',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
    },
    filterTab: (isActive) => ({
      padding: isMobile ? '1vh 4vw' : '0.8vh 2vw',
      borderRadius: '1.5vw', border: 'none', cursor: 'pointer',
      fontSize: isMobile ? '3.5vw' : '0.9vw', fontWeight: '600',
      backgroundColor: isActive ? '#4f46e5' : 'transparent',
      color: isActive ? '#fff' : (isDark ? '#94a3b8' : '#64748b'),
      transition: 'all 0.2s',
      boxShadow: isActive ? '0 2px 10px rgba(79, 70, 229, 0.3)' : 'none'
    }),

    // Stats Summary Card
    statsCard: {
      background: activeFilter === 'Pending' ? 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' :
                  activeFilter === 'Approved' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                  'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      borderRadius: isMobile ? '3vw' : '1.2vw',
      padding: isMobile ? '4vw' : '2vw',
      color: '#fff', marginBottom: '4vh',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'background 0.3s ease'
    },
    statNumber: { fontSize: isMobile ? '8vw' : '2.5vw', fontWeight: '800' },
    statLabel: { fontSize: isMobile ? '3.5vw' : '1vw', opacity: 0.9 },

    // Loading/Error States
    loadingState: {
      textAlign: 'center', padding: '5vh', color: '#64748b',
      fontSize: isMobile ? '3.5vw' : '1vw'
    },
    errorState: {
      textAlign: 'center', padding: '5vh', color: '#ef4444',
      fontSize: isMobile ? '3.5vw' : '1vw'
    },

    // List
    listContainer: { display: 'flex', flexDirection: 'column', gap: '2vh' },

    // Card
    card: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: isMobile ? '3vw' : '1vw',
      padding: isMobile ? '3vw' : '1.2vw',
      display: 'flex', alignItems: 'center', gap: '3vw',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      position: 'relative'
    },
    avatarBox: {
      width: isMobile ? '14vw' : '4vw', height: isMobile ? '14vw' : '4vw',
      borderRadius: '50%', backgroundColor: isDark ? '#334155' : '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#64748b', fontSize: isMobile ? '5vw' : '1.5vw', fontWeight: 'bold'
    },
    cardInfo: { flex: 1 },
    name: { 
      fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold', 
      marginBottom: '0.5vh', color: isDark ? '#fff' : '#1e293b' 
    },
    detailRow: { 
      display: 'flex', alignItems: 'center', gap: '1.5vw', 
      fontSize: isMobile ? '3vw' : '0.85vw', color: '#64748b', marginBottom: '0.5vh' 
    },
    icon: { width: isMobile ? '3.5vw' : '1vw', height: isMobile ? '3.5vw' : '1vw' },

    // Action Buttons
    actions: { display: 'flex', gap: '1vw' },
    actionBtn: (type) => ({
      width: isMobile ? '10vw' : '2.5vw', height: isMobile ? '10vw' : '2.5vw',
      borderRadius: '50%', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: type === 'approve' ? '#dcfce7' : '#fee2e2',
      color: type === 'approve' ? '#166534' : '#991b1b',
      transition: 'transform 0.1s'
    }),
    
    // Status Badge
    statusBadge: (status) => ({
      padding: '0.5vh 1.5vw', borderRadius: '2vw',
      fontSize: '0.8vw', fontWeight: 'bold',
      backgroundColor: status === 'approved' ? '#dcfce7' : '#fee2e2',
      color: status === 'approved' ? '#166534' : '#991b1b'
    }),

    emptyState: {
      textAlign: 'center', padding: '5vh', color: '#64748b',
      fontSize: isMobile ? '3.5vw' : '1vw',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2vh'
    },
    
    ticketInfo: {
      fontSize: isMobile ? '2.5vw' : '0.75vw', 
      color: '#10b981', fontWeight: 'bold',
      marginTop: '0.5vh'
    },

    // View Ticket Button
    viewTicketBtn: {
      padding: isMobile ? '1vh 2vw' : '0.5vh 1vw',
      borderRadius: isMobile ? '2vw' : '0.5vw',
      border: 'none', cursor: 'pointer',
      fontSize: isMobile ? '3vw' : '0.75vw', fontWeight: '600',
      backgroundColor: '#4f46e5', color: '#fff',
      display: 'flex', alignItems: 'center', gap: '0.5vw'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={isMobile ? 24 : 24} />
        </button>
        <h1 style={styles.pageTitle}>Registrations</h1>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterContainer}>
        {['Pending', 'Approved', 'Rejected'].map((tab) => (
          <button 
            key={tab}
            style={styles.filterTab(activeFilter === tab)}
            onClick={() => setActiveFilter(tab)}
          >
            {tab === 'Pending' ? 'New Requests' : tab}
          </button>
        ))}
      </div>

      {/* Dynamic Stats Card */}
      <div style={styles.statsCard}>
        <div>
          <div style={styles.statNumber}>{filteredList.length}</div>
          <div style={styles.statLabel}>
            {activeFilter === 'Pending' ? 'Waiting for Approval' : 
             activeFilter === 'Approved' ? 'Total Members' : 'Rejected Requests'}
          </div>
        </div>
        <div style={{opacity: 0.2}}>
          <User size={isMobile ? 60 : 80} />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingState}>
          <div>Loading registrations...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={styles.errorState}>
          <div>Error: {error}</div>
        </div>
      )}

      {/* List */}
      {!loading && !error && (
        <div style={styles.listContainer}>
          {filteredList.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{
                width: isMobile ? '20vw' : '6vw', height: isMobile ? '20vw' : '6vw', 
                borderRadius: '50%', backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Filter size={isMobile ? 32 : 40} color="#94a3b8" />
              </div>
              <p>No {activeFilter.toLowerCase()} registrations found.</p>
            </div>
          ) : (
            filteredList.map((reg) => (
              <div key={reg._id} style={styles.card}>
                <div style={styles.avatarBox}>
                  {/* Use student name from populated data */}
                  {reg.student?.name?.charAt(0) || 'S'}
                </div>
                
                <div style={styles.cardInfo}>
                  {/* Student Name */}
                  <div style={styles.name}>{reg.student?.name || 'Unknown Student'}</div>
                  
                  {/* Student Email */}
                  <div style={styles.detailRow}>
                    <Mail style={styles.icon} /> {reg.student?.email || 'No email'}
                  </div>
                  
                  {/* Event Title */}
                  <div style={styles.detailRow}>
                    <Calendar style={styles.icon} /> {reg.event?.title || 'Unknown Event'}
                  </div>
                  
                  {/* Ticket ID (for approved registrations) */}
                  {reg.ticketId && (
                    <div style={styles.ticketInfo}>
                      Ticket: {reg.ticketId}
                    </div>
                  )}
                </div>

                {/* Show Actions only for Pending, else show Status Badge */}
                {activeFilter === 'Pending' ? (
                  <div style={styles.actions}>
                    <button 
                      style={styles.actionBtn('reject')} 
                      onClick={() => handleReject(reg._id)}
                      title="Reject"
                    >
                      <X size={isMobile ? 20 : 18} />
                    </button>
                    <button 
                      style={styles.actionBtn('approve')} 
                      onClick={() => handleApprove(reg._id)}
                      title="Approve"
                    >
                      <Check size={isMobile ? 20 : 18} />
                    </button>
                  </div>
                ) : activeFilter === 'Approved' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5vh' }}>
                    <div style={styles.statusBadge(reg.status)}>
                      {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                    </div>
                    <button 
                      style={styles.viewTicketBtn}
                      onClick={() => handleViewTicket(reg)}
                      title="View Ticket"
                    >
                      <Ticket size={isMobile ? 14 : 12} /> View Ticket
                    </button>
                  </div>
                ) : (
                  <div style={styles.statusBadge(reg.status)}>
                    {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherRegistrations;
