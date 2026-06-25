// utils/parseStudents.js
// Parses OCR text to extract student names and Indian 10-digit phone numbers

/**
 * Parse raw OCR text and return a list of student objects.
 * Handles formats like:
 *   Rahul Sharma 9876543210
 *   Priya Patil - 9123456789
 *   Amit 9988776655
 *   9876543210 Ravi Kumar
 */
export function parseStudents(rawText) {
  if (!rawText) return [];

  const lines = rawText.split('\n');
  const seenNumbers = new Set(); // Track duplicate numbers
  const students = [];

  for (let line of lines) {
    // Remove extra whitespace
    line = line.trim();
    if (!line) continue;

    // Try to find a 10-digit Indian mobile number in the line
    // Tesseract often adds spaces or dashes between digits.
    // Let's find any sequence of 10 digits (ignoring spaces/dashes) starting with 6-9.
    const normalizedLine = line.replace(/[-\s.]/g, ''); // strip spaces and dashes for checking
    const phoneMatch = normalizedLine.match(/([6-9]\d{9})/);
    
    if (!phoneMatch) continue; // Skip lines without a valid number

    const phone = phoneMatch[1];

    // Skip duplicate numbers
    if (seenNumbers.has(phone)) continue;
    seenNumbers.add(phone);

    // Extract name: remove the found phone number (and common separators) from the ORIGINAL line
    // Since the original line might have spaces in the phone, we just strip ALL digits to get the name
    let namePart = line
      .replace(/\d/g, '')          // Remove all digits
      .replace(/[-–—|,.:;#*]/g, ' ') // Remove common separators
      .replace(/\s+/g, ' ')        // Collapse whitespace
      .trim();

    // Basic cleanup: remove stray single characters
    namePart = namePart.replace(/\b\w\b/g, '').trim();

    // If name is too short or empty, mark as Unknown
    const name = namePart.length >= 2 ? capitalize(namePart) : 'Unknown Student';

    students.push({
      id: generateTempId(phone),
      name,
      phone,
      status: 'pending', // pending | called | notpicked | absent
    });
  }

  return students;
}

/** Capitalize each word of a string */
function capitalize(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Simple deterministic temp ID based on phone */
function generateTempId(phone) {
  return 'stu_' + phone;
}
