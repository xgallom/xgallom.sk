<template>
    <div class="w-menu inline-block p-2 pl-4 pr-4 cursor-pointer flex flex-row flex-no-wrap"
         :class="{...(isGlitching ?
                                (activeMenuEntry === menuEntry || activeMenuEntry === -1 ? {
                                  /*'bg-black': true, */'text-white': true} : {
                                  /*'bg-white': true, */'text-black': true}
                                  ) : {
                                  /*'bg-black': true, */'text-magenta': true
                                }),
                                'anim-color': hasColorAnim}"

         @mouseenter="enter"
         @mouseleave="leave"
         @click="redirect"
    >
        <div>[{{menuEntry}}] {{title}}</div>
        <div class="flex-grow"></div>
        <div v-if="external">&lt;extern&gt;</div>
    </div>
</template>

<script>
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

<style scoped>

</style>
