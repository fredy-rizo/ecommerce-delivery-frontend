<template>
  <q-card>
    <!--🔷 Swiper si tiene imagenes -->
    <swiper
      v-if="
        product && (product.productImg?.length || product.productImg?.length)
      "
      :slides-per-view="1"
      :space-between="10"
      :modules="modules"
      :loop="true"
      :pagination="{ clickable: true }"
      :autoplay="{
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }"
      @click="showModalProduct(product)"
    >
      <swiper-slide
        v-for="(img, index) in product.productImg || product.productimg"
        :key="index"
        :name="index + 1"
      >
        <q-img contain :src="img.productImg || img.url || img"></q-img>
      </swiper-slide>
    </swiper>

    <!--🔷 Swiper si no hay imagenes  -->
    <swiper
      v-else
      :slides-per-view="1"
      :space-between="50"
      :modules="modules"
      @click="showModalProduct(product)"
    >
    </swiper>

    <!-- 🔷 Boton editar -->
    <q-btn
      class="absolute btnaddEdit bg-green-9"
      text-color="white"
      round
      icon="edit"
      style="z-index: 2"
      @click="showDialogeditProduct(product)"
      v-if="userData.roles.find((item) => item.value == 2)"
    />

    <!-- 🔷 Boton carrito  -->
    <q-btn
      class="absolute btnaddCar bg-green-9"
      text-color="white"
      round
      icon="local_grocery_store"
      style="z-index: 2"
      @click="addProductCar(product)"
    />

    <!-- 🔷 Titulo -->
    <div class="row q-mt-sm q-mb-sm">
      <div class="col text-subtitle2 q-px-sm">
        {{ product.title }}
      </div>
    </div>

    <!-- 🔷 Precio -->
    <div class="row">
      <div class="col q-px-sm">
        <b>Precio: </b>
        $ {{ new Intl.NumberFormat().format(product.price) }} COP
      </div>
    </div>

    <!-- 🔷 Membresia -->
    <!-- <div class="row q-mb-sm">
      <div class="col q-px-sm">
        <b>Tipo de membresia: </b>
        {{
          product.membership && product.membership.key
            ? product.membership.value
            : ""
        }}
      </div>
    </div> -->

    <!-- 🔷 Descripcion al hacer click en card -->
    <div v-if="details" class="q-pa-sm text-caption descriptionx">
      <div v-if="product.description">
        <b>Descripción:</b>
        <p class="text-justify">{{ product.description }}</p>
      </div>

      <div v-if="product.typeprod?.value">
        <b>Tipo de producto:</b> {{ product.typeprod.value }}
      </div>

      <div v-if="product.minCant"><b>Cantidad:</b> {{ product.minCant }}</div>
    </div>
  </q-card>
</template>

<style scoped>
.btnaddCar {
  right: 10px;
  top: 10px;
}

.btnaddEdit {
  left: 10px;
  top: 10px;
}

.descriptionx {
  background: #fafafa;
  border-radius: 8px;
  padding: 6px 10px;
  word-wrap: break-word; /* corta palabras largas */
  overflow-wrap: break-word; /* soporte moderno */
  white-space: normal; /* asegura saltos de línea */
  max-height: 120px; /* limita altura */
  overflow-y: auto; /* agrega scroll si es necesario */
}
</style>

<script>
import "swiper/css";
import "swiper/css/pagination";
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, AutoPlay } from "swiper/modules";
import { validateUser, ValidateSession, getDataUser } from "src/tools/User";

export default {
  name: "ProductCard",

  component: {
    Swiper,
    SwiperSlide,
  },

  props: {
    productx: {
      type: Object,
      default: () => ({ productimg: [] }),
    },
    fulldescription: { type: Boolean, default: () => {} },
    details: { type: Boolean, default: () => {} },
    showModalProduct: { type: Function, default: () => {} },
    showDialogeditProduct: { type: Function, default: () => {} },
  },

  setup(props) {
    const router = useRouter();
    const $q = useQuasar();
    const slide = ref(1);
    const autoplayy = ref(true);
    const likeHeart = ref(0);
    const userData = ref(getDataUser());

    const product = ref(props.productx || { productimg: [] });

    watch(
      () => props.productx,
      (newVal) => {
        product.value = newVal || { productimg: [] };
      },
      { immediate: true }
    );

    const modules = [Pagination, AutoPlay];

    const addPoints = async (idProduct, accion) => {
      try {
        const sessionUser = validateUser({ rol: 1 });
        if (!sessionUser) {
          $q.notify({
            color: "negative",
            textColor: "white",
            icon: "las la-exclamation",
            message: "No autorizado para realizar esta accion",
          });
          router.push({ name: "/login" });
          return;
        }

        const options = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionUser.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idProduct, accion: accion == 0 ? 1 : 2 }),
        };

        const response = await fetch(
          process.env.API_SERVER + "/api/product/points",
          options
        );
        let res = await response.json();

        ValidateSession(res, router);
        if (res.product) {
          product.value = res.product;
        }
      } catch (err) {
        console.log(err);
      }
    };

    const addProductCar = (product) => {
      const cant = product.minCant ? product.minCant : 1;
      let productadding = {
        title: product.title,
        description: product.description,
        price: product.price,
        typeprod: product.typeprod,
        minCant: product.minCant,
        _id: product._id,
      };

      const products = localStorage.getItem("productCar")
        ? JSON.parse(localStorage.getItem("productCar"))
        : [];
      const indexProd = products.findIndex(
        (element) => element._id == product._id
      );

      if (products[indexProd]) {
        products[indexProd].cant = products[indexProd].cant + cant;
        localStorage.setItem("productCar", JSON.stringify(products));
      } else {
        localStorage.setItem(
          "productCar",
          JSON.stringify([...products, { ...productadding, cant: cant }])
        );
      }

      $q.notify({
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
        message: "Agregado correctamente",
      });
    };

    return {
      likeHeart,
      slide,
      autoplayy,
      addPoints,
      userData,
      product,
      showDescription: ref(
        props.fulldescription ? props.fulldescription : false
      ),
      addProductCar,
      modules,
    };
  },
};
</script>
