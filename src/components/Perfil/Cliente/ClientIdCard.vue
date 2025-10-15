<template>
  <q-card class="q-pa-sm">
    <q-img
      class="img-portada"
      style="height: 200px"
      src="https://cdn.quasar.dev/img/chicken-salad.jpg"
    ></q-img>

    <q-card-section>
      <div class="row justify-center q-pb-sm">
        <q-btn
          round
          class="absolute"
          style="top: 0; transform: translateY(-50%)"
        >
          <!-- <q-avatar style="width: 90px; height: 90px"> -->
          <q-avatar
            style="
              background-size: 100% 100%;
              -webkit-background-size: 100% 100%;
              width: 133px;
              height: 133px;
            "
          >
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-btn>
      </div>

      <div class="row no-wrap text-center q-pb-sm" style="padding-top: 50px">
        <div class="col text-h6">{{ dataUser.nombre }}</div>
      </div>
      <div>
        <q-btn
          outline
          style="color: goldenrod"
          label="Perfil"
          to="perfil-page"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref } from "vue";
import { getDataUser } from "../../../tools/User";
export default {
  setup() {
    const dataUser = ref(getDataUser());

    return {
      dataUser,
    };
  },
};
</script>
