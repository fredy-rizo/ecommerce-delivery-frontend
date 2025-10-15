<template>
  <q-page>
    <div>
      <q-card
        class="row q-pa-md justify-center"
        v-if="dataUser.roles.find((itm) => itm.value == 2)"
      >
        <q-btn
          rounded
          @click="dialogmdel = true"
          label="¿Qué quieres publicar el día de hoy?"
        />
      </q-card>

      <div class="q-ma-lg q-gutter-sm">
        <q-dialog persistent full-width v-model="dialogmdel">
          <q-card>
            <q-toolbar>
              <q-toolbar-title>
                <span class="text-weight-bold">Nueva publicación</span>
              </q-toolbar-title>
              <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>
            <q-card-section>
              <FormPublicaciones
                :closeDialog="closeDialog"
                :resetListPublication="resetListPublication"
              />
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>

    <div>
      <div v-if="posts && posts.length <= 0" class="text-center">
        No hay resultados
      </div>
      <q-infinite-scroll @load="listPosts" :offset="250">
        <div class="publicaciones" v-for="(item, index) in posts" :key="index">
          <PublicacionesPage
            :postt="item"
            :resetListPublication="resetListPublication"
          />
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="orange" size="30px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { getDataUser } from "../../tools/User";
import PublicacionesPage from "src/components/Publicaciones/PublicacionesCard";
import FormPublicaciones from "src/components/Publicaciones/FormPublicaciones";

export default defineComponent({
  name: "InicioPage",

  setup() {
    const dialogmdel = ref(false);
    const posts = ref([]);
    const pagination = ref({ pag: 0, perpage: 10, pags: 1 });
    const dataUser = getDataUser() || { roles: [] };

    const listPosts = (index, done) => {
      if (
        pagination.value.pags === pagination.value.pag ||
        pagination.value.pags === 0
      ) {
        done();
        return;
      }
      pagination.value.pag++;
      setTimeout(async () => {
        const res = await getPosts();
        posts.value.push(...res.data);
        pagination.value.pags = res.pagination.pags;
        done();
      }, 1500);
    };

    const resetListPublication = async () => {
      posts.value = [];
      const res = await getPosts();
      posts.value = [...res.data];
    };

    const getPosts = async () => {
      const token = localStorage.getItem("token");
      let res = await fetch(
        process.env.API_SERVER +
          `/api/publication/list-data/${pagination.value.pag}/${pagination.value.perpage}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      res = await res.json();
      if (!res.status) {
        console.log("Error de respuesta", res);
        return;
      }
      return res;
    };

    const closeDialog = () => {
      dialogmdel.value = false;
    };

    const getConfigData = () => {
      fetch(process.env.API_SERVER + "/api/config/app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((r) => r.json())
        .then((r) => {
          localStorage.setItem(
            "config",
            JSON.stringify(r.status ? r.data : {})
          );
        })
        .catch(console.log);
    };
    getConfigData();

    return {
      dataUser,
      dialogmdel,
      posts,
      pagination,
      closeDialog,
      listPosts,
      resetListPublication,
    };
  },

  components: {
    PublicacionesPage,
    FormPublicaciones,
  },
});
</script>
