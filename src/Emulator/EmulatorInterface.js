export interface EmulatorInterface {
  constructor(canvas: HTMLCanvasElement): EmulatorInterface;

  run(content: Object): void;
}

