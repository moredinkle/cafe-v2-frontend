import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";

const guard = function (to: any, from: any, next: any) {
  const token = localStorage.getItem("auth-token");
  if (token) {
    next();
  } else {
    router.push("/");
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/menus",
      name: "menus",
      component: () => import("../views/MenuListView.vue"),
      beforeEnter: (to, from, next) => {
        guard(to, from, next);
      },
    },
    {
      path: "/ventas",
      name: "ventas",
      component: () => import("../views/SalesView.vue"),
      beforeEnter: (to, from, next) => {
        guard(to, from, next);
      },
    },
    {
      path: "/menus/:id_menu",
      name: "menu",
      component: () => import("../views/MenuView.vue"),
      beforeEnter: (to, from, next) => {
        guard(to, from, next);
      },
    },
  ],
});

export default router;
