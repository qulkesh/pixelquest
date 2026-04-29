/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"VT323"', 'monospace']
      },
      colors: {
        bg: '#0b0d1a',
        panel: '#15182b',
        panel2: '#1d2140',
        frame: '#2a2f4a',
        ink: '#e8ecff',
        muted: '#7a82a8',
        cyan: '#00d9ff',
        magenta: '#ff3ed1',
        gold: '#ffcc33',
        good: '#3dff9a',
        bad: '#ff4d6d',
        rare: '#3d8bff',
        epic: '#b04dff',
        legendary: '#ffae00'
      },
      boxShadow: {
        pixel: '0 0 0 2px #0b0d1a, 0 0 0 4px #2a2f4a, 6px 6px 0 0 #000',
        pixelHover: '0 0 0 2px #0b0d1a, 0 0 0 4px #00d9ff, 6px 6px 0 0 #000',
        glow: '0 0 12px rgba(0,217,255,0.45)'
      },
      keyframes: {
        levelup: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' }
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' }
        },
        damageShake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-3px)' },
          '40%': { transform: 'translateX(3px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' }
        }
      },
      animation: {
        levelup: 'levelup 800ms ease-out',
        floaty: 'floaty 2.4s ease-in-out infinite',
        damage: 'damageShake 350ms ease-out'
      }
    }
  },
  plugins: []
};
