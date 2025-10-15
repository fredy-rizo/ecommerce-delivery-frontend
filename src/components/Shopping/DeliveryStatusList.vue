<template>
  <q-card class="q-pa-md q-rounded-xl shadow-3">
    <q-card-section class="row items-center justify-between text-primary">
      <div class="text-h6 text-weight-bold">Historial de estados</div>
      <q-btn dense flat icon="close" color="primary" v-close-popup />
    </q-card-section>

    <q-separator spaced />

    <div v-if="statuses.length > 0">
      <q-list bordered separator class="q-rounded-b-xl">
        <q-expansion-item
          v-for="item in statuses"
          :key="item.date + item.timeHour"
          expand-separator
          dense
          group="status"
          header-class="bg-grey-1 q-py-sm"
        >
          <template v-slot:header>
            <div class="row items-center justify-between full-width">
              <div class="text-body2 text-primary text-weight-medium">
                {{ item.description }}
              </div>
              <div class="text-caption text-grey-6 text-weight-medium">
                {{ `${item.date} ${item.timeHour}` }}
              </div>
            </div>
          </template>

          <div
            v-if="item.detail"
            class="q-mt-sm text-body8 text-weight-medium text-blue-grey-8 q-pl-sm"
            style="font-family: 'Roboto', sans-serif; letter-spacing: 0.2px"
          >
            {{ item.detail }}
          </div>
        </q-expansion-item>
      </q-list>
    </div>

    <div v-else class="column items-center text-grey-6 text-body2 q-my-md">
      <div>Sin cambios en el estado de entrega</div>
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
