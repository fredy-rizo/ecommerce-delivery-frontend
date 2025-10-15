<template>
  <q-card-section class="text-center">
    <div
      style="
        position: fixed;
        height: 100%;
        width: 100%;
        left: 0;
        bottom: 0;
        z-index: -1;
        background: #E0E0E0;
      "
    ></div>
    <q-btn to="/" unelevated>
      <img
        class="q-ma-lg"
        style="height: 200px; width: 200px"
        src="~assets/QuokkaCircular.png"
      />
    </q-btn>
    <h5 class="q-ma-xs text-weight-bolder">Bienvenido</h5>

    <h5 class="q-ma-xs text-weight-bolder">INICIAR SESION</h5>

    <div class="row justify-center">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-6">
        <FormSignIn />
      </div>
    </div>
  </q-card-section>
</template>

<script>
import FormSignIn from "components/login/formSignIn.vue";

export default {
  name: "SignIn",

  components: { FormSignIn },
};
</script>
