import { AnimationComposer } from './AnimationComposer';

export type InterpolationAnimationResultHandler = (number, Object) => void;
export type InterpolationAnimationCallback = () => void;

export function createInterpolationAnimation(
  duration: number,
  interpolation: Interpolation,
  resultHandler: InterpolationAnimationResultHandler,
  callback?: InterpolationAnimationCallback,
  context: Object,
  oldId?: number,
  animationComposer: AnimationComposer
): number {
  let id: number;
  id = animationComposer.add((delta, context) => {
    context.effectTime += delta;

    const value = Math.min(context.effectTime / context.duration, 1);
    const interpolatedValue = context.interpolation(value);

    context.resultHandler(interpolatedValue, context);

    if (context.effectTime >= duration) {
      animationComposer.remove(id);
      if (context.callback)
        context.callback();
    }
  }, {
    ...context,
    effectTime: 0,
    duration: duration,
    interpolation: interpolation,
    resultHandler: resultHandler,
    callback: callback,
  }, oldId);

  return id;
}

