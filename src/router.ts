import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/group",
    component: () => import("./components/ConfigMenus.vue")
  },
  {
    path: "/single",
    component: () => import("./components/BottomMenus.vue")
  }
];

export const router = createRouter({
  history: createWebHashHistory("/"),
  routes
});