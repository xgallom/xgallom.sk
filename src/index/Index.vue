<template>
  <div class="w-screen h-dvh select-none inset-0">
    <div class="absolute w-screen h-dvh inset-0">
      <div id="app" ref="app" class="w-screen h-dvh absolute inset-0">
      </div>

      <div
        class="absolute w-screen h-dvh font-vga text-base 3xl:text-3xl inset-0 flex flex-col items-stretch xl:items-center justify-center anim-opacity z-20"
        :class="{ 'opacity-0': !hasUi }">
        <div class="flex flex-col w-full 3xl:container h-full items-stretch lg:items-center">
          <button ref="header-bar"
            class="appearance-none cursor-pointer focus:outline-none mt-4 md:mt-12 flex-none flex flex-col items-center p-2 pl-6 pr-6"
            :class="{
              'anim-color': hasColorAnim,
              'text-magenta': !isGlitching && !hasActiveMenuEntry,
              'text-white': isGlitching || hasActiveMenuEntry,
            }" @mousedown="startGlitch" @touchstart="startGlitch" @mouseup="stopGlitch" @touchend="stopGlitch">
            <span class="text-xl 3xl:text-6xl">
              Milan Gallo
            </span>
            <span>
              Physics, Music, Software Development
            </span>
          </button>

          <div
            class="flex flex-col w-full grow items-stretch md:items-center lg:items-start items-center justify-start lg:justify-center pt-4 md:pt-12 lg:pt-0 lg:pb-12 lg:my-24 lg:self-start">
            <div class="flex flex-col lg:ml-24 xl:ml-48 3xl:ml-12 border-0 anim-width-color box-content" :class="{
              'w-0': !hasMenu,
              'w-screen md:w-[24rem]': hasMenu,
              'anim-width': hasMenuAnim,
            }">
              <div class="flex flex-col">
                <template v-for="(link, n) in links">
                  <MenuItem v-if="link.screen === undefined || ifScreen[link.screen]" :isGlitching="isGlitching"
                    :hasColorAnim="hasColorAnim" :menuEntry="n" :activeMenuEntry="activeMenuEntry" :url="link.url"
                    :title="link.title" :suffix="link.suffix" @redirect="redirect(link.url, link.target)"
                    @setMenuEntry="setMenuEntry" @unsetMenuEntry="unsetMenuEntry" />
                </template>
              </div>
            </div>
          </div>

          <div class="flex-none flex items-center justify-center">
            <a href="https://github.com/xgallom/xgallom.sk" target="_blank" class="p-2 lg:underline hover:no-underline"
              :class="{
                'anim-color': hasColorAnim,
                'text-magenta': !isGlitching && !hasActiveMenuEntry,
                'text-white': isGlitching || hasActiveMenuEntry,
              }">
              Copyright © Milan Gallo, 2025
            </a>
          </div>
        </div>
      </div>
    </div>


    <div v-if="!running" class="absolute inset-0 font-vga z-20 bg-black text-white">
      <div class="absolute flex inset-0 items-center justify-center content-center bg-transparent">
        <div class="anim-opacity-fast" :class="{ 'opacity-0': loading <= 0, 'opacity-100': loading > 0 }"
          style="width: 5.75rem;">
          Loading{{ '.'.repeat(Math.max(this.loading - 1, 0)) }}
        </div>
      </div>
      <!--
      <div v-if="!loading" class="absolute flex inset-0 items-center justify-center content-center bg-transparent">
        <button class="p-4 pt-2 pb-2 button anim-color-opacity-fast" :class="{ 'opacity-0': loaded }" @click="run">
          Enter xgallom.sk
        </button>
      </div>
-->
    </div>
  </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import MenuItem from '/src/ui/MenuItem.vue';
import { Links } from './Content.ts';

const TimeToMenu = 0;
const TimeToUI = 0.25;

let Index3D: {
  TimeToFadeIn: number,
  TimeToFadeOut: number,
  Exposure: number,
  TimeToRotateIn: number,
  RotationSpeed: number,
  TimeToReady: number,
  TimeToLoad: number,

  TimeToTranslate: number,
  TranslationPosition: { x: number, y: number, z: number },

  Ease: (number) => number,
  InvertEase: (number) => number,

  Index: Class,
};
let Tone;

export default {
  name: 'Index',
  components: { MenuItem },
  mounted(): void {
    this.cancelGlitchHandler = null;
    this.loadingHandler = null;
    this.fadeInHandler = null;
    this.updateViewport();

    if (window.localStorage.getItem('xgallom-sk-is-running')) {
      this.loading = 0;
    } else {
      this.loading = 4;
    }

    const loadingStartedTime = performance.now();
    import('/src/3D/Index.ts').then(imported => {
      Index3D = imported;

      import('tone').then(imported => {
        Tone = imported;

        this.render = new Index3D.Index(this.$refs.app, this.activeScreen);
        console.log(this.render);
        this.$nextTick(() => {
          window.addEventListener('resize', this.resized, false);
          window.addEventListener('keydown', this.onKeyDown, false);
        });

        if (window.localStorage.getItem('xgallom-sk-is-running')) {
          // this.loaded = true;
          this.running = true;
          this.hasUi = true;
          this.hasMenu = true;
          this.render.fade(1.5, Index3D.Ease);
          this.render.rotateIn(Index3D.RotationSpeed, 0.33);
          this.render.startRunning(this.activeScreen);
        } else {
          this.$nextTick(() => {
            clearTimeout(this.loadingHandler);
            this.loadingHandler = null;
            this.loading = 0;
            this.run();
            // setTimeout(() => {
              // this.loaded = false;
            // }, 350);
          });
        }
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
      // loaded: true,
      running: false,

      hasUi: false,
      hasMenu: false,
      hasGlitching: false,
      hasMenuAnim: false,
      hasColorAnim: false,
      activeMenuEntry: -1,
      windowWidth: window.innerWidth,
      tone: markRaw({
        uiSynth: null,
        noise: null,
      }),
    };
  },

  computed: {
    isGlitching(): boolean {
      return this.hasMenu && this.hasUi && this.hasGlitching;
    },
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
      return Links.filter((link) => link.screen === undefined || this.ifScreen[link.screen]);
    },
  },

  watch: {
    loading(): void {
      if (this.loading) {
        this.loadingHandler = setTimeout(() => {
          this.loading = this.loading % 4 + 1;
        }, 66);
      }
    },
  },

  methods: {
    run(): void {
      window.localStorage.setItem('xgallom-sk-is-running', 'true');
      // this.startSound(() => {
      //   this.loaded = true;
      //   this.clickSound();

      // setTimeout(() => {
      this.running = true;
      this.hasMenuAnim = true;
      this.$nextTick(() => this.render.run(this.activeScreen, () =>
        setTimeout(() => {
          this.hasUi = true;
          setTimeout(() => {
            this.hasMenu = true;
            setTimeout(() => this.hasMenuAnim = false, 1500);
          }, TimeToMenu * 1000);
        }, TimeToUI * 1000)
      ));
      // }, 350);
      // });
    },

    redirect(url: string, target: string | undefined): void {
      this.activeMenuEntry = -1;
      this.render.animateColor(Index3D.TimeToAnimateColor, t => t * t, 0, () => this.hasColorAnim = false);
      if (target)
        window.open(url, target);
      else
        window.location = url;
    },

    setMenuEntry(menuEntry: number): void {
      this.hasColorAnim = true;
      this.activeMenuEntry = menuEntry;
      clearTimeout(this.fadeInHandler);
      this.fadeInHandler = null;
      this.render.animateColor(Index3D.TimeToAnimateColor, t => t * t, 1);
    },

    unsetMenuEntry(): void {
      if (this.hasUi)
        this.fadeInHandler = setTimeout(() => {
          this.activeMenuEntry = -1;
          this.render.animateColor(Index3D.TimeToAnimateColor, t => t * t, 0, () => this.hasColorAnim = false);
        }, 50);
    },

    onKeyDown(e): void {
      for (let n = 0; n < this.links.length; ++n) {
        const link = this.links[n];
        if (e.key === n.toString()) this.redirect(link.url, link.target);
      }
    },

    resized(): void {
      this.windowWidth = window.innerWidth;
      this.$nextTick(() => {
        this.updateViewport();
        this.render.resize(this.$refs.app, this.activeScreen);
      });
    },

    updateViewport(): void {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },

    startGlitch(): void {
      if (!this.tone.noise) this.startSound();
      this.$nextTick(() => {
        if (this.hasMenu && this.hasUi) {
          this.hasGlitching = true;
          this.render.glitch(true);
          this.render.glitchColor(true);
          this.glitchSound(true);
        }
      });
    },

    stopGlitch(): void {
      this.hasGlitching = false;
      this.render.glitch(false);
      this.render.glitchColor(false);
      this.glitchSound(false);
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

        this.tone.noise = new Tone.Noise('white')
          .toDestination();
        this.tone.noise.volume.value = -24;
        this.tone.noise.mute = true;
        this.tone.noise.start();

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

    glitchSound(isGlitching: boolean): void {
      if (!this.tone.noise) {
        this.startSound(() => this.$nextTick(() => {
          this.tone.noise.mute = !isGlitching;
          this.tone.noise.start();
        }));
      } else {
        this.$nextTick(() => {
          this.tone.noise.mute = !isGlitching;
          this.tone.noise.start();
        });
      }
    }
  },
}
</script>

<style></style>
