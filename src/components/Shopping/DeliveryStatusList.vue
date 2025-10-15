<template>
  <q-card class="q-pa-md q-rounded-xl shadow-2">
    <q-card-section class="text-h6 text-weight-bold text-primary">
      Historial de estados
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

    <div v-else class="text-center text-grey-6 text-body2 q-my-md">
      Sin cambios en el estado de entrega
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
