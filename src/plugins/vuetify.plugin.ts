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
        dark: true, // eslint-disable-line @typescript-eslint/naming-convention
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
        dark: false, // eslint-disable-line @typescript-eslint/naming-convention
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
