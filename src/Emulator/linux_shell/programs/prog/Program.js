import {Main} from '../../Main';
import type {ProgramInterface} from '../../ProgramInterface';
import {ProgramCommandType} from '../../ProgramUpdateCallback';
import type {ProgramUpdateCallback} from '../../ProgramUpdateCallback';

const Prog = [
  'clear', 'exit', 'help', 'man', 'motd', 'prog',
];

export class Program implements ProgramInterface {
  args: Array<string>;

  constructor(args: Array<string>): ProgramInterface {
    this.args = args;
  }

  run(linux: Main, updateCallback: ProgramUpdateCallback): void {
    const argsLength = this.args.length - 1;

    let result;

    if (argsLength !== 0) {
      linux.textBuffer.push(`Error: Program expects 0 arguments, ${argsLength} supplied`);
      result = -1;
    }
    else {
      linux.textBuffer.push(...Prog);
      result = 0;
    }

    updateCallback({
      command: ProgramCommandType.Return,
      data: result,
    });
  }

  deinitialize(): void {
  }
}

