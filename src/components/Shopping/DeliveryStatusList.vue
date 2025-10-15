<template>
  <q-card class="q-pa-md q-rounded-xl shadow-2">
    <q-card-section class="row items-center justify-between text-primary">
      <div class="text-h6 text-weight-bold">Historial de estados</div>
      <q-btn dense flat icon="close" color="primary" v-close-popup />
    </q-card-section>

    <q-separator spaced />

    <q-list
      bordered
      separator
      v-if="statuses.length > 0"
      class="q-rounded-b-xl"
    >
      <q-item
        v-for="itemde in statuses"
        :key="itemde.date + itemde.timeHour"
        class="q-py-sm"
      >
        <q-item-section>
          <div class="text-body2 text-grey-9">{{ itemde.description }}</div>
        </q-item-section>
        <q-item-section side>
          <div class="text-caption text-grey-6">
            {{ `${itemde.date} ${itemde.timeHour}` }}
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-else class="column items-center text-grey-6 text-body2 q-my-md">
      <div>Sin cambios en el estado de entrega</div>
      <q-btn
        label="Cerrar"
        color="primary"
        flat
        class="q-mt-sm"
        v-close-popup
      />
    </div>
  </q-card>
</template>

<script>
import { watch, ref } from "vue";

export default {
  props: {
    id_shopping: String,
    liststatus: Array,
  },

  setup(props) {
    const statuses = ref(props.liststatus || []);

    watch(
      () => props.liststatus,
      (n) => {
        if (n) statuses.value = n;
      },
      {
        deep: true,
        immediate: true,
      }
    );

    return { statuses };
  },
};
</script>
