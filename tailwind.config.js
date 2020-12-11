module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {   backgroundImage: theme => ({
               'hero-pattern': "url('https://4kwallpapers.com/images/walls/thumbs_2t/1455.jpg')",
              'footer-texture': "url('/img/bg.png')",
              }) },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
