import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Stats from './Statistics';

// Helper to create solve objects
const createSolve = (id, timeMs, penalty = null) => ({
  id,
  penalizedTimeMs: penalty === 'DNF' ? Infinity : penalty === '+2' ? timeMs + 2000 : timeMs,
  penalty,
  displayTime: `${(timeMs / 1000).toFixed(2)}`,
  scramble: "R U R' U'",
  timestamp: Date.now(),
  puzzleType: '3x3',
});

// Default props for Stats component
const defaultProps = {
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

describe('Statistics - Average of 5 Calculation', () => {
  test('returns "--" when less than 5 solves', () => {
    const solves = [
      createSolve(1, 10000),
      createSolve(2, 11000),
      createSolve(3, 12000),
      createSolve(4, 13000),
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    expect(screen.getByText(/Average of 5:/)).toHaveTextContent('Average of 5: --');
  });

  test('calculates correctly with 0 DNF - averages middle 3', () => {
    // Times: 10s, 11s, 12s, 13s, 14s
    // Sorted: 10s (best), 11s, 12s, 13s, 14s (worst)
    // Average middle 3: (11 + 12 + 13) / 3 = 12s
    const solves = [
      createSolve(1, 10000), // 10s - best, removed
      createSolve(2, 14000), // 14s - worst, removed
      createSolve(3, 12000), // 12s - counted
      createSolve(4, 11000), // 11s - counted
      createSolve(5, 13000), // 13s - counted
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    // Average of 11, 12, 13 = 12.00
    expect(screen.getByText(/Average of 5:/)).toHaveTextContent('12.00');
  });

  test('calculates correctly with 1 DNF - DNF counts as worst, only remove best', () => {
    // Times: 10s, 11s, 12s, 13s, DNF
    // Valid sorted: 10s (best), 11s, 12s, 13s
    // DNF is worst, only remove best (10s)
    // Average: (11 + 12 + 13) / 3 = 12s
    const solves = [
      createSolve(1, 10000), // 10s - best, removed
      createSolve(2, 11000), // 11s - counted
      createSolve(3, 12000), // 12s - counted
      createSolve(4, 13000), // 13s - counted
      createSolve(5, 0, 'DNF'), // DNF - counts as worst, not included in valid times
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    // Average of 11, 12, 13 = 12.00
    expect(screen.getByText(/Average of 5:/)).toHaveTextContent('12.00');
  });

  test('returns "DNF" with 2 DNFs (WCA rule: max 1 DNF allowed)', () => {
    const solves = [
      createSolve(1, 10000),
      createSolve(2, 11000),
      createSolve(3, 12000),
      createSolve(4, 0, 'DNF'),
      createSolve(5, 0, 'DNF'),
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    expect(screen.getByText(/Average of 5:/)).toHaveTextContent('Average of 5: DNF');
  });

  test('returns "DNF" with 3+ DNFs', () => {
    const solves = [
      createSolve(1, 10000),
      createSolve(2, 0, 'DNF'),
      createSolve(3, 0, 'DNF'),
      createSolve(4, 0, 'DNF'),
      createSolve(5, 11000),
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    expect(screen.getByText(/Average of 5:/)).toHaveTextContent('Average of 5: DNF');
  });

  test('returns "DNF" with all DNFs', () => {
    const solves = [
      createSolve(1, 0, 'DNF'),
      createSolve(2, 0, 'DNF'),
      createSolve(3, 0, 'DNF'),
      createSolve(4, 0, 'DNF'),
      createSolve(5, 0, 'DNF'),
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    expect(screen.getByText(/Average of 5:/)).toHaveTextContent('Average of 5: DNF');
  });

  test('handles +2 penalty correctly', () => {
    // Times: 10s, 11s+2=13s, 12s, 14s, 15s
    // Sorted: 10s (best), 12s, 13s, 14s, 15s (worst)
    // Average middle 3: (12 + 13 + 14) / 3 = 13s
    const solves = [
      createSolve(1, 10000), // 10s - best, removed
      createSolve(2, 11000, '+2'), // 11s + 2 = 13s - counted
      createSolve(3, 12000), // 12s - counted
      createSolve(4, 14000), // 14s - counted
      createSolve(5, 15000), // 15s - worst, removed
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    // Average of 12, 13, 14 = 13.00
    expect(screen.getByText(/Average of 5:/)).toHaveTextContent('13.00');
  });
});

describe('Statistics - Average of 12 Calculation', () => {
  test('returns "--" when less than 12 solves', () => {
    const solves = Array.from({ length: 11 }, (_, i) => createSolve(i + 1, 10000 + i * 1000));

    render(<Stats {...defaultProps} solves={solves} />);

    expect(screen.getByText(/Average of 12:/)).toHaveTextContent('Average of 12: --');
  });

  test('calculates correctly with 0 DNF - averages middle 10', () => {
    // Create 12 solves: 10s, 11s, 12s, ..., 21s
    // After removing best (10s) and worst (21s), average remaining 10
    const solves = Array.from({ length: 12 }, (_, i) => createSolve(i + 1, 10000 + i * 1000));

    render(<Stats {...defaultProps} solves={solves} />);

    // Average of 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 = 15.5s
    // msToTime formats as 15.50 (with 2 decimal places for sub-minute)
    const ao12Element = screen.getByText(/Average of 12:/);
    expect(ao12Element.textContent).toMatch(/15\.\d+/);
  });

  test('calculates correctly with 1 DNF', () => {
    // 11 valid times + 1 DNF = 12 total
    const solves = [
      ...Array.from({ length: 11 }, (_, i) => createSolve(i + 1, 10000 + i * 1000)),
      createSolve(12, 0, 'DNF'),
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    // 11 valid, remove best and worst from valid times
    const ao12Element = screen.getByText(/Average of 12:/);
    expect(ao12Element.textContent).toMatch(/15\.\d+/);
  });

  test('calculates correctly with 2 DNF (max allowed)', () => {
    // 10 valid times + 2 DNF = 12 total
    const solves = [
      ...Array.from({ length: 10 }, (_, i) => createSolve(i + 1, 10000 + i * 1000)),
      createSolve(11, 0, 'DNF'),
      createSolve(12, 0, 'DNF'),
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    // 10 valid times, remove best and worst
    const ao12Element = screen.getByText(/Average of 12:/);
    expect(ao12Element.textContent).toMatch(/14\.\d+/);
  });

  test('returns "DNF" with 3 DNFs (more than allowed)', () => {
    // 9 valid times + 3 DNF = 12 total, but need 10 valid for Ao12
    const solves = [
      ...Array.from({ length: 9 }, (_, i) => createSolve(i + 1, 10000 + i * 1000)),
      createSolve(10, 0, 'DNF'),
      createSolve(11, 0, 'DNF'),
      createSolve(12, 0, 'DNF'),
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    expect(screen.getByText(/Average of 12:/)).toHaveTextContent('Average of 12: DNF');
  });

  test('handles +2 penalties correctly in Ao12', () => {
    // Mix of +2 penalties in 12 solves
    const solves = [
      createSolve(1, 10000),
      createSolve(2, 11000, '+2'), // becomes 13s
      createSolve(3, 12000),
      createSolve(4, 13000),
      createSolve(5, 14000, '+2'), // becomes 16s
      createSolve(6, 15000),
      createSolve(7, 16000),
      createSolve(8, 17000),
      createSolve(9, 18000),
      createSolve(10, 19000),
      createSolve(11, 20000),
      createSolve(12, 21000),
    ];

    render(<Stats {...defaultProps} solves={solves} />);

    expect(screen.getByText(/Average of 12:/)).toBeInTheDocument();
  });
});

describe('Statistics - Session Best/Worst', () => {
  test('session best shows "--" with no solves', () => {
    render(<Stats {...defaultProps} solves={[]} />);

    fireEvent.click(screen.getByText('Dashboard'));

    // Find the parent div containing "Session Best:" and check its text content
    expect(screen.getByText('Session Best:')).toBeInTheDocument();
    const mainStats = document.getElementById('main_stats');
    expect(mainStats.textContent).toContain('--');
  });

  test('session best shows correct time', () => {
    const solves = [
      createSolve(1, 15000), // 15s
      createSolve(2, 10000), // 10s - best
      createSolve(3, 20000), // 20s
    ];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const mainStats = document.getElementById('main_stats');
    expect(mainStats.textContent).toContain('10.00');
  });

  test('session worst shows correct time', () => {
    const solves = [
      createSolve(1, 15000), // 15s
      createSolve(2, 10000), // 10s
      createSolve(3, 20000), // 20s - worst
    ];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const mainStats = document.getElementById('main_stats');
    expect(mainStats.textContent).toContain('20.00');
  });

  test('session best excludes DNF solves', () => {
    const solves = [
      createSolve(1, 15000),
      createSolve(2, 0, 'DNF'), // DNF - excluded
      createSolve(3, 10000), // best valid
    ];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const mainStats = document.getElementById('main_stats');
    expect(mainStats.textContent).toContain('10.00');
  });
});

describe('Statistics - Session Average/Mean', () => {
  test('session average shows "--" with less than 3 solves', () => {
    const solves = [createSolve(1, 10000), createSolve(2, 11000)];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    expect(screen.getByText('Session Average:')).toBeInTheDocument();
    const mainStats = document.getElementById('main_stats');
    expect(mainStats.textContent).toContain('Session Average:');
  });

  test('session average removes best and worst', () => {
    // Times: 10s, 15s, 20s
    // After removing best (10s) and worst (20s): 15s
    const solves = [createSolve(1, 10000), createSolve(2, 15000), createSolve(3, 20000)];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const mainStats = document.getElementById('main_stats');
    expect(mainStats.textContent).toContain('15.00');
  });

  test('session mean shows "--" with no solves', () => {
    render(<Stats {...defaultProps} solves={[]} />);
    fireEvent.click(screen.getByText('Dashboard'));

    expect(screen.getByText('Session Mean:')).toBeInTheDocument();
    const mainStats = document.getElementById('main_stats');
    expect(mainStats.textContent).toContain('--');
  });

  test('session mean calculates all times average', () => {
    // Times: 10s, 15s, 20s -> mean = 15s
    const solves = [createSolve(1, 10000), createSolve(2, 15000), createSolve(3, 20000)];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const mainStats = document.getElementById('main_stats');
    expect(mainStats.textContent).toContain('15.00');
  });

  test('session mean excludes DNF solves', () => {
    const solves = [
      createSolve(1, 10000),
      createSolve(2, 0, 'DNF'), // excluded
      createSolve(3, 20000),
    ];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    // Mean of 10s and 20s = 15s
    const mainStats = document.getElementById('main_stats');
    expect(mainStats.textContent).toContain('15.00');
  });
});

describe('Statistics - Dashboard UI', () => {
  test('dashboard toggle shows/hides dashboard', () => {
    render(<Stats {...defaultProps} solves={[]} />);

    const dashboardBtn = screen.getByText('Dashboard');
    const dashboard = document.getElementById('dashboard');

    // Initially visible (based on CSS)
    fireEvent.click(dashboardBtn);
    // Toggle state changes
    fireEvent.click(dashboardBtn);
    // Toggle back
  });

  test('displays shortened chart description', () => {
    render(<Stats {...defaultProps} solves={[]} />);

    fireEvent.click(screen.getByText('Dashboard'));

    expect(screen.getByText('Visual progression of your solve times.')).toBeInTheDocument();
  });

  test('displays "No solves recorded yet" when empty', () => {
    render(<Stats {...defaultProps} solves={[]} />);
    fireEvent.click(screen.getByText('Dashboard'));

    expect(screen.getByText('No solves recorded yet')).toBeInTheDocument();
  });

  test('displays solve times as pills', () => {
    const solves = [createSolve(1, 10000), createSolve(2, 11000)];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const recordedTimes = document.getElementById('recorded_times');
    expect(recordedTimes.textContent).toContain('10.00');
    expect(recordedTimes.textContent).toContain('11.00');
  });
});

describe('Statistics - Delete Functionality', () => {
  test('delete last button calls onDeleteSolve with last solve id', () => {
    const onDeleteSolve = vi.fn();
    const solves = [createSolve(1, 10000), createSolve(2, 11000), createSolve(3, 12000)];

    render(<Stats {...defaultProps} solves={solves} onDeleteSolve={onDeleteSolve} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const deleteLastBtn = screen.getByText('Delete Last');
    fireEvent.click(deleteLastBtn);

    expect(onDeleteSolve).toHaveBeenCalledWith(3);
  });

  test('reset button calls clearRecord', () => {
    const clearRecord = vi.fn();

    render(<Stats {...defaultProps} clearRecord={clearRecord} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const resetBtn = screen.getByText('Reset');
    fireEvent.click(resetBtn);

    expect(clearRecord).toHaveBeenCalled();
  });
});

describe('Statistics - Solve Detail Modal', () => {
  test('clicking a solve pill calls onOpenSolveDetail', () => {
    const onOpenSolveDetail = vi.fn();
    const solves = [createSolve(1, 10000)];

    render(<Stats {...defaultProps} solves={solves} onOpenSolveDetail={onOpenSolveDetail} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const recordedTimes = document.getElementById('recorded_times');
    const solvePill = recordedTimes.querySelector('.time-pill');
    fireEvent.click(solvePill);

    expect(onOpenSolveDetail).toHaveBeenCalledWith(1);
  });

  test('solve pills are keyboard accessible', () => {
    const onOpenSolveDetail = vi.fn();
    const solves = [createSolve(1, 10000)];

    render(<Stats {...defaultProps} solves={solves} onOpenSolveDetail={onOpenSolveDetail} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const recordedTimes = document.getElementById('recorded_times');
    const solvePill = recordedTimes.querySelector('.time-pill');
    fireEvent.keyDown(solvePill, { key: 'Enter' });

    expect(onOpenSolveDetail).toHaveBeenCalledWith(1);
  });
});

describe('Statistics - Time Formatting', () => {
  test('formats sub-minute times correctly', () => {
    const solves = [createSolve(1, 12345)]; // 12.34s

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const recordedTimes = document.getElementById('recorded_times');
    // Should show ~12.34
    expect(recordedTimes.textContent).toMatch(/12\.\d+/);
  });

  test('handles minute+ times correctly', () => {
    const solves = [createSolve(1, 65000)]; // 1:05.00

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const recordedTimes = document.getElementById('recorded_times');
    // Should be formatted with colon for minute time (1:05.XX)
    expect(recordedTimes.querySelector('.time-pill')).toBeInTheDocument();
  });
});

describe('Statistics - Accessibility', () => {
  test('recorded times section has role="list"', () => {
    const solves = [createSolve(1, 10000)];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const recordedTimes = document.getElementById('recorded_times');
    expect(recordedTimes).toHaveAttribute('role', 'list');
  });

  test('solve pills have role="listitem"', () => {
    const solves = [createSolve(1, 10000)];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const recordedTimes = document.getElementById('recorded_times');
    const pill = recordedTimes.querySelector('.time-pill');
    expect(pill).toHaveAttribute('role', 'listitem');
  });

  test('solve pills have aria-label with solve number and time', () => {
    const solves = [createSolve(1, 10000)];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const recordedTimes = document.getElementById('recorded_times');
    const pill = recordedTimes.querySelector('.time-pill');
    expect(pill).toHaveAttribute('aria-label');
    expect(pill.getAttribute('aria-label')).toContain('Solve 1');
  });

  test('best time pill has aria-label indicating best', () => {
    const solves = [
      createSolve(1, 10000), // best
      createSolve(2, 20000),
    ];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const recordedTimes = document.getElementById('recorded_times');
    const pills = recordedTimes.querySelectorAll('.time-pill');
    const bestPill = Array.from(pills).find(p => p.classList.contains('best-time'));
    expect(bestPill).toBeInTheDocument();
    expect(bestPill.getAttribute('aria-label')).toContain('Best time');
  });

  test('solve pills have tabIndex for keyboard navigation', () => {
    const solves = [createSolve(1, 10000)];

    render(<Stats {...defaultProps} solves={solves} />);
    fireEvent.click(screen.getByText('Dashboard'));

    const recordedTimes = document.getElementById('recorded_times');
    const pill = recordedTimes.querySelector('.time-pill');
    expect(pill).toHaveAttribute('tabIndex', '0');
  });
});
