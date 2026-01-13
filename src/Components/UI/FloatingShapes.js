import React from 'react';

/**
 * FloatingShapes Component
 * Animated background shapes for Maximalism design
 */
const FloatingShapes = () => {
  const shapes = [
    // Top left
    {
      type: 'circle',
      color: 'from-[var(--color-magenta)] to-[var(--color-purple)]',
      borderColor: 'border-[var(--color-yellow)]',
      size: 'w-32 h-32',
      position: 'top-[5%] left-[3%]',
      animation: 'animate-float',
      delay: '0s',
      opacity: 'opacity-30',
    },
    {
      type: 'star',
      color: 'bg-[var(--color-yellow)]',
      size: 'w-16 h-16',
      position: 'top-[15%] left-[10%]',
      animation: 'animate-wiggle',
      delay: '0.5s',
      opacity: 'opacity-40',
    },
    // Top right
    {
      type: 'square',
      color: 'bg-[var(--color-cyan)]',
      borderColor: 'border-[var(--color-orange)]',
      size: 'w-24 h-24',
      position: 'top-[8%] right-[5%]',
      animation: 'animate-float-reverse',
      delay: '1s',
      opacity: 'opacity-25',
      rotate: 'rotate-12',
    },
    {
      type: 'circle',
      color: 'from-[var(--color-purple)] to-[var(--color-cyan)]',
      borderColor: 'border-[var(--color-magenta)]',
      size: 'w-20 h-20',
      position: 'top-[20%] right-[12%]',
      animation: 'animate-bounce-subtle',
      delay: '1.5s',
      opacity: 'opacity-35',
    },
    // Mid left
    {
      type: 'circle',
      color: 'from-[var(--color-orange)] to-[var(--color-magenta)]',
      borderColor: 'border-[var(--color-cyan)]',
      size: 'w-28 h-28',
      position: 'top-[45%] left-[4%]',
      animation: 'animate-float',
      delay: '2s',
      opacity: 'opacity-20',
    },
    // Mid right
    {
      type: 'star',
      color: 'bg-[var(--color-cyan)]',
      size: 'w-20 h-20',
      position: 'top-[50%] right-[6%]',
      animation: 'animate-spin-slow',
      delay: '0s',
      opacity: 'opacity-30',
    },
    // Bottom area (above dashboard)
    {
      type: 'square',
      color: 'bg-[var(--color-purple)]',
      borderColor: 'border-[var(--color-yellow)]',
      size: 'w-16 h-16',
      position: 'bottom-[35%] left-[8%]',
      animation: 'animate-wiggle',
      delay: '2.5s',
      opacity: 'opacity-25',
      rotate: '-rotate-6',
    },
    {
      type: 'circle',
      color: 'from-[var(--color-cyan)] to-[var(--color-yellow)]',
      borderColor: 'border-[var(--color-purple)]',
      size: 'w-36 h-36',
      position: 'bottom-[32%] right-[10%]',
      animation: 'animate-float-reverse',
      delay: '3s',
      opacity: 'opacity-20',
    },
  ];

  const renderShape = (shape, index) => {
    const baseClasses = `
      absolute pointer-events-none
      ${shape.size} ${shape.position} ${shape.animation} ${shape.opacity}
      ${shape.rotate || ''}
    `;

    const style = {
      animationDelay: shape.delay,
    };

    if (shape.type === 'circle') {
      return (
        <div
          key={index}
          className={`
            ${baseClasses}
            rounded-full
            bg-gradient-to-br ${shape.color}
            border-4 border-dashed ${shape.borderColor}
            blur-[1px]
          `}
          style={style}
        />
      );
    }

    if (shape.type === 'square') {
      return (
        <div
          key={index}
          className={`
            ${baseClasses}
            rounded-2xl
            ${shape.color}
            border-4 ${shape.borderColor}
            blur-[1px]
          `}
          style={style}
        />
      );
    }

    if (shape.type === 'star') {
      return (
        <div
          key={index}
          className={`
            ${baseClasses}
            ${shape.color}
            blur-[0.5px]
          `}
          style={{
            ...style,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          }}
        />
      );
    }

    return null;
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Gradient mesh background */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(123, 47, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(255, 58, 242, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 90%, rgba(0, 245, 212, 0.1) 0%, transparent 40%)
          `,
        }}
      />

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 58, 242, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating shapes */}
      {shapes.map((shape, index) => renderShape(shape, index))}
    </div>
  );
};

export default FloatingShapes;
