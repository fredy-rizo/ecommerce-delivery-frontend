<template>
  <div class="relative-position">
    <div
      v-if="images.length > 1"
      class="btncarouselleft btncarousel"
      @click="showback"
    >
      <q-icon name="las la-angle-left" />
    </div>

    <div v-if="images.length > 0">
      <div v-for="img in images" v-bind:key="img">
        <q-img v-show="show == img.base64sm" :src="img.base64sm" />
      </div>
    </div>
    <q-img v-else :src="imageDefault" />

    <div
      v-if="images.length > 1"
      class="btncarouselrigth btncarousel"
      @click="shownext"
    >
      <q-icon name="las la-angle-right" />
    </div>
  </div>
</template>

<style scoped>
.btncarouselleft {
  top: 0;
  z-index: 99;
  height: 100%;
  width: 10%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}
.btncarouselrigth {
  right: 0;
  top: 0;
  z-index: 99;
  height: 100%;
  width: 10%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}
.btncarousel:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>

<script>
import { defineComponent, ref, onMounted } from "vue";
import imageDefault from "../../assets/QuokkaCircular.png";

export default defineComponent({
  name: "Carousel-own",
  props: {
    images: Array,
    auto: Boolean,
  },

  setup(props) {
    const show = ref(props.images.length > 0 ? props.images[0].base64sm : []);
    const showing = ref(0);

    const shownext = () => {
      if (showing.value < props.images.length - 1) {
        showing.value++;
        show.value = props.images[showing.value]
          ? props.images[showing.value].base64sm
          : imageDefault;
      } else {
        showing.value = 0;
        show.value = props.images[0] ? props.images[0].base64sm : imageDefault;
      }
    };

    const showback = () => {
      if (showing.value > 0) {
        showing.value--;
        show.value = props.images[showing.value]
          ? props.images[showing.value].base64sm
          : imageDefault;
      } else {
        showing.value = props.images.length - 1;
        show.value = props.images[props.images.length - 1]
          ? props.images[props.images.length - 1].base64sm
          : imageDefault;
      }
    };

    const autoplay = async () => {
      // no resuelto
    };

    onMounted(() => {
      // props.auto ? autoplay() : console.log("autoplay")
    });

    return {
      show,
      showing,
      shownext,
      showback,
      autoplay,
      imageDefault,
    };
  },
});
</script>
