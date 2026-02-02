import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import SolveDetailModal from './SolveDetailModal';

// Helper to create solve objects
const createSolve = (id, timeMs, penalty = 'none') => ({
  id,
  timeMs,
  penalizedTimeMs: penalty === 'DNF' ? Infinity : penalty === '+2' ? timeMs + 2000 : timeMs,
  penalty,
  displayTime:
    penalty === 'DNF'
      ? 'DNF'
      : `${((penalty === '+2' ? timeMs + 2000 : timeMs) / 1000).toFixed(2)}`,
  scramble: "R U R' U' R' F R2 U' R' U R U R' F'",
  timestamp: Date.now(),
  puzzleType: '3x3',
});

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  solve: createSolve(1, 10000),
  solveNumber: 1,
  onApplyPenalty: vi.fn(),
  onDelete: vi.fn(),
};

describe('SolveDetailModal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    defaultProps.onClose.mockClear();
    defaultProps.onApplyPenalty.mockClear();
    defaultProps.onDelete.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    test('renders when isOpen is true and solve is provided', () => {
      render(<SolveDetailModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Solve Details')).toBeInTheDocument();
    });

    test('does not render when isOpen is false', () => {
      render(<SolveDetailModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('does not render when solve is null', () => {
      render(<SolveDetailModal {...defaultProps} solve={null} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    test('shows solve number', () => {
      render(<SolveDetailModal {...defaultProps} solveNumber={5} />);

      expect(screen.getByText('Solve #5')).toBeInTheDocument();
    });

    test('shows display time', () => {
      const solve = createSolve(1, 12340); // 12.34s (12340ms / 1000 = 12.34)
      render(<SolveDetailModal {...defaultProps} solve={solve} />);

      expect(screen.getByText('12.34')).toBeInTheDocument();
    });

    test('shows scramble', () => {
      render(<SolveDetailModal {...defaultProps} />);

      expect(screen.getByText("R U R' U' R' F R2 U' R' U R U R' F'")).toBeInTheDocument();
    });

    test('shows no scramble message when scramble is missing', () => {
      const solve = { ...createSolve(1, 10000), scramble: null };
      render(<SolveDetailModal {...defaultProps} solve={solve} />);

      expect(screen.getByText('No scramble recorded')).toBeInTheDocument();
    });

    test('shows puzzle type', () => {
      render(<SolveDetailModal {...defaultProps} />);

      expect(screen.getByText('3x3')).toBeInTheDocument();
    });

    test('shows original time when +2 penalty applied', () => {
      const solve = createSolve(1, 10000, '+2');
      render(<SolveDetailModal {...defaultProps} solve={solve} />);

      // Original time should be visible
      expect(screen.getByText(/Original time:/)).toBeInTheDocument();
    });

    test('shows DNF badge when DNF penalty', () => {
      const solve = createSolve(1, 10000, 'DNF');
      render(<SolveDetailModal {...defaultProps} solve={solve} />);

      // DNF badge should be visible
      const dnfBadge = document.querySelector('.solve-modal-dnf-badge');
      expect(dnfBadge).toBeInTheDocument();
      expect(dnfBadge).toHaveTextContent('DNF');
    });
  });

  describe('Penalty Buttons', () => {
    test('+2 button calls onApplyPenalty with +2', () => {
      render(<SolveDetailModal {...defaultProps} />);

      const plusTwoBtn = screen.getByRole('button', { name: '+2' });
      fireEvent.click(plusTwoBtn);

      expect(defaultProps.onApplyPenalty).toHaveBeenCalledWith('+2');
    });

    test('DNF button calls onApplyPenalty with DNF', () => {
      render(<SolveDetailModal {...defaultProps} />);

      const dnfBtn = screen.getByRole('button', { name: 'DNF' });
      fireEvent.click(dnfBtn);

      expect(defaultProps.onApplyPenalty).toHaveBeenCalledWith('DNF');
    });

    test('Clear Penalty button calls onApplyPenalty with none', () => {
      const solve = createSolve(1, 10000, '+2');
      render(<SolveDetailModal {...defaultProps} solve={solve} />);

      const clearBtn = screen.getByRole('button', { name: 'Clear Penalty' });
      fireEvent.click(clearBtn);

      expect(defaultProps.onApplyPenalty).toHaveBeenCalledWith('none');
    });

    test('Clear Penalty button is disabled when no penalty', () => {
      render(<SolveDetailModal {...defaultProps} />);

      const clearBtn = screen.getByRole('button', { name: 'Clear Penalty' });
      expect(clearBtn).toBeDisabled();
    });

    test('+2 button has aria-pressed true when +2 penalty active', () => {
      const solve = createSolve(1, 10000, '+2');
      render(<SolveDetailModal {...defaultProps} solve={solve} />);

      const plusTwoBtn = screen.getByRole('button', { name: '+2' });
      expect(plusTwoBtn).toHaveAttribute('aria-pressed', 'true');
    });

    test('DNF button has aria-pressed true when DNF penalty active', () => {
      const solve = createSolve(1, 10000, 'DNF');
      render(<SolveDetailModal {...defaultProps} solve={solve} />);

      const dnfBtn = screen.getByRole('button', { name: 'DNF' });
      expect(dnfBtn).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Delete Functionality', () => {
    test('Delete button calls onDelete', () => {
      render(<SolveDetailModal {...defaultProps} />);

      const deleteBtn = screen.getByRole('button', { name: 'Delete Solve' });
      fireEvent.click(deleteBtn);

      expect(defaultProps.onDelete).toHaveBeenCalled();
    });
  });

  describe('Close Functionality', () => {
    test('Close button calls onClose', () => {
      render(<SolveDetailModal {...defaultProps} />);

      const closeBtn = screen.getByRole('button', { name: 'Close solve details' });
      fireEvent.click(closeBtn);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    test('clicking overlay calls onClose', () => {
      render(<SolveDetailModal {...defaultProps} />);

      const overlay = document.querySelector('.solve-modal-overlay');
      fireEvent.click(overlay);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    test('clicking modal content does not close', () => {
      render(<SolveDetailModal {...defaultProps} />);

      const modalContent = document.querySelector('.solve-modal-container');
      fireEvent.click(modalContent);

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    test('Escape key closes modal', () => {
      render(<SolveDetailModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Body Scroll Prevention', () => {
    test('body overflow is hidden when modal is open', () => {
      render(<SolveDetailModal {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(document.body.style.overflow).toBe('hidden');
    });

    test('body overflow is restored when modal closes', () => {
      const { rerender } = render(<SolveDetailModal {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      rerender(<SolveDetailModal {...defaultProps} isOpen={false} />);

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Accessibility', () => {
    test('has role="dialog"', () => {
      render(<SolveDetailModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('has aria-modal="true"', () => {
      render(<SolveDetailModal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    test('has aria-labelledby pointing to title', () => {
      render(<SolveDetailModal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

      const title = document.getElementById('modal-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Solve Details');
    });

    test('close button has aria-label', () => {
      render(<SolveDetailModal {...defaultProps} />);

      const closeBtn = screen.getByRole('button', { name: 'Close solve details' });
      expect(closeBtn).toHaveAttribute('aria-label', 'Close solve details');
    });
  });

  describe('Time Formatting', () => {
    test('formats sub-minute times correctly', () => {
      const solve = createSolve(1, 45670); // 45.67s
      render(<SolveDetailModal {...defaultProps} solve={solve} />);

      expect(screen.getByText('45.67')).toBeInTheDocument();
    });

    test('handles solve with default puzzle type', () => {
      const solve = { ...createSolve(1, 10000), puzzleType: undefined };
      render(<SolveDetailModal {...defaultProps} solve={solve} />);

      // Should fall back to 3x3
      expect(screen.getByText('3x3')).toBeInTheDocument();
    });
  });
});
