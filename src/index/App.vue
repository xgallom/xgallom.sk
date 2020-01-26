<template>
    <div id="app"
         ref="app"
         class="w-screen h-screen"
    >
    </div>
</template>

<script>
    import {Synthwave} from "../3D/Synthwave";

    export default {
        name: 'app',

        mounted(): void {
            this.synthwave = new Synthwave(this.$refs.app);
            this.$nextTick(() => window.addEventListener('resize', this.resized, false));
        },
        beforeDestroy(): void {
           window.removeEventListener('resize', this.resized, false);
        },
        methods: {
            resized() {
                this.synthwave.resize(this.$refs.app);
            },
        },
    }
</script>

<style>
</style>
