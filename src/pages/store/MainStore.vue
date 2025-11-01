<template>
  <div class="row items-center justify-between q-pa-sm">
    <div class="col">
      <BarFilterProductsVue
        :getDataFilter="getDataFilter"
        :getProductsByType="getProductsByType"
      />
    </div>
    <div
      class="col-auto flex items-center q-ml-md"
      v-if="dataUser.roles.find((itm) => itm.value == 2)"
    >
      <q-btn
        color="green-7"
        label="Agregar"
        unelevated
        class="q-px-md q-py-xs text-white text-weight-medium shadow-2"
        no-caps
        @click="dialogmdel = true"
      />
    </div>
  </div>

  <q-dialog persistent full-width v-model="dialogmdel">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>
          <span class="text-weight-bold"> Nuevo Producto </span>
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section class="row justify-center">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <FormProducts
            :closeDialog="closeDialog"
            :resetListProducts="resetListProducts"
            @product-updated="handleProductUpdate"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- listado de productos -->
  <q-infinite-scroll @load="listProducts" :offset="100">
    <div class="row">
      <div
        v-for="(item, index) in products"
        :key="index"
        class="col-xs-6 col-sm-6 col-md-3 q-pa-sm"
      >
        <ProductCard
          :productx="item"
          :details="false"
          :showModalProduct="showModalProduct"
          :showDialogeditProduct="showDialogeditProduct"
        />
      </div>
    </div>
    <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner color="green" size="30px" />
      </div>
    </template>
  </q-infinite-scroll>

  <!-- detail product -->
  <q-dialog
    v-model="detailmodal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="bg-grey-1 q-pa-none shadow-4"
      style="width: 800px; max-width: 90vw"
    >
      <q-toolbar
        class="bg-white text-dark q-px-md q-py-sm shadow-1 items-center justify-between rounded-t-lg"
      >
        <div class="row items-center no-wrap">
          <q-icon name="info" color="blue-8" size="md" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold text-blue-6">
            {{ oneProduct?.name || "Detalles del producto" }}
          </div>
        </div>

        <q-btn
          flat
          round
          dense
          icon="close"
          color="grey-7"
          class="hover:bg-grey-3 transition-all"
          v-close-popup
        />
      </q-toolbar>

      <q-card-section class="q-pa-md">
        <div class="row justify-center">
          <div class="col-12">
            <ProductCard
              :fulldescription="true"
              :details="true"
              :productx="oneProduct"
              :showModalProduct="showModalProduct"
              :showDialogeditProduct="showDialogeditProduct"
              class="shadow-3 rounded-borders"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Edit product -->
  <q-dialog persistent full-width v-model="editdialog">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>
          <span class="text-weight-bold"> Editar Producto </span>
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section class="row justify-center">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <FormProducts
            :closeDialog="closeDialog"
            :resetListProducts="resetListProducts"
            :oneProduct="oneProduct"
            @product-updated="handleProductUpdate"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { validateUser, ValidateSession, getDataUser } from "../../tools/User";
import ProductCard from "/src/components/Products/ProductCard";
import FormProducts from "/src/components/Products/FormProducts";
import BarFilterProductsVue from "src/components/Products/BarFilterProducts.vue";

export default defineComponent({
  name: "MainStore",

  components: {
    ProductCard,
    FormProducts,
    BarFilterProductsVue,
  },

  setup() {
    const dialogmdel = ref(false);
    const detailmodal = ref(false);
    const editdialog = ref(false);
    const router = useRouter();

    const loading = ref(false);
    const products = ref([]);
    const oneProduct = ref(null);
    const pagination = ref({ pag: 1, perpage: 10, pags: 1 });
    const filter = ref({ title: "" });

    const dataUser = getDataUser();

    // Obtener datos de API
    const getProduts = async () => {
      const sessionUser = validateUser({ rol: 1 });

      let headers = {
        "Content-Type": "application/json",
      };

      // Si hay token usarlo
      if (sessionUser?.token) {
        headers.Authorization = `Bearer ${sessionUser.token}`;
      }

      try {
        let response = await fetch(
          process.env.API_SERVER +
            `/api/product/list-product/${pagination.value.pag}/${pagination.value.perpage}`,
          {
            method: "POST",
            mode: "cors",
            headers,
            body: JSON.stringify(filter.value),
          }
        );

        let res = await response.json();
        console.log(res);
        // Validar sesion
        ValidateSession(res, router);

        // Validar respuesta
        if (!res.status) {
          console.log("Error de respuesta en getProducts en try");
          console.log(res);
          return { data: [], pagination: { pags: 0 } };
        }
        return res;
      } catch (err) {
        console.log("Error de respuesta en getProducts en catch");
        return { data: res.listPrd || [], pagination: { pags: 0 } };
      }
    };

    // Listado con scroll infinito
    const listProducts = (index, done) => {
      try {
        if (
          pagination.value.pags === pagination.value.pag ||
          pagination.value.pags === 0
        ) {
          done();
          return;
        }

        pagination.value.pag++;

        setTimeout(async () => {
          const res = await getProduts();
          if (res && Array.isArray(res.listPrd)) {
            products.value.push(...res.listPrd);
            pagination.value.pags =
              res.pagination?.pags || pagination.value.pags;
          }
          done();
        }, 1500);
      } catch (err) {
        console.log("Error en listProducts → ", err);
      } finally {
        done();
      }
    };

    // Reiniciar listado
    const resetListProducts = async () => {
      products.value = [];
      pagination.value.pag = 1;
      const res = await getProduts();
      if (res && Array.isArray(res.data)) {
        products.value = [...res.data];
        pagination.value.pags = res.pagination?.pags || 1;
      }
      loading.value = false;
    };

    // Filtrar listado
    const getDataFilter = async (query) => {
      if (!query) {
        await resetListProducts();
        return;
      }

      loading.value = true;
      const sessionUser = validateUser({ rol: 1 });
      let headers = { "Content-Type": "application/json" };
      if (sessionUser?.token)
        headers.Authorization = `Bearer ${sessionUser.token}`;

      try {
        const response = await fetch(
          `${
            process.env.API_SERVER
          }/api/product/search-product/${encodeURIComponent(query)}`,
          {
            method: "POST",
            headers,
          }
        );

        const res = await response.json();
        ValidateSession(res, router);

        if (res.status && Array.isArray(res.data)) {
          products.value = [...res.data];
          pagination.value.pags = res.pagination?.pags || 1;
        }
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    // listado por categoria
    const getProductsByType = async (typeValue) => {
      const sessionUser = validateUser({ rol: 1 });
      let headers = { "Content-Type": "application/json" };
      if (sessionUser?.token)
        headers.Authorization = `Bearer ${sessionUser.token}`;

      try {
        const url = `${process.env.API_SERVER}/api/product/get-product-type-prd/${typeValue}/${pagination.value.pag}/${pagination.value.perpage}`;

        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          headers,
        });

        const res = await response.json();
        ValidateSession(res, router);

        if (res.status && Array.isArray(res.data)) {
          products.value = res.data;
          pagination.value.pags = res.pagination?.pags || 1;
        } else {
          products.value = [];
          pagination.value.pags = 1;
        }
      } catch (err) {
        console.error("Error en getProductsByType:", err);
        products.value = [];
      }
    };

    // cerrar dialogos/modales
    const closeDialog = () => {
      dialogmdel.value = false;
      editdialog.value = false;
    };

    // Modal detalle del producto
    const showModalProduct = async (product) => {
      try {
        const sessionUser = validateUser({ rol: 1 });
        let headers = { "Content-Type": "application/json" };

        // Si hay token usarlo
        if (sessionUser?.token) {
          headers.Authorization = `Bearer ${sessionUser.token}`;
        }

        const response = await fetch(
          process.env.API_SERVER + `/api/product/list-id/${product._id}`,
          {
            method: "POST",
            mode: "cors",
            headers,
          }
        );

        const res = await response.json();
        ValidateSession(res, router);

        if (res.status && res.data) {
          oneProduct.value = res.data;
        } else {
          oneProduct.value = product;
        }
        detailmodal.value = true;
      } catch (err) {
        console.log("Error en showModalProduct → ", err);
        oneProduct.value = product;
        detailmodal.value = true;
      }
    };

    // Modal editar producto
    const showDialogeditProduct = (product) => {
      // console.log("EDITANDO → ", product);
      oneProduct.value = product;
      editdialog.value = true;
    };

    // Refresh automatico al editar o crear
    const handleProductUpdate = async () => {
      await resetListProducts();
    };

    onMounted(() => {
      resetListProducts();
    });

    return {
      dialogmdel,
      detailmodal,
      editdialog,
      products,
      oneProduct,
      listProducts,
      showDialogeditProduct,
      pagination,
      closeDialog,
      resetListProducts,
      dataUser,
      getDataFilter,
      loading,
      showModalProduct,
      handleProductUpdate,
      getProductsByType,
    };
  },
});
</script>
