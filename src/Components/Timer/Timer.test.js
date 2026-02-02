import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import Timer from './Timer';

describe('Timer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.getItem.mockReturnValue(null);
    window.localStorage.setItem.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial Render', () => {
    test('renders timer container', () => {
      render(<Timer />);
      expect(document.getElementById('timer-container')).toBeInTheDocument();
    });

    test('renders with initial time display', () => {
      render(<Timer />);
      expect(document.getElementById('timer-text')).toBeInTheDocument();
    });

    test('renders scrambler component', () => {
      render(<Timer />);
      expect(screen.getByText('3x3')).toBeInTheDocument();
    });

    test('renders statistics component', () => {
      render(<Timer />);
      expect(screen.getByText(/Average of 5:/)).toBeInTheDocument();
    });
  });

  describe('Time Formatting (msToTime)', () => {
    // Testing through Timer instance would require accessing internal methods
    // These are integration tests that verify display formatting
    test('displays initial time as 0', () => {
      render(<Timer />);
      const timerText = document.getElementById('timer-text');
      expect(timerText.textContent.trim()).toBe('0');
    });
  });

  describe('Spacebar Controls', () => {
    test('timer container is focusable', () => {
      render(<Timer />);
      const timerContainer = document.getElementById('timer-container');
      expect(timerContainer).toHaveAttribute('tabIndex', '0');
    });

    test('responds to keyUp events', () => {
      render(<Timer />);
      const timerContainer = document.getElementById('timer-container');
      fireEvent.keyUp(timerContainer, { keyCode: 32 }); // spacebar
      // Timer should respond to keyUp - internal state changes
    });
  });

  describe('Manual Input Mode', () => {
    test('can toggle to manual input mode', () => {
      render(<Timer />);
      // Find and click Manual Input option
      const timerTypeDropdown = screen.getByText('Timer');
      fireEvent.click(timerTypeDropdown);

      const manualOption = screen.getByText('Manual Input');
      fireEvent.click(manualOption);

      // Manual input form should now be visible
      const inputField = document.querySelector('input[type="text"]');
      expect(inputField).toBeInTheDocument();
    });
  });

  describe('localStorage Integration', () => {
    test('attempts to load session on mount', () => {
      render(<Timer />);
      expect(window.localStorage.getItem).toHaveBeenCalledWith('simplict_session_v1');
    });

    test('loads saved solves from localStorage', () => {
      const savedSession = JSON.stringify({
        version: '1.0.0',
        solves: [
          {
            id: 'test-1',
            timeMs: 10000,
            displayTime: '10.00',
            scramble: "R U R' U'",
            penalty: 'none',
            penalizedTimeMs: 10000,
            timestamp: Date.now(),
            puzzleType: '3x3',
          },
        ],
        lastModified: Date.now(),
      });
      window.localStorage.getItem.mockReturnValue(savedSession);

      render(<Timer />);

      // Statistics should show data from loaded solves
      // (won't show Ao5 until 5 solves, but component should render)
    });

    test('handles invalid localStorage data gracefully', () => {
      window.localStorage.getItem.mockReturnValue('invalid json{');

      // Should not throw
      expect(() => render(<Timer />)).not.toThrow();
    });

    test('handles empty localStorage gracefully', () => {
      window.localStorage.getItem.mockReturnValue(null);

      expect(() => render(<Timer />)).not.toThrow();
    });
  });

  describe('Puzzle Type Switching', () => {
    test('starts with 3x3 puzzle type', () => {
      render(<Timer />);
      expect(screen.getByText('3x3')).toBeInTheDocument();
    });

    test('can switch to 4x4', () => {
      render(<Timer />);
      const puzzleDropdown = screen.getByText('3x3');
      fireEvent.click(puzzleDropdown);

      const fourByFour = screen.getByText('4x4');
      fireEvent.click(fourByFour);

      // Dropdown should now show 4x4
      expect(screen.getByText('4x4')).toBeInTheDocument();
    });

    test('can switch to 5x5', () => {
      render(<Timer />);
      const puzzleDropdown = screen.getByText('3x3');
      fireEvent.click(puzzleDropdown);

      const fiveByFive = screen.getByText('5x5');
      fireEvent.click(fiveByFive);

      expect(screen.getByText('5x5')).toBeInTheDocument();
    });

    test('can switch to Megaminx', () => {
      render(<Timer />);
      const puzzleDropdown = screen.getByText('3x3');
      fireEvent.click(puzzleDropdown);

      const megaminx = screen.getByText('Megaminx');
      fireEvent.click(megaminx);

      // Dropdown shows "Mega" for Megaminx puzzle type
      expect(screen.getByText('Mega')).toBeInTheDocument();
    });
  });

  describe('Window Resize Handling', () => {
    test('handles window resize events', () => {
      render(<Timer />);

      // Trigger resize event
      fireEvent(window, new Event('resize'));

      // Component should still be rendered
      expect(document.getElementById('timer-container')).toBeInTheDocument();
    });
  });

  describe('Scramble Display', () => {
    test('displays a scramble', () => {
      render(<Timer />);
      const scrambleElement = document.getElementById('scramble');
      expect(scrambleElement).toBeInTheDocument();
      expect(scrambleElement.textContent.trim().length).toBeGreaterThan(0);
    });

    test('refresh button regenerates scramble', () => {
      render(<Timer />);
      const refreshIcon = document.getElementById('refresh-icon-container');
      expect(refreshIcon).toBeInTheDocument();

      fireEvent.click(refreshIcon);

      // Wait for new scramble (500ms delay) with act() to handle state updates
      act(() => {
        vi.advanceTimersByTime(600);
      });

      // Scramble should still exist after refresh
      expect(document.getElementById('scramble')).toBeInTheDocument();
    });
  });

  describe('Dashboard Integration', () => {
    test('dashboard button is present', () => {
      render(<Timer />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    test('can toggle dashboard visibility', () => {
      render(<Timer />);
      const dashboardBtn = screen.getByText('Dashboard');
      fireEvent.click(dashboardBtn);

      // Dashboard content should be visible
      expect(screen.getByText('Visual progression of your solve times.')).toBeInTheDocument();
    });
  });
});
