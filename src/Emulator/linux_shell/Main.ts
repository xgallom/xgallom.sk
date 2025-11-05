// @ts-nocheck
import { canvasClear } from '../Context';
import type { EmulatorContext } from '../Context';
import type { Dimensions } from '../Dimensions';
import type { EmulatorEventHandler, EmulatorIntervalHandler } from '../EventHandler';
import { Font } from '../Font';
import type { MainInterface } from '../MainInterface';
import type { EmulatorUpdateCallback } from '../UpdateCallback';
import type { ProgramInterface } from './ProgramInterface';
import type { ProgramCommand } from './ProgramUpdateCallback';
import { ProgramCommandType } from './ProgramUpdateCallback';

const Status = {
  Login: 0,
  Prompt: 1,
};

const AlNum = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
  'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

const Input = [
  ' ', '_', ',', '.', '!', '@', '#', '$', '^', '&', '*', '(', ')', '=', '+', '-', '/', '\\', '~', '|', '[', ']', '{',
  '}', '<', '>', '?'
];

function isAlnum(key: string): boolean {
  return AlNum.indexOf(key) !== -1;
};

function isInput(key: string): boolean {
  return isAlnum(key) || Input.indexOf(key) !== -1;
}

const Properties = [
  'canvasOffset', 'canvasDimensions', 'status', 'cursorStatus', 'cursor', 'user', 'directory', 'inputBuffer',
  'inputPosition', 'textBuffer', 'commandBuffer', 'commandBufferPosition',
];

type StatusType = Status.Login | Status.Prompt;

export class Main implements MainInterface {
  context: EmulatorContext;
  content: Object;
  updateCallback: EmulatorUpdateCallback;

  canvasOffset: Position;
  canvasDimensions: Dimensions;

  status: StatusType;
  cursorStatus: boolean;
  cursor: Position;
  user: string;
  directory: string;

  inputBuffer: string = '';
  inputPosition: number;
  commandBuffer: Array<string>;
  commandBufferPosition: number;
  textBuffer: Array = [];

  state: Array<Main> = [];

  event: Object<EmulatorEventHandler> = {
    keydown: null,
  };

  interval: Object<EmulatorIntervalHandler> = {
    blinkCursor: { duration: 225, handler: null },
  };

  constructor(context: EmulatorContext, content: Object) {
    this.context = context;
    this.content = content;

    this.event.keydown = event => this.keyDown(event);
  }

  deinitialize(): void {
    Object.entries(this.event).forEach(([key, handler]) =>
      document.removeEventListener(key, handler)
    );

    Object.keys(this.interval).forEach(key => {
      clearInterval(this.interval[key].handler);
      this.interval[key].handler = null;
    });
  }

  reinitialize(): void {
    Object.entries(this.event).forEach(([key, handler]) =>
      document.addEventListener(key, handler)
    );

    Object.keys(this.interval).forEach(key => {
      if (this.interval[key].handler)
        clearInterval(this.interval[key].handler);
      this.interval[key].handler = setInterval(() => this[key](), this.interval[key].duration)
    });
  }

  run(updateCallback: EmulatorUpdateCallback): void {
    this.updateCallback = updateCallback;
    this.status = Status.Login;
    this.cursorStatus = false;
    this.user = '';
    this.commandBuffer = [];
    this.commandBufferPosition = 0;
    this.inputPosition = 0;

    this.computeCanvasDimensions();

    this.textBuffer = [
      '%Fg%',
      `${this.content.title} - Arch Linux 5.6.11-arch1-1 (tty1)`,
      '',
      `xgallom.sk login: ${this.user}`,
      '',
      '* no registration required, thanks Linus! *'
    ];

    this.cursor = {
      x: 18 + this.inputPosition,
      y: 3
    };

    this.reinitialize();

    this.render();
  }

  runLogin(): void {
    if (!this.user.length)
      return;

    if (this.user === 'root')
      this.directory = '/root';
    else
      this.directory = `/home/${this.user}`;

    this.status = Status.Prompt;

    this.executeCommand('motd');
  }

  executeCommand(command?: string): void {
    if (!command) {
      command = this.inputBuffer;

      if (command.length)
        this.commandBuffer.push(command);
    }

    const exec = command.split(' ').filter(subString => subString.length > 0);

    if (!exec.length) {
      this.newPrompt();
      this.render();
      return;
    }

    import(`./programs/${exec[0]}/Program.ts`).then(imported => {
      this.inputBuffer = '';
      this.inputPosition = 0;

      this.render();

      let program = new imported.Program(exec);

      program.run(this, command => this.programUpdateCallback(program, command));
    }).catch(error => {
      console.error(error);
      this.textBuffer.push(`zsh: command not found: ${exec[0]}`);

      this.newPrompt();
      this.render();
    });
  }

  programUpdateCallback(program: ProgramInterface, command: ProgramCommand): void {
    switch (command.command) {
      case ProgramCommandType.Return:
        program.deinitialize();

        this.newPrompt();
        this.render();

        break;

      case ProgramCommandType.Exit:
        program.deinitialize();

        this.deinitialize();
        this.run(this.updateCallback);
        break;

      case ProgramCommandType.Suspend:
        this.deinitialize();

        this.state.push(JSON.parse(JSON.stringify(Properties.map(key => [key, this[key]]))));
        break;

      case ProgramCommandType.Restore:
        Object.assign(this, Object.fromEntries(this.state.pop()));

        this.reinitialize();
        break;
    }
  }

  newPrompt(): void {
    this.textBuffer.push('', '');
    this.inputBuffer = '';
    this.inputPosition = 0;

    this.commandBufferPosition = 0;

    this.printPrompt();
  }

  printPrompt(): void {
    let prompt = `%BrightBlue%${this.user}%Fg%@xgallom.sk %White%${this.directory}%Fg% %% ${this.inputBuffer}`;
    if (this.user === 'root')
      prompt = `%BrightRed%${this.user}%Fg%@xgallom.sk %White%${this.directory}%Fg% # ${this.inputBuffer}`;

    this.textBuffer[this.textBuffer.length - 1] = prompt;

    this.cursor = {
      x: this.user.length + 15 + this.directory.length + this.inputPosition,
      y: Math.min(this.textBuffer.length - 1, this.canvasDimensions.height - 1),
    };
  }

  blinkCursor(): void {
    this.cursorStatus = !this.cursorStatus;
    this.render();
  }

  keyDown(event: KeyboardEvent): void {
    switch (this.status) {
      case Status.Login:
        this.loginKeyDown(event);
        break;

      case Status.Prompt:
        this.promptKeyDown(event);
        break;
    }

    return false;
  }

  loginKeyDown(event: KeyboardEvent): void {
    if (this.formattedInput(
      event,
      'user',
      isAlnum,
      () => this.runLogin()
    )) {
      this.textBuffer[3] = `xgallom.sk login: ${this.user}`;
      this.cursor = {
        x: 18 + this.inputPosition,
        y: 3
      };

      this.render();
    }
  }

  promptKeyDown(event: KeyboardEvent): void {
    if (this.formattedInput(
      event,
      'inputBuffer',
      isInput,
      () => this.executeCommand(),
      { buffer: 'commandBuffer', position: 'commandBufferPosition' }
    )) {
      this.printPrompt();
      this.render();
    }
  }

  render(): void {
    canvasClear(this.context.canvasContext);

    const count = Math.min(this.textBuffer.length, this.canvasDimensions.height);

    const messages = this.textBuffer.slice(-count);

    let y = 0;
    for (const message of messages)
      this.drawCharacters(message, 0, y++);

    this.drawCharacters(this.cursorStatus ? '_' : ' ', this.cursor.x, this.cursor.y);
  }

  computeCanvasDimensions(): void {
    this.canvasDimensions = {
      width: (this.context.windowDimensions.width / Font.CharacterDimensions.width) | 0,
      height: (this.context.windowDimensions.height / Font.CharacterDimensions.height) | 0,
    };

    this.canvasOffset = {
      x: Math.round((this.context.windowDimensions.width % Font.CharacterDimensions.width) / 2),
      y: Math.round((this.context.windowDimensions.height % Font.CharacterDimensions.height) / 2) | 0,
    }
  }

  drawCharacters(text: string, column: number, row: number): void {
    let count = 0;

    const subTexts = text.split('%');

    for (let subText of subTexts) {
      if (Font.ColorName.hasOwnProperty(subText))
        this.context.canvasContext.fillStyle = Font.ColorName[subText];
      else {
        if (!subText.length && count > 0 && count < subTexts.length - 1)
          subText = '%';

        this.context.canvasContext.fillText(
          subText,
          this.canvasOffset.x + column * Font.CharacterDimensions.width,
          this.canvasOffset.y + row * Font.CharacterDimensions.height,
        );

        column += subText.length;
      }

      ++count;
    }
  }

  print(...texts: Array<string>): void {
    for (const text of texts) {
      let line = '';
      let lineLength = 0;

      let subTexts = text.split('%');
      for (const subText of subTexts) {
        if (Font.ColorName.hasOwnProperty(subText)) {
          line += '%' + subText + '%';
        }
        else if (lineLength + subText.length >= this.canvasDimensions.width) {
          const splitOffset = this.canvasDimensions.width - lineLength;
          this.textBuffer.push(line + subText.substr(0, splitOffset));

          const nextLine = subText.substr(splitOffset);
          line = nextLine;
          lineLength = nextLine.length;
        }
        else {
          line += subText;
          lineLength += subText.length;
        }
      }

      this.textBuffer.push(line);
    }
  }

  formattedInput(
    event: KeyboardEvent,
    target: string,
    validation: (s: string) => boolean,
    submitCallback: () => void,
    history?: { buffer: string, position: string },
  ): boolean {

    switch (event.key) {
      case 'Enter':
        submitCallback();
        return false;

      case 'ArrowLeft':
        this.inputPosition = Math.max(this.inputPosition - 1, 0);
        break;

      case 'ArrowRight':
        this.inputPosition = Math.min(this.inputPosition + 1, this[target].length);
        break;

      case 'ArrowUp':
        if (history) {
          if (this[history.position] < this[history.buffer].length) {
            ++this[history.position];

            this[target] = this[history.buffer][this[history.buffer].length - this[history.position]];
            this.inputPosition = this[target].length;
          }
        }
        break;

      case 'ArrowDown':
        if (history) {
          if (this[history.position] > 0) {
            if (--this[history.position]) {
              this[target] = this[history.buffer][this[history.buffer].length - this[history.position]];
              this.inputPosition = this[target].length;
            }
            else {
              this[target] = '';
              this.inputPosition = 0;
            }
          }
        }
        break;

      case 'Home':
        this.inputPosition = 0;
        break;

      case 'End':
        this.inputPosition = this[target].length;
        break;

      case 'Backspace':
        event.preventDefault();
        if (this.inputPosition > 0) {
          this[target] = this[target].slice(0, this.inputPosition - 1) + this[target].slice(this.inputPosition);
          --this.inputPosition;
        }
        break;

      case 'Delete':
        if (this.inputPosition < this[target].length)
          this[target] = this[target].slice(0, this.inputPosition) + this[target].slice(this.inputPosition + 1);
        break;

      default:
        if (validation(event.key)) {
          this[target] = this[target].substring(0, this.inputPosition) +
            event.key +
            this[target].substring(this.inputPosition);

          ++this.inputPosition;

          return true;
        }

        return false;
    }

    return true;
  }
}

