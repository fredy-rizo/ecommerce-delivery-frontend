<template>
  <q-layout view="lHh Lpr lFf">
    <NavBaradmin v-if="type == 2" />
    <NavBar v-if="type == 1 || type == 3" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import NavBaradmin from "./NavBar_admin";
import NavBar from "./NavBar_users";

export default {
  setup() {
    const user = ref(JSON.parse(localStorage.getItem("user")));
    let rol = 1;
    if (user.value) {
      for (let index = 0; index < user.value.roles.length; index++) {
        const element = user.value.roles[index];
        rol = element.value;
      }
    }
    const type = ref(rol);

    return {
      user,
      type,
      platform: process.env.PLATFROM ? process.env.PLATFROM : "movil",
    };
  },
  components: {
    NavBaradmin,
    NavBar,
  },
};
</script>
