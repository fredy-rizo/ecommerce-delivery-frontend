<template>
  <div>
    <q-header class="bg-green-7 q-py-xs" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          text-color="white"
          icon="las la-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-btn flat dense round to="/store">
          <img
            style="height: 40px; width: auto"
            src="~assets/logo_quooka.png"
          />
        </q-btn>
        <q-space></q-space>
        <q-btn
          flat
          round
          dense
          icon="shopping_cart"
          clickable
          tag="a"
          to="shoppingcar"
          v-if="platfrom == 'web'"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="250">
      <q-list>
        <q-item class="q-pa-md">
          <div class="row">
            <q-btn
              round
              to="formulario-page"
              style="height: 50px; width: 50px"
              class="col"
            >
              <q-avatar style="height: 50px; width: 50px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-btn>
            <div class="column q-pl-md self-center">
              <div class="col text-weight-bolder">
                {{ dataUser ? dataUser.name : "Invitado" }}
              </div>
              <div class="col">{{ dataUser ? dataUser.email : "" }}</div>
            </div>
          </div>
        </q-item>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />

        <div class="column items-center q-pa-md">
          <q-btn
            push
            to="login"
            color="green-7"
            label="Iniciar Sesion"
            size="md"
            v-close-popup
            v-if="!dataUser || dataUser.id == 1"
          />
        </div>
        <div class="column items-center q-pa-md">
          <q-btn
            push
            to="login"
            color="green-7"
            label="Cerrar Sesión"
            size="md"
            v-close-popup
            v-if="dataUser && dataUser.id != 1"
            @click="closeSession"
          />
        </div>
      </q-list>
    </q-drawer>
  </div>
</template>

<script>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { getDataUser } from "../tools/User";

const productstemp = localStorage.getItem("productCar")
  ? JSON.parse(localStorage.getItem("productCar"))
  : [];
const platfrom = ref(process.env.PLATFROM);

export default {
  name: "MainLayout",
  components: {
    EssentialLink,
  },

  setup() {
    const opendialog = ref(false);
    const leftDrawerOpen = ref(false);

    const shirtTypes = [
      {
        title: "Overside",
        to: { name: "CamisetasPage", params: { typeShirt: 1 } },
      },
      {
        title: "CropTop",
        to: { name: "CamisetasPage", params: { typeShirt: 2 } },
      },
      {
        title: "Regular Fit",
        to: { name: "CamisetasPage", params: { typeShirt: 3 } },
      },
      {
        title: "Semi-Overside",
        to: { name: "CamisetasPage", params: { typeShirt: 4 } },
      },
      {
        title: "Hoodie",
        to: { name: "CamisetasPage", params: { typeShirt: 5 } },
      },
    ];

    const linksList = [
      {
        title: "Inicio",
        caption: "Descubre lo que hay para ti",
        icon: "las la-home",
        link: "posts",
        session: false,
        platfrom: ["movil", "web"],
        roles: [],
      },
      {
        title: "Camisetas",
        caption: "Categorias",
        icon: "las la-shopping-bag",
        platfrom: ["web"],
        roles: [],
        children: shirtTypes, // 👈 submenú
      },
      {
        title: "Compras",
        caption: "Resumen de mis pedidos",
        icon: "las la-dolly-flatbed",
        link: "Shoppinglist",
        session: true,
        platfrom: ["web"],
        roles: [],
      },
    ];
    const dataUser = ref(getDataUser());

    const closeSession = () => {
      localStorage.clear();
    };

    return {
      essentialLinks: dataUser.value
        ? linksList.filter((item) => {
            let platfroms = item.platfrom.filter((item) => {
              // validar que este disponible para x plataforma
              return item == process.env.PLATFROM;
            });
            let roles =
              item.roles.length == 0
                ? 2
                : item.roles.filter((item) => {
                    // validar que este disponible para x plataforma
                    for (
                      let index = 0;
                      index < dataUser.value.roles.length;
                      index++
                    ) {
                      const element = dataUser.value.roles[index];
                      if (item == element.value) {
                        return true;
                      }
                    }
                  });
            return platfroms.length > 0 && (roles == 2 || roles.length > 0); // filtrar por sesion y plataforma
          })
        : linksList.filter((item) => {
            let platfroms = item.platfrom.filter((item) => {
              // validar que este disponible para x plataforma
              return item == process.env.PLATFROM;
            });
            return (
              item.session != true && platfroms.length > 0 // filtrar por sesion y plataforma
            );
          }),

      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      closeSession,
      platfrom,
      productstemp,
      opendialog,
    };
  },
};
</script>
