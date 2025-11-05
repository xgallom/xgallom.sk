// @ts-nocheck
import * as Three from 'three';

export type Interpolation = (number) => number;

export const CubicBezier = (x1, y1, x2, y2): Interpolation => t => {
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

export const Ease = CubicBezier(0.25, 0.1, 0.25, 1);
export const InvertEase = t => (1 - Ease(t));

