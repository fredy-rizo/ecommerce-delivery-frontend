<template>
  <div class="row">
    <q-input
      class="col-9"
      filled
      v-model="filter.general"
      label="Buscar ..."
      debounce="1000"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-btn-dropdown class="col-3" color="primary" icon="calendar_month">
      <q-date v-model="filter.date" minimal default-view="Months" />
    </q-btn-dropdown>
  </div>
</template>

<script>
import { ref, watch } from "vue";
export default {
  props: {
    getdataFilter: Function,
  },
  setup(props) {
    const filter = ref({
      general: "",
      generalNumber: "",
      title: "",
      description: "",
      type: 0,
      date: "",
    });

    watch(filter.value, (data) => {
      props.getdataFilter(data);
    });

    return {
      filter,
    };
  },
};
</script>
