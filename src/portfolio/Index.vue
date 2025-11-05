<template>
  <div class="w-screen h-dvh select-none inset-0">
    <div class="absolute w-screen h-dvh font-vga inset-0 flex flex-col items-stretch lg:items-center bg-black">
      <button ref="header-bar"
        class="appearance-none cursor-pointer focus:outline-none mt-4 md:mt-12 flex-none flex flex-col items-center p-2 pl-6 pr-6"
        :class="{
          'anim-color': hasColorAnim,
          'text-magenta': !isGlitching && !hasActiveMenuEntry,
          'text-white': isGlitching || hasActiveMenuEntry,
        }" @mousedown="startGlitch(0)" @touchstart="startGlitch(0)" @mouseup="stopGlitch" @touchend="stopGlitch">
        <span class="text-xl">
          Milan Gallo
        </span>
        <span>
          Portfolio
        </span>
      </button>

      <div
        class="flex flex-col lg:flex-row w-screen flex-grow items-stretch md:items-center lg:items-center justify-start lg:justify-start pt-4 md:pt-12 lg:pt-0 lg:pb-12 lg:my-24 lg:self-start">
        <div class="flex flex-col lg:ml-24 xl:ml-48 border-0 anim-width-color box-border w-screen md:w-[24rem]">
          <div class="flex flex-col">
            <template v-for="(link, n) in links">
              <PortfolioLink v-if="link.type === 'link'" :menuEntry="n" :activeMenuEntry="activeMenuEntry"
                :url="link.url" :title="link.title" @redirect="redirect" @setMenuEntry="setMenuEntry"
                @unsetMenuEntry="unsetMenuEntry" />
              <PortfolioItem v-if="link.type === 'portfolio'" :displayContent="!ifScreen.md" :menuEntry="n"
                :activeMenuEntry="activeMenuEntry" :url="link.url" :title="link.title" :img="link.img" :text="link.text"
                :imgClass="link.imgMobile" @redirect="redirect" @setMenuEntry="setMenuEntry"
                @unsetMenuEntry="unsetMenuEntry" />
            </template>
          </div>
        </div>
        <div
          class="hidden md:flex lg:mr-12 xl:mr-24 lg:pl-12 md:pt-24 md:pb-12 lg:py-0 grow flex flex-col items-center text-white">
          <div class="opacity-0 flex flex-col">
            <div class="p-2">?</div>
            <div class="h-144"></div>
          </div>
          <template v-for="(link, n) in links">
            <PortfolioContent v-if="link.type === 'portfolio'" :menuEntry="n" :activeMenuEntry="activeMenuEntry"
              :url="link.url" :title="link.title" :img="link.img" :text="link.text" :imgClass="link.imgDesktop" />
          </template>
        </div>
      </div>

      <div ref="footer-bar" class="mb-2 flex-none flex items-center justify-center" :class="{
        'anim-color': hasColorAnim,
        'text-magenta': !isGlitching && !hasActiveMenuEntry,
        'text-white': isGlitching || hasActiveMenuEntry,
      }">
        Copyright © Milan Gallo, 2025
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { markRaw } from 'vue';
import PortfolioContent from '/src/ui/PortfolioContent.vue';
import PortfolioItem from '/src/ui/PortfolioItem.vue';
import PortfolioLink from '/src/ui/PortfolioLink.vue';

let Tone;

const Links = [
  { type: 'link', url: '/', title: 'Homepage' },
  {
    type: 'portfolio',
    url: 'https://gemsandgoblins.com/',
    title: 'Gems and Goblins',
    img: '/img/gems-and-goblins-alt.avif',
    imgDesktop: 'object-contain',
    imgMobile: 'object-contain',
    text: `Gems and Goblins is a turn based mobile RPG set in a fantasy world with extensive lore. It's built in Unreal 
    Engine and has a Symfony backend.<br>
    <br>
    My role in the team was backend development, game testing and building websites. As a small team we worked very
    closely and spent a lot of time brainstorming and building game mechanics.<br>
    <br>
    Although my role was server oriented, I did have insight into the client and kept up with the unreal codebase, 
    helping out on the side.`,
  },
  {
    type: 'portfolio',
    url: 'https://wemakegames.sk/',
    title: 'WeMakeGames',
    img: '/img/we-make-games.png',
    imgDesktop: 'object-cover',
    imgMobile: 'object-cover',
    text: `WeMakeGames is a small game studio (~15 people) where I worked as a developer. I joined development during
    Gems and Goblins and participated on few additional yet unreleased titles.<br>
    <br>
    Alongside developing I helped directing, copy writing, preparing documents, communicating with shareholders and
    public. It was a very fast and inspiring environment, where everyone showed up with their absolute best.`,
  },
  {
    type: 'portfolio',
    url: 'https://superhivemarket.com/products/gamepad-camera-control',
    title: 'Gamepad Camera Control',
    img: '/img/gamepad-camera-control.png',
    imgDesktop: 'object-cover',
    imgMobile: 'object-cover',
    text: `Gamepad Camera Control is a separately sold Blender plugin. It provides gamepad support and allows
    controling cameras in the scene. It records keyframes and streamlines creation of captivating trailers.<br>
    <br>
    I started out as an advisor and helped by integrating SDL. Pretty early I overtook as a lead developer, and after a complete 
    refactor we continued implementing fixes and additional features. Codebase is in python and utilises the Blender plugin API.`,
  },
  {
    type: 'portfolio',
    url: 'https://github.com/xgallom/zengine',
    title: 'Zengine',
    img: '/img/zengine.png',
    imgDesktop: 'object-contain',
    imgMobile: 'object-cover',
    text: `Zengine is my one-person 3D game engine built in Zig on top of SDL. The project is slowly crawling its way 
    out of infancy.<br>
    <br>
    Most work done is still preliminary, but it has a working math library with batching, gpu passes, shaders, 
    materials, lighting, texturing, scene graph and extensive performance monitoring`,
  },
];

export default {
  name: 'Index',
  components: { PortfolioContent, PortfolioItem, PortfolioLink },
  mounted(): void {
    this.cancelGlitchHandler = null;
    this.loadingHandler = null;
    this.fadeInHandler = null;
    this.loading = 4;

    const loadingStartedTime = performance.now();

    import('tone').then(imported => {
      Tone = imported;

      this.$nextTick(() => {
        window.addEventListener('resize', this.resized, false);
        window.addEventListener('keydown', this.onKeyDown, false);
      });
    });
  },

  beforeDestroy(): void {
    if (this.tone.noiseVolume) this.tone.noiseVolume.mute = true;
    this.render.destroy();
    window.removeEventListener('resize', this.resized, false);
    window.removeEventListener('keydown', this.onKeyDown, false);
  },

  data() {
    return {
      loading: 3,
      loaded: true,
      running: false,

      hasColorAnim: false,
      activeMenuEntry: -1,
      windowWidth: window.innerWidth,
      tone: markRaw({
        uiSynth: null,
      }),
    };
  },

  computed: {
    hasActiveMenuEntry(): boolean {
      return this.activeMenuEntry !== -1;
    },
    ifScreen() {
      return {
        sm: this.windowWidth >= 640,
        md: this.windowWidth >= 768,
        lg: this.windowWidth >= 1024,
        xl: this.windowWidth >= 1280,
      };
    },
    activeScreen(): number {
      const screen = this.ifScreen;
      if (screen.xl) return 4;
      if (screen.lg) return 3;
      if (screen.md) return 2;
      if (screen.sm) return 1;
      return 0;
    },
    links() {
      return Links;
    },
  },

  watch: {},

  methods: {
    redirect(url: string): void {
      this.clickSound();
      this.activeMenuEntry = -1;
      setTimeout(() => window.location = url, 400);
    },

    setMenuEntry(menuEntry: number): void {
      this.activeMenuEntry = menuEntry;
      this.clickSound();
    },

    unsetMenuEntry(): void {
      this.activeMenuEntry = -1;
      this.clickSound();
    },

    onKeyDown(e): void {
      for (let n = 0; n < this.links.length; ++n) {
        const link = this.links[n];
        if (link.screen !== undefined) {
          if (!this.ifScreen[link.screen]) continue;
        }
        if (e.key === n.toString()) {
          switch (link.type) {
            case 'link':
              this.redirect(link.url);
              break;
            case 'portfolio':
              if (this.activeMenuEntry !== n)
                this.setMenuEntry(n);
              else
                this.unsetMenuEntry();
              break;
          }
        }
      }
    },

    resized(): void {
      this.windowWidth = window.innerWidth;
    },

    startSound(callback?: () => void): void {
      Tone.start().then(() => {
        this.tone.uiSynth = new Tone.Synth({
          oscillator: {
            type: 'pwm',
          },
          envelope: {
            attack: 0.005,
            decay: 0.15,
            sustain: 0.001,
            release: 0.001,
          }
        })
          .toDestination();
        this.tone.uiSynth.volume.value = -12;
        this.tone.uiSynth.mute = false;

        if (callback) callback();
      });
    },

    clickSound(): void {
      if (!this.tone.uiSynth) {
        this.startSound(() => this.$nextTick(() => this.tone.uiSynth.triggerAttackRelease('D3', '8n')));
      } else {
        this.$nextTick(() => this.tone.uiSynth.triggerAttackRelease('D3', '8n'));
      }
    },
  },
}
</script>

<style></style>
