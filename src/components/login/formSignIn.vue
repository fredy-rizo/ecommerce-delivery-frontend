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

      <div class="q-mt-md">
        <q-btn
          dark-percentage
          unelevated
          rounded
          type="submit"
          label="Iniciar Sesion"
          color="warning"
          text-color="black"
        />
      </div>
      <div class="q-mt-sm q-gutter-lg">
        <q-btn
          class="flat unelevated text-black text-weight-bolder"
          size="sm"
          @click="recoveryPassword()"
          >recuperar contraseña</q-btn
        >
        <q-btn class="text-black text-weight-bolder" to="registro" size="sm"
          >crear cuenta</q-btn
        >
      </div>
    </q-form>
  </div>
</template>

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

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      fetch(process.env.API_SERVER + "/api/user/login", options)
        .then((response) => {
          // console.log("Respuesta de API → ", response);
          if (!response.ok) throw new Error("Error en la respuesta");
          return response.json();
        })
        .then((response) => {
          // console.log("Datos recibidos → ", response);
          if (response.status == false) {
            $q.notify({
              color: "negative",
              textColor: "white",
              icon: "las la-exclamation",
              message: response.message,
            });
          } else {
            localStorage.setItem("user", JSON.stringify(response.user));
            localStorage.setItem("token", response.token);

            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Iniciando sesion...",
            });
            return router.push({ name: "inicio" });
          }
        })
        .catch((err) => {
          console.log("Error al procesar respuesta → ", err);
          $q.notify({
            color: "negative",
            textColor: "white",
            icon: "las la-exclamation",
            message: "Hubo un error con la solicitud. Intentalo nuevamente",
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
