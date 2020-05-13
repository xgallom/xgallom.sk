import * as Three from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {AnimationComposer} from './AnimationComposer';
import {Ease} from './Interpolation';
import type {Interpolation} from './Interpolation';
import type {InterpolationAnimationCallback} from './InterpolationAnimation';
import {createInterpolationAnimation} from './InterpolationAnimation';
import {XosLogo} from './XosLogo';

type Translation = { x: number, y: number, z: number };

export const TimeToFadeIn = 4;
export const TimeToFadeOut = 2;
export const Exposure = 1;
export const TimeToRotateIn = 2.5;
export const RotationSpeed = 12.5;
export const TimeToReady = Math.max(TimeToFadeIn, TimeToRotateIn);

export const TimeToTranslate = 2;
export const TranslationPosition = {
  x: 0,
  y: 8,
  z: 0,
};

export class Index {
  animationComposer: AnimationComposer;
  camera: Three.PerspectiveCamera;
  composer: EffectComposer;
  renderer: Three.WebGLRenderer;
  scene: Three.Scene;
  logo: Three.Group;

  _fade: ?number = null;
  _rotateIn: ?number = null;
  _translate: ?number = null;
  _rotation: number;


  constructor(container: Element, callback: ?InterpolationAnimationCallback = null) {
    this._createRenderer(container);

    this.scene = new Three.Scene();

    this._createCamera(container);
    this._createComposer(container);

    this.logo = XosLogo();
    this.scene.add(this.logo);

    this.animationComposer = new AnimationComposer(this.composer);

    this._rotation = this.animationComposer.add((delta, context) => {
      this.logo.rotateY(delta * context.rotationSpeed / (2 * Math.PI));
    }, {rotationSpeed: 0});

    this.rotateIn();
    this.fade(TimeToFadeIn, Ease, () => {
      this.translate();

      if (callback)
        callback();
    });

    this.animationComposer.animate();
  }

  destroy() {
    this.animationComposer.destroy();
    Object.keys(this).map(key => delete this[key]);
  }

  fade(
    timeToFadeIn: number = TimeToFadeIn,
    interpolation: Interpolation = Ease,
    callback: ?InterpolationAnimationCallback = null
  ): void {
    this._fade = createInterpolationAnimation(
      timeToFadeIn,
      interpolation,
      (interpolatedValue, context) =>
        this.renderer.toneMappingExposure = Exposure * interpolatedValue,
      () => {
        this._fade = null;
        if (callback) callback();
      },
      {},
      this._fade,
      this.animationComposer
    );
  }

  rotateIn(
    rotationSpeed: number = RotationSpeed,
    timeToRotateIn: number = TimeToRotateIn,
    interpolation: Interpolation = Ease,
    callback: ?InterpolationAnimationCallback = null
  ) {
    this._rotateIn = createInterpolationAnimation(
      timeToRotateIn,
      interpolation,
      (interpolatedValue, context) =>
        this.animationComposer.context(this._rotation).rotationSpeed = context.rotationSpeed * interpolatedValue,
      () => {
        this._rotateIn = null;
        if (callback) callback();
      },
      {rotationSpeed: rotationSpeed},
      this._rotateIn,
      this.animationComposer
    );
  }

  translate(
    translation: Translation = TranslationPosition,
    timeToTranslate: number = TimeToTranslate,
    interpolation: Interpolation = Ease,
    callback: ?InterpolationAnimationCallback = null
  ) {
    this._translate = createInterpolationAnimation(
      timeToTranslate,
      interpolation,
      (interpolatedValue, context) => {
        this.camera.position.set(
          context.translation.x * interpolatedValue,
          context.translation.y * interpolatedValue,
          -200 + context.translation.z * interpolatedValue
        )},
      () => {
        this._translate = null;
        if (callback) callback();
      },
      {translation: translation},
      this._translate,
      this.animationComposer
    );
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

