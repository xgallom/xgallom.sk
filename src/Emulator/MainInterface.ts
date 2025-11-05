// @ts-nocheck
import type { EmulatorContext } from './Context';
import type { EmulatorUpdateCallback } from './UpdateCallback';

export interface MainInterface {
  constructor(context: EmulatorContext, content: Object): MainInterface;
  deinitialize(): void;
  run(updateCallback: EmulatorUpdateCallback): void;
}

