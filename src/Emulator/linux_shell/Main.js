import {canvasClear} from '../Context';
import type {EmulatorContext} from '../Context';
import type {Dimensions} from '../Dimensions';
import type {EmulatorEventHandler} from '../EventHandler';
import {Font} from '../Font';
import type {MainInterface} from '../MainInterface';
import type {EmulatorUpdateCallback} from '../UpdateCallback';

const Status = {
  Login: 0,
  Prompt: 1,
};

const AlNum = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
  'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
  'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

function isAlnum(key: string): boolean {
  return AlNum.indexOf(key) !== -1;
};

type StatusType = Status.Login | Status.Prompt;

export class Main implements MainInterface {
  context: EmulatorContext;
  content: Object;
  updateCallback: EmulatorUpdateCallback;
  cursorHandler: null;

  canvasOffset: Position;
  canvasDimensions: Dimensions;

  status: StatusType;
  cursorStatus: boolean;
  cursor: Position;
  user: string;

  textBuffer: Array = [];

  event: Object<EmulatorEventHandler> = {
    keydown: null,
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
  }

  run(updateCallback: EmulatorUpdateCallback): void {
    this.updateCallback = updateCallback;
    this.status = Status.Login;
    this.cursorStatus = false;
    this.user = '';

    this.computeCanvasDimensions();

    this.initialRender();

    Object.entries(this.event).forEach(([key, handler]) =>
      document.addEventListener(key, handler)
    );

    this.cursorHandler = setInterval(() => this.blinkCursor(), 200);
  }

  initialRender(): void {
    this.loginRender();
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
        break;
    }
  }

  loginKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        this.status = Status.Prompt;
        this.promptRender();
        return;

      case 'Backspace':
        this.user = this.user.slice(0, -1);
        break;

      default:
        if(isAlnum(event.key))
          this.user += event.key;
        break;

    }

    this.loginRender();
  }

  render(): void {
    switch(this.status) {
      case Status.Login:
        this.loginRender();
        break;

      case Status.Prompt:
        break;
    }
  }

  loginRender(): void {
    canvasClear(this.context.canvasContext);

    this.drawCharacters(`${this.content.title} - Arch Linux 5.6.11-arch1-1`, 0, 1);

    this.drawCharacters(`xgallom.sk login: ${this.user}`, 0, 3);

    this.drawCharacters('*no registration required, thanks Linus!*', 0, 5);

    this.cursor = {
      x: 18 + this.user.length,
      y: 3
    };

    if(this.cursorStatus)
      this.drawCharacters('_', this.cursor.x, this.cursor.y);
  }

  promptRender(): void {

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
    for (const subText of text.split('%')) {
      if (Font.ColorName.hasOwnProperty(subText))
        this.context.canvasContext.fillStyle = Font.ColorName[subText];
      else {
        this.context.canvasContext.fillText(
          subText,
          this.canvasOffset.x + column * Font.CharacterDimensions.width,
          this.canvasOffset.y + row * Font.CharacterDimensions.height,
        );

        column += subText.length;
      }
    }
  }
}

