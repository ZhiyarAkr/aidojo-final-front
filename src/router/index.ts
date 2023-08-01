import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import SavedTexts from "@/views/SavedTexts.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/auth/login",
      name: "Login",
      component: Login,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/auth/signup",
      name: "Signup",
      component: Signup,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/texts",
      name: "savedTexts",
      component: SavedTexts,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("accessToken");
  if (isAuthenticated == null && to.meta.requiresAuth) {
    return next({
      name: "Login",
    });
  }
  next();
});

// @ts-ignore
window.vueRouter = router;
export default router;
