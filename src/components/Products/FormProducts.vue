<template>
  <div class="justify-center">
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
      v-if="!oneProduct"
    >
      <q-carousel-slide
        v-for="img in productImg"
        v-bind:key="img"
        :name="img.key"
        :img-src="img.image"
      />
    </q-carousel>

    <div class="listimages row justify-center" v-if="oneProduct">
      <q-card v-for="img in productImg" :key="img">
        <div class="col-sm-6 col-xs-6 col-md-4">
          <q-img :src="img.image" style="width: 150px; max-height: 150px" />
        </div>
      </q-card>
    </div>
  </div>

  <q-form @submit.prevent="addProduct" @reset.prevent="onReset">
    <div class="row justify-center">
      <q-file
        filled
        v-model="dataimg"
        label="Seleccionar"
        color="purple-12"
        multiple
        accept="image/*"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </div>

    <div class="column q-gutter-md q-pa-md">
      <q-input
        class="hidden"
        rounded
        outlined
        v-model="id_product"
        label="id"
      />

      <q-input
        rounded
        outlined
        v-model="nameProduct"
        label="Nombre del Pruducto"
      />

      <q-input
        rounded
        outlined
        v-model="description"
        label="Descripcion"
        type="textarea"
        placeholder="Cuentame mas del producto"
      />

      <q-input
        rounded
        outlined
        v-model.number="price"
        label="Precio COP"
        type="number"
        placeholder="0"
        stack-label
      />

      <q-input
        rounded
        outlined
        v-model.number="minCant"
        label="Stock"
        type="number"
        placeholder="1"
        stack-label
      />
    </div>

    <div class="column q-gutter-md q-pa-md">
      <q-select
        rounded
        outlined
        multiple
        use-chips
        color="black"
        bg-color="grey-1"
        v-model="typesColorsSize"
        :options="listdetailsColorsSize"
        label="Color de camisa"
      />
    </div>

    <div class="column q-gutter-md q-pa-md">
      <q-select
        rounded
        outlined
        multiple
        use-chips
        color="black"
        bg-color="grey-1"
        v-model="typeSizes"
        :options="listdetailsSize"
        label="Talla de camisa"
      />
    </div>
    <div class="column q-gutter-md q-pa-md">
      <q-select
        rounded
        outlined
        color="black"
        bg-color="grey-1"
        v-model="typeTypeShirts"
        :options="listdetailsTypeShirt"
        label="Tipo de camisa"
      >
      </q-select>
    </div>

    <!-- 🔷 Campos de descuento (solo si está editando) -->
    <div class="column q-gutter-md q-pa-md" v-if="oneProduct">
      <q-input
        rounded
        outlined
        v-model.number="discount"
        label="Descuento (%)"
        type="number"
        placeholder="0"
        min="0"
        max="100"
        hint="Ingresa el porcentaje de descuento (ej: 10, 20, 50)"
        stack-label
      >
        <template v-slot:append>
          <q-icon name="percent" />
        </template>
      </q-input>

      <q-input
        v-if="discount > 0"
        rounded
        outlined
        :model-value="priceDiscount"
        label="Precio con descuento"
        type="number"
        readonly
        filled
        bg-color="grey-3"
        hint="Calculado automáticamente"
        stack-label
      >
        <template v-slot:prepend>
          <q-icon name="attach_money" />
        </template>
      </q-input>
    </div>

    <div class="row justify-end q-gutter-md q-pa-sm" v-if="messages">
      {{ messages }}
    </div>

    <div class="row justify-end q-gutter-md q-pa-sm">
      <q-spinner-puff color="primary" size="2em" v-if="loading" />
      <q-btn
        rounded
        type="submit"
        label="Guardar"
        text-color="black"
        color="warning"
        v-if="!loading"
      />
    </div>
  </q-form>
</template>

<script>
import { useQuasar } from "quasar";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { validateUser, ValidateSession } from "../../tools/User";
import imagefondo from "../../assets/fondologin.jpeg";

export default {
  props: {
    oneProduct: Object,
    closeDialog: Function,
    resetlistProducts: Function,
  },
  setup(props, { emit }) {
    const router = useRouter();
    const $q = useQuasar();
    const productImg = ref(
      props.oneProduct ? [] : [{ image: imagefondo, key: 1 }]
    );

    const dataimg = ref(null);
    const id_product = ref(props.oneProduct ? props.oneProduct._id : 0);
    const nameProduct = ref(props.oneProduct ? props.oneProduct.title : null);
    const description = ref(
      props.oneProduct ? props.oneProduct.description : null
    );
    const price = ref(props.oneProduct ? props.oneProduct.price : "");
    const minCant = ref(props.oneProduct ? props.oneProduct.minCant : "");
    const discount = ref(
      props.oneProduct ? props.oneProduct.discount : "Sin descuento"
    );

    const typesColorsSize = ref([]);

    const listdetailsColorsSize = ref([
      { label: "Blanco", value: "1" },
      { label: "Negro", value: "2" },
      { label: "Gris oscuro", value: "3" },
      { label: "Gris claro", value: "4" },
      { label: "Azul celeste", value: "5" },
      { label: "Azul marino", value: "6" },
      { label: "Azul rey", value: "7" },
      { label: "Beige", value: "8" },
      { label: "Cafe claro", value: "9" },
      { label: "Cafe oscuro", value: "10" },
      { label: "Verde militar", value: "11" },
      { label: "Verde bosque", value: "12" },
      { label: "Verde menta", value: "13" },
      { label: "Rojo", value: "14" },
      { label: "Vino", value: "15" },
      { label: "Rosa pastel", value: "16" },
      { label: "Fucsia", value: "17" },
      { label: "Amarillo mostaza", value: "18" },
      { label: "Amarillo crema", value: "19" },
      { label: "Naranja", value: "20" },
      { label: "Lila", value: "21" },
      { label: "Morado", value: "22" },
      { label: "Turquesa", value: "23" },
      { label: "Amarillo", value: "24" },
    ]);

    const typeSizes = ref([]);

    const listdetailsSize = ref([
      { label: "XS", value: "1" },
      { label: "S", value: "2" },
      { label: "M", value: "3" },
      { label: "L", value: "4" },
      { label: "XL", value: "5" },
      { label: "XXL/2XL", value: "6" },
      { label: "XXXL/3XL", value: "7" },
    ]);

    const typeTypeShirts = ref([]);
    const listdetailsTypeShirt = ref([
      { label: "Overside", value: "1" },
      { label: "CropTop", value: "2" },
      { label: "Regular Fit", value: "3" },
      { label: "Semi-Overside", value: "4" },
      { label: "Hoodie", value: "5" },
    ]);

    const messages = ref(false);
    const loading = ref(false);

    // calcular precio automaticamente si hay descuento
    const priceDiscount = computed(() => {
      if (!price.value || !discount.value || discount.value <= 0) return 0;

      const discountAmount = (price.value * discount.value) / 100;
      return Math.round(price.value - discountAmount);
    });

    // Inicializar imagenes
    onMounted(() => {
      // Imagen
      if (props.oneProduct && props.oneProduct.productImg?.length > 0) {
        productImg.value = props.oneProduct.productImg.map((img, idx) => ({
          image: img.productImg || img.image,
          key: idx + 1,
        }));
      } else {
        productImg.value = [{ image: imagefondo, key: 1 }];
      }

      // Campos select
      if (props.oneProduct) {
        const parseIfString = (data) => {
          try {
            return typeof data === "string" ? JSON.parse(data) : data;
          } catch {
            return [];
          }
        };

        console.log(props.oneProduct.colorsSize);

        const colors = parseIfString(props.oneProduct.colorsSize);
        const sizes = parseIfString(props.oneProduct.sizes);

        typesColorsSize.value = Array.isArray(colors)
          ? colors.map((c) => ({ label: c.label, value: c.value }))
          : [];

        typeSizes.value = Array.isArray(sizes)
          ? sizes.map((s) => ({ label: s.label, value: s.value }))
          : [];

        typeTypeShirts.value = props.oneProduct.typeShirt
          ? {
              label: props.oneProduct.typeShirt,
              value: props.oneProduct.typeShirt,
            }
          : null;
      }
    });

    function loadimg(imgs) {
      if (imgs) {
        productImg.value = [];
        let count = 1;
        imgs.forEach((element) => {
          const reader = new FileReader();
          reader.readAsDataURL(element);
          reader.onload = function () {
            productImg.value.push({ image: reader.result, key: count++ });
          };
        });
      }
    }

    watch(dataimg, loadimg);

    const addProduct = () => {
      const sessionUser = validateUser({ rol: 2 });
      if (!sessionUser) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "No tienes acceso a estas funciones.",
        });
        return;
      }
      // form data
      const formData = new FormData();
      formData.append("title", nameProduct.value);
      formData.append("description", description.value);
      formData.append("price", price.value);
      formData.append("minCant", minCant.value);
      formData.append(
        "colorsSize",
        JSON.stringify(
          typesColorsSize.value.map((opt) => ({
            label: opt.label,
            value: opt.value,
          }))
        )
      );

      formData.append(
        "sizes",
        JSON.stringify(
          typeSizes.value.map((opt) => ({
            label: opt.label,
          }))
        )
      );

      formData.append(
        "typeShirt",
        Array.isArray(typeTypeShirts.value)
          ? typeTypeShirts.value[0].label
          : typeTypeShirts.value.label
      );

      // Solo incluir descuento cuando se actualiza
      if (props.oneProduct && props.oneProduct._id) {
        if (discount.value && discount.value > 0) {
          formData.append("discount", discount.value);
          formData.append("priceDiscount", priceDiscount.value);
        } else {
          formData.append("discount", 0);
          formData.append("priceDiscount", price.value);
        }
      }

      if (dataimg.value && dataimg.value.length > 0) {
        for (let file of dataimg.value) {
          if (file instanceof File) {
            formData.append("productImg", file);
          }
        }
      }

      // Si es edicion y no hay imagen nueva, mantener actual
      if (
        (!dataimg.value || dataimg.value.length === 0) &&
        props.oneProduct?.productImg?.length > 0
      ) {
        formData.append(
          "productImgOld",
          JSON.stringify(props.oneProduct.productImg)
        );
      }

      const options = {
        method: "POST",
        headers: { Authorization: "Bearer " + sessionUser.token },
        body: formData,
      };
      loading.value = true;

      if (props.oneProduct && props.oneProduct._id) {
        fetchUpdateProduct(options, props.oneProduct._id);
      } else {
        fetchAddProduct(options);
      }
    };

    const fetchAddProduct = (options) => {
      fetch(process.env.API_SERVER + "/api/product/create", options)
        .then((response) => response.json())
        .then((response) => {
          ValidateSession(response, router);
          if (!response.status) {
            $q.notify({
              color: "negative",
              textColor: "white",
              icon: "las la-exclamation",
              message: response.message,
            });
            return;
          }
          messages.value = response.message;
          onReset();
          props.closeDialog();
          if (props.resetlistProducts) props.resetlistProducts();
          emit("product-updated");
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "save",
            message: "Producto creado exitosamente",
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const fetchUpdateProduct = (options, id_prod) => {
      fetch(process.env.API_SERVER + "/api/product/update/" + id_prod, options)
        .then((response) => response.json())
        .then((response) => {
          ValidateSession(response, router);
          if (!response.status) {
            $q.notify({
              color: "negative",
              textColor: "white",
              icon: "las la-exclamation",
              message: response.message,
            });
            return;
          }
          messages.value = response.message;
          onReset();
          props.closeDialog();
          if (props.resetlistProducts) props.resetlistProducts();
          emit("product-updated");
          $q.notify({
            color: "green-4",
            textColor: "black",
            icon: "cloud_done",
            message: "Actualizando...",
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const onReset = () => {
      productImg.value = null;
      dataimg.value = null;
      nameProduct.value = null;
      description.value = null;
      typesColorsSize.value = { label: "", value: "" };
      typeSizes.value = { label: "", value: "" };
      typeTypeShirts.value = { label: "", value: "" };
    };

    return {
      productImg,
      dataimg,
      id_product,
      nameProduct,
      description,
      price,
      minCant,
      discount,
      priceDiscount,
      typesColorsSize,
      typeTypeShirts,
      listdetailsColorsSize,
      typeSizes,
      listdetailsSize,
      listdetailsTypeShirt,
      loadimg,
      addProduct,
      onReset,
      messages,
      loading,
      autoplay: ref(true),
      slide: ref(1),
    };
  },
};
</script>
