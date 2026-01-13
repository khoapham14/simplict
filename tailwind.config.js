/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Maximalism Color Palette
      colors: {
        // Base colors
        'max-bg': '#0D0D1A',
        'max-bg-secondary': '#1A1A2E',
        'max-muted': '#2D1B4E',

        // 5 Accent colors (rotating)
        'max-magenta': '#FF3AF2',
        'max-cyan': '#00F5D4',
        'max-yellow': '#FFE600',
        'max-orange': '#FF6B35',
        'max-purple': '#7B2FFF',

        // Legacy cube purple (for backwards compat)
        'cube-purple': '#483d8b',
      },

      // Typography
      fontFamily: {
        'display': ['Outfit', 'system-ui', 'sans-serif'],
        'body': ['DM Sans', 'system-ui', 'sans-serif'],
        'exo': ['Exo', 'sans-serif'],
      },

      // Custom font sizes for timer
      fontSize: {
        'timer-xl': '15rem',
        'timer-lg': '12rem',
        'timer-md': '10rem',
        'timer-sm': '8rem',
        'timer-xs': '6rem',
      },

      // Box shadows - Maximalism multi-layer
      boxShadow: {
        // Glow shadows
        'glow-magenta': '0 0 20px rgba(255, 58, 242, 0.5), 0 0 40px rgba(255, 58, 242, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 245, 212, 0.5), 0 0 40px rgba(0, 245, 212, 0.3)',
        'glow-yellow': '0 0 20px rgba(255, 230, 0, 0.5), 0 0 40px rgba(255, 230, 0, 0.3)',
        'glow-purple': '0 0 20px rgba(123, 47, 255, 0.5), 0 0 40px rgba(123, 47, 255, 0.3)',

        // Multi-layer hard shadows
        'multi-sm': '4px 4px 0 #00F5D4, 8px 8px 0 #FFE600',
        'multi': '8px 8px 0 #00F5D4, 16px 16px 0 #FFE600',
        'multi-lg': '12px 12px 0 #00F5D4, 24px 24px 0 #FFE600, 36px 36px 0 #FF6B35',

        // Combined glow + hard
        'max-sm': '0 0 15px rgba(255, 58, 242, 0.4), 4px 4px 0 #00F5D4',
        'max': '0 0 20px rgba(255, 58, 242, 0.5), 8px 8px 0 #00F5D4, 16px 16px 0 #FFE600',
        'max-lg': '0 0 30px rgba(255, 58, 242, 0.6), 8px 8px 0 #00F5D4, 16px 16px 0 #FFE600, 24px 24px 0 #FF6B35',
      },

      // Border radius
      borderRadius: {
        '4xl': '2rem',
      },

      // Animations
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 5s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'border-dance': 'border-dance 4s linear infinite',
      },

      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(20px) rotate(-5deg)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 58, 242, 0.5)',
            filter: 'brightness(1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 58, 242, 0.8), 0 0 60px rgba(0, 245, 212, 0.5)',
            filter: 'brightness(1.1)',
          },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'border-dance': {
          '0%, 100%': { borderColor: '#FF3AF2' },
          '25%': { borderColor: '#00F5D4' },
          '50%': { borderColor: '#FFE600' },
          '75%': { borderColor: '#FF6B35' },
        },
      },

      // Background patterns
      backgroundImage: {
        'dots': 'radial-gradient(circle, rgba(255, 58, 242, 0.15) 2px, transparent 2px)',
        'stripes': 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0, 245, 212, 0.1) 20px, rgba(0, 245, 212, 0.1) 40px)',
        'grid': 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(ellipse at top left, rgba(123, 47, 255, 0.3), transparent 50%), radial-gradient(ellipse at bottom right, rgba(255, 58, 242, 0.3), transparent 50%), radial-gradient(ellipse at center, rgba(0, 245, 212, 0.2), transparent 60%)',
      },

      backgroundSize: {
        'dots': '30px 30px',
        'grid': '30px 30px',
      },
    },
  },
  plugins: [],
}
