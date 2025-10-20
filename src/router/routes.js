const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "LOGIN" */ "pages/login/SignIn"),
  },
  {
    path: "/registro",
    name: "registro",
    component: () =>
      import(/* webpackChunkName: "REGISTRO" */ "pages/login/signUp"),
  },
  {
    path: "/security-code",
    name: "security-code",
    component: () => import(/* webpackChunkName: "SEGURITY-CODE" */ "pages/security/secureCode")
  },
  {
    path: "/auth-page",
    name: "auth-page",
    component: () =>
      import(/* webpackChunkName: "AUTH-PAGE" */ "pages/login/authPage"),
  },
  {
    path: "/changepassword/:token/user",
    name: "changepassword",
    component: () =>
      import(/* webpackChunkName: "AUTH-PAGE" */ "pages/login/recoveryPassword"),
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout"),
    children: [
      {
        path: "",
        name: "inicio",
        component: () =>
          process.env.PLATFROM == 'web' ?
            import(/* webpackChunkName: "Tienda de productos" */ "pages/store/MainStore")
            : import(/* webpackChunkName: "INICIO" */ "pages/Inicio/InicioPage")
        // import(/* webpackChunkName: "INICIO" */ "pages/Inicio/InicioPage"),
      },
      {
        path: "posts",
        name: "posts",
        component: () =>
          import(/* webpackChunkName: "INICIO" */ "pages/Inicio/InicioPage"),
      },
      {
        path: "sales",
        name: "sales",
        component: () =>
          import(/* webpackChunkName: "EVENTOS" */ "pages/sales/salesPage"),
      },
      {
        path: "client-id",
        name: "client-id",
        component: () =>
          import(
            /* webpackChunkName: "CLIENT-ID" */ "pages/Perfil/Cliente/ClientId"
          ),
      },
      {
        path: "formulario-page",
        name: "formulario-page",
        component: () =>
          import(
            /* webpackChunkName: "FORMULARIO-PAGE" */ "pages/Perfil/Formularios/FormularioPage"
          ),
      },
      {
        path: "Store",
        name: "Store",
        component: () =>
          import(/* webpackChunkName: "Tienda de productos" */ "pages/store/MainStore"),
      },
      {
        path: "/shoppingcar",
        name: "Shoppingcar",
        component: () =>
          import(
            /* webpackChunkName: "Tienda de productos" */ "pages/shoppingCar/Car.vue"
          ),
      },
      {
        path: "/shoppingList",
        name: "Shoppinglist",
        component: () =>
          import(
            /* webpackChunkName: "Tienda de productos" */ "pages/shopping/ShoppingList.vue"
          ),
      },
      {
        path: "/notifications",
        name: "notifications",
        component: () =>
          import(
            /* webpackChunkName: "Tienda de productos" */ "pages/notifications/Notifications.vue"
          ),
      },

    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () =>
      import(/* webpackChunkName: "ERROR-404" */ "pages/shared/ErrorNotFound"),
  },
];

export default routes;
