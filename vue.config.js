const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  lintOnSave: false,
  pluginOptions: {
    vuetify: {},
  },
  pwa: {
    name: 'Ging',
    themeColor: '#fb923c',
    iconPaths: {
      faviconSVG: 'images/logo.svg',
      favicon32: 'images/logo-32.png',
      favicon16: 'images/logo-16.png',
      appleTouchIcon: 'images/logo-512-maskable.png',
      maskIcon: 'images/logo.svg',
      msTileImage: 'images/logo-512.png',
    },
  },
})
