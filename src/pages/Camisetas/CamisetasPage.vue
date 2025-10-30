<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">{{ shirtName }}</div>

    <q-spinner v-if="loading" color="green" size="40px" />

    <div v-else>
      <div v-if="products.length">
        <div class="row q-col-gutter-md">
          <div
            v-for="item in products"
            :key="item._id || item.id"
            class="col-6 col-md-3"
          >
            <ProductCard :productx="item" />
          </div>
        </div>
      </div>
      <div v-else class="flex flex-center q-pa-xl">
        <div class="text-grey-7 text-subtitle1 text-center">
          No hay productos disponibles para esta categoría.
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { validateUser, ValidateSession } from "src/tools/User";
import ProductCard from "src/components/Products/ProductCard.vue";

const route = useRoute();
const router = useRouter();
const products = ref([]);
const loading = ref(false);
const pagination = ref({ pag: 1, perpage: 12, pags: 1 });

// nombres
const shirtNames = {
  1: "Overside",
  2: "CropTop",
  3: "Regular Fit",
  4: "Semi-Overside",
  5: "Hoodie",
};

// parsear y proteger
const typeParam = () => {
  const p = route.params.typeShirt;
  const parsed = parseInt(p, 10);
  return Number.isNaN(parsed) ? String(p) : parsed;
};

const shirtName = computed(() => {
  const t = typeParam();
  return shirtNames[t] || "Camisetas";
});

const detectProductsInRes = (res) => {
  // Devuelve el array de productos según la forma de respuesta
  if (!res) return [];
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.listPrd)) return res.listPrd;
  if (Array.isArray(res.products)) return res.products;
  // si viene un objeto con key 'data' que es objeto con listPrd
  if (res.data && Array.isArray(res.data.listPrd)) return res.data.listPrd;
  return [];
};

const getProductsByType = async () => {
  loading.value = true;
  const typeValue = typeParam();
  console.debug("[CamisetasPage] cargando typeShirt:", typeValue);

  const sessionUser = validateUser({ rol: 1 });
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (sessionUser?.token)
    headers.append("authorization", `Bearer ${sessionUser.token}`);

  try {
    const url = `${process.env.API_SERVER}/api/product/get/by-shirt-types/${typeValue}/${pagination.value.pag}/${pagination.value.perpage}`;

    const response = await fetch(url, {
      method: "POST",
      headers,
      redirect: "follow",
    });

    if (!response.ok) {
      console.error(
        "[CamisetasPage] http error:",
        response.status,
        response.statusText
      );
      products.value = [];
      return;
    }

    const res = await response.json();
    ValidateSession(res, router);

    const found = detectProductsInRes(res);
    products.value = found;
    // si el backend trae paginación diferente, intenta leerla
    pagination.value.pags =
      res.pagination?.pags || res.pagination?.pages || pagination.value.pags;
  } catch (err) {
    console.error("[CamisetasPage] error en getProductsByType:", err);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(getProductsByType);

watch(
  () => route.params.typeShirt,
  () => {
    pagination.value.pag = 1;
    getProductsByType();
  }
);
</script>
