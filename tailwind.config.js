/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        maker: {
          sidebar: '#0E1726',
          bg: '#F4F6FA',
          card: '#FFFFFF',
          border: '#E3E7EE',
          primary: '#2F5BEA',
          primaryHover: '#2548bd',
          danger: '#B42318',
          dangerBg: '#FEF3F2',
          warning: '#B45309',
          warningBg: '#FFFBEB',
          success: '#0F7A4A',
          successBg: '#ECFDF3',
          darkBg: '#090D16',
          darkCard: '#131B2E',
          darkBorder: '#1E293B',
        }
      },
      borderRadius: {
        'maker': '12px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      }
    },
  },
  plugins: [],
}
