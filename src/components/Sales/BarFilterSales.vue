<template>
  <div class="row q-ma-sm">
    <q-input
      outlined
      dense
      rounded
      v-model="query"
      label="Buscar ..."
      debounce="400"
      clearable
      class="col"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    getDataFilter: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const query = ref("");

    watch(query, (newQuery) => {
      if (typeof props.getDataFilter === "function") {
        props.getDataFilter(newQuery);
      }
    });

    return { query };
  },
};
</script>
