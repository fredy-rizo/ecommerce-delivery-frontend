<template>
  <div class="row justify-center postuno">
    <q-card
      class="q-ms-sm col my-card"
      @click="openPublication(publication._id)"
    >
      <!-- Botón de eliminar (no activa el clic del card gracias al .stop) -->
      <q-btn
        class="delete-btn"
        icon="delete"
        @click.stop="deletepublication(publication)"
        v-if="userData.roles.find((itm) => itm.value == 2)"
        round
        unelevated
      />

      <!-- Carrusel (varias imágenes) -->
      <q-carousel
        animated
        v-model="slide"
        navigation
        infinite
        :autoplay="autoplay"
        arrows
        transition-prev="slide-right"
        transition-left="slide-left"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
        v-if="publication.publication.length > 1"
      >
        <q-carousel-slide
          v-for="(img, index) in publication.publication"
          :key="index"
          :name="index + 1"
          :img-src="img.publication"
        />
      </q-carousel>

      <!-- Una sola imagen -->
      <q-carousel
        animated
        v-model="slide"
        v-else-if="publication.publication.length == 1"
      >
        <q-carousel-slide
          v-for="(img, index) in publication.publication"
          :key="index"
          :name="index + 1"
          :img-src="img.publication"
        />
      </q-carousel>

      <!-- Contenido del card -->
      <q-card-section class="row">
        <div class="col-10">
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ publication.title }}</div>
          </div>

          <div v-if="!showDescription">
            <div
              class="text-caption text-justify descriptionx"
              @click.stop="showDescription = !showDescription"
            >
              <pre
                class="fontarial"
                v-html="
                  searchLinksinText(publication.description || '').slice(
                    0,
                    80
                  ) + '...'
                "
              ></pre>
            </div>
            <p
              class="text-weight-bolder"
              v-if="(publication.description || '').length > 80"
              @click.stop="showDescription = !showDescription"
            >
              Ver más
            </p>
          </div>

          <div v-else>
            <div
              class="text-caption text-justify"
              @click.stop="showDescription = !showDescription"
            >
              <pre
                class="fontarial"
                v-html="searchLinksinText(publication.description || '')"
              ></pre>
            </div>
            <p
              class="text-weight-bolder"
              v-if="publication.description.length > 80"
              @click.stop="showDescription = !showDescription"
            >
              Ver menos
            </p>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal (detalle de publicación) -->
    <q-dialog
      v-model="showModal"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="corporate-modal q-pa-none">
        <!-- Encabezado con fondo corporativo -->
        <div class="modal-header">
          <div class="header-left">
            <q-icon name="corporate_fare" size="32px" color="white" />
            <div>
              <div class="text-h6 text-white">{{ selectedPost?.title }}</div>
              <div class="text-caption text-white text-opacity-80">
                Detalle de publicación
              </div>
            </div>
          </div>
          <q-btn
            flat
            dense
            round
            icon="close"
            color="white"
            class="close-btn"
            @click="showModal = false"
          />
        </div>

        <!-- Contenido del modal -->
        <q-card-section class="modal-body">
          <!-- Imagen o carrusel -->
          <div class="media-container q-mb-md">
            <!-- ✅ Carrusel para varias imágenes -->
            <q-carousel
              v-if="selectedPost?.publication?.length > 1"
              animated
              arrows
              infinite
              control-color="primary"
            >
              <q-carousel-slide
                v-for="(img, i) in selectedPost.publication"
                :key="i"
                :img-src="img.publication"
              />
            </q-carousel>

            <!-- ✅ Imagen única -->
            <q-img
              v-else-if="selectedPost?.publication?.[0]?.publication"
              :src="selectedPost.publication[0].publication"
              class="single-image"
              spinner-color="primary"
            />
          </div>

          <!-- Descripción -->
          <div class="description-section">
            <div class="text-body1 q-mb-sm text-primary text-weight-medium">
              Descripción
            </div>
            <pre
              class="fontarial text-justify description-text"
              v-html="searchLinksinText(selectedPost?.description || '')"
            ></pre>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
/* === BOTÓN DE ELIMINAR === */
.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(145deg, #d9534f, #c9302c);
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-in-out;
  z-index: 2;
  border: none;
}
.delete-btn:hover {
  transform: scale(1.1);
  background: linear-gradient(145deg, #e74c3c, #d62c1a);
}
.delete-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* === CARD CORPORATIVA === */
.my-card {
  position: relative;
  width: 100%;
  max-width: 520px;
  margin-bottom: 28px;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.my-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* === CARRUSEL CORPORATIVO === */
.q-carousel {
  border-bottom: 1px solid #f0f0f0;
}

.q-carousel__slide img {
  object-fit: cover;
}

/* === SECCIÓN DE CONTENIDO === */
.q-card-section {
  padding: 18px 20px;
  background-color: #fdfdfd;
}

.text-h6 {
  font-size: 17px;
  font-weight: 600;
  color: #003366;
  letter-spacing: 0.2px;
}

.text-caption {
  font-size: 13px;
  color: #444;
}

/* === DESCRIPCIÓN === */
.descriptionx {
  margin-top: 8px;
  color: #555;
  font-size: 13px;
  line-height: 1.5;
  border-left: 3px solid #007bff30;
  padding-left: 10px;
  transition: color 0.2s;
}
.descriptionx:hover {
  color: #007bff;
}

.text-weight-bolder {
  color: #007bff;
  cursor: pointer;
  font-size: 13px;
  transition: color 0.2s;
}
.text-weight-bolder:hover {
  color: #0056b3;
}

/* === TIPOGRAFÍA GENERAL === */
.fontarial {
  font-family: "Segoe UI", Arial, Helvetica, sans-serif;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.6;
  font-size: 13px;
  color: #333;
}

/* === EFECTO DE FOCO CORPORATIVO === */
.my-card:focus-within {
  outline: 2px solid #007bff40;
  box-shadow: 0 0 0 4px #007bff20;
}

/* === PEQUEÑO INDICADOR VISUAL === */
.my-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  width: 0%;
  background: linear-gradient(90deg, #004e92, #007bff);
  transition: width 0.3s ease;
}
.my-card:hover::before {
  width: 100%;
}

.corporate-modal {
  width: 90%;
  max-width: 900px;
  border-radius: 12px;
  overflow: hidden;
  background: #fdfdfd;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #004e92, #000428);
  padding: 18px 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}
.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.modal-body {
  padding: 24px 32px;
  background-color: #ffffff;
}

.media-container {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.single-image {
  border-radius: 10px;
  width: 100%;
  max-height: 450px;
  object-fit: cover;
}

.description-section {
  margin-top: 16px;
}

.description-text {
  background: #f8f9fb;
  border: 1px solid #e5e8ef;
  padding: 12px;
  border-radius: 8px;
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.modal-footer {
  background: #fafafa;
  padding: 16px 24px;
}
</style>

<script>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { validateUser, ValidateSession, getDataUser } from "src/tools/User";
import { searchLinksinText } from "src/tools/Functions";

export default {
  props: {
    postt: {
      type: Object,
      required: true,
    },
    resetListPublication: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();
    const $q = useQuasar();
    const slide = ref(1);
    const autoplay = ref(true);
    const userData = ref(getDataUser());
    const publication = ref(
      props.postt || { publication: [], description: "" }
    );
    const showDescription = ref(false);
    const showModal = ref(false);
    const selectedPost = ref(null);

    watch(
      () => props.postt,
      (newVal) => {
        publication.value = newVal || { publication: [], description: "" };
      },
      { immediate: true }
    );

    // 🔹 Abrir modal y obtener publicación por ID
    const openPublication = async (id) => {
      try {
        const sessionUser = getDataUser();
        const myHeaders = new Headers();
        myHeaders.append("authorization", `Bearer ${sessionUser.token}`);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
        };

        const res = await fetch(
          `${process.env.API_SERVER}/api/publication/list-id/${id}`,
          requestOptions
        );

        const data = await res.json();

        if (!data.status) {
          $q.notify({
            color: "negative",
            message: data.message || "No se pudo obtener la publicación.",
          });
          return;
        }

        selectedPost.value = data.data || data.post || data;
        showModal.value = true;
      } catch (error) {
        console.log("Error:", error);
        $q.notify({
          color: "negative",
          message: "Error al obtener la publicación.",
        });
      }
    };

    const deletepublication = async (publicationItem) => {
      try {
        const sessionUser = validateUser({ rol: 2 });
        if (!sessionUser) {
          $q.notify({
            color: "negative",
            message: "No autorizado para realizar esta acción.",
          });
          router.push({ path: "/login" });
          return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${sessionUser.token}`);

        const requestOptions = { method: "POST", headers: myHeaders };

        const id = publicationItem && publicationItem._id;
        if (!id) {
          $q.notify({
            color: "negative",
            message: "Id de publicación inválido.",
          });
          return;
        }

        const url = `${process.env.API_SERVER}/api/publication/delete/${id}`;
        const resp = await fetch(url, requestOptions);
        const data = await resp.json().catch(() => null);

        ValidateSession(data, router);

        if (!data?.status) {
          $q.notify({
            color: "negative",
            message: data?.message || "No fue posible eliminar la publicación.",
          });
          return;
        }

        $q.notify({
          color: "green-4",
          message: data.message || "Publicación eliminada.",
        });

        if (typeof props.resetListPublication === "function") {
          props.resetListPublication();
        }
      } catch (err) {
        console.log(err);
        $q.notify({
          color: "negative",
          message: err.message || err,
        });
      }
    };

    return {
      slide,
      autoplay,
      publication,
      userData,
      showDescription,
      showModal,
      selectedPost,
      openPublication,
      deletepublication,
      searchLinksinText,
    };
  },
};
</script>
