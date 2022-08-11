import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver, LayuiVueResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver(), LayuiVueResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver(), LayuiVueResolver()]
    })
  ]
});
