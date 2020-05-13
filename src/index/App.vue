<template>
    <div class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 bg-lblue"
         style="z-index: -20;"
    >
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
  import {TimeToFadeIn, TimeToFadeOut, Index} from "../3D/Index";
  import '../assets/index.css';

  const TimeToMenu = 0;
  const TimeToUI = 0.5;

  export default {
    name: 'app',

    mounted(): void {
      this.render = new Index(this.$refs.app);
      this.$nextTick(() => window.addEventListener('resize', this.resized, false));

      setTimeout(() => {
        this.hasUi = true;

        setTimeout(() => this.hasMenu = true, TimeToMenu * 1000);
      }, (TimeToFadeIn + TimeToUI) * 1000);
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
        this.render.startFadeOut();
        setTimeout(() => window.location = url, TimeToFadeOut * 1000);
      },
      resized(): void {
        this.render.resize(this.$refs.app);
      },
    },
  }
</script>

<style>
</style>

