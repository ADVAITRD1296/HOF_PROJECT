/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#131313',
        primary: '#c6c6c6',
        'primary-container': '#37393a',
        secondary: '#abc8f5', // Trust Blue
        'secondary-container': '#2a486e',
        tertiary: '#e9c176', // Legal Gold
        'surface': '#131313',
        'surface-container-lowest': '#0e0e0e',
        'surface-container-low': '#1c1b1b',
        'surface-container': '#201f1f',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353534',
        'outline': '#8d9199',
        'outline-variant': '#43474e',
      },
      boxShadow: {
        ambient: '0px 20px 50px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
}
