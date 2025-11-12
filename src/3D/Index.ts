import * as Three from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { AnimationComposer } from './AnimationComposer';
import { Ease } from './Interpolation';
import type { Interpolation } from './Interpolation';
import type { InterpolationAnimationCallback } from './InterpolationAnimation';
import { createInterpolationAnimation } from './InterpolationAnimation';
import { XosLogo } from './XosLogo';

type Translation = { x: number, y: number, z: number };

export const TimeToFadeIn = 4;
export const TimeToAnimateColor = 0.33;
export const TimeToFadeOut = 2.5;
export const Exposure = 1;
export const TimeToRotateIn = 2.5;
export const RotationSpeed = 12.5;
export const TimeToReady = Math.max(TimeToFadeIn, TimeToRotateIn);
export const TimeToLoad = 1;

export const TimeToTranslate = 2;
export const TranslationPosition = {
  [0]: { x: 0, y: 24, z: -240 },
  [1]: { x: 0, y: 24, z: -200 },
  [2]: { x: 0, y: 20, z: -200 },
  [3]: { x: 32, y: 8, z: -200 },
  [4]: { x: 32, y: 8, z: -200 },
};

export { Ease, InvertEase } from './Interpolation';

const MaterialColor = {
  [0]: 0xff57ff,
  [false]: 0xff57ff,
  [1]: 0xffffff,
  [true]: 0xffffff,
  [2]: 0x000000,
};

const BloomPassStrength = {
  [false]: 0.75,
  [true]: 0.75,
};

export class Index {
  animationComposer: AnimationComposer;
  camera: Three.PerspectiveCamera;
  composer: EffectComposer;
  renderer: Three.WebGLRenderer;
  scene: Three.Scene;
  material: Three.LineBasicMaterial;
  logo: Three.Group;

  _fade: number | null = null;
  _colorAnimation: number | null = null;
  _rotateIn: number | null = null;
  _translate: number | null = null;
  _rotation: number;


  constructor(container: Element, screen: number) {
    this._createRenderer(container);

    this.scene = new Three.Scene();

    this._createCamera(container, screen);
    this._createComposer(container);

    this.material = new Three.LineBasicMaterial({ color: MaterialColor[0] });
    this.logo = XosLogo(this.material);
    this.scene.add(this.logo);

    this.animationComposer = new AnimationComposer(this.composer);

    this._rotation = this.animationComposer.add((delta, context) => {
      const rotationDelta = delta * context.rotationSpeed / (2 * Math.PI);
      context.rotation += rotationDelta;

      this.logo.rotateY(rotationDelta);
      // this.rgbShiftPass.uniforms['amount'].value = 0.00125 * Math.abs(Math.sin(context.rotation));
    }, { rotationSpeed: 0, rotation: 0 });

    this.rgbShiftPass.uniforms['amount'].value = 0.00125;
    this.animationComposer.singleStep();
  }

  startRunning(screen?: number): void {
    if (screen !== undefined) {
      const position = TranslationPosition[screen];
      this.camera.position.setX(position.x);
      this.camera.position.setY(position.y);
    }
    this.animationComposer.restartClock();
    this.animationComposer.animate();
  }

  run(screen: number, callback?: InterpolationAnimationCallback): void {
    setTimeout(() => {
      this.rotateIn();
      this.fade(TimeToFadeIn, Ease, () => {
        this.translate(TranslationPosition[screen]);

        if (callback)
          callback();
      });
      this.startRunning();
    }, TimeToLoad * 1000);
  }

  destroy(): void {
    this.animationComposer.destroy();
    Object.keys(this).map(key => delete this[key]);
  }

  glitch(isGlitching: boolean): void {
    this.glitchPass.enabled = isGlitching;
    this.glitchBloomPass(isGlitching);
  }

  glitchColor(isGlitching: boolean | number): void {
    this.material.color.set(MaterialColor[isGlitching]);
  }

  glitchBloomPass(isGlitching: boolean): void {
    this.bloomPass.strength = BloomPassStrength[isGlitching];
  }

  fade(
    timeToFadeIn: number = TimeToFadeIn,
    interpolation: Interpolation = Ease,
    callback?: InterpolationAnimationCallback,
  ): void {
    this._fade = createInterpolationAnimation(
      timeToFadeIn,
      interpolation,
      (interpolatedValue, context) => {
        this.renderer.toneMappingExposure = Exposure * interpolatedValue;
      },
      () => {
        this._fade = null;
        if (callback) callback();
      },
      {},
      this._fade,
      this.animationComposer,
    );
  }

  animateColor(
    timeToAnimate: number = TimeToAnimateColor,
    interpolation: Interpolation = Ease,
    target: boolean | number,
    callback?: InterpolationAnimationCallback,
  ): void {
    const fromColor = this.material.color.clone();
    const toColor = new Three.Color(MaterialColor[target]);
    this._colorAnimation = createInterpolationAnimation(
      timeToAnimate,
      interpolation,
      (interpolatedValue, context) => {
        this.material.color.set(fromColor.lerp(toColor, interpolatedValue));
      },
      () => {
        this._colorAnimation = null;
        if (callback) callback();
      },
      {},
      this._colorAnimation,
      this.animationComposer,
    );
  }

  rotateIn(
    rotationSpeed: number = RotationSpeed,
    timeToRotateIn: number = TimeToRotateIn,
    interpolation: Interpolation = Ease,
    callback?: InterpolationAnimationCallback,
  ) {
    this._rotateIn = createInterpolationAnimation(
      timeToRotateIn,
      interpolation,
      (interpolatedValue, context) => {
        this.animationComposer.context(this._rotation).rotationSpeed = context.rotationSpeed * interpolatedValue;
      },
      () => {
        this._rotateIn = null;
        if (callback) callback();
      },
      { rotationSpeed: rotationSpeed },
      this._rotateIn,
      this.animationComposer,
    );
  }

  translate(
    translation: Translation,
    timeToTranslate: number = TimeToTranslate,
    interpolation: Interpolation = Ease,
    callback?: InterpolationAnimationCallback,
  ) {
    this._translate = createInterpolationAnimation(
      timeToTranslate,
      interpolation,
      (interpolatedValue, context) => {
        this.camera.position.setX(context.translation.x * interpolatedValue);
        this.camera.position.setY(context.translation.y * interpolatedValue);
      },
      () => {
        this._translate = null;
        if (callback) callback();
      },
      { translation: translation },
      this._translate,
      this.animationComposer,
    );
  }

  resize(container: Element, screen: number): void {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.composer.setSize(container.clientWidth, container.clientHeight);
    this.bloomPass.resolution = new Three.Vector2(container.clientWidth, container.clientHeight);
    const position = TranslationPosition[screen];
    this.camera.position.set(position.x, position.y, position.z);
  }

  _createRenderer(container) {
    this.renderer = new Three.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.outputColorSpace = Three.SRGBColorSpace;
    this.renderer.toneMapping = Three.NeutralToneMapping;
    this.renderer.toneMappingExposure = 0;

    container.appendChild(this.renderer.domElement);
  }

  _createCamera(container, screen: number) {
    this.camera = new Three.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      1,
      350,
    );
    this.camera.position.setZ(TranslationPosition[screen].z);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(this.camera);
  }

  _createComposer(container) {
    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new Three.Vector2(container.clientWidth, container.clientHeight),
      BloomPassStrength[false],
      0,
      0,
    );

    this.rgbShiftPass = new ShaderPass(RGBShiftShader);
    this.rgbShiftPass.uniforms['amount'].value = 0;
    this.rgbShiftPass.uniforms['angle'].value = -Math.PI / 4.;

    this.glitchPass = new GlitchPass();
    this.glitchPass.goWild = true;
    this.glitchPass.enabled = false;

    this.outputPass = new OutputPass();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.rgbShiftPass);
    this.composer.addPass(this.glitchPass);
    this.composer.addPass(this.outputPass);
  }
}

