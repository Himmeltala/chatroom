import { createRouter, createWebHashHistory } from "vue-router";
import { checkCookie } from "../utils";

const routes = [
  {
    path: "/",
    redirect: "/login",
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/Login.vue"),
      },
      {
        path: "logon",
        name: "Logon",
        component: () => import("@/views/Logon.vue"),
      },
      {
        path: "chat",
        name: "Chat",
        component: () => import("@/views/ChatRoom.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory("/"),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!checkCookie("USERID").isExsit && to.name !== "Login") {
    next({ name: "Login" });
  } else {
    next();
  }
});

export { router };
