<template>
  <div class="q-pb-md">
    <q-form @submit.prevent="sendProod">
      <div class="row justify-center">
        <div class="col">
          <label for="loadproof" class="text-subtitle1">
            Cargar comprobante de pago
          </label>

          <q-file
            id="loadproof"
            color="purple-12"
            v-model="dataimg"
            label="Comprobante de pago"
            filled
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <q-spinner-puf color="primary" size="2em" v-if="loading" />
          <q-btn
            rounded
            type="submit"
            text-color="black"
            color="warning"
            icon="send"
            v-if="!loading"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { validateUser, ValidateSession } from "src/tools/User";
import { useQuasar } from "quasar";

export default {
  name: "ConfirmPayment",
  props: {
    idsale: { type: String, required: true },
    closeDialog: Function,
  },

  setup(props) {
    const $q = useQuasar();
    const router = useRouter();
    const loading = ref(false);
    const dataimg = ref(null);

    const sendProod = async () => {
      const sessionUser = validateUser({ rol: [1, 3] });
      if (!sessionUser) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exlamation",
          message: "No autorizado para realizar esa accion",
        });
        router.push({ path: "/login" });
        return;
      }

      if (!dataimg.value) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "Debes subir tu comprobante",
        });
        return;
      }

      loading.value = true;

      try {
        const formData = new FormData();
        formData.append("imgPay", dataimg.value);

        const res = await fetch(
          `${process.env.API_SERVER}/api/sale/laod-proof/${props.idsale}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sessionUser.token}`,
            },
            body: formData,
          }
        );

        const data = await res.json();
        ValidateSession(data, router);

        $q.notify({
          color: data.status ? "positive" : "negative",
          textColor: data.status ? "black" : "white",
          icon: "las la-check",
          message: data.msj || data.message,
        });

        if (data.status) {
          if (props.closeDialog) props.closeDialog();
          router.push({ path: "/shoppingList" });
        }
      } catch (err) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "Error al subir comprobante",
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      dataimg,
      loading,
      sendProod,
    };
  },
};
</script>
