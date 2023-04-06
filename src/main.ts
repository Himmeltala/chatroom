import { createApp } from "vue";
import router from "@/router";
import App from "@/App.vue";
import "@/style.scss";

createApp(App).use(router).use(createPinia()).mount("#app");
