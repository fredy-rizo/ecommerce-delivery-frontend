<template>
  <q-dialog peristent full-width v-model="dialogmdel">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>
          <span class="text-weight-bold">Nueva publicacion</span>
        </q-toolbar-title>
        <q-btn flat round dense ico="close" v-model-popup />
      </q-toolbar>
      <q-card-sction class="row justify-center">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <FormPublicaciones
            :closeDialog="closeDialog"
            :resetListPublications="resetListPublications"
            @publication-updated="handlePublicationUpdate"
          />
        </div>
      </q-card-sction>
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

  <!-- Listado de publicaciones -->
  <q-infinite-scroll @load="listPublications" :offset="100">
    <div class="row">
      <div
        v-for="(item, index) in publicacions"
        :key="index"
        class="col-xs-6 col-sm-6 col-md-3 q-pa-sm"
      >
        <PublicacionesCard
          :publicationx="item"
          :details="false"
          :showModalPublication="showModalPublication"
          :showDialogeditPublication="showDialogeditPublication"
        />
      </div>
    </div>
    <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner color="green" size="30px" />
      </div>
    </template>
  </q-infinite-scroll>

  <!-- Detail publicacion -->
  <q-dialog full-width full-heigth v-model="detailmodal">
    <q-card>
      <q-toolbar>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-cart-section>
        <div class="row justify-center">
          <div class="col col-xs-12 col-sm-12 col-md-6 q-pa-sm">
            <PublicacionesCard
              :fulldescription="true"
              :details="true"
              :publicationx="onePublication"
              :showModalPublication="showModalPublication"
              :showDialogeditPublication="showDialogeditPublication"
            />
          </div>
        </div>
      </q-cart-section>
    </q-card>
  </q-dialog>

  <!-- Editar publicacion -->
  <q-dialog persistent full-width v-model="editdialog">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>
          <span class="text-weight-bold">Editar publicacion</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section class="row justify-center">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <FormPublicaciones
            :closeDialog="closeDialog"
            :resetListPublications="resetListPublications"
            :onePublication="onePublication"
            @publication-updated="handlePublicationUpdate"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { validateUser, ValidateSession, getDataUser } from "src/tools/User";
import PublicacionesCard from "src/components/Publicaciones/PublicacionesCard.vue";
import FormPublicaciones from "src/components/Publicaciones/FormPublicaciones.vue";

export default defineComponent({
  name: "MainStorePublication",

  components: {
    PublicacionesCard,
    FormPublicaciones,
  },

  setup() {
    const dialogmdel = ref(false);
    const detailmodal = ref(false);
    const editdialog = ref(false);
    const router = useRouter();

    const loading = ref(false);
    const publicacions = ref([]);
    const onePublication = ref(null);
    const pagination = ref({ pag: 1, perpage: 10, pags: 1 });
    const filter = ref({});

    const dataUser = getDataUser();

    // Obtener datos de API
    const getPublications = async () => {
      const sessionUser = validateUser({ rol: 1 });

      let headers = { "Content-Type": "application/json" };

      // Si hay token usarlo
      if (sessionUser?.token) {
        headers.Authorization = `Bearer ${sessionUser.token}`;
      } else {
        console.warn("No se encontró token de usuario válido.");
        return { data: [], pagination: { pags: 0 } };
      }

      try {
        const response = await fetch(
          process.env.API_SERVER +
            `/api/publication/list-data/${pagination.value.pag}/${pagination.value.perpage}`,
          {
            method: "POST",
            mode: "cors",
            headers,
            body: JSON.stringify(filter.value),
          }
        );

        const res = await response.json();
        ValidateSession(res, router);

        if (!res.status) {
          console.log("Respuesta no válida en getPublications →", res);
          return { data: [], pagination: { pags: 0 } };
        }

        return res;
      } catch (err) {
        console.log("Error en getPublications →", err);
        return { data: [], pagination: { pags: 0 } };
      }
    };

    // listado scroll infinito
    const listPublications = (index, done) => {
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
    const resetListPublications = async () => {
      publicacions.value = [];
      pagination.value.pag = 1;
      const res = await getPublications();
      if (res && Array.isArray(res.data)) {
        publicacions.value = [...res.data];
        pagination.value.pags = res.pagination?.pags || 1;
      }
      loading.value = false;
    };

    // Filtrar listado
    const getDataFilter = (data) => {
      filter.value = data;
      resetListPublications();
    };

    // Cerrar dialogos/modales
    const closeDialog = () => {
      dialogmdel.value = false;
      editdialog.value = false;
    };

    // Modal detalle de la publicacion
    const showModalPublication = async (publication) => {
      try {
        const sessionUser = validateUser({ rol: 1 });
        let headers = { "Content-Type": "application/json" };

        // Si hay token usarlo
        if (sessionUser?.token) {
          headers.Authorization = `Bearer ${sessionUser.token}`;
        }

        const response = await fetch(
          process.env.API_SERVER +
            `/api/publication/list-id/${publication._id}`,
          {
            method: "POST",
            mode: "cors",
            headers,
          }
        );

        const res = await response.json();
        ValidateSession(res, router);

        if (res.status && res.data) {
          onePublication.value = res.data;
        } else {
          onePublication.value = publication;
        }
        detailmodal.value = true;
      } catch (err) {
        console.log("Error en showModalPublication → ", err);
        onePublication.value = publication;
        detailmodal.value = true;
      }
    };

    // Modal editar publicacion
    const showDialogeditPublication = (publication) => {
      onePublication.value = publication;
      editdialog.value = true;
    };

    // Refresh automatico al editar o crear
    const handlePublicationUpdate = async () => {
      await resetListPublications();
    };

    onMounted(() => {
      const sessionUser = validateUser({ rol: 1 });
      if (sessionUser?.token) {
        resetListPublications();
      } else {
        console.warn("Usuario no autenticado. No se cargan publicaciones.");
      }
    });

    return {
      dialogmdel,
      detailmodal,
      editdialog,
      publicacions,
      onePublication,
      listPublications,
      showDialogeditPublication,
      pagination,
      closeDialog,
      resetListPublications,
      dataUser,
      getDataFilter,
      loading,
      showModalPublication,
      handlePublicationUpdate,
    };
  },
});
</script>
