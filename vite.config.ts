import vue from '@vitejs/plugin-vue'
import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    components({
      // eslint-disable-next-line new-cap
      resolvers: [Vuetify3Resolver()],
    }),
  ],
  server: {
    port: 8080,
  },
})
