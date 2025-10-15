<template>
  <BarFilterProductsVue :getDataFilter="getDataFilter" />
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

  <q-page-sticky
    style="z-index: 9"
    position="bottom-right"
    :offset="[18, 18]"
    @click="dialogmdel = true"
    v-if="dataUser.roles.find((itm) => itm.value == 2)"
  >
    <q-btn fab icon="add" class="bg-green-7" />
  </q-page-sticky>

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
  <q-dialog full-width full-height v-model="detailmodal">
    <q-card>
      <q-toolbar>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <div class="row justify-center">
          <div class="col col-xs-12 col-sm-12 col-md-6 q-pa-sm">
            <ProductCard
              :fulldescription="true"
              :details="true"
              :productx="oneProduct"
              :showModalProduct="showModalProduct"
              :showDialogeditProduct="showDialogeditProduct"
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
    const filter = ref({});

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
      if (res && Array.isArray(res.listPrd)) {
        products.value = [...res.listPrd];
        pagination.value.pags = res.pagination?.pags || 1;
      }
      loading.value = false;
    };

    // Filtrar listado
    const getDataFilter = (data) => {
      filter.value = data;
      resetListProducts();
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
    };
  },
});
</script>
