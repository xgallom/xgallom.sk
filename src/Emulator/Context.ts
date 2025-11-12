import type { Dimensions } from './Dimensions';
import { Font } from './Font';

export function canvasClear(context: CanvasRenderingContext2D) {
  const fill = context.fillStyle;
  context.fillStyle = Font.ColorName.Bg;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = fill;
}

export type EmulatorContext = {
  windowDimensions: Dimensions;
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
};

