<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="signIn" class="q-gutter-md">
      <q-input
        rounded
        outlined
        color="black"
        bg-color="grey-1"
        v-model="email"
        label="Email"
        :rules="[
          (val) => (val && val.length > 0) || 'Por favor ingrese un email',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="las la-at" />
        </template>
      </q-input>

      <q-input
        rounded
        outlined
        color="black"
        bg-color="grey-1"
        v-model="password"
        label="contraseña"
        :type="isPwd ? 'password' : 'text'"
        :rules="[
          (val) =>
            (val !== null && val !== '') || 'Por favor ingrese su contraseña',
          (val) =>
            (val && val.length >= 8) ||
            'la contraseña como minimo debe tener 8 caracteres',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="las la-key" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <div class="row justify-center q-mt-md">
        <q-btn
          unelevated
          rounded
          color="green-6"
          text-color="white"
          type="submit"
          label="Iniciar Sesión"
          class="full-width"
          size="lg"
          style="font-weight: 600; padding: 12px"
        />
      </div>

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-6">
          <q-btn
            outline
            rounded
            color="black"
            label="Crear cuenta"
            to="registro"
            class="full-width"
            no-caps
            padding="10px 16px"
          />
        </div>

        <div class="col-6">
          <q-btn
            outline
            rounded
            color="black"
            label="Confirmar cuenta"
            to="security-code"
            class="full-width"
            no-caps
            padding="10px 16px"
          />
        </div>
      </div>

      <div class="text-center q-mt-md">
        <router-link
          class="text-grey-7"
          to="/change-password"
          style="text-decoration: none; font-size: 14px"
        >
          ¿Olvidaste tu contraseña?
        </router-link>
      </div>
    </q-form>
  </div>
</template>

<style scoped>
.tracking-widest {
  letter-spacing: 0.5em;
}
</style>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();

    const email = ref(null);
    const password = ref(null);
    const isPwd = ref(true);

    const router = useRouter();

    const signIn = () => {
      const data = {
        email: email.value?.toLowerCase(),
        password: password.value,
      };

      fetch(process.env.API_SERVER + "/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(async (res) => {
          const response = await res.json();
          if (!res.ok)
            throw new Error(
              response.msj || "Error en la respuesta del servidor"
            );

          if (!response.status) {
            $q.notify({
              color: "negative",
              textColor: "white",
              icon: "las la-exclamation",
              message: response.msj || "Error al iniciar sesión",
            });
            return;
          }

          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("token", response.token);

          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: response.msj || "Inicio de sesión exitoso",
          });

          router.push({ name: "posts" });
        })
        .catch((err) => {
          console.error("Error al procesar respuesta →", err);
          $q.notify({
            color: "negative",
            textColor: "white",
            icon: "las la-exclamation",
            message:
              err.message ||
              "Hubo un error con la solicitud. Inténtalo nuevamente",
          });
        });
    };

    return {
      email,
      password,
      isPwd,
      signIn,
    };
  },
};
</script>
