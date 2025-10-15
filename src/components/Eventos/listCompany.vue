<template>
  <q-card>
    <q-toolbar>
      <q-toolbar-title>
        <span class="text-weight-bold"> + </span>
        Lista de Empresas
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-separator color="orange" inset />

    <div class="q-pa-sm">
      <q-list bordered>
        <q-item>
          <q-item-section avatar>
            <q-avatar rounded>
              <img src="https://cdn.quasar.dev/img/mountains.jpg" />
            </q-avatar>
          </q-item-section>
          <div>
            <div>
              <q-item-section>{{ data.name }}</q-item-section>
            </div>
            <div>
              <q-item-section>{{ data.whatsapp }}</q-item-section>
            </div>
            <div>
              <q-item-section>{{ data.email }}</q-item-section>
            </div>
            <div>
              <q-item-section>{{ data.estado }}</q-item-section>
            </div>
            <q-btn
              dense
              rounded
              color="warning"
              text-color="black"
              label="Publicaciones"
              @click="publicationCompany = true"
            />
            <q-dialog
              persistent
              full-width
              transition-show="slide-left"
              v-model="publicationCompany"
            >
              <PublicationCompany />
            </q-dialog>
          </div>
        </q-item>
      </q-list>
    </div>
  </q-card>
</template>

<script>
import { ref } from "vue";
import PublicationCompany from "./publicationCompany.vue";

export default {
  setup() {
    const data = {
      name: "Fusoco",
      whatsapp: "3177211233",
      email: "Ecommercesassupport@gmail.com",
      estado: true,
    };
    const publicationCompany = ref(null);
    return {
      data,
      publicationCompany,
    };
  },
  components: { PublicationCompany },
};
</script>
