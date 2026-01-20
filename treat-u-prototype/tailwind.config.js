/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Verde bosco - Primario (professionalità, natura, equilibrio)
        primary: {
          50: '#f3f6f4',
          100: '#e4ebe6',
          200: '#c9d7ce',
          300: '#a3bba9',
          400: '#789c81',
          500: '#5a8263',
          600: '#476a50',
          700: '#3d5a47',
          800: '#34493b',
          900: '#2c3d32',
          950: '#161f1a',
        },
        // Pesca - Accento (calore, cura personale, delicatezza)
        secondary: {
          50: '#fdf6f3',
          100: '#fceee8',
          200: '#f9ddd2',
          300: '#f4c4b0',
          400: '#e8b4a0',
          500: '#d9927a',
          600: '#c67a5f',
          700: '#a6624c',
          800: '#895242',
          900: '#72473a',
          950: '#3d231c',
        },
        // Neutri caldi per complementare
        warm: {
          50: '#faf9f7',
          100: '#f5f3ef',
          200: '#e8e4dc',
          300: '#d5cfc3',
          400: '#b8ae9d',
          500: '#9f927e',
          600: '#867862',
          700: '#6e6352',
          800: '#5c5345',
          900: '#4d463b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233d5a47\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
