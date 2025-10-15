<template>
  <div
    class="flex flex-center column q-pa-lg"
    style="
      min-height: 100vh;
      background: linear-gradient(180deg, #fafafa 0%, #e0e0e0 100%);
    "
  >
    <q-card
      class="q-pa-lg shadow-4"
      style="max-width: 480px; width: 100%; border-radius: 16px"
    >
      <div class="text-center">
        <q-btn to="/" flat>
          <img
            src="~assets/QuokkaCircular.png"
            style="height: 160px; width: 160px"
            class="q-mb-md"
          />
        </q-btn>
        <h4 class="text-weight-bold q-mb-none">Bienvenido</h4>
        <p class="text-grey-8 text-subtitle2 q-mt-none">
          Crea tu cuenta y únete a Quooka
        </p>
      </div>

      <q-separator class="q-my-md" />

      <FormSignUp />
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import FormSignUp from "components/login/formSignUp.vue";

export default defineComponent({
  setup() {},

  components: {
    FormSignUp,
  },
});
</script>
