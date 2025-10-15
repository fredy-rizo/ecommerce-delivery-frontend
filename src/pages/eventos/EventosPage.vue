<template>
  <q-page>
    <div>
      <q-card class="row q-pa-sm justify-center">
        <q-btn rounded @click="toolbar = true" label="Nuevo Evento" />
      </q-card>

      <div class="q-ma-sm">
        <q-dialog persistent full-width v-model="toolbar">
          <FormEvent />
        </q-dialog>
      </div>
      <div>
        <ListEvent />
      </div>
    </div>
  </q-page>
</template>

<script>
//import { read } from "fs";
import { ref } from "vue";
import FormEvent from "components/Eventos/formEvent";
import ListEvent from "components/Eventos/listEvent";

export default {
  name: "EventosPage",
  setup() {
    const toolbar = ref(false);
    return {
      toolbar,
    };
  },

  components: { FormEvent, ListEvent },
};
</script>
