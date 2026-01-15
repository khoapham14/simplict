import { render } from '@testing-library/react';
import { vi } from 'vitest';

// Helper to calculate penalized time
export const calculatePenalizedTime = (timeMs, penalty) => {
  if (penalty === 'DNF') return Infinity;
  if (penalty === '+2') return timeMs + 2000;
  return timeMs;
};

// Helper to format time for display
export const msToDisplayTime = (timeMs, penalty) => {
  if (penalty === 'DNF') return 'DNF';

  const pad = (n, z = 2) => ('00' + n).slice(-z);
  let time = '';

  if (timeMs < 60000) {
    time = pad(((timeMs % 6e4) / 1000) | 0) + '.' + pad(timeMs % 1000, 2);
  } else if (timeMs >= 60000 && timeMs < 3600000) {
    time =
      pad(((timeMs % 3.6e6) / 6e4) | 0) +
      ':' +
      pad(((timeMs % 6e4) / 1000) | 0) +
      '.' +
      pad(timeMs % 1000, 2);
  } else {
    time =
      pad((timeMs / 3.6e6) | 0) +
      ':' +
      pad(((timeMs % 3.6e6) / 6e4) | 0) +
      ':' +
      pad(((timeMs % 6e4) / 1000) | 0) +
      '.' +
      pad(timeMs % 1000, 2);
  }

  if (penalty === '+2') time += '+';
  return time;
};

// Helper to create solve objects
export const createSolve = (
  id,
  timeMs,
  penalty = 'none',
  scramble = "R U R' U'",
  puzzleType = '3x3'
) => ({
  id: id || `solve-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  timeMs,
  displayTime: msToDisplayTime(timeMs, penalty),
  scramble,
  penalty,
  penalizedTimeMs: calculatePenalizedTime(timeMs, penalty),
  timestamp: Date.now(),
  puzzleType,
});

// Create multiple solves helper
export const createSolves = (times, options = {}) => {
  return times.map((time, index) => {
    if (typeof time === 'object') {
      return createSolve(
        time.id || `solve-${index}`,
        time.timeMs,
        time.penalty || 'none',
        time.scramble,
        time.puzzleType
      );
    }
    return createSolve(`solve-${index}`, time, options.penalty || 'none');
  });
};

// Mock localStorage helpers
export const mockLocalStorage = () => {
  const store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn(key => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    _store: store,
  };
};

// Mock timer helpers
export const mockTimers = () => {
  vi.useFakeTimers();
  return {
    advanceTime: ms => vi.advanceTimersByTime(ms),
    runAllTimers: () => vi.runAllTimers(),
    clearAllTimers: () => vi.clearAllTimers(),
    restoreTimers: () => vi.useRealTimers(),
  };
};

// Custom render with common providers (if needed in future)
export const renderWithProviders = (ui, options = {}) => {
  return render(ui, { ...options });
};

// Wait for async updates
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Keyboard event helpers
export const pressKey = (element, key, keyCode) => {
  const event = new KeyboardEvent('keyup', { key, keyCode, bubbles: true });
  element.dispatchEvent(event);
};

export const pressKeyDown = (element, key, keyCode) => {
  const event = new KeyboardEvent('keydown', { key, keyCode, bubbles: true });
  element.dispatchEvent(event);
};

export const pressSpace = element => pressKey(element, ' ', 32);

export const pressEscape = (element = document) => {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
  element.dispatchEvent(event);
};

export const pressEnter = element => pressKey(element, 'Enter', 13);

// Default props for Statistics component
export const defaultStatisticsProps = {
  solves: [],
  clearRecord: vi.fn(),
  onDeleteSolve: vi.fn(),
  onOpenSolveDetail: vi.fn(),
  onCloseSolveDetail: vi.fn(),
  onApplyPenalty: vi.fn(),
  showSolveDetail: false,
  selectedSolve: null,
  selectedSolveNumber: null,
};

// Default props for Scrambler component
export const defaultScramblerProps = {
  refresh: false,
  toggleType: vi.fn(),
  width: 1024,
  onScrambleGenerated: vi.fn(),
  onPuzzleTypeChange: vi.fn(),
};
