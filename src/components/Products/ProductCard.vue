<template>
  <q-card class="product-card relative-position">
    <!-- 🔷 Badge de descuento -->
    <div v-if="product.discount > 0" class="discount-badge">
      -{{ product.discount }}%
    </div>

    <!-- 🔷 Menú de acciones -->
    <div class="actions-menu">
      <q-btn
        v-if="
          userData.roles.find(
            (item) => item.value == 1 || item.value === 3 || item.value === 4
          )
        "
        flat
        round
        dense
        icon="shopping_cart"
        color="white"
        size="sm"
        class="action-btn"
        @click="openSelectDialog(product)"
      >
        <!-- <q-tooltip>Agregar al carrito</q-tooltip> -->
      </q-btn>

      <q-btn
        v-if="userData.roles.find((item) => item.value == 2)"
        flat
        round
        dense
        icon="edit"
        color="white"
        size="sm"
        class="action-btn"
        @click="showDialogeditProduct(product)"
      >
        <!-- <q-tooltip>Editar producto</q-tooltip> -->
      </q-btn>
    </div>

    <!-- 🔷 Galería de imágenes -->
    <div class="image-container" @click="showModalProduct(product)">
      <swiper
        v-if="
          product && (product.productImg?.length || product.productImg?.length)
        "
        :slides-per-view="1"
        :space-between="0"
        :modules="modules"
        :loop="true"
        :pagination="{ clickable: true }"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }"
        class="product-swiper"
      >
        <swiper-slide
          v-for="(img, index) in product.productImg || product.productimg"
          :key="index"
        >
          <q-img
            :src="img.productImg || img.url || img"
            ratio="1"
            class="product-image"
          >
            <template v-slot:loading>
              <q-spinner-dots color="grey-6" size="40px" />
            </template>
          </q-img>
        </swiper-slide>
      </swiper>

      <swiper
        v-else
        :slides-per-view="1"
        :modules="modules"
        class="product-swiper"
      >
        <swiper-slide>
          <div class="no-image-placeholder">
            <q-icon name="image" size="60px" color="grey-5" />
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- 🔷 Información del producto -->
    <div class="product-info q-pa-xs">
      <!-- Título -->
      <h6 class="product-title">{{ product.title }}</h6>

      <!-- Tipo de camisa - SIEMPRE VISIBLE -->
      <div v-if="product.typeShirt" class="product-category">
        {{ product.typeShirt }}
      </div>

      <!-- Precios -->
      <div class="price-section">
        <div v-if="product.discount > 0" class="price-wrapper">
          <span class="price-original">
            ${{ new Intl.NumberFormat().format(product.price) }}
          </span>
          <span class="price-discount">
            ${{ new Intl.NumberFormat().format(product.priceDiscount) }}
          </span>
        </div>
        <div v-else class="price-current">
          ${{ new Intl.NumberFormat().format(product.price) }}
        </div>
      </div>

      <!-- Detalles expandibles (ocultos por defecto) -->
      <div v-if="details" class="product-details">
        <q-separator class="q-my-sm" />

        <!-- Descripción -->
        <div v-if="product.description" class="detail-section">
          <div class="detail-label">Descripción</div>
          <p class="detail-text">{{ product.description }}</p>
        </div>

        <!-- Colores -->
        <div v-if="product.colorsSize?.length" class="detail-section">
          <div class="detail-label">Colores disponibles</div>
          <div class="colors-grid">
            <div
              v-for="color in product.colorsSize"
              :key="color.value"
              class="color-item"
            >
              <div
                class="color-swatch"
                :style="{ backgroundColor: colorMap[color.label] || '#ccc' }"
              >
                <q-tooltip>{{ color.label }}</q-tooltip>
              </div>
              <span class="color-name">{{ color.label }}</span>
            </div>
          </div>
        </div>

        <!-- Tallas -->
        <div v-if="product.sizes?.length" class="detail-section">
          <div class="detail-label">Tallas disponibles</div>
          <div class="sizes-grid">
            <div
              v-for="size in product.sizes"
              :key="size.value"
              class="size-chip"
            >
              {{ size.label }}
            </div>
          </div>
        </div>

        <!-- Stock -->
        <div v-if="product.minCant" class="detail-section">
          <div class="stock-info">
            <q-icon name="inventory_2" size="16px" class="q-mr-xs" />
            <span>{{ product.minCant }} unidades disponibles</span>
          </div>
        </div>
      </div>
    </div>
  </q-card>

  <q-dialog v-model="showSelectDialog">
    <q-card class="q-pa-md" style="min-width: 300px">
      <q-card-section>
        <div class="text-h6 text-center q-mb-md">Selecciona color y talla</div>

        <q-select
          v-model="selectedColor"
          :options="product.colorsSize"
          option-label="label"
          label="Color"
          dense
          outlined
          class="q-mb-md"
        />

        <q-select
          v-model="selectedSize"
          :options="product.sizes"
          option-label="label"
          label="Talla"
          dense
          outlined
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey" v-close-popup />
        <q-btn
          label="Agregar"
          color="primary"
          @click="addToCart"
          :disable="!selectedColor || !selectedSize"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.product-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

/* Badge de descuento */
.discount-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #d32f2f;
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 12px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.4);
}

/* Menú de acciones */
.actions-menu {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 6px;
  z-index: 10;
}

.action-btn {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

/* Contenedor de imagen - REDUCIDO */
.image-container {
  cursor: pointer;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
  flex-shrink: 0;
}

.product-swiper {
  height: 100px; /* ← REDUCIDO de 320px a 200px */
}

.product-image {
  transition: transform 0.4s ease;
}

.image-container:hover .product-image {
  transform: scale(1.05);
}

.no-image-placeholder {
  width: 100%;
  height: 150px; /* ← REDUCIDO de 320px a 200px */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

/* Información del producto - COMPACTA */
.product-info {
  background: white;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 13.5px; /* ← REDUCIDO de 16px a 14px */
  font-weight: 600;
  color: #212121;
  margin: 0 0 4px 0; /* ← REDUCIDO margen */
  line-height: 1.3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px; /* ← REDUCIDO de 44px a 36px */
}

.product-category {
  font-size: 13px; /* ← REDUCIDO de 12px a 11px */
  font-weight: 600;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px; /* ← REDUCIDO de 12px a 6px */
  min-height: 16px;
}

/* Sección de precios - COMPACTA */
.price-section {
  margin: 8px 0 0 0; /* ← REDUCIDO márgenes */
  min-height: 28px; /* ← REDUCIDO de 36px a 28px */
  display: flex;
  align-items: center;
}

.price-wrapper {
  display: flex;
  align-items: center;
  gap: 8px; /* ← REDUCIDO de 12px a 8px */
}

.price-original {
  font-size: 12px; /* ← REDUCIDO de 14px a 12px */
  color: #9e9e9e;
  text-decoration: line-through;
}

.price-discount {
  font-size: 18px; /* ← REDUCIDO de 24px a 18px */
  font-weight: 700;
  color: #d32f2f;
}

.price-current {
  font-size: 18px; /* ← REDUCIDO de 24px a 18px */
  font-weight: 700;
  color: #212121;
}

/* Detalles del producto */
.product-details {
  margin-top: 8px;
}

.detail-section {
  margin-bottom: 12px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #424242;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.detail-text {
  font-size: 13px;
  color: #616161;
  line-height: 1.5;
  margin: 0;
}

/* Colores */
.colors-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-swatch:hover {
  transform: scale(1.15);
  border-color: #212121;
}

.color-name {
  font-size: 10px;
  color: #757575;
  text-align: center;
  max-width: 60px;
}

/* Tallas */
.sizes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.size-chip {
  padding: 4px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #424242;
  transition: all 0.2s ease;
  cursor: default;
}

.size-chip:hover {
  background: #212121;
  color: white;
  border-color: #212121;
}

/* Stock */
.stock-info {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #4caf50;
  font-weight: 500;
}

/* Pagination personalizada del Swiper */
:deep(.swiper-pagination-bullet) {
  background: white;
  opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
  background: white;
  opacity: 1;
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

    const showSelectDialog = ref(false);
    const selectedColor = ref(null);
    const selectedSize = ref(null);

    const colorMap = {
      Blanco: "#FFFFFF",
      Negro: "#000000",
      "Gris oscuro": "#4B4B4B",
      "Gris claro": "#D3D3D3",
      "Azul celeste": "#87CEEB",
      "Azul marino": "#001F3F",
      "Azul rey": "#0033A0",
      Beige: "#F5F5DC",
      "Cafe claro": "#C19A6B",
      "Cafe oscuro": "#4B2E05",
      "Verde militar": "#4B5320",
      "Verde bosque": "#228B22",
      "Verde menta": "#98FF98",
      Rojo: "#FF0000",
      Vino: "#722F37",
      "Rosa pastel": "#FFD1DC",
      Fucsia: "#FF00FF",
      "Amarillo mostaza": "#FFDB58",
      "Amarillo crema": "#FFFDD0",
      Naranja: "#FFA500",
      Lila: "#C8A2C8",
      Morado: "#800080",
      Turquesa: "#40E0D0",
      Amarillo: "#FFFF00",
    };

    watch(
      () => props.productx,
      (newVal) => {
        product.value = newVal || { productimg: [] };
      },
      { immediate: true }
    );

    const modules = [Pagination, AutoPlay];

    const openSelectDialog = (item) => {
      product.value = item;
      showSelectDialog.value = true;
    };

    const addToCart = () => {
      if (!selectedColor.value || !selectedSize.value) {
        $q.notify({
          type: "warning",
          message: "Debes seleccionar un color y una talla",
          position: "top",
        });
        return;
      }

      const stored = JSON.parse(localStorage.getItem("productCar") || "[]");

      // usar priceDiscount si existe, y asegurar number
      const price = product.value.priceDiscount
        ? parseFloat(product.value.priceDiscount)
        : parseFloat(product.value.price || 0);

      const newProduct = {
        _id: product.value._id,
        title: product.value.title,
        price,
        typeShirt: product.value.typeShirt || "",
        colorsSize: {
          label: selectedColor.value.label,
          value: selectedColor.value.value,
        },
        sizes: {
          label: selectedSize.value.label,
          value: selectedSize.value.value,
        },
        cant: 0,
        subTotal: price * 1,
      };

      const idx = stored.findIndex(
        (p) =>
          p._id === newProduct._id &&
          p.colorsSize?.value === newProduct.colorsSize.value &&
          p.sizes?.value === newProduct.sizes.value
      );

      if (idx !== -1) {
        stored[idx].cant = (stored[idx].cant || 0) + 1;
        // usar el price guardado o el nuevo price
        const itemPrice = stored[idx].price ?? newProduct.price;
        stored[idx].subTotal = itemPrice * stored[idx].cant;
      } else {
        stored.push(newProduct);
      }

      localStorage.setItem("productCar", JSON.stringify(stored));

      $q.notify({
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
        message: "Producto agregado al carrito",
      });

      showSelectDialog.value = false;
      selectedColor.value = null;
      selectedSize.value = null;
    };

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
      const cant = product.minCant ? product.minCant : 0;
      let productadding = {
        title: product.title,
        description: product.description,
        price: product.price,
        colorsSize: selectedColor.value.label || selectedColor.value,
        sizes: selectedSize.value.label || selectedSize.value,
        typeShirt: props.product.typeShirt,
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
      colorMap,
      addToCart,
      showSelectDialog,
      openSelectDialog,
      selectedColor,
      selectedSize,
    };
  },
};
</script>
