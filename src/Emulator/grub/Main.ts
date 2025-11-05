// @ts-nocheck
import { canvasClear } from '../Context';
import type { EmulatorContext } from '../Context';
import type { Dimensions } from '../Dimensions';
import type { EmulatorEventHandler } from '../EventHandler';
import { Font } from '../Font';
import type { MainInterface } from '../MainInterface';
import { EmulatorCommandType } from '../UpdateCallback';
import type { EmulatorUpdateCallback } from '../UpdateCallback';
import type { Position } from '../Position';

const GrubDimensions: Dimensions = {
  width: 80,
  height: 25,
};

const GrubPixelDimensions: Dimensions = {
  width: GrubDimensions.width * Font.CharacterDimensions.width,
  height: GrubDimensions.height * Font.CharacterDimensions.height,
};

const GrubMenuOffset: Position = {
  x: 2,
  y: 4,
};

const GrubMenuEnd: Position = {
  x: GrubDimensions.width - 2,
  y: GrubDimensions.height - 8,
};

export class Main implements MainInterface {
  context: EmulatorContext;
  content: Object;
  updateCallback: EmulatorUpdateCallback;

  selected: number;
  selection: Array<Object>;

  canvasOffset: Position;

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
    this.selected = 0;
    this.selection = this.content.entries;

    this.computeCanvasOffset();

    this.initialRender();

    this.render();

    Object.entries(this.event).forEach(([key, handler]) =>
      document.addEventListener(key, handler)
    );
  }

  keyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.selected = (this.selected - 1 + this.selection.length) % this.selection.length;
        break;

      case 'ArrowDown':
        this.selected = (this.selected + 1) % this.selection.length;
        break;

      case 'Enter':
        if (this.selection[this.selected].enabled) {
          this.updateCallback({
            command: EmulatorCommandType.Run,
            data: this.selection[this.selected],
          });
        }
        return;
    }

    this.render();
  }

  render(): void {
    this.context.canvasContext.fillStyle = Font.ColorName.Bg;
    this.drawBackground(GrubMenuOffset.x, GrubMenuOffset.y, GrubMenuEnd.x, GrubMenuEnd.y);
    this.context.canvasContext.fillStyle = Font.ColorName.Fg;

    this.selection.forEach((entry, index) => {
      const y = GrubMenuOffset.y + index;
      let title = ' ' + entry.title;

      if (index === this.selected) {
        this.drawBackground(GrubMenuOffset.x, y, GrubMenuEnd.x, y + 1);
        this.context.canvasContext.fillStyle = Font.ColorName.Bg;
        title = '*' + entry.title;
      }

      this.drawCharacters(title, GrubMenuOffset.x, y);

      this.context.canvasContext.fillStyle = Font.ColorName.Fg;
    });
  }

  initialRender(): void {
    canvasClear(this.context.canvasContext);

    this.context.canvasContext.fillStyle = Font.ColorName.Gray;

    this.centerCharacters(this.content.title, GrubDimensions.width / 2, 1);

    this.drawCharacters('Use the ↑ and ↓ keys to select which entry is highlighted.',
      6, GrubDimensions.height - 6
    );
    this.drawCharacters('Press enter to boot the selected OS, `e\' to edit the commands',
      6, GrubDimensions.height - 5
    );
    this.drawCharacters('before booting or `c\' for a command-line.',
      6, GrubDimensions.height - 4
    );

    this.renderRectangle(
      GrubMenuOffset.x - 1, GrubMenuOffset.y - 1,
      GrubMenuEnd.x + 1, GrubMenuEnd.y + 1
    );
  }

  computeCanvasOffset(): void {
    const windowPixelOffset = {
      width: ((this.context.windowDimensions.width % Font.CharacterDimensions.width) / 2) | 0,
      height: ((this.context.windowDimensions.height % Font.CharacterDimensions.height) / 2) | 0,
    };

    const windowCharacterDimensions = {
      width: (this.context.windowDimensions.width / Font.CharacterDimensions.width) | 0,
      height: (this.context.windowDimensions.height / Font.CharacterDimensions.height) | 0,
    };

    this.canvasOffset = {
      x: windowPixelOffset.width +
        (Math.round((windowCharacterDimensions.width - GrubDimensions.width) / 2) * Font.CharacterDimensions.width) | 0,
      y: windowPixelOffset.height +
        (Math.round((windowCharacterDimensions.height - GrubDimensions.height) / 2) * Font.CharacterDimensions.height) | 0,
    };
  }

  centerCharacters(text: string, column: number, row: number): void {
    const leftColumn = (column - Math.round(text.length / 2)) | 0;

    this.drawCharacters(text, leftColumn, row);
  }

  drawCharacters(text: string, column: number, row: number): void {
    this.context.canvasContext.fillText(
      text,
      this.canvasOffset.x + column * Font.CharacterDimensions.width,
      this.canvasOffset.y + row * Font.CharacterDimensions.height
    );
  }

  renderRectangle(x: number, y: number, xEnd: number, yEnd: number): void {
    const dimensions = {
      width: xEnd - x,
      height: yEnd - y,
    };

    this.drawCharacters('┌' + '─'.repeat(dimensions.width - 2) + '┐', x, y);

    const loopEnd = yEnd - 1;
    while (++y < loopEnd)
      this.drawCharacters('│' + ' '.repeat(dimensions.width - 2) + '│', x, y);

    this.drawCharacters('└' + '─'.repeat(dimensions.width - 2) + '┘', x, y);
  }

  drawBackground(x: number, y: number, xEnd: number, yEnd: number): void {
    this.context.canvasContext.fillRect(
      this.canvasOffset.x + x * Font.CharacterDimensions.width,
      this.canvasOffset.y + y * Font.CharacterDimensions.height,
      (xEnd - x) * Font.CharacterDimensions.width,
      (yEnd - y) * Font.CharacterDimensions.height
    );
  }
}

