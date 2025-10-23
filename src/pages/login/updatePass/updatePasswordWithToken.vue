<template>
  <div
    class="flex flex-center column q-pa-lg"
    style="
      min-height: 100vh;
      background: linear-gradient(180deg, #fafafa 0%, #e0e0e0 100%);
    "
  >
    <FormupdatePasswordWithToken />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import FormupdatePasswordWithToken from "src/components/login/updatePass/formupdatePasswordWithToken.vue";

export default defineComponent({
  setup() {},

  components: {
    FormupdatePasswordWithToken,
  },
});
</script>
