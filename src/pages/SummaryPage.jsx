// pages/SummaryPage.jsx
// Shows calling progress summary and a "Clear All Data" option

import ConfirmDialog from '../components/ConfirmDialog';
import { useState } from 'react';

/**
 * Props:
 *   students   : array   — full student list with statuses
 *   onClearAll : fn()    — clears all data from localStorage + state
 */
export default function SummaryPage({ students, onClearAll }) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Compute counts for each status
  const total     = students.length;
  const called    = students.filter(s => s.status === 'called').length;
  const notPicked = students.filter(s => s.status === 'notpicked').length;
  const absent    = students.filter(s => s.status === 'absent').length;
  const pending   = students.filter(s => s.status === 'pending').length;

  // Progress percentage
  const doneCount  = called + notPicked + absent;
  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  function handleClearConfirm() {
    setShowConfirm(false);
    onClearAll();
  }

  return (
    <div className="page-content">
      <h2 className="section-title">📊 Summary</h2>

      {total === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p>No data yet. Upload a list and start calling to see the summary.</p>
        </div>
      ) : (
        <>
          {/* Overall Progress */}
          <div className="progress-box" style={{ marginBottom: 20 }}>
            <div className="progress-text" style={{ color: '#1565C0' }}>
              Overall Progress: {progressPct}% ({doneCount} of {total} contacted)
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Summary Grid */}
          <div className="summary-grid">
            <div className="summary-card sum-total">
              <div className="sum-number">{total}</div>
              <div className="sum-label">Total Students</div>
            </div>

            <div className="summary-card sum-called">
              <div className="sum-number">{called}</div>
              <div className="sum-label">Called ✅</div>
            </div>

            <div className="summary-card sum-pending">
              <div className="sum-number">{pending}</div>
              <div className="sum-label">Pending ⏳</div>
            </div>

            <div className="summary-card sum-missed">
              <div className="sum-number">{notPicked}</div>
              <div className="sum-label">Not Picked 📵</div>
            </div>

            <div className="summary-card sum-absent" style={{ gridColumn: '1 / -1' }}>
              <div className="sum-number">{absent}</div>
              <div className="sum-label">Absent Reason Taken 📝</div>
            </div>
          </div>

          {/* Student Status List */}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: '#1565C0' }}>
            All Students:
          </h3>
          {students.map((s, idx) => {
            const labels = {
              pending:   '⏳ Pending',
              called:    '✅ Called',
              notpicked: '📵 Not Picked',
              absent:    '📝 Absent Reason',
            };
            const badgeClasses = {
              pending:   'status-pending',
              called:    'status-called',
              notpicked: 'status-notpicked',
              absent:    'status-absent',
            };
            return (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderBottom: '1px solid #E0E0E0',
                  fontSize: '0.95rem',
                }}
              >
                <div>
                  <strong>{idx + 1}. {s.name}</strong>
                  <br />
                  <span style={{ color: '#555', fontSize: '0.85rem' }}>{s.phone}</span>
                </div>
                <span className={`call-status-badge ${badgeClasses[s.status] || 'status-pending'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  {labels[s.status] || '⏳ Pending'}
                </span>
              </div>
            );
          })}
        </>
      )}

      {/* Clear All Data Button */}
      <div style={{ marginTop: 32 }}>
        <button
          id="clear-all-btn"
          className="btn btn-danger"
          onClick={() => setShowConfirm(true)}
        >
          🗑️ Clear All Data
        </button>
        <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', marginTop: 6 }}>
          This will delete all students and start fresh.
        </p>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <ConfirmDialog
          title="Clear All Data?"
          message="This will permanently delete all students and call history. This cannot be undone."
          onConfirm={handleClearConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
