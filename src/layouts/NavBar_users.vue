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
        <!-- <q-dialog v-model="opendialog">
          <InviteClubMembership />
        </q-dialog> -->
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
          icon="shopping_cart"
          clickable
          tag="a"
          to="shoppingcar"
          v-if="platfrom == 'web'"
        />
        <q-btn
          flat
          round
          dense
          icon="notifications"
          clickable
          tag="a"
          to="notifications"
          v-if="platfrom == 'movil'"
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
              <div class="col">{{ dataUser ? dataUser.whatsapp : "" }}</div>
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
            v-if="!dataUser || dataUser.id == 1"
          />
        </div>
        <!-- <div class="column items-center q-pa-md">
          <q-btn
            push
            to="registro"
            color="green-7"
            label="Registrate"
            size="md"
            v-close-popup
            v-if="!dataUser || dataUser.id == 1"
          />
        </div> -->
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
// import InviteClubMembership from "src/components/ClubCannabis/InviteClubMembership.vue";

const productstemp = localStorage.getItem("productCar")
  ? JSON.parse(localStorage.getItem("productCar"))
  : [];
const platfrom = ref(process.env.PLATFROM);

const linksList = [
  {
    title: "Inicio",
    caption: "Descubre lo que hay para ti",
    icon: "las la-home",
    link: "inicio",
    session: false,
    platfrom: ["movil", "web"],
    roles: [], // codigo del rol permitido para mostrar
  },
  {
    title: "Compras",
    caption: "Resumen de mis pedidos",
    icon: "las la-dolly-flatbed",
    link: "Shoppinglist",
    session: true,
    platfrom: ["web"],
    roles: [], // codigo del rol permitido para mostrar
  },
  // {
  //   title: "Chat",
  //   caption: "mensajes Privados",
  //   icon: "las la-comments",
  //   link: "mensajes",
  //   session: true,
  //   platfrom: ["movil", "web"],
  //   roles: [], // codigo del rol permitido para mostrar
  // },
  // {
  //   title: "Miembros",
  //   caption: "Registra miembros al club",
  //   icon: "las la-bookmark",
  //   link: "miembrosseller",
  //   session: true,
  //   platfrom: ["web"],
  //   roles: ["3", "2"], // codigo del rol permitido para mostrar
  // },
  // {
  //   title: "Politicas de Privacidad",
  //   caption: "Acuerdos de Ecommerce",
  //   icon: "las la-shield-alt",
  //   link: "politicas-page",
  //   session: false,
  //   platfrom: ["movil", "web"],
  //   roles: [], // codigo del rol permitido para mostrar
  // },
];

export default {
  name: "MainLayout",
  components: {
    EssentialLink,
  },

  setup() {
    const opendialog = ref(false);
    const leftDrawerOpen = ref(false);

    const dataUser = ref(getDataUser());

    const duedate = dataUser.value.membership // fecha de vencimiento de la membresia
      ? new Date(
          dataUser.value.membership.duedate != ""
            ? dataUser.value.membership.duedate
            : "2022-01-01"
        )
      : new Date();
    const actualdate = new Date(); // fecha del dia actual
    const expire = duedate < actualdate; // validacion de fecha vencimiento para la membresia

    const typemembership =
      dataUser.value.membership && dataUser.value.membership.membershiptype
        ? dataUser.value.membership.membershiptype.value
        : 0; // tipo de membresia

    const payed =
      dataUser.value.membership && dataUser.value.membership.status
        ? dataUser.value.membership.status.code
        : 0; // estado del pago

    const inviteClub =
      expire || typemembership != 1 || payed != 1 ? true : false; // invitar a formar parte del club, si aun esta vigente o si no es premium

    const closeSession = () => {
      localStorage.clear();
    };

    return {
      inviteClub,
      dataUser,
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
