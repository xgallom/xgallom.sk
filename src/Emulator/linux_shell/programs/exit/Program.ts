// @ts-nocheck
import { Main } from '../../Main';
import type { ProgramInterface } from '../../ProgramInterface';
import { ProgramCommandType } from '../../ProgramUpdateCallback';
import type { ProgramUpdateCallback } from '../../ProgramUpdateCallback';

export class Program implements ProgramInterface {
  args: Array<string>;

  constructor(args: Array<string>): ProgramInterface {
    this.args = args;
  }

  run(linux: Main, updateCallback: ProgramUpdateCallback): void {
    const argsLength = this.args.length - 1;

    if (argsLength !== 0) {
      linux.textBuffer.push(`Error: Program expects 0 arguments, ${argsLength} supplied`);

      updateCallback({
        command: ProgramCommandType.Return,
        data: -1,
      });
    }
    else {
      updateCallback({
        command: ProgramCommandType.Exit,
        data: 0,
      });
    }
  }

  deinitialize(): void {
  }
}

