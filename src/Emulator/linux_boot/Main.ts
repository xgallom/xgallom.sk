import { canvasClear } from '../Context';
import type { EmulatorContext } from '../Context';
import type { Dimensions } from '../Dimensions';
import { Font } from '../Font';
import type { MainInterface } from '../MainInterface';
import { EmulatorCommandType } from '../UpdateCallback';
import type { EmulatorUpdateCallback } from '../UpdateCallback';
import { BootMessages } from './BootMessages';

export class Main implements MainInterface {
  context: EmulatorContext;
  content: Object;
  updateCallback: EmulatorUpdateCallback;

  canvasDimensions: Dimensions;
  messageIndex: number = 0;
  messageBuffer: Array = [];

  constructor(context: EmulatorContext, content: Object) {
    this.context = context;
    this.content = content;
  }

  deinitialize(): void {
  }

  run(updateCallback: EmulatorUpdateCallback): void {
    if (this.content.skipBoot) {
      updateCallback({
        command: EmulatorCommandType.Run,
        data: this.content.system,
      });
    }
    else {
      this.updateCallback = updateCallback;

      this.computeCanvasDimensions();

      this.initialRender();
    }
  }

  initialRender(): void {
    canvasClear(this.context.canvasContext);

    this.drawCharacters('Booting a command list', 3, 1);
    this.drawCharacters(`Loading Linux "${this.content.title}" ...`, 1, 3);
    this.drawCharacters('Loading initial ramdisk ...', 1, 4);

    setTimeout(() => this.addMessage(), 2000);
  }

  addMessage(): void {
    while (true) {
      if (this.messageIndex === BootMessages.length) {
        this.render();

        this.updateCallback({
          command: EmulatorCommandType.Run,
          data: this.content.system,
        });
        return;
      }
      else {
        const message = BootMessages[this.messageIndex++];

        this.addMessageToBuffer(message.message);

        if (message.duration) {
          setTimeout(() => this.addMessage(), message.duration / this.content.bootSpeed);
          break;
        }
      }
    }

    this.render();
  }

  addMessageToBuffer(message: string): void {
    let line = '';
    let lineLength = 0;

    for (const subMessage of message.split('%')) {
      if (Font.ColorName.hasOwnProperty(subMessage)) {
        line += '%' + subMessage + '%';
      }
      else if (lineLength + subMessage.length >= this.canvasDimensions.width) {
        const splitOffset = this.canvasDimensions.width - lineLength;
        this.messageBuffer.push(line + subMessage.substr(0, splitOffset));

        const nextLine = subMessage.substr(splitOffset);
        line = nextLine;
        lineLength = nextLine.length;
      }
      else {
        line += subMessage;
        lineLength += subMessage.length;
      }
    }

    this.messageBuffer.push(line);
  }

  render(): void {
    canvasClear(this.context.canvasContext);

    const count = Math.min(this.messageBuffer.length, this.canvasDimensions.height);

    const messages = this.messageBuffer.slice(-count);

    let y = 0;
    for (const message of messages)
      this.drawCharacters(message, 0, y++);
  }

  computeCanvasDimensions(): void {
    this.canvasDimensions = {
      width: (this.context.windowDimensions.width / Font.CharacterDimensions.width) | 0,
      height: (this.context.windowDimensions.height / Font.CharacterDimensions.height) | 0,
    };
  }

  drawCharacters(text: string, column: number, row: number): void {
    for (const subText of text.split('%')) {
      if (Font.ColorName.hasOwnProperty(subText))
        this.context.canvasContext.fillStyle = Font.ColorName[subText];
      else {
        this.context.canvasContext.fillText(
          subText,
          column * Font.CharacterDimensions.width,
          row * Font.CharacterDimensions.height,
        );

        column += subText.length;
      }
    }
  }
}
