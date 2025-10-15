<template>
  <div>
    <template v-if="products.length > 0">
      <!-- Formulario -->
      <q-card flat bordered class="q-pa-md q-mt-md">
        <q-card-section>
          <div class="text-h5 text-weight-medium text-center q-mb-md">
            Confirmar datos de compra
          </div>

          <q-separator spaced />

          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12 col-md-6">
              <q-input
                rounded
                outlined
                dense
                v-model="client.name_client"
                label="Nombre"
                placeholder="Ej: Juan"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                rounded
                outlined
                dense
                v-model="client.lastName_client"
                label="Apellido"
                placeholder="Ej: Pérez"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                rounded
                outlined
                dense
                option-label="name"
                v-model="client.typeIdentification"
                :options="type_dentifications"
                label="Tipo de identificación"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                rounded
                outlined
                dense
                v-model="client.identification"
                label="Número de identificación"
                placeholder="Ej: 1234567890"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                rounded
                outlined
                dense
                v-model="client.phone_number"
                label="Teléfono"
                placeholder="Ej: 3001234567"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                rounded
                outlined
                dense
                v-model="client.email"
                label="Correo electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                rounded
                outlined
                dense
                v-model="client.city"
                label="Municipio"
                placeholder="Ej: Medellín"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                rounded
                outlined
                dense
                v-model="client.zipCode"
                label="Código postal"
                placeholder="Ej: 050001"
              />
            </div>

            <div class="col-12">
              <q-input
                label-color="black"
                bg-color="light-blue-1"
                rounded
                outlined
                dense
                autogrow
                v-model="client.address"
                label="Dirección de entrega"
                placeholder="Ej: Calle 45 #12-34, Barrio Centro"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Tabla de productos -->
      <q-table
        title="Productos seleccionados"
        :rows="products"
        :columns="columns"
        row-key="id"
        flat
        bordered
        dense
        hide-bottom
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-center"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="flex items-center justify-center">
                <q-btn
                  size="xs"
                  flat
                  dense
                  round
                  color="red"
                  icon="remove"
                  @click="decreaseCant(props.rowIndex)"
                  class="q-pa-none"
                />
                <q-btn
                  size="xs"
                  flat
                  dense
                  round
                  color="green"
                  icon="add"
                  @click="increaseCant(props.rowIndex)"
                  class="q-ml-xs q-pa-none"
                />
              </div>
            </q-td>

            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-center"
            >
              <div v-if="col.name === 'cant'" class="q-mt-sm">
                <q-input
                  type="number"
                  dense
                  borderless
                  min="1"
                  v-model.number="props.row.cant"
                  @update:model-value="updateManualCant(props.rowIndex)"
                  class="text-center"
                  style="max-width: 60px; margin: 0 auto"
                />
              </div>
              <span v-else>{{ col.value }}</span>
            </q-td>

            <q-td auto-width class="text-center">
              <q-btn
                dense
                round
                flat
                color="negative"
                icon="delete"
                @click="removeProduct(props.rowIndex)"
              />
            </q-td>
          </q-tr>
        </template>

        <template v-slot:bottom>
          <div class="row justify-between items-center full-width q-pa-md">
            <div class="text-subtitle1 text-weight-medium">
              Total: {{ new Intl.NumberFormat().format(total) }}
            </div>
          </div>
        </template>
      </q-table>

      <hr />

      <div
        class="row items-center justify-between q-pa-md q-mt-md bg-grey-1 rounded-borders"
      >
        <div class="text-h6 text-weight-medium">
          Total a pagar:
          <span class="text-primary">{{
            new Intl.NumberFormat().format(total)
          }}</span>
        </div>

        <q-btn
          color="amber-8"
          text-color="black"
          unelevated
          rounded
          size="md"
          icon="attach_money"
          label="Pagar"
          @click="pagarPedido"
          :loading="loadingCreateOrder"
          class="q-px-md"
        />
      </div>
    </template>

    <!-- Mensaje de carrito vacío -->
    <template v-else>
      <div class="text-center q-pa-xl text-grey-7">
        <q-icon name="shopping_cart" size="48px" color="grey-5" />
        <div class="text-h5 q-mt-md">Carrito de compra vacío</div>
        <div class="text-body2 text-grey-6">
          Agrega productos para continuar con la compra.
        </div>
      </div>
    </template>

    <!-- Diálogos -->
    <q-dialog v-model="confirmPay">
      <DialogPaymentProcessVue
        :idsale="idsale"
        type="'2'"
        :closeDialog="closeDialog"
      />
    </q-dialog>

    <q-dialog v-model="changeCant">
      <q-card>
        <q-card-section class="q-pt-none">
          <div v-if="showmessage.length > 0">{{ showmessage }}</div>
          <q-input
            v-model="newcant"
            type="number"
            label="Cantidad"
            @keyup="
              addCantItem(editingCant);
              alertMinCant(editingCant);
            "
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { validateUser, ValidateSession } from "../../tools/User";
import { validateRequire } from "../../tools/ValidateForm";
import { useRouter } from "vue-router";
import { getDataUser } from "../../tools/User";
import DialogPaymentProcessVue from "src/components/Payments/DialogPaymentProcess.vue";

export default defineComponent({
  name: "ShoppingCar",

  setup() {
    const router = useRouter();
    const $q = useQuasar();

    let dataUser = getDataUser();

    const confirmPay = ref(false);
    const idsale = ref("");

    const changeCant = ref(false); // dialog
    const dialogmdel = ref(false);
    const loadingCreateOrder = ref(false);
    const products = ref([]);
    const total = ref(0);

    const newcant = ref(0);
    const editingCant = ref({});
    const showmessage = ref("");

    const client = ref({
      userId: dataUser.id ? dataUser.id : "",
      name_client: dataUser.name ? dataUser.name : "",
      lastName_client: dataUser.name ? dataUser.name : "",
      typeIdentification: dataUser.typeIdentification
        ? dataUser.typeIdentification
        : "",
      identification: dataUser.identification ? dataUser.identification : "",
      phone_number: dataUser.phone_number ? dataUser.phone_number : "",
      address: dataUser.address ? dataUser.address : "",
      email: dataUser.email ? dataUser.email : "",
      zipCode: dataUser.zipCode ? dataUser.zipCode : "",
      city: dataUser.city ? dataUser.city : "",
    });

    const type_dentifications = ref([
      { name: "Nit" },
      { name: "CC" },
      { name: "Pasaporte" },
      { name: "CC extranjera" },
    ]);

    const loadProducts = () => {
      const productstemp = localStorage.getItem("productCar")
        ? JSON.parse(localStorage.getItem("productCar"))
        : [];
      let rows = [];
      for (let index = 0; index < productstemp.length; index++) {
        const element = productstemp[index];

        rows.push({
          item: index,
          _id: element._id,
          titl: element.title,
          cant: element.cant,
          pric: element.price,
          minCant: element.minCant,
          subTotal: element.price * element.cant,
        });

        total.value = total.value + element.price * element.cant;
      }
      products.value = rows;
    };
    loadProducts();

    watch(products, () => {
      total.value = products.value.reduce(
        (sum, el) => sum + el.pric * el.cant,
        0
      );
    });

    const recalcTotal = () => {
      total.value = products.value.reduce(
        (sum, el) => sum + el.pric * el.cant,
        0
      );
    };

    const updateManualCant = (index) => {
      const product = products.value[index];
      if (product.cant < 1) product.cant = 1;

      product.subTotal = product.pric * product.cant;

      const productstemp = JSON.parse(localStorage.getItem("productCar")) || [];
      if (productstemp[index]) {
        productstemp[index].cant = product.cant;
      }
      localStorage.setItem("productCar", JSON.stringify(productstemp));
      recalcTotal();
    };

    const increaseCant = (index) => {
      const product = products.value[index];
      product.cant += 1;
      product.subTotal = product.cant * product.pric;

      const productstemp = JSON.parse(localStorage.getItem("productCar")) || [];
      productstemp[index].cant = product.cant;
      localStorage.setItem("productCar", JSON.stringify(productstemp));
      recalcTotal();
    };

    const decreaseCant = (index) => {
      const product = products.value[index];
      if (product.cant > 1) {
        product.cant -= 1;
        product.subTotal = product.cant * product.pric;

        const productstemp =
          JSON.parse(localStorage.getItem("productCar")) || [];
        productstemp[index].cant = product.cant;
        localStorage.setItem("productCar", JSON.stringify(productstemp));
        recalcTotal();
      } else {
        $q.notify({
          color: "warning",
          textColor: "white",
          icon: "las la-exclamation",
          message: `Cantidad minima debe ser 1`,
        });
      }
    };

    const removeItem = (index) => {
      products.value.splice(index.rowIndex, 1);

      const productstemp = localStorage.getItem("productCar")
        ? JSON.parse(localStorage.getItem("productCar"))
        : [];
      productstemp.splice(index.rowIndex, 1);
      localStorage.setItem("productCar", JSON.stringify(productstemp));
      recalcTotal();
    };

    const selectItemCant = (propss) => {
      changeCant.value = true;
      newcant.value = products.value[propss.rowIndex].cant;
      editingCant.value = propss;
      showmessage.value = "";
    };

    const addCantItem = (index) => {
      // validar que no se tome una cantidad inferior a la cantidad minima de venta
      let newcantt =
        newcant.value < products.value[index.rowIndex].minCant
          ? products.value[index.rowIndex].cant
          : newcant.value;
      products.value[index.rowIndex].cant = newcantt;
      const productstemp = localStorage.getItem("productCar")
        ? JSON.parse(localStorage.getItem("productCar"))
        : [];
      productstemp[index.rowIndex].cant = newcantt;
      localStorage.setItem("productCar", JSON.stringify(productstemp));
    };

    const alertMinCant = (index) => {
      if (newcant.value < products.value[index.rowIndex].minCant) {
        showmessage.value =
          "Cantidad minima de venta: " + products.value[index.rowIndex].minCant;
      } else {
        showmessage.value = "";
      }
    };

    const columns = [
      { name: "title", label: "Nombre", field: "titl" },
      { name: "cant", label: "Cantidad", field: "cant" },
      { name: "price", label: "Precio", field: "pric" },
      // { name: "total", label: "Total", field: "subTotal" },
    ];

    const closeDialog = () => {
      confirmPay.value = false;
    };

    const pagarPedido = async () => {
      const sessionUser = validateUser({ rol: 1 });
      if (!sessionUser) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "No tienes acceso a estas funciones.",
        });
        return;
      }
      const productstemp = localStorage.getItem("productCar")
        ? JSON.parse(localStorage.getItem("productCar"))
        : [];

      await gotoshoping(productstemp);
      loadingCreateOrder.value = true;
      if (
        !validateRequire(client.value, [
          "name_client",
          "lastName_client",
          "typeIdentification",
          "identification",
          "phone_number",
          "address",
          "zipCode",
          "email",
          "city",
        ]).status
      ) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "Debe completar todos los campos.",
        });
        loadingCreateOrder.value = false;
        return;
      }

      // Usar id de producto
      const product = productstemp[0];
      if (!product || !product._id) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "No se encontro el ID del producto",
        });
        loadingCreateOrder.value = false;
        return;
      }

      const payload = {
        client: {
          ...client.value,
          typeIdentification: client.value.typeIdentification.name,
        },
        cantBuy: product.cant,
      };

      let res = await fetch(
        process.env.API_SERVER + `/api/sale/pay/${product._id}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionUser.token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      res = await res.json();
      ValidateSession(res, router);
      if (!res.status) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: res.message,
        });
        loadingCreateOrder.value = false;
        return;
      }

      idsale.value = res.saving._id;
      confirmPay.value = true;
      loadingCreateOrder.value = false;

      //limpiar carrito
      localStorage.removeItem("productCar");
    };

    const gotoshoping = (productstemp) => {
      if (productstemp.length < 1) {
        $q.notify({
          color: "info",
          textColor: "white",
          icon: "las la-exclamation",
          message: "No hay mas que pagar.",
        });
        router.push({ path: "/list-sale" });
        return;
      }
    };

    const removeProduct = (rowIndex) => {
      if (rowIndex === undefined || rowIndex < 0) return;

      products.value.splice(rowIndex, 1);

      const productstemp = localStorage.getItem("productCar")
        ? JSON.parse(localStorage.getItem("productCar"))
        : [];

      productstemp.splice(rowIndex, 1);
      localStorage.setItem("productCar", JSON.stringify(productstemp));

      recalcTotal();

      $q.notify({
        color: "negative",
        textColor: "white",
        icon: "delete",
        message: "Producto eliminado del carrito",
      });
    };

    return {
      products,
      changeCant,
      dialogmdel,
      loadingCreateOrder,
      columns,
      loadProducts,
      total,
      newcant,
      editingCant,
      type_dentifications,
      removeItem,
      addCantItem,
      alertMinCant,
      showmessage,
      selectItemCant,
      pagarPedido,
      client,
      confirmPay,
      idsale,
      closeDialog,
      increaseCant,
      decreaseCant,
      updateManualCant,
      removeProduct,
    };
  },
  components: {
    DialogPaymentProcessVue,
  },
});
</script>
