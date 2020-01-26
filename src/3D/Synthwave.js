// @flow

import * as Three from 'three';
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";

export class Synthwave {
    constructor(container: Element) {
        this.scene = new Three.Scene();
        this.camera = new Three.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            1,
            1000
        );
        this.camera.position.set(0, 0, 0);
        this.camera.lookAt(0, 0, 1);

        this.clock = new Three.Clock();

        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.toneMapping = Three.ReinhardToneMapping;
        container.appendChild(this.renderer.domElement);

        const x = 10, y = Math.sqrt(0.5) * x;
        let material = new Three.LineBasicMaterial({color: 0x8800ff});
        for(let z = 0; z <= 100; z += 10) {
            let geometry = new Three.Geometry();
            geometry.vertices.push(new Three.Vector3(-x, -y, z));
            geometry.vertices.push(new Three.Vector3(0, y, z));
            geometry.vertices.push(new Three.Vector3(x, -y, z));
            geometry.vertices.push(new Three.Vector3(-x, -y, z));

            this.scene.add(new Three.Line(geometry, material));
        }

        this.renderScene = new RenderPass(this.scene, this.camera);
        this.bloomPass = new UnrealBloomPass(
            new Three.Vector2(container.clientWidth, container.clientHeight),
            2.5,
            0,
            0
        );

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderScene);
        this.composer.addPass(this.bloomPass);

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        this.composer.render(delta);
    }

    resize(container: Element): void {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.composer.setSize(container.clientWidth, container.clientHeight);
    }
}
