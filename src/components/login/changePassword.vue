<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="changePassword" class="q-gutter-md">
      <q-input
        rounded
        outlined
        color="black"
        bg-color="grey-1"
        v-model="email"
        label="Email"
        :rules="[
          (val) => (val && val.length > 0) || 'Por Favor Escribe un Email',
          isValidEmail,
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
            (val !== null && val !== '') || 'Por Favor Ingrese Su Contraseña',
          (val) =>
            (val && val.length >= 8) ||
            'Por Favor Debe De Temer Como Minimo 8 Caracteres',
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

      <div class="row justify-center">
        <q-btn
          unelevated
          rounded
          label="Guardar"
          type="submit"
          color="warning"
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
  props: {
    token: String,
  },
  setup(props) {
    const $q = useQuasar();

    const email = ref(null);
    const password = ref(null);
    const isPwd = ref(null);

    //redireccion de pagina
    const router = useRouter();

    return {
      email,
      password,
      isPwd,

      changePassword() {
        const data = {
          email: email.value.toLowerCase(),
          password: password.value,
        };

        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        };

        fetch(
          process.env.API_SERVER + "/api/users/change-password/" + props.token,
          options
        )
          .then((response) => response.json())
          .then((response) => {
            if (response.status == false) {
              $q.notify({
                color: "negative",
                textColor: "white",
                icon: "las la-exclamation",
                message: response.message,
              });
              return;
            }
            $q.notify({
              color: "green-4",
              textColor: "black",
              icon: "cloud_done",
              message: response.message,
            });
            return router.push({ name: "login" });
          })
          .catch((err) => console.error(err));
      },

      isValidEmail(val) {
        const emailValid =
          /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailValid.test(val) || "El Correo no Parese Ser Valido";
      },
    };
  },
};
</script>
