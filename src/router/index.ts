import { createRouter, createWebHashHistory } from "vue-router";
import { checkCookie } from "../utils";

const routes = [
  {
    path: "/",
    redirect: checkCookie("USERID", {
      exsit: () => "/chat",
      notExsit: () => "/login",
    }),
  },
  {
    path: "/login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/logon",
    component: () => import("@/views/Logon.vue"),
  },
  {
    path: "/chat",
    component: () => import("@/views/ChatRoom.vue"),
  },
];

export const router = createRouter({
  history: createWebHashHistory("/"),
  routes,
});
