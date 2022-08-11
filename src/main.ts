import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";

createApp(App)
  .use(router).use(ElementPlus)
  .mount("#app");
