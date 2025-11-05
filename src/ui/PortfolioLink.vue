<template>
  <button type="button"
    class="appearance-none focus:outline-none w-screen md:w-[24rem] cursor-pointer flex flex-col items-stretch anim-color"
    :class="{
      'bg-black text-white': hasActiveMenuEntry || isHighlighted,
      'bg-black text-magenta': !hasActiveMenuEntry && !isHighlighted,
    }" @mouseenter="enter" @mouseleave="leave" @click="redirect" @touchstart="enter" @touchend="leave">
    <span class="flex flex-row items-center p-2 px-4 flex-no-wrap">[{{ menuEntry }}] {{ title }}</span>
  </button>
</template>

<script lang="ts">
export default {
  name: "PortfolioLink",
  props: {
    menuEntry: Number,
    activeMenuEntry: Number,
    url: String,
    title: String,
  },
  data() {
    return {
      isHighlighted: false,
    };
  },
  computed: {
    hasActiveMenuEntry(): boolean {
      return this.activeMenuEntry !== -1;
    },
  },
  methods: {
    enter(): void {
      this.isHighlighted = true;
    },

    leave(): void {
      this.isHighlighted = false;
    },

    redirect(): void {
      this.$emit('redirect', this.url);
    }
  }
}
</script>

<style scoped></style>
