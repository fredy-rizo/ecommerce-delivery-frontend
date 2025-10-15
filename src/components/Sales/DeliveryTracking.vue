<template>
  <q-card class="q-pa-md q-rounded-xl shadow-2">
    <q-card-section class="text-center q-pb-none">
      <div class="text-h6 text-weight-bold text-primary">
        Seguimiento de entrega
      </div>
      <div class="text-subtitle2 text-grey-7">
        Actualiza el estado del pedido y agrega observaciones
      </div>
    </q-card-section>

    <q-separator spaced />

    <q-card-section class="q-gutter-md">
      <q-select
        rounded
        outlined
        dense
        v-model="estado"
        :options="options"
        label="Seleccionar estado"
        class="col-12"
        emit-value
        map-options
      />

      <q-input
        rounded
        outlined
        autogrow
        dense
        v-model="description"
        type="textarea"
        label="Detalles o comentario"
        class="col-12"
      />

      <q-btn
        color="green-6"
        label="Enviar actualización"
        no-caps
        unelevated
        rounded
        class="full-width q-mt-sm"
        @click="saveStatus"
      />
    </q-card-section>

    <q-separator spaced />

    <q-card-actions align="right">
      <q-btn flat color="grey-7" label="Cerrar" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { validateUser, ValidateSession } from "../../tools/User";

export default {
  name: "DeliveryTracking",
  props: {
    liststatus: Array,
    idSale: String,
    closeDialog: Function,
    reloadlist: Function,
  },
  setup(props) {
    const router = useRouter();
    const $q = useQuasar();
    const estado = ref(null);
    const description = ref("");
    const options = ref([
      "Hola, estamos empacando tu pedido.",
      "Genial, tu pedido ha sido enviando con numero de guia: ",
      "Vaya, has devuelto el producto.",
      "Listo, nos han notificado que el pedido ha sido entregado, esperamos que vuelvas pronto.",
    ]);

    watch(estado, () => {
      description.value = estado.value + " " + description.value;
    });

    const saveStatus = async () => {
      const sessionUser = validateUser({ rol: 2 });
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
      let res = await fetch(
        process.env.API_SERVER + `/api/sale/status-delivery/${props.idSale}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + sessionUser.token,
          },
          body: JSON.stringify({
            description: description.value,
          }),
        }
      );
      res = await res.json();
      ValidateSession(res, router);
      if (!res.status) {
        console.log("Error de respuesta.");
        console.log(res);
        return;
      }

      if (props.reloadlist) {
        await props.reloadlist();
      }

      $q.notify({
        color: "green-7",
        textColor: "white",
        icon: "las la-check",
        message: res.message,
      });
      props.closeDialog();
      return res;
    };

    return {
      description,
      saveStatus,
      options,
      estado,
    };
  },
};
</script>
