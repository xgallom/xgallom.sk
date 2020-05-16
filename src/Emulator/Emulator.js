import {canvasClear} from './Context';
import type {EmulatorContext} from './Context';
import type {EmulatorInterface} from './EmulatorInterface';
import {Font} from './Font';
import type {MainInterface} from './MainInterface';
import {EmulatorCommandType} from './UpdateCallback';
import type {EmulatorCommand} from './UpdateCallback';

let Main: Object<Class<MainInterface>> = {

};

export class Emulator implements EmulatorInterface {
  context: EmulatorContext = {};
  content: ?MainInterface = null;

  constructor(canvas: HTMLCanvasElement) {
    this.context.canvas = canvas;

    this.context.windowDimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.context.canvas.width = this.context.windowDimensions.width;
    this.context.canvas.height = this.context.windowDimensions.height;

    this.context.canvasContext = this.context.canvas.getContext('2d', {alpha: false});

    canvasClear(this.context.canvasContext);

    this.context.canvasContext.textBaseline = 'top';
    this.context.canvasContext.textAlign = 'left';
    this.context.canvasContext.font = Font.Font;
    this.context.canvasContext.fillStyle = Font.ColorName.Fg;
  }

  run(content: Object): void {
    if(!Main.hasOwnProperty(content.type))
      this.load(content.type, () => this.run(content));
    else {
      if(this.content)
        this.content.deinitialize();

      this.content = new Main[content.type](this.context, content);

      this.content.run(command => this.update(command));
    }
  }

  load(contentType: string, callback: ?() => void = null): void {
    import(`./${contentType}/Main`).then((imported: {Main: Class<MainInterface>}): void => {
      Main[contentType] = imported.Main;

      if(callback)
        callback();
    });
  }

  update(command: EmulatorCommand): void {
    switch (command.command) {
      case EmulatorCommandType.Run:
        this.run(command.data);
        break;

      default:
        console.warn('Unhandled command: ', command);
        break;
    }
  }
}

