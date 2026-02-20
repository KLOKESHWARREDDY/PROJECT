import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, X, User, Mail, Filter, Search } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const EventSpecificRegistrations = ({ events, registrations = [], onApprove, onReject, onApproveAll, onRejectAll, theme }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL
  const isDark = theme === 'dark';
  const [relatedRegistrations, setRelatedRegistrations] = useState([]);

  // UI State
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

  // Find event from props for display title
  const eventItem = events.find(e => e.id === id || e._id === id);

  useEffect(() => {
    if (registrations.length > 0) {
      const filtered = registrations.filter(r =>
        (r.event?._id === id || r.event === id)
      );
      setRelatedRegistrations(filtered);
    }
  }, [registrations, id]);

  const [activeFilter, setActiveFilter] = useState("Pending");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get unique departments
  // Standard Departments
  const departments = ['All', 'CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AI & DS', 'MBA', 'MCA'];

  // Filter registrations
  const filteredList = relatedRegistrations.filter(reg => {
    // 1. Tab Status Filter
    const status = reg.status?.toLowerCase() || 'pending';
    const statusMatch = status === activeFilter.toLowerCase();

    // 2. Department Filter
    const deptMatch = selectedDepartment === 'All' || reg.student?.department === selectedDepartment;

    // 3. Search Query
    const query = searchQuery.toLowerCase();
    const searchMatch = !query ||
      reg.student?.name?.toLowerCase().includes(query) ||
      reg.student?.email?.toLowerCase().includes(query) ||
      reg.student?.regNo?.toLowerCase().includes(query);

    return statusMatch && deptMatch && searchMatch;
  });

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
    header: { display: 'flex', alignItems: 'center', gap: '2vw', marginBottom: '3vh' },
    backBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: isDark ? '#fff' : '#64748b', display: 'flex', alignItems: 'center'
    },
    pageTitle: { fontSize: isMobile ? '5vw' : '1.8vw', fontWeight: '800' },
    subTitle: { fontSize: isMobile ? '3.5vw' : '1vw', color: '#6366f1', marginLeft: 'auto', fontWeight: '600' },

    controlsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '2vw',
      marginBottom: '3vh'
    },

    // Left side tabs
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
      transition: 'all 0.2s'
    }),

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

    listContainer: { display: 'flex', flexDirection: 'column', gap: '2vh' },
    card: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: isMobile ? '3vw' : '1vw',
      padding: isMobile ? '3vw' : '1.2vw',
      display: 'flex', alignItems: 'center', gap: '3vw',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    avatarBox: {
      width: isMobile ? '12vw' : '3.5vw', height: isMobile ? '12vw' : '3.5vw',
      borderRadius: '50%', backgroundColor: isDark ? '#334155' : '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#64748b', fontSize: isMobile ? '4.5vw' : '1.2vw', fontWeight: 'bold'
    },
    cardInfo: { flex: 1 },
    name: { fontSize: isMobile ? '4vw' : '1.1vw', fontWeight: 'bold', color: isDark ? '#fff' : '#1e293b' },
    detail: { fontSize: isMobile ? '3vw' : '0.85vw', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' },

    actions: { display: 'flex', gap: '1vw' },
    actionBtn: (type) => ({
      width: isMobile ? '10vw' : '2.5vw', height: isMobile ? '10vw' : '2.5vw',
      borderRadius: '50%', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: type === 'approve' ? '#dcfce7' : '#fee2e2',
      color: type === 'approve' ? '#166534' : '#991b1b'
    }),
    statusBadge: (status) => ({
      padding: '0.5vh 1.5vw', borderRadius: '2vw',
      fontSize: '0.8vw', fontWeight: 'bold',
      backgroundColor: status === 'Approved' ? '#dcfce7' : '#fee2e2',
      color: status === 'Approved' ? '#166534' : '#991b1b'
    }),
    emptyState: { textAlign: 'center', padding: '5vh', color: '#64748b', fontSize: isMobile ? '3.5vw' : '1vw' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={isMobile ? 24 : 24} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={styles.pageTitle}>Event Registrations</h1>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{eventItem?.title}</span>
        </div>
      </div>

      <div style={styles.controlsContainer}>
        {/* Status Tabs */}
        <div style={styles.filterContainer}>
          {['Pending', 'Approved', 'Rejected'].map((tab) => (
            <button key={tab} style={styles.filterTab(activeFilter === tab)} onClick={() => setActiveFilter(tab)}>
              {tab}
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
                    message: `Are you sure you want to REJECT ALL ${ids.length} visible pending registrations?`,
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
                    message: `Are you sure you want to APPROVE ALL ${ids.length} visible pending registrations?`,
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
            placeholder="Search by name, email, or reg no..."
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

      <div style={styles.listContainer}>
        {filteredList.length === 0 ? (
          <div style={styles.emptyState}>
            <Filter size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
            <p>No {activeFilter.toLowerCase()} registrations found.</p>
          </div>
        ) : (
          filteredList.map((reg) => (
            <div key={reg._id} style={styles.card}>
              <div style={styles.avatarBox}>{reg.student?.name?.charAt(0) || 'S'}</div>
              <div style={styles.cardInfo}>
                <div style={styles.name}>{reg.student?.name || 'Unknown'}</div>
                <div style={styles.detail}><Mail size={12} /> {reg.student?.email || 'No email'}</div>
                {reg.student?.department && <div style={styles.detail}>{reg.student.department}</div>}
              </div>

              {activeFilter === 'Pending' ? (
                <div style={styles.actions}>
                  <button style={styles.actionBtn('reject')} onClick={() => onReject(reg._id)}><X size={18} /></button>
                  <button style={styles.actionBtn('approve')} onClick={() => onApprove(reg._id)}><Check size={18} /></button>
                </div>
              ) : (
                <div style={styles.statusBadge(reg.status)}>{reg.status}</div>
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

export default EventSpecificRegistrations;