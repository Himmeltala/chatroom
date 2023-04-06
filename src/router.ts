import { createRouter, createWebHashHistory } from "vue-router";

interface normalizeCookieReturn {
  cookie?: any;
  isDefined: boolean;
}

export function checkCookie(name: string): normalizeCookieReturn {
  let cookieData = <normalizeCookieReturn>{};
  let localCookies = useCookies().get(name);
  cookieData.isDefined = !!localCookies;
  if (cookieData.isDefined) localCookies.cookie = localCookies;
  return cookieData;
}

const routes = [
  {
    path: "/",
    redirect: "/login",
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/Login.vue")
      },
      {
        path: "logon",
        name: "Logon",
        component: () => import("@/views/Logon.vue")
      },
      {
        path: "chat",
        name: "Chat",
        component: () => import("@/views/ChatRoom.vue")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory("/"),
  routes
});

router.beforeEach((to, from, next) => {
  let cookie = checkCookie("USERINFO");
  if (!cookie.isDefined && to.name !== "Login") {
    next({ name: "Login" });
  } else if (cookie.isDefined && to.name === "Login") {
    next({ name: "Chat" });
  } else {
    next();
  }
});

export default router;
