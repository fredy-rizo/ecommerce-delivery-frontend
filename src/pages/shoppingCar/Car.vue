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
        class="q-mt-md bg-white shadow-1 rounded-borders"
        separator="cell"
      >
        <template v-slot:header="props">
          <q-tr class="bg-blue-grey-2 text-weight-bold text-black">
            <q-th auto-width class="text-center border-right"></q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              class="text-center text-uppercase border-right"
            >
              {{ col.label }}
            </q-th>
            <q-th class="text-center">Acción</q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="props.rowIndex % 2 === 0 ? 'bg-grey-1' : 'bg-white'"
            class="hover:bg-grey-2 transition-all"
          >
            <q-td auto-width class="text-center border-right">
              <q-td auto-width class="text-center border-right">
                <q-td auto-width class="text-center border-right">
                  <div class="flex items-center justify-center">
                    <q-btn
                      flat
                      dense
                      round
                      size="sm"
                      color="red-7"
                      icon="remove"
                      @click="decreaseCant(props.rowIndex)"
                    />
                    <span class="q-mx-sm text-weight-medium">{{
                      props.row.cant
                    }}</span>
                    <q-btn
                      flat
                      dense
                      round
                      size="sm"
                      color="green-7"
                      icon="add"
                      @click="increaseCant(props.rowIndex)"
                    />
                  </div>
                </q-td>
              </q-td>
            </q-td>

            <q-td
              v-for="col in props.cols"
              :key="col.name"
              class="text-center border-right"
            >
              <div
                v-if="col.name === 'cant'"
                class="q-mt-sm flex justify-center"
              >
                <q-input
                  type="number"
                  dense
                  borderless
                  min="0"
                  v-model.number="props.row.cant"
                  @update:model-value="updateManualCant(props.rowIndex)"
                  :input-style="{ textAlign: 'center', width: '60px' }"
                  :class="props.row.cant === 0 ? 'text-negative' : ''"
                />
              </div>

              <div
                v-else
                class="ellipsis text-body2 text-center"
                style="max-width: 150px; margin: 0 auto"
              >
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  v-if="String(col.value).length > 12"
                >
                  {{ col.value }}
                </q-tooltip>
                {{ col.value }}
              </div>
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
          <div
            class="row justify-between items-center full-width q-pa-md bg-grey-2"
          >
            <div class="text-subtitle1 text-weight-bold">
              Total general:
              <span class="text-primary">{{
                new Intl.NumberFormat().format(total)
              }}</span>
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

    const changeCant = ref(false);
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
      const stored = localStorage.getItem("productCar");

      if (!stored) {
        products.value = [];
        total.value = 0;
        return;
      }

      const productstemp = JSON.parse(stored);
      if (!Array.isArray(productstemp) || productstemp.length === 0) {
        products.value = [];
        total.value = 0;
        return;
      }

      const rows = productstemp.map((element, index) => ({
        item: index,
        _id: element._id,
        titl: element.title,
        color: Array.isArray(element.colorsSize)
          ? element.colorsSize[0].label
          : element.colorsSize?.label || element.colorsSize,
        size: Array.isArray(element.sizes)
          ? element.sizes[0].label
          : element.sizes?.label || element.sizes,
        typeShirt: element.typeShirt || "—",
        cant: element.cant || 0,
        pric: element.price,
        subTotal: (element.price ?? 0) * (element.cant ?? 0),
      }));

      products.value = rows;
      total.value = rows.reduce((s, r) => s + r.subTotal, 0);
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
      if (product.cant < 0) product.cant = 0;

      product.subTotal = product.pric * (product.cant ?? 0);

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
      if (product.cant > 0) {
        product.cant -= 1;
        if (product.cant < 0) product.cant = 0;
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
          message: `Cantidad minima es 1`,
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
      { name: "titl", label: "Nombre", field: "titl" },
      { name: "color", label: "Color", field: "color" },
      { name: "size", label: "Talla", field: "size" },
      { name: "typeShirt", label: "Tipo", field: "typeShirt" },
      { name: "cant", label: "Cantidad", field: "cant" },
      { name: "price", label: "Precio", field: "pric" },
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
        router.push({ path: "/login" });
        return;
      }

      if (!sessionUser.id || !sessionUser.token) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "Tu cuenta no es valida. Inicia sesion nuevamente",
        });
        router.push({ path: "/login" });
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

      // Validacion de cantidad
      const invalidProduct = productstemp.find((p) => (p.cant ?? 0) < 1);
      if (invalidProduct) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "No has seleccionado una cantidad minima de compra",
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
        cantBuy: product.cant,
        colorsSize: product.colorsSize,
        sizes: product.sizes,
        typeShirt: product.typeShirt,
        client: {
          userId: client.value.userId,
          name_client: client.value.name_client,
          lastName_client: client.value.lastName_client,
          typeIdentification:
            client.value.typeIdentification?.name ||
            client.value.typeIdentification,
          identification: client.value.identification,
          phone_number: client.value.phone_number,
          address: client.value.address,
          email: client.value.email,
          zipCode: client.value.zipCode,
          city: client.value.city,
        },
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
      console.log(res);
      ValidateSession(res, router);
      if (!res.status) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "las la-exclamation",
          message: "Error al realizar pago",
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

      const productstemp = JSON.parse(
        localStorage.getItem("productCar") || "[]"
      );
      productstemp.splice(rowIndex, 1);
      localStorage.setItem("productCar", JSON.stringify(productstemp));

      loadProducts();

      window.dispatchEvent(new Event("cartUpdated"));

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
