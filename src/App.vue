<template>
  <router-view />
</template>

<script>
import { onMounted } from "vue";
import { messaging } from "src/firebase/init";
import { onMessage } from "firebase/messaging";

export default {
  name: "App",
  setup() {
    onMounted(() => {
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        console.log("Notificación en primer plano:", payload);

        const { title, body } = payload.notification;

        // Muestra la notificación del navegador
        if (Notification.permission === "granted") {
          new Notification(title, {
            body,
          });
        }
      });
    });
  },
};
</script>
