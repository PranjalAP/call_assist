// pages/CallingPage.jsx
// Step 3: Call parents one by one with status tracking

import { useState } from 'react';

/** Human-friendly status labels and styles */
const STATUS_INFO = {
  pending:   { label: 'Pending',             className: 'status-pending'   },
  called:    { label: '✅ Called',            className: 'status-called'    },
  notpicked: { label: '📵 Not Picked',       className: 'status-notpicked' },
  absent:    { label: '📝 Absent Reason',    className: 'status-absent'    },
};

/**
 * Props:
 *   students   : array   — saved student list
 *   onUpdate   : fn(arr) — update + persist student list
 *   showToast  : fn(msg)
 */
export default function CallingPage({ students, onUpdate, showToast }) {
  // Index of the currently shown student
  const [currentIdx, setCurrentIdx] = useState(0);

  if (students.length === 0) {
    return (
      <div className="page-content">
        <h2 className="section-title">📞 Calling Mode</h2>
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>No students saved yet.<br />Go to Upload or Edit List tab to add students.</p>
        </div>
      </div>
    );
  }

  const student  = students[currentIdx];
  const total    = students.length;
  const statusInfo = STATUS_INFO[student.status] || STATUS_INFO.pending;

  // Update the status of current student
  function setStatus(newStatus) {
    const updated = students.map((s, i) =>
      i === currentIdx ? { ...s, status: newStatus } : s
    );
    onUpdate(updated);
    showToast(`Marked as: ${STATUS_INFO[newStatus].label}`);
  }

  // Navigate to the previous student
  function goPrev() {
    setCurrentIdx(i => Math.max(0, i - 1));
  }

  // Navigate to next student
  function goNext() {
    setCurrentIdx(i => Math.min(total - 1, i + 1));
  }

  return (
    <div className="page-content">
      <h2 className="section-title">📞 Calling Mode</h2>

      <div className="calling-screen">
        {/* Counter */}
        <div className="call-counter">
          Student {currentIdx + 1} of {total}
        </div>

        {/* Student Name */}
        <div className="call-name" aria-label="Student name">
          {student.name}
        </div>

        {/* Phone Number */}
        <div className="call-phone" aria-label="Phone number">
          {student.phone}
        </div>

        {/* Current Status Badge */}
        <span className={`call-status-badge ${statusInfo.className}`}>
          {statusInfo.label}
        </span>

        {/* Call Now Button — opens phone dialer */}
        <a
          id={`call-now-btn-${student.id}`}
          className="btn btn-call"
          href={`tel:${student.phone}`}
          role="button"
          aria-label={`Call ${student.name}`}
        >
          📱 Call Now
        </a>

        <hr className="call-divider" />

        {/* Status Buttons */}
        <p style={{ fontWeight: 700, marginBottom: 12, color: '#333', textAlign: 'left' }}>
          Mark Status:
        </p>
        <div className="status-buttons">
          <button
            id="mark-called-btn"
            className="btn btn-success"
            onClick={() => setStatus('called')}
            disabled={student.status === 'called'}
          >
            ✅ Called
          </button>

          <button
            id="mark-notpicked-btn"
            className="btn btn-warning"
            onClick={() => setStatus('notpicked')}
            disabled={student.status === 'notpicked'}
          >
            📵 Not Picked
          </button>

          <button
            id="mark-absent-btn"
            className="btn btn-secondary"
            onClick={() => setStatus('absent')}
            disabled={student.status === 'absent'}
            style={{ gridColumn: '1 / -1' }}
          >
            📝 Absent Reason Taken
          </button>
        </div>

        <hr className="call-divider" />

        {/* Navigation Buttons */}
        <div className="nav-buttons">
          <button
            id="prev-student-btn"
            className="btn btn-outline"
            onClick={goPrev}
            disabled={currentIdx === 0}
          >
            ← Previous
          </button>

          <button
            id="next-student-btn"
            className="btn btn-primary"
            onClick={goNext}
            disabled={currentIdx === total - 1}
          >
            Next →
          </button>
        </div>

        {currentIdx === total - 1 && (
          <div className="info-box" style={{ marginTop: 16, textAlign: 'left' }}>
            🎉 You have reached the last student! Go to Summary tab to see the report.
          </div>
        )}
      </div>
    </div>
  );
}
