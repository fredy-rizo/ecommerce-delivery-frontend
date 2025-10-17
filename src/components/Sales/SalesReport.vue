<template>
  <div class="q-pa-md">
    <!-- Dialog de seguimiento de entrega -->
    <q-dialog v-model="dialogTrace" full-width>
      <DeliveryTracking
        :liststatus="liststatus"
        :idSale="idSale"
        :closeDialog="closeDialog"
      />
    </q-dialog>

    <!-- Dialog para cambiar estado de la venta -->
    <q-dialog v-model="dialogchangestatus" maximized>
      <q-card class="rounded-borders shadow-2">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pt-none">
          <ChangeStatusSale
            :imgpay="imgpay"
            :idsale="idSale"
            :reloadlist="getSales"
            :typesale="'2'"
            :closedialog="closedialogstatus"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog para ver el comprobante -->
    <q-dialog v-model="dialogImg" maximized persistent>
      <q-card class="bg-dark">
        <q-bar class="bg-grey-9 text-white items-center">
          <q-icon name="receipt_long" size="20px" class="q-mr-sm" />
          <div class="text-subtitle1">Comprobante de pago</div>
          <q-space />
          <q-btn dense flat round icon="close" v-close-popup color="white">
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section
          class="q-pa-none flex flex-center"
          style="height: 100vh"
        >
          <q-img
            :src="imgPreview"
            fit="contain"
            style="max-width: 100%; max-height: 100%"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Filtros y botón de exportación moderno -->
    <div class="row">
      <BarFilterSales class="col" :getDataFilter="getDataFilter" />
      <q-btn
        class="col-2"
        v-if="urldownload == ''"
        @click="excel_export"
        icon="downloading"
      />
      <q-btn
        class="col-2"
        v-else
        :href="urldownload"
        @click="resetLink"
        icon="download"
      />
    </div>

    <!-- Tabla estilo Excel -->
    <q-table
      class="excel-table shadow-2 rounded-borders"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 50, 100, 0]"
      :rows="sales"
      :columns="columns"
      row-key="_id"
      flat
      bordered
      dense
      @request="handleList"
    >
      <!-- Header tipo Excel -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width class="text-center actions-column">Acciones</q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-center excel-header"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <!-- Cuerpo -->
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :class="props.rowIndex % 2 === 0 ? 'even-row' : 'odd-row'"
        >
          <q-td auto-width class="text-center actions-column">
            <q-btn
              size="sm"
              color="green-8"
              round
              dense
              icon="local_shipping"
              class="q-mr-xs"
              @click="
                () => {
                  dialogTrace = true;
                  liststatus = props.row.delivery_status || [];
                  idSale = props.row._id;
                }
              "
              :title="'Ver seguimiento'"
            />
            <q-btn
              size="sm"
              color="blue"
              round
              dense
              icon="checklist"
              @click="
                () => {
                  dialogchangestatus = true;
                  idSale = props.row._id;
                  imgpay = props.row.imgpay;
                }
              "
              :title="'Cambiar estado'"
            />
          </q-td>

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-center excel-cell"
          >
            <!-- Comprobante -->
            <template v-if="col.name === 'imgPay'">
              <q-btn
                v-if="
                  props.row.imgPay &&
                  props.row.imgPay.length > 0 &&
                  props.row.imgPay[0].imgPay
                "
                label="Ver"
                color="primary"
                size="sm"
                @click="
                  () => {
                    imgPreview = props.row.imgPay[0].imgPay;
                    dialogImg = true;
                  }
                "
              />
              <span v-else>-</span>
            </template>

            <!-- Campos normales -->
            <template v-else>
              {{ col.value }}
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style scoped>
/* Bordes y sombra generales */
.rounded-borders {
  border-radius: 8px;
}
.shadow-2 {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* Tabla estilo Excel */
.excel-table {
  border-collapse: separate;
  border-spacing: 0;
}
.excel-header {
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  font-weight: 600;
}
.excel-cell {
  border: 1px solid #ccc;
  padding: 4px 8px;
}
.even-row {
  background-color: #fafafa;
}
.odd-row {
  background-color: #fff;
}
.actions-column {
  width: 100px;
}
.text-center {
  text-align: center;
}
.q-mr-xs {
  margin-right: 4px;
}
</style>

<script>
const columns = [
  {
    name: "imgPay",
    align: "center",
    label: "Comprobante",
    field: (row) => row.imgPay && row.imgPay.length > 0 && row.imgPay[0].imgPay,
    sortable: true,
  },
  {
    name: "estado",
    align: "center",
    label: "Estado",
    field: (row) => {
      return row.status ? row.status.name : "";
    },
    sortable: true,
  },
  {
    name: "total",
    align: "center",
    label: "Total",
    field: "total",
    sortable: true,
  },
  {
    name: "address",
    label: "Domicilio",
    align: "center",
    sortable: true,
    field: "address",
  },
  {
    name: "city",
    align: "center",
    label: "Ciudad",
    sortable: true,
    field: "city",
  },
  {
    name: "dateproof",
    align: "center",
    label: "Fecha",
    field: "dateproof",
    sortable: true,
  },
  {
    name: "email",
    align: "center",
    label: "Correo",
    field: "email",
    sortable: true,
  },
  {
    name: "identification",
    align: "center",
    label: "Identificacion",
    field: "identification",
    sortable: true,
  },
  {
    name: "name_client",
    align: "center",
    label: "Nombre",
    field: "name_client",
    sortable: true,
  },
  {
    name: "lastName_client",
    align: "center",
    label: "Apellido",
    field: "lastName_client",
    sortable: true,
  },
  {
    name: "phone_number",
    align: "center",
    label: "Telefono",
    field: "phone_number",
    sortable: true,
  },
];

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { validateUser, ValidateSession } from "../../tools/User";
import BarFilterSales from "src/components/Sales/BarFilterSales";
import DeliveryTracking from "src/components/Sales/DeliveryTracking";
import ChangeStatusSale from "src/components/Sales/ChangeStatusSale.vue";

export default {
  setup() {
    const router = useRouter();
    const $q = useQuasar();

    const dialogTrace = ref(false);
    const dialogchangestatus = ref(false);
    const dialogImg = ref(false);
    const imgPreview = ref("");

    const liststatus = ref([]);
    const idSale = ref("");
    const imgpay = ref("");
    const loading = ref(false);
    const filter = ref({});
    const paginations = ref({ pag: 1, perpage: 10, pags: 1 });
    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      pags: 1,
    });
    const sales = ref([]);
    const urldownload = ref("");

    const getSales = async () => {
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
        process.env.API_SERVER +
          `/api/sale/all-list/${pagination.value.page}/${pagination.value.rowsPerPage}`,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + sessionUser.token,
          },
          body: JSON.stringify(filter.value), // body data type must match "Content-Type" header
        }
      );
      res = await res.json();
      ValidateSession(res, router);
      if (!res.status) {
        console.log("Error de respuesta.");
        console.log(res);
        return;
      }
      sales.value = res.data;
      pagination.value.page = res.pagination.pag;
      pagination.value.rowsPerPage = res.pagination.perpage;
      pagination.value.rowsNumber = res.pagination.cant;
      pagination.value.pags = res.pagination.pags;
      return res;
    };
    getSales();

    const excel_export = async () => {
      urldownload.value = "";
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
      try {
        let res = await fetch(
          process.env.API_SERVER + `/api/sale/export-list-sale-xlsx`,
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionUser.token}`,
            },
            body: JSON.stringify(filter.value), // body data type must match "Content-Type" header
          }
        );

        if (!res.ok)
          throw new Error("Error al generar el archivo: ", res.status);

        const bolb = await res.blob();
        urldownload.value = URL.createObjectURL(bolb);

        const automatico = document.createElement("a");
        automatico.href = urldownload.value;
        automatico.download = "ventas.xlsx";
        document.body.appendChild(automatico);
        automatico.click();
        document.body.removeChild(automatico);
      } catch (error) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "Error al exportar excel",
        });
      }
    };

    const resetLink = () => {
      setTimeout(() => (urldownload.value = ""), 2000);
    };

    const handleList = (props) => {
      pagination.value.page = props.pagination.page;
      pagination.value.rowsPerPage = props.pagination.rowsPerPage;
      getSales();
    };

    // Reiniciar listado
    const resetListSale = async () => {
      sales.value = [];
      paginations.value.pag = 1;
      const res = await getSales();
      if (res && Array.isArray(res.data)) {
        sales.value = [...res.data];
        paginations.value.pags = res.paginations?.props || 1;
      }
      loading.value = false;
    };

    const getDataFilter = async (query) => {
      if (!query) {
        await resetListSale();
        return;
      }

      loading.value = true;
      const sessionUser = validateUser({ rol: 2 });
      let headers = { "Content-Type": "application/json" };
      if (sessionUser?.token)
        headers.Authorization = `Bearer ${sessionUser.token}`;

      try {
        const response = await fetch(
          `${process.env.API_SERVER}/api/sale/get-search/${encodeURIComponent(
            query
          )}`,
          {
            method: "POST",
            headers,
          }
        );
        const res = await response.json();
        ValidateSession(res, router);
        console.log(res);

        if (res.status && Array.isArray(res.data)) {
          sales.value = [...res.data];
          pagination.value.pags = res.pagination?.pags || 1;
        }
      } catch (err) {
        console.log(err);
      } finally {
        loading.value = false;
      }
    };

    const closeDialog = () => {
      dialogTrace.value = false;
    };
    const closedialogstatus = () => {
      dialogchangestatus.value = false;
    };

    return {
      handleList,
      sales,
      getDataFilter,
      getSales,
      pagination,
      columns,
      excel_export,
      urldownload,
      resetLink,
      dialogTrace,
      liststatus,
      idSale,
      imgpay,
      loading,
      closeDialog,
      closedialogstatus,
      dialogchangestatus,
      resetListSale,
      dialogImg,
      imgPreview,
    };
  },
  components: {
    DeliveryTracking,
    BarFilterSales,
    ChangeStatusSale,
  },
};
</script>
