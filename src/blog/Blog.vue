<template>
    <canvas ref="canvas" class="inset-0 w-screen h-screen">
    </canvas>
</template>

<script>
  import {Emulator} from '../Emulator/Emulator';

  export default {
    name: "Blog",
    mounted(): void {
      this.emulator = null;

      new FontFace('VGA', 'url(fonts/PxPlus_IBM_VGA9.ttf')
        .load()
        .then(() => this.emulator = new Emulator(this.$refs['canvas']));
    },
    beforeDestroy(): void {
      if(this.emulator)
        delete this.emulator;
    },
  }
</script>

<style scoped>

</style>

