/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */
import '@mdi/font/css/materialdesignicons.css'
import colors from 'tailwindcss/colors'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'


// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: colors.gray[800],
          surface: colors.gray[900],
          primary: colors.indigo[600],
          secondary: colors.orange[400],
          error: colors.red[300],
          info: colors.blue[300],
          success: colors.green[300],
          warning: colors.orange[300],
        },
      },
      light: {
        dark: false,
        colors: {
          background: colors.gray[50],
          surface: colors.gray[100],
          primary: colors.indigo[600],
          error: colors.red[600],
          info: colors.blue[600],
          success: colors.green[600],
          warning: colors.orange[600],
        },
      },
    },
  },
})
