import React, { useState, useRef, useEffect } from 'react';

/**
 * Custom Dropdown Component - Maximalism Design
 * Replaces react-bootstrap Dropdown
 */
const Dropdown = ({ children, className = '', id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} id={id} className={`relative inline-block ${className}`}>
      {React.Children.map(children, child => {
        if (!child) return null;
        if (child.type === DropdownToggle) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen
          });
        }
        if (child.type === DropdownMenu) {
          return React.cloneElement(child, { isOpen });
        }
        return child;
      })}
    </div>
  );
};

const DropdownToggle = ({
  children,
  onClick,
  isOpen,
  variant = 'outline-light',
  className = '',
  id
}) => {
  const baseClasses = `
    px-4 py-2 rounded-xl font-bold text-base
    transition-all duration-300 ease-out
    flex items-center gap-2 cursor-pointer
    border-4
  `;

  const variantClasses = {
    'outline-light': `
      border-white/80 text-white bg-transparent
      hover:bg-white/10 hover:border-[var(--color-cyan)] hover:shadow-glow-cyan
      hover:scale-105
    `,
    'primary': `
      border-[var(--color-yellow)] text-white
      bg-gradient-to-r from-[var(--color-magenta)] to-[var(--color-purple)]
      hover:shadow-max hover:scale-105
    `,
  };

  return (
    <button
      onClick={onClick}
      id={id}
      className={`
        ${baseClasses}
        ${variantClasses[variant] || variantClasses['outline-light']}
        ${isOpen ? 'shadow-glow-magenta scale-105' : ''}
        ${className}
      `}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {children}
      <svg
        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

const DropdownMenu = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      className="
        absolute z-50 mt-2 min-w-full
        bg-[var(--color-bg-secondary)] backdrop-blur-md
        border-4 border-[var(--color-cyan)]
        rounded-xl
        shadow-max
        overflow-hidden
        animate-[fadeIn_0.2s_ease-out]
      "
      role="menu"
      style={{
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
};

const DropdownItem = ({ children, onClick, className = '', id }) => {
  return (
    <button
      onClick={onClick}
      id={id}
      className={`
        w-full px-4 py-3 text-left text-base font-semibold
        text-white
        hover:bg-gradient-to-r hover:from-[var(--color-magenta)] hover:to-[var(--color-purple)]
        hover:text-white hover:pl-6
        transition-all duration-200
        focus:outline-none focus:bg-[var(--color-muted)]
        ${className}
      `}
      role="menuitem"
    >
      {children}
    </button>
  );
};

// Compound Component Pattern
Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;

export default Dropdown;
