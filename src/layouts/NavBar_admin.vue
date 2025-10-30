<template>
  <div>
    <q-header class="bg-green-7 text-white q-py-xs" elevated>
      <!-- 🔷 Menu lateral-->
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          text-color="white"
          icon="las la-bars"
          aria-label="Abrir menu"
          @click="toggleLeftDrawer"
        />

        <!-- 🔷 Logo -->
        <q-btn flat dense round to="/store">
          <img
            style="height: 40px; width: auto"
            src="~assets/logo_quooka.png"
          />
          <q-toolbar-title class="text-weight-medium">
            Ecommerce
          </q-toolbar-title>
        </q-btn>

        <q-space></q-space>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="250">
      <q-list>
        <!-- 🔹 Usuario -->
        <q-item class="q-pa-md">
          <div class="row">
            <q-btn
              round
              to="client-id"
              style="height: 50px; width: 50px"
              class="col"
            >
              <q-avatar style="height: 50px; width: 50px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-btn>
            <div class="column q-pl-md self-center">
              <div class="col">
                <div class="text-weight-bolder">{{ dataUser.name }}</div>
              </div>
              <div class="col">{{ dataUser.email }}</div>
            </div>
          </div>
        </q-item>

        <!-- 🔹 Enlaces -->
        <template v-for="link in essentialLinks" :key="link.title">
          <!-- Si tiene submenú -->
          <q-expansion-item
            v-if="link.children"
            :icon="link.icon"
            :label="link.title"
            :caption="link.caption"
            expand-separator
            dense
          >
            <q-list dense>
              <EssentialLink
                v-for="child in link.children"
                :key="child.title"
                v-bind="child"
                :class="
                  child.title === 'Oversize' ? 'text-weight-bold text-lg' : ''
                "
              />
            </q-list>
          </q-expansion-item>

          <!-- Si es un enlace normal -->
          <EssentialLink v-else v-bind="link" />
        </template>

        <!-- 🔹 Botones de sesión -->
        <div class="column items-center q-pa-md">
          <q-btn
            push
            to="login"
            color="green-7"
            label="Iniciar Sesion"
            size="md"
            v-close-popup
            v-if="!dataUser"
          />
        </div>
        <div class="column items-center q-pa-md">
          <q-btn
            push
            to="registro"
            color="green-7"
            label="Registrate"
            size="md"
            v-close-popup
            v-if="!dataUser"
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
            v-if="dataUser"
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

export default {
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const platfrom = ref(process.env.PLATFROM);
    const dataUser = ref(getDataUser());

    // 🔸 Lista de enlaces principales
    const linksList = [
      {
        title: "Inicio",
        caption: "Descubre lo que hay para ti",
        icon: "las la-home",
        platfrom: ["movil", "web"],
        link: "posts",
        roles: [],
      },
      {
        title: "Ventas",
        caption: "Mis ventas",
        icon: "las la-dolly-flatbed",
        platfrom: ["web"],
        link: "sales",
        roles: [],
      },
      {
        title: "Miembros",
        caption: "Registra miembros al club",
        icon: "las la-bookmark",
        link: "miembros",
        session: true,
        platfrom: ["web"],
        roles: ["3", "2"],
      },
    ];

    const closeSession = () => {
      localStorage.clear();
    };

    const essentialLinks = dataUser.value
      ? linksList.filter((item) => {
          const platfroms = item.platfrom.filter(
            (p) => p === process.env.PLATFROM
          );
          const roles =
            item.roles.length === 0
              ? 2
              : item.roles.filter((r) => {
                  for (
                    let index = 0;
                    index < dataUser.value.roles.length;
                    index++
                  ) {
                    const element = dataUser.value.roles[index];
                    if (r === element.value) return true;
                  }
                });
          return platfroms.length > 0 && (roles === 2 || roles.length > 0);
        })
      : linksList.filter((item) => {
          const platfroms = item.platfrom.filter(
            (p) => p === process.env.PLATFROM
          );
          return item.session != true && platfroms.length > 0;
        });

    return {
      platfrom,
      dataUser,
      closeSession,
      essentialLinks,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
