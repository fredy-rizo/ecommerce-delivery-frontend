<template>
  <div>
    <!-- Item sin hijos -->
    <q-item v-if="!children" clickable tag="a" @click="navigateTo">
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>

    <!-- Item con hijos (expansible) -->
    <q-expansion-item
      v-else
      :icon="icon"
      :label="title"
      :caption="caption"
      expand-separator
      dense
      dense-toggle
      class="text-weight-medium"
    >
      <q-list dense padding class="q-pl-md">
        <q-item
          v-for="child in children"
          :key="child.title"
          clickable
          v-ripple
          dense
          class="text-body2"
          @click="navigateToChild(child)"
        >
          <q-item-section avatar class="min-width-0">
            <q-icon name="label" size="16px" color="grey-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ child.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: { type: String, required: true },
    caption: { type: String, default: "" },
    link: { type: String, default: "" },
    icon: { type: String, default: "" },
    children: { type: Array, default: null },
  },
  setup(props) {
    const router = useRouter();

    const navigateTo = () => {
      if (!props.link) return;
      // url absoluta
      if (props.link.startsWith("http")) {
        window.open(props.link, "_blank");
        return;
      }
      // path absoluto
      if (props.link.startsWith("/")) {
        router.push(props.link);
        return;
      }
      // nombre de ruta
      router.push({ name: props.link }).catch(() => {});
    };

    const navigateToChild = (child) => {
      if (child.to) {
        router.push(child.to).catch(() => {});
        return;
      }

      if (child.link) {
        if (typeof child.link === "string" && child.link.startsWith("/")) {
          router.push(child.link).catch(() => {});
          return;
        }
        router.push({ name: child.link }).catch(() => {});
        return;
      }

      if (child.params && child.params.typeShirt) {
        router
          .push({
            name: "CamisetasPage",
            params: { typeShirt: child.params.typeShirt },
          })
          .catch(() => {});
        return;
      }

      const mapping = {
        Overside: 1,
        CropTop: 2,
        "Regular Fit": 3,
        "Semi-Overside": 4,
        Hoodie: 5,
      };
      const type = mapping[child.title];
      if (type) {
        router
          .push({ name: "CamisetasPage", params: { typeShirt: type } })
          .catch(() => {});
      }
    };

    return { navigateTo, navigateToChild };
  },
});
</script>

<style scoped>
.min-width-0 {
  min-width: 0 !important;
  padding-right: 8px !important;
}
</style>
