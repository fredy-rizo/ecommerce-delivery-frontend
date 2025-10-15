<template>
  <q-page>
    <div class="q-pa-sm">
      <q-btn
        to="/"
        round
        icon="las la-arrow-left"
        style="top: 0; transform: translatex(10%)"
      />
    </div>

    <div class="q-mx-md">
      <h5 class="text-center">Detalles del Perfil</h5>
    </div>
    <RegistroUsuarios />
  </q-page>
</template>

<script>
import RegistroUsuarios from "components/Perfil/Formularios/RegistroUsuarios.vue";

export default {
  components: { RegistroUsuarios },
};
</script>
