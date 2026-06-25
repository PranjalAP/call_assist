// pages/UploadPage.jsx
// Step 1: Upload image, run OCR, parse students

import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { parseStudents } from '../utils/parseStudents';
import { generateId } from '../utils/storage';

/**
 * Props:
 *   onStudentsExtracted : fn(students[]) — called with parsed students list
 *   showToast           : fn(msg)        — display a toast message
 */
export default function UploadPage({ onStudentsExtracted, showToast }) {
  const [imageFile, setImageFile] = useState(null);       // Selected file object
  const [imagePreview, setImagePreview] = useState(null); // Object URL for preview
  const [ocrStatus, setOcrStatus] = useState('idle');     // idle | loading | done | error
  const [ocrProgress, setOcrProgress] = useState(0);      // 0–100
  const [ocrText, setOcrText] = useState('');             // Raw OCR output
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);

  // Handle file selection (from input or drag-drop)
  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setOcrStatus('idle');
    setOcrText('');
    setOcrProgress(0);
  }

  function handleInputChange(e) {
    handleFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  // Run Tesseract OCR on the selected image
  async function runOCR() {
    if (!imageFile) {
      showToast('Please select an image first.');
      return;
    }

    setOcrStatus('loading');
    setOcrProgress(0);
    setOcrText('');

    try {
      const result = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m) => {
          // Update progress bar based on Tesseract progress messages
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const rawText = result.data.text;
      setOcrText(rawText);

      // Parse extracted text into structured student list
      const parsed = parseStudents(rawText);

      // Add unique IDs (generateId ensures uniqueness across sessions)
      const withIds = parsed.map(s => ({ ...s, id: generateId() }));

      setOcrStatus('done');

      if (withIds.length === 0) {
        showToast('No mobile numbers found. Please check the image.');
      } else {
        showToast(`Found ${withIds.length} student(s)! Please review below.`);
        onStudentsExtracted(withIds);
      }
    } catch (err) {
      console.error('OCR error:', err);
      setOcrStatus('error');
      showToast('OCR failed. Please try a clearer image.');
    }
  }

  return (
    <div className="page-content">
      <h2 className="section-title">📷 Upload Student List</h2>

      <div className="info-box">
        Take a photo of your student list and upload it here.
        The app will automatically read the names and phone numbers.
      </div>

      {/* Upload Area */}
      <div
        className={`upload-area${dragOver ? ' drag-over' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
        onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <span className="upload-icon">📂</span>
        <p>Tap here to select a photo</p>
        <small>Or drag and drop an image</small>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="image-file-input"
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {/* Image Preview */}
      {imagePreview && (
        <>
          <p style={{ fontWeight: 600, color: '#555', marginBottom: 6 }}>Preview:</p>
          <img
            src={imagePreview}
            alt="Uploaded student list preview"
            className="image-preview"
          />

          {/* Extract Button */}
          {ocrStatus !== 'loading' && (
            <button
              id="extract-students-btn"
              className="btn btn-primary"
              onClick={runOCR}
            >
              🔍 Extract Students
            </button>
          )}
        </>
      )}

      {/* Progress during OCR */}
      {ocrStatus === 'loading' && (
        <div className="progress-box" role="status" aria-live="polite">
          <div className="progress-text">
            Reading image... {ocrProgress}%
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{ width: `${ocrProgress}%` }}
            />
          </div>
          <p style={{ fontSize: '0.85rem', marginTop: 10, color: '#555' }}>
            Please wait. This may take 10–30 seconds.
          </p>
        </div>
      )}

      {/* Success message */}
      {ocrStatus === 'done' && (
        <div className="progress-box" style={{ borderColor: '#2E7D32', background: '#E8F5E9' }}>
          <div className="progress-text" style={{ color: '#2E7D32' }}>
            ✅ OCR Complete!
          </div>
          <p style={{ fontSize: '0.85rem', color: '#555', marginTop: 6 }}>
            Go to <strong>Edit List</strong> tab to review and edit.
          </p>
        </div>
      )}

      {/* Error message */}
      {ocrStatus === 'error' && (
        <div className="warn-box">
          ❌ Could not read the image. Please try again with a clearer photo.
        </div>
      )}

      {/* Show raw OCR text for user reference */}
      {ocrText ? (
        <>
          <p style={{ fontWeight: 700, color: '#555', marginBottom: 6, marginTop: 12 }}>
            Raw Text from Image:
          </p>
          <div className="ocr-raw" aria-label="OCR extracted text">
            {ocrText}
          </div>
        </>
      ) : null}
    </div>
  );
}
