<template>
  <div>
    <h5 class="q-px-md">Notificaciones</h5>
    <ListNotifications />
  </div>
</template>

<script>
import ListNotifications from "components/Notifications/ListNotifications.vue";
export default {
  name: "Notifications-m",
  setup() {
    return {};
  },
  components: {
    ListNotifications,
  },
};
</script>