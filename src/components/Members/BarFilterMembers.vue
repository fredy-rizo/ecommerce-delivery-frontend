<template>
  <q-input
    filled
    v-model="filter"
    label="Nombre, Direccion, Email, Telefono, Identificacion, Tipo de identificacion"
    debounce="1000"
  >
    <template v-slot:append>
      <q-icon name="search" />
    </template>
  </q-input>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    getdataFilter: Function,
  },

  setup(props) {
    const filter = ref("");

    watch(filter, (data) => {
      props.getdataFilter(data);
    });

    return {
      filter,
    };
  },
};
</script>
