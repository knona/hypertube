const production = !process.env.ROLLUP_WATCH;

const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        ...colors,
        bg: '#0E0E0E',
        'ctrl-bg': 'white',
        'secondary-text': '#757575',
        'secondary-bg': '#1c1c1eff',
        'footer-bg': '#121212',
        fill: '#7878805b'
      },
      fontFamily: {
        gilroy: ['gilroy']
      }
    }
  },
  variants: {
    extend: {
      display: ['group-hover'],
      height: ['group-hover'],
      backgroundOpacity: ['disabled']
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  },
  purge: {
    content: ['./src/**/*.svelte'],
    enabled: production,
    options: {
      safelist: [
        /left-.*/,
        /top-.*/,
        /right-.*/,
        /bottom-.*/,
        /w-.*/,
        /px-.*/,
        /py-.*/,
        /pl-.*/,
        /pt-.*/,
        /pr-.*/,
        /pb-.*/,
        /space-x-.*/,
        /grid-cols-.*/,
        /gap-.*/,
        /text-((black)|(secondary-text))/,
        /bg-((white)|(ctrl-bg)|(secondary-bg)|(fill))/,
        /rounded-.*/
      ]
    }
  }
};
