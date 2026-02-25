import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Mail, Calendar, Filter, Ticket, Search, Users } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import './Pages.css';

const DEPTS = ['All', 'CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AI & DS', 'MBA', 'MCA'];

const getBadgeCls = (status) => {
  if (status === 'approved') return 'page-badge page-badge-approved';
  if (status === 'rejected') return 'page-badge page-badge-rejected';
  return 'page-badge page-badge-pending';
};

const TeacherRegistrations = ({ theme, registrations = [], onApprove, onReject, onApproveAll, onRejectAll }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [activeFilter, setActiveFilter] = useState('Pending');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { }, isDanger: false, confirmText: 'Confirm' });

  const filteredList = registrations.filter(reg => {
    const statusMatch = (reg.status?.toLowerCase() || 'pending') === activeFilter.toLowerCase();
    const deptMatch = selectedDepartment === 'All' || reg.student?.department === selectedDepartment;
    const query = searchQuery.toLowerCase();
    const searchMatch = !query ||
      reg.student?.name?.toLowerCase().includes(query) ||
      reg.student?.email?.toLowerCase().includes(query) ||
      reg.event?.title?.toLowerCase().includes(query);
    return statusMatch && deptMatch && searchMatch;
  });

  const bannerCls = activeFilter === 'Approved' ? 'page-stat-banner page-banner-approved' :
    activeFilter === 'Rejected' ? 'page-stat-banner page-banner-rejected' :
      'page-stat-banner page-banner-pending';

  const bannerLabel = activeFilter === 'Pending' ? 'Waiting for Approval' :
    activeFilter === 'Approved' ? 'Approved Members' : 'Rejected Requests';

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''}`}>

      {/* Header */}
      <div className="page-header">
        <button className="page-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="page-title">Registrations</h1>
      </div>

      <div className="page-main">

        {/* Controls */}
        <div className="page-controls">
          <div className="page-tabs">
            {['Pending', 'Approved', 'Rejected'].map(tab => (
              <button
                key={tab}
                className={`page-tab${activeFilter === tab ? ' active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab === 'Pending' ? 'New Requests' : tab}
              </button>
            ))}
          </div>

          <div className="page-toolbar">
            <button
              className={`page-tool-btn${showSearch ? ' active' : ''}`}
              onClick={() => { setShowSearch(!showSearch); setShowFilter(false); }}
              title="Search"
            >
              {showSearch ? <X size={17} /> : <Search size={17} />}
            </button>
            <button
              className={`page-tool-btn${showFilter ? ' active' : ''}`}
              onClick={() => { setShowFilter(!showFilter); setShowSearch(false); }}
              title="Filter by Department"
            >
              {showFilter ? <X size={17} /> : <Filter size={17} />}
            </button>

            {activeFilter === 'Pending' && filteredList.length > 0 && (
              <>
                <button className="page-bulk-btn page-bulk-reject"
                  onClick={() => {
                    const ids = filteredList.map(r => r._id);
                    setModal({ isOpen: true, title: 'Reject All', message: `Reject ALL ${ids.length} pending registrations? This cannot be undone.`, onConfirm: () => onRejectAll(ids), isDanger: true, confirmText: 'Reject All' });
                  }}
                >Reject All</button>
                <button className="page-bulk-btn page-bulk-approve"
                  onClick={() => {
                    const ids = filteredList.map(r => r._id);
                    setModal({ isOpen: true, title: 'Approve All', message: `Approve ALL ${ids.length} pending registrations? Tickets will be generated.`, onConfirm: () => onApproveAll(ids), isDanger: false, confirmText: 'Approve All' });
                  }}
                >Approve All</button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="page-search-wrap">
            <Search size={15} className="page-search-icon" />
            <input
              className="page-search-input"
              type="text"
              placeholder="Search by name, email, or event…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Dept filter */}
        {showFilter && (
          <div className="page-dept-chips">
            {DEPTS.map(d => (
              <button
                key={d}
                className={`page-dept-chip${selectedDepartment === d ? ' active' : ''}`}
                onClick={() => setSelectedDepartment(d)}
              >{d}</button>
            ))}
          </div>
        )}

        {/* Stat Banner */}
        <div className={bannerCls}>
          <div>
            <div className="page-stat-banner-val">{filteredList.length}</div>
            <div className="page-stat-banner-label">{bannerLabel}</div>
          </div>
          <Users size={60} style={{ opacity: 0.15 }} />
        </div>

        {/* List */}
        {filteredList.length === 0 ? (
          <div className="page-empty">
            <Filter size={40} strokeWidth={1.5} />
            <p>No {activeFilter.toLowerCase()} registrations found.</p>
          </div>
        ) : (
          <div className="page-list">
            {filteredList.map(reg => (
              <div key={reg._id} className="page-reg-card">
                <div className="page-reg-avatar">
                  {reg.student?.name?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <div className="page-reg-info">
                  <div className="page-reg-name">{reg.student?.name || 'Unknown Student'}</div>
                  <div className="page-reg-meta"><Mail size={12} /> {reg.student?.email || 'No email'}</div>
                  <div className="page-reg-meta"><Calendar size={12} /> {reg.event?.title || 'Unknown Event'}</div>
                  {reg.ticketId && <div className="page-reg-ticket">Ticket: {reg.ticketId}</div>}
                </div>

                <div className="page-reg-actions">
                  {activeFilter === 'Pending' ? (
                    <>
                      <button className="page-action-btn page-btn-reject" onClick={() => onReject(reg._id)} title="Reject">
                        <X size={16} />
                      </button>
                      <button className="page-action-btn page-btn-approve" onClick={() => onApprove(reg._id)} title="Approve">
                        <Check size={16} />
                      </button>
                    </>
                  ) : activeFilter === 'Approved' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span className={getBadgeCls(reg.status)}>{reg.status?.charAt(0).toUpperCase() + reg.status?.slice(1)}</span>
                      <button className="page-view-ticket-btn" onClick={() => navigate(`/ticket/${reg._id}`)}>
                        <Ticket size={12} /> View Ticket
                      </button>
                    </div>
                  ) : (
                    <span className={getBadgeCls(reg.status)}>{reg.status?.charAt(0).toUpperCase() + reg.status?.slice(1)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
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
