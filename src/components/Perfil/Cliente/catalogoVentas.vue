<template>
  <q-list bordered class="rounded-borders">
    <q-item-label header class="justify-between">
      <span>Catalogo de Ventas</span>

      <q-btn flat round dense icon="las la-plus" @click="Catalogo = true" />

      <q-dialog persistent full-width v-model="Catalogo">
        <FormCatalogo />
      </q-dialog>
    </q-item-label>

    <q-item>
      <q-item-section avatar top>
        <q-avatar>
          <q-img src="https://cdn.quasar.dev/img/avatar2.jpg" rounded />
        </q-avatar>
      </q-item-section>

      <q-item-section top>
        <q-item-label lines="1">
          <!-- <span class="text-weight-medium">[quasarframework/quasar]</span> -->
          <span class="text-grey-8"> Super mega titulo </span>
        </q-item-label>
        <q-item-label caption lines="1">
          Descripcion del producto xxx
        </q-item-label>
        <q-item-label caption lines="1"> Categoria </q-item-label>
      </q-item-section>

      <q-item-section top side>
        <div class="text-grey-8 q-gutter-sm">
          <q-btn
            dense
            round
            icon="las la-pen-fancy"
            color="info"
            text-color="black"
          ></q-btn>
          <q-btn
            dense
            round
            icon="las la-check"
            color="positive"
            text-color="black"
          ></q-btn>
          <q-btn
            dense
            round
            icon="las la-times"
            color="negative"
            text-color="black"
          ></q-btn>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { ref } from "vue";
import FormCatalogo from "./formCatalogo.vue";
export default {
  setup() {
    const Catalogo = ref(false);

    return {
      Catalogo,
    };
  },
  components: {
    FormCatalogo,
  },
};
</script>
