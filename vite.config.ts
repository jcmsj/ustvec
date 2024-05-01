import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import dsv from '@rollup/plugin-dsv'
// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.csv'],
  plugins: [
    vue({
      script: {
        propsDestructure:true,
      },
    }),
    Components({
      resolvers: [
        IconsResolver({
          componentPrefix: '',
          enabledCollections: ['ic'],
        }),
      ]
    }),
    Icons({
      compiler: 'vue3',
    }),
    dsv(),
  ],
})
