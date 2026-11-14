import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { uniqueMark } from 'shuutils/plugins'
import components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify'
import { cspNonce } from './src/plugins/csp-nonce.ts'

// https://vitejs.dev/config/
// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  build: { reportCompressedSize: false },
  plugins: [vue(), tailwindcss(), vuetify(), components(), uniqueMark(), cspNonce()],
  // dedicated ports, so apps never collide when running together
  preview: { port: 4102, strictPort: true },
  server: { port: 5102, strictPort: true },
})
