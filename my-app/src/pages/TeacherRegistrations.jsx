import React, { useState } from 'react';
import { Search, Users, CheckCircle, XCircle, Clock, Filter, X, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TeacherRegistrations.css';

const TeacherRegistrations = ({ registrations, onApprove, onReject, onApproveAll, onRejectAll, theme }) => {
  const isDark = ['dark', 'purple-gradient', 'blue-ocean', 'midnight-dark', 'emerald-dark', 'cherry-dark', 'slate-minimal'].includes(theme);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterDept, setFilterDept] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AI & DS', 'MBA', 'MCA'];

  // Filter Logic
  const filteredRegs = registrations.filter(reg => {
    const studentName = reg.student?.name || '';
    const studentEmail = reg.student?.email || '';
    const eventName = reg.event?.title || '';
    const studentDept = reg.student?.department || '';

    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eventName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
    const matchesDept = filterDept === 'all' || studentDept === filterDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Bulk Selection Logic
  const allSelected = filteredRegs.length > 0 && selectedIds.length === filteredRegs.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRegs.map(r => r._id));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'approved': return <CheckCircle size={14} />;
      case 'rejected': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className={`page-wrapper treg-full-page ${theme === 'light' ? 'light' : 'dark'}`}>
      <div className="treg-bg-glow treg-glow-purple"></div>
      <div className="treg-bg-glow treg-glow-blue"></div>

      <div className="treg-root">

        {/* Header & Controls Wrapper for Full-width Gradient */}
        <div className="treg-header-wrapper">
          <div className="treg-header">
            <div className="treg-title-section">
              <h1 className="treg-title">
                <div className="treg-title-icon-wrapper">
                  <Users size={32} color={theme === 'light' ? 'var(--treg-primary)' : '#fff'} strokeWidth={2.5} />
                </div>
                Registrations
              </h1>
              <p className="treg-subtitle">Review and manage student event applications easily.</p>
            </div>
          </div>
        </div>

        <div className="treg-content-wrapper">
          {/* Controls Area */}
          <div className="treg-tabs-container">
            <div className="treg-tabs">
              {['Pending', 'Approved', 'Rejected'].map((tab) => (
                <button
                  key={tab}
                  className={`treg-tab ${filterStatus === tab.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setFilterStatus(tab.toLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Toolbar Buttons */}
            <div className="treg-toolbar">
              <button
                className={`treg-tool-btn treg-btn-filter ${showFilter ? 'active' : ''}`}
                onClick={() => setShowFilter(!showFilter)}
                title="Filter by Department"
              >
                {showFilter ? <X size={20} /> : <Filter size={20} />}
              </button>
            </div>
          </div>

          {/* Full-width Search Input Area */}
          <div className="treg-search-expand">
            <div className="treg-search-bar">
              <Search size={18} color="var(--treg-text-dim)" />
              <input
                placeholder="Search students, emails, tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Department Filter Area */}
          <div className="treg-filter-expand">
            <div className="treg-dept-chips">
              <button
                className={`treg-chip ${filterDept === 'all' ? 'active' : ''}`}
                onClick={() => setFilterDept('all')}
              >
                All
              </button>
              {departments.map(dept => (
                <button
                  key={dept}
                  className={`treg-chip ${filterDept === dept ? 'active' : ''}`}
                  onClick={() => setFilterDept(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions Banner */}
          {selectedIds.length > 0 && (
            <div className="treg-bulk">
              <div className="treg-bulk-text">
                {selectedIds.length} registration(s) selected
              </div>
              <div className="treg-bulk-btns">
                <button
                  className="treg-btn delete"
                  onClick={() => { if (window.confirm('Delete selected registrations?')) { /* onDeleteAll(selectedIds); */ setSelectedIds([]); } }}
                  title="Delete Selected"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  className="treg-btn reject"
                  onClick={() => { onRejectAll(selectedIds); setSelectedIds([]); }}
                >
                  Reject Selected
                </button>
                <button
                  className="treg-btn approve"
                  onClick={() => { onApproveAll(selectedIds); setSelectedIds([]); }}
                >
                  Approve Selected
                </button>
              </div>
            </div>
          )}

          {/* Data Grid */}
          <div className="treg-table-container">
            <div className="treg-card-shadow" aria-hidden="true"></div>
            {filteredRegs.length === 0 ? (
              <div className="treg-empty">
                <Users size={64} color="var(--treg-text-dim)" style={{ opacity: 0.5 }} />
                <h3>No registrations found</h3>
                <p>Adjust your search filters or wait for students to apply.</p>
              </div>
            ) : (
              <table className="treg-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        className="treg-checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Student</th>
                    <th>Dept</th>
                    <th>Event Details</th>
                    <th>Status</th>
                    <th>Ticket</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegs.map(reg => (
                    <tr key={reg._id}>
                      <td>
                        <input
                          type="checkbox"
                          className="treg-checkbox"
                          checked={selectedIds.includes(reg._id)}
                          onChange={() => handleSelectOne(reg._id)}
                        />
                      </td>
                      <td>
                        <div className="treg-student">
                          <img
                            src={getImageUrl(reg.student?.profileImage)}
                            alt="Student"
                            className="treg-avatar"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; }}
                          />
                          <div>
                            <span className="treg-name">{reg.student?.name || 'Unknown'}</span>
                            <span className="treg-email">{reg.student?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="treg-dept-badge">{reg.student?.department || 'N/A'}</div>
                      </td>
                      <td>
                        <div className="treg-details-box">
                          <div className="treg-event-title">{reg.event?.title || 'Unknown Event'}</div>
                          <div className="treg-event-date">
                            {reg.event?.date ? new Date(reg.event.date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            }) : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`treg-status ${reg.status || 'pending'}`}>
                          <StatusIcon status={reg.status} /> {reg.status || 'pending'}
                        </span>
                      </td>
                      <td>
                        <div className="treg-ticket-column">
                          {reg.status === 'approved' && (
                            <button
                              className="treg-view-ticket-link"
                              onClick={() => navigate(`/ticket/${reg._id}`)}
                            >
                              <Eye size={14} /> View Ticket
                            </button>
                          )}
                          <div className="treg-ticket-code" style={{ opacity: 0.6, fontSize: '11px', marginTop: '4px' }}>
                            {reg.ticketId || (reg.status === 'approved' ? 'TKT-PENDING' : '—')}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="treg-action-btns">
                          {(!reg.status || reg.status === 'pending') && (
                            <>
                              <button className="treg-btn approve" onClick={() => onApprove(reg._id)}>
                                Approve
                              </button>
                              <button className="treg-btn reject" onClick={() => onReject(reg._id)}>
                                Reject
                              </button>
                            </>
                          )}
                          {reg.status === 'approved' && (
                            <button className="treg-btn reject" onClick={() => onReject(reg._id)}>
                              Revoke
                            </button>
                          )}
                          {reg.status === 'rejected' && (
                            <button className="treg-btn approve" onClick={() => onApprove(reg._id)}>
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div >
    </div >
  );
};

export default TeacherRegistrations;
