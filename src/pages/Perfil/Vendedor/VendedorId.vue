<template>
  <q-page style="">
    <!-- <span class="col-12 text-center text-h4"> Inicio </span> -->

    <div>
      <VendedorIdCard />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import VendedorIdCard from "components/Perfil/Vendedor/VendedorIdCard";

export default defineComponent({
  name: "VendedorId",

  components: {
    VendedorIdCard,
  },
});
</script>
