<template>
  <q-card-section class="text-center">
    <!-- <img
      src="~assets/fondologin.jpeg"
      style="position: fixed; height: 100%; left: 0; bottom: 0; z-index: -1"
    /> -->
    <div
      style="
        position: fixed;
        height: 100%;
        width: 100%;
        left: 0;
        bottom: 0;
        z-index: -1;
        background: #3faa47;
      "
    ></div>
    <q-btn to="/" unelevated>
      <img
        class="q-ma-lg"
        style="height: 200px; width: 200px"
        src="~assets/logo_quooka.png"
      />
    </q-btn>
    <h5 class="q-ma-xs text-weight-bolder">Cambiando la contraseña</h5>
    <div class="row justify-center">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-6">
        <changePassword :token="$route.params.token" />
      </div>
    </div>
  </q-card-section>
</template>

<script>
import { defineComponent } from "vue";
import changePassword from "components/login/changePassword.vue";

export default defineComponent({
  setup() {},

  components: {
    changePassword,
  },
});
</script>
