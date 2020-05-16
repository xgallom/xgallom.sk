<template>
    <div class="w-screen h-screen select-none inset-0">
        <div class="absolute w-screen h-screen inset-0">
            <div id="app"
                 ref="app"
                 class="w-screen h-screen absolute inset-0"
            >
            </div>

            <div class="absolute w-screen h-screen font-vga inset-0 flex flex-col items-center anim-opacity z-20"
                 :class="{'opacity-0': !hasUi}"
            >
                <div ref="header-bar"
                     class="mt-12 flex flex-col items-center p-2 pl-6 pr-6"
                     :class="{/*'bg-black': !isGlitching, 'bg-white': isGlitching,*/
                  'anim-color': hasColorAnim,
                 'text-magenta': !isGlitching,
                 /*'text-white': isGlitching,*/
                 'text-white': isGlitching && activeMenuEntry === -1,
                 'text-black': isGlitching && activeMenuEntry !== -1,
                 /*'border-dmagenta': !isGlitching, 'border-white': isGlitching,*/
                 }"

                     @mouseenter="startGlitch(0)"
                     @mouseleave="stopGlitch"
                     @mousedown="stopGlitch"
                >
                    <div class="text-xl">
                        Milan Gallo
                    </div>
                    <div>
                        physics, software development, hella bitches
                    </div>
                </div>

                <div class="flex flex-row w-screen flex-grow items-center justify-start pb-12 mt-24 mb-24 self-start">
                    <div class="flex flex-row ml-24 xl:ml-48 border-0 anim-width-color box-content"
                         :class="{'w-0': !hasMenu, 'w-menu': hasMenu,
                     /*'border-black': !isGlitching, 'border-white': isGlitching,*/
                     }"
                    >
                        <div class="flex flex-col">
                            <MenuItem ref="menu-0"
                                      :isGlitching="isGlitching"
                                      :hasColorAnim="hasColorAnim"
                                      :menuEntry="0"
                                      :activeMenuEntry="activeMenuEntry"
                                      url="blog"
                                      title="Development Blog"

                                      @redirect="redirect"
                                      @setMenuEntry="setMenuEntry"
                                      @unsetMenuEntry="unsetMenuEntry"
                            />
                            <MenuItem ref="menu-1"
                                      :isGlitching="isGlitching"
                                      :hasColorAnim="hasColorAnim"
                                      :menuEntry="1"
                                      :activeMenuEntry="activeMenuEntry"
                                      url="https://www.github.com/xgallom/xos"
                                      title="XOS Repository"

                                      @redirect="redirect"
                                      @setMenuEntry="setMenuEntry"
                                      @unsetMenuEntry="unsetMenuEntry"

                                      external
                            />
                            <MenuItem ref="menu-2"
                                      :isGlitching="isGlitching"
                                      :hasColorAnim="hasColorAnim"
                                      :menuEntry="2"
                                      :activeMenuEntry="activeMenuEntry"
                                      url="https://www.github.com/xgallom"
                                      title="Github"

                                      @redirect="redirect"
                                      @setMenuEntry="setMenuEntry"
                                      @unsetMenuEntry="unsetMenuEntry"

                                      external
                            />
                        </div>
                    </div>
                </div>

                <div ref="footer-bar"
                     class="mb-1 flex items-center justify-center"
                     :class="{'anim-color': hasColorAnim,
                                 'text-magenta': !isGlitching,
                                 /*'text-white': isGlitching,*/
                                 'text-white': isGlitching && activeMenuEntry === -1,
                                 'text-black': isGlitching && activeMenuEntry !== -1}"
                >
                    Copyright © Milan Gallo, 2020
                </div>
            </div>
        </div>


        <div v-if="!running"
             class="absolute inset-0 font-vga z-20 bg-black"
        >
            <div class="absolute flex inset-0 items-center justify-center content-center bg-transparent">
                <div class="anim-opacity-fast"
                     :class="{'opacity-0': loading <= 0}"
                     style="width: 5.75rem;"
                >
                    Loading{{'.'.repeat(Math.max(this.loading - 1, 0))}}
                </div>
            </div>
            <div v-if="!loading"
                 class="absolute flex inset-0 items-center justify-center content-center bg-transparent">
                <button class="p-4 pt-2 pb-2 button anim-color-opacity-fast"
                        :class="{'opacity-0': loaded}"

                        @click="run"
                >
                    Enter the Matrix
                </button>
            </div>
        </div>
    </div>
</template>

<script>
  import '../assets/index.css';
  import MenuItem from './MenuItem';

  const TimeToMenu = 0;
  const TimeToUI = 0.25;

  type Index3DInterface = {
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

  let Index3D: Index3DInterface;
  let Tone;

  export default {
    name: 'Index',
    components: {MenuItem},
    mounted(): void {
      this.cancelGlitchHandler = null;
      this.loadingHandler = null;
      this.fadeInHandler = null;


      this.updateViewport();

      this.loading = 4;

      const loadingStartedTime = performance.now();

      import('../3D/Index').then(imported => {
        Index3D = imported;

        import('tone').then(imported => {
          Tone = imported;

          this.render = new Index3D.Index(this.$refs.app);
          this.$nextTick(() => window.addEventListener('resize', this.resized, false));

          let remainingTime = Math.max(1500 - Math.round(performance.now() - loadingStartedTime), 0);

          setTimeout(() => {
            clearTimeout(this.loadingHandler);
            this.loadingHandler = null;
            this.loading = 0;
            setTimeout(() => this.loaded = false, 350);
          }, remainingTime);
        });
      });
    },

    beforeDestroy(): void {
      this.noiseVolume.mute = true;
      this.render.destroy();
      window.removeEventListener('resize', this.resized, false);
    },

    data() {
      return {
        loading: 3,
        loaded: true,
        running: false,

        hasUi: false,
        hasMenu: false,
        hasGlitching: false,
        hasColorAnim: false,
        activeMenuEntry: -1,
      };
    },

    computed: {
      isGlitching(): boolean {
        return this.hasMenu && this.hasUi && this.hasGlitching;
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

      isGlitching(): void {
        this.render.glitch(this.isGlitching);
        this.render.glitchColor(this.isGlitching);
        this.glitchSound(this.isGlitching);
      }
    },

    methods: {
      run(): void {
        Tone.start().then(() => {
          this.uiSynth = new Tone.Synth({
            oscillator: {
              type: "pwm",
            },
            envelope: {
              attack: 0.005,
              decay: 0.15,
              sustain: 0.001,
              release: 0.001,
            }
          });

          let uiSynthVolume = new Tone.Volume({volume: -3, mute: false});

          this.uiSynth.chain(uiSynthVolume, Tone.Master);

          this.clickSound();

          this.loaded = true;

          setTimeout(() => {
            this.running = true;
            this.$nextTick(() => this.render.run(() =>
                setTimeout(() => {
                  let noise = new Tone.Noise("pink");

                  this.noiseVolume = new Tone.Volume({volume: -12, mute: true});

                  noise.chain(/*autoFilter,*/ this.noiseVolume, Tone.Master);
                  noise.start();


                  this.hasUi = true;
                  setTimeout(() => this.hasMenu = true, TimeToMenu * 1000);
                }, TimeToUI * 1000)
              )
            );
          }, 350);
        });
      },

      redirect(url: string): void {
        this.clickSound();

        this.hasUi = false;

        this.render.fade(Index3D.TimeToFadeOut, Index3D.InvertEase);
        this.render.translate(
          Index3D.TranslationPosition,
          Index3D.TimeToFadeOut,
          Index3D.InvertEase,
          () => window.location = url
        );
      },

      setMenuEntry(menuEntry: number): void {
        this.activeMenuEntry = menuEntry;

        clearTimeout(this.fadeInHandler);
        this.fadeInHandler = null;

        this.startGlitch();
      },

      unsetMenuEntry(): void {
        this.fadeInHandler = setTimeout(() => {
          this.hasColorAnim = true;
          this.hasGlitching = false;
          this.activeMenuEntry = -1;

          this.render.fade(0.33, t => t * t, () => this.hasColorAnim = false);
          this.render.glitchColor(false);
        }, 50);
      },

      resized(): void {
        this.updateViewport();
        this.render.resize(this.$refs.app);
      },

      updateViewport(): void {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      },

      startGlitch(killOff: number = 1, callback: ?() => void = null): void {
        this.hasGlitching = true;

        this.render.glitch(this.isGlitching);
        this.render.glitchColor(this.isGlitching);
        this.glitchSound(this.isGlitching);

        clearTimeout(this.cancelGlitchHandler);

        if (killOff)
          this.cancelGlitchHandler = setTimeout(() => {
            this.cancelGlitchHandler = null;
            this.render.glitch(false);
            this.render.glitchColor(this.isGlitching ? 2 : 0);
            this.glitchSound(false);

            if (callback)
              callback();
          }, killOff * Math.round(Math.random() * 400 + 400));
        else
          this.cancelGlitchHandler = null;
      },

      stopGlitch(): void {
        this.hasGlitching = false;
      },

      clickSound(): void {
        this.$nextTick(() => {
          this.uiSynth.triggerAttackRelease("D3", "8n");
        });
      },

      glitchSound(isGlitching: boolean): void {
        this.noiseVolume.set('mute', !isGlitching);
      }
    },
  }
</script>

<style>
</style>

