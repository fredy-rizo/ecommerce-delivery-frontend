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
        color="black"
        bg-color="grey-1"
        v-model="types"
        :options="listdetailstypes"
        label="Tipo de producto"
      >
      </q-select>
    </div>

    <div class="column q-gutter-md q-pa-md">
      <q-select
        rounded
        outlined
        color="black"
        bg-color="grey-1"
        v-model="membershipdetail"
        :options="listdetailsmembership"
        label="Membresias"
      >
      </q-select>
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
import { onMounted, ref, watch } from "vue";
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
    const types = ref(
      props.oneProduct && props.oneProduct.typeprod
        ? {
            label: props.oneProduct.typeprod.value,
            value: props.oneProduct.typeprod.key,
          }
        : { label: "Otro", value: "4" }
    );
    const listdetailstypes = ref([
      { label: "Medicinal", value: "1" },
      { label: "Ludico", value: "2" },
      { label: "Belleza", value: "3" },
      { label: "Otro", value: "4" },
    ]);
    const membershipdetail = ref(
      props.oneProduct && props.oneProduct.membership
        ? {
            label: props.oneProduct.membership.value,
            value: props.oneProduct.membership.key,
          }
        : { label: "Todas", value: "1" }
    );
    const listdetailsmembership = ref([
      { label: "Todas", value: "1" },
      { label: "Premium", value: "2" },
      { label: "Basico", value: "3" },
    ]);

    const messages = ref(false);
    const loading = ref(false);

    // Inicializar imagenes
    onMounted(() => {
      if (props.oneProduct && props.oneProduct.productImg?.length > 0) {
        // Mostrar imagen existente
        productImg.value = props.oneProduct.productImg.map((img, idx) => ({
          image: img.productImg || img.image,
          key: idx + 1,
        }));
      } else {
        // Mostrar imagen por defecto
        productImg.value = [{ image: imagefondo, key: 1 }];
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
      formData.append("membership", membershipdetail.value.label);
      formData.append("typeprod", types.value.label);

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
      types.value = { label: "Otro", value: "4" };
      membershipdetail.value = { label: "Todas", value: "1" };
    };

    return {
      productImg,
      dataimg,
      id_product,
      nameProduct,
      description,
      price,
      minCant,
      types,
      listdetailstypes,
      membershipdetail,
      listdetailsmembership,
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
