<!-- <script>
import { onMounted } from "vue";
import { messaging, onMessage } from "./firebase/init";
import { Notify } from "quasar";

export default {
  name: "NotificationsManager",
  setup() {
    onMounted(() => {
      onMessage(messaging, (payload) => {
        if (payload.notification) {
          Notify.create({
            message: payload.notification.body,
            caption: payload.notification.title,
            color: "green-6",
            icon: "info",
            position: "top",
            timeout: 3000,
          });
        }
      });
    });
  },
};
</script> -->
