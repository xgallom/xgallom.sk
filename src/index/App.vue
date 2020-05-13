<template>
    <div class="w-screen h-screen">
        <div id="app"
             ref="app"
             class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0"
             style="z-index: -10;"
        >
        </div>
        <div class="absolute w-screen h-screen font-mono text-magenta top-0 left-0 right-0 bottom-0 flex flex-col items-center anim-opacity"
             :class="{'opacity-0': !hasUi}"
        >
            <div class="mt-12 flex flex-col items-center p-2 pl-6 pr-6 bg-lblue">
                <div class="text-2xl">
                    Milan Gallo
                </div>
                <div class="text-lg">
                    xos, software development, hella bitches
                </div>
            </div>

            <div class="flex flex-row w-screen flex-grow items-start justify-start pt-12 pb-12 mt-24 mb-24 self-start">
                <div class="flex flex-row anim-width anim-height ml-24 bg-lblue text-magenta"
                     :class="{'w-0': !hasMenu, 'w-64': hasMenu}"
                >
                    <div class="flex flex-col">
                        <button class="w-64 menu-item"
                                @click="redirect('blog')"
                        >
                            XOS Development Blog
                        </button>
                        <button class="w-64 menu-item"
                                @click="redirect('https://www.github.com/xgallom/xos')"
                        >
                            XOS Github
                        </button>
                        <button class="w-64 menu-item"
                                @click="redirect('https://www.github.com/xgallom')"
                        >
                            Github Page
                        </button>
                    </div>
                </div>
            </div>

            <div class="mb-0 text-magenta flex items-center justify-center">
                Copyright © Milan Gallo, 2020
            </div>
        </div>
    </div>

</template>

<script>
  import {TimeToFadeOut, Ease, Index, TranslationPosition, TimeToTranslate} from '../3D/Index';
  import '../assets/index.css';
  import {InvertEase} from '../3D/Interpolation';

  const TimeToMenu = 0;
  const TimeToUI = 0.5;

  export default {
    name: 'app',

    mounted(): void {
      this.updateViewport();

      this.render = new Index(this.$refs.app, () =>
        setTimeout(() => {
          this.hasUi = true;
          setTimeout(() => this.hasMenu = true, TimeToMenu * 1000);
        }, TimeToUI * 1000)
      );

      this.$nextTick(() => window.addEventListener('resize', this.resized, false));
    },

    beforeDestroy(): void {
      this.render.destroy();
      window.removeEventListener('resize', this.resized, false);
    },

    data() {
      return {
        hasUi: false,
        hasMenu: false,
      };
    },

    methods: {
      redirect(url: string): void {
        this.hasUi = false;
        this.render.fade(TimeToFadeOut, InvertEase);
        this.render.translate(TranslationPosition, TimeToTranslate, InvertEase, () => window.location = url);
      },

      resized(): void {
        this.updateViewport();
        this.render.resize(this.$refs.app);
      },

      updateViewport(): void {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      },
    },
  }
</script>

<style>
</style>

