/* eslint-disable @typescript-eslint/no-magic-numbers */
import '@mdi/font/css/materialdesignicons.css'
import colors from 'tailwindcss/colors'
import { createVuetify } from 'vuetify'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          background: colors.gray[800],
          error: colors.red[300],
          info: colors.blue[300],
          primary: colors.indigo[600],
          secondary: colors.orange[400],
          success: colors.green[300],
          surface: colors.gray[900],
          warning: colors.orange[300],
        },
        dark: true, // eslint-disable-line @typescript-eslint/naming-convention
      },
      light: {
        colors: {
          background: colors.gray[50],
          error: colors.red[600],
          info: colors.blue[600],
          primary: colors.indigo[600],
          success: colors.green[600],
          surface: colors.gray[100],
          warning: colors.orange[600],
        },
        dark: false, // eslint-disable-line @typescript-eslint/naming-convention
      },
    },
  },
})
