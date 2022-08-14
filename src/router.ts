import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    component: () => import("./views/Login.vue")
  },
  {
    path: "/logon",
    component: () => import("./views/Logon.vue")
  },
  {
    path: "/chat",
    component: () => import("./views/ChatRoom.vue")
  }
];

export const router = createRouter({
  history: createWebHashHistory("/"),
  routes
});