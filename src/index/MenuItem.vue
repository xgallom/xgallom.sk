<template>
  <button type="button"
    class="appearance-none focus:outline-none w-screen md:w-menu p-2 pl-4 pr-4 cursor-pointer flex flex-row flex-no-wrap"
    :class="{
      'text-black bg-white': isActive,
      'text-white bg-black': !isActive && hasActiveMenuEntry,
      'text-magenta': !hasActiveMenuEntry && !isGlitching,
      'text-white': isGlitching,
      'anim-color': hasColorAnim,
    }" @mouseenter="enter" @mouseleave="leave" @click="redirect" @touchstart="enter" @touchend="leave">
    <span>[{{ menuEntry }}] {{ title }}</span>
    <span class="flex-grow"></span>
    <span v-if="external">&lt;extern&gt;</span>
  </button>
</template>

<script>
// :class="{...(isGlitching ?
//                        (activeMenuEntry === menuEntry || activeMenuEntry === -1 ? {
//                          /*'bg-black': true, */'text-white': true} : {
//                          /*'bg-white': true, */'text-black': true}
//                          ) : {
//                          /*'bg-black': true, */'text-magenta': true
//                        }),
//                        'anim-color': hasColorAnim}"
export default {
  name: "MenuItem",
  props: {
    isGlitching: Boolean,
    hasColorAnim: Boolean,
    menuEntry: Number,
    activeMenuEntry: Number,
    url: String,
    title: String,
    external: Boolean
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
