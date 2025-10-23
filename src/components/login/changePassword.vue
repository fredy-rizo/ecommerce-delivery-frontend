<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="changePassword" class="q-gutter-md">
      <q-input
        rounded
        outlined
        color="green-6"
        bg-color="grey-2"
        label="Correo electrónico"
        v-model="email"
        type="email"
        :rules="[
          (val) => (val && val.length > 0) || 'Campo vacío',
          isValidEmail,
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="email" color="green-6" />
        </template>
      </q-input>

      <div class="row justify-center">
        <q-btn
          unelevated
          rounded
          label="Enviar codigo"
          type="submit"
          color="green"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const email = ref(null);

    const isValidEmail = (val) => {
      const emailValid =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailValid.test(val) || "El correo no parece ser válido";
    };

    const changePassword = async () => {
      const data = {
        email: email.value,
      };

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      fetch(process.env.API_SERVER + "/api/user/recover-password-code", options)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          if (response.status === false) {
            $q.notify({
              color: response.alreadyVerified ? "orange" : "negative",
              textColor: "white",
              icon: response.alreadyVerified ? "info" : "las la-exclamation",
              message: response.msj,
            });
            return;
          }
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Codigo enviado",
          });
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          return router.push({ name: "new-password-confirm" });
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
      isValidEmail,
      changePassword,
    };
  },
};
</script>
