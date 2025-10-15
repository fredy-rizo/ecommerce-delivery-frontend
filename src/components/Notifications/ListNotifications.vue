<template>
  <div>
    <q-infinite-scroll @load="listNotifications" :offset="250">
      <q-list>
        <div v-for="(notify, index) in notifications" v-bind:key="index">
          <ItemNotification :notify="notify" />
        </div>
      </q-list>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="orange" size="30px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ValidateSession, validateUser } from "../../tools/User";
import ItemNotification from "./ItemNotification.vue";

export default {
  name: "ListNotifications",
  setup() {
    const router = useRouter();

    const notifications = ref([]);
    const pagination = ref({ pag: 0, perpage: 10, pags: 1 });

    const listNotifications = (index, done) => {
      if (
        pagination.value.pags == pagination.value.pag ||
        pagination.value.pags == 0
      ) {
        done();
        return;
      }
      pagination.value.pag++;
      setTimeout(async () => {
        const res = await getNotifications();
        notifications.value.push(...res.data);
        pagination.value.pags = res.pagination.pags;
        done();
      }, "1500");
    };

    const getNotifications = async () => {
      const sessionUser = validateUser({ rol: 1 });
      let res = await fetch(
        process.env.API_SERVER +
          `/api/notifications/list/${pagination.value.pag}/${pagination.value.perpage}`,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + sessionUser.token,
          },
          body: JSON.stringify({}), // body data type must match "Content-Type" header
        }
      );

      res = await res.json();
      ValidateSession(res, router);
      if (!res.status) {
        console.log("Error de respuesta");
        console.log(res);
        return;
      }

      return res;
    };

    return {
      notifications,
      pagination,
      listNotifications,
    };
  },
  components: {
    ItemNotification,
  },
};
</script>