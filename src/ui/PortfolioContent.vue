<template>
  <div
    class="absolute w-full max-w-2xl xl:max-w-3xl flex flex-col items-stretch border anim-opacity-fast box-border border-white bg-black text-white"
    :class="{
      'opacity-100': isActive,
      'opacity-0 pointer-events-none': !isActive,
    }">
    <div class="flex grow flex-row items-center p-2 px-4 flex-no-wrap bg-white text-black">
      [{{ menuEntry }}] {{ title }}
    </div>
    <div class="flex flex-col items-stretch text-white bg-black h-144 overflow-y-auto">
      <img :src="img" :class="`flex w-full h-64 pt-4 pb-2 px-4 ${imgClass}`" />
      <span class="inline-block grow text-left p-2 px-4" v-html="text"></span>
      <a :href="url" class="flex flex-col p-2 px-4 text-magenta hover:bg-white hover:text-black text-center anim-color"
        target="_blank">
        Website
      </a>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "PortfolioContent",
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
  computed: {
    hasActiveMenuEntry(): boolean {
      return this.activeMenuEntry !== -1;
    },
    isActive(): boolean {
      return this.activeMenuEntry === this.menuEntry;
    }
  },
  methods: {
  }
}
</script>

<style scoped></style>
