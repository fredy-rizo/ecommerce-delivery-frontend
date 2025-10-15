<template>
  <q-card>
    <q-toolbar>
      <q-toolbar-title>
        <span class="text-weight-bold"> + </span>
        Evento
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <div>
      <q-form @submit="publicEvent" @reset="onReset">
        <div class="column q-gutter-md q-pa-md">
          <q-input
            rounded
            outlined
            v-model="nameEvent"
            label="Nombre del Evento"
          />

          <q-input
            rounded
            outlined
            v-model="descriptionEvent"
            type="textarea"
            label="Descripción del Evento"
          />

          <q-input
            rounded
            outlined
            v-model="startEvent"
            label="Inicio de Evento"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    dark
                    bordered
                    v-model="startEvent"
                    color="warning"
                    text-color="black"
                    mask="YYYY-MM-DD HH:mm"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="warning" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    dark
                    bordered
                    color="warning"
                    text-color="black"
                    v-model="startEvent"
                    mask="YYYY-MM-DD HH:mm"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="warning" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input rounded outlined v-model="endEvent" label="Final de Evento">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    dark
                    bordered
                    v-model="endEvent"
                    color="warning"
                    text-color="black"
                    mask="YYYY-MM-DD HH:mm"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="warning" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    dark
                    bordered
                    color="warning"
                    text-color="black"
                    v-model="endEvent"
                    mask="YYYY-MM-DD HH:mm"
                  >
                    <div class="row items-center justify-end">
                      <q-btn flat v-close-popup label="Close" color="warning" />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            rounded
            outlined
            v-model="precio"
            label="Precio de Evento"
            type="number"
            prefix="$"
            placeholder="200,000,000"
          />

          <q-input
            rounded
            outlined
            v-model="numberPublication"
            label="Cantidad de Publicaciones"
            type="number"
          />

          <q-select
            rounded
            outlined
            v-model="estado"
            :options="options"
            label="Estado"
            placeholder="true"
          />
        </div>

        <div class="row justify-end q-gutter-md q-pa-sm">
          <q-btn
            filled
            rounded
            type="reset"
            label="Cancelar"
            text-color="black"
          />

          <q-btn
            rounded
            type="submit"
            label="Guardar"
            text-color="black"
            color="warning"
          />
        </div>
      </q-form>
    </div>
  </q-card>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const nameEvent = ref(null);

    const descriptionEvent = ref(null);

    const startEvent = ref("2022-10-03 08:05");

    const endEvent = ref("2023-11-04 09:06");

    const precio = ref(null);

    const numberPublication = ref(null);

    const estado = ref(null);

    const options = ["activo", "inactivo"];

    const publicEvent = () => {};

    const onReset = () => {};

    return {
      nameEvent,
      descriptionEvent,
      startEvent,
      endEvent,
      precio,
      numberPublication,
      estado,
      options,
      publicEvent,
      onReset,
    };
  },
};
</script>
