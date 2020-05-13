// @flow

import * as Three from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {XosLogo} from './XosLogo';

const TimeToExposure = 4;
const Exposure = 1;
const TimeToFullSpeed = 2.5;
const RotationSpeed = 12.5;
export const TimeToFadeIn = Math.max(TimeToExposure, TimeToFullSpeed);

const TimeToTranslate = 2;
const Translation = {
  x: 0,
  y: 8,
  z: 0,
};

export const TimeToFadeOut = 4;

const CubicBezier = (x1, y1, x2, y2) => t => {
  const
    rt = 1 - t,
    rt2 = rt * rt,

    t2 = t * t,
    t3 = t2 * t;

  const
    p1 = new Three.Vector2(x1, y1),
    p2 = new Three.Vector2(x2, y2),
    p3 = new Three.Vector2(1, 1);


  const curve =
    p1.multiplyScalar(3 * rt2 * t)
      .add(p2.multiplyScalar(3 * rt * t2))
      .add(p3.multiplyScalar(t3));

  return curve.y;
};

const ease = CubicBezier(0.25, 0.1, 0.25, 1);
const ease_in = CubicBezier(0.42, 0, 1, 1);

export class Index {
  constructor(container: Element) {
    this._createRenderer(container);

    this.scene = new Three.Scene();

    this._createCamera(container);
    this._createComposer(container);

    this.logo = XosLogo();
    this.scene.add(this.logo);

    this.clock = new Three.Clock();
    this.effectTime = 0;
    this._fadeIn();
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    Object.keys(this).map(key => this[key] = null);
  }

  _fadeIn() {
    const delta = this.clock.getDelta();
    this.effectTime += delta;

    let rotationSpeed;

    if (this.effectTime >= TimeToFadeIn) {
      this.animationFrameId = requestAnimationFrame(() => this._translate());

      this.renderer.toneMappingExposure = Exposure;
      rotationSpeed = RotationSpeed;

      this.effectTime = 0;
    }
    else {
      this.animationFrameId = requestAnimationFrame(() => this._fadeIn());


      const exposureValue = Math.min(this.effectTime / TimeToExposure, 1);
      const exposureInterpolation = ease(exposureValue);

      this.renderer.toneMappingExposure = Exposure * exposureInterpolation;


      const rotationValue = Math.min(this.effectTime / TimeToFullSpeed, 1);
      const rotationInterpolation = ease(rotationValue);

      rotationSpeed = RotationSpeed * rotationInterpolation;
    }

    this._updateRotation(delta, rotationSpeed);
    this.composer.render(delta);
  }

  _translate() {
    const delta = this.clock.getDelta();
    this.effectTime += delta;

    if (this.effectTime >= TimeToTranslate) {
      this.animationFrameId = requestAnimationFrame(() => this._animate());

      this.camera.position.set(Translation.x, Translation.y, -200 + Translation.z);

      this.effectTime = 0;
    }
    else {
      this.animationFrameId = requestAnimationFrame(() => this._translate());

      const translation = Math.min(this.effectTime / TimeToTranslate, 1);
      const translationInterpolation = ease(translation);

      this.camera.position.set(
        Translation.x * translationInterpolation,
        Translation.y * translationInterpolation,
        -200 + Translation.z * translationInterpolation
      );
    }

    this._updateRotation(delta, RotationSpeed);
    this.composer.render(delta);
  }

  _animate() {
    const delta = this.clock.getDelta();

    this.animationFrameId = requestAnimationFrame(() => this._animate());

    this._updateRotation(delta, RotationSpeed);
    this.composer.render(delta);
  }

  _fadeOut() {
    const delta = this.clock.getDelta();
    this.effectTime += delta;

    this.animationFrameId = requestAnimationFrame(() => this._fadeOut());


    const translation = Math.min(this.effectTime / TimeToFadeOut, 1);
    const translationInterpolation = 1 - ease(translation);

    this.camera.position.set(
      Translation.x * translationInterpolation,
      Translation.y * translationInterpolation,
      -200 + Translation.z * translationInterpolation
    );


    const exposureValue = Math.min(this.effectTime / TimeToFadeOut, 1);
    const exposureInterpolation = 1 - ease(exposureValue);

    this.renderer.toneMappingExposure = Exposure * exposureInterpolation;


    this._updateRotation(delta, RotationSpeed);
    this.composer.render(delta);
  }

  startFadeOut() {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = requestAnimationFrame(() => this._fadeOut());
  }

  _updateRotation(delta, rotationSpeed) {
    this.logo.rotateY(delta * rotationSpeed / (2 * Math.PI));
  }

  resize(container: Element): void {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.composer.setSize(container.clientWidth, container.clientHeight);
    this.bloomPass.resolution = new Three.Vector2(container.clientWidth, container.clientHeight);
  }

  _createRenderer(container) {
    this.renderer = new Three.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = Three.Uncharted2ToneMapping;
    this.renderer.toneMappingExposure = 0;

    container.appendChild(this.renderer.domElement);
  }

  _createCamera(container) {
    this.camera = new Three.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      1,
      250
    );
    this.camera.position.set(0, 0, -200);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(this.camera);
  }

  _createComposer(container) {
    this.renderScene = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(
      new Three.Vector2(container.clientWidth, container.clientHeight),
      1.5,
      0,
      0
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
  }
}

