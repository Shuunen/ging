import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [vue(), tailwindcss(), vuetify(), components()],
  // dedicated ports, so apps never collide when running together
  preview: { port: 4102, strictPort: true },
  server: { port: 8085, strictPort: true },
})
