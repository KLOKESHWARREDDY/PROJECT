import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, User, Mail, Calendar, Filter, Ticket, Search } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const TeacherRegistrations = ({ theme, registrations = [], onApprove, onReject, onApproveAll, onRejectAll }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // State for Filter
  const [activeFilter, setActiveFilter] = useState("Pending");

  // UI State for Search/Filter
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  // Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    isDanger: false,
    confirmText: 'Confirm'
  });

  // RESPONSIVE CHECK
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Standard Departments
  const departments = ['All', 'CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AI & DS', 'MBA', 'MCA'];

  // Filter Logic
  const filteredList = registrations.filter(reg => {
    // 1. Tab Status Filter
    const statusMatch = (reg.status?.toLowerCase() || 'pending') === activeFilter.toLowerCase();

    // 2. Department Filter
    const deptMatch = selectedDepartment === 'All' || reg.student?.department === selectedDepartment;

    // 3. Search Query
    const query = searchQuery.toLowerCase();
    const searchMatch = !query ||
      reg.student?.name?.toLowerCase().includes(query) ||
      reg.student?.email?.toLowerCase().includes(query) ||
      reg.event?.title?.toLowerCase().includes(query); // Added event title search for this page

    return statusMatch && deptMatch && searchMatch;
  });

  console.log('Active filter:', activeFilter);
  console.log('Total registrations:', registrations.length);
  console.log('Filtered registrations:', filteredList.length);

  // APPROVE REGISTRATION
  const handleApprove = async (regId) => {
    if (onApprove) {
      onApprove(regId);
    }
  };

  // REJECT REGISTRATION
  const handleReject = async (regId) => {
    if (onReject) {
      onReject(regId);
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
      display: 'flex', gap: '1vw',
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

    controlsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '2vw',
      marginBottom: '3vh'
    },

    // Right side action buttons
    toolBar: {
      display: 'flex', gap: '1vw', alignItems: 'center'
    },
    toolBtn: (isActive) => ({
      padding: isMobile ? '1vh' : '0.8vh',
      borderRadius: '50%',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: isActive ? '#4f46e5' : (isDark ? '#1e293b' : '#fff'),
      color: isActive ? '#fff' : (isDark ? '#cbd5e1' : '#64748b'),
      transition: 'all 0.2s'
    }),

    // Search Input Info
    searchContainer: {
      width: '100%',
      marginBottom: '2vh',
      animation: 'fadeIn 0.3s ease'
    },
    searchInput: {
      width: '100%',
      padding: isMobile ? '1.5vh 3vw' : '1.2vh 1.5vw',
      borderRadius: '1vw',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      color: isDark ? '#fff' : '#1e293b',
      outline: 'none',
      fontSize: isMobile ? '3.5vw' : '0.9vw'
    },

    // Department Filter List
    deptList: {
      display: 'flex', gap: '1vw', flexWrap: 'wrap',
      marginBottom: '2vh',
      animation: 'fadeIn 0.3s ease'
    },
    deptChip: (isActive) => ({
      padding: isMobile ? '0.8vh 3vw' : '0.5vh 1.2vw',
      borderRadius: '1.5vw', border: '1px solid',
      borderColor: isActive ? '#4f46e5' : (isDark ? '#334155' : '#e2e8f0'),
      cursor: 'pointer',
      fontSize: isMobile ? '3vw' : '0.8vw',
      backgroundColor: isActive ? 'rgba(79, 70, 229, 0.1)' : (isDark ? '#1e293b' : '#fff'),
      color: isActive ? '#4f46e5' : (isDark ? '#94a3b8' : '#64748b'),
      transition: 'all 0.2s'
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

      <div style={styles.controlsContainer}>
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

        {/* Search & Filter Buttons */}
        <div style={styles.toolBar}>
          <button
            style={styles.toolBtn(showSearch)}
            onClick={() => { setShowSearch(!showSearch); setShowFilter(false); }}
            title="Search"
          >
            {showSearch ? <X size={20} /> : <div style={{ display: 'flex', gap: '0.5vw' }}><Search size={20} /></div>}
          </button>

          <button
            style={styles.toolBtn(showFilter)}
            onClick={() => { setShowFilter(!showFilter); setShowSearch(false); }}
            title="Filter by Department"
          >
            {showFilter ? <X size={20} /> : <div style={{ display: 'flex', gap: '0.5vw' }}><Filter size={20} /></div>}
          </button>

          {/* Bulk Actions - Only for Pending */}
          {activeFilter === 'Pending' && filteredList.length > 0 && (
            <>
              <button
                style={{ ...styles.toolBtn(false), backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5' }}
                onClick={() => {
                  const ids = filteredList.map(r => r._id);
                  if (ids.length === 0) return;
                  setModal({
                    isOpen: true,
                    title: 'Reject All Registrations',
                    message: `Are you sure you want to REJECT ALL ${ids.length} visible pending registrations? This action cannot be undone.`,
                    onConfirm: () => onRejectAll(ids),
                    isDanger: true,
                    confirmText: 'Reject All'
                  });
                }}
                title="Reject All Visible"
              >
                <span style={{ fontSize: isMobile ? '3vw' : '0.8vw', fontWeight: 'bold' }}>Reject All</span>
              </button>

              <button
                style={{ ...styles.toolBtn(false), backgroundColor: '#dcfce7', color: '#166534', borderColor: '#86efac' }}
                onClick={() => {
                  const ids = filteredList.map(r => r._id);
                  if (ids.length === 0) return;
                  setModal({
                    isOpen: true,
                    title: 'Approve All Registrations',
                    message: `Are you sure you want to APPROVE ALL ${ids.length} visible pending registrations? Tickets will be generated for all students.`,
                    onConfirm: () => onApproveAll(ids),
                    isDanger: false,
                    confirmText: 'Approve All'
                  });
                }}
                title="Approve All Visible"
              >
                <span style={{ fontSize: isMobile ? '3vw' : '0.8vw', fontWeight: 'bold' }}>Approve All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search Input Area */}
      {showSearch && (
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name, email, or event title..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      )}

      {/* Department Filter Area */}
      {showFilter && (
        <div style={styles.deptList}>
          {departments.map(dept => (
            <button
              key={dept}
              style={styles.deptChip(selectedDepartment === dept)}
              onClick={() => setSelectedDepartment(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      )}

      {/* Dynamic Stats Card */}
      <div style={styles.statsCard}>
        <div>
          <div style={styles.statNumber}>{filteredList.length}</div>
          <div style={styles.statLabel}>
            {activeFilter === 'Pending' ? 'Waiting for Approval' :
              activeFilter === 'Approved' ? 'Total Members' : 'Rejected Requests'}
          </div>
        </div>
        <div style={{ opacity: 0.2 }}>
          <User size={isMobile ? 60 : 80} />
        </div>
      </div>



      {/* List */}
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

      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        isDanger={modal.isDanger}
        confirmText={modal.confirmText}
      />
    </div>
  );
};

export default TeacherRegistrations;
