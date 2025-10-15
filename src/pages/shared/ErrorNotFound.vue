<template>
  <div
    class="fullscreen bg-yellow text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="color: black; font-size: 25vh">404</div>

      <div class="text-h3" style="color: black">Oops. No Hay Algo Aqui...</div>

      <q-btn
        class="q-mt-xl"
        color="black"
        text-color="yellow"
        unelevated
        to="/"
        label="Inicio"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>
