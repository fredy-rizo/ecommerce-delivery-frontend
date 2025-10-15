<template>
  <SalesReport />
</template>

<script>
import SalesReport from "components/sales/SalesReport";
import { ref } from "vue";
export default {
  setup() {
    const openInfo = ref("evento");

    return {
      openInfo,
    };
  },

  components: {
    SalesReport,
  },
};
</script>
