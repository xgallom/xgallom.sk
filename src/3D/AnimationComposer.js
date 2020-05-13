import * as Three from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';

export type AnimationContext = ?Object;
export type AnimationPass = (number, ?Object) => void;

export class AnimationComposer {
  _clock: Three.Clock = new Three.Clock();
  _composer: EffectComposer;

  _passes: Array<AnimationPass> = [];
  _contexts: Array<AnimationContext> = [];

  _lastId: number = 0;
  _animationFrameId: ?number = null;

  constructor(composer: EffectComposer) {
    this._composer = composer;
  }

  destroy(): void {
    this.stop();
    this._clock = this._composer = null;
    this._lastId = 0;
  }

  animate(): void {
    this.stop();
    this._animationFrameId = requestAnimationFrame(() => this._animate());
  }

  stop(): void {
    if (this._animationFrameId !== null)
      cancelAnimationFrame(this._animationFrameId);

    this._animationFrameId = null;
  }

  add(pass: AnimationPass, context: ?Object = null, id: ?number = null): number {
    if (id === null)
      id = this._lastId++;

    this._passes[id] = pass;
    this._contexts[id] = context;

    return id;
  }

  remove(id: number) {
    delete this._passes[id];
    delete this._contexts[id];

    return null;
  }

  context(id: number): void {
    return this._contexts[id];
  }

  _animate() {
    this._animationFrameId = requestAnimationFrame(() => this._animate());

    const delta = this._clock.getDelta();

    this._passes.forEach((pass, id) => pass(delta, this._contexts[id]));
    this._composer.render(delta);
  }
}
