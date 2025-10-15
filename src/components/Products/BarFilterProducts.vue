<template>
  <q-input filled v-model="filter.general" label="Buscar ..." debounce="1000">
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
    const filter = ref({ general: "", title: "", description: "", type: 0 });

    watch(filter.value, (data) => {
      props.getdataFilter(data);
    });

    return {
      filter,
    };
  },
};
</script>
