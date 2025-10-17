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
    getProductsByType: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const query = ref("");
    const selectedType = ref(null);

    const types = [
      { label: "Medicinal", value: "1" },
      { label: "Lúdico", value: "2" },
      { label: "Belleza", value: "3" },
      { label: "Otro", value: "4" },
    ];

    // Watch texto de búsqueda
    watch(query, (newQuery) => {
      if (typeof props.getDataFilter === "function") {
        props.getDataFilter(newQuery);
      }
    });

    // Watch tipo seleccionado
    watch(selectedType, (newType) => {
      if (newType && typeof props.getProductsByType === "function") {
        props.getProductsByType(newType);
      } else if (newType === null) {
        // Si se limpia el select, recargar todo
        props.getDataFilter(query.value);
      }
    });

    return {
      query,
      selectedType,
      types,
    };
  },
};
</script>
