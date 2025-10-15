<template>
  <!-- dialog para confimacion del pago -->
  <q-card>
    <q-card-section class="row justify-center">
      <q-avatar icon="payments" color="primary" text-color="white" />
      <span class="q-ml-sm">Es hora de hacer el pago.</span>
      <span class="q-ml-sm text-justify">
        Realiza una transferencia con los siguientes datos y envianos una imagen
        del comprobante del pago.
      </span>

      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>BANCOLOMBIA S.A. </q-item-section>
          <q-btn round icon="download" download="certificadoBanco.jpeg" />
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Titular</q-item-label>
            <q-item-label caption>ejemplo</q-item-label>
            <q-item-label caption>CC 123456789</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>CUENTA DE AHORRO (ejemplo)</q-item-label>
            <q-item-label>123456789</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <ComfirmPayment :type="type" :idsale="idsale" :closeDialog="closeDialog" />
  </q-card>
</template>

<script>
import ComfirmPayment from "src/components/Payments/ConfimPayment.vue";
import { ref, toRef } from "vue";
export default {
  name: "DialogPaymentProcess",
  props: {
    idsale: String,
    type: String,
    closeDialog: Function,
  },
  components: {
    ComfirmPayment,
  },
  setup(props) {
    const confirmPay = ref(false);

    return {
      confirmPay,
      userdata: JSON.parse(localStorage.getItem("user")),
    };
  },
};
</script>
