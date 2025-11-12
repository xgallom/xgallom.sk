<template>
  <button type="button"
    class="appearance-none focus:outline-none w-screen md:w-[24rem] 3xl:w-[40rem] p-2 px-4 cursor-pointer flex flex-row flex-no-wrap"
    :class="{
      'text-black bg-white': isActive,
      'text-white bg-black': !isActive && hasActiveMenuEntry,
      'text-magenta': !hasActiveMenuEntry && !isGlitching,
      'text-white': isGlitching,
      'anim-color': hasColorAnim,
    }" @mouseenter="enter" @mouseleave="leave" @click="redirect" @touchstart="enter" @touchend="leave">
    <span>[{{ menuEntry }}] {{ title }}</span>
    <span class="grow"></span>
    <span v-if="suffix">{{ suffix }}</span>
  </button>
</template>

<script lang="ts">
export default {
  name: "MenuItem",
  props: {
    isGlitching: Boolean,
    hasColorAnim: Boolean,
    menuEntry: Number,
    activeMenuEntry: Number,
    url: String,
    title: String,
    suffix: String | undefined,
    target: String | undefined,
  },
  computed: {
    hasActiveMenuEntry(): boolean {
      return this.activeMenuEntry !== -1;
    },
    isActive(): boolean {
      return this.activeMenuEntry === this.menuEntry;
    }
  },
  methods: {
    enter(): void {
      this.$emit('setMenuEntry', this.menuEntry);
    },

    leave(): void {
      this.$emit('unsetMenuEntry');
    },

    redirect(): void {
      this.$emit('redirect', this.url);
    }
  }
}
</script>

<style scoped></style>
