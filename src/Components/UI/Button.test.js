import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    test('renders with children text', () => {
      render(<Button>Click Me</Button>);

      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    test('renders with custom id', () => {
      render(<Button id="test-btn">Click</Button>);

      expect(document.getElementById('test-btn')).toBeInTheDocument();
    });

    test('renders with custom className', () => {
      render(<Button className="custom-class">Click</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    test('defaults to type="button"', () => {
      render(<Button>Click</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    test('accepts type prop', () => {
      render(<Button type="submit">Submit</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('Variants', () => {
    test('applies outline-dark variant by default', () => {
      render(<Button>Click</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-white');
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('bg-transparent');
    });

    test('applies primary variant styles', () => {
      render(<Button variant="primary">Click</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gradient-to-r');
    });

    test('applies secondary variant styles', () => {
      render(<Button variant="secondary">Click</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gradient-to-r');
    });

    test('applies danger variant styles', () => {
      render(<Button variant="danger">Click</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gradient-to-r');
    });

    test('applies success variant styles', () => {
      render(<Button variant="success">Click</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gradient-to-r');
    });

    test('falls back to outline-dark for unknown variant', () => {
      render(<Button variant="unknown">Click</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-white');
    });
  });

  describe('Click Handling', () => {
    test('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    test('has disabled attribute when disabled prop is true', () => {
      render(<Button disabled>Click</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    test('applies disabled styling when disabled', () => {
      render(<Button disabled>Click</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('opacity-50');
      expect(button).toHaveClass('cursor-not-allowed');
    });

    test('is not disabled by default', () => {
      render(<Button>Click</Button>);

      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('Base Styling', () => {
    test('has rounded corners', () => {
      render(<Button>Click</Button>);

      expect(screen.getByRole('button')).toHaveClass('rounded-xl');
    });

    test('has bold font', () => {
      render(<Button>Click</Button>);

      expect(screen.getByRole('button')).toHaveClass('font-bold');
    });

    test('has transition classes', () => {
      render(<Button>Click</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all');
      expect(button).toHaveClass('duration-300');
    });

    test('has flexbox styling', () => {
      render(<Button>Click</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('inline-flex');
      expect(button).toHaveClass('items-center');
      expect(button).toHaveClass('justify-center');
    });
  });

  describe('Props Spreading', () => {
    test('passes additional props to button element', () => {
      render(
        <Button data-testid="test-button" aria-label="Test">
          Click
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'test-button');
      expect(button).toHaveAttribute('aria-label', 'Test');
    });
  });

  describe('Children Content', () => {
    test('renders multiple children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });
});
