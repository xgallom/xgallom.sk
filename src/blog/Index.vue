<template>
  <!--TODO: cursor-none? -->
  <canvas ref="canvas" class="inset-0 w-screen h-screen">
  </canvas>
</template>

<script lang="ts">
import { EmulatorInterface } from '../Emulator/EmulatorInterface';
import { Content } from './Content';

let Emulator: Class<EmulatorInterface>;

export default {
  name: "Blog",
  mounted(): void {
    this.emulator = null;
    new FontFace('VGA', 'url(/fonts/PxPlus_IBM_VGA9.ttf')
      .load()
      .then(() => {
        import('../Emulator/Emulator.ts').then(imported => {
          Emulator = imported.Emulator;
          this.run();
        })
      });
  },
  beforeDestroy(): void {
    if (this.emulator) {
      this.emulator.deinitialize();
      delete this.emulator;
    }
  },
  methods: {
    run(): void {
      this.emulator = new Emulator(this.$refs['canvas']);
      this.emulator.run(Content);
    },
  },
}
</script>

<style scoped></style>
