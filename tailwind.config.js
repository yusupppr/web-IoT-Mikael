/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        background: '#0F172A', // Deep Slate
        foreground: '#F8FAFC',
        card: '#1B2336', // Slightly elevated
        'card-foreground': '#F8FAFC',
        primary: '#1E293B',
        'on-primary': '#FFFFFF',
        secondary: '#334155',
        'on-secondary': '#FFFFFF',
        accent: '#22C55E', // Vibrant green
        'on-accent': '#0F172A',
        muted: '#272F42',
        'muted-foreground': '#94A3B8',
        border: '#475569',
        destructive: '#EF4444',
        'on-destructive': '#000000',
        ring: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
