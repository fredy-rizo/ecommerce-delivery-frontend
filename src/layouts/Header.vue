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

      <!-- <div class="q-gutter-ms q-ml-none">
          <q-btn round icon="las la-bell" color="black">
            <q-badge floating color="red" rounded />
          </q-btn>
        </div> -->
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
