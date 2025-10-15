<template>
  <q-card>
    <q-toolbar>
      <q-toolbar-title>
        <span class="text-weight-bold"> + </span>
        Agragar Catalogo
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-form @submit="onAgregar" @reset="onReset">
      <div class="row justify-center">
        <q-img :src="imgUp" width="340" />

        <div>
          <q-file
            rounded
            outlined
            id="loadImg"
            bg-color="warning"
            text-color="black"
            label="Seleccionar Imagen"
            v-model="dataImg"
          />
        </div>
      </div>

      <div class="column q-gutter-md q-pa-md">
        <q-input rounded outlined label="Nombre" v-model="nameProduct" />

        <q-input
          rounded
          outlined
          type="textarea"
          label="Descripcion"
          v-model="descriptionProduct"
        />

        <q-input
          rounded
          outlined
          type="number"
          prefix="$"
          label="Precio"
          v-model="priceProduct"
        />

        <q-input rounded outlined label="Categoria" v-model="categoryProduct" />
      </div>

      <div class="row justify-end q-gutter-md q-pa-sm">
        <q-btn rounded label="Cancelar" type="reset" />

        <q-btn
          rounded
          label="Agregar"
          type="submit"
          color="warning"
          text-color="black"
        />
      </div>
    </q-form>
  </q-card>
</template>

<script>
import { ref, watch } from "vue";

export default {
  setup() {
    const imgUp = ref(
      "https://imgs.search.brave.com/gfOM52M6DEKVU_O5bHksAJ81SKwaTMFNc0tCzPMp1LQ/rs:fit:860:752:1/g:ce/aHR0cDovL3d3dy5w/bmdhbGwuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy81L1VzZXIt/UHJvZmlsZS1QTkct/Q2xpcGFydC5wbmc"
    );

    const dataImg = ref(null);

    function loadImg(img) {
      console.log(img);
      if (img) {
        let reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = function () {
          imgUp.value = reader.result;
        };
      } else {
      }
    }

    watch(dataImg, loadImg);

    const nameProduct = ref(null);

    const descriptionProduct = ref(null);

    const priceProduct = ref(null);

    const categoryProduct = ref(null);

    const onAgregar = () => {};

    const onReset = () => {};

    return {
      imgUp,
      loadImg,
      dataImg,
      nameProduct,
      descriptionProduct,
      priceProduct,
      categoryProduct,
      onAgregar,
      onReset,
    };
  },
};
</script>
