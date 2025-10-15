<template>
  <div>
    <div class="row justify-center">
      <div class="col text-center">
        <q-img
          :src="imgpay || logogray"
          spinner-color="white"
          style="width: 100%"
          :alt="logogray"
        />
      </div>
    </div>
    <div class="row justify-center self-end">
      <div class="col">
        <q-select
          rounded
          outlined
          v-model="status"
          :options="options"
          option-label="name"
          label="Estado"
        />
      </div>
    </div>
    <div class="row justify-center self-end">
      <div class="col text-center">
        <q-btn
          fab
          icon="save"
          class="bg-green-7"
          label="Guardar"
          @click="changeStatus"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { validateUser, ValidateSession } from "../../tools/User";
import { useQuasar } from "quasar";
import logogray from "src/assets/QuokkaCircular.png";

export default {
  name: "ChangeStatusSale",
  props: {
    reloadlist: Function,
    idsale: String,
    imgpay: String,
    typesale: String, // type == 1 venta de venbresia, type == 2 venta normal de productos
    closedialog: Function,
  },

  setup(props) {
    const $q = useQuasar();
    const router = useRouter();

    const loading = ref(false);
    const status = ref(null);
    const options = ref([
      { name: "Pagado", value: "1" },
      { name: "Pendiente de pago", value: "2" },
      { name: "Cancelado", value: "3" },
      { name: "Validando pago", value: "4" },
    ]);

    const changeStatus = async () => {
      const sessionUser = validateUser({ rol: [2, 3] });
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

      if (!status.value) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "Debe seleccionar un estado.",
        });
        return;
      }

      loading.value = true;

      try {
        const res = await fetch(
          process.env.API_SERVER + `/api/sale/status-change/${props.idsale}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionUser.token}`,
            },
            body: JSON.stringify({
              status: {
                name: status.value.name,
                value: status.value.value,
              },
            }),
          }
        );

        const data = await res.json();
        ValidateSession(data, router);

        if (!data.status) {
          $q.notify({
            color: "negative",
            textColor: "white",
            icon: "las la-exclamation",
            message: data.msj || data.message,
          });
          return;
        }

        // Actualizar lista inmediatamente
        if (props.reloadlist) {
          await props.reloadlist();
        }

        // Notificación visual inmediata
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "las la-check",
          message: data.msj || "Estado actualizado correctamente.",
        });

        // Cerrar el diálogo después de actualizar la lista
        if (props.closedialog) {
          props.closedialog();
        }
      } catch (error) {
        ValidateSession(error, router);
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: error.message,
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      status,
      options,
      changeStatus,
      logogray,
    };
  },
};
</script>
