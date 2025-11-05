// @ts-nocheck
import { Main } from './Main';
import type { ProgramUpdateCallback } from './ProgramUpdateCallback';

export interface ProgramInterface {
  constructor(args: Array<string>);

  run(linux: Main, updateCallback: ProgramUpdateCallback): void;

  deinitialize(): void;
}

