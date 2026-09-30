import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [vue(), tailwindcss(), vuetify(), components()],
  server: {
    port: 8085,
  },
})
