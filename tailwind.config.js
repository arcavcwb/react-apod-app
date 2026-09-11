/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Field-edition star atlas: printed black, starlight white, graticule
      // hairlines and one red-light accent. Values live in src/index.css.
      colors: {
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        star: 'var(--star)',
        copy: 'var(--copy)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        red: 'var(--red)',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
