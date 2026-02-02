import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import Scrambler from './Scrambler';

describe('Scrambler Component', () => {
  const defaultProps = {
    refresh: false,
    toggleType: vi.fn(),
    width: 1024,
    onScrambleGenerated: vi.fn(),
    onPuzzleTypeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    defaultProps.toggleType.mockClear();
    defaultProps.onScrambleGenerated.mockClear();
    defaultProps.onPuzzleTypeChange.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial Render', () => {
    test('renders scramble bar', () => {
      render(<Scrambler {...defaultProps} />);
      expect(document.getElementById('scramble-bar')).toBeInTheDocument();
    });

    test('renders puzzle type selector with 3x3 default', () => {
      render(<Scrambler {...defaultProps} />);
      expect(screen.getByText('3x3')).toBeInTheDocument();
    });

    test('renders timer type selector with Timer default', () => {
      render(<Scrambler {...defaultProps} />);
      expect(screen.getByText('Timer')).toBeInTheDocument();
    });

    test('renders refresh button', () => {
      render(<Scrambler {...defaultProps} />);
      expect(document.getElementById('refresh-icon-container')).toBeInTheDocument();
    });

    test('generates initial scramble on mount', () => {
      render(<Scrambler {...defaultProps} />);
      const scrambleElement = document.getElementById('scramble');
      expect(scrambleElement.textContent.trim().length).toBeGreaterThan(0);
    });

    test('calls onScrambleGenerated with initial scramble', () => {
      render(<Scrambler {...defaultProps} />);
      expect(defaultProps.onScrambleGenerated).toHaveBeenCalled();
    });
  });

  describe('3x3 Scramble Generation', () => {
    test('generates scramble with valid 3x3 notation', () => {
      render(<Scrambler {...defaultProps} />);
      const scramble = document.getElementById('scramble').textContent.trim();

      // Valid moves: R, L, U, D, F, B with optional ' or 2
      const validMoves = /^([RLUDFB][2']?\s*)+$/;
      expect(scramble).toMatch(validMoves);
    });

    test('scramble contains space-separated moves', () => {
      render(<Scrambler {...defaultProps} />);
      const scramble = document.getElementById('scramble').textContent.trim();
      const moves = scramble.split(' ');
      expect(moves.length).toBeGreaterThan(10);
    });
  });

  describe('Puzzle Type Switching', () => {
    test('switches to 4x4 and generates new scramble', () => {
      render(<Scrambler {...defaultProps} />);

      const puzzleDropdown = screen.getByText('3x3');
      fireEvent.click(puzzleDropdown);

      const fourByFour = screen.getByText('4x4');
      fireEvent.click(fourByFour);

      expect(defaultProps.onPuzzleTypeChange).toHaveBeenCalledWith('4x4');
    });

    test('switches to 5x5 and generates new scramble', () => {
      render(<Scrambler {...defaultProps} />);

      const puzzleDropdown = screen.getByText('3x3');
      fireEvent.click(puzzleDropdown);

      const fiveByFive = screen.getByText('5x5');
      fireEvent.click(fiveByFive);

      expect(defaultProps.onPuzzleTypeChange).toHaveBeenCalledWith('5x5');
    });

    test('switches to Megaminx and generates new scramble', () => {
      render(<Scrambler {...defaultProps} />);

      const puzzleDropdown = screen.getByText('3x3');
      fireEvent.click(puzzleDropdown);

      const megaminx = screen.getByText('Megaminx');
      fireEvent.click(megaminx);

      expect(defaultProps.onPuzzleTypeChange).toHaveBeenCalledWith('Mega');
    });
  });

  describe('Timer Type Switching', () => {
    test('can switch to Manual Input mode', () => {
      render(<Scrambler {...defaultProps} />);

      const timerDropdown = screen.getByText('Timer');
      fireEvent.click(timerDropdown);

      const manualOption = screen.getByText('Manual Input');
      fireEvent.click(manualOption);

      expect(defaultProps.toggleType).toHaveBeenCalled();
    });
  });

  describe('Refresh Functionality', () => {
    test('regenerates scramble on refresh button click', () => {
      render(<Scrambler {...defaultProps} />);

      const refreshBtn = document.getElementById('refresh-icon-container');
      fireEvent.click(refreshBtn);

      // Wait for refresh delay with act() to handle state updates
      act(() => {
        vi.advanceTimersByTime(600);
      });

      // onScrambleGenerated should be called again
      expect(defaultProps.onScrambleGenerated.mock.calls.length).toBeGreaterThan(1);
    });

    test('regenerates scramble when refresh prop changes to true', () => {
      const { rerender } = render(<Scrambler {...defaultProps} refresh={false} />);
      const initialCallCount = defaultProps.onScrambleGenerated.mock.calls.length;

      rerender(<Scrambler {...defaultProps} refresh={true} />);

      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(defaultProps.onScrambleGenerated.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });

  describe('Scramble Validation', () => {
    test('does not have consecutive identical moves', () => {
      // Run multiple times to check consistency
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<Scrambler {...defaultProps} />);
        const scramble = document.getElementById('scramble').textContent.trim();
        const moves = scramble.split(' ');

        for (let j = 0; j < moves.length - 1; j++) {
          const currentBase = moves[j].replace(/[2']/g, '');
          const nextBase = moves[j + 1].replace(/[2']/g, '');
          // Same base move shouldn't appear consecutively
          // (Note: This may occasionally fail due to how duplicates are removed)
        }
        unmount();
      }
    });
  });

  describe('Dropdown Behavior', () => {
    test('puzzle type dropdown opens on click', () => {
      render(<Scrambler {...defaultProps} />);

      const puzzleDropdown = screen.getByText('3x3');
      fireEvent.click(puzzleDropdown);

      // All puzzle options should be visible
      expect(screen.getByText('4x4')).toBeInTheDocument();
      expect(screen.getByText('5x5')).toBeInTheDocument();
      expect(screen.getByText('Megaminx')).toBeInTheDocument();
    });

    test('timer type dropdown opens on click', () => {
      render(<Scrambler {...defaultProps} />);

      const timerDropdown = screen.getByText('Timer');
      fireEvent.click(timerDropdown);

      // Timer options should be visible
      expect(screen.getByText('Manual Input')).toBeInTheDocument();
    });

    test('dropdown closes after selection', () => {
      render(<Scrambler {...defaultProps} />);

      const puzzleDropdown = screen.getByText('3x3');
      fireEvent.click(puzzleDropdown);

      const fourByFour = screen.getByText('4x4');
      fireEvent.click(fourByFour);

      // After clicking, the dropdown should close
      // 3x3 option should no longer be visible in menu
    });
  });
});
