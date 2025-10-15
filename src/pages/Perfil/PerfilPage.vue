<template>
  <div class="q-pa-xs">
    <div class="q-pa-sm">
      <q-btn
        to="client-id"
        round
        icon="las la-arrow-left"
        style="top: 0; transform: translatex(10%)"
      />
    </div>

    <q-card class="card-foto-perfil q-pa-sm">
      <div class="row justify-between q-mb-xl">
        <h6 class="q-ma-sm">Foto de Perfil</h6>
        <q-btn outline label="Editar" />
      </div>
      <div class="row justify-center q-mb-md">
        <q-btn round>
          <q-avatar
            style="
              background-size: 100% 100%;
              -webkit-background-size: 100% 100%;
              width: 133px;
              height: 133px;
            "
          >
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-btn>
      </div>
    </q-card>

    <br />

    <q-card class="card-foto-portada q-pa-sm">
      <div class="row justify-between q-mb-xl">
        <h6 class="q-ma-sm">Foto de Portada</h6>
        <q-btn outline label="Editar" />
      </div>
      <q-img
        class="q-mb-md"
        style="height: 150px"
        src="https://cdn.quasar.dev/img/chicken-salad.jpg"
      />
    </q-card>

    <br />

    <q-card class="detalles-perfil q-pa-sm">
      <div class="row justify-between q-mb-xl">
        <h6 class="q-ma-sm">Detalles del Perfil</h6>
        <q-btn outline label="Editar" to="formulario-page" />
      </div>
      <div class="column">
        {{ dataUser.nombre }}
      </div>
      <div>
        {{ dataUser.direccion }}
      </div>
      <div>
        {{ dataUser.whatsapp }}
      </div>
      <div>
        {{ dataUser.email }}
      </div>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { getDataUser } from "../../tools/User";

export default {
  setup() {
    const dataUser = ref(getDataUser());

    return {
      dataUser,
    };
  },
};
</script>
