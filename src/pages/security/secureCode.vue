<template>
  <div
    class="flex flex-center column q-pa-lg"
    style="
      min-height: 100vh;
      background: linear-gradient(180deg, #fafafa 0%, #e0e0e0 100%);
    "
  >
    <FormSecurityCode />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import FormSecurityCode from "components/Security/formSecurityCode.vue";

export default defineComponent({
  setup() {},

  components: {
    FormSecurityCode,
  },
});
</script>
