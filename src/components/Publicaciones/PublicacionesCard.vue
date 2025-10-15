<template>
  <div class="row justify-center postuno">
    <q-card class="q-ms-sm col my-card">
      <q-btn
        class="delete-btn"
        icon="delete"
        @click="deletepublication(publication)"
        v-if="userData.roles.find((itm) => itm.value == 2)"
        round
        unelevated
      />

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
          v-bind:key="index"
          :name="index + 1"
          :img-src="img.publication"
        />
      </q-carousel>

      <q-carousel
        animated
        v-model="slide"
        v-else-if="publication.publication.length == 1"
      >
        <q-carousel-slide
          v-for="(img, index) in publication.publication"
          v-bind:key="index"
          :name="index + 1"
          :img-src="img.publication"
        />
      </q-carousel>

      <q-card-section class="row">
        <div class="col-10">
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ publication.title }}</div>
          </div>

          <div v-if="!showDescription">
            <div
              class="text-caption text-justify descriptionx"
              @click="showDescription = !showDescription"
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
              @click="showDescription = !showDescription"
            >
              Ver mas
            </p>
          </div>

          <div v-else>
            <div
              class="text-caption text-justify"
              @click="showDescription = !showDescription"
            >
              <pre
                class="fontarial"
                v-html="searchLinksinText(publication.description || '')"
              ></pre>
            </div>
            <p
              class="text-weight-bolder"
              v-if="publication.description.length > 80"
              @click="showDescription = !showDescription"
            >
              Ver menos
            </p>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(145deg, #ff4b4b, #c0392b);
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-in-out;
  z-index: 2;
}

.delete-btn:hover {
  transform: scale(1.1);
  background: linear-gradient(145deg, #ff6b6b, #e74c3c);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
}

.delete-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.my-card {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.my-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.fontarial {
  font-family: Arial, Helvetica, sans-serif;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  line-height: 1.5;
  font-size: 12px;
  color: #222;
}
</style>

<script>
import "swiper/css";
import "swiper/css/pagination";
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { Autoplay, Pagination } from "swiper/modules";
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
    const likeHeart = ref(0);
    const userData = ref(getDataUser());
    const publication = ref(
      props.postt || { publication: [], description: "" }
    );
    const disablelike = ref(false);

    watch(
      () => props.postt,
      (newVal) => {
        publication.value = newVal || { publication: [], description: "" };
      },
      { immediate: true }
    );

    const addPoints = async (idPost, accion) => {
      try {
        const sessionUser = validateUser({ rol: 1 });
        if (!sessionUser) {
          $q.notify({
            color: "negative",
            textColor: "white",
            icon: "las la-exclamation",
            message: "No autorizado para realizar esta accion.",
          });
          router.push({ path: "/login" });
          return;
        }

        if (disablelike.value) {
          return;
        }

        const options = {
          method: "POST",
          headers: {
            Authorization: "Basic " + sessionUser.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idPost, accion: accion == 0 ? 1 : 2 }),
        };
        let res = await fetch(
          process.env.API_SERVER + "/api/publication/point",
          options
        );
        res = await res.json();
        disablelike.value = false;

        ValidateSession(res, router);
        if (res.post) {
          post.value = res.post;
        }
      } catch (error) {
        disablelike.value = false;
        console.log(error);
      }
    };

    const deletepublication = async (publicationItem) => {
      try {
        const sessionUser = validateUser({ rol: 2 });
        if (!sessionUser) {
          $q.notify({
            color: "negative",
            textColor: "white",
            icon: "las la-exclamation",
            message: "No autorizado para realizar esta acción.",
          });
          router.push({ path: "/login" });
          return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${sessionUser.token}`);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
        };

        const id = publicationItem && publicationItem._id;
        if (!id) {
          $q.notify({
            color: "negative",
            textColor: "white",
            icon: "las la-exclamation",
            message: "Id de publicación inválido.",
          });
          return;
        }

        const url = `${process.env.API_SERVER}/api/publication/delete/${id}`;
        const resp = await fetch(url, requestOptions);
        const data = await resp.json().catch(() => null);

        if (!data) {
          $q.notify({
            color: "negative",
            textColor: "white",
            icon: "las la-exclamation",
            message: "Respuesta inválida del servidor.",
          });
          return;
        }

        ValidateSession(data, router);

        if (!data.status) {
          $q.notify({
            color: "negative",
            textColor: "white",
            icon: "las la-exclamation",
            message: data.message || "No fue posible eliminar la publicación.",
          });
          return;
        }

        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "las la-check",
          message: data.message || "Publicación eliminada.",
        });

        // refrescar lista si existe la función
        if (typeof props.resetListPublication === "function") {
          props.resetListPublication();
        }
      } catch (err) {
        console.log(err);
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: err.message || err,
        });
      }
    };

    return {
      likeHeart,
      slide,
      autoplay,
      publication,
      addPoints,
      userData,
      showDescription: ref(false),
      disablelike,
      deletepublication,
      searchLinksinText,
      modules: [Pagination, Autoplay],
    };
  },
};
</script>
