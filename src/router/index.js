import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach((to, from, next) => {
    let user = null

    try {
      const rawUser = localStorage.getItem("user")
      user = rawUser ? JSON.parse(rawUser) : null
    } catch (e) {
      user = null
    }

    const rutasPublicas = ["login", "registro", "auth-page", "changepassword"]
    const esRutaPublica = rutasPublicas.includes(to.name)

    if (!esRutaPublica && !user) {
      next({ name: "login" })
    } else {
      next()
    }

  })

  return Router;
});
