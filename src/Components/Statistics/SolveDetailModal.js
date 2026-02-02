import React, { useEffect, useRef } from 'react';
import './SolveModal.css';

const SolveDetailModal = ({
  isOpen,
  onClose,
  solve,
  solveNumber,
  onApplyPenalty,
  onDelete
}) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && isOpen && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement;

      // Focus close button after short delay for animation
      setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
      }, 100);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore previous focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !solve) return null;

  const { displayTime, scramble, penalty, timestamp, puzzleType, timeMs } = solve;

  // Format original time (without penalty)
  const formatTime = (ms) => {
    if (ms === undefined || ms === null) return '--';
    const pad = (n, z = 2) => ('00' + n).slice(-z);
    if (ms < 60000) {
      return pad((ms % 6e4) / 1000 | 0) + '.' + pad(ms % 1000, 2);
    } else if (ms >= 60000 && ms < 3600000) {
      return pad((ms % 3.6e6) / 6e4 | 0) + ':' + pad((ms % 6e4) / 1000 | 0) + '.' + pad(ms % 1000, 2);
    } else {
      return pad(ms / 3.6e6 | 0) + ':' + pad((ms % 3.6e6) / 6e4 | 0) + ':' + pad((ms % 6e4) / 1000 | 0) + '.' + pad(ms % 1000, 2);
    }
  };

  const originalTime = formatTime(timeMs);
  const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : '--';

  return (
    <div
      className="solve-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="solve-modal-container" ref={modalRef}>
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          className="solve-modal-close"
          onClick={onClose}
          aria-label="Close solve details"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="solve-modal-header">
          <h2 id="modal-title" className="solve-modal-title">Solve Details</h2>
          <span className="solve-modal-number">Solve #{solveNumber}</span>
        </div>

        {/* Time Display */}
        <div className="solve-modal-time-section">
          <div className={`solve-modal-time ${penalty === 'DNF' ? 'dnf' : ''}`}>
            {displayTime}
          </div>
          {penalty === 'DNF' && (
            <div className="solve-modal-dnf-badge">DNF</div>
          )}
        </div>

        {/* Original Time (if penalty applied) */}
        {penalty !== 'none' && (
          <div className="solve-modal-original-time">
            Original time: {originalTime}
          </div>
        )}

        {/* Scramble */}
        <div className="solve-modal-scramble-section">
          <h3 className="solve-modal-section-title">Scramble</h3>
          <div className="solve-modal-scramble">
            {scramble || 'No scramble recorded'}
          </div>
        </div>

        {/* Details */}
        <div className="solve-modal-details">
          <div className="solve-modal-detail-row">
            <span className="solve-modal-detail-label">Puzzle:</span>
            <span className="solve-modal-detail-value">{puzzleType || '3x3'}</span>
          </div>
          <div className="solve-modal-detail-row">
            <span className="solve-modal-detail-label">Date:</span>
            <span className="solve-modal-detail-value">{formattedDate}</span>
          </div>
        </div>

        {/* Penalty Controls */}
        <div className="solve-modal-penalty-section">
          <h3 className="solve-modal-section-title">Penalty</h3>
          <div className="solve-modal-penalty-buttons">
            <button
              className={`solve-modal-penalty-btn ${penalty === '+2' ? 'active' : ''}`}
              onClick={() => onApplyPenalty('+2')}
              aria-pressed={penalty === '+2'}
            >
              +2
            </button>
            <button
              className={`solve-modal-penalty-btn ${penalty === 'DNF' ? 'active' : ''}`}
              onClick={() => onApplyPenalty('DNF')}
              aria-pressed={penalty === 'DNF'}
            >
              DNF
            </button>
            <button
              className={`solve-modal-penalty-btn clear ${penalty === 'none' ? 'active' : ''}`}
              onClick={() => onApplyPenalty('none')}
              disabled={penalty === 'none'}
              aria-pressed={penalty === 'none'}
            >
              Clear Penalty
            </button>
          </div>
        </div>

        {/* Delete Button */}
        <div className="solve-modal-actions">
          <button className="solve-modal-delete-btn" onClick={onDelete}>
            Delete Solve
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolveDetailModal;
