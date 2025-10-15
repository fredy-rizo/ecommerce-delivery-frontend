<template>
  <q-card class="q-ma-sm col">
    <q-toolbar>
      <q-toolbar-title>
        <span class="text-weight-bold"> + </span>
        Publicaciones
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section>
      <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />

      <q-card-section>
        <q-btn
          to="Vendedor-id"
          round
          class="absolute"
          style="top: 0; transform: translateY(-80%)"
        >
          <q-avatar style="width: 80px; height: 80px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-btn>

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Comida Gourmet</div>
        </div>

        <div class="text-caption text-grey">
          descripcion de la publicacion "opcional"
        </div>
      </q-card-section>

      <q-card-actions class="justify-between">
        <q-rating
          v-model="likeHeart"
          :max="1"
          size="32px"
          color="red"
          icon="las la-heart"
        ></q-rating>
      </q-card-actions>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />

      <q-card-section>
        <q-btn
          to="Vendedor-id"
          round
          class="absolute"
          style="top: 0; transform: translateY(-80%)"
        >
          <q-avatar style="width: 80px; height: 80px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-btn>

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Comida Gourmet</div>
        </div>

        <div class="text-caption text-grey">
          descripcion de la publicacion "opcional"
        </div>
      </q-card-section>

      <q-card-actions class="justify-between">
        <q-rating
          v-model="likeHeart"
          :max="1"
          size="32px"
          color="red"
          icon="las la-heart"
        ></q-rating>
      </q-card-actions>
    </q-card-section>
    <q-separator />
  </q-card>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      likeHeart: ref(0),
    };
  },
};
</script>
