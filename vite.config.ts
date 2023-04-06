import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver, LayuiVueResolver } from "unplugin-vue-components/resolvers";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        "pinia",
        "vue-router",
        {
          from: "vue",
          imports: ["PropType"],
          type: true
        },
        {
          "@vueuse/integrations/useCookies": ["useCookies"]
        }
      ],
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/ // .vue
      ],
      resolvers: [ElementPlusResolver(), LayuiVueResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver(), LayuiVueResolver()]
    })
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '@/assets/styles/variables.scss';
          @import '@/assets/styles/mixins.scss';
        `
      }
    }
  }
});
