import React from 'react';

/**
 * Row Component - Replaces Bootstrap Row
 * Uses CSS Grid for modern layout
 */
export const Row = ({
  children,
  className = '',
  id,
  ...props
}) => {
  return (
    <div
      id={id}
      className={`grid grid-cols-12 gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Col Component - Replaces Bootstrap Col
 * Responsive column with grid span
 */
export const Col = ({
  children,
  lg,
  md,
  sm,
  xs,
  className = '',
  id,
  role,
  'aria-label': ariaLabel,
  ...props
}) => {
  // Generate responsive classes
  const getColSpan = () => {
    const classes = [];

    // Default to full width
    if (xs) {
      classes.push(`col-span-${xs}`);
    } else {
      classes.push('col-span-12');
    }

    // Small screens
    if (sm) {
      classes.push(`sm:col-span-${sm}`);
    }

    // Medium screens
    if (md) {
      classes.push(`md:col-span-${md}`);
    }

    // Large screens
    if (lg) {
      classes.push(`lg:col-span-${lg}`);
    }

    return classes.join(' ');
  };

  return (
    <div
      id={id}
      role={role}
      aria-label={ariaLabel}
      className={`${getColSpan()} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Container Component - Centered max-width container
 */
export const Container = ({
  children,
  className = '',
  fluid = false,
  ...props
}) => {
  return (
    <div
      className={`
        ${fluid ? 'w-full' : 'max-w-7xl mx-auto'}
        px-4 sm:px-6 lg:px-8
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Flex utility component
 */
export const Flex = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 4,
  wrap = false,
  className = '',
  ...props
}) => {
  const directionClasses = {
    'row': 'flex-row',
    'col': 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const justifyClasses = {
    'start': 'justify-start',
    'end': 'justify-end',
    'center': 'justify-center',
    'between': 'justify-between',
    'around': 'justify-around',
    'evenly': 'justify-evenly',
  };

  const alignClasses = {
    'start': 'items-start',
    'end': 'items-end',
    'center': 'items-center',
    'baseline': 'items-baseline',
    'stretch': 'items-stretch',
  };

  return (
    <div
      className={`
        flex
        ${directionClasses[direction]}
        ${justifyClasses[justify]}
        ${alignClasses[align]}
        ${wrap ? 'flex-wrap' : 'flex-nowrap'}
        gap-${gap}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
