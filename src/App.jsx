// App.jsx
// Root component — manages global state, navigation, and localStorage sync

import { useState, useCallback } from 'react';
import UploadPage   from './pages/UploadPage';
import EditListPage from './pages/EditListPage';
import CallingPage  from './pages/CallingPage';
import SummaryPage  from './pages/SummaryPage';
import Toast        from './components/Toast';
import { loadStudents, saveStudents, clearStudents } from './utils/storage';
import './index.css';

// Navigation tab definitions
const TABS = [
  { id: 'upload',   label: '📷 Upload'  },
  { id: 'edit',     label: '✏️ Edit List' },
  { id: 'calling',  label: '📞 Calling'  },
  { id: 'summary',  label: '📊 Summary'  },
];

export default function App() {
  // Students are the single source of truth — synced to localStorage
  const [students, setStudents] = useState(() => loadStudents());
  const [activeTab, setActiveTab] = useState('upload');
  const [toastMsg, setToastMsg]   = useState('');

  // Show a toast notification
  const showToast = useCallback((msg) => {
    setToastMsg('');                   // reset first so re-trigger works
    setTimeout(() => setToastMsg(msg), 10);
  }, []);

  // Called when OCR extracts students — MERGE with existing (avoid overwrite)
  function handleStudentsExtracted(newStudents) {
    setStudents(prev => {
      const existingPhones = new Set(prev.map(s => s.phone));
      const unique = newStudents.filter(s => !existingPhones.has(s.phone));
      const merged = [...prev, ...unique];
      return merged;
    });
    setActiveTab('edit'); // Auto-navigate to Edit tab
  }

  // Update student list in state (used by edit and calling pages)
  function updateStudents(updated) {
    setStudents(updated);
  }

  // Save to localStorage and switch to calling mode
  function handleSave() {
    saveStudents(students);
    setActiveTab('calling');
  }

  // Update students AND persist immediately (used in calling page for status changes)
  function updateAndPersist(updated) {
    setStudents(updated);
    saveStudents(updated);
  }

  // Clear all data
  function handleClearAll() {
    clearStudents();
    setStudents([]);
    setActiveTab('upload');
    showToast('All data cleared.');
  }

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div>
          <h1>📞 Parent Call Assistant</h1>
          <div className="subtitle">
            {students.length > 0
              ? `${students.length} students saved`
              : 'Upload a student list to begin'}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs" role="tablist" aria-label="Main navigation">
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Page Content — render only the active tab */}
      {activeTab === 'upload' && (
        <UploadPage
          onStudentsExtracted={handleStudentsExtracted}
          showToast={showToast}
        />
      )}

      {activeTab === 'edit' && (
        <EditListPage
          students={students}
          onUpdate={updateStudents}
          onSave={handleSave}
          showToast={showToast}
        />
      )}

      {activeTab === 'calling' && (
        <CallingPage
          students={students}
          onUpdate={updateAndPersist}
          showToast={showToast}
        />
      )}

      {activeTab === 'summary' && (
        <SummaryPage
          students={students}
          onClearAll={handleClearAll}
        />
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <Toast
          message={toastMsg}
          onClose={() => setToastMsg('')}
        />
      )}
    </div>
  );
}
