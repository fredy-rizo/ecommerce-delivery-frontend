<template>
  <q-page style="">
    <!-- <span class="col-12 text-center text-h4"> Inicio </span> -->

    <div class="q-gutter-sm">
      <div>
        <!-- <ClientIdCard /> -->
        <q-card class="detalles-perfil q-pa-md">
          <div class="row justify-between q-mt-md">
            <h6 class="">Detalles del Perfil</h6>
            <q-btn outline label="Editar" to="formulario-page" />
          </div>
          <div class="row">
            <div class="col">
              <p>{{ dataUser.name }}</p>
              <p>{{ dataUser.address }}</p>
              <p>{{ dataUser.phone_number }}</p>
              <p>{{ dataUser.email }}</p>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
// import ClientIdCard from "components/Perfil/cliente/ClientIdCard";
import { getDataUser } from "../../../tools/User";

export default defineComponent({
  name: "ClientId",

  components: {
    // ClientIdCard,
  },
  setup() {
    const dataUser = ref(getDataUser());

    return {
      dataUser,
    };
  },
});
</script>
