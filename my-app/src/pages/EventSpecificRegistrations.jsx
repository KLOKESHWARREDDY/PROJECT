import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Mail, Filter, Search, Users } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import './Pages.css';

const DEPTS = ['All', 'CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AI & DS', 'MBA', 'MCA'];

const getBadgeCls = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'approved') return 'page-badge page-badge-approved';
  if (s === 'rejected') return 'page-badge page-badge-rejected';
  return 'page-badge page-badge-pending';
};

const EventSpecificRegistrations = ({ events, registrations = [], onApprove, onReject, onApproveAll, onRejectAll, theme }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isDark = theme === 'dark';

  const [relatedRegistrations, setRelatedRegistrations] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Pending');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { }, isDanger: false, confirmText: 'Confirm' });

  const eventItem = events?.find(e => e.id === id || e._id === id);

  useEffect(() => {
    if (registrations.length > 0) {
      setRelatedRegistrations(registrations.filter(r => r.event?._id === id || r.event === id));
    }
  }, [registrations, id]);

  const filteredList = relatedRegistrations.filter(reg => {
    const statusMatch = (reg.status?.toLowerCase() || 'pending') === activeFilter.toLowerCase();
    const deptMatch = selectedDepartment === 'All' || reg.student?.department === selectedDepartment;
    const q = searchQuery.toLowerCase();
    const searchMatch = !q || reg.student?.name?.toLowerCase().includes(q) || reg.student?.email?.toLowerCase().includes(q) || reg.student?.regNo?.toLowerCase().includes(q);
    return statusMatch && deptMatch && searchMatch;
  });

  const bannerCls = activeFilter === 'Approved' ? 'page-stat-banner page-banner-approved' :
    activeFilter === 'Rejected' ? 'page-stat-banner page-banner-rejected' :
      'page-stat-banner page-banner-pending';

  return (
    <div className={`page-wrapper${isDark ? ' dark' : ''}`}>

      {/* Header */}
      <div className="page-header">
        <button className="page-back-btn" onClick={() => navigate(-1)}><ArrowLeft size={18} /></button>
        <div>
          <h1 className="page-title">Registrations</h1>
          {eventItem?.title && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2, fontWeight: 500 }}>{eventItem.title}</div>}
        </div>
      </div>

      <div className="page-main">

        {/* Controls */}
        <div className="page-controls">
          <div className="page-tabs">
            {['Pending', 'Approved', 'Rejected'].map(tab => (
              <button key={tab} className={`page-tab${activeFilter === tab ? ' active' : ''}`} onClick={() => setActiveFilter(tab)}>
                {tab}
              </button>
            ))}
          </div>

          <div className="page-toolbar">
            <button className={`page-tool-btn${showSearch ? ' active' : ''}`} onClick={() => { setShowSearch(!showSearch); setShowFilter(false); }} title="Search">
              {showSearch ? <X size={17} /> : <Search size={17} />}
            </button>
            <button className={`page-tool-btn${showFilter ? ' active' : ''}`} onClick={() => { setShowFilter(!showFilter); setShowSearch(false); }} title="Filter by Department">
              {showFilter ? <X size={17} /> : <Filter size={17} />}
            </button>
            {activeFilter === 'Pending' && filteredList.length > 0 && (
              <>
                <button className="page-bulk-btn page-bulk-reject"
                  onClick={() => { const ids = filteredList.map(r => r._id); setModal({ isOpen: true, title: 'Reject All', message: `Reject ALL ${ids.length} pending registrations?`, onConfirm: () => onRejectAll(ids), isDanger: true, confirmText: 'Reject All' }); }}>
                  Reject All
                </button>
                <button className="page-bulk-btn page-bulk-approve"
                  onClick={() => { const ids = filteredList.map(r => r._id); setModal({ isOpen: true, title: 'Approve All', message: `Approve ALL ${ids.length} pending registrations?`, onConfirm: () => onApproveAll(ids), isDanger: false, confirmText: 'Approve All' }); }}>
                  Approve All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="page-search-wrap">
            <Search size={15} className="page-search-icon" />
            <input className="page-search-input" type="text" placeholder="Search by name, email, or reg no…"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus />
          </div>
        )}

        {/* Dept filter */}
        {showFilter && (
          <div className="page-dept-chips">
            {DEPTS.map(d => (
              <button key={d} className={`page-dept-chip${selectedDepartment === d ? ' active' : ''}`} onClick={() => setSelectedDepartment(d)}>{d}</button>
            ))}
          </div>
        )}

        {/* Stat banner */}
        <div className={bannerCls}>
          <div>
            <div className="page-stat-banner-val">{filteredList.length}</div>
            <div className="page-stat-banner-label">
              {activeFilter === 'Pending' ? 'Awaiting Approval' : activeFilter === 'Approved' ? 'Approved Members' : 'Rejected Requests'}
            </div>
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
                <div className="page-reg-avatar">{reg.student?.name?.charAt(0)?.toUpperCase() || 'S'}</div>
                <div className="page-reg-info">
                  <div className="page-reg-name">{reg.student?.name || 'Unknown'}</div>
                  <div className="page-reg-meta"><Mail size={12} /> {reg.student?.email || 'No email'}</div>
                  {reg.student?.department && <div className="page-reg-meta">{reg.student.department}</div>}
                </div>
                <div className="page-reg-actions">
                  {activeFilter === 'Pending' ? (
                    <>
                      <button className="page-action-btn page-btn-reject" onClick={() => onReject(reg._id)} title="Reject"><X size={15} /></button>
                      <button className="page-action-btn page-btn-approve" onClick={() => onApprove(reg._id)} title="Approve"><Check size={15} /></button>
                    </>
                  ) : (
                    <span className={getBadgeCls(reg.status)}>{reg.status?.charAt(0).toUpperCase() + reg.status?.slice(1)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} onConfirm={modal.onConfirm}
        title={modal.title} message={modal.message} isDanger={modal.isDanger} confirmText={modal.confirmText} />
    </div>
  );
};

export default EventSpecificRegistrations;