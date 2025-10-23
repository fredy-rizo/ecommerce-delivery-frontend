<template>
  <div
    class="flex flex-center column q-pa-lg"
    style="
      min-height: 100vh;
      background: linear-gradient(180deg, #fafafa 0%, #e0e0e0 100%);
    "
  >
    <FormconfirmeNewPassword />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import FormconfirmeNewPassword from "src/components/login/formconfirmeNewPassword.vue";

export default defineComponent({
  setup() {},

  components: {
    FormconfirmeNewPassword,
  },
});
</script>
