<template>
  <div>
    <!-- NAVBAR -->
    <q-header class="bg-brown text-white q-py-xs shadow-2" elevated>
      <q-toolbar>
        <!-- Botón menú -->
        <q-btn
          flat
          dense
          round
          text-color="white"
          icon="las la-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- Logo -->
        <q-btn flat dense round to="/store">
          <img
            style="height: 42px; width: auto"
            src="~assets/logo_quooka.png"
            alt="Quokka Logo"
          />
        </q-btn>

        <q-space />

        <!-- Carrito -->
        <q-btn
          flat
          round
          dense
          icon="shopping_cart"
          color="white"
          :ripple="false"
          tag="a"
          to="shoppingcar"
          v-if="platfrom === 'web'"
        >
          <q-badge
            v-if="cartCount > 0"
            floating
            color="red"
            text-color="white"
            transparent
            class="text-weight-bold"
          >
            {{ cartCount }}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      class="bg-beige text-carbon"
    >
      <q-list separator>
        <q-item class="q-pa-md bg-white shadow-sm">
          <div class="row items-center no-wrap">
            <q-btn
              round
              to="client-id"
              style="height: 50px; width: 50px"
              class="col"
            >
              <q-avatar size="50px" class="bg-gray">
                <img
                  :src="
                    dataUser?.avatar?.[0]?.avatar ||
                    'https://cdn.quasar.dev/img/boy-avatar.png'
                  "
                  alt="Avatar"
                />
              </q-avatar>
            </q-btn>
            <div class="column q-pl-md">
              <div class="text-weight-bold text-brown">
                {{ dataUser && dataUser.name ? dataUser.name : "" }}
              </div>
              <div class="text-caption text-carbon/70">
                {{ dataUser && dataUser.email ? dataUser.email : "" }}
              </div>
            </div>
          </div>
        </q-item>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          class="hover:bg-olive/10 text-carbon"
        />

        <!-- Sesión -->
        <div class="column items-center q-pa-md">
          <q-btn
            push
            color="yellow"
            text-color="carbon"
            label="Iniciar Sesión"
            size="md"
            v-close-popup
            v-if="!dataUser?.id || dataUser.id === 1"
            class="w-full"
          />
          <q-btn
            push
            color="coral"
            text-color="_black"
            label="Cerrar Sesión"
            size="md"
            to="login"
            v-close-popup
            v-if="dataUser?.id && dataUser.id !== 1"
            class="w-full"
            @click="closeSession"
          />
        </div>
      </q-list>
    </q-drawer>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { getDataUser } from "../tools/User";

const platfrom = ref(process.env.PLATFROM);

export default {
  name: "MainLayout",
  components: { EssentialLink },
  setup() {
    const leftDrawerOpen = ref(false);
    const dataUser = ref(null);
    const essentialLinks = ref([]);
    const cartCount = ref(0);

    const updateCartCount = () => {
      const items = JSON.parse(localStorage.getItem("productCar") || "[]");
      cartCount.value = items.reduce((sum, item) => sum + (item.cant || 1), 0);
    };

    // Escuchar cambios para el carrito
    window.addEventListener("storage", (e) => {
      if (e.key === "productCar") updateCartCount();
    });

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
        caption: "Categorías",
        icon: "las la-shopping-bag",
        platfrom: ["web"],
        roles: [],
        children: [
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
        ],
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

    const updateLinks = () => {
      if (dataUser.value?.id) {
        essentialLinks.value = linksList.filter((item) => {
          const validPlatform = item.platfrom.includes(process.env.PLATFROM);
          const roles =
            item.roles.length === 0
              ? true
              : item.roles.some((role) =>
                  dataUser.value.roles?.some((r) => r.value === role)
                );
          return validPlatform && roles;
        });
      } else {
        essentialLinks.value = linksList.filter(
          (item) =>
            !item.session && item.platfrom.includes(process.env.PLATFROM)
        );
      }
    };

    onMounted(() => {
      dataUser.value = getDataUser();
      updateLinks();
      updateCartCount(); // inicializa contador
      window.addEventListener("cartUpdated", updateCartCount);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("cartUpdated", updateCartCount);
    });

    const closeSession = () => {
      localStorage.clear();
      dataUser.value = null;
      updateLinks();
    };

    return {
      dataUser,
      essentialLinks,
      leftDrawerOpen,
      toggleLeftDrawer: () => (leftDrawerOpen.value = !leftDrawerOpen.value),
      closeSession,
      platfrom,
      updateCartCount,
      cartCount,
    };
  },
};
</script>

<style scoped>
.bg-brown {
  background-color: #8b5e3c;
}
.bg-beige {
  background-color: #f5e8d0;
}
.bg-gray {
  background-color: #e5e5e5;
}
.text-brown {
  color: #8b5e3c;
}
.text-carbon {
  color: #333333;
}
.bg-olive\/10 {
  background-color: rgba(163, 177, 138, 0.1);
}
</style>
