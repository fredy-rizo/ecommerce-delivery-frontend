<template>
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
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: "HeaderMain",

  setup() {
    return {};
  },
};
</script>
