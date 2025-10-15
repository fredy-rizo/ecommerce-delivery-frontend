<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ notify.title }}</q-item-label>
      <div v-if="!showDescription">
        <q-item-label
          caption
          lines="2"
          @click="showDescription = !showDescription"
        >
          {{ notify.description.slice(0, 50) }}
        </q-item-label>
        <p
          class="text-weight-bolder"
          v-if="notify.description.length > 50"
          @click="showDescription = !showDescription"
        >
          Ver mas
        </p>
      </div>
      <div v-else>
        <q-item-label
          caption
          lines="2"
          @click="showDescription = !showDescription"
        >
          {{ notify.description }}
        </q-item-label>
        <p
          class="text-weight-bolder"
          v-if="notify.description.length > 50"
          @click="showDescription = !showDescription"
        >
          Ver menos
        </p>
      </div>
    </q-item-section>

    <q-item-section side top>
      <q-item-label caption>{{ notify.createdAt.slice(0, 10) }}</q-item-label>
      <!-- <q-icon name="star" color="yellow" /> -->
    </q-item-section>
  </q-item>
</template>

<script>
import { ref } from "vue";
export default {
  name: "ItemNotification",
  props: { notify: Object },
  setup(props) {
    return {
      showDescription: ref(false),
    };
  },
};
</script>

<style>
</style>