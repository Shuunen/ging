import vue from '@vitejs/plugin-vue'
import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
// @ts-expect-error missing types
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  plugins: [
    vue(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    tailwindcss(),
    components({
      // eslint-disable-next-line new-cap
      resolvers: [Vuetify3Resolver()],
    }),
  ],
  server: {
    port: 8080,
  },
})
