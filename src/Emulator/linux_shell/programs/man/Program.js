import {canvasClear} from '../../../Context';
import type {Dimensions} from '../../../Dimensions';
import type {EmulatorEventHandler} from '../../../EventHandler';
import {Font} from '../../../Font';
import {Main} from '../../Main';
import type {ProgramInterface} from '../../ProgramInterface';
import {ProgramCommandType} from '../../ProgramUpdateCallback';
import type {ProgramUpdateCallback} from '../../ProgramUpdateCallback';

export class Program implements ProgramInterface {
  args: Array<string>;
  pageName: string;
  page: Object;
  sectionNumber: number;
  section: Object;
  contentBuffer: Array<string> = [];
  contentBufferPosition: number;
  contentDimensions: Dimensions;

  updateCallback: ProgramUpdateCallback;
  running: boolean = false;
  linux: Main;

  event: Object<EmulatorEventHandler> = {
    keydown: null,
  };

  constructor(args: Array<string>): ProgramInterface {
    this.args = args;

    this.event.keydown = event => this.keyDown(event);
  }

  run(linux: Main, updateCallback: ProgramUpdateCallback): void {
    const argsLength = this.args.length - 1;
    const pages = linux.content.manPages;
    this.sectionNumber = 1;

    switch (argsLength) {
      case 2:
        this.sectionNumber = this.args[1];
        this.pageName = this.args[2];
        break;

      case 1:
        const pageArg = this.args[1].split('.');

        if (pageArg.length > 2) {
          linux.print('Incorrect page name, more than one separator used.');
          updateCallback({
            command: ProgramCommandType.Return,
            data: -1
          });

          return;
        }

        this.pageName = pageArg[0];

        if (pageArg.length === 2)
          this.sectionNumber = pageArg[1];
        break;

      default:
        linux.print(
          'What manual page do you want?',
          'For example, try %BrightBlue%man man%Fg%.',
          '',
          'List of manual entries:',
          ...pages.map(manPage => manPage.name)
        );

        updateCallback({
          command: ProgramCommandType.Return,
          data: -1,
        });

        return;
    }

    this.page = pages.find(page => page.name === this.pageName);

    if (!this.page) {
      linux.print(`No manual entry for ${this.pageName}`);

      updateCallback({
        command: ProgramCommandType.Return,
        data: -1,
      });

      return;
    }

    this.section = this.page.sections[this.sectionNumber - 1];

    if (!this.section) {
      linux.print(`No manual entry for ${this.pageName} in section ${this.sectionNumber}`);

      updateCallback({
        command: ProgramCommandType.Return,
        data: -1,
      });

      return;
    }

    this.updateCallback = updateCallback;
    this.linux = linux;
    this.contentDimensions = {
      width: Math.min(linux.canvasDimensions.width, 120),
      height: linux.canvasDimensions.height - 1
    };

    this.prepareContentBuffer();

    this.initialize();
  }

  initialize(): void {
    this.running = true;

    this.updateCallback({
      command: ProgramCommandType.Suspend
    });

    Object.entries(this.event).forEach(([key, handler]) =>
      document.addEventListener(key, handler)
    );

    this.linux.textBuffer = [];
    this.linux.cursorStatus = false;

    this.render();
  }

  deinitialize(): void {
    if (this.running) {
      Object.entries(this.event).forEach(([key, handler]) =>
        document.removeEventListener(key, handler)
      );

      this.updateCallback({
        command: ProgramCommandType.Restore
      });

      this.running = false;
    }
  }

  keyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        this.contentBufferPosition = Math.max(
          Math.min(this.contentBufferPosition + 1, this.contentBuffer.length - this.contentDimensions.height),
          0
        );
        break;

      case 'ArrowUp':
        this.contentBufferPosition = Math.max(this.contentBufferPosition - 1, 0);
        break;

      case 'PageDown':
        this.contentBufferPosition = Math.max(
          Math.min(
            this.contentBufferPosition + this.contentDimensions.height,
            this.contentBuffer.length - this.contentDimensions.height
          ),
          0
        );
        break;

      case 'PageUp':
        this.contentBufferPosition = Math.max(this.contentBufferPosition - this.contentDimensions.height, 0);
        break;

      case 'Home':
        this.contentBufferPosition = 0;
        break;

      case 'End':
        this.contentBufferPosition = Math.max(
          this.contentBuffer.length - this.contentDimensions.height,
          0
        );
        break;

      case 'q':
        this.updateCallback({
          command: ProgramCommandType.Return,
          data: 0
        });
        return;
    }

    this.render();
  }

  render(): void {
    canvasClear(this.linux.context.canvasContext);

    const count = Math.min(this.contentBuffer.length, this.linux.canvasDimensions.height - 1);

    this.linux.textBuffer = this.contentBuffer.slice(this.contentBufferPosition, this.contentBufferPosition + count);

    this.linux.render();

    const fill = this.linux.context.canvasContext.fillStyle;
    const text = ` Manual page ${this.pageName}(${this.sectionNumber}) line ${this.contentBufferPosition + 1} / ${this.contentBuffer.length} (press q to quit)`;

    this.linux.context.canvasContext.fillStyle = Font.ColorName.Blue;
    this.linux.context.canvasContext.fillRect(
      0,
      this.contentDimensions.height * Font.CharacterDimensions.height,
      text.length * Font.CharacterDimensions.width,
      Font.CharacterDimensions.height
    );

    this.linux.context.canvasContext.fillStyle = Font.ColorName.Yellow;
    this.linux.context.canvasContext.fillText(
      text,
      0,
      this.contentDimensions.height * Font.CharacterDimensions.height,
    );

    this.linux.context.canvasContext.fillStyle = fill;
  }

  prepareContentBuffer(): void {
    this.contentBufferPosition = 0;

    const headerSide = `${this.pageName}(${this.sectionNumber})`;
    const offset = ' '.repeat(
      ((this.linux.canvasDimensions.width - this.section.title.length - 2 * headerSide.length) / 2) | 0
    );

    this.contentBuffer = [
      '%White%' + headerSide + offset + this.section.title + offset + headerSide,
      '',
    ];

    this.section.content.forEach(content => this.addContent(content));
  }

  addContent(content: Object, depth: number = 0): void {
    const offset = ' '.repeat(8 * depth);

    switch (content.type) {
      case 'section':
        this.contentBuffer.push(offset + `%BrightRed%${content.title}%White%`);

        for (const subContent of content.content)
          this.addContent(subContent, depth + 1);

        break;

      case 'paragraph':
        this.addLine(depth, ...content.content.map(line => offset + line), '');
        break;

      case 'text_image':
        const length = content.content[0].length;

        const textImageOffset = ' '.repeat(((this.contentDimensions.width - length) / 2) | 0);

        this.contentBuffer.push('', ...content.content.map(line => textImageOffset + line), '', '');
        break;

      case 'list':
        for (const entry of content.content) {
          this.contentBuffer.push(offset + entry.entry);

          for (const subEntry of entry.content)
            this.addContent(subEntry, depth + 1);
        }

        break;

      default:
        console.warn('Unhandled content type: ', console.log(content));
        break;
    }
  }

  addLine(depth: number, ...texts: Array<string>) {
    const offset = ' '.repeat(8 * depth);

    for (const text of texts) {
      let line = offset;
      let lineLength = offset.length;

      let subTexts = text.split('%');
      for (const subText of subTexts) {
        if (Font.ColorName.hasOwnProperty(subText)) {
          line += '%' + subText + '%';
        }
        else {
          let count = 0;

          for (const word of subText.split(' ')) {
            if (!word.length)
              continue;

            if (lineLength + word.length >= this.contentDimensions.width) {
              this.contentBuffer.push(line);

              line = offset + word + ' ';
              lineLength = line.length;
            }
            else {
              line += word + ' ';
              lineLength += word.length + 1;
            }

            ++count;
          }
        }
      }

      this.contentBuffer.push(line);
    }
  }
}

