import React from 'react';

/**
 * Custom Button Component - Maximalism Design
 * Replaces react-bootstrap Button
 */
const Button = ({
  children,
  variant = 'outline-dark',
  onClick,
  className = '',
  id,
  type = 'button',
  disabled = false,
  ...props
}) => {
  const baseClasses = `
    px-6 py-2 rounded-xl font-bold text-base
    transition-all duration-300 ease-out
    border-4 cursor-pointer
    inline-flex items-center justify-center gap-2
  `;

  const variantClasses = {
    'outline-dark': `
      border-white text-white bg-transparent
      hover:bg-white hover:text-[var(--color-bg)]
      hover:shadow-glow-cyan hover:scale-105
      active:scale-95
    `,
    'primary': `
      border-[var(--color-yellow)]
      bg-gradient-to-r from-[var(--color-magenta)] to-[var(--color-purple)]
      text-white
      hover:shadow-max-lg hover:scale-105 hover:border-[var(--color-cyan)]
      active:scale-95
    `,
    'secondary': `
      border-[var(--color-orange)]
      bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-purple)]
      text-white
      hover:shadow-glow-cyan hover:scale-105
      active:scale-95
    `,
    'danger': `
      border-[var(--color-orange)]
      bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-magenta)]
      text-white
      hover:shadow-glow-magenta hover:scale-105
      active:scale-95
    `,
    'success': `
      border-[var(--color-yellow)]
      bg-gradient-to-r from-[var(--color-cyan)] to-green-500
      text-white
      hover:shadow-glow-cyan hover:scale-105
      active:scale-95
    `,
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  return (
    <button
      type={type}
      onClick={onClick}
      id={id}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant] || variantClasses['outline-dark']}
        ${disabledClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
