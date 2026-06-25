// components/Toast.jsx
// Simple toast notification that auto-dismisses

import { useEffect } from 'react';

/**
 * Toast component — shows a short message at the bottom of the screen.
 * Props:
 *   message  : string  — text to display
 *   onClose  : fn      — called when toast should disappear
 *   duration : number  — ms before auto-close (default 2500)
 */
export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="toast" role="alert" aria-live="polite">
      {message}
    </div>
  );
}
