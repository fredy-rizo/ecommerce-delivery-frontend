<template>
  <div class="q-px-md">
    <q-form @submit.prevent="updateUser" @reset="limpiarFormulario">
      <q-input
        rounded
        outlined
        color="black"
        label="name"
        v-model="name"
        :rules="[
          (val) => (val && val.length > 0) || 'Por Favor Escribe el name',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="las la-user-circle" />
        </template>
      </q-input>

      <q-select
        rounded
        outlined
        color="black"
        bg-color="grey-2"
        disable
        v-model="type_identification"
        :options="type_identifications"
        label="Tipo de identificacion"
      >
        <template v-slot:prepend>
          <q-icon name="las la-id-card" />
        </template>
      </q-select>

      <q-input
        rounded
        outlined
        color="black"
        disable
        label="Identificacion"
        bg-color="grey-2"
        v-model="identification"
        class="q-mt-md"
        :rules="[
          (val) => (val && val.length > 0) || 'Por Favor Escribe el Nombre',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="las la-id-card" />
        </template>
      </q-input>

      <q-input
        rounded
        outlined
        color="black"
        label="address"
        v-model="address"
        :rules="[
          (val) => (val && val.length > 0) || 'Por Favor Escribe la address',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="las la-street-view" />
        </template>
      </q-input>

      <q-input
        rounded
        outlined
        unmasked-value
        color="black"
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
          <q-icon name="las la-phone" />
        </template>
      </q-input>

      <q-field
        bg-color="grey-2"
        rounded
        outlined
        stack-label
        color="black"
        label="Email"
      >
        <template v-slot:prepend>
          <q-icon name="las la-at" />
        </template>

        <template v-slot:control>
          <div>
            {{ email }}
          </div>
        </template>
      </q-field>

      <div class="row justify-end q-mt-md">
        <q-btn
          label="Actualizar"
          color="warning"
          text-color="black"
          type="submit"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import {
  getDataUser,
  ValidateSession,
  validateUser,
} from "../../../tools/User";

export default {
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const dataUser = ref(getDataUser());

    const name = ref(dataUser.value.name);
    const address = ref(dataUser.value.address);
    const phone_number = ref(dataUser.value.phone_number);
    const type_identification = ref(
      dataUser.value.type_identification
        ? JSON.parse(dataUser.value.type_identification).name
        : ""
    );
    const identification = ref(dataUser.value.identification);
    const email = ref(dataUser.value.email);
    const type_identifications = ref([
      "Nit",
      "CC",
      "Pasaporte",
      "Documento de extranjeria",
    ]);

    const limpiarFormulario = () => {
      name.value = null;
      address.value = null;
      phone_number.value = null;
      type_identification.value = null;
      identification.value = null;
    };

    const updateUser = () => {
      const sessionUser = validateUser({ rol: 1 });
      if (!sessionUser) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "No autorizado para realizar esta accion.",
        });
        router.push({ path: "/login" });
        return;
      }
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + sessionUser.token,
        },
        body: JSON.stringify({
          name: name.value,
          address: address.value,
          phone_number: phone_number.value,
          email: email.value,
        }),
      };

      fetch(process.env.API_SERVER + "/api/users/update", options)
        .then((response) => response.json())
        .then((response) => {
          ValidateSession(response, router);
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
          //set data user
          console.log(response);
          localStorage.setItem("user", JSON.stringify(response.user));
        })
        .catch((err) => {
          ValidateSession(response, router);
          console.error(err);
        });
    };

    return {
      dataUser,
      name,
      address,
      phone_number,
      type_identification,
      identification,
      email,
      type_identifications,
      limpiarFormulario,
      updateUser,
    };
  },
};
</script>
