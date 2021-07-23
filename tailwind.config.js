module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        "bg-opacity": "background-opacity"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
