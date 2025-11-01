<template>
  <div class="flex flex-center">
    <q-card
      class="q-pa-xl shadow-10"
      style="
        max-width: 450px;
        width: 100%;
        border-radius: 20px;
        position: relative;
      "
    >
      <!-- Flecha de regreso -->
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        color="grey-7"
        to="/login"
        style="position: absolute; top: 16px; left: 16px"
      />

      <!-- Encabezado -->
      <div class="text-center q-mb-lg" style="margin-top: 30px">
        <q-icon name="verified_user" size="80px" color="green-6" />
        <h5 class="q-mt-md q-mb-none text-weight-bold">
          Actualizar contraseña
        </h5>
        <p class="text-grey-7 q-mt-sm">
          Ingresa tu correo y el código de 6 dígitos que te enviamos
        </p>
      </div>

      <q-separator class="q-mb-lg" />

      <!-- Formulario -->
      <q-form @submit.prevent="updatePasswordWithoutToken" class="q-gutter-md">
        <q-input
          rounded
          outlined
          color="brown-6"
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
            <q-icon name="email" color="brown-6" />
          </template>
        </q-input>

        <q-input
          rounded
          outlined
          color="brown-6"
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
            <q-icon name="key" color="brown-6" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          rounded
          outlined
          color="brown-6"
          bg-color="grey-2"
          label="Código de seguridad"
          v-model="code"
          maxlength="6"
          input-class="text-h6 text-weight-bold tracking-widest"
          :rules="[
            (val) => (val && val.length > 0) || 'Campo vacío',
            (val) =>
              (val && val.length === 6) || 'El código debe tener 6 dígitos',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="brown-6" />
          </template>
        </q-input>

        <div class="q-mt-xl">
          <q-btn
            unelevated
            rounded
            label="Actualizar"
            type="submit"
            color="brown-6"
            text-color="white"
            class="full-width"
            size="lg"
            style="font-weight: 600; padding: 12px"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<style scoped>
.tracking-widest {
  letter-spacing: 0.5em;
}
</style>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const email = ref(null);
    const code = ref(null);
    const password = ref(null);
    const isPwd = ref(true);

    const isValidEmail = (val) => {
      const emailValid =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailValid.test(val) || "Digita un correo valido";
    };

    const updatePasswordWithoutToken = () => {
      const data = {
        email: email.value,
        codePassConfirm: code.value,
        newPassword: password.value,
      };

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      fetch(
        process.env.API_SERVER + "/api/user/update-password-widthout-token",
        options
      )
        .then((respone) => {
          return respone.json();
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
            message: "Contraseña actualizada correctamente",
          });
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          return router.push({ name: "inicio" });
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
      code,
      updatePasswordWithoutToken,
      isValidEmail,
      isPwd,
      password,
    };
  },
};
</script>
