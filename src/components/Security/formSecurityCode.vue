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
        <h5 class="q-mt-md q-mb-none text-weight-bold">Verificar Cuenta</h5>
        <p class="text-grey-7 q-mt-sm">
          Ingresa tu correo y el código de 6 dígitos que te enviamos
        </p>
      </div>

      <q-separator class="q-mb-lg" />

      <!-- Formulario -->
      <q-form @submit.prevent="verifyAccount" class="q-gutter-md">
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

        <q-input
          rounded
          outlined
          color="green-6"
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
            <q-icon name="lock" color="green-6" />
          </template>
        </q-input>

        <div class="q-mt-xl">
          <q-btn
            unelevated
            rounded
            label="Confirmar Cuenta"
            type="submit"
            color="green-6"
            text-color="white"
            class="full-width"
            size="lg"
            style="font-weight: 600; padding: 12px"
          />
        </div>

        <div class="text-center q-mt-md">
          <span class="text-grey-7" style="font-size: 14px">
            ¿No recibiste el código?
          </span>
          <q-btn
            flat
            dense
            no-caps
            label="Reenviar"
            color="green-6"
            class="q-ml-xs"
            style="font-weight: 600"
            :loading="resengind"
            @click="resendCode"
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
    const resengind = ref(false);

    const isValidEmail = (val) => {
      const emailValid =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailValid.test(val) || "Digita un correo valido";
    };

    const resendCode = async (val) => {
      if (!email.value) {
        $q.notify({
          color: "warning",
          textColor: "white",
          icon: "warning",
          message: "Por favor ingresa tu correo primero",
        });
        return;
      }

      if (!isValidEmail(email.value) || isValidEmail(email.value) !== true) {
        $q.notify({
          color: "warning",
          textColor: "white",
          icon: "warning",
          message: "Por favor ingresa un correo valido",
        });
        return;
      }

      resengind.value = true;

      const data = { email: email.value };
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      try {
        const response = await fetch(
          process.env.API_SERVER + "/api/user/resend-code",
          options
        );
        if (!response.ok) throw new Error("Error en la respuesta");

        const result = await response.json();

        if (result.status === false) {
          $q.notify({
            color: "negative",
            textColor: "white",
            icon: "error",
            message: "No se pudo reenviar el codigo",
          });
        }
        $q.notify({
          color: "green-7",
          textColor: "white",
          icon: "check_circle",
          message: "Codigo reenviado exitosamente. Revisa tu correo",
        });
      } catch (err) {
        console.log("Error al reenviar codigo → ", err);
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "error",
          message: "Hubo un error al reenviar el codigo. Intentalo nuevamente",
        });
      } finally {
        resengind.value = false;
      }
    };

    const verifyAccount = () => {
      const data = {
        email: email.value,
        code: code.value,
      };

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      fetch(process.env.API_SERVER + "/api/user/verify-account", options)
        .then((respone) => {
          if (!respone.ok) throw new Error("Error en la respuesta");
          return respone.json();
        })
        .then((response) => {
          if (response.status === false) {
            $q.notify({
              color: "negative",
              textColor: "white",
              icon: "las la-exclamation",
              message: "Codigo o email incorrectos",
            });
            return;
          }
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message:
              "Cuenta confirmada correctamente. Inicia sesion para disfrutar de nuestro contenido",
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
      resengind,
      verifyAccount,
      isValidEmail,
      resendCode,
    };
  },
};
</script>
