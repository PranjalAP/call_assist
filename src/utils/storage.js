// utils/storage.js
// Handles all localStorage operations for student data

const STORAGE_KEY = 'parent_call_students';

/** Load students from localStorage */
export function loadStudents() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/** Save students array to localStorage */
export function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

/** Clear all student data from localStorage */
export function clearStudents() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Generate a simple unique ID */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
