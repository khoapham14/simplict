import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import App from './App';

describe('App', () => {
  test('renders without crashing', () => {
    render(<App />);
    // App should render the main structure
    expect(document.body).toBeInTheDocument();
  });

  test('renders Timer component', () => {
    render(<App />);
    // Timer component should have the timer container element
    const timerElement = document.getElementById('timer-container');
    expect(timerElement).toBeInTheDocument();
  });

  test('renders Scrambler component', () => {
    render(<App />);
    // Scrambler should show puzzle type selector
    expect(screen.getByText('3x3')).toBeInTheDocument();
  });

  test('renders Statistics component', () => {
    render(<App />);
    // Statistics should show average display
    expect(screen.getByText(/Average of 5:/)).toBeInTheDocument();
  });

  test('renders Dashboard button', () => {
    render(<App />);
    // Dashboard toggle button should be visible
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
