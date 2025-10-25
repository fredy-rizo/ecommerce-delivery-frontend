<template>
  <q-card class="relative-position">
    <q-list dense bordered separator>
      <q-item
        clickable
        v-if="
          userData.roles.find(
            (item) => item.value == 1 || item.value === 3 || item.value === 4
          )
        "
        v-ripple
        @click="addProductCar(product)"
      >
        <q-item-section class="text-caption">Agregar</q-item-section>
        <q-item-section avatar
          ><q-icon name="shopping_cart" size="16px"
        /></q-item-section>
      </q-item>

      <q-item
        v-if="userData.roles.find((item) => item.value == 2)"
        clickable
        v-ripple
        @click="showDialogeditProduct(product)"
      >
        <q-item-section class="text-caption">Editar</q-item-section>
        <q-item-section avatar
          ><q-icon size="16px" name="edit"
        /></q-item-section>
      </q-item>
    </q-list>

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

    <!-- 🔷 Descripcion al hacer click en card -->
    <div v-if="details" class="q-pa-sm text-caption descriptionx">
      <div v-if="product.description">
        <b>Descripción:</b>
        <p class="text-justify">{{ product.description }}</p>
      </div>

      <div v-if="product.typeprod?.value">
        <b>Tipo de producto:</b> {{ product.typeprod.value }}
      </div>

      <div v-if="product.minCant"><b>Stock:</b> {{ product.minCant }}</div>
    </div>
  </q-card>
</template>

<style scoped>
/* Botones flotantes con estilo corporativo */
.btnaddCar {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btnaddCar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.btnaddEdit {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ff9800; /* color corporativo secundario */
  color: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btnaddEdit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Descripción con estilo corporativo */
.descriptionx {
  background: #f4f6f8; /* gris muy claro, elegante */
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  max-height: 140px; /* un poco más alto */
  overflow-y: auto;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: background 0.2s ease;
}

.descriptionx:hover {
  background: #e9eff5; /* leve cambio al pasar el mouse */
}

/* Scroll estilizado para la descripción */
.descriptionx::-webkit-scrollbar {
  width: 6px;
}

.descriptionx::-webkit-scrollbar-track {
  background: transparent;
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
