<template>
  <div class="q-pa-md">
    <p class="text-h5 q-mb-md">Compras realizadas</p>

    <!-- Si no hay compras -->
    <div v-if="shoppingList.length === 0" class="text-center q-pa-xl text-grey">
      <q-icon name="shopping_bag" size="64px" class="q-mb-md text-grey-6" />
      <p class="text-subtitle">Aun no has realizado tu primera compra</p>
    </div>

    <!-- Si existen compras -->
    <q-table
      v-else
      :rows="shoppingList"
      :columns="columns"
      row-key="_id"
      flat
      bordered
      dense
      class="shadow-2 rounded-borders"
    >
      <!-- Header personalizado -->
      <template v-slot:header="props">
        <q-tr :props="props" class="bg-grey-2">
          <q-th auto-width class="text-center">Seguimiento</q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-center"
          >
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>

      <!-- Cuerpo de la tabla -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width class="text-center">
            <q-btn
              size="sm"
              color="yellow-9"
              round
              dense
              icon="local_shipping"
              :loading="loading.delivery"
              @click="
                () => {
                  liststatus = props.row.deliveryStatus || [];
                  deliveryStatus = true;
                }
              "
              class="q-mr-xs"
              :title="'Ver seguimiento'"
            />
            <q-btn
              v-if="props.row.status.value == 2 || props.row.status.value == 3"
              size="sm"
              color="blue"
              round
              dense
              icon="payments"
              @click="
                () => {
                  confirmPay = true;
                  idsale = props.row._id;
                }
              "
              :title="'Confirmar pago'"
            />
          </q-td>

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-center"
          >
            {{ col.name === "status" ? col.value.name : col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Dialog para confirmación del pago -->
    <q-dialog v-model="confirmPay" persistent>
      <DialogPaymentProcessVue
        :idsale="idsale"
        :type="'2'"
        :closeDialog="closeDialog"
        :reloadlist="getShopping"
      />
    </q-dialog>

    <!-- Dialog con información de entrega -->
    <q-dialog v-model="deliveryStatus" persistent>
      <DeliveryStatusListVue :liststatus="liststatus" />
    </q-dialog>
  </div>
</template>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
.shadow-2 {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.text-center {
  text-align: center;
}
.q-mr-xs {
  margin-right: 4px;
}
</style>

<script>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { validateUser, ValidateSession } from "../../tools/User";
import DialogPaymentProcessVue from "src/components/Payments/DialogPaymentProcess.vue";
import DeliveryStatusListVue from "src/components/Shopping/DeliveryStatusList.vue";

export default {
  setup() {
    const router = useRouter();
    const $q = useQuasar();

    const confirmPay = ref(false);
    const deliveryStatus = ref(false);
    const liststatus = ref([]);
    const shoppingListCount = ref(0);
    const shoppingList = ref([]);
    const idsale = ref("adsas");
    const loading = ref({ delivery: false });

    const columns = [
      { name: "total", label: "Total", field: "total" },
      { name: "status", label: "Estado", field: "status" },
      { name: "identi", label: "Codigo", field: "_id" },
    ];

    const closeDialog = () => {
      confirmPay.value = false;
    };

    const pagination = ref({ pag: 0, perpage: 10, pags: 1 });

    const ListShopping = (index, done) => {
      if (
        pagination.value.pags == pagination.value.pag ||
        pagination.value.pags == 0
      ) {
        return;
      }
      pagination.value.pag++;
      setTimeout(async () => {
        const res = await getShopping();
        shopping.value.push(...res.data);
        pagination.value.pags = res.pagination.pags;
        done();
      }, "1500");
    };

    const getShopping = async () => {
      const sessionUser = validateUser({ rol: [1, 3] });
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
        process.env.API_SERVER +
          `/api/sale/list-sale/${pagination.value.pag}/${pagination.value.perpage}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + sessionUser.token,
          },
        }
      );
      res = await res.json();
      ValidateSession(res, router);
      if (!res.status) {
        console.log("Error de respuesta.");
        console.log(res);
        return;
      }
      shoppingList.value = res.data;
      return res;
    };

    let refreshInterval = null;

    onMounted(() => {
      getShopping();
      refreshInterval = setInterval(getShopping, 5000);
    });

    onBeforeUnmount(() => {
      clearInterval(refreshInterval);
    });

    return {
      idsale,
      shoppingList,
      shoppingListCount,
      columns,
      confirmPay,
      closeDialog,
      deliveryStatus,
      loading,
      liststatus,
      getShopping,
      ListShopping,
    };
  },
  components: {
    DialogPaymentProcessVue,
    DeliveryStatusListVue,
  },
};
</script>
