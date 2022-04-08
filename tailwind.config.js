module.exports = {
  content: ['./src/popup/**/*.{html,js}', './public/**/*.{html,js}'],
  theme: {
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      container: {
        margin: '2rem'
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
};
