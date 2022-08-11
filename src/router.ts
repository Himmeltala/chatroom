import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/group",
    component: () => import("./views/GroupChatRoom/GroupChatRoom.vue")
  }
];

export const router = createRouter({
  history: createWebHashHistory("/"),
  routes
});