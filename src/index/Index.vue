<template>
    <div class="w-screen h-screen select-none inset-0">
        <div class="absolute w-screen h-screen inset-0">
            <div id="app"
                 ref="app"
                 class="w-screen h-screen absolute inset-0"
            >
            </div>

            <div class="absolute w-screen h-screen font-vga inset-0 flex flex-col items-stretch lg:items-center anim-opacity z-20"
                 :class="{'opacity-0': !hasUi}"
            >
                <button
                  ref="header-bar"
                  class="appearance-none focus:outline-none mt-4 md:mt-12 flex flex-col items-center p-2 pl-6 pr-6"
                  :class="{
                    'anim-color': hasColorAnim,
                    'text-magenta': !isGlitching && !hasActiveMenuEntry,
                    'text-white': isGlitching || hasActiveMenuEntry,
                  }"
                  @mousedown="startGlitch(0)"
                  @touchstart="startGlitch(0)"
                  @mouseup="stopGlitch"
                  @touchend="stopGlitch"
                >
                    <span class="text-xl">
                        Milan Gallo
                    </span>
                    <span>
                        physics, software development<span class="hidden lg:inline">, hella b*tches</span>
                    </span>
                </button>

        <div class="flex flex-col w-screen flex-grow items-stretch md:items-center lg:items-start justify-start lg:justify-center pt-4 md:pt-12 lg:pt-0 lg:pb-12 lg:my-24 lg:self-start">
                    <div class="flex flex-col lg:ml-24 xl:ml-48 border-0 anim-width-color box-content"
                         :class="{
                           'w-0': !hasMenu, 
                           'w-screen md:w-menu': hasMenu,
                           'anim-width': hasMenuAnim,
                         }"
                    >
                        <div class="flex flex-col">
                            <MenuItem v-if="ifScreen.lg"
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
                            <MenuItem :isGlitching="isGlitching"
                                      :hasColorAnim="hasColorAnim"
                                      :menuEntry="1"
                                      :activeMenuEntry="activeMenuEntry"
                                      url="https://github.com/xgallom/zengine"
                                      title="Zengine"
                                      @redirect="redirect"
                                      @setMenuEntry="setMenuEntry"
                                      @unsetMenuEntry="unsetMenuEntry"
                                      external
                            />
                            <MenuItem :isGlitching="isGlitching"
                                      :hasColorAnim="hasColorAnim"
                                      :menuEntry="2"
                                      :activeMenuEntry="activeMenuEntry"
                                      url="https://github.com/xgallom/xos/tree/86_64-elf-zig"
                                      title="XOS"
                                      @redirect="redirect"
                                      @setMenuEntry="setMenuEntry"
                                      @unsetMenuEntry="unsetMenuEntry"
                                      external
                            />
                            <MenuItem :isGlitching="isGlitching"
                                      :hasColorAnim="hasColorAnim"
                                      :menuEntry="3"
                                      :activeMenuEntry="activeMenuEntry"
                                      url="https://www.github.com/xgallom/xgallom.sk"
                                      title="xgallom.sk"
                                      @redirect="redirect"
                                      @setMenuEntry="setMenuEntry"
                                      @unsetMenuEntry="unsetMenuEntry"
                                      external
                            />
                            <MenuItem :isGlitching="isGlitching"
                                      :hasColorAnim="hasColorAnim"
                                      :menuEntry="4"
                                      :activeMenuEntry="activeMenuEntry"
                                      url="https://www.github.com/xgallom"
                                      title="github"
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
                     :class="{
                       'anim-color': hasColorAnim,
                       'text-magenta': !isGlitching && !hasActiveMenuEntry,
                       'text-white': isGlitching || hasActiveMenuEntry,
                     }"
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
                    Enter xgallom.sk
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

          this.render = new Index3D.Index(this.$refs.app, this.activeScreen);
          this.$nextTick(() => window.addEventListener('resize', this.resized, false));

          if (window.localStorage.getItem('xgallom-sk-is-running')) {
            this.loaded = true;
            this.running = true;
            this.hasUi = true;
            this.hasMenu = true;
            this.render.fade(1.5, Index3D.Ease);
            this.render.rotateIn(Index3D.RotationSpeed, 0.33);
            this.render.startRunning(this.activeScreen);
          } else {
              let remainingTime = Math.max(1500 - Math.round(performance.now() - loadingStartedTime), 0);
              setTimeout(() => {
                clearTimeout(this.loadingHandler);
                this.loadingHandler = null;
                this.loading = 0;
                setTimeout(() => this.loaded = false, 350);
              }, remainingTime);
            }
        });
      });
    },

    beforeDestroy(): void {
      this.noiseVolume.mute = true;
      this.render.destroy();
      window.removeEventListener('resize', this.resized, false);
      window.addEventListener('popstate', this.onPopState, false);
      setInterval(() => onPopState(), 150);
    },

    data() {
      return {
        loading: 3,
        loaded: true,
        running: false,

        hasUi: false,
        hasMenu: false,
        hasGlitching: false,
        hasMenuAnim: false,
        hasColorAnim: false,
        activeMenuEntry: -1,
        windowWidth: window.innerWidth,
        uiSynth: null,
        noiseVolume: null,
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
        window.localStorage.setItem('xgallom-sk-is-running', 'true');
        this.startSound(() => {
          this.loaded = true;
          this.clickSound();

          setTimeout(() => {
            this.running = true;
            this.hasMenuAnim =  true;
            this.$nextTick(() => this.render.run(this.activeScreen, () =>
                setTimeout(() => {
                  this.hasUi = true;
                  setTimeout(() => {
                    this.hasMenu = true;
                    setTimeout(() => this.hasMenuAnim = false, 1500);
                  }, TimeToMenu * 1000);
                }, TimeToUI * 1000)
              )
            );
          }, 350);
        });
      },

      redirect(url: string): void {
        this.clickSound();
        this.activeMenuEntry = -1;
        setTimeout(() => window.location = url, 330);
      },

      setMenuEntry(menuEntry: number): void {
        this.hasColorAnim = true;
        this.activeMenuEntry = menuEntry;
        clearTimeout(this.fadeInHandler);
        this.fadeInHandler = null;
        this.render.animateColor(1.5, t => t * t, 1);
      },

      unsetMenuEntry(): void {
        if (this.hasUi)
          this.fadeInHandler = setTimeout(() => {
            this.activeMenuEntry = -1;
            this.render.animateColor(1.5, t => t * t, 0, () => this.hasColorAnim = false);
          }, 50);
      },

      resized(): void {
        this.windowWidth = window.innerWidth;
        this.$nextTick(() => {
          this.updateViewport();
          this.render.resize(this.$refs.app, this.activeScreen);
        });
      },

      onPopState(): void {
        console.log('back');
        this.loaded = true;
        this.running = true;
        this.hasUi = true;
        this.hasMenu = true;
        this.render.fade(1.5, Index3D.Ease);
        this.render.rotateIn(Index3D.RotationSpeed, 0.33);
        this.render.startRunning(this.activeScreen);
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

      startSound(callback: ?() => void): void {
        Tone.start().then(() => {
          this.uiSynth = new Tone.Synth({
            oscillator: {
              type: 'pwm',
            },
            envelope: {
              attack: 0.005,
              decay: 0.15,
              sustain: 0.001,
              release: 0.001,
            }
          });
          let uiSynthVolume = new Tone.Volume({volume: -12, mute: false});
          this.uiSynth.chain(uiSynthVolume, Tone.Master);

          let noise = new Tone.Noise('white');
          this.noiseVolume = new Tone.Volume({volume: -24, mute: true});
          noise.chain(/*autoFilter,*/ this.noiseVolume, Tone.Master);
          noise.start();

          if (callback) callback();
        });
      },

      clickSound(): void {
        if (!this.uiSynth) {
          this.startSound(() => this.$nextTick(() => this.uiSynth.triggerAttackRelease('D3', '8n')));
        } else {
          this.$nextTick(() => this.uiSynth.triggerAttackRelease('D3', '8n'));
        }
      },

      glitchSound(isGlitching: boolean): void {
        if (!this.uiSynth && isGlitching) {
          this.startSound(() => this.$nextTick(() => this.noiseVolume.set('mute', !isGlitching)));
        } else {
          this.$nextTick(() => this.noiseVolume.set('mute', !isGlitching));
        }
      }
    },
  }
</script>

<style>
</style>

