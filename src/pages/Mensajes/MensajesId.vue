<template>
  <q-page>
    <!-- <div class="row q-pa-sm">
      <q-btn
        to="/"
        round
        icon="las la-arrow-left"
        style="top: 0; transform: translatex(10%)"
      />
    </div>

    <div>
      <ColumnasChats />
    </div> -->
    <q-dialog v-model="dialogIncoming">
      <q-card class="q-pa-md">
        !! Proximamente podras comunicarte con nuestros asesores para conocer
        acerca de esta gran diversidad de plantas y todos sus beneficios.
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
// import ColumnasChats from "components/Mensajes/ColumnasChats";
import { ref } from "vue";

export default {
  setup() {
    const dialogIncoming = ref(true);
    return {
      dialogIncoming,
    };
  },
  // components: {
  //   ColumnasChats,
  // },
};
</script>
