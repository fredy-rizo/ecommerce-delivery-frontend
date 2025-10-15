<template>
  <div>
    <q-header class="bg-green-7 q-py-xs" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          text-color="black"
          icon="las la-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-btn flat dense round to="/">
          <img style="height: 45px" src="~assets/logo_quooka.png" />
        </q-btn>

        <q-toolbar-title style="color: black"> Ecommerce </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="newspaper"
          clickable
          tag="a"
          to="posts"
          v-if="platfrom == 'web'"
        />
        <q-btn
          flat
          round
          dense
          icon="store"
          clickable
          tag="a"
          to="Store"
          v-if="platfrom == 'web'"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="250">
      <q-list>
        <q-item class="q-pa-md">
          <!-- <q-img
            src="https://cdn.quasar.dev/img/material.png"
            style="object-fit: fill; object-position: 50% 60%; height: 225px"
          > -->
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
              <div class="col">{{ dataUser.whatsapp }}</div>
            </div>
          </div>
          <!-- </q-img> -->
        </q-item>

        <!-- <q-item-label header> Ecommerce </q-item-label> -->
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
      <q-item> </q-item>
    </q-drawer>
  </div>
</template>

<script>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { getDataUser } from "../tools/User";

const linksList = [
  {
    title: "Inicio",
    caption: "Descubre lo que hay para ti",
    icon: "las la-home",
    platfrom: ["movil", "web"],
    link: "inicio",
    roles: [],
  },
  // {
  //   title: "Miembros",
  //   caption: "Invirtieron con nosotros",
  //   icon: "groups",
  //   link: "miembros",
  //   platfrom: ["web"],
  //   roles: ["3", "2"],
  // },
  {
    title: "Ventas",
    caption: "Mis ventas",
    icon: "las la-dolly-flatbed",
    platfrom: ["web"],
    link: "sales",
    roles: [],
  },
  // {
  //   title: "Chat",
  //   caption: "mensajes Privados",
  //   icon: "las la-comments",
  //   platfrom: ["movil", "web"],
  //   link: "mensajes",
  //   roles: [],
  // },
  // {
  //   title: "Usuarios",
  //   caption: "Personas registradas",
  //   icon: "las la-comments",
  //   link: "mensajes",
  // },
  // {
  //   title: "Politicas de Privacidad",
  //   caption: "Acuerdos de Ecommerce",
  //   icon: "las la-shield-alt",
  //   link: "politicas-page",
  //   platfrom: ["movil", "web"],
  //   roles: [],
  // },
];

export default {
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    const platfrom = ref(process.env.PLATFROM);
    const dataUser = ref(getDataUser());

    const closeSession = () => {
      localStorage.clear();
    };

    return {
      platfrom,
      dataUser,
      closeSession,
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
    };
  },
};
</script>
