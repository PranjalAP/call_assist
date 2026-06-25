// components/ConfirmDialog.jsx
// A modal dialog asking the user to confirm a dangerous action

/**
 * Props:
 *   title    : string  — dialog title
 *   message  : string  — body text
 *   onConfirm: fn      — called when user clicks "Yes, Delete"
 *   onCancel : fn      — called when user clicks "Cancel"
 */
export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true">
      <div className="dialog-box">
        <h3>⚠️ {title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button
            id="confirm-cancel-btn"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            id="confirm-ok-btn"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
