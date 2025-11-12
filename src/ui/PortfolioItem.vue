<template>
  <button type="button"
    class="appearance-none focus:outline-none w-screen md:w-[24rem] 3xl:w-[40rem] cursor-pointer flex flex-col items-stretch border anim-color box-border"
    :class="{
      'border-white bg-black text-white': isActive,
      'border-black bg-black text-white': (!isActive && hasActiveMenuEntry) || (isHighlighted && !hasActiveMenuEntry),
      'border-black bg-black text-magenta': !isActive && !hasActiveMenuEntry && !isHighlighted,
    }" @mouseenter="enter" @mouseleave="leave" @click="toggle" @touchstart="enter" @touchend="leave">

    <span class="flex grow flex-row items-center p-2 px-4 flex-no-wrap anim-color" :class="{
      'bg-white text-black': isActive,
      'bg-black text-white': (!isActive && hasActiveMenuEntry) || (isHighlighted && !hasActiveMenuEntry),
      'bg-black text-magenta': !isActive && !hasActiveMenuEntry && !isHighlighted,
    }">[{{ menuEntry }}] {{ title }}</span>
    <span v-if="displayContent" class="flex flex-col items-stretch text-white bg-black anim-height-fast" :class="{
      'h-0': !isActive,
      'h-80': isActive,
    }">
      <span class="flex flex-col items-stretch h-80 overflow-y-auto">
        <img :src="img" :class="`flex w-full h-44 ${imgClass}`" />
        <span class="inline-block grow text-left p-2 px-4" v-html="text"></span>
        <a :href="url" target="_blank" class="flex flex-col text-left p-2 px-4 text-magenta hover:text-white"
          @click.stop="() => { }">
          Website
        </a>
      </span>
    </span>
  </button>
</template>

<script lang="ts">
export default {
  name: "PortfolioItem",
  props: {
    menuEntry: Number,
    activeMenuEntry: Number,
    url: String,
    title: String,
    displayContent: Boolean,
    img: String,
    imgClass: String,
    text: String,
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
    isActive(): boolean {
      return this.activeMenuEntry === this.menuEntry;
    }
  },
  methods: {
    enter(): void {
      this.isHighlighted = true;
    },

    leave(): void {
      this.isHighlighted = false;
    },

    toggle(): void {
      console.log('toggle', this.isActive);
      if (!this.isActive) {
        this.$emit('setMenuEntry', this.menuEntry);
      } else {
        console.log('unset');
        this.$emit('unsetMenuEntry');
      }
    }
  }
}
</script>

<style scoped></style>
