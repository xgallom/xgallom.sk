<template>
  <div class="w-screen h-dvh select-none inset-0 flex flex-col items-center">
    <div
      class="absolute w-screen h-dvh font-vga text-base 3xl:text-3xl inset-0 flex flex-col items-stretch xl:items-center justify-center bg-black">
      <div class="flex flex-col w-full 3xl:container h-full items-stretch lg:items-center">
        <button ref="header-bar"
          class="appearance-none cursor-pointer focus:outline-none mt-4 md:mt-12 flex-none flex flex-col items-center p-2 pl-6 pr-6"
          :class="{
            'anim-color': hasColorAnim,
            'text-magenta': !hasActiveMenuEntry,
            'text-white': hasActiveMenuEntry,
          }" @mousedown="startGlitch(0)" @touchstart="startGlitch(0)" @mouseup="stopGlitch" @touchend="stopGlitch"
          @click="redirect('/')">
          <span class="text-xl 3xl:text-6xl">
            Milan Gallo
          </span>
          <span>
            Portfolio
          </span>
        </button>

        <div
          class="flex flex-col lg:flex-row w-full grow items-stretch md:items-center lg:items-center justify-start lg:justify-start pt-4 md:pt-12 lg:pt-0 lg:pb-12 lg:my-24 3xl:my-0 lg:self-start">
          <div
            class="flex flex-col lg:ml-24 xl:ml-48 3xl:ml-12 border-0 anim-width-color box-border w-screen md:w-[24rem] 3xl:w-4xl">
            <div class="flex flex-col">
              <template v-for="(link, n) in links">
                <PortfolioLink v-if="link.type === 'link' && maxScreen[link.maxScreen]" :menuEntry="n"
                  :activeMenuEntry="activeMenuEntry" :url="link.url" :title="link.title" @redirect="redirect"
                  @setMenuEntry="setMenuEntry" @unsetMenuEntry="unsetMenuEntry" />
                <PortfolioItem v-if="link.type === 'portfolio'" :displayContent="!ifScreen.md" :menuEntry="n"
                  :activeMenuEntry="activeMenuEntry" :url="link.url" :title="link.title" :img="link.img"
                  :text="link.text" :imgClass="link.imgMobile" @redirect="redirect" @setMenuEntry="setMenuEntry"
                  @unsetMenuEntry="unsetMenuEntry" />
              </template>
            </div>
          </div>
          <div
            class="hidden relative md:flex md:w-full lg:mr-12 xl:mr-24 lg:pl-12 md:pt-20 md:pb-12 lg:py-0 grow flex flex-col items-center text-white">
            <div class="opacity-0 flex flex-col">
              <div class="p-2">?</div>
              <div class="h-144 3xl:h-240"></div>
            </div>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-magenta anim-opacity-fast" :class="{
                'opacity-100': activeMenuEntry === -1,
                'opacity-0 pointer-events-none': activeMenuEntry !== -1,
              }">
                Select an item from the portfolio.
              </span>
            </div>

            <template v-for="(link, n) in links">
              <PortfolioContent v-if="link.type === 'portfolio'" :menuEntry="n" :activeMenuEntry="activeMenuEntry"
                :url="link.url" :title="link.title" :img="link.img" :text="link.text" :imgClass="link.imgDesktop" />
            </template>
          </div>
        </div>

        <div class="flex-none flex items-center justify-center">
          <a href="https://github.com/xgallom/xgallom.sk" target="_blank" class="p-2 lg:underline hover:no-underline"
            :class="{
              'anim-color': hasColorAnim,
              'text-magenta': !hasActiveMenuEntry,
              'text-white': hasActiveMenuEntry,
            }">
            Copyright © Milan Gallo, 2025
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import PortfolioContent from '/src/ui/PortfolioContent.vue';
import PortfolioItem from '/src/ui/PortfolioItem.vue';
import PortfolioLink from '/src/ui/PortfolioLink.vue';
import { Links } from './Content.ts';

let Tone;

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
    const activeMenuEntry = window.localStorage.getItem('xgallom-sk-portfolio-active-menu-entry');
    return {
      loading: 3,
      loaded: true,
      running: false,

      hasColorAnim: false,
      activeMenuEntry: activeMenuEntry ? Number(activeMenuEntry) : -1,
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
    maxScreen() {
      return {
        sm: this.activeScreen < 1,
        md: this.activeScreen < 2,
        lg: this.activeScreen < 3,
        xl: this.activeScreen < 4,
      };
    },
    links() {
      return Links;
    },
  },

  watch: {
    activeMenuEntry() {
      window.localStorage.setItem('xgallom-sk-portfolio-active-menu-entry', `${this.activeMenuEntry}`);
    },
  },

  methods: {
    redirect(url: string, target: string | undefined): void {
      // if (!this.ifScreen.md)
      //   this.activeMenuEntry = -1;
      if (target)
        window.open(url, target);
      else
        window.location = url;
    },

    setMenuEntry(menuEntry: number): void {
      this.activeMenuEntry = menuEntry;
    },

    unsetMenuEntry(): void {
      this.activeMenuEntry = -1;
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

      if (this.activeMenuEntry !== -1 && e.key === 'Enter') {
        const link = this.links[this.activeMenuEntry];
        this.redirect(link.url, '_blank');
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
        this.startSound(() => this.$nextTick(() => this.tone.uiSynth.triggerAttackRelease('D3', '16n')));
      } else {
        this.$nextTick(() => this.tone.uiSynth.triggerAttackRelease('D3', '16n'));
      }
    },
  },
}
</script>

<style></style>
