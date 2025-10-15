<template>
  <div
    class="flex flex-center column q-pa-lg"
    style="
      min-height: 100vh;
      background: linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%);
    "
  >
    <q-card
      class="q-pa-lg shadow-4"
      style="max-width: 420px; width: 100%; border-radius: 16px"
    >
      <div class="text-center">
        <q-btn to="/" flat>
          <img
            src="~assets/QuokkaCircular.png"
            style="height: 150px; width: 150px"
            class="q-mb-md"
          />
        </q-btn>

        <h4 class="text-weight-bold q-mb-none">Bienvenido</h4>
        <p class="text-grey-8 text-subtitle2 q-mt-none">
          Inicia sesión en tu cuenta
        </p>
      </div>

      <q-separator class="q-my-md" />

      <FormSignIn />
    </q-card>
  </div>
</template>

<script>
import FormSignIn from "components/login/formSignIn.vue";

export default {
  name: "SignIn",

  components: { FormSignIn },
};
</script>
