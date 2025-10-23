<template>
  <div class="flex flex-center bg-grey-1" style="min-height: 100vh">
    <q-card
      class="q-pa-xl q-px-lg"
      style="max-width: 450px; width: 100%; border-radius: 18px"
    >
      <div class="text-center q-mb-md">
        <q-btn to="/" flat no-caps>
          <img
            src="~assets/logo_quooka.png"
            alt="Logo Quooka"
            style="height: 120px; width: 120px"
          />
        </q-btn>
        <h5 class="text-weight-bold q-mt-sm">Restablecer contraseña</h5>
        <p class="text-grey-7 q-mb-lg" style="font-size: 14px">
          Ingresa tu correo
        </p>
      </div>

      <changePassword />

      <div class="text-center q-mt-lg">
        <q-btn
          to="/login"
          color="black"
          flat
          rounded
          icon="arrow_back"
          label="Volver al inicio de sesión"
        />
      </div>
    </q-card>
  </div>
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
