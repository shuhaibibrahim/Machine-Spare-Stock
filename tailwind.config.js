module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        xl: '30rem',
        lg: '26rem',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
