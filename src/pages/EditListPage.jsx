// pages/EditListPage.jsx
// Step 2: Review, edit, add, or delete extracted students before saving

import { useState } from 'react';
import { generateId } from '../utils/storage';
import ConfirmDialog from '../components/ConfirmDialog';

/**
 * Props:
 *   students        : array   — current student list
 *   onUpdate        : fn(arr) — update student list in parent
 *   onSave          : fn()    — save to localStorage and switch to calling mode
 *   showToast       : fn(msg)
 */
export default function EditListPage({ students, onUpdate, onSave, showToast }) {
  const [deleteId, setDeleteId] = useState(null); // ID of student pending delete confirm
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Update a single field of a student card
  function updateField(id, field, value) {
    onUpdate(students.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  // Validate phone: must be exactly 10 digits starting with 6-9
  function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
  }

  // Add a new student manually
  function handleAddStudent() {
    const trimName  = newName.trim() || 'Unknown Student';
    const trimPhone = newPhone.replace(/\s/g, '').trim();

    if (!isValidPhone(trimPhone)) {
      showToast('Phone must be a valid 10-digit Indian mobile number.');
      return;
    }

    // Check duplicate
    if (students.some(s => s.phone === trimPhone)) {
      showToast('This number already exists in the list.');
      return;
    }

    onUpdate([
      ...students,
      { id: generateId(), name: trimName, phone: trimPhone, status: 'pending' },
    ]);
    setNewName('');
    setNewPhone('');
    setShowAddForm(false);
    showToast('Student added!');
  }

  // Delete confirmed student
  function handleDeleteConfirmed() {
    onUpdate(students.filter(s => s.id !== deleteId));
    setDeleteId(null);
    showToast('Student removed.');
  }

  // Save list: validate all entries first
  function handleSave() {
    if (students.length === 0) {
      showToast('No students to save. Please add some first.');
      return;
    }

    const invalid = students.filter(s => !isValidPhone(s.phone));
    if (invalid.length > 0) {
      showToast(`${invalid.length} student(s) have invalid phone numbers. Please fix them.`);
      return;
    }

    onSave();
    showToast('✅ List saved! Go to Calling tab to start.');
  }

  return (
    <>
      <div className="page-content">
        <h2 className="section-title">✏️ Review & Edit Students</h2>

        {students.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>No students yet.<br />Upload an image or add students manually below.</p>
          </div>
        ) : (
          <p className="list-count">Total students: <strong>{students.length}</strong></p>
        )}

        {/* Add Student Form */}
        {showAddForm ? (
          <div className="add-form">
            <h3>➕ Add New Student</h3>
            <label className="field-label" htmlFor="new-name-input">Name</label>
            <input
              id="new-name-input"
              type="text"
              placeholder="Student / Parent Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <label className="field-label" htmlFor="new-phone-input">Phone Number</label>
            <input
              id="new-phone-input"
              type="tel"
              placeholder="10-digit mobile number"
              value={newPhone}
              onChange={e => setNewPhone(e.target.value)}
              maxLength={10}
            />
            <button id="confirm-add-btn" className="btn btn-success" onClick={handleAddStudent}>
              ✅ Add Student
            </button>
            <button id="cancel-add-btn" className="btn btn-outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button id="show-add-form-btn" className="btn btn-outline" onClick={() => setShowAddForm(true)}>
            ➕ Add Student Manually
          </button>
        )}

        {/* Student Cards */}
        {students.map((student, idx) => (
          <div key={student.id} className="student-card">
            <div className="card-num">{idx + 1}</div>

            <div className="field-label">Name</div>
            <input
              id={`name-input-${student.id}`}
              type="text"
              value={student.name}
              onChange={e => updateField(student.id, 'name', e.target.value)}
              placeholder="Student Name"
              aria-label={`Name of student ${idx + 1}`}
            />

            <div className="field-label">Phone Number</div>
            <input
              id={`phone-input-${student.id}`}
              type="tel"
              value={student.phone}
              onChange={e => updateField(student.id, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit number"
              className={isValidPhone(student.phone) ? '' : 'error'}
              aria-label={`Phone number of student ${idx + 1}`}
              maxLength={10}
            />
            {!isValidPhone(student.phone) && (
              <p style={{ color: '#B71C1C', fontSize: '0.8rem', marginTop: -8, marginBottom: 8 }}>
                ⚠️ Enter valid 10-digit number
              </p>
            )}

            <div className="card-actions">
              <button
                id={`delete-btn-${student.id}`}
                className="btn btn-danger btn-sm"
                onClick={() => setDeleteId(student.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}

        {/* Spacer for sticky button */}
        <div style={{ height: 80 }} />
      </div>

      {/* Sticky Save Button */}
      {students.length > 0 && (
        <div className="sticky-save">
          <button id="save-list-btn" className="btn btn-success" onClick={handleSave}>
            💾 Save List &amp; Start Calling
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <ConfirmDialog
          title="Delete Student?"
          message="Are you sure you want to remove this student from the list?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </>
  );
}
