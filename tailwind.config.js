/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Three sizes only; rank comes from weight and colour. Fluid, so wide desktop screens read a little larger.
    fontSize: {
      small: ['clamp(0.8125rem, 0.74rem + 0.16vw, 0.9375rem)', { lineHeight: '1.6' }],
      body: ['clamp(1rem, 0.9rem + 0.22vw, 1.1875rem)', { lineHeight: '1.6' }],
      display: ['clamp(2.25rem, 1.45rem + 2.6vw, 4.25rem)', { lineHeight: '1.04', letterSpacing: '-0.028em' }],
    },
    extend: {
      screens: {
        // Mouse and trackpad only: touch screens never see a resting dimmed state they cannot lift.
        'can-hover': { raw: '(hover: hover) and (pointer: fine)' },
      },
      // Deep navy ground, soft white, slate, one orbital blue. Values live in src/index.css.
      colors: {
        space: 'var(--space)',
        panel: 'var(--panel)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        edge: 'var(--edge)',
        accent: 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
      },
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      // Floating things: tiles, menus and the header lift softly; the photograph floats highest.
      boxShadow: {
        float: '0 14px 32px -14px rgba(0, 0, 0, 0.85)',
        photo: '0 48px 96px -40px rgba(0, 0, 0, 0.95)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
