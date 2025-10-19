<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="crearUsuario" class="q-gutter-md">
      <q-input
        rounded
        outlined
        color="black"
        bg-color="grey-1"
        label="Nombre"
        v-model="name"
        :rules="[(val) => (val && val.length > 0) || 'Campo vacio']"
      >
        <template v-slot:prepend>
          <q-icon name="las la-user-circle" />
        </template>
      </q-input>

      <q-input
        rounded
        outlined
        color="black"
        bg-color="grey-1"
        v-model="email"
        label="Email"
        :rules="[
          (val) => (val && val.length > 0) || 'Campo vacio',
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
            (val !== null && val !== '') || 'Por favor ingrese su contraseña',
          (val) =>
            (val && val.length >= 8) || 'Debe tener como minimo 8 caracteres',
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

      <div class="row">
        <div class="col" v-if="invited">
          <q-input
            rounded
            outlined
            color="black"
            bg-color="grey-1"
            label="Digita el codigo"
            v-model="meseller"
          >
            <template v-slot:prepend>
              <q-icon name="las la-user-circle" />
            </template>
          </q-input>
        </div>
      </div>

      <div class="q-mt-md">
        <div class="row items-center q-mb-md">
          <q-toggle v-model="accept" color="warning" />
          <router-link
            to="politicas-page"
            class="text-black q-ml-sm"
            style="text-decoration: none; font-size: 14px"
          >
            Acepto los Términos y condiciones
          </router-link>
        </div>

        <div class="text-center">
          <span class="text-grey-7" style="font-size: 14px"
            >¿Ya tienes una cuenta?</span
          >
          <router-link
            class="text-black text-weight-bold q-ml-xs"
            to="login"
            style="text-decoration: none"
          >
            Iniciar sesión
          </router-link>
        </div>
      </div>

      <div class="row justify-center">
        <q-btn
          unelevated
          rounded
          label="Crear Cuenta"
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
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const name = ref(null);
    const email = ref(null);
    const password = ref(null);
    const accept = ref(false);
    const meseller = ref("");
    const invited = ref(false);
    const isPwd = ref(true);

    const isValidEmail = (val) => {
      const emailValid =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailValid.test(val) || "Digita un correo valido";
    };

    const crearUsuario = () => {
      if (!accept.value) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "Acepta los terminos y condiciones",
        });
        return;
      }

      const data = {
        name: name.value?.toLowerCase(),
        email: email.value,
        password: password.value,
        accept: accept.value,
        meseller: meseller.value?.toLowerCase(),
      };

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      fetch(process.env.API_SERVER + "/api/user/create", options)
        .then((response) => {
          // console.log("Respuesta de API → ", response)
          if (!response.ok) throw new Error("Error en la respuesta");
          return response.json();
        })
        .then((response) => {
          // console.log("Datos recibidos → ", response)
          if (response.status === false) {
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
            textColor: "white",
            icon: "cloud_done",
            message: "Usuario creado exitosamente",
          });
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          return router.push({ name: "security-code" });
        })
        .catch((err) => {
          console.log("Error al procesar respuesta → ", err);
          $q.notify({
            color: "negative",
            textColor: "white",
            icno: "las la-exclamation",
            message: "Hubo un error con la solicitud. Intentalo nuevamente",
          });
        });
    };
    return {
      name,
      email,
      password,
      accept,
      isPwd,
      meseller,
      invited,
      crearUsuario,
      isValidEmail,
    };
  },
};
</script>

<!-- <q-input
        rounded
        outlined
        color="black"
        bg-color="grey-1"
        label="Direccion"
        v-model="address"
        :rules="[
          (val) => (val && val.length > 0) || 'Por Favor Escribe la Direccion',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="las la-street-view" />
        </template>
      </q-input> -->

<!-- <q-input
        rounded
        outlined
        unmasked-value
        color="black"
        bg-color="grey-1"
        v-model="phone_number"
        label="Numero de telefono"
        mask="(###) ### - ####"
        :rules="[
          (val) =>
            (val && val.length > 0) ||
            'Por Favor Escribe el Numero de Telefono',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="lab la-whatsapp" />
        </template>
      </q-input> -->

<!-- <q-select
        rounded
        outlined
        color="black"
        bg-color="grey-1"
        v-model="type_identification"
        :options="type_identifications"
        label="Tipo de identificacion"
      >
        <template v-slot:prepend>
          <q-icon name="las la-id-card" />
        </template>
      </q-select> -->

<!-- <q-input
        rounded
        outlined
        color="black"
        bg-color="grey-1"
        label="Identificacion"
        v-model="identification"
        :rules="[
          (val) => (val && val.length > 0) || 'Por Favor Escribe el Nombre',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="las la-id-card" />
        </template>
      </q-input> -->
