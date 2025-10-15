<template>
  <div class="justify-center">
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
      v-if="!onePublication"
    >
      <q-carousel-slide
        v-for="img in publication"
        v-bind:key="img"
        :name="img.key"
        :img-src="img.image"
      />
    </q-carousel>

    <div class="listimages row justify-center" v-if="onePublication">
      <q-card v-for="img in publication" :key="img">
        <div class="col-sm-6 col-xs-6 col-md-4">
          <q-img :src="img.image" style="width: 150px; max-height: 150px" />
        </div>
      </q-card>
    </div>

    <q-form @submit.prevent="addPublication" @reset.prevent="onReset">
      <div class="row justify-center">
        <q-file
          filled
          v-model="dataimg"
          labe="Seleccionar"
          color="purple-12"
          multiple
          accept="image/*"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </div>

      <div class="column q-gutter-md q-pa-md">
        <q-input
          class="hidden"
          rounded
          outlined
          v-model="id_publication"
          label="id"
        />

        <q-input
          rounded
          outlined
          v-model="namePublication"
          label="Titulo de la publicacion"
        />

        <q-input
          rounded
          outlined
          v-model="description"
          label="Descripcion"
          type="textarea"
          placeholder="Cuentame mas sobre la publicacion"
        />

        <div class="row justify-end q-gutter-md q-pa-sm">
          {{ message }}
        </div>

        <div class="row justify-end q-gutter-md q-pa-sm">
          <q-spinner-puff color="primary" size="2em" v-if="loading" />
          <q-btn
            rounded
            type="submit"
            label="Guardar"
            text-color="black"
            color="warning"
            v-if="!loading"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { validateUser, ValidateSession } from "src/tools/User";
import imagefondo from "../../assets/fondologin.jpeg";

export default {
  props: {
    onePublication: Object,
    closeDialog: Function,
    resetListPublication: Function,
  },

  setup(props, { emit }) {
    const router = useRouter();
    const $q = useQuasar();
    const publication = ref(
      props.onePublication ? [] : [{ image: imagefondo, key: 1 }]
    );

    const dataimg = ref(null);
    const namePublication = ref(null);
    const description = ref(null);
    const messages = ref(false);
    const loading = ref(false);

    function loadimg(imgs) {
      if (imgs) {
        publication.value = [];
        let count = 1;
        imgs.forEach((element) => {
          const reader = new FileReader();
          reader.readAsDataURL(element);
          reader.onload = function () {
            publication.value.push({ image: reader.result, key: count++ });
          };
        });
      }
    }

    watch(dataimg, loadimg);

    const addPublication = () => {
      const sessionUser = validateUser({ rol: 2 });
      if (!sessionUser) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "No tienes acceso a estas funciones",
        });
        return;
      }

      // FormData
      const formData = new FormData();
      formData.append("title", namePublication.value);
      formData.append("description", description.value);

      if (dataimg.value && dataimg.value.length > 0) {
        for (let file of dataimg.value) {
          if (file instanceof File) {
            formData.append("publication", file);
          }
        }
      }

      // Si es edicion y no hay imagen nueva, mantener la actual
      if (
        (!dataimg.value || dataimg.value.length === 0) &&
        props.onePublication?.publication?.length > 0
      ) {
        formData.append(
          "publicationImgOld",
          JSON.stringify(props.onePublication.publication)
        );
      }

      const options = {
        method: "POST",
        headers: { Authorization: "Bearer " + sessionUser.token },
        body: formData,
      };
      loading.value = true;
      fetch(process.env.API_SERVER + "/api/publication/create", options)
        .then((response) => response.json())
        .then((response) => {
          ValidateSession(response, router);
          if (!response.status) {
            $q.notify({
              color: "negative",
              textColor: "white",
              icon: "las la-exclamation",
              message: response.message,
            });
            return;
          }
          messages.value = response.message;
          onReset();
          props.closeDialog();
          props.resetListPublication();
          emit("publication-updated");
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "save",
            message: "Agregado correctamente",
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    // const fetchAddPublication = (options) => {
    //   fetch(process.env.API_SERVER + "/api/publication/create", options)
    //     .then((response) => response.json())
    //     .then((response) => {
    //       ValidateSession(response, router);
    //       if (!response.status) {
    //         $q.notify({
    //           color: "negative",
    //           textColor: "white",
    //           icon: "las la-exclamation",
    //           message: response.message,
    //         });
    //         return;
    //       }
    //       messages.value = response.message;
    //       onReset();
    //       props.closeDialog();
    //       if (props.resetListPublications) props.resetListPublications();
    //       emit("publication-updated");
    //       $q.notify({
    //         color: "green-4",
    //         textColor: "white",
    //         icon: "save",
    //         message: "Publicacion creada correctamente",
    //       });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })
    //     .finally(() => {
    //       loading.value = false;
    //     });
    // };

    // const fetchUpdatePublication = (options, id_publi) => {
    //   fetch(
    //     process.env.API_SERVER + "/api/publication/update/" + id_publi,
    //     options
    //   )
    //     .then((response) => response.json())
    //     .then((response) => {
    //       ValidateSession(response, router);
    //       if (!response.status) {
    //         $q.notify({
    //           color: "negative",
    //           textColor: "white",
    //           icon: "las la-exclamation",
    //           message: response.message,
    //         });
    //         return;
    //       }
    //       messages.value = response.message;
    //       onReset();
    //       props.closeDialog();
    //       if (props.resetListPublications) props.resetListPublications();
    //       emit("publication-updated");
    //       $q.notify({
    //         color: "green-4",
    //         textColor: "white",
    //         icon: "sync",
    //         message: "Actualizando publicacion...",
    //       });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })
    //     .finally(() => {
    //       loading.value = false;
    //     });
    // };

    const onReset = () => {
      publication.value = [{ image: imagefondo, key: 1 }];
      dataimg.value = null;
      namePublication.value = null;
      description.value = null;
    };

    return {
      publication,
      dataimg,
      namePublication,
      description,
      loadimg,
      addPublication,
      onReset,
      messages,
      loading,
      autoplay: ref(true),
      slide: ref(1),
    };
  },
};
</script>
