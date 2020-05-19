import {Main} from './Main';
import type {ProgramUpdateCallback} from './ProgramUpdateCallback';

export interface ProgramInterface {
  constructor(args: Array<string>): ProgramInterface;

  run(linux: Main, updateCallback: ProgramUpdateCallback): void;

  deinitialize(): void;
}

